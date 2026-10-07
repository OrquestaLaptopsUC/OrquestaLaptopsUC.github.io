/* ============================================================
   ENJAMBRES · protocolo
   Orquesta de Laptops UC (OLUC) · IEE2003

   La instantánea que la maestra difunde ~30 veces por segundo, en
   binario (un mensaje WebSocket binario por cuadro). Little-endian.

   CABECERA (29 bytes)
     0  u8   0x45 ('E')
     1  u8   versión = 2
     2  u32  número de paso
     6  f32  DBAP: caída (dB por doble distancia)
    10  f32  DBAP: difuminado
    14  f32  suavizado de f (ms)
    18  f32  suavizado de A (ms)
    22  f32  ancho del grupo de salidas de cada laptop (grados)
    26  u8   cantidad de laptops  (L)
    27  u16  cantidad de agentes  (N)

   LAPTOP (9 bytes) × L
     u8  número (0 = maestra)      u8  banderas (bit 0: maestra)
     u16 fi  = fi/π · 65535        (posición en el arco, 0 = derecha del público)
     u8  r, g, b                   (color)
     u8  ring = profundidad · 255  (del sub-enjambre de esa laptop)
     u8  salidas                   (canales: 1 = un parlante; 2…8 con interfaz)

   AGENTE (14 bytes) × N
     u16 id          u8 dueño        u8 banderas (bit 0: muteado)
     u16 x = (x+1)/2 · 65535         u16 y = y · 65535
     u8  a = ángulo/2π · 256         (solo para dibujar)
     u16 f, u16 fm: log(f/10)/log(2400) · 65535   (10 Hz a 24 kHz, error ≤ 0,1 cents)
     u8  A: 0 = silencio; si no, A en dB = −(255 − q) · 0,375   (hasta −95 dB)

   decodificar() devuelve lo mismo que Modelo.instantanea(), así el
   motor de sonido y el dibujo no saben si el cuadro vino en binario.
   ============================================================ */
function EnjambresProtocolo(raiz) {
"use strict";

const MAGIA = 0x45, VERSION = 2;
const CAB = 29, POR_LAPTOP = 9, POR_AGENTE = 14;
const F0 = 10, LOG_F = Math.log(2400);          /* 10 Hz · 2400 = 24 kHz */
const PASO_DB = 0.375;
const CAMPOS = ["id", "dueno", "x", "y", "a", "f", "A", "fm", "ring", "mudo"];
const DOS_PI = 2 * Math.PI;

const u16 = v => Math.max(0, Math.min(65535, Math.round(v * 65535)));
const qf = f => u16(Math.log(Math.max(F0, f) / F0) / LOG_F);
const df = q => F0 * Math.exp(q / 65535 * LOG_F);
function qA(A) {
  if (!(A > 0)) return 0;
  return Math.max(0, Math.min(255, Math.round(255 + 20 * Math.log10(A) / PASO_DB)));
}
const dA = q => q === 0 ? 0 : Math.pow(10, -(255 - q) * PASO_DB / 20);
const hex = (r, g, b) => "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");

function bytes(nLaptops, nAgentes) { return CAB + nLaptops * POR_LAPTOP + nAgentes * POR_AGENTE; }

