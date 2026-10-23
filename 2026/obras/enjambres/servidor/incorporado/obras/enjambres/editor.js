/* ============================================================
   ENJAMBRES · editor de partitura (solo en la maestra)
   Orquesta de Laptops UC (OLUC) · IEE2003

   Línea de tiempo con un carril "todos" y un carril por laptop. Cada
   mensaje es un bloque: se arrastra para moverlo (en el tiempo y de
   carril), se estira por el borde derecho para cambiar cuánto dura, y
   con doble clic o clic se edita su texto abajo. El chip "+ mensaje" se
   arrastra a cualquier carril para crear uno; doble clic en un hueco
   también crea. Supr borra el elegido. Ajusta al segundo (Alt: libre).
   Clic en la regla mueve el reloj de la partitura.

   opc: {alCambiar(partitura), alIr(ms), alReloj(accion), alGuardar(),
         carriles() → [num], color(num) → "#rrggbb"}
   ============================================================ */
(function (raiz) {
"use strict";
const { mmss } = raiz.Enjambres;
const ALTO_CARRIL = 28, ANCHO_NOMBRES = 92;

if (!document.getElementById("estilosEditor")) {
  const st = document.createElement("style"); st.id = "estilosEditor";
  st.textContent = `
  .ed{display:flex;flex-direction:column;height:100%;min-height:0;background:#0d1116;font-size:11.5px}
  .edBarra{display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid #232a32;flex-wrap:wrap}
  .edBarra .tiempo{font-size:15px;font-variant-numeric:tabular-nums;min-width:52px;color:#dfe5ec}
  .edBarra .sep{width:1px;height:18px;background:#232a32}
  .edBarra .chipNuevo{background:#e8b25a;color:#1a1204;font-weight:700;padding:3px 9px;border-radius:4px;cursor:grab;touch-action:none}
  .edBarra .estadoG{color:#8b97a6}
  .edCuerpo{flex:1;display:flex;min-height:0}
  .edNombres{width:${ANCHO_NOMBRES}px;flex:none;border-right:1px solid #232a32;padding-top:22px;overflow:hidden}
  .edNombres div{height:${ALTO_CARRIL}px;display:flex;align-items:center;gap:6px;padding:0 8px;border-bottom:1px solid #161c23;color:#8b97a6;white-space:nowrap}
  .edNombres i{width:10px;height:10px;border-radius:50%;display:inline-block;flex:none}
  .edScroll{flex:1;overflow:auto;position:relative;min-width:0}
  .edLienzo{position:relative}
  .edRegla{height:22px;position:sticky;top:0;background:#11161c;border-bottom:1px solid #232a32;cursor:pointer;z-index:3}
  .edRegla span{position:absolute;top:4px;font-size:10px;color:#6f7b8a;transform:translateX(3px)}
  .edRegla b{position:absolute;bottom:0;width:1px;background:#3a4552}
  .edCarril{height:${ALTO_CARRIL}px;position:relative;border-bottom:1px solid #161c23}
  .edCarril.sobre{background:#16202b}
  .edEv{position:absolute;top:4px;height:${ALTO_CARRIL - 8}px;border-radius:4px;padding:2px 6px;color:#10131a;font-weight:600;
    overflow:hidden;white-space:nowrap;text-overflow:ellipsis;cursor:grab;box-sizing:border-box;border:1px solid rgba(0,0,0,.35);
    font-size:11px;line-height:${ALTO_CARRIL - 12}px;touch-action:none}
  .edEv.sel{outline:2px solid #fff;outline-offset:1px}
  .edEv .borde{position:absolute;right:0;top:0;bottom:0;width:7px;cursor:ew-resize}
  .edCabezal{position:absolute;top:0;bottom:0;width:2px;background:#7fc47f;pointer-events:none;z-index:4}
  .edDetalle{border-top:1px solid #232a32;padding:6px 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .edDetalle textarea{flex:1;min-width:240px;height:34px;background:#1b2128;color:#dfe5ec;border:1px solid #232a32;border-radius:4px;font:12px ui-monospace,Menlo,monospace;padding:4px 6px;resize:vertical}
  .edDetalle input{width:64px;background:#1b2128;color:#dfe5ec;border:1px solid #232a32;border-radius:4px;font:12px ui-monospace,Menlo,monospace;padding:4px}
  .edFantasma{position:fixed;pointer-events:none;z-index:50;background:#e8b25a;color:#1a1204;font-weight:700;padding:3px 8px;border-radius:4px;opacity:.85}
  `;
  document.head.appendChild(st);
}

const nuevoId = () => Math.random().toString(36).slice(2, 9);
const leerTiempo = s => { const m = String(s).trim().match(/^(\d+):(\d{1,2}(?:\.\d+)?)$/); return m ? +m[1] * 60 + +m[2] : +s; };

function EditorPartitura(cont, opc) {
  this.opc = opc; this.eventos = []; this.pps = 6; this.sel = null; this.extra = []; this.reloj = { estado: "espera" };
  const el = this.el = document.createElement("div"); el.className = "ed";
  el.innerHTML = `
    <div class="edBarra">
      <button data-a="iniciar" title="iniciar o continuar el reloj de la partitura">▶</button>
      <button data-a="detener" title="detener">⏸</button>
      <button data-a="reiniciar" title="volver a 0:00">⏮</button>
      <span class="tiempo">0:00</span>
      <span class="sep"></span>
      <span class="chipNuevo" title="arrástralo a un carril (o clic: en el cabezal, para todos)">+ mensaje</span>
      <span class="sep"></span>
      <button data-z="-1" title="alejar">−</button><button data-z="1" title="acercar">+</button>
      <button data-c="1" title="agregar el carril de otra laptop">+ carril</button>
      <span class="sep"></span>
      <button data-g="1" title="guarda partitura.js junto a las páginas: la usan las laptops, también para ensayar">guardar</button>
      <button data-x="1" title="descargar como archivo .json">exportar</button>
      <button data-i="1" title="abrir un archivo .json">importar</button>
      <input type="file" accept=".json,application/json" style="display:none">
      <span class="estadoG"></span>
    </div>
    <div class="edCuerpo"><div class="edNombres"></div><div class="edScroll"><div class="edLienzo"></div></div></div>
    <div class="edDetalle"></div>`;
  cont.appendChild(el);
  this.$ = s => el.querySelector(s);
  this.nombres = this.$(".edNombres"); this.scroll = this.$(".edScroll"); this.lienzo = this.$(".edLienzo"); this.detalle = this.$(".edDetalle");
  this.scroll.addEventListener("scroll", () => { this.nombres.scrollTop = this.scroll.scrollTop; });
  for (const b of el.querySelectorAll("[data-a]")) b.onclick = () => opc.alReloj(b.dataset.a);
  for (const b of el.querySelectorAll("[data-z]")) b.onclick = () => { this.pps = Math.max(1, Math.min(40, this.pps * (b.dataset.z > 0 ? 1.5 : 1 / 1.5))); this.pintar(); };
  this.$("[data-c]").onclick = () => {
    const n = parseInt(prompt("Número de la laptop para el nuevo carril (1–99):"), 10);
    if (n >= 1 && n <= 99 && !this.carriles().includes(n)) { this.extra.push(n); this.pintar(); }
  };
  this.$("[data-g]").onclick = () => opc.alGuardar();
  this.$("[data-x]").onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(this.partitura(), null, 1)], { type: "application/json" }));
    a.download = "enjambres-partitura.json"; a.click();
  };
  const archivo = this.$("input[type=file]");
  this.$("[data-i]").onclick = () => archivo.click();
  archivo.onchange = async () => {
    const f = archivo.files[0]; if (!f) return;
    try { const p = JSON.parse(await f.text()); if (!Array.isArray(p.eventos)) throw 0; this.fijar(p); this.cambio(); this.estado("importada: " + f.name); }
    catch (e) { this.estado("ese archivo no es una partitura de Enjambres"); }
    archivo.value = "";
  };
  this.armarChipNuevo();
  this.lienzo.addEventListener("dblclick", e => {
    if (e.target.closest(".edEv")) return;
    const c = e.target.closest(".edCarril"); if (!c) return;
    this.crear(this.tiempoDe(e.clientX), c.dataset.para);
  });
  document.addEventListener("keydown", e => {
    if (!this.sel || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); this.borrar(this.sel); }
  });
  this.pintar();
}
const EP = EditorPartitura.prototype;
EP.estado = function (t) { this.$(".estadoG").textContent = t; };
EP.partitura = function () { return { v: 1, eventos: this.eventos.map(e => ({ id: e.id, t: e.t, dur: e.dur, para: e.para, texto: e.texto })) }; };
EP.fijar = function (p) { this.eventos = (p && p.eventos || []).map(e => Object.assign({}, e)); if (!this.eventos.find(e => e.id === this.sel)) this.sel = null; this.pintar(); };
EP.cambio = function () { this.opc.alCambiar(this.partitura()); };
EP.carriles = function () {
  const s = new Set([...(this.opc.carriles ? this.opc.carriles() : []), ...this.extra]);
  for (const e of this.eventos) if (e.para !== "todos") s.add(e.para);
  return ["todos", ...[...s].filter(n => n > 0).sort((a, b) => a - b)];
};
EP.duracion = function () { return Math.max(600, ...this.eventos.map(e => e.t + e.dur + 120)); };
EP.tiempoDe = function (clientX, libre) {
  const r = this.lienzo.getBoundingClientRect();
  const t = Math.max(0, (clientX - r.left) / this.pps);
  return libre ? Math.round(t * 10) / 10 : Math.round(t);
};
EP.carrilEn = function (clientY) {
  for (const c of this.lienzo.querySelectorAll(".edCarril")) { const r = c.getBoundingClientRect(); if (clientY >= r.top && clientY < r.bottom) return c; }
  return null;
};
EP.crear = function (t, para) {
  const e = { id: nuevoId(), t, dur: 10, para: para === "todos" ? "todos" : +para, texto: "" };
  this.eventos.push(e); this.sel = e.id; this.pintar(); this.cambio();
  const ta = this.detalle.querySelector("textarea"); if (ta) ta.focus();
};
EP.borrar = function (id) { this.eventos = this.eventos.filter(e => e.id !== id); if (this.sel === id) this.sel = null; this.pintar(); this.cambio(); };

