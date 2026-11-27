/* ============================================================
   ENJAMBRES · versión de concierto · modelo
   Orquesta de Laptops UC (OLUC) · IEE2003

   VERSIÓN DE CONCIERTO (sobre la versión 2). Agrega:
     · ETAPAS: 'limites' (rango permitido de cada parámetro cedido), 'tope'
       (agentes por laptop) y, por laptop, 'fijo' (parámetros que la etapa le
       impone y ella no puede mover). Los pone el simulador al entrar a cada
       etapa de la partitura; aquí solo se hacen cumplir.
     · DIRECTOR (Gametrak), en los parámetros del conjunto: un imán general
       (gx, gy, gf) que atrae a todos los agentes, 'caos' que se suma al ruido
       η₁ de todos y 'general', el nivel de toda la obra.

   VERSIÓN 2. Con los valores por defecto (cohesión 0, imán 0, voz seno,
   afinación libre) la dinámica y el sonido son exactamente los de la
   versión 1. Lo nuevo, todo por sub-enjambre:
     · FORMA: 'coh' agrega al rumbo un término de cohesión (> 0, hacia el
       centro de los vecinos) o de separación (< 0, alejándose de ellos).
     · IMÁN: un punto del escenario (ix, iy) que atrae (iman > 0) o repele
       (iman < 0) al sub-enjambre: así cada intérprete lleva a sus agentes
       hacia las laptops donde quiere que suenen.
     · FASE: cada agente lleva una fase θ ∈ [0,1) que avanza a 'pulso' Hz
       (± 1 octava según su ω de osciladores acoplados) y se acopla a la de
       sus vecinos (Kuramoto, 'kfase'). Al completar un ciclo, dispara.
     · VOZ, COLOR, AFINACIÓN: cómo suena cada agente (ver sonido.js).

   Simulación autoritativa: corre SOLO en la laptop maestra.
   Transcripción de Methods2D.updateVicsekChate (Swarms.java, 2011)
   y de Huepe, Colasso y Cádiz (2014), "Generating Music from
   Flocking Dynamics", con tres cambios decididos para la obra:

   1. Recinto semicircular de radio 1 con bordes reflectantes
      (el Java usaba una caja periódica de lado L). El diámetro
      queda en y = 0 (lado del público) y el arco arriba; las
      laptops van sobre el arco, en el ángulo fi ∈ [0, π].
   2. Cada laptop tiene su sub-enjambre con sus propios parámetros;
      la maestra puede retener un parámetro (rige para todos) o
      cederlo (cada laptop usa el suyo).
   3. κ, "acoplamiento entre enjambres": un vecino de otro
      sub-enjambre pesa κ en la alineación, en el acoplamiento de
      osciladores, en la fricción y en el conteo de vecinos.
      κ = 1 es exactamente el modelo original con un solo enjambre;
      κ = 0, sub-enjambres que se atraviesan sin verse.

   Sin DOM: corre dentro del Worker de simulador.js. El módulo es una
   función con nombre para que la página pueda armar el Worker con su
   código fuente (EnjambresModelo.toString()), también desde file://.
   ============================================================ */
