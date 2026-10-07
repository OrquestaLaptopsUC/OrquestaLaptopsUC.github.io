/* ============================================================
   ENJAMBRES · sonido
   Orquesta de Laptops UC (OLUC) · IEE2003

   Motor de síntesis que corre en CADA laptop (y en la maestra, que
   también es un parlante del arco). Consume solo la instantánea que
   difunde la maestra, nunca el modelo interno: así la maestra y las
   laptops suenan con el mismo código.

   Voz = un seno por agente. Cadena por voz:

     portadora ─► ring ─► amp ─┬─► g[0] ─► canal 1 ─► compresor ─┐
       (seno f)    ▲           ├─► g[1] ─► canal 2 ─► compresor ─┤
                   │           └─► …    ─► canal S ─► compresor ─┴─► volumen ─► salida
     moduladora ─► prof        (solo se crea cuando ring > 0; si no, bypass)
       (seno fm)

   ring:  salida = portadora · (1 − d + d · moduladora),  d = profundidad.

   SALIDAS. Cada laptop tiene N salidas (1 = la misma señal por todos
   sus canales, como un parlante; 2, 4, 6, 8 con una interfaz). Las N
   salidas son un grupo pegado a la laptop: puntos del arco repartidos
   en un tramo de 'ancho' grados centrado en ella, que se mueven con
   ella. El canal 1 queda a la izquierda vista desde el público.

   DBAP (Lossius, Baltazar y de la Hogue, 2009) sobre TODOS los puntos
   de salida de todas las laptops:
   g_p = 1 / (d_p² + b²)^(a/2),  a = caída/(20·log10 2),  Σ g_p² = 1.
   Una voz se crea cuando su nivel aquí supera −42 dB y se libera tras
   0,75 s bajo −48 dB: cada laptop sintetiza solo lo cercano.
   ============================================================ */
