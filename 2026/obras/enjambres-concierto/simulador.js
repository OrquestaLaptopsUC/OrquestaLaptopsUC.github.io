/* ============================================================
   ENJAMBRES · versión de concierto · simulador
   Orquesta de Laptops UC (OLUC) · IEE2003

   Corre el Modelo en un Worker con su propio reloj de 30 pasos por
   segundo, así la simulación no se frena si la pestaña queda en segundo
   plano. Lo usan dos páginas:
     · la maestra: el Worker además habla con el "Servidor Enjambres",
       le manda cada cuadro (binario, protocolo.js) y recibe lo que piden
       las laptops;
     · una laptop en modo ENSAYO: todo corre en esa laptop, sin red, con
       intérpretes simulados que tocan solos.
   Aquí viven también la partitura y su reloj. La partitura tiene mensajes
   (texto en el tiempo) y ETAPAS: cada etapa dice qué se cede a las laptops,
   con qué límites, qué valores rigen, cuántos agentes puede tener cada una
   y qué hace el director. Al entrar el reloj a una etapa, el simulador la
   aplica al modelo (con una rampa, para que nada salte) y la hace cumplir.

   ETAPA  {id, t, nombre, texto, director, rampa, cede, vals, conj, limites,
           maxAgentes, grupos, reparto, espera}
     t          segundo en que empieza (dura hasta la siguiente)
     texto      lo que leen los intérpretes · director: lo que lee el director
     rampa      segundos para llegar a los valores de la etapa
     cede       lo que cada laptop maneja: nombres de pad (movimiento, forma,
                sincronia, registro, timbre, pulso), "iman" (fuerza y lugar),
                "todo", o parámetros sueltos (voz, mapeo, color, vNoise…).
                Lo que no se cede lo rige la maestra.
     vals       valores de los parámetros: para lo retenido, el valor que rige;
                para lo cedido, el punto de partida de cada laptop
     conj       parámetros del conjunto (kappa…)
     limites    {parámetro: [mín, máx]}: rango permitido de lo cedido
     maxAgentes tope de agentes por laptop (si hay más, se van quitando de a uno)
     grupos     [{nombre, vals}]: las laptops se reparten en grupos y cada grupo
                recibe sus valores fijos (reparto: "bloques" del arco | "alternado")
     espera     al terminar la etapa el reloj se detiene hasta que el director avance

   La página arma el Worker con el código fuente de EnjambresModelo,
   EnjambresProtocolo y EnjambresSimulador (crearSimulador, al final),
   así funciona igual desde file:// que desde http.

   Página → Worker
     {cmd:"iniciar", servidor, simuladas, propia, bots, cederTodo, local, partitura}
     {cmd:"llamar", metodo, args}     métodos permitidos del Modelo
     {cmd:"maestra", grupo, k, v}     grupo: vals | retenido | conj
     {cmd:"laptop", num, k, v}        parámetro propio de una laptop
     {cmd:"orden", num, accion, …}    lo mismo que pide una laptop por la red
     {cmd:"correr", si}   {cmd:"paso"}   {cmd:"apagar"}   {cmd:"bots", si}
     {cmd:"partitura", partitura}     {cmd:"guardarPartitura"}
     {cmd:"reloj", accion: iniciar | detener | reiniciar | ir, ms}
     {cmd:"etapa", accion: siguiente | anterior | ir, i}     (el pedal del director)
   Worker → página
     {tipo:"cuadro", buf}             ArrayBuffer, cada paso
     {tipo:"estado", …}               4 por segundo y justo después de cada orden
     {tipo:"difusion", m}             (solo con local) lo que el servidor les
                                      mandaría a las laptops: config, partitura, reloj

   Worker ⇄ servidor (WebSocket /enjambres; ver README.md)
     → hola · cuadros binarios · config · partitura · reloj · respaldo · guardarPartitura
     ← bienvenida (direcciones, respaldo, laptops) · entra · sale · cmd · guardada
   ============================================================ */