function EnjambresModelo(raiz) {
"use strict";

const DT = 0.05;
const MAX_AGENTES_LAPTOP = 100;   /* tope por laptop, para que nadie sature la red ni la CPU */                  /* Swarms.java: x += 0.05·dx  (2011: dt = 0.05) */
const PASO_S = 1 / 30;            /* duración real de un paso: la fase de los pulsos avanza en segundos */
const G_COH = 2, G_IMAN = 1.5, G_DIR = 1.1, R_IMAN = 0.3;    /* peso de la cohesión y del imán frente a la alineación (que vale ≤ 1) */
const R_NACER = 0.93;             /* los agentes nacen junto a su laptop, apenas dentro del arco */
const DOS_PI = 2 * Math.PI;

const MAPEOS = ["directo", "osciladores", "friccion"];
const NOMBRE_MAPEO = { directo: "directo", osciladores: "osciladores acoplados", friccion: "fricción física" };
const VOCES = ["seno", "ring", "fm", "resonador", "pulsos"];
const NOMBRE_VOZ = { seno: "seno", ring: "ring", fm: "FM", resonador: "resonador", pulsos: "pulsos" };
const AFINACIONES = ["libre", "armonicos", "cromatica", "pentatonica"];
const NOMBRE_AFINACION = { libre: "libre (continua)", armonicos: "serie armónica de f mín", cromatica: "cromática (la = 440)", pentatonica: "pentatónica sobre f mín" };
const PENTA = [0, 2, 4, 7, 9, 12];

/* Parámetros que la maestra puede retener o ceder.
   radio = R_S del artículo (acoplamiento y fricción); la alineación
   de Vicsek usa 0,5·radio, como en el Java (R_S = 2R).            */
const PARAMS = [
  { k: "vel",    n: "velocidad v₀",        min: 0,    max: 1,     paso: 0.005, def: 0.2 },
  { k: "radio",  n: "radio R (alinea a R/2)", min: 0.02, max: 0.6, paso: 0.005, def: 0.2 },
  { k: "vNoise", n: "ruido Vicsek η₁",     min: 0,    max: 1,     paso: 0.005, def: 0.3 },
  { k: "cNoise", n: "ruido Chaté η₂",      min: 0,    max: 2,     paso: 0.01,  def: 0 },
  { k: "b1",     n: "β₁ convergencia",     min: 0,    max: 1,     paso: 0.005, def: 0.78 },
  { k: "b2",     n: "β₂ peso de ω⁰",       min: 0,    max: 2,     paso: 0.01,  def: 0.30 },
  { k: "amin",   n: "A_min",               min: 0,    max: 1,     paso: 0.01,  def: 0.1 },
  { k: "mapeo",  n: "mapeo",               opciones: MAPEOS, def: "osciladores" },
  { k: "fmin",   n: "f mín (Hz)",          min: 30,   max: 10000, paso: 1, def: 200,  log: true },
  { k: "fmax",   n: "f máx (Hz)",          min: 30,   max: 12000, paso: 1, def: 5000, log: true },
  { k: "escala", n: "escala de f",         opciones: ["exp", "lin"], def: "exp" },
  { k: "nivel",  n: "nivel (dB)",          min: -48,  max: 0,     paso: 0.5, def: -12 },
  { k: "moduladora", n: "moduladora (ring y FM)", opciones: MAPEOS, def: "friccion" },
  /* --- nuevos en la versión 2 --- */
  { k: "coh",    n: "forma: separa (−) · cohesiona (+)", min: -1, max: 1, paso: 0.01, def: 0 },
  { k: "iman",   n: "imán: repele (−) · atrae (+)", min: -1, max: 1, paso: 0.01, def: 0 },
  { k: "ix",     n: "imán x",              min: -1,   max: 1,     paso: 0.005, def: 0 },
  { k: "iy",     n: "imán y",              min: 0,    max: 1,     paso: 0.005, def: 0.5 },
  { k: "voz",    n: "voz",                 opciones: VOCES, def: "seno" },
  { k: "color",  n: "color del timbre",    min: 0,    max: 1,     paso: 0.01, def: 0.5 },
  { k: "afinacion", n: "afinación",        opciones: AFINACIONES, def: "libre" },
  { k: "pulso",  n: "pulso (Hz)",          min: 0.5,  max: 16,    paso: 0.01, def: 3, log: true },
  { k: "kfase",  n: "acoplamiento de fase", min: 0,   max: 1,     paso: 0.01, def: 0.3 },
];

/* Parámetros del conjunto: solo la maestra, no se ceden. */
const CONJUNTO = [
  { k: "kappa",   n: "acoplamiento entre enjambres κ", min: 0,    max: 1,   paso: 0.01,  def: 1 },
  { k: "rolloff", n: "DBAP: caída (dB por doble distancia)", min: 3, max: 24, paso: 0.5, def: 12 },
  { k: "ancho",   n: "ancho del grupo de salidas (°)", min: 0, max: 90, paso: 1, def: 20 },
  { k: "blur",    n: "DBAP: difuminado",   min: 0.01, max: 0.5, paso: 0.005, def: 0.08 },
  { k: "tauF",    n: "suavizado de f (ms)", min: 5,   max: 500, paso: 1,     def: 40 },
  { k: "tauA",    n: "suavizado de A (ms)", min: 5,   max: 500, paso: 1,     def: 40 },
  /* --- el director (Gametrak); también se pueden mover a mano --- */
  { k: "gf",      n: "director: fuerza del imán general", min: 0, max: 1, paso: 0.01, def: 0 },
  { k: "gx",      n: "director: imán general x", min: -1, max: 1, paso: 0.005, def: 0 },
  { k: "gy",      n: "director: imán general y", min: 0,  max: 1, paso: 0.005, def: 0.5 },
  { k: "caos",    n: "director: orden (−) · caos (+), se suma a η₁", min: -1, max: 1, paso: 0.01, def: 0 },
  { k: "general", n: "director: nivel general (dB; −60 = silencio)", min: -60, max: 0, paso: 0.5, def: 0 },
];
const SILENCIO_DB = -59.5;        /* 'general' por debajo de esto: silencio */

/* Nombres que una etapa de la partitura puede usar en 'cede': los pads y el imán entero. */
const ALIAS_CEDE = { movimiento: ["vNoise", "vel"], forma: ["radio", "coh"], sincronia: ["b1", "b2"], registro: ["fmin", "fmax"],
                     timbre: ["color", "nivel"], pulso: ["pulso", "kfase"], iman: ["iman", "ix", "iy"] };

/* Campos de cada agente en la instantánea que se difunde. */
const CAMPOS = ["id", "dueno", "x", "y", "a", "f", "A", "fm", "tens", "mudo", "disp"];

const porDefecto = defs => { const o = {}; for (const p of defs) o[p.k] = p.def; return o; };
const dbLin = db => Math.pow(10, db / 20);
const r = (v, d) => { const m = Math.pow(10, d); return Math.round(v * m) / m; };

function colorDe(num) {
  if (num === 0) return "#e8e2d4";                    /* maestra */
  const h = (205 + (num - 1) * 137.508) % 360;        /* ángulo áureo: vecinos numéricos, colores lejanos */
  return hsl(h, 0.72, 0.62);
}
function hsl(h, s, l) {
  const f = n => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return "#" + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, "0")).join("");
}

