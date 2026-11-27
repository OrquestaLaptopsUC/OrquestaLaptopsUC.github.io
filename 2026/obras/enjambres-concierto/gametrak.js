/* ============================================================
   ENJAMBRES · versión de concierto · Gametrak del director
   Orquesta de Laptops UC (OLUC) · IEE2003

   El Gametrak tiene dos cordeles; cada uno da tres ejes: hacia dónde
   apunta (x, y) y cuánto está estirado (la altura de la mano), más el
   pedal. Aquí se leen los seis ejes, se calibran y se traducen a lo que
   el director controla del enjambre:

     MANO IZQUIERDA   posición → el IMÁN GENERAL sobre el semicírculo
                      altura   → la fuerza de ese imán (abajo = suelto)
     MANO DERECHA     x        → orden (−) · caos (+), se suma al ruido de todos
                      y        → κ, acoplamiento entre enjambres
                      altura   → nivel general (abajo = silencio)
     PEDAL            etapa siguiente de la partitura

   De dónde llegan los ejes:
     · la app "Enjambres Director" los lee del dispositivo (HID) y llama a
       window.EnjambresHID(ejes, botones, nombre), con cada eje en 0..1;
     · en Chrome, sin la app: la Gamepad API (hay que mover un cordel o
       pisar el pedal una vez para que el navegador muestre el control);
     · sin Gametrak: "probar con el mouse", arrastrando en los dos gráficos.

   opc: {alCambiar({gx, gy, gf, caos, kappa, general}), alPedal()}
        alCambiar recibe solo lo que cambió; kappa solo mientras la mano
        derecha está arriba.
   ============================================================ */
