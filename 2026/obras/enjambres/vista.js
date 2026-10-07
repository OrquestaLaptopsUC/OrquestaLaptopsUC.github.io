/* ============================================================
   ENJAMBRES · vista
   Orquesta de Laptops UC (OLUC) · IEE2003

   Dibujo del semicírculo y espectrograma, compartidos por la página de
   la maestra y la de cada laptop. Todo sale del cuadro binario que
   difunde la maestra (protocolo.js, ya decodificado), nunca del modelo.

   info: Map num → {color, ef:{radio, nivel}}   (para opacidad y radios)
   ============================================================ */
(function (raiz) {
"use strict";

const R_LAP = 1.09;                  /* las laptops se dibujan apenas fuera del arco */
const dbLin = db => Math.pow(10, db / 20);
function alfa(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
const etiqueta = num => num === 0 ? "M" : String(num);

function Vista(lienzo) {
  this.lienzo = lienzo; this.g = lienzo.getContext("2d");
  this.W = 0; this.H = 0; this.dpr = 1; this.esc = 1; this.cx = 0; this.cy = 0;
  new ResizeObserver(() => this.medir()).observe(lienzo);
  this.medir();
}
Vista.prototype.medir = function () {
  const dpr = this.dpr = window.devicePixelRatio || 1;
  const r = this.lienzo.getBoundingClientRect();
  this.W = r.width; this.H = r.height;
  this.lienzo.width = Math.round(this.W * dpr); this.lienzo.height = Math.round(this.H * dpr);
  const m = 34;
  this.esc = Math.max(10, Math.min((this.W - 2 * m) / (2 * R_LAP), (this.H - 2 * m - 26) / (R_LAP + 0.02)));
  this.cx = this.W / 2;
  this.cy = Math.min(this.H - m - 16, (this.H + R_LAP * this.esc) / 2 + 10);
};
Vista.prototype.aX = function (x) { return this.cx + x * this.esc; };
Vista.prototype.aY = function (y) { return this.cy - y * this.esc; };
Vista.prototype.pos = function (e) { const r = this.lienzo.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
/* ángulo en el arco del punto (X, Y) de la pantalla, acotado a [0, π] */
Vista.prototype.fiDe = function (X, Y) {
  let fi = Math.atan2(this.cy - Y, X - this.cx);
  if (fi < 0) fi = fi < -Math.PI / 2 ? Math.PI : 0;
  return fi;
};

/* laptops del cuadro; 'mover' = {n, fi}: una en su posición local (mientras se arrastra) */
Vista.prototype.laptops = function (cuadro, mover) {
  if (!cuadro) return [];
  return cuadro.laptops.map(l => mover && mover.n === l.n && mover.fi != null ? Object.assign({}, l, { fi: mover.fi }) : l);
};
Vista.prototype.laptopEn = function (cuadro, X, Y, mover) {
  let mejor = null, dm = 18;
  for (const l of this.laptops(cuadro, mover)) {
    const d = Math.hypot(X - this.aX(R_LAP * Math.cos(l.fi)), Y - this.aY(R_LAP * Math.sin(l.fi)));
    if (d < dm) { dm = d; mejor = l.n; }
  }
  return mejor;
};
Vista.prototype.agenteEn = function (cuadro, X, Y) {
  if (!cuadro) return null;
  const A = cuadro.agentes, C = cuadro.campos.length;
  let mejor = null, dm = 10;
  for (let i = 0; i < A.length; i += C) {
    const d = Math.hypot(X - this.aX(A[i + 2]), Y - this.aY(A[i + 3]));
    if (d < dm) { dm = d; mejor = { id: A[i], dueno: A[i + 1] }; }
  }
  return mejor;
};

/* opc: {info, elegida, resaltar:[nums], lineas, radios, mover:{n,fi}, vacio:[línea1, línea2], atenuar} */
Vista.prototype.dibujar = function (cuadro, opc) {
  opc = opc || {};
  const g = this.g, esc = this.esc, cx = this.cx, cy = this.cy, aX = x => this.aX(x), aY = y => this.aY(y);
  const info = opc.info || new Map(), elegida = opc.elegida, resaltar = opc.resaltar || [];
  const { dbap, puntosDeSalida } = raiz.Enjambres;
  const amplitudVisible = (A, dueno) => { const l = info.get(dueno); return Math.min(1, l && l.ef ? A / dbLin(l.ef.nivel) : A); };

  g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  g.clearRect(0, 0, this.W, this.H);
  g.globalAlpha = opc.atenuar ? 0.35 : 1;
  g.beginPath(); g.moveTo(aX(-1), aY(0)); g.arc(cx, cy, esc, Math.PI, 0); g.closePath();
  g.fillStyle = "#0f141a"; g.fill();
  g.strokeStyle = "#3a4552"; g.lineWidth = 1.5; g.stroke();
  g.strokeStyle = "#1a2129"; g.lineWidth = 1;
  for (const rr of [0.33, 0.66]) { g.beginPath(); g.arc(cx, cy, rr * esc, Math.PI, 0); g.stroke(); }
  g.fillStyle = "#5b6775"; g.font = "11px ui-monospace,Menlo,monospace"; g.textAlign = "center";
  g.fillText("p ú b l i c o", cx, cy + 22);
  if (!cuadro) { g.globalAlpha = 1; return; }
  if (!cuadro.agentes.length && opc.vacio) {
    g.fillStyle = "#6f7b8a"; g.font = "12px ui-monospace,Menlo,monospace";
    g.fillText(opc.vacio[0], cx, cy - 0.45 * esc);
    if (opc.vacio[1]) { g.fillStyle = "#4d5764"; g.font = "11px ui-monospace,Menlo,monospace"; g.fillText(opc.vacio[1], cx, cy - 0.45 * esc + 18); }
  }

  const laps = this.laptops(cuadro, opc.mover);
  const P = puntosDeSalida({ conj: cuadro.conj, laptops: laps });   /* un punto por canal de salida */
  const color = new Map(laps.map(l => [l.n, l.c]));
  const A = cuadro.agentes, C = cuadro.campos.length;
  const le = laps.find(l => l.n === elegida);

  /* ganancias DBAP de la laptop elegida: una línea por agente, intensidad = lo que ella hace sonar,
     desde el canal de su grupo que más lo recibe */
  if (le && opc.lineas) {
    const ge = new Float64Array(P.length), mios = [];
    P.forEach((p, k) => { if (p.n === elegida) mios.push(k); });
    for (let i = 0; i < A.length; i += C) {
      if (A[i + 9]) continue;
      dbap(A[i + 2], A[i + 3], P, cuadro.conj.rolloff, cuadro.conj.blur, ge);
      let s2 = 0, kmax = mios[0];
      for (const k of mios) { s2 += ge[k] * ge[k]; if (ge[k] > ge[kmax]) kmax = k; }
      const v = Math.sqrt(s2) * amplitudVisible(A[i + 6], A[i + 1]);
      if (v < 0.05) continue;
      g.strokeStyle = alfa(le.c, Math.min(0.85, v * 0.9));
      g.lineWidth = 0.5 + 1.5 * v;
      g.beginPath(); g.moveTo(aX(P[kmax].x), aY(P[kmax].y)); g.lineTo(aX(A[i + 2]), aY(A[i + 3])); g.stroke();
    }
  }
  /* radios R y R/2 */
  if (opc.radios) {
    for (let i = 0; i < A.length; i += C) {
      const d = A[i + 1];
      if (elegida != null && elegida !== 0 && d !== elegida) continue;
      const l = info.get(d); if (!l || !l.ef) continue;
      const X = aX(A[i + 2]), Y = aY(A[i + 3]), R = l.ef.radio * esc;
      g.strokeStyle = alfa(l.color, 0.18); g.lineWidth = 1;
      g.beginPath(); g.arc(X, Y, R, 0, 2 * Math.PI); g.stroke();
      g.strokeStyle = alfa(l.color, 0.32);
      g.beginPath(); g.arc(X, Y, 0.5 * R, 0, 2 * Math.PI); g.stroke();
    }
  }
  /* agentes: triángulo en la dirección de avance; opacidad = amplitud */
  const t = Math.max(4, Math.min(8, esc / 55));
  for (let i = 0; i < A.length; i += C) {
    const col = color.get(A[i + 1]); if (!col) continue;
    const X = aX(A[i + 2]), Y = aY(A[i + 3]), ca = Math.cos(A[i + 4]), sa = -Math.sin(A[i + 4]);
    g.beginPath();
    g.moveTo(X + ca * t * 1.5, Y + sa * t * 1.5);
    g.lineTo(X - ca * t + sa * t * 0.7, Y - sa * t - ca * t * 0.7);
    g.lineTo(X - ca * t - sa * t * 0.7, Y - sa * t + ca * t * 0.7);
    g.closePath();
    if (A[i + 9]) { g.fillStyle = "rgba(120,128,138,.55)"; g.fill(); }
    else {
      g.fillStyle = alfa(col, 0.3 + 0.7 * amplitudVisible(A[i + 6], A[i + 1])); g.fill();
      if (A[i + 1] === elegida) { g.strokeStyle = "#fff"; g.lineWidth = 0.8; g.stroke(); }
    }
  }
  /* grupos de salidas: un punto por canal sobre el arco (numerados en la laptop elegida) */
  for (const l of laps) {
    if (!(l.s > 1)) continue;
    const mios = P.filter(p => p.n === l.n);
    g.strokeStyle = alfa(l.c, 0.55); g.lineWidth = 3;
    g.beginPath(); g.arc(cx, cy, esc, -mios[0].fi, -mios[mios.length - 1].fi); g.stroke();
    g.font = "9px ui-monospace,Menlo,monospace"; g.textAlign = "center"; g.textBaseline = "middle";
    for (const p of mios) {
      g.fillStyle = l.c; g.beginPath(); g.arc(aX(p.x), aY(p.y), 3.2, 0, 2 * Math.PI); g.fill();
      if (l.n === elegida) { g.fillStyle = "#8b97a6"; g.fillText(p.c + 1, aX(0.955 * p.x), aY(0.955 * p.y)); }
    }
    g.textBaseline = "alphabetic";
  }
  /* laptops: círculo con su número (la maestra, cuadrado M); desconectadas, huecas */
  for (const l of laps) {
    const X = aX(R_LAP * Math.cos(l.fi)), Y = aY(R_LAP * Math.sin(l.fi)), rr = 12;
    const i = info.get(l.n), fuera = i && i.conectada === false;
    g.beginPath();
    if (l.m) g.rect(X - rr, Y - rr, 2 * rr, 2 * rr); else g.arc(X, Y, rr, 0, 2 * Math.PI);
    if (fuera) { g.fillStyle = "#0f141a"; g.fill(); g.strokeStyle = l.c; g.lineWidth = 2; g.setLineDash([3, 3]); g.stroke(); g.setLineDash([]); }
    else { g.fillStyle = l.c; g.fill(); }
    if (l.n === elegida || resaltar.includes(l.n)) {
      g.beginPath();
      if (l.m) g.rect(X - rr - 2, Y - rr - 2, 2 * rr + 4, 2 * rr + 4); else g.arc(X, Y, rr + 2, 0, 2 * Math.PI);
      g.strokeStyle = l.n === elegida ? "#fff" : "#9aa6b4"; g.lineWidth = 2; g.stroke();
    }
    g.fillStyle = fuera ? l.c : "#10131a"; g.font = "bold 12px ui-monospace,Menlo,monospace"; g.textAlign = "center";
    g.textBaseline = "middle"; g.fillText(etiqueta(l.n), X, Y + 0.5); g.textBaseline = "alphabetic";
  }
  g.globalAlpha = 1;
};

/* ---------- espectrograma de lo que suena en esta máquina ---------- */
function Espectro(lienzo, marcas, fMax) {
  this.lienzo = lienzo; this.g = lienzo.getContext("2d"); this.fMax = fMax || 6000; this.datos = null;
  new ResizeObserver(() => this.medir()).observe(lienzo);
  if (marcas) marcas.innerHTML = `<b>espectrograma de lo que se escucha · 0–${this.fMax / 1000} kHz</b>` +
    [1, 2, 3, 4, 5].filter(k => k * 1000 < this.fMax)
      .map(k => `<span style="top:${100 * (1 - k * 1000 / this.fMax)}%">${k}k</span>`).join("");
}
Espectro.prototype.medir = function () {
  const dpr = this.dpr = window.devicePixelRatio || 1;
  this.lienzo.width = Math.round(this.lienzo.clientWidth * dpr); this.lienzo.height = Math.round(this.lienzo.clientHeight * dpr);
  this.g.fillStyle = "#07090b"; this.g.fillRect(0, 0, this.lienzo.width, this.lienzo.height);
};
Espectro.prototype.dibujar = function (motor) {
  if (!motor.analizador || motor.ctx.state !== "running") return;
  const an = motor.analizador, g = this.g;
  if (!this.datos) this.datos = new Uint8Array(an.frequencyBinCount);
  an.getByteFrequencyData(this.datos);
  const w = this.lienzo.width, h = this.lienzo.height, paso = Math.max(1, Math.round(this.dpr || 1));
  if (w <= paso || h < 2) return;          /* recién vuelto a mostrar: aún sin medir (drawImage de un lienzo de 0 px lanza error) */
  g.drawImage(this.lienzo, paso, 0, w - paso, h, 0, 0, w - paso, h);
  const binMax = Math.min(this.datos.length, Math.round(this.fMax / (motor.ctx.sampleRate / 2) * this.datos.length));
  for (let y = 0; y < h; y++) {
    const b = Math.floor((1 - y / h) * binMax);
    const v = this.datos[b] / 255, q = v * v;
    g.fillStyle = `rgb(${Math.round(12 + 220 * q)},${Math.round(14 + 165 * q)},${Math.round(18 + 70 * q)})`;
    g.fillRect(w - paso, y, paso, 1);
  }
};

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { Vista, Espectro, alfa, etiqueta, R_LAP });
})(typeof self !== "undefined" ? self : globalThis);