/* inst: lo que devuelve Modelo.instantanea() → ArrayBuffer */
function codificar(inst) {
  const L = inst.laptops.length, C = inst.campos.length, N = inst.agentes.length / C;
  const buf = new ArrayBuffer(bytes(L, N)), d = new DataView(buf);
  d.setUint8(0, MAGIA); d.setUint8(1, VERSION);
  d.setUint32(2, inst.paso >>> 0, true);
  d.setFloat32(6, inst.conj.rolloff, true); d.setFloat32(10, inst.conj.blur, true);
  d.setFloat32(14, inst.conj.tauF, true); d.setFloat32(18, inst.conj.tauA, true);
  d.setFloat32(22, inst.conj.ancho || 0, true);
  d.setUint8(26, L); d.setUint16(27, N, true);
  let o = CAB;
  for (const l of inst.laptops) {
    const c = parseInt(l.c.slice(1), 16);
    d.setUint8(o, l.n); d.setUint8(o + 1, l.m ? 1 : 0);
    d.setUint16(o + 2, u16(l.fi / Math.PI), true);
    d.setUint8(o + 4, c >> 16 & 255); d.setUint8(o + 5, c >> 8 & 255); d.setUint8(o + 6, c & 255);
    d.setUint8(o + 7, Math.round(Math.max(0, Math.min(1, l.ring || 0)) * 255));
    d.setUint8(o + 8, Math.max(1, Math.min(255, l.s || 1)));
    o += POR_LAPTOP;
  }
  const A = inst.agentes;
  for (let i = 0; i < A.length; i += C) {
    let a = A[i + 4] % DOS_PI; if (a < 0) a += DOS_PI;
    d.setUint16(o, A[i], true);
    d.setUint8(o + 2, A[i + 1]);
    d.setUint8(o + 3, A[i + 9] ? 1 : 0);
    d.setUint16(o + 4, u16((A[i + 2] + 1) / 2), true);
    d.setUint16(o + 6, u16(A[i + 3]), true);
    d.setUint8(o + 8, Math.round(a / DOS_PI * 256) & 255);
    d.setUint16(o + 9, qf(A[i + 5]), true);
    d.setUint16(o + 11, qf(A[i + 7]), true);
    d.setUint8(o + 13, qA(A[i + 6]));
    o += POR_AGENTE;
  }
  return buf;
}

/* ArrayBuffer → objeto con la forma de Modelo.instantanea(); null si no es un cuadro válido */
function decodificar(buf) {
  if (!buf || buf.byteLength < CAB) return null;
  const d = new DataView(buf);
  if (d.getUint8(0) !== MAGIA || d.getUint8(1) !== VERSION) return null;
  const L = d.getUint8(26), N = d.getUint16(27, true);
  if (buf.byteLength !== bytes(L, N)) return null;
  const inst = {
    v: VERSION, paso: d.getUint32(2, true),
    conj: { rolloff: d.getFloat32(6, true), blur: d.getFloat32(10, true),
            tauF: d.getFloat32(14, true), tauA: d.getFloat32(18, true), ancho: d.getFloat32(22, true) },
    laptops: new Array(L), campos: CAMPOS, agentes: new Array(N * CAMPOS.length),
  };
  const ring = new Float64Array(256);
  let o = CAB;
  for (let k = 0; k < L; k++) {
    const n = d.getUint8(o);
    inst.laptops[k] = { n, m: d.getUint8(o + 1) & 1, fi: d.getUint16(o + 2, true) / 65535 * Math.PI,
      c: hex(d.getUint8(o + 4), d.getUint8(o + 5), d.getUint8(o + 6)), ring: d.getUint8(o + 7) / 255,
      s: d.getUint8(o + 8) };
    ring[n] = inst.laptops[k].ring;
    o += POR_LAPTOP;
  }
  const A = inst.agentes;
  for (let i = 0, j = 0; i < N; i++, j += CAMPOS.length) {
    const dueno = d.getUint8(o + 2);
    A[j] = d.getUint16(o, true);
    A[j + 1] = dueno;
    A[j + 2] = d.getUint16(o + 4, true) / 65535 * 2 - 1;
    A[j + 3] = d.getUint16(o + 6, true) / 65535;
    A[j + 4] = d.getUint8(o + 8) / 256 * DOS_PI;
    A[j + 5] = df(d.getUint16(o + 9, true));
    A[j + 6] = dA(d.getUint8(o + 13));
    A[j + 7] = df(d.getUint16(o + 11, true));
    A[j + 8] = ring[dueno];
    A[j + 9] = d.getUint8(o + 3) & 1;
    o += POR_AGENTE;
  }
  return inst;
}

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { codificar, decodificar, bytesCuadro: bytes });
}
EnjambresProtocolo(typeof self !== "undefined" ? self : globalThis);
