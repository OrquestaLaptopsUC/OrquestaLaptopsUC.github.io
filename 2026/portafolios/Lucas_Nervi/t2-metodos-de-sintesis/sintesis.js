// T2 — motor de síntesis: aditiva + Karplus-Strong, compartido por index.html
// Lucas Nervi — IEE2003 Orquesta de Laptops UC

const SR = 44100;

// ---------- utilidades ----------

function audioBufferToWav(buf) {
  const numCh = buf.numberOfChannels;
  const len = buf.length * numCh * 2 + 44;
  const ab = new ArrayBuffer(len);
  const view = new DataView(ab);
  const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + buf.length * numCh * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, buf.sampleRate, true);
  view.setUint32(28, buf.sampleRate * numCh * 2, true);
  view.setUint16(32, numCh * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, buf.length * numCh * 2, true);
  let off = 44;
  const chans = [];
  for (let c = 0; c < numCh; c++) chans.push(buf.getChannelData(c));
  for (let i = 0; i < buf.length; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, chans[c][i]));
      view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function noteName(freq) {
  const A4 = 440, names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const n = Math.round(12 * Math.log2(freq / A4)) + 57;
  return names[((n % 12) + 12) % 12] + Math.floor(n / 12 - 1);
}

// ---------- síntesis aditiva ----------
// construye el espectro componente a componente: nPartials osciladores senoidales,
// cada uno con su propia amplitud (tilt espectral + inarmonicidad opcional) y envolvente ADSR.

class AdditiveSynth {
  constructor(p = {}) {
    this.f0 = p.f0 ?? 220;
    this.nPartials = p.nPartials ?? 8;
    this.inharm = p.inharm ?? 0;        // 0 = armónico puro; >0 curva tipo cuerda rígida
    this.tilt = p.tilt ?? 0.75;         // caída de amplitud por parcial (0-1)
    this.attack = p.attack ?? 0.005;
    this.decay = p.decay ?? 0.25;
    this.sustainLevel = p.sustainLevel ?? 0.0; // 0 = sonido percusivo (decae a silencio)
    this.release = p.release ?? 0.4;
    this.duration = p.duration ?? 1.2;
  }

  partialFreq(n) {
    // n = 1..N. Inarmonicidad al estilo cuerda rígida (Fletcher-Rossing).
    return this.f0 * n * Math.sqrt(1 + this.inharm * n * n);
  }

  partialGain(n) {
    return Math.pow(this.tilt, n - 1) / this.nPartials;
  }

  // agenda el sonido en cualquier AudioContext (real u offline), a partir de t0 (segundos)
  schedule(ctx, dest, t0 = 0) {
    const total = this.attack + this.decay + this.release + 0.05;
    const voiceGain = ctx.createGain();
    voiceGain.connect(dest);
    const oscs = [];
    for (let n = 1; n <= this.nPartials; n++) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(this.partialFreq(n), t0);
      const g = ctx.createGain();
      const peak = this.partialGain(n);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + this.attack);
      g.gain.linearRampToValueAtTime(peak * Math.max(this.sustainLevel, 0.001), t0 + this.attack + this.decay);
      g.gain.linearRampToValueAtTime(0.00001, t0 + this.attack + this.decay + this.release);
      osc.connect(g).connect(voiceGain);
      osc.start(t0);
      osc.stop(t0 + total);
      oscs.push(osc);
    }
    return { stopAt: t0 + total, node: voiceGain };
  }

  paramTable() {
    return [
      ["f0", "20 – 2000 Hz", "Hz", "fundamental: fija todas las frecuencias de los parciales"],
      ["nPartials", "1 – 32", "parciales", "cuántos armónicos se suman; más = más brillo y más \"lleno\""],
      ["inharm", "0 – 0.02", "—", "curva los parciales fuera de la serie armónica (cuerda rígida)"],
      ["tilt", "0.3 – 0.98", "—", "qué tan rápido cae la amplitud de los parciales agudos"],
      ["attack", "0.001 – 0.3", "s", "tiempo de subida de cada parcial"],
      ["decay", "0.02 – 1.5", "s", "tiempo de caída inicial hacia el sustain"],
      ["sustainLevel", "0 – 1", "—", "nivel sostenido (0 = puramente percusivo)"],
      ["release", "0.05 – 3", "s", "tiempo de extinción final"],
    ];
  }
}

