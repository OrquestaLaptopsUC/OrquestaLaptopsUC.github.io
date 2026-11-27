/* ============================================================
   ENJAMBRES 2 · ui
   Orquesta de Laptops UC (OLUC) · IEE2003

   Controles compartidos por la maestra y las laptops:
     · Pad: control 2D que mueve dos parámetros a la vez;
     · PADS: los seis pads de la versión 2 y su traducción a parámetros
       del modelo. Tres son de COMPORTAMIENTO del sub-enjambre
       (MOVIMIENTO, FORMA, SINCRONÍA) y tres de SONIDO (REGISTRO, TIMBRE,
       PULSO). El séptimo control 2D es el escenario mismo: arrastrar en
       el semicírculo mueve el IMÁN del sub-enjambre (ver las páginas);
     · Segmentos: botones de opción (voz, mapeo);
     · lectura de la partitura: qué mensajes valen ahora y cuál viene.
   ============================================================ */
(function (raiz) {
"use strict";
const { PARAMS } = raiz.Enjambres;
const P = k => PARAMS.find(p => p.k === k);

/* ---------- parámetro ↔ [0,1] ---------- */
function norm(p, v) {
  const u = p.log ? Math.log(v / p.min) / Math.log(p.max / p.min) : (v - p.min) / (p.max - p.min);
  return Math.max(0, Math.min(1, u));
}
function denorm(p, u) {
  const v = p.log ? p.min * Math.pow(p.max / p.min, u) : p.min + u * (p.max - p.min);
  const d = p.paso >= 1 ? 0 : p.paso >= 0.1 ? 1 : p.paso >= 0.01 ? 2 : 3;
  return +v.toFixed(d);
}

/* ---------- los seis pads ----------
   REGISTRO no es un par de parámetros sino una vista de f mín y f máx:
   x = centro (media geométrica, de 60 Hz a 6 kHz), y = ancho (de ½ a 7 octavas).
   'medio': el eje y es bipolar y se marca su cero.                              */
const C_MIN = 60, C_MAX = 6000, W_MIN = 0.5, W_MAX = 7;
const PADS = [
  { k: "movimiento", grupo: "c", nombre: "MOVIMIENTO", px: "vNoise", py: "vel",
    x: ["orden", "caos"], y: ["lento", "rápido"] },
  { k: "forma", grupo: "c", nombre: "FORMA", px: "radio", py: "coh", medio: true,
    x: ["vecindad chica", "grande"], y: ["se separan", "se juntan"] },
  { k: "sincronia", grupo: "c", nombre: "SINCRONÍA", px: "b1", py: "b2",
    x: ["converge lento", "rápido"], y: ["colectivo", "individual"] },
  { k: "registro", grupo: "s", nombre: "REGISTRO", params: ["fmin", "fmax"],
    x: ["grave", "agudo"], y: ["estrecho", "ancho"] },
  { k: "timbre", grupo: "s", nombre: "TIMBRE", px: "color", py: "nivel",
    x: ["puro", "complejo"], y: ["suave", "fuerte"] },
  { k: "pulso", grupo: "s", nombre: "PULSO", px: "pulso", py: "kfase",
    x: ["lento", "rápido"], y: ["cada uno", "en fase"] },
];
const SIMB = { vNoise: "η₁", vel: "v₀", radio: "R", coh: "forma", b1: "β₁", b2: "β₂", color: "color", nivel: "dB", pulso: "Hz", kfase: "fase" };
const paramsDePad = d => d.params || [d.px, d.py];

function padDeValores(d, v) {
  if (d.k === "registro") {
    const c = Math.sqrt(v.fmin * v.fmax), w = Math.log2(Math.max(v.fmax, v.fmin) / Math.min(v.fmax, v.fmin));
    return { x: Math.max(0, Math.min(1, Math.log(c / C_MIN) / Math.log(C_MAX / C_MIN))),
             y: Math.max(0, Math.min(1, (w - W_MIN) / (W_MAX - W_MIN))) };
  }
  return { x: norm(P(d.px), v[d.px]), y: norm(P(d.py), v[d.py]) };
}
function valoresDePad(d, x, y) {
  if (d.k === "registro") {
    const c = C_MIN * Math.pow(C_MAX / C_MIN, x), w = W_MIN + y * (W_MAX - W_MIN);
    const fmin = Math.round(Math.max(30, Math.min(10000, c / Math.pow(2, w / 2))));
    const fmax = Math.round(Math.max(30, Math.min(12000, c * Math.pow(2, w / 2))));
    return { fmin, fmax };
  }
  if (d.medio && Math.abs(y - 0.5) < 0.035) y = 0.5;            /* el cero se deja atrapar */
  return { [d.px]: denorm(P(d.px), x), [d.py]: denorm(P(d.py), y) };
}
function textoPad(d, v) {
  if (d.k === "registro") return `${Math.round(v.fmin)}–${Math.round(v.fmax)} Hz`;
  const f = k => { const p = P(k), x = +v[k]; return p.paso >= 1 ? Math.round(x) : x.toFixed(p.paso >= 0.1 ? 1 : 2); };
  const uno = k => k === "nivel" ? `${f(k)} dB` : k === "pulso" ? `${f(k)} Hz` : `${SIMB[k]} ${f(k)}`;
  return uno(d.px) + " · " + uno(d.py);
}

/* ---------- Pad: control 2D ----------
   opc: {alCambiar(x, y), color}
   habilitar(hx, hy, aviso): qué ejes se pueden mover (un eje fijo se dibuja punteado).
   fantasmas([{x, y, color, etiqueta}]): otros puntos, p. ej. los valores de cada laptop. */
function Pad(cont, d, opc) {
  opc = opc || {};
  this.d = d; this.x = 0.5; this.y = 0.5; this.hx = true; this.hy = true; this.fant = []; this.aviso = "";
  this.color = opc.color || "#e8b25a"; this.rastro = [];
  const el = this.el = document.createElement("div");
  el.className = "pad";
  el.innerHTML = `<div class="padCab"><b>${d.nombre}</b></div><canvas></canvas><div class="padVal"></div>`;
  cont.appendChild(el);
  this.cab = el.querySelector(".padCab"); this.val = el.querySelector(".padVal");
  this.cv = el.querySelector("canvas"); this.g = this.cv.getContext("2d");
  new ResizeObserver(() => this.dibujar()).observe(this.cv);
  let arrastrando = false;
  const mover = e => {
    const r = this.cv.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const y = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
    if (this.hx) this.x = x;
    if (this.hy) this.y = y;
    this.rastro.push([this.x, this.y]); if (this.rastro.length > 24) this.rastro.shift();
    this.dibujar();
    if (opc.alCambiar) opc.alCambiar(this.x, this.y);
  };
  this.cv.addEventListener("pointerdown", e => {
    if (!this.hx && !this.hy) return;
    arrastrando = true; this.tocando = true; this.rastro = []; this.cv.setPointerCapture(e.pointerId); mover(e);
  });
  this.cv.addEventListener("pointermove", e => { if (arrastrando) mover(e); });
  const soltar = () => { arrastrando = false; this.tocando = false; this.rastro = []; this.dibujar(); };
  this.cv.addEventListener("pointerup", soltar);
  this.cv.addEventListener("pointercancel", soltar);
}
Pad.prototype.fijar = function (x, y, texto) {
  if (this.tocando) return;            /* no pisar lo que la mano está moviendo */
  const cambio = Math.abs(x - this.x) > 1e-4 || Math.abs(y - this.y) > 1e-4;
  this.x = x; this.y = y;
  if (texto != null && this.val.textContent !== texto) this.val.textContent = texto;
  if (cambio) this.dibujar();
};
Pad.prototype.texto = function (t) { this.val.textContent = t; };
Pad.prototype.colorear = function (c) { if (c && c !== this.color) { this.color = c; this.dibujar(); } };
Pad.prototype.habilitar = function (hx, hy, aviso) {
  aviso = aviso || "";
  if (hx === this.hx && hy === this.hy && aviso === this.aviso) return;
  this.hx = hx; this.hy = hy; this.aviso = aviso;
  this.el.classList.toggle("bloqueado", !hx && !hy);
  this.dibujar();
};
Pad.prototype.fantasmas = function (f) {
  f = f || [];
  const firma = f.map(q => q.etiqueta + ":" + q.x.toFixed(3) + ":" + q.y.toFixed(3)).join("|");
  if (firma === this._firmaF) return;
  this._firmaF = firma; this.fant = f; this.dibujar();
};
Pad.prototype.dibujar = function () {
  const cv = this.cv, g = this.g, dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H) return;
  if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
  const n = parseInt(this.color.slice(1), 16), col = a => `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  const on = this.hx || this.hy, X = this.x * W, Y = (1 - this.y) * H, d = this.d;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  g.fillStyle = "#0c1119"; g.fillRect(0, 0, W, H);
  if (on) {                              /* un resplandor que sigue al punto */
    const gr = g.createRadialGradient(X, Y, 0, X, Y, Math.max(W, H) * 0.75);
    gr.addColorStop(0, col(0.22)); gr.addColorStop(1, col(0));
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
  g.strokeStyle = "rgba(130,160,200,.08)"; g.lineWidth = 1;
  for (const f of [0.25, 0.5, 0.75]) {
    g.beginPath(); g.moveTo(f * W, 0); g.lineTo(f * W, H); g.stroke();
    g.beginPath(); g.moveTo(0, f * H); g.lineTo(W, f * H); g.stroke();
  }
  if (d.medio) { g.strokeStyle = "rgba(130,160,200,.3)"; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke(); g.setLineDash([]); }
  /* rótulos de los ejes */
  g.fillStyle = "#62708a"; g.font = "9.5px ui-sans-serif,system-ui,sans-serif";
  g.textBaseline = "bottom"; g.textAlign = "left"; g.fillText(d.x[0], 5, H - 4);
  g.textAlign = "right"; g.fillText(d.x[1] + " →", W - 5, H - 4);
  g.textAlign = "left"; g.textBaseline = "top"; g.fillText("↑ " + d.y[1], 5, 5);
  g.textBaseline = "bottom"; g.fillText(d.y[0], 5, H - 17);
  /* fantasmas */
  for (const f of this.fant) {
    const fx = f.x * W, fy = (1 - f.y) * H;
    g.fillStyle = f.color; g.globalAlpha = 0.8;
    g.beginPath(); g.arc(fx, fy, 6, 0, 2 * Math.PI); g.fill();
    if (f.etiqueta) { g.globalAlpha = 1; g.fillStyle = "#0c1017"; g.font = "700 8px ui-sans-serif,system-ui,sans-serif";
                      g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(f.etiqueta, fx, fy + 0.5); }
    g.globalAlpha = 1;
  }
  /* rastro del gesto */
  if (this.rastro.length > 1) {
    g.strokeStyle = col(0.45); g.lineWidth = 2; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath();
    this.rastro.forEach((p, i) => { const x = p[0] * W, y = (1 - p[1]) * H; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
    g.stroke();
  }
  /* el punto */
  g.strokeStyle = on ? col(0.4) : "rgba(139,151,166,.3)"; g.lineWidth = 1;
  g.setLineDash(this.hx ? [] : [3, 3]); g.beginPath(); g.moveTo(X, 0); g.lineTo(X, H); g.stroke();
  g.setLineDash(this.hy ? [] : [3, 3]); g.beginPath(); g.moveTo(0, Y); g.lineTo(W, Y); g.stroke();
  g.setLineDash([]);
  if (on) { g.fillStyle = col(0.25); g.beginPath(); g.arc(X, Y, 15, 0, 2 * Math.PI); g.fill(); }
  g.fillStyle = on ? this.color : "#6f7b8a";
  g.beginPath(); g.arc(X, Y, 7.5, 0, 2 * Math.PI); g.fill();
  g.strokeStyle = "#0c1017"; g.lineWidth = 2; g.stroke();
  if (this.aviso) {
    g.fillStyle = "rgba(8,11,16,.68)"; g.fillRect(0, H / 2 - 11, W, 22);
    g.fillStyle = "#c9d2dc"; g.font = "10.5px ui-sans-serif,system-ui,sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(this.aviso, W / 2, H / 2);
  }
};

/* ---------- Segmentos: botones de opción ---------- */
function Segmentos(cont, opciones, nombres, alCambiar) {
  const el = this.el = document.createElement("div");
  el.className = "segmentos";
  this.botones = opciones.map(o => {
    const b = document.createElement("button");
    b.textContent = nombres[o] || o; b.dataset.v = o;
    b.onclick = () => { if (!b.disabled) { this.fijar(o); alCambiar(o); } };
    el.appendChild(b); return b;
  });
  cont.appendChild(el);
}
Segmentos.prototype.fijar = function (v) { for (const b of this.botones) b.classList.toggle("on", b.dataset.v === v); };
Segmentos.prototype.habilitar = function (si) { for (const b of this.botones) b.disabled = !si; this.el.classList.toggle("bloqueado", !si); };

/* qué hace el eje x del pad TIMBRE (color) en cada voz */
const AYUDA_VOZ = {
  seno: "un seno por agente, como en la versión 1 (el color no actúa)",
  ring: "color = profundidad del anillo con la moduladora",
  fm: "color = índice de FM; la turbulencia local abre el espectro",
  resonador: "ruido filtrado: color = cuánto silba; el desorden lo vuelve soplo",
  pulsos: "un grano por ciclo de fase: color = largo del grano; ver pad PULSO",
};

/* ---------- partitura: qué vale ahora ---------- */
const mmss = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
/* num: la laptop que mira (null = todas, como la maestra) */
function mensajesEn(partitura, ms, num) {
  const evs = (partitura && partitura.eventos || []).filter(e => num == null || e.para === "todos" || e.para === num)
    .slice().sort((a, b) => a.t - b.t);
  const s = ms / 1000;
  const actuales = evs.filter(e => s >= e.t && s < e.t + e.dur);
  const prox = evs.find(e => e.t > s);
  return { actuales, proximo: prox ? { ev: prox, faltaMs: (prox.t - s) * 1000 } : null };
}
/* El reloj llega como ms transcurridos; cada página suma su propio tiempo desde que lo recibió. */
function RelojLocal() { this.estado = "espera"; this.ms = 0; this.t = performance.now(); }
RelojLocal.prototype.recibir = function (m) { this.estado = m.estado; this.ms = m.ms; this.t = performance.now(); };
RelojLocal.prototype.ahora = function () { return this.estado === "corriendo" ? this.ms + (performance.now() - this.t) : this.ms; };

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, {
  Pad, PADS, paramsDePad, padDeValores, valoresDePad, textoPad, Segmentos, AYUDA_VOZ, norm, denorm, mensajesEn, mmss, RelojLocal });
})(typeof self !== "undefined" ? self : globalThis);