EP.pintar = function () {
  const cars = this.carriles(), dur = this.duracion(), W = dur * this.pps;
  this.nombres.innerHTML = cars.map(c => c === "todos" ? `<div><i style="background:#e8b25a"></i>todos</div>`
    : `<div><i style="background:${this.opc.color(c)}"></i>laptop ${c}</div>`).join("");
  let regla = "", paso = this.pps >= 12 ? 10 : this.pps >= 4 ? 30 : 60;
  for (let s = 0; s <= dur; s += paso) regla += `<b style="left:${s * this.pps}px;height:${s % 60 ? 5 : 10}px"></b>` + (s % (paso * 2) === 0 || paso === 60 ? `<span style="left:${s * this.pps}px">${mmss(s * 1000)}</span>` : "");
  this.lienzo.style.width = W + "px";
  this.lienzo.innerHTML = `<div class="edRegla">${regla}</div>` +
    cars.map(c => `<div class="edCarril" data-para="${c}"></div>`).join("") + `<div class="edCabezal"></div>`;
  this.cabezal = this.lienzo.querySelector(".edCabezal");
  this.lienzo.querySelector(".edRegla").onclick = e => this.opc.alIr(this.tiempoDe(e.clientX, true) * 1000);
  for (const e of this.eventos) {
    const carril = this.lienzo.querySelector(`.edCarril[data-para="${e.para}"]`); if (!carril) continue;
    const b = document.createElement("div");
    b.className = "edEv" + (e.id === this.sel ? " sel" : "");
    b.style.left = e.t * this.pps + "px"; b.style.width = Math.max(8, e.dur * this.pps) + "px";
    b.style.background = e.para === "todos" ? "#e8b25a" : this.opc.color(e.para);
    b.textContent = e.texto || "(sin texto)"; b.title = `${mmss(e.t * 1000)} · ${e.dur} s · ${e.texto}`;
    const borde = document.createElement("div"); borde.className = "borde"; b.appendChild(borde);
    this.arrastrable(b, e, borde);
    carril.appendChild(b);
  }
  this.pintarDetalle();
  this.cabezalEn(this.ultimoMs || 0);
};