// ---------- Karplus-Strong (modelado físico de cuerda pulsada) ----------
// excitación de ruido -> línea de retardo de largo N=SR/f0 con realimentación filtrada (promedio + decay).
// la propia línea de retardo ES el filtro: por eso satisface el requisito de delay/filtro del enunciado.

class KarplusStrongSynth {
  constructor(p = {}) {
    this.freq = p.freq ?? 220;
    this.decay = p.decay ?? 0.996;      // factor de pérdida por vuelta (0.9-0.9999): controla cuánto dura
    this.brightness = p.brightness ?? 0.5; // 0 = muy oscuro (promedio de 2 puntos), 1 = brillante (sin filtrar)
    this.pluckPos = p.pluckPos ?? 0.5;  // posición del pulsado (forma del burst inicial, 0-1)
    this.duration = p.duration ?? 2.0;
  }

  renderBuffer(ctx) {
    const sr = ctx.sampleRate;
    const N = Math.max(2, Math.round(sr / this.freq));
    const total = Math.round(this.duration * sr);
    const buf = ctx.createBuffer(1, total, sr);
    const out = buf.getChannelData(0);
    const ring = new Float32Array(N);
    for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
    // forma el burst inicial según pluckPos (simula dónde se pulsa la cuerda)
    const cut = Math.round(N * this.pluckPos);
    for (let i = 0; i < N; i++) {
      const env = i < cut ? i / Math.max(1, cut) : (N - i) / Math.max(1, N - cut);
      ring[i] *= env;
    }
    let idx = 0;
    const b = this.brightness;
    for (let n = 0; n < total; n++) {
      const cur = ring[idx];
      const next = ring[(idx + 1) % N];
      const filtered = b * cur + (1 - b) * 0.5 * (cur + next);
      const newVal = filtered * this.decay;
      out[n] = cur;
      ring[idx] = newVal;
      idx = (idx + 1) % N;
    }
    return buf;
  }

  schedule(ctx, dest, t0 = 0) {
    const buf = this.renderBuffer(ctx);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = 0.9;
    src.connect(g).connect(dest);
    src.start(t0);
    return { stopAt: t0 + buf.duration, node: g, buffer: buf };
  }

  paramTable() {
    return [
      ["freq", "20 – 1000 Hz", "Hz", "altura de la cuerda: fija el largo de la línea de retardo (N=SR/freq)"],
      ["decay", "0.9 – 0.9999", "—", "pérdida de energía por vuelta: controla cuánto dura la nota"],
      ["brightness", "0 – 1", "—", "mezcla del filtro de la línea: 0 oscurece rápido (agudos mueren antes), 1 deja pasar más brillo"],
      ["pluckPos", "0.05 – 0.95", "—", "dónde se \"pulsa\" la cuerda: cambia qué armónicos parten más fuertes"],
    ];
  }
}

// ---------- seguidor de envolvente + detector de ataques (Parte 4) ----------

class EnvelopeFollower {
  constructor(ctx, sourceNode, { attackMs = 8, releaseMs = 120, onsetThreshold = 0.06 } = {}) {
    this.ctx = ctx;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    sourceNode.connect(this.analyser);
    this.buf = new Float32Array(this.analyser.fftSize);
    this.env = 0;
    this.attackCoef = Math.exp(-1 / (ctx.sampleRate * attackMs / 1000));
    this.releaseCoef = Math.exp(-1 / (ctx.sampleRate * releaseMs / 1000));
    this.onsetThreshold = onsetThreshold;
    this.prevEnv = 0;
    this.onOnset = null;
  }

  tick() {
    this.analyser.getFloatTimeDomainData(this.buf);
    let sumSq = 0;
    for (let i = 0; i < this.buf.length; i++) sumSq += this.buf[i] * this.buf[i];
    const rms = Math.sqrt(sumSq / this.buf.length);
    const coef = rms > this.env ? this.attackCoef : this.releaseCoef;
    this.env = coef * this.env + (1 - coef) * rms;
    if (this.env - this.prevEnv > this.onsetThreshold && this.onOnset) this.onOnset(this.env);
    this.prevEnv = this.env;
    return this.env;
  }
}

window.OLUC_T2 = { AdditiveSynth, KarplusStrongSynth, EnvelopeFollower, audioBufferToWav, downloadBlob, noteName, SR };
