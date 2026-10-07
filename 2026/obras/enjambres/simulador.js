/* ============================================================
   ENJAMBRES · simulador
   Orquesta de Laptops UC (OLUC) · IEE2003

   Corre el Modelo en un Worker con su propio reloj de 30 pasos por
   segundo, así la simulación no se frena si la pestaña queda en segundo
   plano. Lo usan dos páginas:
     · la maestra: el Worker además habla con el "Servidor Enjambres",
       le manda cada cuadro (binario, protocolo.js) y recibe lo que piden
       las laptops;
     · una laptop en modo ENSAYO: todo corre en esa laptop, sin red, con
       intérpretes simulados que tocan solos.
   Aquí viven también la partitura (mensajes en el tiempo) y su reloj.

   La página arma el Worker con el código fuente de EnjambresModelo,
   EnjambresProtocolo y EnjambresSimulador (crearSimulador, al final),
   así funciona igual desde file:// que desde http.

   Página → Worker
     {cmd:"iniciar", servidor, simuladas, propia, bots, cederTodo, local, partitura}
     {cmd:"llamar", metodo, args}     métodos permitidos del Modelo
     {cmd:"maestra", grupo, k, v}     grupo: vals | retenido | conj
     {cmd:"laptop", num, k, v}        parámetro propio de una laptop
     {cmd:"orden", num, accion, …}    lo mismo que pide una laptop por la red
     {cmd:"correr", si}   {cmd:"paso"}   {cmd:"apagar"}   {cmd:"bots", si}
     {cmd:"partitura", partitura}     {cmd:"guardarPartitura"}
     {cmd:"reloj", accion: iniciar | detener | reiniciar | ir, ms}
   Worker → página
     {tipo:"cuadro", buf}             ArrayBuffer, cada paso
     {tipo:"estado", …}               4 por segundo y justo después de cada orden
     {tipo:"difusion", m}             (solo con local) lo que el servidor les
                                      mandaría a las laptops: config, partitura, reloj

   Worker ⇄ servidor (WebSocket /enjambres; ver README.md)
     → hola · cuadros binarios · config · partitura · reloj · respaldo · guardarPartitura
     ← bienvenida (direcciones, respaldo, laptops) · entra · sale · cmd · guardada
   ============================================================ */