function siguienteMapeo(m) { return MAPEOS[(MAPEOS.indexOf(m) + 1) % MAPEOS.length]; }

/* ---------- el modelo ---------- */
function Modelo(opc) {
  opc = opc || {};
  this.rng = opc.rng || Math.random;
  this.agentes = [];
  this.laptops = new Map();                 /* num → {num, fi, color, maestra, params} */
  this.maestra = {
    vals: porDefecto(PARAMS),               /* valores de la maestra */
    retenido: {},                           /* k → true: rige la maestra */
    conj: porDefecto(CONJUNTO),
  };
  for (const p of PARAMS) this.maestra.retenido[p.k] = true;
  this.sigId = 1;
  this.pasos = 0;
  this._ef = new Map();
  this.limites = {};                        /* k → [mín, máx]: rango que la etapa permite a las laptops */
  this.tope = MAX_AGENTES_LAPTOP;           /* agentes por laptop que permite la etapa */
}

/* Lleva v al rango que la etapa permite para k (si lo limita). */
Modelo.prototype.acotar = function (k, v) {
  const lim = this.limites[k];
  return lim && typeof v === "number" ? Math.max(lim[0], Math.min(lim[1], v)) : v;
};
/* Al cambiar los límites: los valores propios de cada laptop entran al rango. */
Modelo.prototype.fijarLimites = function (limites) {
  this.limites = {};
  for (const k in limites || {}) {
    const p = PARAMS.find(q => q.k === k), l = limites[k];
    if (!p || p.opciones || !Array.isArray(l) || l.length !== 2) continue;
    const a = Math.max(p.min, Math.min(p.max, Math.min(+l[0], +l[1]))), b = Math.max(p.min, Math.min(p.max, Math.max(+l[0], +l[1])));
    if (isFinite(a) && isFinite(b)) this.limites[k] = [a, b];
  }
  for (const l of this.laptops.values()) for (const k in this.limites) l.params[k] = this.acotar(k, l.params[k]);
  this.derivar();
};

Modelo.prototype.efectivos = function (num) {
  const l = this.laptops.get(num), m = this.maestra, o = {};
  for (const p of PARAMS) o[p.k] = (m.retenido[p.k] || !l) ? m.vals[p.k] : l.params[p.k];
  if (o.fmax < o.fmin) { const t = o.fmin; o.fmin = o.fmax; o.fmax = t; }
  return o;
};

