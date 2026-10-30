/* Comportamiento del blog sin conexión: modo claro/oscuro, menú en pantallas chicas, búsqueda, copiar código y
   resaltado del índice. No usa nada externo. */
(function () {
  const raiz = window.RAIZ || "";
  const raizDoc = document.documentElement;

  // ---------- modo claro / oscuro (se recuerda en este navegador si se puede)
  const sistemaOscuro = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.getElementById("modo").addEventListener("click", () => {
    const actual = raizDoc.dataset.mode || (sistemaOscuro() ? "dark" : "light");
    const nuevo = actual === "dark" ? "light" : "dark";
    raizDoc.dataset.mode = nuevo;
    try { localStorage.setItem("modo", nuevo); } catch (e) {}
  });

  // ---------- menú lateral en pantallas chicas
  document.getElementById("abrir-menu").addEventListener("click", () => document.body.classList.add("menu-abierto"));
  document.getElementById("mascara").addEventListener("click", () => document.body.classList.remove("menu-abierto"));

  // ---------- copiar código
  document.querySelectorAll(".code-block .copiar").forEach(b => b.addEventListener("click", () => {
    const texto = b.closest(".code-block").querySelector("pre").innerText;
    const listo = () => { b.textContent = "Copiado"; setTimeout(() => (b.textContent = "Copiar"), 1500); };
    const respaldo = () => {
      const t = document.createElement("textarea"); t.value = texto; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); listo(); } catch (e) {} t.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(listo, respaldo); else respaldo();
  }));

  // ---------- índice de la entrada: resalta la sección visible
  const enlacesToc = [...document.querySelectorAll(".toc a")];
  if (enlacesToc.length && "IntersectionObserver" in window) {
    const porId = new Map(enlacesToc.map(a => [decodeURIComponent(a.getAttribute("href").slice(1)), a]));
    const visibles = new Set();
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(e => (e.isIntersecting ? visibles.add(e.target.id) : visibles.delete(e.target.id)));
      const titulos = [...porId.keys()].map(id => document.getElementById(id)).filter(Boolean);
      let actual = titulos.find(h => visibles.has(h.id));
      if (!actual) actual = titulos.filter(h => h.getBoundingClientRect().top < 120).pop();
      enlacesToc.forEach(a => a.classList.remove("activo"));
      if (actual) porId.get(actual.id).classList.add("activo");
    }, { rootMargin: "-70px 0px -60% 0px" });
    porId.forEach((_, id) => { const h = document.getElementById(id); if (h) obs.observe(h); });
  }

  // ---------- búsqueda en el contenido de todas las entradas (índice local en busqueda.js)
  const entrada = document.getElementById("buscar"), caja = document.getElementById("resultados"),
        contenido = document.getElementById("contenido");
  const sinTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function buscar() {
    const q = sinTildes(entrada.value.trim());
    if (!q) { caja.hidden = true; contenido.hidden = false; return; }
    const palabras = q.split(/\s+/);
    const res = (window.INDICE_BUSQUEDA || []).map(p => {
      const campos = sinTildes([p.t, p.c.join(" "), p.e.join(" "), p.x].join(" "));
      if (!palabras.every(w => campos.includes(w))) return null;
      const puntaje = palabras.reduce((s, w) => s + (sinTildes(p.t).includes(w) ? 5 : 0) + (sinTildes(p.e.join(" ")).includes(w) ? 2 : 0), 0);
      const plano = sinTildes(p.x), k = plano.indexOf(palabras[0]);
      let frag = k >= 0 ? p.x.slice(Math.max(0, k - 60), k + 140) : p.x.slice(0, 180);
      frag = esc(frag);
      return { p, puntaje, frag };
    }).filter(Boolean).sort((a, b) => b.puntaje - a.puntaje);
    caja.innerHTML = res.length
      ? res.map(r => `<a class="res" href="${raiz}${r.p.u}"><strong>${esc(r.p.t)}</strong><small>${r.p.f} · ${esc(r.p.c.join(", "))}</small><div>…${r.frag}…</div></a>`).join("")
      : `<p class="vacio">No hay resultados para «${esc(entrada.value.trim())}».</p>`;
    caja.hidden = false; contenido.hidden = true;
  }
  entrada.addEventListener("input", buscar);
  entrada.addEventListener("keydown", e => { if (e.key === "Escape") { entrada.value = ""; buscar(); } });
})();