function EnjambresSimulador(raiz) {
"use strict";

const PASOS_POR_SEG = 30;
const ESTADO_CADA = 8;              /* pasos: ~4 estados (y config a las laptops) por segundo */
const RESPALDO_MS = 2000;
const RELOJ_MS = 1000;              /* mientras corre, el reloj de la partitura se repite cada segundo */
const MAX_COLA_WS = 512 * 1024;     /* si la red se atora, se saltan cuadros en vez de acumularlos */
const METODOS = ["agregarLaptop", "quitarLaptop", "moverLaptop", "fijarSalidas", "repartir", "crearAgente",
                 "quitarAgente", "mutear", "mutearTodos", "reiniciar", "vaciar"];

function iniciarSimulador(puerto) {
  const { Modelo, codificar, MAX_AGENTES_LAPTOP, PARAMS } = raiz.Enjambres;
  const modelo = new Modelo();
  let corriendo = true, pendiente = true, cuenta = 0;
  let pasosMedidos = 0, tMedida = Date.now(), pasosPorSeg = 0;
  const historia = [];              /* pasos/s de cada segundo del último minuto, para el mínimo */
  let local = false;                /* ensayo: config, partitura y reloj van a la página */

  /* ---------- partitura (solo mensajes) y su reloj ---------- */
  let partitura = { v: 1, eventos: [] }, versionPartitura = 1;
  const reloj = { estado: "espera", base: 0, t0: 0 };
  const msReloj = () => reloj.estado === "corriendo" ? reloj.base + (Date.now() - reloj.t0) : reloj.base;
  let tReloj = 0;
  function fijarPartitura(p) {
    if (!p || !Array.isArray(p.eventos)) return;
    partitura = { v: 1, eventos: p.eventos.slice(0, 2000).map(e => ({
      id: String(e.id || Math.random().toString(36).slice(2, 9)),
      t: Math.max(0, +e.t || 0), dur: Math.max(1, +e.dur || 10),
      para: e.para === "todos" || e.para == null ? "todos" : (e.para | 0),
      texto: String(e.texto || "").slice(0, 400) })) };
    versionPartitura++;
    difundir({ t: "partitura", partitura });
  }
  function accionReloj(m) {
    const ahora = Date.now(), ms = msReloj();
    if (m.accion === "iniciar" && reloj.estado !== "corriendo") Object.assign(reloj, { estado: "corriendo", base: ms, t0: ahora });
    else if (m.accion === "detener" && reloj.estado === "corriendo") Object.assign(reloj, { estado: "detenido", base: ms });
    else if (m.accion === "reiniciar") Object.assign(reloj, { estado: "espera", base: 0 });
    else if (m.accion === "ir") Object.assign(reloj, { base: Math.max(0, +m.ms || 0), t0: ahora,
                                                         estado: reloj.estado === "espera" ? "detenido" : reloj.estado });
    difundirReloj();
  }
  const msgReloj = () => ({ t: "reloj", estado: reloj.estado, ms: msReloj() });
  function difundirReloj() { tReloj = Date.now(); difundir(msgReloj()); }

  /* ---------- intérpretes simulados que tocan solos ---------- */
  let bots = false;
  const plan = new Map();           /* num → {objetivo, hasta} */
  function tocarBots() {            /* una vez por segundo */
    if (!bots || !corriendo) return;
    const ahora = Date.now();
    for (const l of modelo.laptops.values()) {
      if (!l.simulada) continue;
      let p = plan.get(l.num);
      if (!p || ahora > p.hasta) {   /* cada 8 a 25 s, cada uno decide cuántos agentes quiere */
        p = { objetivo: Math.random() < 0.15 ? 0 : Math.round(2 + Math.random() * 10), hasta: ahora + 8000 + Math.random() * 17000 };
        plan.set(l.num, p);
      }
      const mios = modelo.agentes.filter(a => a.dueno === l.num);
      if (mios.length < p.objetivo && Math.random() < 0.5) modelo.crearAgente(l.num);
      else if (mios.length > p.objetivo && Math.random() < 0.4) modelo.quitarAgente(l.num);
      if (mios.length && Math.random() < 0.04) modelo.mutear(mios[Math.floor(Math.random() * mios.length)].id);
      if (Math.random() < 0.004) modelo.mutearTodos(l.num, !mios.every(a => a.mudo));
    }
  }

  /* ---------- red ---------- */
  let ws = null, url = null, intento = 0, tRespaldo = 0, configPrevia = "", tocado = false;
  const red = { estado: "sin servidor", direcciones: [], servidor: null };

  function asegurarMaestra() { if (!modelo.laptops.has(0)) modelo.agregarLaptop(0, { fi: Math.PI / 2 }); }

  function conectar() {
    red.estado = intento ? "reconectando" : "conectando";
    pendiente = true;
    try { ws = new WebSocket(url); } catch (e) { return reintentar(); }
    ws.binaryType = "arraybuffer";
    ws.onopen = () => { intento = 0; ws.send(JSON.stringify({ t: "hola", rol: "maestra" })); };
    ws.onmessage = e => { if (typeof e.data === "string") try { delServidor(JSON.parse(e.data)); } catch (x) { } };
    ws.onclose = () => { ws = null; if (red.estado !== "rechazada" && red.estado !== "apagado") reintentar(); };
  }
  function reintentar() {
    red.estado = "reconectando"; pendiente = true;
    setTimeout(conectar, Math.min(5000, 500 * Math.pow(2, intento++)));
  }
  const enviarWS = o => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); };
  /* lo que reciben las laptops (y la proyección): por la red o, en ensayo, la página misma */
  function difundir(o) {
    if (local) puerto.postMessage({ tipo: "difusion", m: o });
    else if (red.estado === "conectada") enviarWS(o);
  }

  function restaurar(r) {
    if (!r) return false;
    const est = r.modelo || r;                       /* respaldo de la versión anterior: solo el modelo */
    if (!modelo.importar(est)) return false;
    if (r.partitura) { partitura = r.partitura; versionPartitura++; }
    if (r.reloj) Object.assign(reloj, r.reloj, r.reloj.estado === "corriendo" ? { base: r.reloj.ms || 0, t0: Date.now() } : { base: r.reloj.ms || 0 });
    return true;
  }

  function delServidor(m) {
    if (m.t === "bienvenida") {
      red.estado = "conectada"; red.direcciones = m.direcciones || [];
      /* si la página de la maestra se recargó, se recupera el enjambre que guardó el servidor */
      if (m.respaldo && !tocado && restaurar(m.respaldo)) red.restaurado = (red.restaurado || 0) + 1;
      asegurarMaestra();
      for (const l of modelo.laptops.values()) if (!l.maestra && !l.simulada) l.conectada = false;
      for (const q of m.laptops || []) entra(q);
      configPrevia = "";
      difundir({ t: "partitura", partitura }); difundirReloj();
    } else if (m.t === "rechazado") {
      red.estado = "rechazada";     /* otra máquina: solo la laptop servidora puede ser la maestra */
    } else if (m.t === "entra") entra(m);
    else if (m.t === "sale") {
      const l = modelo.laptops.get(m.num);
      if (l && !l.simulada) l.conectada = false;
    } else if (m.t === "cmd") orden(m);
    else if (m.t === "guardada") red.guardada = { ok: !!m.ok, ruta: m.ruta || "", error: m.error || "", n: (red.guardada ? red.guardada.n : 0) + 1 };
    modelo.derivar();
    pendiente = true;
  }

  function entra(q) {
    const num = q.num | 0;
    if (num < 1 || num > 99) return;
    let l = modelo.laptops.get(num);
    if (!l) l = modelo.agregarLaptop(num);          /* entra en el hueco más grande del arco */
    l.simulada = false; l.conectada = true;
    if (q.salidas) modelo.fijarSalidas(num, q.salidas);
  }

  /* Lo que pide una laptop. Por la red, el servidor pone 'num': cada laptop solo toca lo suyo. */
  function orden(m) {
    const num = m.num | 0, l = modelo.laptops.get(num);
    if (!l || l.maestra) return;
    tocado = true;
    switch (m.accion) {
      case "crear": modelo.crearAgente(num); break;
      case "quitar": modelo.quitarAgente(num, m.id != null ? m.id | 0 : undefined); break;
      case "mutear": { const a = modelo.agentes.find(a => a.id === (m.id | 0)); if (a && a.dueno === num) modelo.mutear(a.id); break; }
      case "mutearTodos": modelo.mutearTodos(num, !!m.si); break;
      case "param": modelo.fijarParam(num, String(m.k), m.v); break;
      case "salidas": modelo.fijarSalidas(num, m.n); break;
    }
  }

  /* Lo que cada laptop necesita saber además de los cuadros: qué parámetros cede la
     maestra y con qué valores, y los suyos propios. */
  function config() {
    const laptops = [];
    for (const l of modelo.laptops.values()) {
      let n = 0, mudos = 0;
      for (const a of modelo.agentes) if (a.dueno === l.num) { n++; if (a.mudo) mudos++; }
      laptops.push({ num: l.num, color: l.color, maestra: l.maestra, simulada: l.simulada, conectada: l.conectada,
                     salidas: l.salidas, params: l.params, n, mudos });
    }
    return { t: "config", corriendo, vals: modelo.maestra.vals, retenido: modelo.maestra.retenido,
             maxAgentes: MAX_AGENTES_LAPTOP, laptops };
  }

  /* ---------- hacia la página ---------- */
  function estado() {
    const laptops = [];
    for (const l of modelo.laptops.values()) {
      let n = 0, mudos = 0;
      for (const a of modelo.agentes) if (a.dueno === l.num) { n++; if (a.mudo) mudos++; }
      laptops.push({ num: l.num, fi: l.fi, color: l.color, maestra: l.maestra, simulada: l.simulada,
                     conectada: l.conectada, salidas: l.salidas,
                     params: l.params, ef: modelo.efectivos(l.num), n, mudos,
                     psi: modelo.polarizacion(l.num) });
    }
    return { tipo: "estado", corriendo, pasos: modelo.pasos, pasosPorSeg,
             pasosMin: historia.length ? Math.min(...historia) : null,
             maestra: modelo.maestra, laptops, N: modelo.agentes.length,
             psi: modelo.polarizacion(), vecinos: modelo.vecinosMedio(), red, bots,
             reloj: { estado: reloj.estado, ms: msReloj() }, partitura, versionPartitura };
  }

  function emitir() {
    const buf = codificar(modelo.instantanea());
    if (ws && ws.readyState === 1 && red.estado === "conectada" && ws.bufferedAmount < MAX_COLA_WS) ws.send(buf.slice(0));
    puerto.postMessage({ tipo: "cuadro", buf }, [buf]);
    if (pendiente || ++cuenta >= ESTADO_CADA) {
      cuenta = 0; pendiente = false;
      puerto.postMessage(estado());
      const ahora = Date.now();
      if (local || red.estado === "conectada") {
        const c = JSON.stringify(config());
        if (c !== configPrevia) { configPrevia = c; if (local) difundir(JSON.parse(c)); else ws.send(c); }
        if (reloj.estado === "corriendo" && ahora - tReloj > RELOJ_MS) difundirReloj();
      }
      if (red.estado === "conectada" && ahora - tRespaldo > RESPALDO_MS) {
        tRespaldo = ahora;
        enviarWS({ t: "respaldo", estado: { modelo: modelo.exportar(), partitura, reloj: { estado: reloj.estado, ms: msReloj() } } });
      }
    }
  }

  let tBots = 0;
  function tick() {
    if (corriendo) { modelo.paso(); pasosMedidos++; }
    const ahora = Date.now();
    if (ahora - tMedida >= 1000) {
      pasosPorSeg = pasosMedidos * 1000 / (ahora - tMedida); pasosMedidos = 0; tMedida = ahora;
      if (corriendo) { historia.push(pasosPorSeg); if (historia.length > 60) historia.shift(); } else historia.length = 0;
    }
    if (ahora - tBots >= 1000) { tBots = ahora; tocarBots(); }
    emitir();
  }

  puerto.onmessage = e => {
    const m = e.data || {};
    if (m.cmd === "iniciar") {
      bots = !!m.bots; local = !!m.local;
      if (m.partitura) fijarPartitura(m.partitura);
      if (m.servidor) {
        red.servidor = m.servidor; url = "ws://" + m.servidor + "/enjambres";
        conectar();
        /* sin respuesta del servidor igual se puede trabajar; si luego llega un respaldo, no se pisa lo hecho */
        setTimeout(() => { asegurarMaestra(); pendiente = true; }, 1500);
      } else {
        asegurarMaestra();
        const propia = m.propia | 0;
        let n = 1;
        for (let k = 0; k < (m.simuladas | 0); k++, n++) { if (n === propia) n++; modelo.agregarLaptop(n, { simulada: true }); }
        if (propia) modelo.agregarLaptop(propia, { simulada: false });
        modelo.repartir();
        if (m.cederTodo) for (const p of PARAMS) modelo.maestra.retenido[p.k] = false;
        if (local) { difundir({ t: "partitura", partitura }); difundirReloj(); }
      }
    } else {
      tocado = true;
      if (m.cmd === "llamar" && METODOS.includes(m.metodo)) modelo[m.metodo].apply(modelo, m.args || []);
      else if (m.cmd === "maestra" && ["vals", "retenido", "conj"].includes(m.grupo)) modelo.maestra[m.grupo][m.k] = m.v;
      else if (m.cmd === "laptop") modelo.fijarParam(m.num, m.k, m.v);
      else if (m.cmd === "orden") orden(m);
      else if (m.cmd === "bots") { bots = !!m.si; plan.clear(); }
      else if (m.cmd === "partitura") fijarPartitura(m.partitura);
      else if (m.cmd === "guardarPartitura") enviarWS({ t: "guardarPartitura", partitura });
      else if (m.cmd === "reloj") accionReloj(m);
      else if (m.cmd === "correr" || m.cmd === "paso") {
        corriendo = m.cmd === "correr" && !!m.si;
        if (m.cmd === "paso") modelo.paso();
        pasosMedidos = 0; tMedida = Date.now(); historia.length = 0;   /* medir de nuevo desde aquí */
      } else if (m.cmd === "apagar") { enviarWS({ t: "apagar" }); red.estado = "apagado"; }
    }
    modelo.derivar();
    pendiente = true;
  };

  setInterval(tick, 1000 / PASOS_POR_SEG);
}

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { iniciarSimulador });
}
EnjambresSimulador(typeof self !== "undefined" ? self : globalThis);

