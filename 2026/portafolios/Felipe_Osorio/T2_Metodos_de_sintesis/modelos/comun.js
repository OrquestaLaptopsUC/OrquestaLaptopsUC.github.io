/* Código común de los modelos — T2 Métodos de síntesis (IEE2003)
   Web Audio API, sin dependencias. Se carga con <script src="comun.js"> (funciona también abriendo el archivo local). */

const dbToGain = db => Math.pow(10, db / 20);

/* Generador pseudoaleatorio con semilla: el ruido y la deriva salen iguales en cada render. */
function prng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/* Ruido blanco en un buffer de 30 s que se repite en loop (con uno corto, un filtro muy angosto «oye» la repetición como batidos). */
const _noiseCache = new WeakMap();
function noiseBuffer(ctx, seed = 1) {
  if (_noiseCache.has(ctx)) return _noiseCache.get(ctx);
  const n = Math.floor(ctx.sampleRate * 30), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), r = prng(seed);
  for (let i = 0; i < n; i++) d[i] = r() * 2 - 1;
  _noiseCache.set(ctx, b);
  return b;
}

/* Deriva lenta de altura, en cents: dos senos lentos (0,67 y 0,23 Hz) con fase al azar. */
function driftCurve(seconds, cents, seed = 7, rate = 50) {
  const r = prng(seed), p1 = r() * 6.283, p2 = r() * 6.283, n = Math.max(2, Math.ceil(seconds * rate)), c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    c[i] = cents * (0.7 * Math.sin(2 * Math.PI * 0.67 * t + p1) + 0.5 * Math.sin(2 * Math.PI * 0.23 * t + p2)) / 0.86;
  }
  return c;
}
const DRIFT_SECONDS = 600;

/* Envolventes compartidas por ambos modelos (mismas reglas, para que la comparación sea justa):
   - soplo previo: el aire sube hasta 0,7 y el tono hasta 0,15 de su nivel pleno (calibrado para que el soplo
     medido en el render coincida con la grabación);
   - ataque: ambos suben a 1;
   - final: el tono se apaga en «final» ms y el aire tarda el doble (en la grabación el aire dura ~100 ms más). */
const SOPLO_TONO = 0.15, SOPLO_AIRE = 0.7;
function abrirCompuertas(t, gates) {
  for (const g of [gates.tone, gates.air]) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(1, t); }
}
function scheduleOn(t, p, env, gates) {
  const s = p.soplo / 1000, a = p.ataque / 1000;
  abrirCompuertas(t, gates);
  for (const g of [env.tone, env.air]) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0, t); }
  if (s > 0) { env.tone.gain.linearRampToValueAtTime(SOPLO_TONO, t + s); env.air.gain.linearRampToValueAtTime(SOPLO_AIRE, t + s); }
  env.tone.gain.setTargetAtTime(1, t + s, a / 3);
  env.air.gain.setTargetAtTime(1, t + s, a / 3);
  return t + s; // instante en que «engancha» el tono
}
function scheduleOff(t, p, gates) {
  const r = Math.max(0.005, p.final / 1000);
  gates.tone.gain.cancelScheduledValues(t); gates.tone.gain.setValueAtTime(1, t); gates.tone.gain.setTargetAtTime(0, t, r / 3);
  gates.air.gain.cancelScheduledValues(t); gates.air.gain.setValueAtTime(1, t); gates.air.gain.setTargetAtTime(0, t, (2 * r) / 3);
  return t + 2 * r + 0.3; // cuándo terminó de sonar
}
/* Arrastre de altura: la nota parte medio arrastre abajo, sube en 300 ms, y cae un arrastre completo al final. */
function arrastreOn(t, tl, p, params) {
  for (const d of params) { d.cancelScheduledValues(t); d.setValueAtTime(-0.5 * p.arrastre, t); d.setValueAtTime(-0.5 * p.arrastre, tl); d.linearRampToValueAtTime(0, tl + 0.3); }
}
function arrastreOff(t, p, params) {
  for (const d of params) { d.cancelScheduledValues(t); d.setValueAtTime(0, t); d.linearRampToValueAtTime(-p.arrastre, t + p.final / 1000); }
}

