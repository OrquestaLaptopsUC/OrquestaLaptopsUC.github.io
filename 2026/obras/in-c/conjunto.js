/* ============================================================
   IN C · capa de conjunto · cliente
   Orquesta de Laptops UC (OLUC) · IEE2003

   Se carga DESPUÉS del script principal de index.html y no toca el
   motor de audio ni la selección de patrones: solo LEE iPat, sonando y
   pulso (variables globales del script principal), las reporta al
   servidor cuando cambian y dibuja el panel del conjunto.

   Si el servidor no está, o se cae, la obra sigue sonando igual: esta
   capa solo muestra que perdió la conexión y reintenta sola.
   Protocolo de mensajes: ver README.md.
   ============================================================ */
(function () {
"use strict";

const PUERTO_DEF = 8080;
const JUNTO = 3;              /* Riley: mantenerse a no más de 2 o 3 patrones del resto */
const VENTANA_TEND = 20000;   /* la tendencia de la dispersión compara con hace 20 s */
const SIN_SENAL_MS = 2500;    /* el servidor difunde 4 veces por segundo: 2,5 s sin nada = caído */
const K = "oluc.inc.";

/* ---------- almacenamiento local (puede fallar: modo privado, file://) ---------- */
const ls = {
  get(k) { try { return localStorage.getItem(K + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(K + k, v); } catch (e) { } },
};
function nuevoId() {
  try { const a = new Uint32Array(2); crypto.getRandomValues(a); return a[0].toString(36) + a[1].toString(36); }
  catch (e) { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
}
const miId = ls.get("id") || (() => { const i = nuevoId(); ls.set("id", i); return i; })();
let miNombre = ls.get("nombre") || "";
const sinNombre = !miNombre;
if (!miNombre) miNombre = "laptop " + miId.slice(0, 3);

function normHost(s) {
  s = String(s || "").trim().replace(/^[a-z]+:\/\//i, "").replace(/\/.*$/, "");
  if (!s) return "";
  if (!/:\d+$/.test(s)) s += ":" + PUERTO_DEF;
  return s;
}
const qs = new URLSearchParams(location.search);
let host = normHost(qs.get("servidor")) || normHost(ls.get("servidor")) ||
           (/^https?:$/.test(location.protocol) ? location.host : "");

/* ---------- lectura del instrumento (sin tocarlo) ---------- */
function leer() {
  try { return { patron: iPat + 1, sonando: !!sonando, pulso: !!pulso }; }   /* globales del script principal */
  catch (e) { return null; }
}

/* ---------- color: interpolación en OKLab ---------- */
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const gam = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
function aLab(hx) {
  const [r, g, b] = hex2rgb(hx).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
          1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
          0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
}
function deLab([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
              -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
              -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  return "#" + rgb.map(c => Math.round(Math.max(0, Math.min(1, gam(Math.max(0, c)))) * 255).toString(16).padStart(2, "0")).join("");
}
function colorDe(pal, patron) {                  /* patrón 1 = un extremo, 53 = el otro */
  const c = pal.colores, t = (Math.max(1, Math.min(53, patron)) - 1) / 52 * (c.length - 1);
  const i = Math.min(c.length - 2, Math.floor(t)), f = t - i;
  const a = aLab(c[i]), b = aLab(c[i + 1]);
  return deLab(a.map((v, k) => v + (b[k] - v) * f));
}
const luminancia = hx => { const [r, g, b] = hex2rgb(hx).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const esClaro = hx => luminancia(hx) > 0.18;     /* sobre esto, el texto oscuro contrasta más que el claro */

const PALETAS = [
  { nombre: "amanecer",    colores: ["#141a46", "#6a2c8c", "#e0505e", "#f7c65a"] },
  { nombre: "océano",      colores: ["#07182e", "#0d5c78", "#27a99a", "#bfeccc"] },
  { nombre: "brasa",       colores: ["#1a0905", "#72200f", "#d4521d", "#ffc46a"] },
  { nombre: "bosque",      colores: ["#0c1c12", "#2a5530", "#86a53a", "#e3e09a"] },
  { nombre: "noche a día", colores: ["#05070d", "#22314f", "#6f8fb5", "#dfe8f0"] },
  { nombre: "espectro",    colores: ["#d7263d", "#f49d37", "#e8e337", "#3fb950", "#1fa3c8", "#3f51d4", "#8e3fd4"] },
];

/* ---------- estado ---------- */
let ws = null, conectado = false, intento = 0, tReintento = null, proxIntento = 0;
let ultimoMsg = 0, reemplazado = false, control = false, yaConecto = false, tIntento = 0;
let relojBase = { estado: "espera", ms: 0, t0: performance.now() };
let tabla = null, tTabla = 0, firmaTabla = "";
let paleta = null;
let guia = { modo: "apagada", segundos: 45, minutos: 45 };
let direcciones = [];                                /* solo en la laptop servidora */
let enviado = null;                                  /* último estado reportado */
const historia = [];                                 /* {t, d}: dispersión en el tiempo */

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const medio = x => Number.isInteger(x) ? String(x) : (Math.floor(x) || "") + "½";
const mmss = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };

/* ============================================================
   Red
   ============================================================ */
/* ensayo (ensayo.js): en vez del servidor, una maestra simulada en esta misma
   página. Recibe lo mismo que recibiría el servidor y contesta con los mismos
   mensajes, así el resto de esta capa no se entera de la diferencia. */
let local = null;
function enviar(o) {
  if (local) { try { local.recibir(o); } catch (e) { console.warn("conjunto (ensayo):", e); } return; }
  if (ws && conectado) try { ws.send(JSON.stringify(o)); } catch (e) { }
}
function entrante(m) {
  ultimoMsg = performance.now();
  try { recibir(m); } catch (e) { console.warn("conjunto:", e); }
}

function soltarSocket() {
  if (!ws) return;
  const s = ws; ws = null; conectado = false;
  s.onopen = s.onmessage = s.onclose = s.onerror = null;
  try { s.close(); } catch (e) { }
}
function conectar() {
  clearTimeout(tReintento); tReintento = null;
  if (local) return;
  soltarSocket();
  if (!host) { pintar(); return; }
  let s;
  try { s = new WebSocket("ws://" + host + "/conjunto"); }
  catch (e) { reintentar(); pintar(); return; }
  ws = s; tIntento = performance.now();
  s.onopen = () => {
    conectado = true; intento = 0; ultimoMsg = performance.now(); yaConecto = true;
    const e = leer() || { patron: 1, sonando: false, pulso: false };
    enviado = e;
    enviar(Object.assign({ t: "hola", id: miId, nombre: miNombre }, e));
    pintar();
  };
  s.onmessage = ev => {
    let m; try { m = JSON.parse(ev.data); } catch (e) { ultimoMsg = performance.now(); return; }
    entrante(m);
  };
  s.onclose = () => { if (ws !== s) return; ws = null; conectado = false; if (!reemplazado) reintentar(); pintar(); };
  s.onerror = () => { };                               /* siempre sigue un onclose */
}
function reintentar() {
  clearTimeout(tReintento);
  if (local) return;
  const d = Math.min(5000, 500 * Math.pow(2, intento)) * (0.75 + Math.random() * 0.5);
  intento++; proxIntento = performance.now() + d;
  tReintento = setTimeout(conectar, d);
}
function recibir(m) {
  switch (m.t) {
    case "bienvenida": control = !!m.control; direcciones = Array.isArray(m.direcciones) ? m.direcciones : []; construirControl(); break;
    case "reloj": relojBase = { estado: m.estado, ms: +m.ms || 0, t0: performance.now() }; pintarReloj(); break;
    case "paleta": paleta = m.paleta && Array.isArray(m.paleta.colores) ? m.paleta : null; aplicarColor(true); pintarPaletaCtl(); firmaTabla = ""; pintarTabla(); break;
    case "guia": if (m.guia && m.guia.modo) { guia = m.guia; sincronizarGuiaCtl(); firmaTabla = ""; pintarGuia(); pintarTabla(); } break;
    case "tabla": tabla = m; tTabla = performance.now(); pintarTabla(); break;
    case "reemplazado": reemplazado = true; soltarSocket(); pintar(); break;
  }
}

/* vigilancia: el servidor difunde 4 veces por segundo. Si deja de llegar
   (Wi-Fi caído, laptop servidora dormida) el socket puede quedar abierto
   un buen rato sin avisar; no esperamos al sistema y reconectamos. */
setInterval(() => {
  if (local) return;                                 /* en el ensayo no hay red que vigilar */
  const ahora = performance.now();
  if (conectado && ahora - ultimoMsg > SIN_SENAL_MS) { soltarSocket(); reintentar(); pintar(); }
  /* un intento que no termina de conectar (servidor colgado, IP que no responde) se abandona a los 4 s */
  else if (ws && !conectado && ahora - tIntento > 4000) { soltarSocket(); reintentar(); pintar(); }
}, 500);

/* reporte: se mira el instrumento 10 veces por segundo y se envía solo si cambió */
let colorPatron = 0;
setInterval(() => {
  const e = leer(); if (!e) return;
  if (e.patron !== colorPatron) { colorPatron = e.patron; aplicarColor(false); }
  if (!enviado || e.patron !== enviado.patron || e.sonando !== enviado.sonando || e.pulso !== enviado.pulso) {
    if (conectado) { enviado = e; enviar(Object.assign({ t: "estado" }, e)); }
    pintarTabla();
  }
}, 100);

/* ============================================================
   Interfaz
   ============================================================ */
const CSS = `
#cj{border-left:1px solid var(--line);background:var(--panel);overflow-y:auto;min-height:0;min-width:0;font-size:12px}
#cj section{padding:9px 14px 10px;border-bottom:1px solid var(--line)}
#cj h3{margin:0 0 6px;font-size:10.5px;letter-spacing:.12em;color:var(--dim);font-weight:400;text-transform:uppercase;
  display:flex;justify-content:space-between;align-items:baseline;gap:8px}
#cj h3 span{letter-spacing:.04em;text-transform:none}
#cj .big{font-size:38px;font-weight:700;line-height:1.05;letter-spacing:.03em;font-variant-numeric:tabular-nums}
#cj .dim{color:var(--dim)}
#cj .fila{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:7px}
#cj button{padding:3px 8px;font-size:11.5px}
#cj button:disabled{opacity:.35;cursor:default}
#cj button.aviso{border-color:var(--warn);color:var(--warn)}
#cj input[type=text],#cj input[type=number]{background:var(--cj-campo);color:var(--tx);border:1px solid var(--line);border-radius:4px;
  padding:4px 7px;font:12px var(--mono);user-select:text;-webkit-user-select:text;min-width:0}
#cj input:focus{outline:none;border-color:var(--acc2)}
#cj input[type=number]{width:52px}
#cj input[type=color]{width:34px;height:24px;padding:0;border:1px solid var(--line);background:none;border-radius:4px}
#cj select{font-size:11.5px}
#cjRed{padding:8px 14px;border-bottom:1px solid var(--line);font-size:11.5px;color:var(--dim)}
#cjRed .p{display:inline-block;width:8px;height:8px;border-radius:50%;background:#3a434e;margin-right:6px;vertical-align:1px}
#cjRed.ok .p{background:var(--ok);box-shadow:0 0 6px var(--ok)}
#cjRed.caido{background:#3a1512;color:#f3c1b9;border-bottom-color:var(--warn)}
#cjRed.caido b{color:#fff;letter-spacing:.06em}
#cjRed.ens{background:rgba(232,178,90,.10);color:var(--tx);border-left:4px solid #e8b25a}
#cjRed.ens .p{background:#e8b25a}
body.cj-ensayo #cjDir{display:none !important}
#cj.caido .datos{opacity:.38;filter:grayscale(1)}
#cjTag{font-size:10px;letter-spacing:.1em;padding:1px 6px;border-radius:3px;border:1px solid var(--line);color:var(--dim)}
#cjTag.manual{background:var(--acc2);border-color:var(--acc2);color:#1a1204;font-weight:700}
#cjDisp .big.junto{color:var(--ok)} #cjDisp .big.lejos{color:var(--warn)}
#cjDisp .est{font-size:12.5px;font-weight:700}
#cjTabla{width:100%;border-collapse:collapse;margin-top:4px}
#cjTabla td{padding:2px 4px;border-top:1px solid #1d232a;white-space:nowrap}
#cjTabla td.n{overflow:hidden;text-overflow:ellipsis;max-width:130px}
#cjTabla td.r{text-align:right;font-variant-numeric:tabular-nums}
#cjTabla tr.yo td{color:var(--cj-yo);font-weight:700}
#cjTabla tr.off td{color:#5b6572}
#cjTabla .e{display:inline-block;width:8px;height:8px;border-radius:50%;border:1.5px solid var(--dim)}
#cjTabla .e.son{background:var(--tx);border-color:var(--tx)}
#cjTabla .e.pul{border-radius:1px;background:var(--acc);border-color:var(--acc)}
#cjTabla .e.off{border-style:dashed;border-color:#4a535e}
#cj details summary{cursor:pointer;color:var(--dim);font-size:11px;list-style:none}
#cj details summary::-webkit-details-marker{display:none}
#cj details label{display:block;margin:8px 0 3px}
#cj .ctl-only{display:none} #cj.control .ctl-only{display:block}
#cj .ctl-only{margin-top:8px;padding-top:7px;border-top:1px dashed #2b333c}
#cj .ctl-only>.dim{font-size:10px;letter-spacing:.1em;text-transform:uppercase}
/* ---- laptop maestra: que se note ---- */
.cj-chip{display:inline-block;background:#e8b25a;color:#1a1204;font-weight:700;letter-spacing:.2em;font-size:11px;
  padding:3px 9px;border-radius:3px;white-space:nowrap}
#cjMaestraTag{display:none} body.cj-maestra #cjMaestraTag{display:inline-block}
#cj.control section .ctl-only{border-left:3px solid #e8b25a;padding-left:9px;border-top:0;margin-top:10px}
#cj.control #cjPal{border-left:3px solid #e8b25a}
#cj #cjDir{margin-top:0;border-top:0;border-left:4px solid #e8b25a;background:rgba(232,178,90,.10);padding-top:10px}
#cjSplashMaestra{display:none;margin-top:14px} body.cj-maestra #cjSplashMaestra{display:block}
#cjBtn .p{display:inline-block;width:7px;height:7px;border-radius:50%;background:#3a434e;margin-right:5px;vertical-align:1px}
#cjBtn.ok .p{background:var(--ok)} #cjBtn.caido .p{background:var(--warn)}
#cjBtn.on{background:#1b2233;border-color:var(--acc);color:var(--tx);font-weight:400}
body.cj-color #cjBtn.on{background:rgba(var(--ink-rgb),.16);border-color:var(--ink)}
#cj svg{display:block;width:100%;height:auto;overflow:visible}
#cj{--cj-band:rgba(143,158,240,.26);--cj-bandl:#8f9ef0;--cj-yo:#e8b25a;--cj-campo:#1b2128;--cj-guia:#7fc47f}
/* ---- modo color: la paleta inunda la pantalla completa; todo lo demas queda
   transparente encima y la tinta (texto, pentagrama) pasa a clara u oscura ---- */
body.cj-color{--bg:var(--cj-fondo);--panel:transparent;--line:rgba(var(--ink-rgb),.22);--tx:var(--ink);
  --dim:rgba(var(--ink-rgb),.66);--acc:var(--ink);--acc2:var(--act);transition:background-color 4s linear}
body.cj-color #cj{--cj-band:rgba(var(--ink-rgb),.16);--cj-bandl:rgba(var(--ink-rgb),.6);--cj-yo:var(--act);--cj-campo:rgba(var(--ink-rgb),.08);--cj-guia:var(--ink)}
body.cj-color #partitura{background:rgba(var(--ink-rgb),.05)}
body.cj-color select,body.cj-color button,body.cj-color input[type=file],body.cj-color kbd{background:rgba(var(--ink-rgb),.08);color:var(--ink)}
body.cj-color button.on{background:var(--ink);color:var(--cj-fondo);border-color:var(--ink)}
body.cj-color option{background:#14181d;color:#dfe5ec}
body.cj-color .pat:hover{background:rgba(var(--ink-rgb),.08)}
body.cj-color .pat.sel{background:rgba(var(--ink-rgb),.14)}
body.cj-color .pat .m{color:rgba(var(--ink-rgb),.6)}
body.cj-color .stf{stroke:rgba(var(--ink-rgb),.55)} body.cj-color .ldg{stroke:rgba(var(--ink-rgb),.7)}
body.cj-color .nh,body.cj-color .acc,body.cj-color .clef{fill:var(--ink)}
body.cj-color .nh.hueca{fill:none;stroke:var(--ink)}
body.cj-color .stm,body.cj-color .bm{stroke:var(--ink);fill:var(--ink)}
body.cj-color .tie{stroke:var(--ink)} body.cj-color .rst{fill:rgba(var(--ink-rgb),.75)}
body.cj-color .nh.act,body.cj-color .rst.act{fill:var(--act)} body.cj-color .nh.hueca.act{fill:none;stroke:var(--act)}
body.cj-color .stm.act,body.cj-color .bm.act{stroke:var(--act);fill:var(--act)}
body.cj-color .led{background:rgba(var(--ink-rgb),.2)}
body.cj-color #cjTabla td{border-top-color:rgba(var(--ink-rgb),.12)}
body.cj-color #cjTabla tr.off td{color:rgba(var(--ink-rgb),.4)}
`;

function construir() {
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  const main = document.querySelector("main");
  const panel = document.createElement("aside");
  panel.id = "cj";
  panel.innerHTML = `
    <div id="cjRed"></div>
    <section id="cjDir" class="ctl-only">
      <span class="cj-chip">LAPTOP MAESTRA</span>
      <div class="dim" style="margin:7px 0 9px;font-size:11px;text-transform:none;letter-spacing:0">Esta laptop corre el servidor. Los controles con borde ámbar solo aparecen aquí.</div>
      <h3>las demás laptops abren</h3>
      <div id="cjDirV" style="font-size:17px;font-weight:700;line-height:1.35;user-select:text;-webkit-user-select:text"></div>
      <div class="fila"><button id="cjApagar">apagar servidor</button></div>
    </section>
    <section id="cjReloj">
      <h3>reloj de la obra <span id="cjRelojEst"></span></h3>
      <div class="big" id="cjRelojV">00:00</div>
      <div class="ctl-only"><span class="dim">maestra</span>
        <div class="fila">
          <button id="cjIni">iniciar</button><button id="cjDet">detener</button><button id="cjRei">reiniciar</button>
        </div></div>
    </section>
    <section id="cjGuia" hidden>
      <h3>guía: deberían estar en <span id="cjGuiaModoTxt"></span></h3>
      <div style="display:flex;align-items:baseline;gap:10px"><span class="big" id="cjGuiaV">–</span>
        <span class="dim" id="cjGuiaProx"></span></div>
      <div style="height:5px;border-radius:3px;background:var(--cj-campo);margin-top:6px;overflow:hidden">
        <div id="cjGuiaAvance" style="height:100%;width:0;background:var(--cj-guia)"></div></div>
      <div id="cjGuiaYo" style="margin-top:5px"></div>
      <div class="ctl-only"><span class="dim">guía · maestra</span>
        <div class="fila"><select id="cjGuiaModo"><option value="apagada">apagada</option>
          <option value="fija">cada N segundos</option><option value="largo">según el largo de cada patrón</option></select></div>
        <div class="fila" id="cjGuiaFija"><input type="number" id="cjGuiaSeg" min="10" max="300" step="5"> <span class="dim">segundos por patrón</span></div>
        <div class="fila" id="cjGuiaLargo"><input type="number" id="cjGuiaMin" min="10" max="180" step="5"> <span class="dim">minutos en total</span></div>
        <div class="dim" id="cjGuiaTotal" style="margin-top:6px;font-size:11px;text-transform:none;letter-spacing:0"></div>
      </div>
    </section>
    <section id="cjPos" class="datos">
      <h3>posición del conjunto <span id="cjTag">mediana</span></h3>
      <div style="display:flex;align-items:baseline;gap:8px"><span class="big" id="cjPosV">–</span>
        <span class="dim" id="cjPosDe">de 53</span></div>
      <div id="cjBarra" style="margin-top:6px"></div>
      <div id="cjYo" style="margin-top:5px"></div>
      <div class="ctl-only"><span class="dim">anulación manual · maestra</span>
        <div class="fila">
          <button id="cjMenos">−</button><input type="number" id="cjMan" min="1" max="53" placeholder="–">
          <button id="cjMas">+</button><button id="cjSoltar">soltar</button>
        </div></div>
    </section>
    <section id="cjDisp" class="datos">
      <h3>dispersión <span id="cjMinMax"></span></h3>
      <div style="display:flex;align-items:baseline;gap:10px">
        <span class="big" id="cjDispV">–</span>
        <span><span class="est" id="cjDispEst"></span><br><span class="dim" id="cjTend"></span></span></div>
    </section>
    <section id="cjLap" class="datos">
      <h3>laptops <span id="cjCuenta"></span></h3>
      <div id="cjMapa"></div>
      <table id="cjTabla"><tbody></tbody></table>
      <div class="ctl-only"><div class="fila"><button id="cjOlvidar">olvidar desconectadas</button></div></div>
    </section>
    <section id="cjPal" class="ctl-only" style="margin-top:0;border-top:0">
      <h3>paleta de fondo <span>laptop maestra</span></h3>
      <div class="fila"><select id="cjPalSel"></select>
        <span id="cjPalCustom" style="display:none"><input type="color" id="cjC1" value="#1d3557"> → <input type="color" id="cjC2" value="#e9c46a"></span></div>
      <div id="cjPalVista" style="height:10px;border-radius:3px;margin-top:7px;border:1px solid var(--line)"></div>
    </section>
    <section style="border-bottom:0">
      <details id="cjCfg"><summary id="cjCfgRes"></summary>
        <label>tu nombre</label><input type="text" id="cjNombre" maxlength="24" style="width:100%">
        <label>servidor (ip:puerto)</label>
        <div style="display:flex;gap:6px"><input type="text" id="cjHost" placeholder="192.168.1.10:8080" style="flex:1">
          <button id="cjConectar">conectar</button></div>
        <div class="dim" style="font-size:10.5px;margin-top:6px">Si abriste esta página desde el servidor (http://…:8080) no hay nada que configurar.</div>
      </details>
    </section>`;
  main.appendChild(panel);

  /* marca de laptop maestra junto al título y en la portada */
  const h1 = document.querySelector("header h1");
  if (h1) h1.insertAdjacentHTML("afterend", `<span id="cjMaestraTag" class="cj-chip" title="esta laptop corre el servidor y controla reloj, posición y paleta">MAESTRA</span>`);
  const caja = document.querySelector("#splash .box h2");
  if (caja) caja.insertAdjacentHTML("afterend", `<div id="cjSplashMaestra"><span class="cj-chip">LAPTOP MAESTRA</span>
    <span style="color:var(--dim);font-size:12px;margin-left:8px">esta laptop corre el servidor y controla reloj, posición y paleta</span></div>`);

  /* botón en la barra superior para mostrar u ocultar el panel */
  const btn = document.createElement("button");
  btn.id = "cjBtn"; btn.title = "panel del conjunto: reloj de la obra y estado de la conexión (clic para mostrar u ocultar)";
  btn.innerHTML = `<span class="p"></span><span id="cjBtnReloj">00:00</span>`;
  const ref = $("btnPulso"); ref.parentNode.insertBefore(btn, ref);
  btn.onclick = () => { mostrarPanel(panel.hidden); ls.set("panel", panel.hidden ? "0" : "1"); };
  mostrarPanel(ls.get("panel") !== "0");

  /* los campos de texto no deben disparar el instrumento (espacio, números, flechas) */
  panel.querySelectorAll("input[type=text],input[type=number]").forEach(inp => {
    ["keydown", "keyup", "keypress"].forEach(tipo => inp.addEventListener(tipo, e => {
      e.stopPropagation();
      if (tipo === "keydown" && (e.key === "Enter" || e.key === "Escape")) {
        inp.blur();                                    /* al perder el foco se dispara 'change' si hubo cambios */
      }
    }));
  });

  $("cjNombre").value = miNombre;
  $("cjNombre").onchange = () => {
    const n = $("cjNombre").value.trim().slice(0, 24); if (!n) { $("cjNombre").value = miNombre; return; }
    miNombre = n; ls.set("nombre", n); enviar({ t: "nombre", nombre: n }); pintar();
  };
  $("cjHost").value = host;
  const cambiarHost = () => {
    host = normHost($("cjHost").value); $("cjHost").value = host; ls.set("servidor", host);
    reemplazado = false; intento = 0; conectar();
  };
  $("cjHost").onchange = cambiarHost;
  $("cjConectar").onclick = cambiarHost;
  if (sinNombre || !host) $("cjCfg").open = true;

  /* control (solo lo acepta el servidor si la página corre en la laptop servidora) */
  $("cjIni").onclick = () => enviar({ t: "reloj", accion: "iniciar" });
  $("cjDet").onclick = () => enviar({ t: "reloj", accion: "detener" });
  let confirma = -1e9;
  $("cjRei").onclick = () => {
    if (relojBase.estado === "corriendo" && performance.now() - confirma > 3000) {
      confirma = performance.now(); $("cjRei").textContent = "¿seguro? otra vez"; $("cjRei").classList.add("aviso");
      setTimeout(() => { $("cjRei").textContent = "reiniciar"; $("cjRei").classList.remove("aviso"); }, 3000);
      return;
    }
    confirma = -1e9; enviar({ t: "reloj", accion: "reiniciar" });
  };
  const base = () => (tabla && tabla.manual) || Math.round(estadisticas().med || (leer() || {}).patron || 1);
  $("cjMenos").onclick = () => enviar({ t: "manual", patron: Math.max(1, base() - 1) });
  $("cjMas").onclick = () => enviar({ t: "manual", patron: Math.min(53, base() + 1) });
  $("cjMan").onchange = () => { const v = +$("cjMan").value; if (v >= 1 && v <= 53) enviar({ t: "manual", patron: Math.round(v) }); };
  $("cjSoltar").onclick = () => enviar({ t: "manual", patron: null });
  $("cjOlvidar").onclick = () => enviar({ t: "olvidar" });
  let confApagar = -1e9;
  $("cjApagar").onclick = () => {
    if (performance.now() - confApagar > 3000) {
      confApagar = performance.now(); $("cjApagar").textContent = "¿apagar? otra vez"; $("cjApagar").classList.add("aviso");
      setTimeout(() => { $("cjApagar").textContent = "apagar servidor"; $("cjApagar").classList.remove("aviso"); }, 3000);
      return;
    }
    confApagar = -1e9; enviar({ t: "apagar" });
  };

  const mandarGuia = () => {
    const seg = Math.round(+$("cjGuiaSeg").value) || guia.segundos, min = Math.round(+$("cjGuiaMin").value) || guia.minutos;
    enviar({ t: "guia", guia: { modo: $("cjGuiaModo").value, segundos: seg, minutos: min } });
  };
  $("cjGuiaModo").onchange = mandarGuia;
  $("cjGuiaSeg").onchange = mandarGuia;
  $("cjGuiaMin").onchange = mandarGuia;
  sincronizarGuiaCtl();

  const sel = $("cjPalSel");
  sel.innerHTML = `<option value="">sin color</option>` +
    PALETAS.map((p, i) => `<option value="${i}">${esc(p.nombre)}</option>`).join("") +
    `<option value="custom">personalizada…</option>`;
  const mandarPaleta = () => {
    const v = sel.value;
    $("cjPalCustom").style.display = v === "custom" ? "inline" : "none";
    if (v === "") enviar({ t: "paleta", paleta: null });
    else if (v === "custom") enviar({ t: "paleta", paleta: { nombre: "personalizada", colores: [$("cjC1").value, $("cjC2").value] } });
    else enviar({ t: "paleta", paleta: PALETAS[+v] });
  };
  sel.onchange = mandarPaleta;
  $("cjC1").oninput = $("cjC2").oninput = () => { if (sel.value === "custom") mandarPaleta(); };

  addEventListener("resize", () => { firmaTabla = ""; pintarTabla(); });
}

function mostrarPanel(si) {
  const panel = $("cj"), main = document.querySelector("main");
  panel.hidden = !si;
  $("cjBtn").classList.toggle("on", si);
  main.style.gridTemplateColumns = si ? "238px minmax(0,1fr) 280px" : "";
  /* la partitura se redibuja al nuevo ancho con el manejador de resize de la página */
  dispatchEvent(new Event("resize"));
}

const tituloOriginal = document.title;
function construirControl() {
  $("cj").classList.toggle("control", control);
  document.body.classList.toggle("cj-maestra", control && !local);
  document.title = local ? "IN C · ENSAYO" : control ? "IN C · MAESTRA" : tituloOriginal;
  /* sin "http://": la raíz del servidor ya lleva a la obra */
  $("cjDirV").innerHTML = direcciones.length ? direcciones.map(d => esc(d.replace(/^https?:\/\//, ""))).join("<br>")
    : `<span class="dim" style="font-size:12px;font-weight:400">sin red: conecta el Wi-Fi o el cable</span>`;
  pintarPaletaCtl();
}

/* ---------- color de fondo según el patrón propio ---------- */
function aplicarColor() {
  const b = document.body, e = leer();
  if (!paleta || !e) { b.classList.remove("cj-color"); ["--cj-fondo", "--ink", "--ink-rgb", "--act"].forEach(v => b.style.removeProperty(v)); return; }
  const c = colorDe(paleta, e.patron), claro = esClaro(c);
  b.style.setProperty("--cj-fondo", c);
  b.style.setProperty("--ink", claro ? "#0b0d10" : "#f6f8fa");
  b.style.setProperty("--ink-rgb", claro ? "11,13,16" : "246,248,250");
  b.style.setProperty("--act", claro ? "#9e1c10" : "#ffe08a");   /* nota que suena y número en ejecución */
  b.classList.add("cj-color");
}
function gradiente(pal) {
  return "linear-gradient(90deg," + Array.from({ length: 12 }, (_, k) => colorDe(pal, 1 + 52 * k / 11)).join(",") + ")";
}
function pintarPaletaCtl() {
  const v = $("cjPalVista"); if (!v) return;
  v.style.background = paleta ? gradiente(paleta) : "repeating-linear-gradient(45deg,#1b2128 0 6px,#14181d 6px 12px)";
  const sel = $("cjPalSel");
  if (sel && document.activeElement !== sel) {
    if (!paleta) sel.value = "";
    else {
      const i = PALETAS.findIndex(p => p.nombre === paleta.nombre);
      sel.value = i >= 0 ? String(i) : "custom";
      $("cjPalCustom").style.display = i >= 0 ? "none" : "inline";
      if (i < 0) { $("cjC1").value = paleta.colores[0]; $("cjC2").value = paleta.colores[paleta.colores.length - 1]; }
    }
  }
}

/* ---------- estadísticas del conjunto ---------- */
function filas() {
  if (!tabla) return [];
  const e = leer();
  return tabla.interpretes.map(x => x.id === miId && e ? Object.assign({}, x, e, { conectado: true, yo: true }) : x);
}
function estadisticas() {
  /* entran los conectados que tocan patrones; el pulso no avanza por la obra */
  const v = filas().filter(x => x.conectado && !x.pulso).map(x => x.patron).sort((a, b) => a - b);
  if (!v.length) return { n: 0 };
  const n = v.length, a = v[(n - 1) >> 1], b = v[n >> 1];
  const med = (a + b) / 2;                           /* con un número par, el promedio de los dos del medio */
  return { n, min: v[0], max: v[n - 1], d: v[n - 1] - v[0], med, medTxt: medio(med) };
}

/* ---------- pintura ---------- */
function pintar() { pintarRed(); pintarReloj(); pintarTabla(); }

function pintarRed() {
  const red = $("cjRed"), btn = $("cjBtn"), panel = $("cj"); if (!red) return;
  const edad = tabla ? Math.round((performance.now() - tTabla) / 1000) : null;
  let cls = "", html = "";
  if (local) {
    const sims = tabla ? tabla.interpretes.filter(x => x.id !== miId) : [];
    const n = sims.filter(x => !x.pulso).length, conP = sims.some(x => x.pulso);
    cls = "ens";
    html = `<span class="p"></span><b>ENSAYO</b> · sin red · ${n} intérprete${n === 1 ? "" : "s"} simulado${n === 1 ? "" : "s"}${conP ? " y el pulso" : ""}`;
  } else if (reemplazado) {
    cls = "caido";
    html = `<b>OTRA PESTAÑA TOMÓ ESTE LUGAR</b><br>Esta identidad está abierta en otra pestaña o ventana. <button id="cjAqui">reconectar aquí</button>`;
  } else if (!host) {
    html = `<span class="p"></span>sin servidor configurado · la obra suena igual`;
  } else if (conectado) {
    const n = tabla ? tabla.interpretes.filter(x => x.conectado).length : 1;
    cls = "ok"; html = `<span class="p"></span>en línea · ${esc(host)} · ${n} laptop${n === 1 ? "" : "s"}`;
  } else if (!yaConecto) {
    html = `<span class="p"></span>buscando el servidor ${esc(host)}…` +
           (intento > 1 ? `<br>no responde; reintento en ${Math.max(0, Math.ceil((proxIntento - performance.now()) / 1000))} s` : "");
  } else {
    cls = "caido";
    html = `<b>SIN CONEXIÓN CON EL SERVIDOR</b><br>` +
           `reintentando${tReintento ? " en " + Math.max(0, Math.ceil((proxIntento - performance.now()) / 1000)) + " s" : "…"}` +
           (edad !== null ? ` · datos de hace ${edad} s` : "") + `<br>el sonido de esta laptop no se ve afectado`;
  }
  if (red.dataset.h !== html) { red.innerHTML = html; red.dataset.h = html; const b = $("cjAqui"); if (b) b.onclick = () => { reemplazado = false; intento = 0; conectar(); }; }
  red.className = cls;
  const caido = cls === "caido";
  panel.classList.toggle("caido", caido && !!tabla);
  btn.classList.toggle("ok", cls === "ok" || cls === "ens"); btn.classList.toggle("caido", caido);
  $("cjCfgRes").textContent = local ? `tú: ${miNombre} · ensayo  ✎` : `tú: ${miNombre} · servidor ${host || "–"}  ✎`;
}

function msReloj() {
  const b = relojBase;
  return b.estado === "corriendo" ? b.ms + (performance.now() - b.t0) : b.ms;
}
function pintarReloj() {
  const v = $("cjRelojV"); if (!v) return;
  const t = mmss(msReloj());
  const gb = guiaActual();
  v.textContent = t; $("cjBtnReloj").textContent = t + (gb ? " · guía " + gb.patron : "");
  const est = relojBase.estado;
  $("cjRelojEst").textContent = !conectado && yaConecto && est === "corriendo" ? "reloj local"
    : est === "corriendo" ? "corriendo" : est === "detenido" ? "detenido" : "en espera";
  v.style.color = est === "espera" ? "var(--dim)" : "";
  $("cjIni").textContent = est === "detenido" ? "continuar" : "iniciar";
  $("cjIni").disabled = est === "corriendo";
  $("cjDet").disabled = est !== "corriendo";
  $("cjRei").disabled = est === "espera";
}
setInterval(() => { try { pintarReloj(); pintarRed(); pintarGuia(); pintarTabla(); } catch (e) { } }, 250);

/* ---------- guía: en qué patrón deberían estar todos ----------
   La calcula cada navegador con el reloj de la obra, así que sigue sin servidor.
   Modo "fija": cada patrón dura N segundos. Modo "largo": la duración total se
   reparte según la raíz cuadrada del largo de cada patrón, así los patrones
   largos (el 35) reciben más tiempo sin que los cortos se vuelvan un suspiro. */
let largosCache = null;
function largos() {
  if (!largosCache) {
    try { largosCache = PATRONES.map(p => p.reduce((a, e) => a + e[1], 0)); }   /* corcheas; global del script principal */
    catch (e) { largosCache = new Array(53).fill(1); }
  }
  return largosCache;
}
function tramosGuia() {
  if (guia.modo === "fija") return new Array(53).fill(guia.segundos * 1000);
  const w = largos().map(l => Math.sqrt(Math.max(0.5, l))), sw = w.reduce((a, b) => a + b, 0);
  return w.map(x => x / sw * guia.minutos * 60000);
}
function guiaActual() {
  if (!guia || guia.modo === "apagada" || relojBase.estado === "espera") return null;
  const t = msReloj(), d = tramosGuia();
  let acc = 0;
  for (let i = 0; i < 53; i++) {
    if (t < acc + d[i] || i === 52)
      return { patron: i + 1, restante: Math.max(0, acc + d[i] - t), tramo: d[i], dentro: Math.min(d[i], t - acc), fin: i === 52 && t >= acc + d[i] };
    acc += d[i];
  }
}
function sincronizarGuiaCtl() {
  const m = $("cjGuiaModo"); if (!m) return;
  if (document.activeElement !== m) m.value = guia.modo;
  if (document.activeElement !== $("cjGuiaSeg")) $("cjGuiaSeg").value = guia.segundos;
  if (document.activeElement !== $("cjGuiaMin")) $("cjGuiaMin").value = guia.minutos;
  $("cjGuiaFija").style.display = guia.modo === "fija" ? "" : "none";
  $("cjGuiaLargo").style.display = guia.modo === "largo" ? "" : "none";
  const d = tramosGuia();
  let tot = "";
  if (guia.modo === "fija") tot = `53 × ${guia.segundos} s = ${mmss(53 * guia.segundos * 1000)} en total`;
  else if (guia.modo === "largo") {
    const iMin = d.indexOf(Math.min(...d)), iMax = d.indexOf(Math.max(...d));
    tot = `cada patrón dura entre ${mmss(d[iMin])} (el ${iMin + 1}) y ${mmss(d[iMax])} (el ${iMax + 1})`;
  }
  $("cjGuiaTotal").textContent = tot;
}
function pintarGuia() {
  const sec = $("cjGuia"); if (!sec) return;
  sec.hidden = !(control || guia.modo !== "apagada");
  const g = guiaActual(), e = leer();
  $("cjGuiaModoTxt").textContent = guia.modo === "fija" ? `cada ${guia.segundos} s` : guia.modo === "largo" ? `${guia.minutos} min, según el largo` : "apagada";
  if (!g) {
    $("cjGuiaV").textContent = "–";
    $("cjGuiaProx").textContent = guia.modo === "apagada" ? "" : "empieza al iniciar el reloj";
    $("cjGuiaAvance").style.width = "0";
    $("cjGuiaYo").textContent = "";
    return;
  }
  $("cjGuiaV").textContent = g.patron;
  $("cjGuiaProx").textContent = relojBase.estado === "detenido" ? "reloj detenido"
    : g.fin ? "fin de la guía" : g.patron === 53 ? `último patrón · ${mmss(g.restante)}` : `pasa al ${g.patron + 1} en ${mmss(g.restante)}`;
  $("cjGuiaAvance").style.width = (g.dentro / g.tramo * 100).toFixed(1) + "%";
  if (e && !e.pulso) {
    const d = e.patron - g.patron;
    $("cjGuiaYo").innerHTML = `<span style="color:var(--cj-yo)">tú: ${e.patron}</span> <span class="dim">· ` +
      (d === 0 ? "en la guía" : `${Math.abs(d)} ${d > 0 ? "adelante" : "atrás"} de la guía`) + `</span>`;
  } else $("cjGuiaYo").textContent = e && e.pulso ? "tú: pulso" : "";
}

function pintarTabla() {
  if (!$("cj")) return;
  const fs = filas(), st = estadisticas(), e = leer();
  const manual = tabla ? tabla.manual : null;
  const g = guiaActual(), gp = g ? g.patron : null;
  const firma = JSON.stringify([fs, manual, st.n, conectado, gp, paleta && paleta.nombre]) + (e ? e.patron : "");
  if (firma === firmaTabla) return;
  firmaTabla = firma;

  /* posición */
  const pos = manual || st.med || null;
  $("cjPosV").textContent = manual ? String(manual) : st.n ? st.medTxt : "–";
  $("cjTag").textContent = manual ? "MANUAL" : "mediana";
  $("cjTag").className = manual ? "manual" : "";
  $("cjPosDe").textContent = st.n ? `de 53 · ${st.n} laptop${st.n === 1 ? "" : "s"}` : "de 53";
  if (document.activeElement !== $("cjMan")) $("cjMan").value = manual || "";
  $("cjSoltar").disabled = !manual;
  $("cjBarra").innerHTML = barra(st, pos, e, gp);
  if (e && pos && !e.pulso) {
    const d = e.patron - pos, ad = Math.abs(d);
    const txt = ad < 0.25 ? "en la posición del conjunto" : ad === 0.5 ? (d > 0 ? "medio patrón adelante" : "medio patrón atrás")
      : `${medio(ad)} ${d > 0 ? "adelante" : "atrás"}`;
    $("cjYo").innerHTML = `<span style="color:var(--acc2)">tú: ${e.patron}</span> <span class="dim">· ${txt}</span>`;
  } else $("cjYo").innerHTML = e && e.pulso ? `<span class="dim">tú: pulso</span>` : "";

  /* dispersión */
  const dv = $("cjDispV");
  if (st.n >= 1) {
    dv.textContent = st.d; dv.className = "big " + (st.d <= JUNTO ? "junto" : "lejos");
    $("cjMinMax").textContent = `mín ${st.min} · máx ${st.max}`;
    $("cjDispEst").textContent = st.n < 2 ? "una sola laptop" : st.d <= JUNTO ? "junto" : "estirado";
    $("cjDispEst").style.color = st.d <= JUNTO ? "var(--ok)" : "var(--warn)";
    pintarTend(st);
  } else {
    dv.textContent = "–"; dv.className = "big"; $("cjMinMax").textContent = ""; $("cjDispEst").textContent = ""; $("cjTend").textContent = "";
  }

  /* mapa + lista */
  const con = fs.filter(x => x.conectado), son = con.filter(x => x.sonando && !x.pulso).length;
  $("cjCuenta").textContent = !tabla ? "" : conectado ? `${con.length} en línea · ${son} sonando` : `${con.length} según los últimos datos`;
  $("cjMapa").innerHTML = mapa(fs, st, pos, gp);
  const orden = fs.slice().sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"));
  $("cjTabla").tBodies[0].innerHTML = orden.map(x => {
    const cls = (x.yo ? "yo " : "") + (x.conectado ? "" : "off");
    const ico = !x.conectado ? "off" : x.pulso ? "pul" : x.sonando ? "son" : "";
    const d = pos && !x.pulso ? x.patron - pos : null;
    const dt = d === null ? "" : d === 0 ? "·" : (d > 0 ? "+" : "−") + medio(Math.abs(d));
    const tit = !x.conectado ? "sin conexión: último patrón conocido" : x.pulso ? "toca el pulso" : x.sonando ? "sonando" : "en silencio";
    return `<tr class="${cls}" title="${tit}"><td><span class="e ${ico}"></span></td><td class="n">${esc(x.nombre)}${x.yo ? " (tú)" : ""}</td>` +
           `<td class="r">${x.pulso ? "pulso" : x.patron}</td><td class="r dim">${dt}</td></tr>`;
  }).join("") || `<tr><td class="dim" colspan="4">${tabla ? "nadie conectado" : "sin datos del servidor"}</td></tr>`;
  const hayOff = fs.some(x => !x.conectado);
  $("cjOlvidar").disabled = !hayOff;
}

/* ---------- tendencia: ¿el grupo se aprieta o se estira? ----------
   Una muestra de la dispersión por segundo; se compara con la de hace 20 s. */
function pintarTend(st) {
  const el = $("cjTend"); if (!el) return;
  const ahora = performance.now();
  if (!st.n || st.n < 2 || !conectado) { el.textContent = st.n >= 2 ? "sin datos nuevos" : ""; return; }
  const ref = historia.find(h => h.t >= ahora - VENTANA_TEND);
  if (!historia.length || ahora - historia[0].t < VENTANA_TEND - 1500 || !ref) { el.textContent = "midiendo tendencia…"; return; }
  const k = st.d - ref.d;
  el.textContent = k > 0 ? `↗ se estira: +${k} en 20 s` : k < 0 ? `↘ se aprieta: −${-k} en 20 s` : "→ estable en los últimos 20 s";
}
setInterval(() => {
  try {
    const st = estadisticas(), ahora = performance.now();
    if (conectado && st.n >= 2) historia.push({ t: ahora, d: st.d }); else historia.length = 0;
    while (historia.length && ahora - historia[0].t > VENTANA_TEND + 5000) historia.shift();
    pintarTend(st);
  } catch (e) { }
}, 1000);

/* barra de 1 a 53: toda la obra, con la franja mín–máx, la posición y tu patrón */
function barra(st, pos, e, gp) {
  const W = 252, H = 30, x0 = 4, x1 = W - 4, X = p => x0 + (p - 1) / 52 * (x1 - x0);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
  if (paleta) {
    s += `<defs><linearGradient id="cjG">` + Array.from({ length: 12 }, (_, k) =>
      `<stop offset="${k / 11}" stop-color="${colorDe(paleta, 1 + 52 * k / 11)}"/>`).join("") + `</linearGradient></defs>`;
    s += `<rect x="${x0}" y="8" width="${x1 - x0}" height="8" rx="2" fill="url(#cjG)"/>`;
  } else s += `<rect x="${x0}" y="8" width="${x1 - x0}" height="8" rx="2" style="fill:var(--cj-campo)"/>`;
  if (st.n) s += `<rect x="${X(st.min) - 2}" y="5" width="${Math.max(4, X(st.max) - X(st.min) + 4)}" height="14" rx="3" style="fill:var(--cj-band);stroke:var(--cj-bandl)" stroke-width="1"/>`;
  if (pos) s += `<line x1="${X(pos)}" x2="${X(pos)}" y1="2" y2="22" style="stroke:var(--tx)" stroke-width="2"/>`;
  if (gp) s += `<path d="M${X(gp) - 5},0 L${X(gp) + 5},0 L${X(gp)},7 z" style="fill:var(--cj-guia)"/>`;
  if (e && !e.pulso) s += `<path d="M${X(e.patron) - 4},29 L${X(e.patron) + 4},29 L${X(e.patron)},22 z" style="fill:var(--cj-yo)"/>`;
  s += `<text x="${x0}" y="29" style="fill:var(--dim)" font-size="8">1</text><text x="${x1}" y="29" style="fill:var(--dim)" font-size="8" text-anchor="end">53</text>`;
  return s + `</svg>`;
}

/* mapa ampliado: un punto por laptop en su patrón, apilados si coinciden */
function iniciales(n, largo) {
  const p = String(n || "?").trim().split(/[\s\-_.]+/).filter(Boolean);
  if (!p.length) return "?";
  const x = largo ? (p.length > 1 ? p[0].slice(0, 2) + p[1][0] : p[0].slice(0, 3)) : (p.length > 1 ? p[0][0] + p[1][0] : p[0].slice(0, 2));
  return x.toUpperCase();
}
/* dos letras; si dos laptops coinciden (Diego y Director), tres */
function rotulos(lista) {
  const cuenta = {};
  lista.forEach(x => { const k = iniciales(x.nombre); cuenta[k] = (cuenta[k] || 0) + 1; });
  lista.forEach(x => { const k = iniciales(x.nombre); x._ini = cuenta[k] > 1 ? iniciales(x.nombre, true) : k; });
}
function mapa(fs, st, pos, gp) {
  const pts = fs.filter(x => !x.pulso);
  if (!pts.length) return "";
  const W = 252, R = 9, PAD = R + 2;
  rotulos(pts);
  const vals = pts.map(x => x.patron).concat(gp ? [gp] : []);
  let lo = Math.min(...vals) - 2, hi = Math.max(...vals) + 2;
  while (hi - lo < 10) { lo--; hi++; }
  if (lo < 1) { hi += 1 - lo; lo = 1; } if (hi > 53) { lo = Math.max(1, lo - (hi - 53)); hi = 53; }
  const X = p => PAD + (p - lo) / (hi - lo) * (W - 2 * PAD);
  /* apilado: primera fila libre donde no choque con un punto vecino */
  const orden = pts.slice().sort((a, b) => a.patron - b.patron || (a.nombre || "").localeCompare(b.nombre || ""));
  const ult = [];
  orden.forEach(x => {
    const cx = X(x.patron); let f = 0;
    while (ult[f] !== undefined && cx - ult[f] < 2 * R + 1) f++;
    ult[f] = cx; x._cx = cx; x._f = f;
  });
  const filasN = Math.max(1, ult.length), top = 4, alto = top + filasN * (2 * R + 2) + 16;
  const yDe = f => top + alto - 20 - f * (2 * R + 2) - R;
  let s = `<svg viewBox="0 0 ${W} ${alto}" width="${W}" height="${alto}">`;
  if (st.n) s += `<rect x="${X(st.min) - R - 1}" y="1" width="${X(st.max) - X(st.min) + 2 * R + 2}" height="${alto - 15}" rx="4" style="fill:var(--cj-band);stroke:var(--cj-bandl);fill-opacity:.5"/>`;
  if (pos) s += `<line x1="${X(pos)}" x2="${X(pos)}" y1="0" y2="${alto - 13}" style="stroke:var(--tx)" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>`;
  if (gp) s += `<line x1="${X(gp)}" x2="${X(gp)}" y1="0" y2="${alto - 13}" style="stroke:var(--cj-guia)" stroke-width="2.5"/>`;
  const paso = (W - 2 * PAD) / (hi - lo) >= 15 ? 1 : (W - 2 * PAD) / (hi - lo) >= 7 ? 2 : 5;
  for (let p = lo; p <= hi; p++) {
    const mayor = p % paso === 0 || p === lo || p === hi;
    s += `<line x1="${X(p)}" x2="${X(p)}" y1="${alto - 14}" y2="${alto - (mayor ? 10 : 12)}" style="stroke:var(--line)"/>`;
    if (p % paso === 0 && (p - lo) >= paso / 2 && (hi - p) >= paso / 2 || p === lo || p === hi)
      s += `<text x="${X(p)}" y="${alto - 2}" style="fill:var(--dim)" font-size="8" text-anchor="middle">${p}</text>`;
  }
  orden.forEach(x => {
    const cy = yDe(x._f), col = paleta ? colorDe(paleta, x.patron) : null;
    let fill, stroke, sw = 1.4, txt, op = 1;
    if (!x.conectado) { fill = "none"; stroke = "#4a535e"; txt = "#6b7582"; }
    else if (col) { fill = col; txt = esClaro(col) ? "#0b0d10" : "#f4f6f8"; stroke = "var(--tx)"; sw = x.sonando ? 2 : .8; op = x.sonando ? 1 : .75; }
    else if (x.sonando) { fill = "#dfe5ec"; stroke = "#dfe5ec"; txt = "#0b0d10"; }
    else { fill = "#14181d"; stroke = "#8b97a6"; txt = "#dfe5ec"; }
    if (x.yo) { stroke = "var(--cj-yo)"; sw = 2.8; }
    s += `<g opacity="${op}"><title>${esc(x.nombre)} · patrón ${x.patron}${x.conectado ? "" : " (sin conexión)"}</title>` +
         `<circle cx="${x._cx}" cy="${cy}" r="${R}" style="fill:${fill};stroke:${stroke}" stroke-width="${sw}"${x.conectado ? "" : ` stroke-dasharray="2 2"`}/>` +
         `<text x="${x._cx}" y="${cy + 3}" fill="${txt}" font-size="${x._ini.length > 2 ? 6.4 : 8}" font-weight="700" text-anchor="middle">${esc(x._ini)}</text></g>`;
  });
  return s + `</svg>`;
}

/* ---------- ensayo: lo usa ensayo.js ----------
   srv = { conectar(fn), recibir(mensaje) }: recibe lo que se le mandaría al
   servidor y contesta llamando a fn con los mismos mensajes del servidor. */
window.InCConjunto = {
  ensayo(srv) {
    if (local) return;
    clearTimeout(tReintento); tReintento = null;
    soltarSocket();
    local = srv;
    reemplazado = false; conectado = true; yaConecto = true; intento = 0; ultimoMsg = performance.now();
    document.body.classList.add("cj-ensayo");
    srv.conectar(entrante);
    const e = leer() || { patron: 1, sonando: false, pulso: false };
    enviado = e;
    enviar(Object.assign({ t: "hola", id: miId, nombre: miNombre }, e));
    mostrarPanel(true);
    firmaTabla = ""; pintar();
  },
};

/* ---------- arranque ---------- */
try {
  construir();
  pintar();
  conectar();
} catch (e) { console.warn("conjunto: no se pudo iniciar el panel", e); }
})();
