/* ============================================================
   ENJAMBRES 2 · vista
   Orquesta de Laptops UC (OLUC) · IEE2003

   El escenario, compartido por la maestra, las laptops y la proyección.
   Todo sale del cuadro binario que difunde la maestra (protocolo.js, ya
   decodificado), nunca del modelo.

   Qué se ve
     · cada agente: un punto de luz del color de su laptop, más grande y
       brillante cuanto más fuerte suena, con una estela de su recorrido;
     · malla: un hilo entre agentes que están dentro del radio de
       alineación (R/2): la bandada se ve como un tejido que se arma y se
       rompe;
     · destello: un anillo cada vez que un agente dispara un pulso;
     · imán de cada sub-enjambre: un anillo de su color (gira hacia
       adentro si atrae, hacia afuera si repele);
     · laptops sobre el arco, con un halo que crece con lo que cada una
       está haciendo sonar (su parte del DBAP).

   Vista(lienzo, {proyeccion})   .alimentar(cuadro) con CADA cuadro que llega
   .dibujar(cuadro, opc)  opc: {info, elegida, resaltar, lineas, radios, malla,
        mover:{n,fi}, iman:{n,x,y,f}, manija:num, vacio:[l1,l2], atenuar,
        sinTexto, verLaptops, verArco, largo}
   info: Map num → {color, ef:{radio, nivel}, conectada}
   ============================================================ */
