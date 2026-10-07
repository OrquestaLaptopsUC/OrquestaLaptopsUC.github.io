// render.js — genera render.wav a partir de motor.js
// Orquesta de Laptops UC · IEE2003 · T1 · Lucas Nervi
//
// No usa Web Audio (Node no lo tiene): sintetiza directamente en un buffer
// de muestras con las MISMAS filas, operaciones seriales y células rítmicas
// que motor.js define y que estacion.html usa en vivo. La única diferencia
// con estacion.html es la capa de síntesis (osciladores calculados a mano en
// vez de OscillatorNode de Web Audio), documentada en PARTITURA.md.
//
// Uso: node render.js   ->  escribe render.wav en esta misma carpeta

const fs = require("fs");
const path = require("path");
const M = require("./motor.js");

const SR = 44100;
const DURACION = 60; // segundos, dentro del rango pedido (30-90s)
const N = Math.ceil(DURACION * SR);

// buffer estéreo, en floats (se convierte a PCM16 al final)
const L = new Float64Array(N);
const R = new Float64Array(N);

function t2s(tSeg) {
  return Math.floor(tSeg * SR);
}

// --- síntesis de una nota: seno + un par de armónicos suaves, ADSR simple,
// panorama equal-power. timbre 0..1 controla cuánto armónico se agrega
// (variación tímbrica por voz/estación, como pide la Parte 3). ---
function agregaNota(freq, inicioSeg, duracionSeg, gain, pan, timbre) {
  const i0 = t2s(inicioSeg);
  const dur = Math.max(0.03, duracionSeg);
  const nSamples = Math.floor(dur * SR);
  const atk = Math.min(0.012, dur * 0.25);
  const rel = Math.min(0.09, dur * 0.4);
  const panL = Math.cos((Math.min(1, Math.max(0, pan)) * Math.PI) / 2);
  const panR = Math.sin((Math.min(1, Math.max(0, pan)) * Math.PI) / 2);
  for (let n = 0; n < nSamples; n++) {
    const idx = i0 + n;
    if (idx < 0 || idx >= N) continue;
    const tt = n / SR;
    let env;
    if (tt < atk) env = tt / atk;
    else if (tt > dur - rel) env = Math.max(0, (dur - tt) / rel);
    else env = 1;
    env = env * env; // suaviza el ataque/caída
    const ph = 2 * Math.PI * freq * tt;
    let s = Math.sin(ph);
    s += timbre * 0.28 * Math.sin(2 * ph); // 2do armónico
    s += timbre * 0.12 * Math.sin(3 * ph); // 3er armónico
    s *= gain * env;
    L[idx] += s * panL;
    R[idx] += s * panR;
  }
}

// --- armonía: "master chord" de Slonimsky (dominante 7 sin 5a) sobre el
// grado activo, en octava grave, con crossfade al cambiar de alteraciones ---
function generaArmonia(cambios, gain) {
  // cambios: [{desde,hasta,grado,alteraciones}] tramos de tiempo
  for (const tramo of cambios) {
    const notasAcorde = M.masterChordSobreGrado(tramo.grado, tramo.alteraciones);
    const dur = tramo.hasta - tramo.desde;
    const fadeIn = Math.min(1.2, dur * 0.15);
    const fadeOut = Math.min(1.2, dur * 0.15);
    notasAcorde.forEach((nt, gi) => {
      const freq = M.notaAFrecuencia(nt.letra, nt.alteracion, 3);
      // partimos el sostenido en notas cortas encadenadas para poder
      // aplicar envolvente de entrada/salida con agregaNota
      const pasos = Math.max(4, Math.floor(dur / 0.6));
      const pasoDur = dur / pasos;
      for (let p = 0; p < pasos; p++) {
        const tIni = tramo.desde + p * pasoDur;
        let g = gain * (0.7 + 0.3 * Math.sin(gi + p * 0.7)); // shimmer suave
        const tEnGlobal = tIni - tramo.desde;
        const tRestante = dur - tEnGlobal;
        if (tEnGlobal < fadeIn) g *= tEnGlobal / fadeIn;
        if (tRestante < fadeOut) g *= Math.max(0, tRestante / fadeOut);
        agregaNota(freq, tIni, pasoDur * 1.05, g, 0.5, 0.15);
      }
    });
  }
}

// --- una voz isorrítmica: cicla fila(color) x talea, con alteraciones
// variables en el tiempo (para reflejar el cambio del director a mitad de
// render) ---
function generaVoz(opts) {
  const { k0, lectura, celulasPorTramo, tempoQ, inicioSeg, pan, gain, octava, timbre, alteracionesPorTiempo } = opts;
  const fila = M.leer(M.filaGeneradora(k0), lectura);
  const corchea = 60 / tempoQ / 2;
  let tSeg = inicioSeg;
  let tramoActual = 0;
  while (tSeg < DURACION) {
    const tramo = celulasPorTramo[Math.min(tramoActual, celulasPorTramo.length - 1)];
    const celula = tramo.celula;
    const finTramo = tramo.hasta;
    // genera eventos de este tramo hasta llegar a su límite temporal
    const evs = M.generarEventos(fila, celula, celula.length * 6); // más que de sobra
    for (const ev of evs) {
      const durSeg = ev.duracionCorcheas * corchea;
      if (tSeg >= finTramo || tSeg >= DURACION) break;
      const altActual = alteracionesPorTiempo(tSeg);
      const freq = M.gradoAFrecuencia(ev.grado, altActual, octava);
      agregaNota(freq, tSeg, durSeg * 0.92, gain, pan, timbre);
      tSeg += durSeg;
    }
    tramoActual++;
    if (tramoActual >= celulasPorTramo.length && tSeg < DURACION && tSeg >= finTramo) {
      // se acabaron los tramos definidos: sostiene el último
      tramoActual = celulasPorTramo.length - 1;
      if (tSeg >= celulasPorTramo[tramoActual].hasta) break;
    }
  }
}