/* ---------- laptops ---------- */
Modelo.prototype.agregarLaptop = function (num, opc) {
  opc = opc || {};
  if (this.laptops.has(num)) return this.laptops.get(num);
  const l = { num, fi: opc.fi != null ? opc.fi : this.fiLibre(), color: colorDe(num),
              maestra: num === 0, simulada: !!opc.simulada, conectada: opc.conectada !== false,
              salidas: 2, params: porDefecto(PARAMS), fijo: {} };   /* estéreo por defecto */
  for (const k in this.limites) l.params[k] = this.acotar(k, l.params[k]);
  this.laptops.set(num, l);
  return l;
};
Modelo.prototype.quitarLaptop = function (num) {
  this.agentes = this.agentes.filter(a => a.dueno !== num);
  this.laptops.delete(num);
};
/* Canales de salida de la laptop (1 = mono; 2 = estéreo, por defecto; hasta 8 con una interfaz).
   Forman un grupo pegado a ella: ver puntosDeSalida en sonido.js.           */
Modelo.prototype.fijarSalidas = function (num, n) {
  const l = this.laptops.get(num);
  if (l) l.salidas = Math.max(1, Math.min(8, n | 0));
};
/* El medio del hueco más grande del arco: ahí entra una laptop nueva sin mover a las demás. */
Modelo.prototype.fiLibre = function () {
  const fis = [0, Math.PI, ...[...this.laptops.values()].map(l => l.fi)].sort((a, b) => a - b);
  let mejor = -1, fi = Math.PI / 2;
  for (let i = 1; i < fis.length; i++) if (fis[i] - fis[i - 1] > mejor) { mejor = fis[i] - fis[i - 1]; fi = (fis[i] + fis[i - 1]) / 2; }
  return fi;
};
/* Parámetro propio de una laptop, validado (puede venir de la red).
   'impuesto': lo pone la etapa (se salta 'fijo' y los límites).       */
Modelo.prototype.fijarParam = function (num, k, v, impuesto) {
  const l = this.laptops.get(num), p = PARAMS.find(q => q.k === k);
  if (!l || !p) return false;
  if (!impuesto && l.fijo[k]) return false;
  if (p.opciones) { if (!p.opciones.includes(v)) return false; }
  else { v = Number(v); if (!isFinite(v)) return false; v = Math.max(p.min, Math.min(p.max, v)); if (!impuesto) v = this.acotar(k, v); }
  l.params[k] = v;
  this.derivar();
  return true;
};
Modelo.prototype.moverLaptop = function (num, fi) {
  const l = this.laptops.get(num);
  if (l) l.fi = Math.max(0, Math.min(Math.PI, fi));
};
/* Reparte todas en el arco, equiespaciadas, en orden de número,
   con la maestra al centro. Laptop 1 a la izquierda del público.   */
Modelo.prototype.repartir = function () {
  const nums = [...this.laptops.keys()].filter(n => n !== 0).sort((a, b) => a - b);
  if (this.laptops.has(0)) nums.splice(Math.floor(nums.length / 2), 0, 0);
  const K = nums.length;
  nums.forEach((n, i) => { this.laptops.get(n).fi = Math.PI * (1 - (i + 0.5) / K); });
};
Modelo.prototype.posLaptop = function (num) {
  const l = this.laptops.get(num);
  return l ? { x: Math.cos(l.fi), y: Math.sin(l.fi) } : null;
};