/* ---------- WAV (PCM 16 bits) ----------
   canales: un Float32Array (mono) o una lista de Float32Array del mismo largo (estéreo: [izquierdo, derecho]). */
function encodeWAV(canales, sr) {
  if (!Array.isArray(canales)) canales = [canales];
  const nc = canales.length, n = canales[0].length, buf = new ArrayBuffer(44 + n * 2 * nc), v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2 * nc, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true); v.setUint32(24, sr, true);
  v.setUint32(28, sr * 2 * nc, true); v.setUint16(32, 2 * nc, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2 * nc, true);
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) {
    const s = Math.max(-1, Math.min(1, canales[c][i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2;
  }
  return new Blob([buf], { type: "audio/wav" });
}
function downloadBlob(blob, name) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* ---------- Controles agrupados ----------
   grupos: [{id, titulo, desc}]; cada parámetro de spec lleva «grupo». El efecto de cada control aparece al pasar el mouse. */
function crearControles(cont, spec, grupos, valores, alCambiar) {
  const reponer = [];
  for (const g of grupos) {
    const items = spec.filter(s => s.grupo === g.id);
    if (!items.length) continue;
    const sec = document.createElement("section"); sec.className = "grupo";
    sec.innerHTML = `<h3>${g.titulo}</h3>${g.desc ? `<p class="desc">${g.desc}</p>` : ""}`;
    cont.appendChild(sec);
    for (const s of items) {
      const fila = document.createElement("label"); fila.className = "ctrl";
      fila.innerHTML = `<span class="nom">${s.nombre}</span>
        <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.value}" id="r_${s.id}">
        <span class="val" id="v_${s.id}"></span>`;
      fila.title = s.efecto; // la descripción completa queda como ayuda al pasar el mouse y en la tabla de parámetros
      sec.appendChild(fila);
      const r = fila.querySelector("input"), val = fila.querySelector(".val");
      const pinta = () => { val.textContent = `${(+r.value).toLocaleString("es-CL")} ${s.unidad}`; };
      pinta();
      r.addEventListener("input", () => { valores[s.id] = +r.value; pinta(); alCambiar(s, +r.value); });
      reponer.push(() => { r.value = s.value; valores[s.id] = s.value; pinta(); });
    }
  }
  return reponer;
}
function tablaParametros(tabla, spec, grupos, cabecera = "Efecto sobre el sonido") {
  tabla.innerHTML = `<tr><th>Parámetro</th><th>Rango</th><th>Unidad</th><th>${cabecera}</th></tr>` +
    grupos.map(g => {
      const items = spec.filter(s => s.grupo === g.id);
      if (!items.length) return "";
      return `<tr class="gr"><td colspan="4">${g.titulo}</td></tr>` +
        items.map(s => `<tr><td>${s.nombre}</td><td>${String(s.min).replace(".", ",")} a ${String(s.max).replace(".", ",")}</td><td>${s.unidad}</td><td>${s.efecto}</td></tr>`).join("");
    }).join("");
}

/* ---------- Página de un modelo ----------
   spec: lista de parámetros {id, nombre, min, max, step, value, unidad, efecto}
   Voice(ctx, p, destino) devuelve {start(t), on(t) → tEnganche, off(t) → tFin, update(p)}.
   La voz queda siempre encendida (en silencio entre notas): así los filtros ya están estables al tocar.
   Para el modo en vivo, la voz también ofrece vivoInicio(t), vivoNivel(t, tono, aire, soplo), vivoAltura(t, f) y vivoFin(t).
   preparar(ctx) opcional y asíncrono: carga lo que el modelo necesite antes de crear la voz. */
function montarModelo({ spec, grupos, Voice, archivo, preparar, derivar = () => {} }) {
  // derivar(p): calcula los valores internos que dependen de un control agrupado (p. ej. deriva y arrastre desde «mov»)
  const p = Object.fromEntries(spec.map(s => [s.id, s.value]));
  p.duracion = 6.8; derivar(p);
  const $ = id => document.getElementById(id);

  const reponer = crearControles($("controles"), spec, grupos, p, (s, v) => { derivar(p); if (voz) voz.update(p); grabadora.cambio(s, v); });
  // duración de la nota: ajuste de «Nota» y «Renderizar», no es un parámetro del timbre
  if ($("duracion")) { const d = $("duracion"); p.duracion = +d.value; d.addEventListener("input", () => { if (+d.value > 0) p.duracion = +d.value; }); }
  // «Perfil del silbido»: vuelve a los valores calibrados contra la grabación (los «value» de spec)
  if ($("restablecer")) $("restablecer").addEventListener("click", () => {
    reponer.forEach(f => f()); derivar(p); if (voz) voz.update(p); grabadora.restablecido();
    const b = $("restablecer"); b.dataset.txt = b.dataset.txt || b.textContent;
    b.textContent = "Perfil restablecido ✓"; clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = b.dataset.txt; }, 1200);
  });

  tablaParametros($("tabla"), spec, grupos);

  let ctx = null, analyser = null, salida = null, voz = null, listo = null, sonando = false, enVivo = false;
  function asegurarCtx() {
    if (!listo) listo = (async () => {
      ctx = new AudioContext(); // frecuencia de muestreo del equipo: evita problemas al conectar el micrófono
      if (preparar) await preparar(ctx);
      analyser = ctx.createAnalyser(); analyser.fftSize = 8192; analyser.smoothingTimeConstant = 0.6;
      analyser.connect(ctx.destination);
      salida = ctx.createGain(); salida.connect(analyser);               // ganancia de salida (la usa «Amplitud» del modo en vivo)
      voz = Voice(ctx, p, salida); voz.start(ctx.currentTime + 0.01);
      dibujar();
    })();
    if (ctx && ctx.state === "suspended") ctx.resume();
    return listo;
  }
  async function on() { await asegurarCtx(); if (enVivo) return; sonando = true; voz.on(ctx.currentTime + 0.01); crono.iniciar(); }
  async function off() { await asegurarCtx(); if (!sonando || enVivo) return; sonando = false; voz.off(ctx.currentTime + 0.005); crono.detener(); }

  /* Cronómetro de la nota: cuenta desde que empieza a sonar e indica la fase (soplo previo o tono).
     Al soltar queda fija la duración de la última nota. */
  const crono = (() => {
    const el = document.createElement("span"); el.className = "crono"; el.title = "Tiempo que lleva sonando la nota";
    el.innerHTML = `<b>0,0 s</b> <small>listo</small>`;
    (document.querySelector(".botones") || document.body).appendChild(el);
    let t0 = 0, raf = 0;
    const fmt = s => s.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " s";
    const pinta = () => {
      const s = (performance.now() - t0) / 1000;
      el.querySelector("b").textContent = fmt(s);
      el.querySelector("small").textContent = s * 1000 < p.soplo ? "soplo previo" : "nota";
      raf = requestAnimationFrame(pinta);
    };
    return {
      iniciar() { cancelAnimationFrame(raf); t0 = performance.now(); el.classList.add("on"); pinta(); },
      detener() {
        cancelAnimationFrame(raf); el.classList.remove("on");
        el.querySelector("b").textContent = fmt((performance.now() - t0) / 1000);
        el.querySelector("small").textContent = "última nota";
      },
    };
  })();

  const bt = $("tocar");
  bt.addEventListener("pointerdown", e => { e.preventDefault(); bt.classList.add("on"); on(); });
  ["pointerup", "pointerleave"].forEach(ev => bt.addEventListener(ev, () => { if (bt.classList.contains("on")) { bt.classList.remove("on"); off(); } }));
  window.addEventListener("keydown", e => { if (e.code === "Space" && !e.repeat && e.target.tagName !== "INPUT") { e.preventDefault(); bt.classList.add("on"); on(); } });
  window.addEventListener("keyup", e => { if (e.code === "Space") { bt.classList.remove("on"); off(); } });
  $("nota").addEventListener("click", async () => { await on(); setTimeout(off, p.duracion * 1000); });

  /* ---------- Grabar nota en vivo ----------
     Graba en tiempo real la salida del modelo mientras toca una nota de «Duración de la nota» (más la cola del final),
     y anota cada cambio de slider con su segundo exacto. Al terminar descarga el WAV y un CSV con los cambios. */
  const grabadora = (() => {
    const bt = document.createElement("button"); bt.className = "rec"; bt.id = "grabarNota";
    bt.textContent = "● Grabar nota en vivo"; bt.title = "Toca una nota de la duración configurada y graba en tiempo real lo que suena y los sliders que mueves";
    const bar = document.querySelector(".botones"); bar.insertBefore(bt, $("restablecer"));
    let activo = false, tIni = 0, trozos = [], registro = [], sp = null, mudo = null, fin = null, tFin = 0;
    const ahora = () => ctx.currentTime - tIni;
    const fila = (t, nombre, valor, unidad) => registro.push({ t, nombre, valor, unidad });
    function preparar() {
      if (sp) return;
      sp = ctx.createScriptProcessor(4096, 1, 1);
      mudo = ctx.createGain(); mudo.gain.value = 0;
      analyser.connect(sp); sp.connect(mudo); mudo.connect(ctx.destination);
      sp.onaudioprocess = e => {
        if (!activo) return;
        const x = e.inputBuffer.getChannelData(0), t0 = e.playbackTime, sr = ctx.sampleRate;
        const desde = Math.max(0, Math.round((tIni - t0) * sr)), hasta = Math.min(x.length, Math.round((tFin - t0) * sr));
        if (hasta > desde) trozos.push(new Float32Array(x.subarray(desde, hasta)));
      };
    }
    async function empezar() {
      await asegurarCtx();
      if (enVivo) { bt.title = "Desactiva el micrófono para grabar una nota"; return; }
      preparar();
      trozos = []; registro = []; tIni = ctx.currentTime + 0.05; tFin = Infinity; activo = true;
      for (const s of spec) fila(0, s.nombre, p[s.id], s.unidad);           // valores al empezar
      fila(0, "Duración de la nota", p.duracion, "s");
      bt.classList.add("on"); bt.textContent = "■ Detener grabación";
      sonando = true; voz.on(tIni + 0.01); crono.iniciar();
      fin = setTimeout(terminarNota, p.duracion * 1000 + 60);
    }
    function terminarNota() {
      clearTimeout(fin);
      if (sonando) { sonando = false; crono.detener(); }
      const tOff = ctx.currentTime + 0.005, tCola = voz.off(tOff);       // la cola del final también se graba
      fila(tOff - tIni, "(fin de la nota)", "", "");
      tFin = tCola; setTimeout(cerrar, (tCola - ctx.currentTime) * 1000 + 300);
    }
    function cerrar() {
      activo = false; bt.classList.remove("on"); bt.textContent = "● Grabar nota en vivo";
      const n = trozos.reduce((a, c) => a + c.length, 0), audio = new Float32Array(n); let k = 0;
      for (const c of trozos) { audio.set(c, k); k += c.length; }
      const sello = new Date().toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "-");
      const base = archivo.replace(".wav", "") + "_vivo_" + sello;
      downloadBlob(encodeWAV(audio, ctx.sampleRate), base + ".wav");
      // CSV listo para Excel en español: separador «;» y coma decimal
      const num = v => typeof v === "number" ? v.toLocaleString("es-CL", { maximumFractionDigits: 3, useGrouping: false }) : v;
      const csv = "tiempo_s;parametro;valor;unidad\n" + registro.map(r => [num(+r.t.toFixed(2)), r.nombre, num(r.valor), r.unidad].join(";")).join("\n");
      setTimeout(() => downloadBlob(new Blob(["\ufeff" + csv], { type: "text/csv" }), base + "_parametros.csv"), 400);
    }
    bt.addEventListener("click", () => { if (!activo) empezar(); else if (tFin === Infinity) terminarNota(); });
    return {
      // un cambio de slider durante la grabación; los movimientos seguidos del mismo slider (< 0,15 s) se juntan en una fila
      cambio(s, v) {
        if (!activo || tFin !== Infinity) return;
        const t = ahora(), u = registro[registro.length - 1];
        if (u && u.nombre === s.nombre && u.t > 0 && t - u.tUlt < 0.15) { u.valor = v; u.tUlt = t; }   // la fila guarda cuándo empezó el gesto y el valor final
        else { fila(t, s.nombre, v, s.unidad); registro[registro.length - 1].tUlt = t; }
      },
      restablecido() { if (activo && tFin === Infinity) fila(ahora(), "(perfil del silbido restablecido)", "", ""); },
      get activo() { return activo; },
    };
  })();
  $("render").addEventListener("click", async () => {
    $("render").disabled = true; $("render").textContent = "Renderizando…";
    const data = await renderOffline(p);
    downloadBlob(encodeWAV(data, 44100), archivo);
    $("render").disabled = false; $("render").textContent = "Renderizar WAV";
  });

  /* Render fuera de tiempo real: mismo grafo y parámetros. Se calienta 2 s en silencio (como el instrumento
     encendido) y se recorta; el soplo empieza en 0,14 s, igual que en la grabación. */
  async function renderOffline(pp) {
    const q = { ...p, ...pp }; derivar(q);
    const PRE = 2, t0 = 0.14, r = q.final / 1000, sr = 44100;
    const largo = PRE + t0 + q.soplo / 1000 + q.duracion + 2 * r + 0.15;
    const oc = new OfflineAudioContext(1, Math.ceil(largo * sr), sr);
    if (preparar) await preparar(oc);
    const v = Voice(oc, q, oc.destination); v.start(0);
    const tl = v.on(PRE + t0); v.off(tl + q.duracion);
    const buf = await oc.startRendering();
    return buf.getChannelData(0).slice(Math.round(PRE * sr));
  }
  window.renderOffline = renderOffline; // para pruebas automáticas

  // modo en vivo (Parte 4), definido en vivo.js
  if (window.montarVivo && $("vivo")) montarVivo({
    p, asegurarCtx, ctx: () => ctx, voz: () => voz, salida: () => analyser, archivo,
    amplitud(db) { if (salida) salida.gain.setTargetAtTime(dbToGain(db), ctx.currentTime, 0.03); },
    activar(si) { enVivo = si; if (si && sonando) { sonando = false; voz.off(ctx.currentTime); } },
  });
  window.encodeWAV = encodeWAV;

  // espectro en vivo: 0–6000 Hz, grilla cada 500 Hz
  const cv = $("espectro"), g = cv.getContext("2d");
  function dibujar() {
    const W = cv.width = cv.clientWidth * devicePixelRatio, H = cv.height = cv.clientHeight * devicePixelRatio;
    const css = getComputedStyle(document.body), fmax = 6000, dbMin = -110, dbMax = -10;
    g.clearRect(0, 0, W, H);
    g.strokeStyle = css.getPropertyValue("--grid"); g.fillStyle = css.getPropertyValue("--tenue"); g.lineWidth = 1;
    g.font = `${11 * devicePixelRatio}px system-ui`;
    for (let f = 0; f <= fmax; f += 500) { const x = f / fmax * W; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); if (f % 1000 === 0) g.fillText(f, x + 3, H - 4); }
    const d = new Float32Array(analyser.frequencyBinCount); analyser.getFloatFrequencyData(d);
    const hzPorBin = ctx.sampleRate / analyser.fftSize;
    g.strokeStyle = css.getPropertyValue("--acento"); g.lineWidth = 1.5 * devicePixelRatio; g.beginPath();
    for (let i = 0; i * hzPorBin <= fmax; i++) {
      const x = i * hzPorBin / fmax * W, y = (1 - (Math.max(dbMin, d[i]) - dbMin) / (dbMax - dbMin)) * H;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
    requestAnimationFrame(dibujar);
  }
}