(function (raiz) {
"use strict";

const R_LAP = 1.09;                  /* las laptops se dibujan apenas fuera del arco */
const T_MAX = 48;                    /* posiciones que se recuerdan por agente */
const R_IMAN = 0.3;
const dbLin = db => Math.pow(10, db / 20);
function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function alfa(hex, a) { const c = rgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }
function aclarar(hex, k) { const c = rgb(hex).map(v => Math.round(v + (255 - v) * k)); return `rgb(${c[0]},${c[1]},${c[2]})`; }
const etiqueta = num => num === 0 ? "M" : String(num);

function Vista(lienzo, opc) {
  opc = opc || {};
  this.lienzo = lienzo; this.g = lienzo.getContext("2d");
  this.proyeccion = !!opc.proyeccion;
  this.W = 0; this.H = 0; this.dpr = 1; this.esc = 1; this.cx = 0; this.cy = 0;
  this.hist = new Map();             /* id → {x, y, k, n, visto} */
  this.destellos = [];               /* {x, y, c, t} */
  this.nivel = new Map();            /* laptop → cuánto suena (suavizado) */
  this.sprites = new Map();
  this.ultimoPaso = -1; this.cuadros = 0;
  new ResizeObserver(() => this.medir()).observe(lienzo);
  this.medir();
}
Vista.prototype.medir = function () {
  const dpr = this.dpr = window.devicePixelRatio || 1;
  const r = this.lienzo.getBoundingClientRect();
  this.W = r.width; this.H = r.height;
  this.lienzo.width = Math.round(this.W * dpr); this.lienzo.height = Math.round(this.H * dpr);
  if (this.proyeccion) {
    const m = Math.min(this.W, this.H) * 0.06;
    this.esc = Math.max(10, Math.min((this.W - 2 * m) / (2 * R_LAP), (this.H - 2 * m) / R_LAP));
    this.cx = this.W / 2; this.cy = this.H / 2 + this.esc * R_LAP / 2;
    return;
  }
  const m = 38;
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
/* punto del escenario bajo (X, Y), llevado adentro del semicírculo */
Vista.prototype.aModelo = function (X, Y) {
  let x = (X - this.cx) / this.esc, y = Math.max(0, (this.cy - Y) / this.esc);
  const r = Math.hypot(x, y);
  if (r > 0.97) { x *= 0.97 / r; y *= 0.97 / r; }
  return { x, y };
};
Vista.prototype.dentro = function (X, Y) {
  const x = (X - this.cx) / this.esc, y = (this.cy - Y) / this.esc;
  return y >= -0.02 && Math.hypot(x, y) <= 1.0;
};

/* laptops del cuadro; 'mover' = {n, fi}: una en su posición local (mientras se arrastra) */
Vista.prototype.laptops = function (cuadro, mover) {
  if (!cuadro) return [];
  return cuadro.laptops.map(l => mover && mover.n === l.n && mover.fi != null ? Object.assign({}, l, { fi: mover.fi }) : l);
};
Vista.prototype.laptopEn = function (cuadro, X, Y, mover) {
  let mejor = null, dm = 20;
  for (const l of this.laptops(cuadro, mover)) {
    const d = Math.hypot(X - this.aX(R_LAP * Math.cos(l.fi)), Y - this.aY(R_LAP * Math.sin(l.fi)));
    if (d < dm) { dm = d; mejor = l.n; }
  }
  return mejor;
};
Vista.prototype.agenteEn = function (cuadro, X, Y) {
  if (!cuadro) return null;
  const A = cuadro.agentes, C = cuadro.campos.length;
  let mejor = null, dm = 11;
  for (let i = 0; i < A.length; i += C) {
    const d = Math.hypot(X - this.aX(A[i + 2]), Y - this.aY(A[i + 3]));
    if (d < dm) { dm = d; mejor = { id: A[i], dueno: A[i + 1] }; }
  }
  return mejor;
};

/* ---------- memoria entre cuadros: estelas, destellos, niveles ---------- */
Vista.prototype.alimentar = function (cuadro) {
  if (!cuadro || cuadro.paso === this.ultimoPaso) return;
  this.ultimoPaso = cuadro.paso; this.cuadros++;
  const A = cuadro.agentes, C = cuadro.campos.length, ahora = performance.now(), marca = this.cuadros;
  const color = new Map(cuadro.laptops.map(l => [l.n, l.c]));
  for (let i = 0; i < A.length; i += C) {
    let h = this.hist.get(A[i]);
    if (!h) { h = { x: new Float32Array(T_MAX), y: new Float32Array(T_MAX), k: 0, n: 0, visto: 0 }; this.hist.set(A[i], h); }
    h.x[h.k] = A[i + 2]; h.y[h.k] = A[i + 3]; h.k = (h.k + 1) % T_MAX; if (h.n < T_MAX) h.n++;
    h.visto = marca;
    if (A[i + 10] && !A[i + 9] && this.destellos.length < 400)
      this.destellos.push({ x: A[i + 2], y: A[i + 3], c: color.get(A[i + 1]) || "#ffffff", t: ahora, a: A[i + 6] });
  }
  if (this.hist.size > A.length / C) for (const [id, h] of this.hist) if (h.visto !== marca) this.hist.delete(id);

  /* cuánto hace sonar cada laptop: Σ (g·A)² sobre sus puntos de salida */
  const { dbap, puntosDeSalida } = raiz.Enjambres;
  const P = puntosDeSalida(cuadro), g = new Float64Array(P.length), suma = new Map();
  if (P.length) for (let i = 0; i < A.length; i += C) {
    if (A[i + 9] || !(A[i + 6] > 0)) continue;
    dbap(A[i + 2], A[i + 3], P, cuadro.conj.rolloff, cuadro.conj.blur, g);
    const a2 = A[i + 6] * A[i + 6];
    for (let k = 0; k < P.length; k++) suma.set(P[k].n, (suma.get(P[k].n) || 0) + g[k] * g[k] * a2);
  }
  for (const l of cuadro.laptops) {
    const v = Math.min(1, Math.sqrt(suma.get(l.n) || 0) * 2.2), antes = this.nivel.get(l.n) || 0;
    this.nivel.set(l.n, v > antes ? antes + (v - antes) * 0.5 : antes * 0.9 + v * 0.1);
  }
};

Vista.prototype.sprite = function (color) {
  let s = this.sprites.get(color);
  if (s) return s;
  s = document.createElement("canvas"); s.width = s.height = 64;
  const g = s.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, alfa(color, 0.95)); gr.addColorStop(0.18, alfa(color, 0.55));
  gr.addColorStop(0.5, alfa(color, 0.13)); gr.addColorStop(1, alfa(color, 0));
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  this.sprites.set(color, s);
  return s;
};

Vista.prototype.dibujar = function (cuadro, opc) {
  opc = opc || {};
  this.alimentar(cuadro);
  const g = this.g, esc = this.esc, cx = this.cx, cy = this.cy, aX = x => this.aX(x), aY = y => this.aY(y);
  const info = opc.info || new Map(), elegida = opc.elegida, resaltar = opc.resaltar || [];
  const { dbap, puntosDeSalida } = raiz.Enjambres;
  const pr = this.proyeccion, ahora = performance.now();
  const amplitudVisible = (A, dueno) => { const l = info.get(dueno); return Math.min(1, l && l.ef ? A / dbLin(l.ef.nivel) : A * 4); };
  const verArco = opc.verArco !== false, verLaptops = opc.verLaptops !== false;
  const largo = Math.max(2, Math.min(T_MAX, opc.largo || (pr ? 30 : 16)));

  g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  g.globalCompositeOperation = "source-over";
  g.clearRect(0, 0, this.W, this.H);
  g.globalAlpha = opc.atenuar ? 0.35 : 1;

  /* ---------- el escenario ---------- */
  const semi = () => { g.beginPath(); g.moveTo(aX(-1), aY(0)); g.arc(cx, cy, esc, Math.PI, 0); g.closePath(); };
  if (verArco) {
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, esc);
    if (pr) { gr.addColorStop(0, "#080c14"); gr.addColorStop(1, "#020305"); }
    else { gr.addColorStop(0, "#162030"); gr.addColorStop(0.7, "#0e141d"); gr.addColorStop(1, "#0a0e15"); }
    semi(); g.fillStyle = gr; g.fill();
    if (!pr) {
      g.strokeStyle = "rgba(120,150,190,.07)"; g.lineWidth = 1;
      for (const rr of [0.25, 0.5, 0.75]) { g.beginPath(); g.arc(cx, cy, rr * esc, Math.PI, 0); g.stroke(); }
      for (let k = 1; k < 6; k++) { const a = k * Math.PI / 6; g.beginPath(); g.moveTo(cx, cy); g.lineTo(aX(Math.cos(a)), aY(Math.sin(a))); g.stroke(); }
    }
    semi(); g.strokeStyle = pr ? "rgba(140,160,190,.14)" : "rgba(130,160,200,.32)"; g.lineWidth = 1.5; g.stroke();
  }
  if (!opc.sinTexto) {
    g.fillStyle = "#56647a"; g.font = "600 10px ui-sans-serif,system-ui,sans-serif"; g.textAlign = "center";
    g.fillText("P Ú B L I C O", cx, cy + 22);
  }
  if (!cuadro) { g.globalAlpha = 1; return; }
  if (!cuadro.agentes.length && opc.vacio && !opc.sinTexto) {
    g.fillStyle = "#8793a6"; g.font = "14px ui-sans-serif,system-ui,sans-serif";
    g.fillText(opc.vacio[0], cx, cy - 0.45 * esc);
    if (opc.vacio[1]) { g.fillStyle = "#56647a"; g.font = "12px ui-sans-serif,system-ui,sans-serif"; g.fillText(opc.vacio[1], cx, cy - 0.45 * esc + 20); }
  }

  const laps = this.laptops(cuadro, opc.mover);
  const P = puntosDeSalida({ conj: cuadro.conj, laptops: laps });   /* un punto por canal de salida */
  const color = new Map(laps.map(l => [l.n, l.c]));
  const A = cuadro.agentes, C = cuadro.campos.length, N = A.length / C;
  const le = laps.find(l => l.n === elegida);

  /* ---------- imanes ---------- */
  for (const l0 of laps) {
    if (l0.m) continue;
    const l = opc.iman && opc.iman.n === l0.n ? Object.assign({}, l0, { ix: opc.iman.x, iy: opc.iman.y, iman: opc.iman.f != null ? opc.iman.f : l0.iman }) : l0;
    const fuerza = Math.abs(l.iman || 0), mio = l.n === opc.manija;
    if (fuerza < 0.02 && !mio) continue;
    const X = aX(l.ix), Y = aY(l.iy), R = R_IMAN * esc, gira = ahora / 1000 * (l.iman >= 0 ? -1 : 1);
    g.save();
    if (fuerza >= 0.02) {
      const gr = g.createRadialGradient(X, Y, 0, X, Y, R);
      gr.addColorStop(0, alfa(l.c, 0.16 * fuerza)); gr.addColorStop(1, alfa(l.c, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(X, Y, R, 0, 2 * Math.PI); g.fill();
      g.strokeStyle = alfa(l.c, 0.25 + 0.5 * fuerza); g.lineWidth = 1.2;
      for (let k = 0; k < 3; k++) {            /* tres anillos que se cierran (atrae) o se abren (repele) */
        const u = ((ahora / 1400 * (l.iman >= 0 ? -1 : 1) + k / 3) % 1 + 1) % 1;
        g.globalAlpha = (opc.atenuar ? 0.35 : 1) * (1 - Math.abs(u - 0.5) * 2) * (0.25 + 0.6 * fuerza);
        g.beginPath(); g.arc(X, Y, 8 + u * (R * 0.55), 0, 2 * Math.PI); g.stroke();
      }
      g.globalAlpha = opc.atenuar ? 0.35 : 1;
    }
    g.translate(X, Y); g.rotate(gira);
    g.strokeStyle = alfa(l.c, mio ? 0.95 : 0.6); g.lineWidth = mio ? 2 : 1.3;
    g.setLineDash(fuerza < 0.02 ? [2, 4] : [5, 4]);
    g.beginPath(); g.arc(0, 0, mio ? 11 : 8, 0, 2 * Math.PI); g.stroke();
    g.setLineDash([]);
    g.restore();
    g.fillStyle = alfa(l.c, mio ? 1 : 0.8); g.beginPath(); g.arc(X, Y, mio ? 3.5 : 2.5, 0, 2 * Math.PI); g.fill();
    if (!pr && !mio) { g.fillStyle = alfa(l.c, 0.75); g.font = "600 9px ui-sans-serif,system-ui,sans-serif"; g.textAlign = "center"; g.fillText(etiqueta(l.n), X, Y - 13); }
  }

  /* ganancias DBAP de la laptop elegida: una línea por agente, intensidad = lo que ella hace sonar */
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
      g.strokeStyle = alfa(le.c, Math.min(0.5, v * 0.5));
      g.lineWidth = 0.5 + 1.2 * v;
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
      g.strokeStyle = alfa(l.color, 0.16); g.lineWidth = 1;
      g.beginPath(); g.arc(X, Y, R, 0, 2 * Math.PI); g.stroke();
      g.strokeStyle = alfa(l.color, 0.3);
      g.beginPath(); g.arc(X, Y, 0.5 * R, 0, 2 * Math.PI); g.stroke();
    }
  }

  g.globalCompositeOperation = "lighter";
  /* ---------- malla: hilos entre agentes dentro del radio de alineación ---------- */
  if (opc.malla !== false && N <= 420) {
    g.lineWidth = pr ? 1.2 : 1;
    for (let i = 0; i < A.length; i += C) {
      const li = info.get(A[i + 1]), r = 0.5 * (li && li.ef ? li.ef.radio : 0.2), r2 = r * r;
      const col = color.get(A[i + 1]); if (!col || A[i + 9]) continue;
      for (let j = i + C; j < A.length; j += C) {
        const dx = A[i + 2] - A[j + 2], dy = A[i + 3] - A[j + 3], d2 = dx * dx + dy * dy;
        if (d2 >= r2 || A[j + 9]) continue;
        g.strokeStyle = alfa(col, 0.34 * (1 - Math.sqrt(d2) / r));
        g.beginPath(); g.moveTo(aX(A[i + 2]), aY(A[i + 3])); g.lineTo(aX(A[j + 2]), aY(A[j + 3])); g.stroke();
      }
    }
  }
  /* ---------- estelas: tres tramos, cada vez más anchos y brillantes hacia la cabeza ---------- */
  const tam = Math.max(pr ? 3.2 : 2.6, esc / (pr ? 130 : 150));
  g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i < A.length; i += C) {
    const h = this.hist.get(A[i]), col = color.get(A[i + 1]);
    if (!h || !col || h.n < 2) continue;
    const n = Math.min(h.n, largo), mudo = A[i + 9], amp = mudo ? 0.15 : 0.35 + 0.65 * amplitudVisible(A[i + 6], A[i + 1]);
    for (let b = 0; b < 3; b++) {
      const desde = Math.floor(n * b / 3), hasta = Math.min(n - 1, Math.floor(n * (b + 1) / 3));
      if (hasta <= desde) continue;
      g.strokeStyle = mudo ? `rgba(120,128,138,${0.1 + 0.08 * b})` : alfa(col, amp * [0.08, 0.2, 0.42][b]);
      g.lineWidth = tam * [0.35, 0.6, 0.9][b];
      g.beginPath();
      for (let q = desde; q <= hasta; q++) {
        const k = (h.k - n + q + T_MAX * 2) % T_MAX, X = aX(h.x[k]), Y = aY(h.y[k]);
        if (q === desde) g.moveTo(X, Y); else g.lineTo(X, Y);
      }
      g.stroke();
    }
  }
  /* ---------- agentes ---------- */
  for (let i = 0; i < A.length; i += C) {
    const col = color.get(A[i + 1]); if (!col) continue;
    const X = aX(A[i + 2]), Y = aY(A[i + 3]);
    if (A[i + 9]) {
      g.globalCompositeOperation = "source-over";
      g.strokeStyle = "rgba(130,138,150,.7)"; g.lineWidth = 1.2;
      g.beginPath(); g.arc(X, Y, tam * 0.9, 0, 2 * Math.PI); g.stroke();
      g.globalCompositeOperation = "lighter";
      continue;
    }
    const amp = amplitudVisible(A[i + 6], A[i + 1]), mio = A[i + 1] === elegida && !pr;
    const R = tam * (2.6 + 5.5 * amp);
    g.globalAlpha = (opc.atenuar ? 0.35 : 1) * (0.4 + 0.6 * amp);
    g.drawImage(this.sprite(col), X - R, Y - R, 2 * R, 2 * R);
    g.globalAlpha = opc.atenuar ? 0.35 : 1;
    g.fillStyle = aclarar(col, 0.35 + 0.5 * amp);
    g.beginPath(); g.arc(X, Y, tam * (mio ? 1.05 : 0.8), 0, 2 * Math.PI); g.fill();
    if (mio) { g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 1; g.beginPath(); g.arc(X, Y, tam * 1.9, 0, 2 * Math.PI); g.stroke(); }
  }
  /* ---------- destellos de los pulsos ---------- */
  if (this.destellos.length) {
    const vivos = [];
    for (const d of this.destellos) {
      const u = (ahora - d.t) / 420; if (u >= 1) continue;
      vivos.push(d);
      g.strokeStyle = alfa(d.c, (1 - u) * 0.8); g.lineWidth = 1.6 * (1 - u) + 0.4;
      g.beginPath(); g.arc(aX(d.x), aY(d.y), tam * (1.5 + 9 * u), 0, 2 * Math.PI); g.stroke();
    }
    this.destellos = vivos;
  }
  g.globalCompositeOperation = "source-over";

  /* ---------- laptops ---------- */
  if (verLaptops) {
    /* grupos de salidas: un punto por canal sobre el arco (numerados en la laptop elegida) */
    for (const l of laps) {
      if (!(l.s > 1) || pr) continue;
      const mios = P.filter(p => p.n === l.n);
      g.strokeStyle = alfa(l.c, 0.55); g.lineWidth = 3;
      g.beginPath(); g.arc(cx, cy, esc, -mios[0].fi, -mios[mios.length - 1].fi); g.stroke();
      g.font = "9px ui-sans-serif,system-ui,sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      for (const p of mios) {
        g.fillStyle = l.c; g.beginPath(); g.arc(aX(p.x), aY(p.y), 3.2, 0, 2 * Math.PI); g.fill();
        if (l.n === elegida) { g.fillStyle = "#8b97a6"; g.fillText(p.c + 1, aX(0.955 * p.x), aY(0.955 * p.y)); }
      }
      g.textBaseline = "alphabetic";
    }
    for (const l of laps) {
      const X = aX(R_LAP * Math.cos(l.fi)), Y = aY(R_LAP * Math.sin(l.fi));
      const i = info.get(l.n), fuera = i && i.conectada === false, niv = fuera ? 0 : (this.nivel.get(l.n) || 0);
      if (pr) {
        const rr = Math.max(3, esc * 0.011);
        if (niv > 0.02) { const R = rr * (2 + 7 * niv); g.globalAlpha = 0.5 * niv; g.drawImage(this.sprite(l.c), X - R, Y - R, 2 * R, 2 * R); g.globalAlpha = 1; }
        g.fillStyle = alfa(l.c, fuera ? 0.12 : 0.5); g.beginPath(); g.arc(X, Y, rr, 0, 2 * Math.PI); g.fill();
        continue;
      }
      const rr = 13;
      if (niv > 0.02) {            /* halo: lo que esta laptop está haciendo sonar */
        const R = rr + 6 + 26 * niv;
        const gr = g.createRadialGradient(X, Y, rr * 0.6, X, Y, R);
        gr.addColorStop(0, alfa(l.c, 0.55 * niv)); gr.addColorStop(1, alfa(l.c, 0));
        g.fillStyle = gr; g.beginPath(); g.arc(X, Y, R, 0, 2 * Math.PI); g.fill();
      }
      g.beginPath();
      if (l.m) g.roundRect(X - rr, Y - rr, 2 * rr, 2 * rr, 5); else g.arc(X, Y, rr, 0, 2 * Math.PI);
      if (fuera) { g.fillStyle = "#0f141a"; g.fill(); g.strokeStyle = l.c; g.lineWidth = 2; g.setLineDash([3, 3]); g.stroke(); g.setLineDash([]); }
      else { g.fillStyle = l.c; g.fill(); }
      if (l.n === elegida || resaltar.includes(l.n)) {
        g.beginPath();
        if (l.m) g.roundRect(X - rr - 3, Y - rr - 3, 2 * rr + 6, 2 * rr + 6, 7); else g.arc(X, Y, rr + 3, 0, 2 * Math.PI);
        g.strokeStyle = l.n === elegida ? "#fff" : "#9aa6b4"; g.lineWidth = 2; g.stroke();
      }
      g.fillStyle = fuera ? l.c : "#0c1017"; g.font = "700 12px ui-sans-serif,system-ui,sans-serif"; g.textAlign = "center";
      g.textBaseline = "middle"; g.fillText(etiqueta(l.n), X, Y + 0.5); g.textBaseline = "alphabetic";
    }
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
  /* paleta: negro → azul → magenta → ámbar → blanco */
  this.paleta = new Array(256);
  const P = [[0, 5, 7, 12], [0.3, 28, 44, 110], [0.55, 150, 50, 140], [0.8, 240, 150, 60], [1, 255, 245, 220]];
  for (let i = 0; i < 256; i++) {
    const v = Math.pow(i / 255, 1.6); let k = 0; while (k < P.length - 2 && v > P[k + 1][0]) k++;
    const u = (v - P[k][0]) / (P[k + 1][0] - P[k][0]);
    this.paleta[i] = `rgb(${[1, 2, 3].map(c => Math.round(P[k][c] + u * (P[k + 1][c] - P[k][c]))).join(",")})`;
  }
}
Espectro.prototype.medir = function () {
  const dpr = this.dpr = window.devicePixelRatio || 1;
  this.lienzo.width = Math.round(this.lienzo.clientWidth * dpr); this.lienzo.height = Math.round(this.lienzo.clientHeight * dpr);
  this.g.fillStyle = "#05070c"; this.g.fillRect(0, 0, this.lienzo.width, this.lienzo.height);
};
Espectro.prototype.dibujar = function (motor) {
  if (!motor.analizador || motor.ctx.state !== "running") return;
  const an = motor.analizador, g = this.g;
  if (!this.datos) this.datos = new Uint8Array(an.frequencyBinCount);
  an.getByteFrequencyData(this.datos);
  const w = this.lienzo.width, h = this.lienzo.height, paso = Math.max(1, Math.round(this.dpr || 1));
  if (w <= paso || h < 2) return;          /* recién vuelto a mostrar: aún sin medir */
  g.drawImage(this.lienzo, paso, 0, w - paso, h, 0, 0, w - paso, h);
  const binMax = Math.min(this.datos.length, Math.round(this.fMax / (motor.ctx.sampleRate / 2) * this.datos.length));
  for (let y = 0; y < h; y++) {
    g.fillStyle = this.paleta[this.datos[Math.floor((1 - y / h) * binMax)]];
    g.fillRect(w - paso, y, paso, 1);
  }
};

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { Vista, Espectro, alfa, etiqueta, R_LAP });
})(typeof self !== "undefined" ? self : globalThis);