/* ---------- agentes ---------- */
Modelo.prototype.crearAgente = function (num) {
  const l = this.laptops.get(num);
  if (!l || l.maestra) return null;
  if (this.agentes.filter(a => a.dueno === num).length >= Math.min(MAX_AGENTES_LAPTOP, this.tope)) return null;
  const rnd = this.rng;
  const fi = l.fi + (rnd() - 0.5) * 0.06;
  const rr = R_NACER - rnd() * 0.04;
  const w0 = rnd();                           /* frecuencia preferida ω⁰ ∈ [0,1] (Java: Math.random()) */
  const ag = {
    id: this.nuevoId(), dueno: num,
    x: rr * Math.cos(fi), y: rr * Math.sin(fi),
    a: fi + Math.PI + (rnd() - 0.5) * (2 * Math.PI / 3),   /* hacia adentro, ±60° */
    w0, wCO: w0, wPF: 0, ampl: 0, nVec: 1, mudo: false,
    fase: rnd(), disp: false,
    f: 0, A: 0, fm: 0, Avis: 0,
  };
  this.agentes.push(ag);
  this.derivar();
  return ag;
};
/* Los ids viajan en 16 bits: al llegar a 65535 vuelven a 1, saltando los que siguen vivos. */
Modelo.prototype.nuevoId = function () {
  if (this.sigId > 65535) { this.sigId = 1; this.envuelto = true; }
  const vivos = this.envuelto ? new Set(this.agentes.map(a => a.id)) : null;
  for (;;) {
    if (this.sigId > 65535) this.sigId = 1;
    const id = this.sigId++;
    if (!vivos || !vivos.has(id)) return id;
  }
};
Modelo.prototype.quitarAgente = function (num, id) {
  let i = -1;
  if (id != null) i = this.agentes.findIndex(a => a.id === id && a.dueno === num);
  else for (let j = this.agentes.length - 1; j >= 0; j--) if (this.agentes[j].dueno === num) { i = j; break; }
  if (i >= 0) this.agentes.splice(i, 1);
  return i >= 0;
};
Modelo.prototype.mutear = function (id, si) {
  const a = this.agentes.find(a => a.id === id);
  if (a) { a.mudo = si == null ? !a.mudo : !!si; this.derivar(); }
};
Modelo.prototype.mutearTodos = function (num, si) {
  for (const a of this.agentes) if (a.dueno === num) a.mudo = !!si;
  this.derivar();
};
Modelo.prototype.vaciar = function () { this.agentes = []; };
Modelo.prototype.reiniciar = function () {
  const cuenta = new Map();
  for (const a of this.agentes) cuenta.set(a.dueno, (cuenta.get(a.dueno) || 0) + 1);
  this.agentes = [];
  for (const [num, n] of cuenta) for (let i = 0; i < n; i++) this.crearAgente(num);
  this.pasos = 0;
};