function EnjambresSimulador(raiz) {
"use strict";

const PASOS_POR_SEG = 30;
const ESTADO_CADA = 8;              /* pasos: ~4 estados (y config a las laptops) por segundo */
const RESPALDO_MS = 2000;
const RELOJ_MS = 1000;              /* mientras corre, el reloj de la partitura se repite cada segundo */
const MAX_COLA_WS = 512 * 1024;     /* si la red se atora, se saltan cuadros en vez de acumularlos */
const METODOS = ["agregarLaptop", "quitarLaptop", "moverLaptop", "fijarSalidas", "repartir", "crearAgente",
                 "quitarAgente", "mutear", "mutearTodos", "reiniciar", "vaciar"];

function iniciarSimulador(puerto) {
  const { Modelo, codificar, MAX_AGENTES_LAPTOP, PARAMS, CONJUNTO, VOCES } = raiz.Enjambres;
  const modelo = new Modelo();
  let corriendo = true, pendiente = true, cuenta = 0;
  let pasosMedidos = 0, tMedida = Date.now(), pasosPorSeg = 0;
  const historia = [];              /* pasos/s de cada segundo del último minuto, para el mínimo */
  let local = false;                /* ensayo: config, partitura y reloj van a la página */

  /* ---------- partitura (mensajes y etapas) y su reloj ---------- */
  let partitura = { v: 2, mod: 0, eventos: [], etapas: [] }, versionPartitura = 1;
  const reloj = { estado: "espera", base: 0, t0: 0 };
  const msReloj = () => reloj.estado === "corriendo" ? reloj.base + (Date.now() - reloj.t0) : reloj.base;
  let tReloj = 0;
  const nuevoId = () => Math.random().toString(36).slice(2, 9);
  const objeto = o => o && typeof o === "object" && !Array.isArray(o) ? JSON.parse(JSON.stringify(o)) : {};
  function limpiarEtapa(e) {
    return {
      id: String(e.id || nuevoId()), t: Math.max(0, +e.t || 0),
      nombre: String(e.nombre || "").slice(0, 60), texto: String(e.texto || "").slice(0, 600),
      director: String(e.director || "").slice(0, 600),
      rampa: Math.max(0, Math.min(120, +e.rampa || 0)),
      cede: Array.isArray(e.cede) ? e.cede.slice(0, 40).map(String) : [],
      vals: objeto(e.vals), conj: objeto(e.conj), limites: objeto(e.limites),
      maxAgentes: e.maxAgentes == null || e.maxAgentes === "" ? null : Math.max(0, Math.min(MAX_AGENTES_LAPTOP, e.maxAgentes | 0)),
      grupos: Array.isArray(e.grupos) ? e.grupos.slice(0, 8).map(g => ({ nombre: String(g && g.nombre || "").slice(0, 40), vals: objeto(g && g.vals) })) : [],
      reparto: e.reparto === "alternado" ? "alternado" : "bloques", espera: !!e.espera,
    };
  }
  function limpiarPartitura(p) {
    return { v: 2, mod: +p.mod || 0,
      eventos: p.eventos.slice(0, 2000).map(e => ({
        id: String(e.id || nuevoId()),
        t: Math.max(0, +e.t || 0), dur: Math.max(1, +e.dur || 10),
        para: e.para === "todos" || e.para == null ? "todos" : (e.para | 0),
        texto: String(e.texto || "").slice(0, 400) })),
      etapas: (Array.isArray(p.etapas) ? p.etapas : []).slice(0, 200).map(limpiarEtapa).sort((a, b) => a.t - b.t) };
  }
  function fijarPartitura(p, editada) {
    if (!p || !Array.isArray(p.eventos)) return;
    partitura = limpiarPartitura(p);
    if (editada) partitura.mod = Date.now();
    versionPartitura++;
    etapaAct = null;                 /* la etapa en curso puede haber cambiado: se vuelve a aplicar */
    difundir({ t: "partitura", partitura });
  }

  /* ---------- etapas: lo que la partitura impone ---------- */
  const ALIAS = raiz.Enjambres.ALIAS_CEDE;
  let etapaAct = -1;                /* índice de la etapa aplicada; -1 = ninguna; null = hay que volver a aplicar */
  let soltado = -1;                 /* etapa cuyo calderón ya se soltó */
  let revMaestra = 0;               /* sube cada vez que una etapa cambia valores de la maestra: la página los adopta */
  let rampas = [];                  /* {tipo: vals|conj|lap, k, num, de, a, log, t0, dur, alFinal} */
  const reales = () => [...modelo.laptops.values()].filter(l => !l.maestra);
  const esNum = k => { const p = PARAMS.find(q => q.k === k); return p && !p.opciones ? p : null; };
  function rampa(tipo, k, num, a, dur, alFinal) {
    const m = modelo.maestra, l = num != null ? modelo.laptops.get(num) : null;
    const de = tipo === "vals" ? m.vals[k] : tipo === "conj" ? m.conj[k] : l.params[k];
    const p = (tipo === "conj" ? CONJUNTO : PARAMS).find(q => q.k === k);
    rampas = rampas.filter(r => !(r.tipo === tipo && r.k === k && r.num === num));
    if (!(dur > 0) || de === a || typeof de !== "number" || typeof a !== "number") {
      if (tipo === "vals") m.vals[k] = a; else if (tipo === "conj") m.conj[k] = a; else l.params[k] = a;
      if (alFinal) alFinal();
      return;
    }
    rampas.push({ tipo, k, num, de, a, log: !!(p && p.log && de > 0 && a > 0), t0: Date.now(), dur: dur * 1000, alFinal });
  }
  function seguirRampas() {
    if (!rampas.length) return;
    const ahora = Date.now(), m = modelo.maestra, listas = [];
    for (const r of rampas) {
      const u = Math.max(0, Math.min(1, (ahora - r.t0) / r.dur));
      const v = u >= 1 ? r.a : r.log ? r.de * Math.pow(r.a / r.de, u) : r.de + (r.a - r.de) * u;
      if (r.tipo === "vals") m.vals[r.k] = v;
      else if (r.tipo === "conj") m.conj[r.k] = v;
      else { const l = modelo.laptops.get(r.num); if (l) l.params[r.k] = v; }
      if (u >= 1) listas.push(r);
    }
    if (listas.length) {
      rampas = rampas.filter(r => !listas.includes(r));
      for (const r of listas) if (r.alFinal) r.alFinal();
    }
    revMaestra++;
  }
  /* a qué grupo va cada laptop: bloques contiguos del arco (de izquierda a derecha del público) o alternadas */
  function grupoDe(e) {
    const G = e.grupos.length, g = new Map();
    if (!G) return g;
    const ls = reales().sort((a, b) => b.fi - a.fi), K = ls.length;
    ls.forEach((l, i) => g.set(l.num, e.reparto === "alternado" ? i % G : Math.min(G - 1, Math.floor(i * G / K))));
    return g;
  }
  function aplicarEtapa(i, sinRampa, re) {      /* re: se vuelve a aplicar la misma (cambió la partitura o entró una laptop) */
    const E = partitura.etapas, e = i >= 0 ? E[i] : null, m = modelo.maestra;
    if ((e ? i : -1) !== etapaAct && !re) soltado = -1;
    etapaAct = e ? i : -1;
    rampas = [];
    for (const l of modelo.laptops.values()) { l.fijo = {}; l.grupo = null; }
    revMaestra++; pendiente = true;
    if (!e) { modelo.limites = {}; modelo.tope = MAX_AGENTES_LAPTOP; return; }   /* sin etapa: nada impuesto */
    const dur = sinRampa ? 0 : e.rampa, durCorta = Math.min(dur, 3);
    const grupo = grupoDe(e), ls = reales();
    for (const l of ls) l.grupo = grupo.has(l.num) ? grupo.get(l.num) : null;
    const ced = new Set();
    for (const c of e.cede) for (const k of (c === "todo" ? PARAMS.map(p => p.k) : ALIAS[c] || [c])) ced.add(k);
    for (const g of e.grupos) for (const k in g.vals) ced.add(k);            /* lo que va por grupos vive en cada laptop */

    /* límites: se fijan ya, pero lo que quedó afuera entra con una rampa corta */
    modelo.limites = {};
    const lim = {};
    for (const k in e.limites) { const p = esNum(k), q = e.limites[k]; if (p && Array.isArray(q) && q.length === 2 && isFinite(+q[0]) && isFinite(+q[1]))
      lim[k] = [Math.max(p.min, Math.min(+q[0], +q[1])), Math.min(p.max, Math.max(+q[0], +q[1]))]; }
    const acotar = (k, v) => lim[k] && typeof v === "number" ? Math.max(lim[k][0], Math.min(lim[k][1], v)) : v;

    for (const p of PARAMS) {
      const k = p.k, antes = m.retenido[k], cedido = ced.has(k), dado = k in e.vals, num = !p.opciones;
      if (dado && p.opciones && !p.opciones.includes(e.vals[k])) continue;
      const meta = dado ? (num ? Math.max(p.min, Math.min(p.max, +e.vals[k])) : e.vals[k]) : m.vals[k];
      if (num && !isFinite(meta)) continue;
      if (cedido) {
        /* pasa (o sigue) en manos de las laptops: cada una parte de lo que estaba sonando */
        if (antes) for (const l of ls) l.params[k] = m.vals[k];
        m.retenido[k] = false;
        for (const l of ls) {
          const g = grupo.has(l.num) ? e.grupos[grupo.get(l.num)] : null;
          if (g && k in g.vals) {                                            /* impuesto a su grupo */
            l.fijo[k] = true;
            if (num) rampa("lap", k, l.num, Math.max(p.min, Math.min(p.max, +g.vals[k])), dur);
            else if (p.opciones.includes(g.vals[k])) l.params[k] = g.vals[k];
          } else if (dado && !re) { if (num) rampa("lap", k, l.num, acotar(k, meta), durCorta); else l.params[k] = meta; }
          else if (num && acotar(k, l.params[k]) !== l.params[k]) rampa("lap", k, l.num, acotar(k, l.params[k]), durCorta);
        }
        if (dado) m.vals[k] = meta;
      } else if (antes || !num) {
        /* lo rige la maestra: su valor va a la meta con la rampa de la etapa */
        m.retenido[k] = true;
        if (num) rampa("vals", k, null, meta, dur); else m.vals[k] = meta;
      } else {
        /* estaba cedido y ahora lo rige la maestra: cada laptop converge a la meta y recién ahí se retiene */
        let faltan = ls.length;
        if (!faltan || !(dur > 0)) { m.vals[k] = meta; m.retenido[k] = true; continue; }
        m.vals[k] = meta;
        for (const l of ls) {
          l.fijo[k] = true;
          rampa("lap", k, l.num, meta, dur, () => { if (--faltan <= 0) { m.retenido[k] = true; for (const x of modelo.laptops.values()) delete x.fijo[k]; } });
        }
      }
    }
    modelo.limites = lim;
    for (const p of CONJUNTO) if (p.k in e.conj && isFinite(+e.conj[p.k])) rampa("conj", p.k, null, Math.max(p.min, Math.min(p.max, +e.conj[p.k])), dur);
    modelo.tope = e.maxAgentes == null ? MAX_AGENTES_LAPTOP : e.maxAgentes;
    modelo.derivar();
  }
  const etapaDe = ms => { const E = partitura.etapas, s = ms / 1000; let i = -1; for (let j = 0; j < E.length; j++) if (s >= E[j].t) i = j; return i; };
  /* en cada paso: ¿el reloj entró a otra etapa? ¿hay que esperar al director? */
  function seguirEtapas() {
    const E = partitura.etapas;
    if (!E.length || reloj.estado === "espera") { if (etapaAct !== -1) aplicarEtapa(-1); return; }
    if (reloj.estado === "corriendo" && etapaAct != null && etapaAct >= 0 && E[etapaAct] && E[etapaAct].espera && E[etapaAct + 1]
        && soltado !== etapaAct && msReloj() >= E[etapaAct + 1].t * 1000) {
      Object.assign(reloj, { estado: "detenido", base: E[etapaAct + 1].t * 1000 - 1 });   /* calderón: espera al director */
      reloj.calderon = true; difundirReloj();
    }
    const i = etapaDe(msReloj());
    if (i !== etapaAct) aplicarEtapa(i, false, etapaAct === null);
    /* la obra terminó: 15 s después de entrar a la última etapa el reloj se detiene solo */
    const fin = (E[E.length - 1].t + 15) * 1000;
    if (reloj.estado === "corriendo" && i === E.length - 1 && msReloj() >= fin) { Object.assign(reloj, { estado: "detenido", base: fin }); difundirReloj(); }
  }
  function accionEtapa(m) {
    const E = partitura.etapas;
    if (!E.length) return;
    let i;
    if (m.accion === "ir") i = m.i | 0;
    else if (m.accion === "anterior") i = Math.max(0, (etapaAct == null ? etapaDe(msReloj()) : etapaAct) - 1);
    else {                                             /* siguiente: desde la espera, empieza la obra */
      if (reloj.estado === "espera") { accionReloj({ accion: "ir", ms: E[0].t * 1000 }); accionReloj({ accion: "iniciar" }); return; }
      i = (etapaAct == null ? etapaDe(msReloj()) : etapaAct) + 1;
    }
    if (i < 0 || i >= E.length) return;
    reloj.calderon = false;
    if (i !== etapaAct) aplicarEtapa(i);
    accionReloj({ accion: "ir", ms: E[i].t * 1000 });
    accionReloj({ accion: "iniciar" });
  }
  /* si una laptop tiene más agentes que el tope de la etapa, se le quita uno por segundo */
  function podar() {
    if (!corriendo || modelo.tope >= MAX_AGENTES_LAPTOP) return;
    const cuenta = new Map();
    for (const a of modelo.agentes) cuenta.set(a.dueno, (cuenta.get(a.dueno) || 0) + 1);
    for (const [num, n] of cuenta) if (n > modelo.tope) modelo.quitarAgente(num);
  }
  function etapaActual() {
    const E = partitura.etapas, e = etapaAct != null && etapaAct >= 0 ? E[etapaAct] : null;
    if (!e) return null;
    const sig = E[etapaAct + 1];
    return { i: etapaAct, n: E.length, id: e.id, nombre: e.nombre, texto: e.texto, director: e.director, t: e.t,
             fin: sig ? sig.t : null, espera: e.espera, grupos: e.grupos.map(g => g.nombre) };
  }
  function accionReloj(m) {
    const ahora = Date.now(), ms = msReloj();
    if (reloj.calderon && m.accion === "iniciar") soltado = etapaAct;      /* el director suelta el calderón */
    reloj.calderon = false;
    if (m.accion === "iniciar" && reloj.estado !== "corriendo") Object.assign(reloj, { estado: "corriendo", base: ms, t0: ahora });
    else if (m.accion === "detener" && reloj.estado === "corriendo") Object.assign(reloj, { estado: "detenido", base: ms });
    else if (m.accion === "reiniciar") Object.assign(reloj, { estado: "espera", base: 0 });
    else if (m.accion === "ir") Object.assign(reloj, { base: Math.max(0, +m.ms || 0), t0: ahora,
                                                         estado: reloj.estado === "espera" ? "detenido" : reloj.estado });
    difundirReloj();
  }
  const msgReloj = () => ({ t: "reloj", estado: reloj.estado, ms: msReloj() });
  function difundirReloj() { tReloj = Date.now(); difundir(msgReloj()); }

  /* ---------- intérpretes simulados que tocan solos ---------- */
  let bots = false;
  const plan = new Map();           /* num → {objetivo, hasta} */
  function tocarBots() {            /* una vez por segundo */
    if (!bots || !corriendo) return;
    const ahora = Date.now();
    for (const l of modelo.laptops.values()) {
      if (!l.simulada) continue;
      let p = plan.get(l.num);
      if (!p || ahora > p.hasta) {   /* cada 8 a 25 s, cada uno decide cuántos agentes quiere */
        p = { objetivo: Math.random() < 0.15 ? 0 : Math.round(2 + Math.random() * 10), hasta: ahora + 8000 + Math.random() * 17000 };
        plan.set(l.num, p);
      }
      const mios = modelo.agentes.filter(a => a.dueno === l.num);
      if (mios.length < p.objetivo && Math.random() < 0.5) modelo.crearAgente(l.num);
      else if (mios.length > p.objetivo && Math.random() < 0.4) modelo.quitarAgente(l.num);
      if (mios.length && Math.random() < 0.04) modelo.mutear(mios[Math.floor(Math.random() * mios.length)].id);
      /* v2: como un intérprete, de vez en cuando mueve su imán, su forma y su voz (solo lo que la maestra cede) */
      if (!p.gesto || ahora > p.gesto) {
        p.gesto = ahora + 6000 + Math.random() * 14000;
        const R = Math.sqrt(Math.random()) * 0.9, fi = Math.random() * Math.PI;
        const q = { ix: R * Math.cos(fi), iy: R * Math.sin(fi), iman: Math.random() < 0.35 ? 0 : Math.random() * 1.4 - 0.4,
                    coh: Math.random() < 0.5 ? 0 : Math.random() * 1.6 - 0.8 };
        if (Math.random() < 0.3) q.voz = VOCES[Math.floor(Math.random() * VOCES.length)];
        if (Math.random() < 0.3) q.color = Math.random();
        for (const k in q) if (!modelo.maestra.retenido[k]) modelo.fijarParam(l.num, k, q[k]);
      }
      if (Math.random() < 0.004) modelo.mutearTodos(l.num, !mios.every(a => a.mudo));
    }
  }

  /* ---------- red ---------- */
  let ws = null, url = null, intento = 0, tRespaldo = 0, configPrevia = "", tocado = false;
  const red = { estado: "sin servidor", direcciones: [], servidor: null };

  function asegurarMaestra() { if (!modelo.laptops.has(0)) modelo.agregarLaptop(0, { fi: Math.PI / 2 }); }

  function conectar() {
    red.estado = intento ? "reconectando" : "conectando";
    pendiente = true;
    try { ws = new WebSocket(url); } catch (e) { return reintentar(); }
    ws.binaryType = "arraybuffer";
    ws.onopen = () => { intento = 0; ws.send(JSON.stringify({ t: "hola", rol: "maestra" })); };
    ws.onmessage = e => { if (typeof e.data === "string") try { delServidor(JSON.parse(e.data)); } catch (x) { } };
    ws.onclose = () => { ws = null; if (red.estado !== "rechazada" && red.estado !== "apagado") reintentar(); };
  }
  function reintentar() {
    red.estado = "reconectando"; pendiente = true;
    setTimeout(conectar, Math.min(5000, 500 * Math.pow(2, intento++)));
  }
  const enviarWS = o => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); };
  /* lo que reciben las laptops (y la proyección): por la red o, en ensayo, la página misma */
  function difundir(o) {
    if (local) puerto.postMessage({ tipo: "difusion", m: o });
    else if (red.estado === "conectada") enviarWS(o);
  }

  function restaurar(r) {
    if (!r) return false;
    const est = r.modelo || r;
    if (!modelo.importar(est)) return false;
    /* la partitura del respaldo solo si se editó después que la del archivo partitura.js */
    if (r.partitura && Array.isArray(r.partitura.eventos) && (+r.partitura.mod || 0) > (partitura.mod || 0)) { partitura = limpiarPartitura(r.partitura); versionPartitura++; }
    etapaAct = null;
    if (r.reloj) Object.assign(reloj, r.reloj, r.reloj.estado === "corriendo" ? { base: r.reloj.ms || 0, t0: Date.now() } : { base: r.reloj.ms || 0 });
    return true;
  }

  function delServidor(m) {
    if (m.t === "bienvenida") {
      red.estado = "conectada"; red.direcciones = m.direcciones || [];
      /* si la página de la maestra se recargó, se recupera el enjambre que guardó el servidor */
      if (m.respaldo && !tocado && restaurar(m.respaldo)) red.restaurado = (red.restaurado || 0) + 1;
      asegurarMaestra();
      for (const l of modelo.laptops.values()) if (!l.maestra && !l.simulada) l.conectada = false;
      for (const q of m.laptops || []) entra(q);
      configPrevia = "";
      difundir({ t: "partitura", partitura }); difundirReloj();
    } else if (m.t === "rechazado") {
      red.estado = "rechazada";     /* otra máquina: solo la laptop servidora puede ser la maestra */
    } else if (m.t === "entra") entra(m);
    else if (m.t === "sale") {
      const l = modelo.laptops.get(m.num);
      if (l && !l.simulada) l.conectada = false;
    } else if (m.t === "cmd") orden(m);
    else if (m.t === "guardada") red.guardada = { ok: !!m.ok, ruta: m.ruta || "", error: m.error || "", n: (red.guardada ? red.guardada.n : 0) + 1 };
    modelo.derivar();
    pendiente = true;
  }

  function entra(q) {
    const num = q.num | 0;
    if (num < 1 || num > 99) return;
    let l = modelo.laptops.get(num);
    if (!l) { l = modelo.agregarLaptop(num); if (etapaAct != null && etapaAct >= 0) etapaAct = null; }   /* entra en el hueco más grande del arco; la etapa se le aplica también */
    l.simulada = false; l.conectada = true;
    if (q.salidas) modelo.fijarSalidas(num, q.salidas);
  }

  /* Lo que pide una laptop. Por la red, el servidor pone 'num': cada laptop solo toca lo suyo. */
  function orden(m) {
    const num = m.num | 0, l = modelo.laptops.get(num);
    if (!l || l.maestra) return;
    tocado = true;
    switch (m.accion) {
      case "crear": modelo.crearAgente(num); break;
      case "quitar": modelo.quitarAgente(num, m.id != null ? m.id | 0 : undefined); break;
      case "mutear": { const a = modelo.agentes.find(a => a.id === (m.id | 0)); if (a && a.dueno === num) modelo.mutear(a.id); break; }
      case "mutearTodos": modelo.mutearTodos(num, !!m.si); break;
      case "param": { const k = String(m.k); if (modelo.fijarParam(num, k, m.v)) rampas = rampas.filter(r => !(r.tipo === "lap" && r.num === num && r.k === k)); break; }
      case "salidas": modelo.fijarSalidas(num, m.n); break;
    }
  }

  /* Lo que cada laptop necesita saber además de los cuadros: qué parámetros cede la
     maestra y con qué valores, y los suyos propios. */
  function config() {
    const laptops = [];
    for (const l of modelo.laptops.values()) {
      let n = 0, mudos = 0;
      for (const a of modelo.agentes) if (a.dueno === l.num) { n++; if (a.mudo) mudos++; }
      laptops.push({ num: l.num, color: l.color, maestra: l.maestra, simulada: l.simulada, conectada: l.conectada,
                     salidas: l.salidas, params: l.params, fijo: Object.keys(l.fijo), grupo: l.grupo == null ? null : l.grupo, n, mudos });
    }
    return { t: "config", corriendo, vals: modelo.maestra.vals, retenido: modelo.maestra.retenido,
             maxAgentes: Math.min(MAX_AGENTES_LAPTOP, modelo.tope), limites: modelo.limites, etapa: etapaActual(), laptops };
  }

  /* ---------- hacia la página ---------- */
  function estado() {
    const laptops = [];
    for (const l of modelo.laptops.values()) {
      let n = 0, mudos = 0;
      for (const a of modelo.agentes) if (a.dueno === l.num) { n++; if (a.mudo) mudos++; }
      laptops.push({ num: l.num, fi: l.fi, color: l.color, maestra: l.maestra, simulada: l.simulada,
                     conectada: l.conectada, salidas: l.salidas, fijo: Object.keys(l.fijo), grupo: l.grupo == null ? null : l.grupo,
                     params: l.params, ef: modelo.efectivos(l.num), n, mudos,
                     psi: modelo.polarizacion(l.num) });
    }
    return { tipo: "estado", corriendo, pasos: modelo.pasos, pasosPorSeg,
             pasosMin: historia.length ? Math.min(...historia) : null,
             maestra: modelo.maestra, laptops, N: modelo.agentes.length,
             psi: modelo.polarizacion(), vecinos: modelo.vecinosMedio(), red, bots,
             reloj: { estado: reloj.estado, ms: msReloj(), calderon: !!reloj.calderon }, partitura, versionPartitura,
             etapa: etapaActual(), limites: modelo.limites, tope: modelo.tope, revMaestra, rampas: rampas.length };
  }

  function emitir() {
    const buf = codificar(modelo.instantanea());
    if (ws && ws.readyState === 1 && red.estado === "conectada" && ws.bufferedAmount < MAX_COLA_WS) ws.send(buf.slice(0));
    puerto.postMessage({ tipo: "cuadro", buf }, [buf]);
    if (pendiente || ++cuenta >= ESTADO_CADA) {
      cuenta = 0; pendiente = false;
      puerto.postMessage(estado());
      const ahora = Date.now();
      if (local || red.estado === "conectada") {
        const c = JSON.stringify(config());
        if (c !== configPrevia) { configPrevia = c; if (local) difundir(JSON.parse(c)); else ws.send(c); }
        if (reloj.estado === "corriendo" && ahora - tReloj > RELOJ_MS) difundirReloj();
      }
      if (red.estado === "conectada" && ahora - tRespaldo > RESPALDO_MS) {
        tRespaldo = ahora;
        enviarWS({ t: "respaldo", estado: { modelo: modelo.exportar(), partitura, reloj: { estado: reloj.estado, ms: msReloj() } } });
      }
    }
  }

  let tBots = 0;
  function tick() {
    seguirEtapas(); seguirRampas();
    if (corriendo) { modelo.paso(); pasosMedidos++; } else if (rampas.length) modelo.derivar();
    const ahora = Date.now();
    if (ahora - tMedida >= 1000) {
      pasosPorSeg = pasosMedidos * 1000 / (ahora - tMedida); pasosMedidos = 0; tMedida = ahora;
      if (corriendo) { historia.push(pasosPorSeg); if (historia.length > 60) historia.shift(); } else historia.length = 0;
    }
    if (ahora - tBots >= 1000) { tBots = ahora; tocarBots(); podar(); }
    emitir();
  }

  puerto.onmessage = e => {
    const m = e.data || {};
    if (m.cmd === "iniciar") {
      bots = !!m.bots; local = !!m.local;
      if (m.partitura) fijarPartitura(m.partitura);
      if (m.servidor) {
        red.servidor = m.servidor; url = "ws://" + m.servidor + "/enjambres";
        conectar();
        /* sin respuesta del servidor igual se puede trabajar; si luego llega un respaldo, no se pisa lo hecho */
        setTimeout(() => { asegurarMaestra(); pendiente = true; }, 1500);
      } else {
        asegurarMaestra();
        const propia = m.propia | 0;
        let n = 1;
        for (let k = 0; k < (m.simuladas | 0); k++, n++) { if (n === propia) n++; modelo.agregarLaptop(n, { simulada: true }); }
        if (propia) modelo.agregarLaptop(propia, { simulada: false });
        modelo.repartir();
        if (m.cederTodo) for (const p of PARAMS) modelo.maestra.retenido[p.k] = false;
        if (local) { difundir({ t: "partitura", partitura }); difundirReloj(); }
      }
    } else {
      if (!m.auto) tocado = true;     /* lo que manda el Gametrak no cuenta como «la maestra ya trabajó» (no impide recuperar el respaldo) */
      if (m.cmd === "llamar" && METODOS.includes(m.metodo)) modelo[m.metodo].apply(modelo, m.args || []);
      else if (m.cmd === "maestra" && ["vals", "retenido", "conj"].includes(m.grupo)) {
        modelo.maestra[m.grupo][m.k] = m.v;
        rampas = rampas.filter(r => !(r.tipo === m.grupo && r.k === m.k));     /* la mano de la maestra manda sobre la rampa */
      }
      else if (m.cmd === "laptop") modelo.fijarParam(m.num, m.k, m.v);
      else if (m.cmd === "orden") orden(m);
      else if (m.cmd === "bots") { bots = !!m.si; plan.clear(); }
      else if (m.cmd === "partitura") fijarPartitura(m.partitura, true);
      else if (m.cmd === "etapa") accionEtapa(m);
      else if (m.cmd === "deNuevo") { modelo.vaciar(); accionReloj({ accion: "reiniciar" }); }      /* volver al comienzo: 0:00 y sin agentes */
      else if (m.cmd === "guardarPartitura") enviarWS({ t: "guardarPartitura", partitura });
      else if (m.cmd === "reloj") accionReloj(m);
      else if (m.cmd === "correr" || m.cmd === "paso") {
        corriendo = m.cmd === "correr" && !!m.si;
        if (m.cmd === "paso") modelo.paso();
        pasosMedidos = 0; tMedida = Date.now(); historia.length = 0;   /* medir de nuevo desde aquí */
      } else if (m.cmd === "apagar") { enviarWS({ t: "apagar" }); red.estado = "apagado"; }
    }
    modelo.derivar();
    pendiente = true;
  };

  setInterval(tick, 1000 / PASOS_POR_SEG);
}

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { iniciarSimulador });
}
EnjambresSimulador(typeof self !== "undefined" ? self : globalThis);