EP.arrastrable = function (b, e, borde) {
  b.addEventListener("pointerdown", ev => {
    ev.preventDefault(); ev.stopPropagation();
    const modo = ev.target === borde ? "dur" : "mover";
    const x0 = ev.clientX, t0 = e.t, d0 = e.dur, para0 = e.para;
    let movio = false;
    b.setPointerCapture(ev.pointerId);
    if (this.sel !== e.id) { this.sel = e.id; for (const x of this.lienzo.querySelectorAll(".edEv")) x.classList.toggle("sel", x === b); this.pintarDetalle(); }
    const mover = m => {
      const dt = (m.clientX - x0) / this.pps;
      if (Math.abs(m.clientX - x0) > 2) movio = true;
      const red = v => m.altKey ? Math.round(v * 10) / 10 : Math.round(v);
      if (modo === "dur") { e.dur = Math.max(1, red(d0 + dt)); b.style.width = Math.max(8, e.dur * this.pps) + "px"; }
      else {
        e.t = Math.max(0, red(t0 + dt)); b.style.left = e.t * this.pps + "px";
        const c = this.carrilEn(m.clientY);
        for (const x of this.lienzo.querySelectorAll(".edCarril")) x.classList.toggle("sobre", x === c);
        if (c) e.para = c.dataset.para === "todos" ? "todos" : +c.dataset.para;
      }
      b.title = `${mmss(e.t * 1000)} · ${e.dur} s`;
    };
    const soltar = () => {
      b.removeEventListener("pointermove", mover); b.removeEventListener("pointerup", soltar);
      if (movio || e.para !== para0) { this.pintar(); this.cambio(); }
    };
    b.addEventListener("pointermove", mover); b.addEventListener("pointerup", soltar);
  });
  b.addEventListener("dblclick", ev => { ev.stopPropagation(); const ta = this.detalle.querySelector("textarea"); if (ta) ta.focus(); });
};

