/* ============================================================
   IN C · ensayo individual
   Orquesta de Laptops UC (OLUC) · IEE2003

   Una laptop sola, sin red (también abriendo index.html con doble clic):
   los demás intérpretes están simulados y tocan con el mismo motor de
   sonido de la página (voz, PATRONES, bpm), cada uno con su timbre, su
   octava y su lugar en el estéreo. La maestra también está simulada y te
   cede todo: reloj, guía, anulación manual y paleta funcionan desde el
   panel igual que en el concierto, y el mapa muestra a los simulados.

   Se carga después de conjunto.js. Si falta este archivo, la obra
   funciona igual, solo que sin el botón «ensayar».

   Cómo deciden los simulados (las instrucciones de Riley):
   · entran de a poco en el 1 cuando se inicia el reloj; el pulso primero;
   · avanzan en orden, sin saltarse patrones, y cambian solo al terminar
     una vuelta del patrón;
   · cada uno repite su patrón el tiempo que quiera: su "paciencia" (entre
     25 y 55 s), o lo que dura el patrón en la guía si está encendida;
   · no se alejan más de 2 patrones de la referencia: la anulación manual,
     si no la guía, si no la mediana de los demás (tú incluido). El que va
     atrás se apura; el que va adelante espera;
   · de vez en cuando descansan unos segundos y vuelven a entrar;
   · tocan sobre una misma grilla de semicorcheas al tempo de la página,
     con una pequeña imprecisión de entrada propia de cada uno;
   · en el 53 esperan al conjunto y salen de a uno; el pulso sale al final.
   ============================================================ */