(function (raiz) {
"use strict";

const UMBRAL_ON = Math.pow(10, -42 / 20);
const UMBRAL_OFF = Math.pow(10, -48 / 20);
const ESPERA_OFF = 0.75;          /* s bajo el umbral antes de liberar la voz */
const MAX_VOCES = 200;            /* por laptop; sobre esto se roba la voz más débil */
const MAX_CANALES = 8;

/* Ganancias DBAP normalizadas en potencia. alt: [{x,y}] */
function dbap(x, y, alt, caidaDb, blur, out) {
  const a = caidaDb / (20 * Math.log10(2));
  const g = out || new Float64Array(alt.length);
  let s = 0;
  for (let k = 0; k < alt.length; k++) {
    const dx = x - alt[k].x, dy = y - alt[k].y;
    g[k] = Math.pow(dx * dx + dy * dy + blur * blur, -a / 2);
    s += g[k] * g[k];
  }
  s = Math.sqrt(s) || 1;
  for (let k = 0; k < alt.length; k++) g[k] /= s;
  return g;
}

/* Puntos de salida de una instantánea: una entrada por canal de cada laptop.
   {n: laptop, c: canal (0 = canal 1), N: salidas de esa laptop, fi, x, y, u}
   u ∈ [0,1]: lugar dentro del grupo, 0 = canal 1 (izquierda del público).  */
function puntosDeSalida(inst) {
  const ancho = (inst.conj.ancho || 0) * Math.PI / 180, P = [];
  for (const l of inst.laptops) {
    const N = Math.max(1, l.s || 1);
    for (let c = 0; c < N; c++) {
      const u = N > 1 ? c / (N - 1) : 0.5;
      const fi = Math.max(0, Math.min(Math.PI, l.fi + (N > 1 ? ancho * (0.5 - u) : 0)));
      P.push({ n: l.n, c, N, fi, u, x: Math.cos(fi), y: Math.sin(fi) });
    }
  }
  return P;
}

/* Reparte un punto de posición u ∈ [0,1] entre S canales con potencia constante. */
function panear(u, S, out) {
  out.fill(0);
  if (S === 1) { out[0] = 1; return out; }
  const p = u * (S - 1), c0 = Math.min(S - 2, Math.floor(p)), f = p - c0;
  out[c0] = Math.cos(f * Math.PI / 2); out[c0 + 1] = Math.sin(f * Math.PI / 2);
  return out;
}

function Motor() {
  this.ctx = null;
  this.voces = new Map();          /* id → voz */
  this.modo = { tipo: "laptop", num: 0, fisico: true };
  this.vol = 0.8;
  this.pedidas = 2;                /* canales que se quieren usar */
  this.S = 2;                      /* canales en uso */
  this.ultimaT = 0;
}

Motor.prototype.iniciar = function () {
  if (this.ctx) return this.ctx.resume();
  const AC = raiz.AudioContext || raiz.webkitAudioContext;
  const ctx = this.ctx = new AC({ latencyHint: "interactive" });
  this.volumen = ctx.createGain(); this.volumen.gain.value = this.vol;
  this.volumen.connect(ctx.destination);
  this.analizador = ctx.createAnalyser();
  this.analizador.fftSize = 4096; this.analizador.smoothingTimeConstant = 0;
  this.volumen.connect(this.analizador);
  this._armarSalida();
  return ctx.resume();
};

/* Canales físicos que ofrece el dispositivo de salida actual. */
Motor.prototype.canalesDisponibles = function () {
  return this.ctx ? Math.max(1, this.ctx.destination.maxChannelCount || 2) : null;
};

/* Pide S canales de salida; queda en min(S, lo que tenga el dispositivo). */
Motor.prototype.fijarCanales = function (S) {
  this.pedidas = Math.max(1, Math.min(MAX_CANALES, S | 0));
  if (this.ctx) this._armarSalida();
};

Motor.prototype._armarSalida = function () {
  const ctx = this.ctx;
  const S = Math.max(2, Math.min(this.pedidas, this.canalesDisponibles()));
  if (this.buses && S === this.S) return;
  this.silenciarTodo();
  if (this.buses) { for (const b of this.buses) b.disconnect(); for (const c of this.comps) c.disconnect(); this.mezcla.disconnect(); }
  this.S = S;
  const d = ctx.destination;
  if (d.channelCount !== S) d.channelCount = S;
  d.channelCountMode = "explicit"; d.channelInterpretation = "discrete";
  /* Un bus y un compresor por canal: el DynamicsCompressor de Web Audio no acepta más
     de 2 canales. Mismos ajustes que las otras obras del curso.                      */
  this.mezcla = ctx.createChannelMerger(S);
  this.buses = []; this.comps = [];
  for (let c = 0; c < S; c++) {
    const b = ctx.createGain();
    b.channelCount = 1; b.channelCountMode = "explicit"; b.channelInterpretation = "discrete";
    const comp = ctx.createDynamicsCompressor();
    comp.channelCount = 1; comp.channelCountMode = "explicit"; comp.channelInterpretation = "discrete";
    comp.threshold.value = -10; comp.ratio.value = 10; comp.knee.value = 10;
    comp.attack.value = 0.005; comp.release.value = 0.2;
    b.connect(comp); comp.connect(this.mezcla, 0, c);
    this.buses.push(b); this.comps.push(comp);
  }
  this.volumen.channelCount = S; this.volumen.channelCountMode = "explicit"; this.volumen.channelInterpretation = "discrete";
  this.mezcla.connect(this.volumen);
};

Motor.prototype.fijarVolumen = function (v) {
  this.vol = v;
  if (this.ctx) this.volumen.gain.setTargetAtTime(v, this.ctx.currentTime, 0.03);
};

/* modo: {tipo:"laptop", num, fisico}  fisico = true: sus N salidas van a los canales
   1…N de este dispositivo (lo que suena de verdad en esa laptop); false: se escucha
   desde otra máquina y el grupo se pliega a los canales que haya, de izquierda a derecha.
   {tipo:"estereo"}: todas las salidas de todas las laptops, repartidas según el arco.
   {tipo:"silencio"}                                                                     */
Motor.prototype.fijarModo = function (modo) { this.modo = modo; };

Motor.prototype._crear = function (id, f, fm) {
  const ctx = this.ctx;
  const car = ctx.createOscillator();
  car.frequency.value = f;
  const ring = ctx.createGain(); ring.gain.value = 1;
  const amp = ctx.createGain(); amp.gain.value = 0;
  car.connect(ring); ring.connect(amp);
  const g = [];
  for (let c = 0; c < this.S; c++) {
    const gc = ctx.createGain(); gc.gain.value = 0;
    amp.connect(gc); gc.connect(this.buses[c]); g.push(gc);
  }
  car.start();
  const v = { id, car, ring, amp, g, mod: null, prof: null, d: 0, bajo: 0, e: 0 };
  this.voces.set(id, v);
  return v;
};

Motor.prototype._ring = function (v, d, fm, t, tau) {
  if (d <= 0 && !v.mod) return;                        /* bypass: sin moduladora */
  if (!v.mod) {
    const ctx = this.ctx;
    v.mod = ctx.createOscillator(); v.mod.frequency.value = fm;
    v.prof = ctx.createGain(); v.prof.gain.value = 0;
    v.mod.connect(v.prof); v.prof.connect(v.ring.gain);
    v.mod.start();
  }
  v.mod.frequency.setTargetAtTime(fm, t, tau);
  v.prof.gain.setTargetAtTime(d, t, tau);
  v.ring.gain.setTargetAtTime(1 - d, t, tau);
  v.d = d;
};

Motor.prototype._liberar = function (v) {
  const t = this.ctx.currentTime;
  v.amp.gain.cancelScheduledValues(t);
  v.amp.gain.setTargetAtTime(0, t, 0.02);
  v.car.stop(t + 0.15);
  if (v.mod) v.mod.stop(t + 0.15);
  v.car.onended = () => { for (const n of [v.car, v.ring, v.amp, v.mod, v.prof, ...v.g]) if (n) n.disconnect(); };
  this.voces.delete(v.id);
};

Motor.prototype.silenciarTodo = function () {
  if (!this.ctx) return;
  for (const v of [...this.voces.values()]) this._liberar(v);
};

/* Matriz punto → canal: cuánto de cada punto de salida va a cada canal de aquí
   (en potencia, ya al cuadrado). Solo depende de las laptops, no de los agentes. */
Motor.prototype._matriz = function (P, inst) {
  const S = this.S, modo = this.modo, M = P.map(() => new Float64Array(S)), tmp = new Float64Array(S);
  if (modo.tipo === "estereo") {
    P.forEach((p, i) => { const iz = Math.cos((Math.PI - p.fi) / 2) ** 2; M[i][0] = iz; M[i][1] = 1 - iz; });
  } else if (modo.tipo === "laptop") {
    P.forEach((p, i) => {
      if (p.n !== modo.num) return;
      if (p.N === 1) M[i].fill(1);                                   /* un parlante: lo mismo en todos los canales */
      else if (modo.fisico && p.N <= S) M[i][p.c] = 1;               /* canal c → salida c */
      else { panear(p.u, S, tmp); for (let c = 0; c < S; c++) M[i][c] = tmp[c] * tmp[c]; }
    });
  }
  return M;
};

/* Llamar con cada instantánea (≈30 por segundo). */
Motor.prototype.actualizar = function (inst) {
  if (!this.ctx || this.ctx.state !== "running") return;
  const ctx = this.ctx, t = ctx.currentTime, S = this.S;
  const dtReal = this.ultimaT ? Math.min(0.5, t - this.ultimaT) : 0;
  this.ultimaT = t;
  const tauF = inst.conj.tauF / 1000, tauA = inst.conj.tauA / 1000;
  const nyq = ctx.sampleRate * 0.45;

  const P = puntosDeSalida(inst);
  const M = this._matriz(P, inst);
  const usados = [];                                   /* puntos que llegan a algún canal de aquí */
  for (let i = 0; i < P.length; i++) if (M[i].some(v => v > 0)) usados.push(i);
  const g = new Float64Array(P.length), gc = new Float64Array(S);

  const C = inst.campos.length, A = inst.agentes, vistos = new Set();
  for (let i = 0; i < A.length; i += C) {
    const id = A[i], x = A[i + 2], y = A[i + 3], f = Math.min(nyq, Math.max(20, A[i + 5]));
    const amp = A[i + 6], fm = Math.min(nyq, Math.max(1, A[i + 7])), d = A[i + 8];
    vistos.add(id);

    gc.fill(0);
    if (usados.length) {
      dbap(x, y, P, inst.conj.rolloff, inst.conj.blur, g);
      for (const k of usados) { const p2 = g[k] * g[k], m = M[k]; for (let c = 0; c < S; c++) gc[c] += p2 * m[c]; }
      for (let c = 0; c < S; c++) gc[c] = Math.sqrt(gc[c]);
    }
    let e = 0; for (let c = 0; c < S; c++) if (gc[c] > e) e = gc[c];
    e *= amp;

    let v = this.voces.get(id);
    if (!v) {
      if (e < UMBRAL_ON) continue;
      if (this.voces.size >= MAX_VOCES) {              /* lleno: se roba la voz más débil si esta suena 6 dB más */
        let min = null;
        for (const w of this.voces.values()) if (!min || w.e < min.e) min = w;
        if (!min || e < 2 * min.e) continue;
        this._liberar(min);
      }
      v = this._crear(id, f, fm);
    }
    v.e = e;
    v.car.frequency.setTargetAtTime(f, t, tauF);
    v.amp.gain.setTargetAtTime(amp, t, tauA);
    for (let c = 0; c < S; c++) v.g[c].gain.setTargetAtTime(gc[c], t, tauA);
    this._ring(v, d, fm, t, tauF);
    v.bajo = e < UMBRAL_OFF ? v.bajo + dtReal : 0;
    if (v.bajo > ESPERA_OFF) this._liberar(v);
  }
  for (const v of [...this.voces.values()]) if (!vistos.has(v.id)) this._liberar(v);
};

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { Motor, dbap, puntosDeSalida, panear, MAX_CANALES });
})(typeof self !== "undefined" ? self : globalThis);
