/* ============================================================
   ENJAMBRES 2 · sonido
   Orquesta de Laptops UC (OLUC) · IEE2003

   Motor de síntesis que corre en CADA laptop (y en la maestra, que
   también es un parlante del arco). Consume solo la instantánea que
   difunde la maestra, nunca el modelo interno.

   El artículo (Huepe, Colasso y Cádiz) define QUÉ controla el enjambre:
   una frecuencia ω y una amplitud A por agente, con tres mapeos (directo,
   osciladores acoplados, fricción). La versión 1 las hacía sonar con un
   seno por agente. La versión 2 agrega CÓMO suena cada agente: cinco
   voces, elegibles por sub-enjambre. Todas reciben del modelo

     f     frecuencia del mapeo elegido (ya afinada)
     fm    frecuencia de OTRO mapeo (la "moduladora")
     A     amplitud (ec. 7.6: crece con el número de vecinos)
     tens  tensión ∈ [0,1]: la ω de fricción, o sea el desorden local
     disp  disparo: la fase del agente completó un ciclo en este cuadro
     color ∈ [0,1], uno por sub-enjambre (pad TIMBRE)

   VOCES
     seno       portadora(f) · A                                   (versión 1)
     ring       portadora(f) · (1 − d + d · seno(fm)),  d = color  (versión 1)
     fm         seno(f + I·fm·seno(fm)),  I = color · (0,5 + 10·tens)
                bandada ordenada: casi un seno; turbulencia: espectro ancho.
     resonador  ruido blanco → pasabanda(f, Q),  Q = 1,5 + 80·color·(1 − tens)²
                agentes alineados silban afinados; en desorden, soplan.
     pulsos     grano de seno(f) en cada disparo, de largo 15 ms a 0,6 s
                según color. Las fases se acoplan entre vecinos (Kuramoto):
                la bandada pasa de una lluvia de granos a un pulso común.

   Cadena por voz:   fuente ─► amp ─┬─► g[0] ─► canal 1 ─► compresor ─┐
                                    └─► g[S−1] ─► canal S ─► compresor ─┴─► volumen ─► salida

   SALIDAS y DBAP: igual que en la versión 1 (grupo de N canales pegado a
   cada laptop; g_p = 1/(d_p² + b²)^(a/2), Σ g_p² = 1). Una voz se crea
   cuando su nivel aquí supera −42 dB y se libera tras 0,75 s bajo −48 dB.
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
  this.ruido = null;
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
  /* ruido blanco compartido por todas las voces "resonador": 4 s en bucle; cada voz parte en otro punto */
  const n = Math.round(ctx.sampleRate * 4), b = this.ruido = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
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

/* ---------- las voces ----------
   Cada fábrica devuelve {sal, fuentes:[…], nodos:[…], fijar(q, t, tauF)}
   q = {f, fm, tens, color, disp, nyq}                                    */
const FABRICA = {
  seno(ctx, q) {
    const car = ctx.createOscillator(); car.frequency.value = q.f;
    return { sal: car, fuentes: [car], nodos: [], fijar(q, t, tauF) { car.frequency.setTargetAtTime(q.f, t, tauF); } };
  },
  ring(ctx, q) {
    const car = ctx.createOscillator(); car.frequency.value = q.f;
    const mod = ctx.createOscillator(); mod.frequency.value = q.fm;
    const anillo = ctx.createGain(); anillo.gain.value = 1 - q.color;
    const prof = ctx.createGain(); prof.gain.value = q.color;
    car.connect(anillo); mod.connect(prof); prof.connect(anillo.gain);
    return { sal: anillo, fuentes: [car, mod], nodos: [prof], fijar(q, t, tauF) {
      car.frequency.setTargetAtTime(q.f, t, tauF); mod.frequency.setTargetAtTime(q.fm, t, tauF);
      prof.gain.setTargetAtTime(q.color, t, tauF); anillo.gain.setTargetAtTime(1 - q.color, t, tauF);
    } };
  },
  fm(ctx, q) {
    const car = ctx.createOscillator(); car.frequency.value = q.f;
    const mod = ctx.createOscillator(); mod.frequency.value = q.fm;
    const desv = ctx.createGain(); desv.gain.value = 0;
    mod.connect(desv); desv.connect(car.frequency);
    return { sal: car, fuentes: [car, mod], nodos: [desv], fijar(q, t, tauF) {
      const I = q.color * (0.5 + 10 * q.tens);
      car.frequency.setTargetAtTime(q.f, t, tauF); mod.frequency.setTargetAtTime(q.fm, t, tauF);
      desv.gain.setTargetAtTime(I * q.fm, t, Math.max(tauF, 0.06));
    } };
  },
  resonador(ctx, q, motor) {
    const src = ctx.createBufferSource(); src.buffer = motor.ruido; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = q.f; bp.Q.value = 2;
    const comp = ctx.createGain(); comp.gain.value = 1;
    src.connect(bp); bp.connect(comp);
    src._desde = Math.random() * 3.5;
    return { sal: comp, fuentes: [src], nodos: [bp], fijar(q, t, tauF) {
      const Q = 1.5 + 80 * q.color * (1 - q.tens) * (1 - q.tens);
      bp.frequency.setTargetAtTime(q.f, t, tauF); bp.Q.setTargetAtTime(Q, t, 0.08);
      /* un pasabanda angosto deja pasar poca potencia del ruido: se compensa para que la voz
         quede cerca del nivel de un seno, con tope para que un Q enorme no dispare la ganancia */
      comp.gain.setTargetAtTime(Math.min(40, 1.2 * Math.sqrt(q.nyq * Q / (1.57 * q.f))), t, 0.08);
    } };
  },
  pulsos(ctx, q) {
    const car = ctx.createOscillator(); car.frequency.value = q.f;
    const env = ctx.createGain(); env.gain.value = 0;
    car.connect(env);
    return { sal: env, fuentes: [car], nodos: [], fijar(q, t, tauF) {
      car.frequency.setTargetAtTime(q.f, t, tauF);
      if (q.disp) {
        const largo = 0.015 + 0.6 * q.color * q.color;
        env.gain.cancelScheduledValues(t);
        env.gain.setTargetAtTime(1, t, 0.0015);
        env.gain.setTargetAtTime(0, t + 0.008, largo / 4);
      }
    } };
  },
};

