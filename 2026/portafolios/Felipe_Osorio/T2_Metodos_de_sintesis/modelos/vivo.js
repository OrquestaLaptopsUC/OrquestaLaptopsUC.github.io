/* Modo en vivo (Parte 4): la fuente real, captada por el micrófono, controla el modelo.
   Cadena de escucha:
   micrófono (sin procesar) → analizador → seguidor de envolvente (RMS de 10 ms, umbral, referencia, ataque, liberación)
                                         → detector de altura (autocorrelación normalizada sobre 2048 muestras)
   → el nivel abre las compuertas del modelo; la altura detectada fija su f0; si hay aire pero no tono, suena solo el aire.
   Se puede grabar una toma estéreo: entrada en el canal izquierdo y salida del modelo en el derecho. */

const VIVO_GRUPOS = [
  { id: "env", titulo: "Seguidor de envolvente · cuánto soplas", desc: "El volumen del micrófono abre y cierra el modelo." },
  { id: "alt", titulo: "Altura · qué nota silbas", desc: "La nota que silbas fija la altura del modelo." },
  { id: "timbre", titulo: "Brillo y amplitud · cómo suena el modelo", desc: "El timbre y el volumen del modelo mientras lo tocas." },
];
const VIVO_SPEC = [
  { grupo: "env", id: "umbral", nombre: "Umbral", min: -80, max: -20, step: 1, value: -50, unidad: "dBFS", efecto: "Bajo este nivel el micrófono se considera en silencio y el modelo calla. Súbelo si el ruido de la pieza hace sonar el modelo." },
  { grupo: "env", id: "ref", nombre: "Nivel de referencia", min: -50, max: 0, step: 1, value: -16, unidad: "dBFS", efecto: "Nivel del micrófono con el que el modelo suena a volumen pleno. Más bajo: más sensible." },
  { grupo: "env", id: "atk", nombre: "Ataque", min: 5, max: 200, step: 5, value: 15, unidad: "ms", efecto: "Qué tan rápido sube el modelo cuando soplas más fuerte." },
  { grupo: "env", id: "rel", nombre: "Liberación", min: 20, max: 1000, step: 10, value: 150, unidad: "ms", efecto: "Qué tan rápido baja el modelo cuando soplas menos o paras." },
  { grupo: "timbre", id: "brillo", nombre: "Brillo", min: -100, max: 100, step: 5, value: 0, unidad: "%", efecto: "Sube o baja el 2.º parcial (hasta ±20 dB) y el aire (hasta ±15 dB). 0: el timbre del perfil. Si sigues el brillo del micrófono, se suma a lo que este aporta." },
  { grupo: "timbre", id: "amp", nombre: "Amplitud", min: -30, max: 6, step: 1, value: 0, unidad: "dB", efecto: "Volumen de salida del modelo en vivo (también en la toma grabada). 0: sin cambio." },
  { grupo: "alt", id: "intervalo", nombre: "Intervalo", min: -12, max: 12, step: 1, value: 0, unidad: "semitonos", efecto: "Transpone la nota detectada antes de mandarla al modelo (7 = una quinta arriba)." },
];

/* Altura por autocorrelación normalizada (método de McLeod): devuelve la frecuencia y la «claridad» (0 a 1). */
function detectarAltura(x, sr, fmin = 150, fmax = 2000) {
  const N = x.length, l0 = Math.max(2, Math.floor(sr / fmax)), l1 = Math.min(Math.floor(sr / fmin), N >> 1);
  const n = new Float32Array(l1 + 2);
  let max = 0;
  for (let lag = l0; lag <= l1 + 1; lag++) {
    let r = 0, m = 0;
    for (let i = 0; i < N - lag; i++) { const a = x[i], b = x[i + lag]; r += a * b; m += a * a + b * b; }
    n[lag] = m > 0 ? 2 * r / m : 0;
    if (n[lag] > max) max = n[lag];
  }
  if (max < 0.3) return { f: 0, claridad: max };
  // primer máximo local que llegue al 90 % del mayor
  for (let lag = l0 + 1; lag <= l1; lag++) {
    if (n[lag] >= 0.9 * max && n[lag] >= n[lag - 1] && n[lag] >= n[lag + 1]) {
      const a = n[lag - 1], b = n[lag], c = n[lag + 1], d = a - 2 * b + c, off = d ? 0.5 * (a - c) / d : 0;
      return { f: sr / (lag + off), claridad: b };
    }
  }
  return { f: 0, claridad: max };
}