// ================= partitura del render (60s) =================
// Sin Pulso: el tiempo se sostiene de oído, guiado por Armonía.
// 0–4s    entra Armonía (todo natural)
// 4–28s   Sección A: las 4 voces entran escalonadas, células largas, natural
// 28–48s  Sección B: el director activa Fa# — voces pasan a células cortas
// 48–60s  Convergencia: las 4 voces convergen a la célula 4-3-4 (11 corcheas)

const TEMPO_Q = 96; // negra = 96 bpm

const ALT_NATURAL = M.alteracionesPorDefecto();
const ALT_CON_FA_SOSTENIDO = Object.assign({}, ALT_NATURAL, { F: 1 });

function alteracionesPorTiempo(tSeg) {
  return tSeg < 28 ? ALT_NATURAL : ALT_CON_FA_SOSTENIDO;
}

generaArmonia(
  [
    { desde: 0, hasta: 28, grado: 1, alteraciones: ALT_NATURAL },
    { desde: 28, hasta: 60, grado: 5, alteraciones: ALT_CON_FA_SOSTENIDO },
  ],
  0.05
);

const L_ = M.TALEAS.larga;
const C_ = M.TALEAS.corta;
const V_ = M.TALEAS.convergencia[0];

generaVoz({
  k0: 1,
  lectura: "P",
  tempoQ: TEMPO_Q,
  inicioSeg: 4,
  pan: 0.15,
  gain: 0.16,
  octava: 4,
  timbre: 0.15,
  alteracionesPorTiempo,
  celulasPorTramo: [
    { celula: L_[0], hasta: 28 },
    { celula: C_[0], hasta: 48 },
    { celula: V_, hasta: 60 },
  ],
});

generaVoz({
  k0: 2,
  lectura: "R",
  tempoQ: TEMPO_Q,
  inicioSeg: 8,
  pan: 0.4,
  gain: 0.15,
  octava: 4,
  timbre: 0.35,
  alteracionesPorTiempo,
  celulasPorTramo: [
    { celula: L_[1], hasta: 28 },
    { celula: C_[1], hasta: 48 },
    { celula: V_, hasta: 60 },
  ],
});

generaVoz({
  k0: 3,
  lectura: "I",
  tempoQ: TEMPO_Q,
  inicioSeg: 12,
  pan: 0.65,
  gain: 0.15,
  octava: 5,
  timbre: 0.05,
  alteracionesPorTiempo,
  celulasPorTramo: [
    { celula: L_[2], hasta: 28 },
    { celula: C_[2], hasta: 48 },
    { celula: V_, hasta: 60 },
  ],
});

generaVoz({
  k0: 4,
  lectura: "RI",
  tempoQ: TEMPO_Q,
  inicioSeg: 16,
  pan: 0.85,
  gain: 0.14,
  octava: 3,
  timbre: 0.5,
  alteracionesPorTiempo,
  celulasPorTramo: [
    { celula: L_[0], hasta: 28 },
    { celula: C_[0], hasta: 48 },
    { celula: V_, hasta: 60 },
  ],
});

// fade-out final (evaporación, 54s-60s)
(function fadeFinal() {
  const iniFade = 54,
    finFade = 60;
  const i0 = t2s(iniFade),
    i1 = t2s(finFade);
  for (let i = i0; i < i1 && i < N; i++) {
    const g = 1 - (i - i0) / (i1 - i0);
    L[i] *= g;
    R[i] *= g;
  }
})();

// ================= normaliza y escribe WAV =================
let peak = 0;
for (let i = 0; i < N; i++) {
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = peak > 0 ? 0.9 / peak : 1;

function writeWav(filePath, left, right, sampleRate) {
  const numFrames = left.length;
  const bytesPerSample = 2;
  const numChannels = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    const l = Math.max(-1, Math.min(1, left[i] * norm));
    const r = Math.max(-1, Math.min(1, right[i] * norm));
    buffer.writeInt16LE(Math.round(l * 32767), offset);
    buffer.writeInt16LE(Math.round(r * 32767), offset + 2);
    offset += 4;
  }
  fs.writeFileSync(filePath, buffer);
}

const outPath = path.join(__dirname, "render.wav");
writeWav(outPath, L, R, SR);
console.log("escrito:", outPath, "-", DURACION, "s a", SR, "Hz");