(function (raiz) {
"use strict";
const CLAVE = "oluc.enjambresC.gametrak";
const EJES = 6;
const UMBRAL_SUBE = 0.08, UMBRAL_BAJA = 0.05;   /* altura (0..1) desde la que una mano cuenta como "arriba" */
const SIN_DATOS_MS = 1500;
const NIVEL_MIN = -40;                          /* dB con la mano derecha apenas arriba; más abajo, silencio */
const SILENCIO = -60;
const POR_DEFECTO = {
  activo: true,
  izq: [0, 1, 2], der: [3, 4, 5],               /* qué eje del dispositivo es x, y, altura de cada mano */
  /* rango útil de cada eje del dispositivo, en 0..1 crudo. Los de altura: [recogido, estirado]
     (su Gametrak, con la base en el suelo: recogido ≈ 0,99; brazo arriba ≈ 0,34) */
  rango: [[0.15, 0.85], [0.15, 0.85], [0.99, 0.34], [0.15, 0.85], [0.15, 0.85], [0.99, 0.34]],
  inv: [false, false, false, false, false, false],
  dest: { iman: true, caos: true, kappa: true, general: true, pedal: true },
  caosMax: 0.5,                                 /* cuánto ruido suma o resta la mano derecha en los extremos */
  suave: 90,                                    /* ms */
};

function Gametrak(opc) {
  this.opc = opc || {};
  this.cfg = JSON.parse(JSON.stringify(POR_DEFECTO));
  try { const g = JSON.parse(localStorage.getItem(CLAVE) || "null"); if (g) this.fijarCfg(g, true); } catch (e) { }
  this.crudo = new Array(EJES).fill(0.5); this.botones = [];
  this.tDatos = -1e9; this.fuente = ""; this.nombre = "";
  this.manos = { izq: { x: 0, y: 0, ext: 0, activa: false }, der: { x: 0, y: 0, ext: 0, activa: false } };
  this.salida = { gx: 0, gy: 0.5, gf: 0, caos: 0, kappa: null, general: 0 };
  this.enviado = { gx: 0, gy: 0.5, gf: 0, caos: 0, general: 0 };   /* los valores neutros no hace falta mandarlos */
  this.sim = null;                              /* {izq:{x,y,ext}, der:{…}}: prueba con el mouse */
  this.pedalAntes = false; this.tPedal = -1e9; this.tTick = 0; this.tEnvio = 0;
  this.aprendiendo = null;
  raiz.EnjambresHID = (ejes, botones, nombre) => this.recibir(ejes, botones, "app", nombre);
}
const G = Gametrak.prototype;
G.fijarCfg = function (g, sinGuardar) {
  const c = this.cfg;
  for (const k of ["activo", "caosMax", "suave"]) if (k in g) c[k] = g[k];
  for (const m of ["izq", "der"]) if (Array.isArray(g[m]) && g[m].length === 3) c[m] = g[m].map(v => Math.max(0, Math.min(EJES - 1, v | 0)));
  if (Array.isArray(g.rango)) g.rango.forEach((r, i) => { if (i < EJES && Array.isArray(r) && isFinite(+r[0]) && isFinite(+r[1]) && +r[0] !== +r[1]) c.rango[i] = [+r[0], +r[1]]; });
  if (Array.isArray(g.inv)) g.inv.forEach((v, i) => { if (i < EJES) c.inv[i] = !!v; });
  if (g.dest) Object.assign(c.dest, g.dest);
  if (!sinGuardar) this.guardar();
};
G.guardar = function () { try { localStorage.setItem(CLAVE, JSON.stringify(this.cfg)); } catch (e) { } };
G.restablecer = function () { this.cfg = JSON.parse(JSON.stringify(POR_DEFECTO)); this.guardar(); };
G.conectado = function () { return performance.now() - this.tDatos < SIN_DATOS_MS; };

/* ejes: 0..1 crudos, en el orden del dispositivo; botones: [bool] */
G.recibir = function (ejes, botones, fuente, nombre) {
  for (let i = 0; i < EJES; i++) if (typeof ejes[i] === "number" && isFinite(ejes[i])) this.crudo[i] = ejes[i];
  this.botones = botones || [];
  this.tDatos = performance.now(); this.fuente = fuente || "app"; if (nombre) this.nombre = nombre;
};
/* Gamepad API (Chrome): el primero con 6 ejes o más, o el que se llame Gametrak */
G.sondear = function () {
  if (this.fuente === "app" && this.conectado()) return;
  if (!navigator.getGamepads) return;
  let mejor = null;
  for (const p of navigator.getGamepads()) {
    if (!p || !p.connected) continue;
    if (/game.?trak/i.test(p.id)) { mejor = p; break; }
    if (p.axes.length >= EJES && !mejor) mejor = p;
  }
  if (mejor) this.recibir(Array.from(mejor.axes, a => (a + 1) / 2), Array.from(mejor.buttons, b => b.pressed), "navegador", mejor.id);
};

/* un eje del dispositivo → 0..1 dentro de su rango útil */
G.eje = function (i) {
  const r = this.cfg.rango[i];
  let u = (this.crudo[i] - r[0]) / (r[1] - r[0]);
  u = Math.max(0, Math.min(1, u));
  return this.cfg.inv[i] ? 1 - u : u;
};
G.leerMano = function (cual) {
  if (this.sim) return this.sim[cual];
  const e = this.cfg[cual];
  return { x: this.eje(e[0]) * 2 - 1, y: this.eje(e[1]) * 2 - 1, ext: this.eje(e[2]) };
};

/* Una vez por cuadro de pantalla. */
G.tick = function (ahora) {
  const dt = Math.min(200, ahora - (this.tTick || ahora)); this.tTick = ahora;
  this.sondear();
  if (this.aprendiendo) this.seguirAprendiendo(ahora);
  const hay = !!this.sim || this.conectado();
  const c = this.cfg, s = this.salida, a = c.suave > 0 ? 1 - Math.exp(-dt / c.suave) : 1;
  for (const cual of ["izq", "der"]) {
    const m = this.manos[cual], q = hay ? this.leerMano(cual) : { x: m.x, y: m.y, ext: 0 };
    m.x += a * (q.x - m.x); m.y += a * (q.y - m.y); m.ext += a * (q.ext - m.ext);
    m.activa = m.ext > (m.activa ? UMBRAL_BAJA : UMBRAL_SUBE);
  }
  const iz = this.manos.izq, de = this.manos.der, usar = c.activo && hay && !this.aprendiendo;
  /* altura útil: de 0 (en el umbral) a 1 (arriba) */
  const alto = m => m.activa ? Math.max(0, Math.min(1, (m.ext - UMBRAL_BAJA) / (1 - UMBRAL_BAJA))) : 0;
  /* izquierda: imán general sobre el semicírculo (x de −1 a 1; y de 0, el público, a 1, el fondo) */
  if (usar && c.dest.iman) {
    let gx = iz.x * 0.95, gy = (iz.y + 1) / 2 * 0.95; const r = Math.hypot(gx, gy);
    if (r > 0.95) { gx *= 0.95 / r; gy *= 0.95 / r; }
    if (iz.activa) { s.gx = gx; s.gy = gy; }
    s.gf = alto(iz);
  } else s.gf = 0;
  /* derecha: caos, κ y nivel */
  if (usar && c.dest.caos && de.activa) { const z = Math.abs(de.x) < 0.12 ? 0 : (de.x - Math.sign(de.x) * 0.12) / 0.88; s.caos = z * c.caosMax; } else s.caos = 0;
  s.kappa = usar && c.dest.kappa && de.activa ? (de.y + 1) / 2 : null;
  if (usar && c.dest.general) s.general = de.activa ? NIVEL_MIN * (1 - Math.pow(alto(de), 0.6)) : SILENCIO;
  else s.general = Math.min(0, s.general + 25 * dt / 1000);   /* sin Gametrak (o apagado): vuelve de a poco al nivel pleno */
  /* pedal: cualquier botón, al pisarlo */
  const pisado = !this.sim && this.conectado() && this.botones.some(Boolean);
  if (pisado && !this.pedalAntes && c.activo && c.dest.pedal && ahora - this.tPedal > 1500) { this.tPedal = ahora; if (this.opc.alPedal) this.opc.alPedal(); }
  this.pedalAntes = pisado;
  /* a la simulación: ~30 veces por segundo, solo lo que cambió */
  if (ahora - this.tEnvio >= 33) {
    this.tEnvio = ahora;
    const cambio = {}; let n = 0;
    const eps = { gx: 0.002, gy: 0.002, gf: 0.004, caos: 0.004, kappa: 0.004, general: 0.1 };
    for (const k in eps) {
      const v = s[k]; if (v == null) { delete this.enviado[k]; continue; }
      if (this.enviado[k] === undefined || Math.abs(v - this.enviado[k]) > eps[k] || (v !== this.enviado[k] && (v === 0 || v === SILENCIO))) { cambio[k] = +v.toFixed(3); this.enviado[k] = v; n++; }
    }
    if (n && this.opc.alCambiar) this.opc.alCambiar(cambio);
  }
};

/* ---------- calibración: aprender el rango de cada eje ----------
   Se parte con los cordeles recogidos; luego, durante unos segundos, se mueven las dos
   manos por todo el espacio que se va a usar (arriba, abajo, a los lados, adelante, atrás). */
G.aprender = function (segundos, alTerminar) {
  this.aprendiendo = { t0: performance.now(), dur: (segundos || 8) * 1000, reposo: this.crudo.slice(), muestras: [], alTerminar };
};
G.seguirAprendiendo = function (ahora) {
  const A = this.aprendiendo;
  if (this.conectado()) A.muestras.push(this.crudo.slice());
  if (ahora - A.t0 < A.dur) return;
  this.aprendiendo = null;
  const M = A.muestras, c = this.cfg; let ok = M.length > 30;
  if (ok) {
    const nuevo = c.rango.map(r => r.slice());
    for (const cual of ["izq", "der"]) {
      const [ex, ey, ez] = c[cual];
      /* altura: de donde estaba en reposo al extremo más lejano que alcanzó */
      let lejos = A.reposo[ez];
      for (const m of M) if (Math.abs(m[ez] - A.reposo[ez]) > Math.abs(lejos - A.reposo[ez])) lejos = m[ez];
      if (Math.abs(lejos - A.reposo[ez]) < 0.08) { ok = false; continue; }      /* esa mano no se movió */
      nuevo[ez] = [A.reposo[ez], lejos];
      /* dirección: solo con la mano arriba (recogido, el cordel cae hacia un lado y no dice nada) */
      const arriba = M.filter(m => (m[ez] - A.reposo[ez]) / (lejos - A.reposo[ez]) > 0.25);
      if (arriba.length < 20) { ok = false; continue; }
      for (const e of [ex, ey]) {
        const lo = Math.min(...arriba.map(m => m[e])), hi = Math.max(...arriba.map(m => m[e]));
        if (hi - lo > 0.1) nuevo[e] = [lo + 0.05 * (hi - lo), hi - 0.05 * (hi - lo)];
      }
      c.inv[ez] = false;
    }
    if (ok) { c.rango = nuevo; this.guardar(); }
  }
  if (A.alTerminar) A.alTerminar(ok);
};
G.progresoAprender = function () { const A = this.aprendiendo; return A ? Math.min(1, (performance.now() - A.t0) / A.dur) : null; };

/* ---------- los dos gráficos ----------
   Cada mano: un cuadro 2D con sus cuadrantes y el punto donde está, más una barra con la altura.
   La izquierda se dibuja sobre el semicírculo del escenario (es el imán); la derecha, sobre
   los ejes orden–caos y κ.                                                                   */
/* el cuadro y la barra dentro del lienzo: una línea de título arriba y una de valores abajo */
function geo(W, H) {
  const fs = Math.max(10, Math.min(22, W / 22)), lh = fs * 1.55, barra = Math.max(14, W * 0.07), sep = 8;
  const L = Math.max(20, Math.min(W - barra - sep - 2, H - 2 * lh));
  return { fs, lh, barra, sep, L, x0: 1, y0: lh };
}
function dibujarMano(cv, gt, cual, opc) {
  opc = opc || {};
  const g = cv.getContext("2d"), dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H) return;
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
  const m = gt.manos[cual], s = gt.salida, izq = cual === "izq", hay = !!gt.sim || gt.conectado();
  const usando = hay && gt.cfg.activo;
  const col = izq ? "255,250,235" : "240,182,92", tenue = "132,146,168";
  const { fs, lh, barra, sep, L, x0, y0 } = geo(W, H);
  const X = x => x0 + (x + 1) / 2 * L, Y = y => y0 + (1 - (y + 1) / 2) * L;
  g.font = `700 ${fs}px ui-sans-serif,system-ui,sans-serif`; g.textBaseline = "top"; g.textAlign = "left";
  g.fillStyle = `rgba(${col},${usando ? 1 : 0.45})`;
  g.fillText(izq ? "IZQUIERDA · imán" : "DERECHA · caos, κ, nivel", x0, (lh - fs) / 2);
  g.fillStyle = "#0b1018"; g.fillRect(x0, y0, L, L);
  g.strokeStyle = `rgba(${tenue},.35)`; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, L - 1, L - 1);
  /* cuadrantes */
  g.strokeStyle = `rgba(${tenue},.4)`; g.setLineDash([3, 4]);
  g.beginPath(); g.moveTo(X(0), y0); g.lineTo(X(0), y0 + L); g.moveTo(x0, Y(0)); g.lineTo(x0 + L, Y(0)); g.stroke(); g.setLineDash([]);
  const fe = Math.max(9, fs * 0.62);
  g.font = `${fe}px ui-sans-serif,system-ui,sans-serif`; g.fillStyle = `rgba(${tenue},.95)`;
  if (izq) {
    /* el escenario visto desde arriba: el público abajo, el arco de laptops arriba */
    g.strokeStyle = `rgba(${col},.3)`; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(X(-0.95), Y(-1)); g.lineTo(X(0.95), Y(-1)); g.stroke();
    g.beginPath(); g.ellipse(X(0), Y(-1), 0.95 * L / 2, 0.95 * L, 0, Math.PI, 0); g.stroke();
    g.textAlign = "center"; g.textBaseline = "bottom"; g.fillText("público", X(0), y0 + L - 3);
    g.textBaseline = "top"; g.fillText("fondo del arco", X(0), y0 + 3);
    g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("izq.", x0 + 4, Y(0) - fe);
    g.textAlign = "right"; g.fillText("der.", x0 + L - 4, Y(0) - fe);
  } else {
    g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("← orden", x0 + 4, Y(0) + fe);
    g.textAlign = "right"; g.fillText("caos →", x0 + L - 4, Y(0) + fe);
    g.textAlign = "center"; g.textBaseline = "top"; g.fillText("↑ κ = 1 · un solo enjambre", X(0), y0 + 3);
    g.textBaseline = "bottom"; g.fillText("↓ κ = 0 · no se ven", X(0), y0 + L - 3);
    /* zona muerta del caos */
    g.fillStyle = `rgba(${tenue},.08)`; g.fillRect(X(-0.12), y0, X(0.12) - X(-0.12), L);
  }
  /* el punto: lleno si la mano está arriba */
  const px = X(m.x), py = Y(m.y), viva = usando && m.activa;
  g.strokeStyle = `rgba(${col},${viva ? 0.5 : 0.2})`; g.lineWidth = 1;
  g.beginPath(); g.moveTo(px, y0); g.lineTo(px, y0 + L); g.moveTo(x0, py); g.lineTo(x0 + L, py); g.stroke();
  const rad = Math.max(6, L * 0.035) * (1 + 0.8 * m.ext);
  if (viva) { g.fillStyle = `rgba(${col},.22)`; g.beginPath(); g.arc(px, py, rad * 2.2, 0, 2 * Math.PI); g.fill(); }
  g.beginPath(); g.arc(px, py, rad, 0, 2 * Math.PI);
  if (viva) { g.fillStyle = `rgb(${col})`; g.fill(); } else { g.strokeStyle = `rgba(${col},${hay ? 0.7 : 0.3})`; g.lineWidth = 2; g.stroke(); }
  /* la barra de altura */
  const bx = x0 + L + sep, bh = L;
  g.fillStyle = "#0b1018"; g.fillRect(bx, y0, barra, bh);
  g.fillStyle = `rgba(${col},${viva ? 0.9 : 0.3})`; g.fillRect(bx, y0 + bh * (1 - m.ext), barra, bh * m.ext);
  g.strokeStyle = `rgba(${tenue},.35)`; g.strokeRect(bx + 0.5, y0 + 0.5, barra - 1, bh - 1);
  g.strokeStyle = "#f0705e"; g.beginPath(); g.moveTo(bx - 2, y0 + bh * (1 - UMBRAL_SUBE)); g.lineTo(bx + barra + 2, y0 + bh * (1 - UMBRAL_SUBE)); g.stroke();
  /* lo que resulta */
  const fv = Math.max(10, fs * 0.85);
  g.font = `600 ${fv}px ui-monospace,Menlo,monospace`; g.textAlign = "left"; g.textBaseline = "top";
  g.fillStyle = `rgba(${col},${usando ? 1 : 0.45})`;
  const txt = !hay ? "sin Gametrak" : !gt.cfg.activo ? "apagado" : izq ? (m.activa ? "fuerza " + s.gf.toFixed(2) : "imán suelto")
    : (m.activa ? `caos ${s.caos >= 0 ? "+" : "−"}${Math.abs(s.caos).toFixed(2)} · κ ${s.kappa == null ? "–" : s.kappa.toFixed(2)} · ${s.general.toFixed(0)} dB` : (gt.cfg.dest.general ? "SILENCIO" : "abajo"));
  g.fillText(txt, x0, y0 + L + (lh - fv) / 2 + 1);
}