/* ---------- en la página: arma el Worker con el código de los módulos ----------
   Chrome no deja cargar un Worker desde un archivo abierto con doble clic (file://),
   así que se arma desde un Blob con el código fuente. Si aun así falla, la simulación
   corre en la página misma ('donde' lo dice).                                       */
function crearSimulador(recibir) {
  const fuente = [EnjambresModelo, EnjambresProtocolo, EnjambresSimulador]
    .map(f => "(" + f.toString() + ")(self);").join("\n") + "\nself.Enjambres.iniciarSimulador(self);";
  try {
    const w = new Worker(URL.createObjectURL(new Blob([fuente], { type: "text/javascript" })));
    w.onmessage = e => recibir(e.data);
    const s = { enviar: m => w.postMessage(m), donde: "Worker", error: "" };
    w.onerror = e => { console.error("simulador:", e.message); s.error = e.message || "error en el Worker"; };
    return s;
  } catch (e) {
    console.warn("sin Worker, la simulación corre en la página:", e);
    const puerto = { postMessage: m => setTimeout(() => recibir(structuredClone(m)), 0), onmessage: null };
    Enjambres.iniciarSimulador(puerto);
    return { enviar: m => puerto.onmessage({ data: structuredClone(m) }), donde: "página (sin Worker)", error: "" };
  }
}