/* ---------- en la página: arma el Worker con el código de los módulos ----------
   Chrome no deja cargar un Worker desde un archivo abierto con doble clic (file://),
   así que se arma desde un Blob con el código fuente. Si aun así falla, la simulación
   corre en la página misma ('donde' lo dice).                                       */
function crearSimulador(recibir) {
  const fuente = [EnjambresModelo, EnjambresProtocolo, EnjambresSimulador]
    .map(f => "(" + f.toString() + ")(self);").join("\n") + "\nself.Enjambres.iniciarSimulador(self);";
  try {
    const w = new Worker(URL.createObjectURL(new Blob([fuente], { type: "text/javascript" })));
    w.onmessage = e => recibir(e.data);
    const s = { enviar: m => w.postMessage(m), donde: "Worker", error: "" };
    w.onerror = e => { console.error("simulador:", e.message); s.error = e.message || "error en el Worker"; };
    return s;
  } catch (e) {
    console.warn("sin Worker, la simulación corre en la página:", e);
    const puerto = { postMessage: m => setTimeout(() => recibir(structuredClone(m)), 0), onmessage: null };
    Enjambres.iniciarSimulador(puerto);
    return { enviar: m => puerto.onmessage({ data: structuredClone(m) }), donde: "página (sin Worker)", error: "" };
  }
}