/* "+ mensaje": se arrastra a un carril (drag and drop con el puntero) */
EP.armarChipNuevo = function () {
  const chip = this.$(".chipNuevo");
  chip.addEventListener("pointerdown", ev => {
    ev.preventDefault();
    const fantasma = document.createElement("div"); fantasma.className = "edFantasma"; fantasma.textContent = "+ mensaje";
    let movio = false;
    const mover = m => {
      if (Math.abs(m.clientX - ev.clientX) + Math.abs(m.clientY - ev.clientY) > 4 && !movio) { movio = true; document.body.appendChild(fantasma); }
      fantasma.style.left = m.clientX + 8 + "px"; fantasma.style.top = m.clientY + 8 + "px";
      const c = this.carrilEn(m.clientY), r = this.scroll.getBoundingClientRect();
      const dentro = m.clientX > r.left && m.clientX < r.right;
      for (const x of this.lienzo.querySelectorAll(".edCarril")) x.classList.toggle("sobre", dentro && x === c);
    };
    const soltar = m => {
      removeEventListener("pointermove", mover); removeEventListener("pointerup", soltar); fantasma.remove();
      for (const x of this.lienzo.querySelectorAll(".edCarril")) x.classList.remove("sobre");
      const r = this.scroll.getBoundingClientRect();
      if (!movio) return this.crear(Math.round((this.ultimoMs || 0) / 1000), "todos");
      const c = this.carrilEn(m.clientY);
      if (c && m.clientX > r.left && m.clientX < r.right) this.crear(this.tiempoDe(m.clientX), c.dataset.para);
    };
    addEventListener("pointermove", mover); addEventListener("pointerup", soltar);
  });
};

EP.pintarDetalle = function () {
  const e = this.eventos.find(x => x.id === this.sel);
  if (!e) { this.detalle.innerHTML = `<span style="color:#6f7b8a">Arrastra <b style="color:#e8b25a">+ mensaje</b> a un carril (o doble clic en un hueco). Arrastra un mensaje para moverlo; su borde derecho, para alargarlo. Supr lo borra.</span>`; return; }
  const cars = this.carriles();
  this.detalle.innerHTML = `
    <textarea placeholder="texto del mensaje (lo que verá en su consola)">${e.texto.replace(/</g, "&lt;")}</textarea>
    <label>desde</label><input data-k="t" value="${mmss(e.t * 1000)}" title="m:ss">
    <label>dura (s)</label><input data-k="dur" value="${e.dur}">
    <label>para</label><select>${cars.map(c => `<option value="${c}" ${String(c) === String(e.para) ? "selected" : ""}>${c === "todos" ? "todos" : "laptop " + c}</option>`).join("")}</select>
    <button class="borrar">borrar</button>`;
  const ta = this.detalle.querySelector("textarea");
  ta.oninput = () => { e.texto = ta.value; const b = this.lienzo.querySelector(".edEv.sel"); if (b) b.firstChild.nodeValue = e.texto || "(sin texto)"; this.cambio(); };
  for (const inp of this.detalle.querySelectorAll("input")) inp.onchange = () => {
    const v = inp.dataset.k === "t" ? leerTiempo(inp.value) : +inp.value;
    if (isFinite(v) && v >= 0) { e[inp.dataset.k] = inp.dataset.k === "dur" ? Math.max(1, v) : v; this.pintar(); this.cambio(); }
  };
  this.detalle.querySelector("select").onchange = ev => { e.para = ev.target.value === "todos" ? "todos" : +ev.target.value; this.pintar(); this.cambio(); };
  this.detalle.querySelector(".borrar").onclick = () => this.borrar(e.id);
  for (const x of this.detalle.querySelectorAll("textarea,input,select")) x.addEventListener("keydown", ev => ev.stopPropagation());
};

EP.cabezalEn = function (ms) {
  this.ultimoMs = ms;
  if (this.cabezal) this.cabezal.style.left = (ms / 1000) * this.pps + "px";
  this.$(".tiempo").textContent = mmss(ms);
};
/* llamado en cada cuadro: mueve el cabezal y, si corre, lo mantiene a la vista */
EP.reloj_ = function (estado, ms) {
  this.cabezalEn(ms);
  const x = (ms / 1000) * this.pps, s = this.scroll;
  if (estado === "corriendo" && (x < s.scrollLeft || x > s.scrollLeft + s.clientWidth - 40)) s.scrollLeft = Math.max(0, x - 60);
};

raiz.Enjambres = Object.assign(raiz.Enjambres || {}, { EditorPartitura });
})(typeof self !== "undefined" ? self : globalThis);