(function () {
"use strict";

const API = window.InCConjunto;
if (!API) return;

const $ = id => document.getElementById(id);
const K = "oluc.inc.";
const ls = {
  get(k) { try { return localStorage.getItem(K + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(K + k, v); } catch (e) { } },
};
const NMAX = 20;
const LETRAS = "ABCDEFGHIJKLMNOPQRST";
const TIMBRES = ["marimba", "pluck", "organo", "campana", "cuerda"];
const OCTAVAS = [0, -1, 0, 0, -1, 1, 0];
const azar = (a, b) => a + Math.random() * (b - a);
const leerYo = () => {
  try { return { patron: iPat + 1, sonando: !!sonando, pulso: !!pulso }; }   /* globales de index.html */
  catch (e) { return { patron: 1, sonando: false, pulso: false }; }
};

/* ============================================================
   La maestra simulada: hace lo mismo que el Servidor In C
   ============================================================ */
const reloj = { estado: "espera", base: 0, t0: 0 };
const msReloj = () => reloj.estado === "corriendo" ? reloj.base + performance.now() - reloj.t0 : reloj.base;
const corre = () => reloj.estado === "corriendo";
let manual = null, paleta = null, guia = { modo: "apagada", segundos: 45, minutos: 45 };
let yo = null, entrante = null;
const mandar = m => { if (entrante) entrante(m); };
const mandarReloj = () => mandar({ t: "reloj", estado: reloj.estado, ms: msReloj() });

const srv = {
  conectar(fn) { entrante = fn; },
  recibir(m) {
    switch (m.t) {
      case "hola":
        yo = { id: m.id, nombre: m.nombre || "tú" };
        mandar({ t: "bienvenida", version: 1, control: true, direcciones: [] });
        mandarReloj(); mandar({ t: "guia", guia }); mandar({ t: "paleta", paleta }); mandarTabla();
        break;
      case "nombre": if (yo && m.nombre) yo.nombre = String(m.nombre).slice(0, 24); mandarTabla(); break;
      case "reloj": accionReloj(m.accion); break;
      case "manual":
        manual = m.patron == null ? null : Math.max(1, Math.min(53, Math.round(+m.patron) || 1));
        mandarTabla(); break;
      case "paleta":
        paleta = m.paleta && Array.isArray(m.paleta.colores) && m.paleta.colores.length >= 2 ? m.paleta : null;
        mandar({ t: "paleta", paleta }); break;
      case "guia": {
        const g = m.guia || {};
        guia = { modo: ["apagada", "fija", "largo"].includes(g.modo) ? g.modo : "apagada",
                 segundos: Math.max(10, Math.min(300, Math.round(+g.segundos) || 45)),
                 minutos: Math.max(10, Math.min(180, Math.round(+g.minutos) || 45)) };
        mandar({ t: "guia", guia }); break;
      }
      /* estado: el panel ya lee tu patrón en vivo; olvidar y apagar no aplican */
    }
  },
};

function mandarTabla() {
  if (!yo) return;
  const y = leerYo();
  const filas = [{ id: yo.id, nombre: yo.nombre, patron: y.patron, sonando: y.sonando, pulso: y.pulso, conectado: true }];
  for (const b of bots) filas.push({ id: b.id, nombre: b.nombre, patron: b.pat, sonando: b.estado === "toca", pulso: false, conectado: true });
  if (pulsoBot) filas.push({ id: pulsoBot.id, nombre: pulsoBot.nombre, patron: 1, sonando: pulsoBot.sonando, pulso: true, conectado: true });
  mandar({ t: "tabla", manual, interpretes: filas });
}

function accionReloj(a) {
  const ahora = performance.now(), ms = msReloj();
  if (a === "iniciar" && reloj.estado !== "corriendo") {
    const desdeCero = reloj.estado === "espera";
    Object.assign(reloj, { estado: "corriendo", base: ms, t0: ahora });
    escalonar(desdeCero);
  } else if (a === "detener" && reloj.estado === "corriendo") {
    Object.assign(reloj, { estado: "detenido", base: ms });
    callarTodos();                         /* pausa del ensayo: callan de inmediato y conservan su patrón */
  } else if (a === "reiniciar") {
    Object.assign(reloj, { estado: "espera", base: 0 });
    reiniciarBots();
  }
  mandarReloj(); mandarTabla();
}

/* ---------- guía: la misma cuenta que conjunto.js ---------- */
let largos = null;
function tramos() {                                  /* segundos de cada patrón en la guía */
  if (guia.modo === "fija") return new Array(53).fill(guia.segundos);
  if (!largos) largos = PATRONES.map(p => p.reduce((a, e) => a + e[1], 0));
  const w = largos.map(l => Math.sqrt(Math.max(0.5, l))), sw = w.reduce((a, b) => a + b, 0);
  return w.map(x => x / sw * guia.minutos * 60);
}
function patronGuia() {
  if (guia.modo === "apagada" || reloj.estado === "espera") return null;
  const t = msReloj() / 1000, d = tramos();
  let acc = 0;
  for (let i = 0; i < 53; i++) { if (t < acc + d[i]) return i + 1; acc += d[i]; }
  return 53;
}

/* ============================================================
   Los intérpretes simulados
   ============================================================ */
let bots = [], pulsoBot = null;
let bus = null;                    /* salida de los simulados, con su propio compresor: no te aplastan a ti */
let tocan = true, conPulso = ls.get("ensayoPulso") !== "0";
let kTick = 0, tTick = 0;          /* grilla común de semicorcheas (ticks) en el reloj de audio */

function armarBus() {
  if (bus) return;
  const c = ctx.createDynamicsCompressor();
  c.threshold.value = -12; c.knee.value = 10; c.ratio.value = 8; c.attack.value = .003; c.release.value = .25;
  bus = ctx.createGain(); bus.gain.value = volDemas();
  bus.connect(c); c.connect(ctx.destination);
}
const volDemas = () => { const v = +(ls.get("ensayoVol") || 70); return Math.pow(v / 100, 1.5) * 1.1; };

function nuevaSalida(pan) {
  const g = ctx.createGain();
  if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(bus); g._pan = p; }
  else g.connect(bus);
  return g;
}
function soltarSalida(g) { try { g.disconnect(); if (g._pan) g._pan.disconnect(); } catch (e) { } }

function nuevoBot(i) {
  return {
    id: "sim-" + LETRAS[i], nombre: "sim " + LETRAS[i],
    timbre: TIMBRES[i % TIMBRES.length], oct: OCTAVAS[i % OCTAVAS.length],
    gate: azar(.7, .95), vel: azar(.8, 1), desfase: azar(-.012, .012),
    paciencia: azar(25, 55),
    pat: 1, iEv: 0, kSig: 0, reps: 0, tPat: 0, D: 0,
    estado: "espera", tEntrada: Infinity, tVuelve: 0,
    salida: nuevaSalida(0),
  };
}
function nuevoPulso() {
  return { id: "sim-pulso", nombre: "sim pulso", desfase: azar(-.006, .006), kSig: kTick + (kTick & 1),
           sonando: false, tEntrada: Infinity, fin: false, tFin: 0, salida: nuevaSalida(.15) };
}

/* paneo repartido y nivel según cuántos hay */
function repartir() {
  const n = bots.length, g = .9 / Math.sqrt(Math.max(1, n));
  bots.forEach((b, i) => {
    b.salida.gain.value = g;
    /* razón áurea: vecinos de letra quedan lejos en el estéreo y nadie repite lugar */
    if (b.salida._pan) b.salida._pan.pan.value = n > 1 ? -.85 + 1.7 * ((i * 0.6180339887 + .5) % 1) : 0;
  });
  if (pulsoBot) pulsoBot.salida.gain.value = .8;
}

function ajustarBots(n) {
  n = Math.max(0, Math.min(NMAX, n | 0));
  while (bots.length > n) soltarSalida(bots.pop().salida);
  while (bots.length < n) {
    const b = nuevoBot(bots.length);
    if (reloj.estado !== "espera") {         /* llega tarde: entra donde está el conjunto */
      b.pat = Math.max(1, Math.min(53, Math.round(referencia(null))));
      if (corre() && tocan) b.tEntrada = ctx.currentTime + azar(.5, 4);
    }
    bots.push(b);
  }
  if (conPulso && !pulsoBot) {
    pulsoBot = nuevoPulso();
    if (corre() && tocan) pulsoBot.tEntrada = ctx.currentTime + .1;
  } else if (!conPulso && pulsoBot) { soltarSalida(pulsoBot.salida); pulsoBot = null; }
  repartir(); mandarTabla();
}

/* entrada escalonada: al empezar, el pulso primero y los demás de a uno */
function escalonar(desdeCero) {
  const t = ctx.currentTime;
  const orden = bots.slice().sort(() => Math.random() - .5);
  orden.forEach((b, i) => {
    if (b.estado === "fin") return;
    b.tEntrada = desdeCero ? t + 2 + i * azar(1.5, 3) : t + azar(0, 2.5);
  });
  if (pulsoBot) pulsoBot.tEntrada = t + .1;
}
function callarTodos() {
  for (const b of bots) if (b.estado !== "fin") { b.estado = "espera"; b.tEntrada = Infinity; }
  if (pulsoBot) pulsoBot.tEntrada = Infinity;
}
function reiniciarBots() {
  for (const b of bots) Object.assign(b, { pat: 1, iEv: 0, reps: 0, tPat: 0, estado: "espera", tEntrada: Infinity });
  if (pulsoBot) Object.assign(pulsoBot, { tEntrada: Infinity, fin: false, tFin: 0 });
}

/* referencia: anulación manual, si no la guía, si no la mediana de los demás (tú incluido) */
function referencia(excluir) {
  if (manual) return manual;
  const g = patronGuia(); if (g) return g;
  const v = bots.filter(b => b !== excluir).map(b => b.pat);
  const y = leerYo(); if (!y.pulso) v.push(y.patron);
  if (!v.length) return excluir ? excluir.pat : 1;
  v.sort((a, b) => a - b);
  const n = v.length;
  return (v[(n - 1) >> 1] + v[n >> 1]) / 2;
}
function duracion(b) {
  return patronGuia() ? tramos()[b.pat - 1] * azar(.8, 1.15) : b.paciencia * azar(.7, 1.3);
}
function avanzar(b, t) { b.pat++; b.reps = 0; b.tPat = t; b.D = duracion(b); }
function entrar(b, desdeEspera) {
  b.estado = "toca"; b.iEv = 0; b.kSig = kTick;
  if (desdeEspera || !b.D) { b.tPat = tTick; b.D = duracion(b); }
}

/* al terminar una vuelta del patrón: ¿sigo, avanzo o descanso? */
function finDeVuelta(b) {
  b.reps++;
  const t = tTick, dt = t - b.tPat;
  if (!corre() || !tocan) { b.estado = "espera"; b.tEntrada = Infinity; return; }
  const ref = referencia(b), d = b.pat - ref;
  if (b.pat === 53) {
    if (dt >= b.D && ref >= 52.5) b.estado = "fin";        /* llegó el conjunto: sale */
    return;
  }
  let ir;
  if (d >= 2) ir = false;                                    /* demasiado adelante: espera */
  else if (d <= -2) ir = dt >= Math.min(4, b.D * .3);        /* atrás: se apura */
  else if (d >= 1) ir = dt >= 2 * b.D;                       /* un poco adelante: se queda más */
  else ir = dt >= b.D * (d < 0 ? .6 : 1);
  if (ir) { avanzar(b, t); return; }
  const vuelta = PATRONES[b.pat - 1].reduce((a, e) => a + e[1], 0) * spu();
  if (d > -2 && b.reps >= 2 && Math.random() < 1 - Math.exp(-vuelta / 45)) {
    b.estado = "descansa"; b.tVuelve = t + azar(3, 10);
  }
}
function quizasEntrar(b) {
  if (b.estado === "fin" || !corre() || !tocan) return;
  if (b.estado === "espera" && tTick >= b.tEntrada) entrar(b, true);
  else if (b.estado === "descansa" && tTick >= b.tVuelve) {
    if (referencia(b) - b.pat >= 2 && b.pat < 53) avanzar(b, tTick);   /* se quedó atrás descansando */
    entrar(b, false);
  }
}

function tick(b, u) {
  if (b.estado !== "toca") {
    if (kTick % 2 === 0) quizasEntrar(b);                    /* se entra en corchea */
    if (b.estado !== "toca") return;
  }
  let p = PATRONES[b.pat - 1], vueltas = 0;
  while (b.kSig <= kTick && vueltas < 3) {
    const e = p[b.iEv];
    if (e[0] !== 0) {
      const m = nota(e[0]).midi + 12 * b.oct, t = tTick + b.desfase;
      if (e[3]) voz(m, t - Math.min(.06, u * .45), u * .4, e[2] * .7 * b.vel, b.timbre, b.salida);
      else voz(m, t, Math.max(.05, e[1] * u * b.gate), e[2] * b.vel, b.timbre, b.salida);
    }
    b.kSig += Math.round(e[1] * 2);
    if (++b.iEv >= p.length) {
      b.iEv = 0; vueltas++;
      finDeVuelta(b);
      if (b.estado !== "toca") break;
      p = PATRONES[b.pat - 1];
    }
  }
}
function tickPulso(b, u) {
  if (b.kSig > kTick) return;
  b.kSig = kTick + 2;                                        /* corcheas */
  const y = leerYo();
  b.sonando = corre() && tocan && !b.fin && !y.pulso && tTick >= b.tEntrada;   /* si tú tomas el pulso, se calla */
  if (b.sonando) {
    const t = tTick + b.desfase;
    voz(72, t, u * .5, .4, "marimba", b.salida);
    voz(84, t, u * .5, .28, "marimba", b.salida);
  }
  if (bots.length && bots.every(x => x.estado === "fin")) {
    if (!b.tFin) b.tFin = tTick + 4;
    else if (tTick > b.tFin && !y.sonando) b.fin = true;
  } else b.tFin = 0;
}

function planificar() {
  if (!ctx || !bus) return;
  const ahora = ctx.currentTime, horizonte = ahora + .15;
  if (tTick < ahora) {                         /* primera vez, o la pestaña estuvo dormida: retomar desde ahora */
    tTick = ahora + .05; kTick += 2 - (kTick & 1);
    for (const b of bots) { b.kSig = kTick; b.iEv = 0; }
    if (pulsoBot) pulsoBot.kSig = kTick;
  }
  while (tTick < horizonte) {
    const u = spu();
    for (const b of bots) tick(b, u);
    if (pulsoBot) tickPulso(pulsoBot, u);
    tTick += u / 2; kTick++;
  }
}

/* ============================================================
   Interfaz
   ============================================================ */
const CSS = `
#cjEnsayar{border-color:#e8b25a;color:#e8b25a;padding:8px 18px}
.cj-chip.ens{background:transparent;color:#e8b25a;border:1px solid #e8b25a}
#cjEns{border-left:4px solid #e8b25a}
#cjEns .ayuda{font-size:11px;color:var(--dim);margin:2px 0 6px}
#cjEns .ayuda b{color:var(--tx);font-weight:400}
#cjEns label.chk{display:flex;gap:6px;align-items:center;margin-top:6px;cursor:pointer;color:var(--tx);font-size:11.5px;
  text-transform:none;letter-spacing:0}
#cjEns input[type=range]{width:110px}
`;

function construirPortada() {
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  const fila = $("go") && $("go").parentNode; if (!fila) return;
  const n0 = Math.max(0, Math.min(NMAX, +(ls.get("ensayoN") || 7) | 0));
  fila.insertAdjacentHTML("afterend", `
    <div style="margin-top:12px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <button id="cjEnsayar">ensayar sola o solo</button>
      <span style="color:var(--dim);font-size:11.5px">sin red, con
        <input type="number" id="cjEnsN0" min="0" max="${NMAX}" value="${n0}" style="width:50px;background:#1b2128;color:var(--tx);border:1px solid var(--line);border-radius:4px;padding:3px 5px;font:12px var(--mono)">
        intérpretes simulados y el pulso</span>
    </div>`);
  const inp = $("cjEnsN0");
  ["keydown", "keyup", "keypress"].forEach(t => inp.addEventListener(t, e => {
    e.stopPropagation();
    if (t === "keydown" && e.key === "Enter") $("cjEnsayar").click();
  }));
  $("cjEnsayar").onclick = () => empezar(+inp.value);

  /* index.html#ensayo (el enlace "Ensayar" de obras/index.html): el ensayo pasa a ser
     el botón principal de la portada y espacio o Enter lo empiezan */
  if (location.hash === "#ensayo") {
    $("cjEnsayar").style.cssText = "background:#e8b25a;color:#1a1204;border-color:#e8b25a;font-weight:700;padding:8px 18px";
    $("go").style.cssText = "padding:8px 18px";
    addEventListener("keydown", e => {
      if (empezado || $("splash").classList.contains("hidden")) return;
      if (e.code !== "Space" && e.code !== "Enter") return;
      if (document.activeElement === inp) return;
      e.preventDefault(); e.stopImmediatePropagation();
      $("cjEnsayar").click();
    }, true);
  }
}

let empezado = false;
function empezar(n) {
  if (empezado) return;
  empezado = true;
  n = Math.max(0, Math.min(NMAX, n | 0));
  ls.set("ensayoN", n);
  $("go").click();                            /* activa el audio y cierra la portada, como siempre */
  armarBus();
  ajustarBots(n);
  API.ensayo(srv);                            /* el panel pasa a hablar con la maestra simulada */
  construirSeccion();
  const h1 = document.querySelector("header h1");
  if (h1) h1.insertAdjacentHTML("afterend", `<span class="cj-chip ens" title="los demás intérpretes y la maestra están simulados en esta laptop">ENSAYO</span>`);
  setInterval(planificar, 25);
  setInterval(mandarTabla, 250);
}

function construirSeccion() {
  const red = $("cjRed"); if (!red) return;
  red.insertAdjacentHTML("afterend", `
    <section id="cjEns">
      <h3>ensayo <span>la maestra te cede todo</span></h3>
      <div class="ayuda"><b>Inicia el reloj</b> (aquí abajo): entra el pulso y los demás, de a poco, en el patrón 1.
        Siguen la guía si la enciendes; si no, la mediana del conjunto, tú incluido. Detener los calla; reiniciar los devuelve al 1.</div>
      <div class="fila"><input type="number" id="cjEnsN" min="0" max="${NMAX}" value="${bots.length}">
        <span class="dim">intérpretes simulados</span></div>
      <label class="chk"><input type="checkbox" id="cjEnsTocan" checked> los demás tocan</label>
      <label class="chk"><input type="checkbox" id="cjEnsPulso"${conPulso ? " checked" : ""}> uno de ellos toca el pulso</label>
      <div class="fila"><span class="dim">volumen de los demás</span>
        <input type="range" id="cjEnsVol" min="0" max="100" value="${+(ls.get("ensayoVol") || 70)}"></div>
      <div class="fila"><button id="cjEnsSalir" title="vuelve a la portada; para tocar en el concierto">salir del ensayo</button></div>
    </section>`);
  const nIn = $("cjEnsN");
  ["keydown", "keyup", "keypress"].forEach(t => nIn.addEventListener(t, e => {
    e.stopPropagation();
    if (t === "keydown" && (e.key === "Enter" || e.key === "Escape")) nIn.blur();
  }));
  nIn.onchange = () => { const n = Math.max(0, Math.min(NMAX, +nIn.value | 0)); nIn.value = n; ls.set("ensayoN", n); ajustarBots(n); };
  $("cjEnsTocan").onchange = e => {
    tocan = e.target.checked;
    if (!tocan) callarTodos();
    else if (corre()) escalonar(false);
    mandarTabla();
  };
  $("cjEnsPulso").onchange = e => { conPulso = e.target.checked; ls.set("ensayoPulso", conPulso ? "1" : "0"); ajustarBots(bots.length); };
  $("cjEnsVol").oninput = e => { ls.set("ensayoVol", e.target.value); if (bus) bus.gain.setTargetAtTime(volDemas(), ctx.currentTime, .03); };
  $("cjEnsSalir").onclick = () => location.reload();
}

try { construirPortada(); } catch (e) { console.warn("ensayo: no se pudo iniciar", e); }

/* para las pruebas */
window.InCEnsayo = { bots: () => bots, pulso: () => pulsoBot, referencia: () => referencia(null), reloj: () => reloj, bus: () => bus };
})();