function montarVivo(api) {
  const caja = document.getElementById("vivo");
  const q = Object.fromEntries(VIVO_SPEC.map(s => [s.id, s.value]));
  caja.innerHTML = `
    <p class="aviso">Usa audífonos: si el micrófono capta la salida del modelo, el modelo se controla a sí mismo.
    El navegador pedirá permiso para usar el micrófono.</p>
    <div class="botones">
      <button id="v_activar" class="prim">Activar micrófono</button>
      <button id="v_grabar" class="rec" disabled>Grabar toma (entrada + salida)</button>
      <span id="v_estado" class="nota" style="align-self:center"></span>
    </div>
    <div class="vivo-estado">
      <div class="medidor"><div class="et">Micrófono</div><div class="num" id="v_db">— dBFS</div><div class="barra"><i id="v_bmic"></i></div></div>
      <div class="medidor"><div class="et">Nivel que recibe el modelo</div><div class="num" id="v_nivel">0 %</div><div class="barra"><i id="v_bmod"></i></div></div>
      <div class="medidor"><div class="et">Altura detectada</div><div class="num" id="v_f0">—</div><div class="et" id="v_tono">sin tono</div></div>
      <div class="medidor"><div class="et">Brillo del micrófono (centroide)</div><div class="num" id="v_cen">—</div><div class="et" id="v_bri">brillo al modelo: 0 %</div></div>
    </div>
    <div class="panel"><div id="v_controles"></div>
      <label class="chk" title="Si la desmarcas, el modelo se queda en su f0"><input type="checkbox" id="v_seguir" checked> Seguir la nota del micrófono</label>
      <label class="chk" title="El centroide espectral del micrófono, comparado con su promedio de los últimos segundos, sube o baja el brillo del modelo"><input type="checkbox" id="v_segbri"> Seguir el brillo del micrófono</label>
    </div>
    <h3 style="font-size:1rem;margin:20px 0 8px">Cadena de escucha</h3>
    <div class="panel diagrama" id="flujoVivo"></div>
    <h3 style="font-size:1rem;margin:20px 0 8px">Parámetros de la cadena</h3>
    <table id="v_tabla"></table>
    <p class="nota">Descriptores: el seguidor de envolvente calcula el RMS de los últimos 10 ms cada 10 ms, lo pasa a un nivel entre 0 y 1
    (0 bajo el umbral, 1 en el nivel de referencia) y lo suaviza con el ataque y la liberación. El detector de altura usa autocorrelación
    normalizada sobre 2048 muestras (~45 ms), cada 30 ms; solo cuenta como tono si su claridad supera 0,8. Si hay aire pero no tono,
    el modelo hace sonar solo su parte de aire (y, en el modelo B, su resonador ancho del soplo). El brillo del micrófono es su centroide
    espectral (promedio de las frecuencias ponderado por su energía, entre 150 Hz y 8 kHz), cada 30 ms; si se sigue, su distancia en octavas
    a su propio promedio de los últimos ~3 s se suma al control «Brillo». «Amplitud» es la ganancia final del modelo.</p>`;

  // controles agrupados (la casilla de seguir altura va dentro del grupo «Altura»)
  crearControles(document.getElementById("v_controles"), VIVO_SPEC, VIVO_GRUPOS, q, s => { if (s.id === "amp" && timer) api.amplitud(q.amp); });
  const secs = document.querySelectorAll("#v_controles .grupo");
  secs[1].appendChild(document.getElementById("v_seguir").closest("label"));
  secs[2].appendChild(document.getElementById("v_segbri").closest("label"));
  tablaParametros(document.getElementById("v_tabla"), VIVO_SPEC, VIVO_GRUPOS, "Qué hace");

  // la caja del modelo cambia según la página: qué recibe cada parte de lo que se escucha en el micrófono
  const esB = /sustractiva/.test(api.archivo);
  const modelo = esB
    ? ["Modelo B", "nivel → compuertas", "de tono y de aire", "f0 → resonadores", "en f0 y 2·f0", "brillo → 2.º parcial", "(±20 dB) y aire (±15 dB)", "sin tono → aire y", "resonador ancho (soplo)"]
    : ["Modelo A", "nivel → compuertas", "de tono y de aire", "f0 → senos", "en f0 y 2·f0", "brillo → 2.º parcial", "(±20 dB) y aire (±15 dB)", "sin tono → solo aire"];
  diagrama(document.getElementById("flujoVivo"), {
    w: 950, h: 340, titulo: "Cadena de escucha del modo en vivo",
    cajas: [
      { id: "mic", x: 12, y: 137, w: 104, t: ["Micrófono", "sin procesar"], tipo: "fuente" },
      { id: "env", x: 156, y: 29, w: 136, h: 62, t: ["Envolvente", "RMS de 10 ms", "cada 10 ms"], tipo: "clave" },
      { id: "pit", x: 156, y: 129, w: 136, h: 62, t: ["Altura", "autocorrelación", "~45 ms, cada 30 ms"], tipo: "clave" },
      { id: "cen", x: 156, y: 229, w: 136, h: 62, t: ["Brillo", "centroide espectral", "cada 30 ms"], tipo: "clave" },
      { id: "niv", x: 316, y: 29, w: 150, h: 62, t: ["Nivel de 0 a 1", "umbral → referencia", "ataque / liberación"] },
      { id: "conf", x: 316, y: 129, w: 150, h: 62, t: ["¿Hay tono?", "claridad > 0,8", "f0 + intervalo"] },
      { id: "rel", x: 316, y: 229, w: 150, h: 62, t: ["Brillo relativo", "vs. su promedio de ~3 s", "+ control «Brillo»"] },
      { id: "mod", x: 540, y: 20, w: 158, h: 280, t: modelo },
      { id: "amp", x: 722, y: 129, w: 100, h: 62, t: ["Amplitud", "ganancia final", "−30 a +6 dB"] },
      { id: "aud", x: 846, y: 54, w: 96, t: ["Audífonos", "lo que oyes"], tipo: "salida" },
      { id: "toma", x: 846, y: 196, w: 96, h: 62, t: ["Toma WAV", "L: micrófono", "R: modelo"], tipo: "salida" },
    ],
    flechas: [
      { p: ["mic.r", [136, 160], [136, 60], "env.l"] },
      { p: [[136, 160], "pit.l"] },
      { p: [[136, 160], [136, 260], "cen.l"] },
      { p: ["env.r", "niv.l"] },
      { p: ["pit.r", "conf.l"] },
      { p: ["cen.r", "rel.l"] },
      { p: ["niv.r", [540, 60]], rotulo: { x: 503, y: 54, t: "nivel", anchor: "middle" } },
      { p: ["conf.r", [540, 160]], rotulo: { x: 503, y: 154, t: "f0 · sí/no", anchor: "middle" } },
      { p: ["rel.r", [540, 260]], rotulo: { x: 503, y: 254, t: "brillo", anchor: "middle" } },
      { p: ["mod.r", "amp.l"] },
      { p: ["amp.r", [834, 160], [834, 77], "aud.l"] },
      { p: [[834, 160], [834, 227], "toma.l"], rotulo: { x: 838, y: 186, t: "R" } },
      { p: ["mic.b", [64, 322], [894, 322], "toma.b"], guion: true, rotulo: { x: 480, y: 316, t: "canal izquierdo (L) de la toma: el micrófono tal cual", anchor: "middle" } },
    ],
  });


  let stream = null, src = null, an = null, mudo = null, merger = null, sp = null, timer = null;
  let cen = 0, cenProm = 0, brillo = 0, espec = null;
  let env = 0, ultimo = 0, tick = 0, f = 0, hayTono = false, grabando = false, chunksL = [], chunksR = [], tGrab = 0;
  const $ = id => document.getElementById(id);
  const estado = t => { $("v_estado").innerHTML = t; };

  async function activar() {
    await api.asegurarCtx();
    const ctx = api.ctx(), voz = api.voz();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    } catch (e) {
      estado(`No se pudo abrir el micrófono (${e.name}). Si abriste el archivo con doble clic y el navegador lo bloquea, ábrelo desde GitHub Pages o un servidor local.`);
      return;
    }
    src = ctx.createMediaStreamSource(stream);
    an = ctx.createAnalyser(); an.fftSize = 2048;
    mudo = ctx.createGain(); mudo.gain.value = 0; mudo.connect(ctx.destination);
    src.connect(an); an.connect(mudo);                                  // el micrófono no se escucha por los parlantes
    merger = ctx.createChannelMerger(2);
    src.connect(merger, 0, 0); api.salida().connect(merger, 0, 1);      // izquierdo: entrada · derecho: modelo
    sp = ctx.createScriptProcessor(4096, 2, 2);
    sp.onaudioprocess = e => {
      if (!grabando) return;
      chunksL.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      chunksR.push(new Float32Array(e.inputBuffer.getChannelData(1)));
    };
    merger.connect(sp); sp.connect(mudo);
    api.activar(true);
    voz.vivoInicio(ctx.currentTime); api.amplitud(q.amp);
    env = 0; cen = 0; cenProm = 0; ultimo = performance.now();
    timer = setInterval(paso, 10);
    $("v_activar").textContent = "Desactivar micrófono"; $("v_grabar").disabled = false;
    estado("Micrófono activo.");
  }

  function desactivar() {
    if (grabando) detenerGrabacion();
    clearInterval(timer); timer = null;
    const ctx = api.ctx();
    api.voz().vivoFin(ctx.currentTime); api.amplitud(0);
    api.activar(false);
    try { src.disconnect(); an.disconnect(); merger.disconnect(); sp.disconnect(); api.salida().disconnect(merger); } catch (e) {}
    stream.getTracks().forEach(t => t.stop());
    $("v_activar").textContent = "Activar micrófono"; $("v_grabar").disabled = true;
    estado("Micrófono apagado."); $("v_f0").textContent = "—"; $("v_tono").textContent = "sin tono";
  }

  const buf = new Float32Array(2048);
  function paso() {
    const ctx = api.ctx(), voz = api.voz(), sr = ctx.sampleRate, ahora = performance.now();
    const dt = Math.max(1, ahora - ultimo) / 1000; ultimo = ahora;
    an.getFloatTimeDomainData(buf);
    const n10 = Math.round(sr * 0.01); let s = 0;
    for (let i = buf.length - n10; i < buf.length; i++) s += buf[i] * buf[i];
    const db = 10 * Math.log10(s / n10 + 1e-12);
    const objetivo = db < q.umbral ? 0 : Math.min(1, Math.pow(10, (db - q.ref) / 20));
    const tau = (objetivo > env ? q.atk : q.rel) / 1000;
    env += (objetivo - env) * (1 - Math.exp(-dt / tau));
    if (++tick % 3 === 0) {
      if (db >= q.umbral) {
        const r = detectarAltura(buf, sr); hayTono = r.claridad > 0.8 && r.f > 0; if (hayTono) f = r.f;
        // centroide espectral entre 150 Hz y 8 kHz
        if (!espec) espec = new Float32Array(an.frequencyBinCount);
        an.getFloatFrequencyData(espec);
        const hz = sr / an.fftSize; let sp_ = 0, sw = 0;
        for (let k = Math.ceil(150 / hz); k <= Math.floor(8000 / hz); k++) { const pw = Math.pow(10, espec[k] / 10); sp_ += pw; sw += pw * k * hz; }
        if (sp_ > 0) { cen = sw / sp_; cenProm = cenProm ? cenProm + (cen - cenProm) * (1 - Math.exp(-0.03 / 3)) : cen; }
      } else hayTono = false;
    }
    const sigue = $("v_segbri").checked && cen > 0 && cenProm > 0 ? Math.max(-1, Math.min(1, Math.log2(cen / cenProm))) : 0;
    brillo = Math.max(-1, Math.min(1, q.brillo / 100 + sigue));
    const t = ctx.currentTime;
    voz.vivoNivel(t, hayTono ? env : 0, env, hayTono ? 0 : env);
    if (hayTono && $("v_seguir").checked) voz.vivoAltura(t, f * Math.pow(2, q.intervalo / 12));
    voz.vivoBrillo(t, brillo);
    // medidores
    $("v_db").textContent = `${Math.max(-99, db).toFixed(0)} dBFS`;
    $("v_bmic").style.width = `${Math.max(0, Math.min(100, (db + 80) / 80 * 100))}%`;
    $("v_nivel").textContent = `${Math.round(env * 100)} %`; $("v_bmod").style.width = `${env * 100}%`;
    $("v_f0").textContent = hayTono ? `${f.toFixed(1)} Hz` : "—";
    $("v_tono").textContent = hayTono ? (q.intervalo ? `→ modelo a ${(f * Math.pow(2, q.intervalo / 12)).toFixed(1)} Hz` : "tono detectado") : "sin tono";
    $("v_cen").textContent = cen ? `${Math.round(cen)} Hz` : "—";
    $("v_bri").textContent = `brillo al modelo: ${Math.round(brillo * 100)} %`;
    if (grabando) estado(`<span class="grabando">● Grabando ${((ahora - tGrab) / 1000).toFixed(0)} s</span> (se recomiendan 1 a 2 minutos)`);
  }

  function detenerGrabacion() {
    grabando = false; $("v_grabar").classList.remove("on"); $("v_grabar").textContent = "Grabar toma (entrada + salida)";
    const unir = ch => { const n = ch.reduce((a, c) => a + c.length, 0), o = new Float32Array(n); let k = 0; for (const c of ch) { o.set(c, k); k += c.length; } return o; };
    const L = unir(chunksL), R = unir(chunksR); chunksL = []; chunksR = [];
    downloadBlob(encodeWAV([L, R], api.ctx().sampleRate), api.archivo.replace(".wav", "_en_vivo_entradaL_salidaR.wav"));
    estado(`Toma guardada: ${(L.length / api.ctx().sampleRate).toFixed(1)} s, entrada en el canal izquierdo y modelo en el derecho.`);
  }

  $("v_activar").addEventListener("click", () => (timer ? desactivar() : activar()));
  $("v_grabar").addEventListener("click", () => {
    if (grabando) return detenerGrabacion();
    chunksL = []; chunksR = []; grabando = true; tGrab = performance.now();
    $("v_grabar").classList.add("on"); $("v_grabar").textContent = "Detener y guardar toma";
  });
  window.__vivo = { activar, desactivar, iniciarGrabacion: () => $("v_grabar").click(), estado: () => ({ env, f, hayTono, cen, brillo }) }; // para pruebas
}
