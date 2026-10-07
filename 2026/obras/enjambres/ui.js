/* ============================================================
   ENJAMBRES · ui
   Orquesta de Laptops UC (OLUC) · IEE2003

   Controles compartidos por la maestra y las laptops:
     · Pad: control 2D que mueve dos parámetros a la vez;
     · PADS: los cuatro pads de la obra (MOVIMIENTO, COHESIÓN, REGISTRO,
       TIMBRE) y su traducción a parámetros del modelo;
     · Segmentos: botones de opción (mapeo, moduladora);
     · lectura de la partitura: qué mensajes valen ahora y cuál viene.
   ============================================================ */
(function (raiz) {
"use strict";
const { PARAMS } = raiz.Enjambres;

/* estilos de los controles, iguales en ambas páginas */
if (raiz.document && !document.getElementById("estilosUi")) {
  const st = document.createElement("style"); st.id = "estilosUi";
  st.textContent = `
  .pads{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .pad{display:flex;flex-direction:column;gap:3px;min-width:0}
  .pad .padCab{display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:10.5px;letter-spacing:.12em;min-height:18px}
  .pad .padCab b{font-weight:600}
  .pad .padVal{color:#8b97a6;letter-spacing:0;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}
  .pad canvas{width:100%;aspect-ratio:1/1;display:block;border:1px solid #232a32;border-radius:5px;touch-action:none;cursor:crosshair}
  .pad.bloqueado canvas{cursor:not-allowed}
  .pad .candPad{font-size:9px;letter-spacing:.1em;padding:1px 6px;border-radius:3px;cursor:pointer;border:1px solid}
  .pad .candPad.ret{background:#2b2214;border-color:#6d5427;color:#e8b25a}
  .pad .candPad.ced{background:#15202b;border-color:#2c4660;color:#8cc0f0}
  .pad .candPad.mixto{background:#1b2128;border-color:#3a4552;color:#c9d2dc}
  .segmentos{display:flex;gap:0;border:1px solid #232a32;border-radius:5px;overflow:hidden}
  .segmentos button{flex:1;border:0;border-radius:0;border-right:1px solid #232a32;padding:6px 4px;font-size:11.5px}
  .segmentos button:last-child{border-right:0}
  .segmentos button.on{background:#e8b25a;color:#1a1204;font-weight:700}
  .segmentos.bloqueado{opacity:.45}
  details.avanzado>summary{cursor:pointer;color:#8b97a6;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:4px 0}
  `;
  document.head.appendChild(st);
}
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

/* ---------- los cuatro pads ----------
   REGISTRO no es un par de parámetros sino una vista de f mín y f máx:
   x = centro (media geométrica, de 60 Hz a 6 kHz), y = ancho (de ½ a 7 octavas). */
const C_MIN = 60, C_MAX = 6000, W_MIN = 0.5, W_MAX = 7;
const PADS = [
  { k: "movimiento", nombre: "MOVIMIENTO", px: "vNoise", py: "vel",
    x: ["orden", "caos"], y: ["lento", "rápido"] },
  { k: "cohesion", nombre: "COHESIÓN", px: "radio", py: "b1",
    x: ["vecindad chica", "grande"], y: ["converge lento", "rápido"] },
  { k: "registro", nombre: "REGISTRO", params: ["fmin", "fmax"],
    x: ["grave", "agudo"], y: ["estrecho", "ancho"] },
  { k: "timbre", nombre: "TIMBRE", px: "ring", py: "nivel",
    x: ["seno puro", "ring"], y: ["suave", "fuerte"] },
];
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
  return { [d.px]: denorm(P(d.px), x), [d.py]: denorm(P(d.py), y) };
}
function textoPad(d, v) {
  const f = (k) => { const p = P(k), x = v[k]; return p.paso >= 1 ? Math.round(x) : (+x).toFixed(p.paso >= 0.1 ? 1 : 2); };
  if (d.k === "registro") return `${Math.round(v.fmin)}–${Math.round(v.fmax)} Hz`;
  if (d.k === "timbre") return `ring ${f("ring")} · ${f("nivel")} dB`;
  if (d.k === "movimiento") return `η₁ ${f("vNoise")} · v₀ ${f("vel")}`;
  return `R ${f("radio")} · β₁ ${f("b1")}`;
}

/* ---------- Pad: control 2D ----------
   opc: {alCambiar(x, y), candado(boton) opcional}
   habilitar(hx, hy): qué ejes se pueden mover (un eje fijo se dibuja punteado).
   fantasmas([{x, y, color, etiqueta}]): otros puntos, p. ej. los valores de cada laptop. */
function Pad(cont, d, opc) {
  opc = opc || {};
  this.d = d; this.x = 0.5; this.y = 0.5; this.hx = true; this.hy = true; this.fant = []; this.aviso = "";
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
    this.dibujar();
    if (opc.alCambiar) opc.alCambiar(this.x, this.y);
  };
  this.cv.addEventListener("pointerdown", e => {
    if (!this.hx && !this.hy) return;
    arrastrando = true; this.tocando = true; this.cv.setPointerCapture(e.pointerId); mover(e);
  });
  this.cv.addEventListener("pointermove", e => { if (arrastrando) mover(e); });
  const soltar = () => { arrastrando = false; this.tocando = false; };
  this.cv.addEventListener("pointerup", soltar);
  this.cv.addEventListener("pointercancel", soltar);
}
Pad.prototype.fijar = function (x, y, texto) {
  if (this.tocando) return;            /* no pisar lo que la mano está moviendo */
  this.x = x; this.y = y;
  if (texto != null) this.val.textContent = texto;
  this.dibujar();
};
Pad.prototype.texto = function (t) { this.val.textContent = t; };
Pad.prototype.habilitar = function (hx, hy, aviso) {
  this.hx = hx; this.hy = hy; this.aviso = aviso || "";
  this.el.classList.toggle("bloqueado", !hx && !hy);
  this.dibujar();
};
Pad.prototype.fantasmas = function (f) { this.fant = f || []; this.dibujar(); };
Pad.prototype.dibujar = function () {
  const cv = this.cv, g = this.g, dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H) return;
  if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  g.fillStyle = "#0f141a"; g.fillRect(0, 0, W, H);
  g.strokeStyle = "#1d252e"; g.lineWidth = 1;
  for (const f of [0.25, 0.5, 0.75]) {
    g.beginPath(); g.moveTo(f * W, 0); g.lineTo(f * W, H); g.stroke();
    g.beginPath(); g.moveTo(0, f * H); g.lineTo(W, f * H); g.stroke();
  }
  /* rótulos de los ejes */
  const d = this.d;
  g.fillStyle = "#5b6775"; g.font = "10px ui-monospace,Menlo,monospace";
  g.textBaseline = "bottom"; g.textAlign = "left"; g.fillText(d.x[0], 4, H - 3);
  g.textAlign = "right"; g.fillText(d.x[1] + " →", W - 4, H - 3);
  g.textAlign = "left"; g.textBaseline = "top"; g.fillText("↑ " + d.y[1], 4, 4);
  g.textBaseline = "bottom"; g.fillText(d.y[0], 4, H - 16);
  /* fantasmas */
  for (const f of this.fant) {
    const X = f.x * W, Y = (1 - f.y) * H;
    g.fillStyle = f.color; g.globalAlpha = 0.75;
    g.beginPath(); g.arc(X, Y, 5, 0, 2 * Math.PI); g.fill();
    if (f.etiqueta) { g.globalAlpha = 1; g.fillStyle = "#10131a"; g.font = "bold 8px ui-monospace,Menlo,monospace";
                      g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(f.etiqueta, X, Y + 0.5); }
    g.globalAlpha = 1;
  }
  /* el punto */
  const X = this.x * W, Y = (1 - this.y) * H, on = this.hx || this.hy;
  g.strokeStyle = on ? "rgba(232,178,90,.45)" : "rgba(139,151,166,.35)"; g.lineWidth = 1;
  g.setLineDash(this.hx ? [] : [3, 3]); g.beginPath(); g.moveTo(X, 0); g.lineTo(X, H); g.stroke();
  g.setLineDash(this.hy ? [] : [3, 3]); g.beginPath(); g.moveTo(0, Y); g.lineTo(W, Y); g.stroke();
  g.setLineDash([]);
  g.fillStyle = on ? "#e8b25a" : "#6f7b8a";
  g.beginPath(); g.arc(X, Y, 8, 0, 2 * Math.PI); g.fill();
  g.strokeStyle = "#10131a"; g.lineWidth = 2; g.stroke();
  if (this.aviso) {
    g.fillStyle = "rgba(11,13,16,.6)"; g.fillRect(0, H / 2 - 11, W, 22);
    g.fillStyle = "#c9d2dc"; g.font = "11px ui-monospace,Menlo,monospace"; g.textAlign = "center"; g.textBaseline = "middle";
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
  Pad, PADS, paramsDePad, padDeValores, valoresDePad, textoPad, Segmentos, norm, denorm, mensajesEn, mmss, RelojLocal });
})(typeof self !== "undefined" ? self : globalThis);