/* "probar con el mouse": arrastrar en un gráfico mueve esa mano; la rueda, su altura */
G.probarCon = function (cv, cual) {
  const mover = e => {
    if (!this.sim) return;
    const r = cv.getBoundingClientRect(), { L, x0, y0 } = geo(r.width, r.height);
    const x = (e.clientX - r.left - x0) / L, y = (e.clientY - r.top - y0) / L;
    if (x > 1) this.sim[cual].ext = Math.max(0, Math.min(1, 1 - y));           /* sobre la barra: la altura */
    else { this.sim[cual].x = Math.max(-1, Math.min(1, x * 2 - 1)); this.sim[cual].y = Math.max(-1, Math.min(1, 1 - y * 2)); }
  };
  let abajo = false;
  cv.addEventListener("pointerdown", e => { if (this.sim) { abajo = true; cv.setPointerCapture(e.pointerId); mover(e); } });
  cv.addEventListener("pointermove", e => { if (abajo) mover(e); });
  cv.addEventListener("pointerup", () => { abajo = false; });
  cv.addEventListener("wheel", e => { if (!this.sim) return; e.preventDefault(); this.sim[cual].ext = Math.max(0, Math.min(1, this.sim[cual].ext - Math.sign(e.deltaY) * 0.04)); }, { passive: false });
};
G.simular = function (si) { this.sim = si ? { izq: { x: 0, y: 0, ext: 0 }, der: { x: 0, y: 0, ext: 0 } } : null; };

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { Gametrak, dibujarMano });
})(typeof self !== "undefined" ? self : globalThis);