/* ---------- un paso de la dinámica: updateVicsekChate ---------- */
Modelo.prototype.paso = function () {
  const A = this.agentes, n = A.length, rnd = this.rng;
  const cj = this.maestra.conj, kap = cj.kappa;
  const caos = cj.caos || 0, gf = cj.gf || 0, gx = cj.gx || 0, gy = cj.gy == null ? 0.5 : cj.gy;
  const P = this._ef; P.clear();
  for (const num of this.laptops.keys()) P.set(num, this.efectivos(num));

  const c = new Float64Array(n), s = new Float64Array(n);
  const vx = new Float64Array(n), vy = new Float64Array(n);       /* alineación (< 0,5·R) */
  const pfx = new Float64Array(n), pfy = new Float64Array(n);     /* vel. media de vecinos (< R) */
  const omg = new Float64Array(n);                                /* Ω_i, ec. 7.5 */
  const ex = new Float64Array(n), ey = new Float64Array(n);       /* v2: cohesión/separación + imán */
  const fc = new Float64Array(n), fs = new Float64Array(n), ks = new Float64Array(n);   /* v2: fases */
  for (let i = 0; i < n; i++) { c[i] = Math.cos(A[i].a); s[i] = Math.sin(A[i].a);
                                fc[i] = Math.cos(DOS_PI * A[i].fase); fs[i] = Math.sin(DOS_PI * A[i].fase); }

  for (let i = 0; i < n; i++) {
    const ai = A[i], p = P.get(ai.dueno);
    const R2 = p.radio * p.radio, Ra2 = 0.25 * R2;
    let sx = 0, sy = 0, na = 0, qx = 0, qy = 0, nq = 0, sco = 0;
    let mx = 0, my = 0, rx = 0, ry = 0, sf = 0;
    const Rr = p.radio;
    for (let j = 0; j < n; j++) {
      const aj = A[j];
      const dx = ai.x - aj.x, dy = ai.y - aj.y, d2 = dx * dx + dy * dy;
      if (d2 >= R2) continue;
      const w = (j === i || aj.dueno === ai.dueno) ? 1 : kap;
      if (w <= 0) continue;
      if (d2 < Ra2) { sx += w * c[j]; sy += w * s[j]; na += w; }       /* dr < 0.5*radius */
      qx += w * c[j]; qy += w * s[j]; sco += w * aj.wCO; nq += w;      /* dr < radius */
      if (j !== i) {
        mx -= w * dx; my -= w * dy;                                    /* hacia el vecino */
        if (d2 > 1e-12) { const d = Math.sqrt(d2), q = w * (1 - d / Rr) / d; rx += q * dx; ry += q * dy; }   /* lejos del vecino, más fuerte de cerca */
        sf += w * (fs[j] * fc[i] - fc[j] * fs[i]);                     /* sin(θj − θi) */
      }
    }
    {
      const otros = nq - 1;
      if (otros > 1e-9) {
        if (p.coh > 0) { ex[i] = G_COH * p.coh * mx / (otros * Rr); ey[i] = G_COH * p.coh * my / (otros * Rr); }
        else if (p.coh < 0) { ex[i] = -G_COH * p.coh * rx / otros; ey[i] = -G_COH * p.coh * ry / otros; }
        ks[i] = sf / otros;
      }
      if (p.iman !== 0) {
        const ux = p.ix - ai.x, uy = p.iy - ai.y, u = Math.hypot(ux, uy);
        /* atrae con toda su fuerza desde lejos y cada vez menos dentro de R_IMAN: el sub-enjambre
           ronda el imán en vez de apretarse en un punto; al repeler, empuja más de cerca */
        const q = p.iman > 0 ? Math.min(1, (u / R_IMAN) * (u / R_IMAN)) : 1 / (1 + u / R_IMAN);
        if (u > 1e-6) { ex[i] += G_IMAN * p.iman * q * ux / u; ey[i] += G_IMAN * p.iman * q * uy / u; }
      }
      if (gf > 0) {                 /* imán general del director: llama a todos los agentes, sean de quien sean */
        const ux = gx - ai.x, uy = gy - ai.y, u = Math.hypot(ux, uy);
        const q = Math.min(1, (u / R_IMAN) * (u / R_IMAN));
        if (u > 1e-6) { ex[i] += G_DIR * gf * q * ux / u; ey[i] += G_DIR * gf * q * uy / u; }
      }
    }
    vx[i] = sx / na; vy[i] = sy / na;                                  /* na ≥ 1: se incluye a sí mismo */

    /* vxPF: promedio de los vecinos SIN el propio agente; sin vecinos, el propio.
       Con peso total de los otros < 1 (solo κ < 1) se mezcla con el propio para
       que la fricción no salte; con conteos enteros es idéntico al Java.       */
    const otros = nq - 1, ox = qx - c[i], oy = qy - s[i];
    if (otros >= 1) { pfx[i] = ox / otros; pfy[i] = oy / otros; }
    else { pfx[i] = ox + (1 - otros) * c[i]; pfy[i] = oy + (1 - otros) * s[i]; }

    const den = p.b2 + otros;                                          /* k2CO + (nvecinosCOPF − 1) */
    omg[i] = den > 1e-12 ? (p.b2 * ai.w0 + (sco - ai.wCO)) / den : ai.wCO;
    ai.nVec = nq;
    ai.ampl = 1 - 1 / nq;                                              /* amplCOPF */
  }

  for (let i = 0; i < n; i++) {
    const ai = A[i], p = P.get(ai.dueno);
    ai.wCO += p.b1 * (omg[i] - ai.wCO);                                /* ec. 7.4, k1CO = β1 */
    const rx = pfx[i] - c[i], ry = pfy[i] - s[i];
    ai.wPF = 0.5 * Math.sqrt(rx * rx + ry * ry);                       /* ec. 7.7 */

    const da = DOS_PI * rnd();                                         /* Chaté: ruido vectorial */
    let a = Math.atan2(vy[i] + ey[i] + p.cNoise * Math.sin(da), vx[i] + ex[i] + p.cNoise * Math.cos(da));
    a += DOS_PI * Math.max(0, Math.min(1, p.vNoise + caos)) * (rnd() - 0.5);   /* Vicsek: ruido angular (+ el caos del director) */
    ai.x += DT * p.vel * Math.cos(a);
    ai.y += DT * p.vel * Math.sin(a);
    ai.a = reflejar(ai, a);

    /* v2 · fase: θ̇ = f_p · (1 + k · ⟨sin 2π(θj − θi)⟩),  f_p = pulso · 2^(2·ω_CO − 1) */
    const fp = p.pulso * Math.pow(2, 2 * Math.min(1, Math.max(0, ai.wCO)) - 1);
    ai.fase += fp * PASO_S * (1 + p.kfase * ks[i]);
    if (ai.fase >= 1) { ai.fase -= Math.floor(ai.fase); ai.disp = true; }
  }
  this.pasos++;
  this.derivar(P);
};