Motor.prototype._crear = function (id, tipo, q) {
  const ctx = this.ctx;
  const v = (FABRICA[tipo] || FABRICA.seno)(ctx, q, this);
  v.id = id; v.tipo = tipo; v.bajo = 0; v.e = 0;
  v.amp = ctx.createGain(); v.amp.gain.value = 0;
  v.sal.connect(v.amp);
  v.g = [];
  for (let c = 0; c < this.S; c++) {
    const gc = ctx.createGain(); gc.gain.value = 0;
    v.amp.connect(gc); gc.connect(this.buses[c]); v.g.push(gc);
  }
  for (const f of v.fuentes) { if (f._desde != null) f.start(0, f._desde); else f.start(); }
  this.voces.set(id, v);
  return v;
};

Motor.prototype._liberar = function (v) {
  const t = this.ctx.currentTime;
  v.amp.gain.cancelScheduledValues(t);
  v.amp.gain.setTargetAtTime(0, t, 0.02);
  for (const f of v.fuentes) f.stop(t + 0.15);
  v.fuentes[0].onended = () => { for (const n of [...v.fuentes, ...v.nodos, v.sal, v.amp, ...v.g]) if (n) n.disconnect(); };
  this.voces.delete(v.id);
};

Motor.prototype.silenciarTodo = function () {
  if (!this.ctx) return;
  for (const v of [...this.voces.values()]) this._liberar(v);
};

/* Matriz punto → canal: cuánto de cada punto de salida va a cada canal de aquí
   (en potencia, ya al cuadrado). Solo depende de las laptops, no de los agentes. */
Motor.prototype._matriz = function (P) {
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
  const M = this._matriz(P);
  const usados = [];                                   /* puntos que llegan a algún canal de aquí */
  for (let i = 0; i < P.length; i++) if (M[i].some(v => v > 0)) usados.push(i);
  const g = new Float64Array(P.length), gc = new Float64Array(S);
  const lap = new Map(inst.laptops.map(l => [l.n, l]));
  const q = { f: 0, fm: 0, tens: 0, color: 0, disp: 0, nyq: ctx.sampleRate / 2 };

  const C = inst.campos.length, A = inst.agentes, vistos = new Set();
  for (let i = 0; i < A.length; i += C) {
    const id = A[i], x = A[i + 2], y = A[i + 3], amp = A[i + 6];
    const l = lap.get(A[i + 1]), tipo = l && l.voz || "seno";
    q.f = Math.min(nyq, Math.max(20, A[i + 5])); q.fm = Math.min(nyq, Math.max(1, A[i + 7]));
    q.tens = A[i + 8]; q.disp = A[i + 10]; q.color = l ? l.color : 0;
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
    if (v && v.tipo !== tipo) { this._liberar(v); v = null; }      /* el sub-enjambre cambió de voz */
    if (!v) {
      if (e < UMBRAL_ON) continue;
      if (this.voces.size >= MAX_VOCES) {              /* lleno: se roba la voz más débil si esta suena 6 dB más */
        let min = null;
        for (const w of this.voces.values()) if (!min || w.e < min.e) min = w;
        if (!min || e < 2 * min.e) continue;
        this._liberar(min);
      }
      v = this._crear(id, tipo, q);
    }
    v.e = e;
    v.fijar(q, t, tauF);
    v.amp.gain.setTargetAtTime(amp, t, tauA);
    for (let c = 0; c < S; c++) v.g[c].gain.setTargetAtTime(gc[c], t, tauA);
    v.bajo = e < UMBRAL_OFF ? v.bajo + dtReal : 0;
    if (v.bajo > ESPERA_OFF) this._liberar(v);
  }
  for (const v of [...this.voces.values()]) if (!vistos.has(v.id)) this._liberar(v);
};

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { Motor, dbap, puntosDeSalida, panear, MAX_CANALES });
})(typeof self !== "undefined" ? self : globalThis);