/* Bordes reflectantes: diámetro (y = 0) y arco (r = 1). */
function reflejar(ag, a) {
  for (let k = 0; k < 3; k++) {
    let cambio = false;
    if (ag.y < 0) {
      ag.y = -ag.y;
      if (Math.sin(a) < 0) a = -a;
      cambio = true;
    }
    const r = Math.hypot(ag.x, ag.y);
    if (r > 1) {
      const nx = ag.x / r, ny = ag.y / r, rr = Math.max(0, 2 - r);
      ag.x = nx * rr; ag.y = ny * rr;
      const ux = Math.cos(a), uy = Math.sin(a), dot = ux * nx + uy * ny;
      if (dot > 0) a = Math.atan2(uy - 2 * dot * ny, ux - 2 * dot * nx);
      cambio = true;
    }
    if (!cambio) break;
  }
  return a;
}

/* ---------- del estado a sonido: ω ∈ [0,1] → Hz, amplitud ---------- */
function omegaDe(ag, mapeo) {
  if (mapeo === "directo") return Math.min(1, Math.max(0, (ag.x + 1) / 2));   /* ω ↔ x */
  if (mapeo === "friccion") return Math.min(1, ag.wPF);
  return Math.min(1, Math.max(0, ag.wCO));
}
function frecuencia(w, p) {
  return p.escala === "lin" ? p.fmin + w * (p.fmax - p.fmin) : p.fmin * Math.pow(p.fmax / p.fmin, w);
}
/* v2 · afinación: la frecuencia de la portadora se lleva a la nota más cercana. */
function afinar(f, p) {
  if (p.afinacion === "armonicos") return p.fmin * Math.max(1, Math.round(f / p.fmin));
  if (p.afinacion === "cromatica") return 440 * Math.pow(2, Math.round(12 * Math.log2(f / 440)) / 12);
  if (p.afinacion === "pentatonica") {
    const st = 12 * Math.log2(Math.max(f, p.fmin) / p.fmin), oct = Math.floor(st / 12), r = st - 12 * oct;
    let mejor = 0; for (const g of PENTA) if (Math.abs(g - r) < Math.abs(mejor - r)) mejor = g;
    return p.fmin * Math.pow(2, (12 * oct + mejor) / 12);
  }
  return f;
}
Modelo.prototype.derivar = function (P) {
  if (!P || !P.size) { P = new Map(); for (const num of this.laptops.keys()) P.set(num, this.efectivos(num)); }
  const gen = this.maestra.conj.general, gGen = gen == null ? 1 : gen <= SILENCIO_DB ? 0 : dbLin(gen);
  for (const ag of this.agentes) {
    const p = P.get(ag.dueno);
    if (!p) continue;
    let mod = p.moduladora; if (mod === p.mapeo) mod = siguienteMapeo(p.mapeo);
    ag.w = omegaDe(ag, p.mapeo);
    ag.f = afinar(frecuencia(ag.w, p), p);
    ag.fm = frecuencia(omegaDe(ag, mod), p);
    /* ec. 7.6: A = (ñ·Amax + Amin)/(ñ+1) = Amin + (1−Amin)(1 − 1/n), Amax = 1.
       En el directo el artículo deja la amplitud constante.                  */
    ag.Avis = p.mapeo === "directo" ? 1 : p.amin + (1 - p.amin) * ag.ampl;
    ag.A = ag.mudo ? 0 : ag.Avis * dbLin(p.nivel) * gGen;
  }
};

/* ---------- respaldo: si la página de la maestra se recarga, el servidor se lo devuelve ---------- */
Modelo.prototype.exportar = function () {
  const r3 = v => r(v, 6);
  return {
    v: 4, sigId: this.sigId, envuelto: !!this.envuelto, pasos: this.pasos, maestra: this.maestra,
    limites: this.limites, tope: this.tope,
    laptops: [...this.laptops.values()].map(l => ({ num: l.num, fi: l.fi, simulada: l.simulada, salidas: l.salidas, params: l.params, fijo: l.fijo })),
    agentes: this.agentes.map(a => [a.id, a.dueno, r3(a.x), r3(a.y), r3(a.a), r3(a.w0), r3(a.wCO), a.mudo ? 1 : 0]),
  };
};
Modelo.prototype.importar = function (o) {
  if (!o || o.v !== 4) return false;        /* un respaldo de las versiones 1 o 2 no se mezcla con esta */
  const m = this.maestra;
  for (const p of PARAMS) { if (o.maestra.vals && p.k in o.maestra.vals) m.vals[p.k] = o.maestra.vals[p.k];
                            if (o.maestra.retenido && p.k in o.maestra.retenido) m.retenido[p.k] = !!o.maestra.retenido[p.k]; }
  for (const p of CONJUNTO) if (o.maestra.conj && p.k in o.maestra.conj) m.conj[p.k] = o.maestra.conj[p.k];
  this.laptops.clear();
  for (const q of o.laptops) {
    const l = this.agregarLaptop(q.num, { fi: q.fi, simulada: q.simulada, conectada: q.num === 0 || q.simulada });
    l.salidas = q.salidas || 2;
    Object.assign(l.params, q.params || {});
    l.fijo = Object.assign({}, q.fijo || {});
  }
  this.limites = Object.assign({}, o.limites || {});
  this.tope = o.tope != null ? o.tope : MAX_AGENTES_LAPTOP;
  this.agentes = o.agentes.filter(q => this.laptops.has(q[1])).map(q => ({
    id: q[0], dueno: q[1], x: q[2], y: q[3], a: q[4], w0: q[5], wCO: q[6], mudo: !!q[7],
    wPF: 0, ampl: 0, nVec: 1, fase: this.rng(), disp: false, f: 0, A: 0, fm: 0, Avis: 0 }));
  this.sigId = o.sigId || 1; this.envuelto = !!o.envuelto; this.pasos = o.pasos || 0;
  this.derivar();
  return true;
};

/* ---------- medidas ---------- */
Modelo.prototype.polarizacion = function (num) {        /* ψ, ec. 7.3 */
  let sx = 0, sy = 0, k = 0;
  for (const a of this.agentes) if (num == null || a.dueno === num) { sx += Math.cos(a.a); sy += Math.sin(a.a); k++; }
  return k ? Math.hypot(sx, sy) / k : 0;
};
Modelo.prototype.vecinosMedio = function () {           /* 'dens' del Java, con la vecindad de R */
  let s = 0; for (const a of this.agentes) s += a.nVec - 1;
  return this.agentes.length ? s / this.agentes.length : 0;
};

/* ---------- lo que se difunde ~30 veces por segundo ---------- */
Modelo.prototype.instantanea = function () {
  const c = this.maestra.conj;
  const laptops = [];
  for (const l of this.laptops.values()) {
    const e = this.efectivos(l.num);
    laptops.push({ n: l.num, fi: r(l.fi, 4), c: l.color, m: l.maestra ? 1 : 0, s: l.salidas,
                   voz: e.voz, color: r(e.color, 3), ix: r(e.ix, 3), iy: r(e.iy, 3), iman: l.maestra ? 0 : r(e.iman, 3) });
  }
  const ag = new Array(this.agentes.length * CAMPOS.length);
  let k = 0;
  for (const a of this.agentes) {
    ag[k++] = a.id; ag[k++] = a.dueno;
    ag[k++] = r(a.x, 4); ag[k++] = r(a.y, 4); ag[k++] = r(a.a, 3);
    ag[k++] = r(a.f, 1); ag[k++] = r(a.A, 4); ag[k++] = r(a.fm, 1);
    ag[k++] = r(Math.min(1, a.wPF), 3); ag[k++] = a.mudo ? 1 : 0;
    ag[k++] = a.disp ? 1 : 0; a.disp = false;        /* el disparo viaja en un solo cuadro */
  }
  return { v: 4, paso: this.pasos,
           conj: { rolloff: c.rolloff, blur: c.blur, tauF: c.tauF, tauA: c.tauA, ancho: c.ancho,
                   gx: r(c.gx || 0, 3), gy: r(c.gy == null ? 0.5 : c.gy, 3), gf: r(c.gf || 0, 3) },
           laptops, campos: CAMPOS, agentes: ag };
};

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, {
  Modelo, PARAMS, CONJUNTO, ALIAS_CEDE, SILENCIO_DB, CAMPOS, MAPEOS, NOMBRE_MAPEO, VOCES, NOMBRE_VOZ, AFINACIONES, NOMBRE_AFINACION, afinar, DT, MAX_AGENTES_LAPTOP, colorDe, frecuencia, omegaDe, reflejar,
});
}
EnjambresModelo(typeof self !== "undefined" ? self : globalThis);
