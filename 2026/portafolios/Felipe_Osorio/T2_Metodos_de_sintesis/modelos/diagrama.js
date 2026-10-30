/* Dibuja un diagrama de flujo de señal en SVG a partir de una descripción simple.
   cajas: {id, x, y, w?, h?, t: [líneas], tipo?: "fuente" | "clave" | "control" | "salida"}
   flechas: {p: [punto, ...], guion?: true, rotulo?: {x, y, t}}; un punto es [x, y] o "id.l|r|t|b" (centro del lado).
   Los colores salen de las variables CSS de la página, así que sirve en modo claro y oscuro. */
function diagrama(el, { w, h, titulo, cajas, flechas, rotulos = [] }) {
  const W = 126, H = 46, porId = {};
  for (const c of cajas) { c.w = c.w || W; c.h = c.h || H; porId[c.id] = c; }
  const punto = q => {
    if (Array.isArray(q)) return q;
    const [id, lado] = q.split("."), c = porId[id];
    return { l: [c.x, c.y + c.h / 2], r: [c.x + c.w, c.y + c.h / 2], t: [c.x + c.w / 2, c.y], b: [c.x + c.w / 2, c.y + c.h] }[lado];
  };
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const estilo = {
    fuente: "fill:var(--fuente);stroke:var(--borde-fuerte)",
    clave: "fill:var(--clave);stroke:var(--acento);stroke-width:2",
    control: "fill:var(--panel);stroke:var(--tenue);stroke-dasharray:4 3",
    salida: "fill:var(--panel);stroke:var(--texto);stroke-width:1.6",
    normal: "fill:var(--panel);stroke:var(--borde-fuerte)",
  };
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(titulo)}" style="width:100%;height:auto;display:block;font-family:system-ui,sans-serif">
  <defs><marker id="fl-${el.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
  <path d="M0 0L10 5L0 10z" style="fill:var(--tenue)"/></marker></defs>`;
  for (const f of flechas) {
    const pts = f.p.map(punto).map(([x, y]) => `${x},${y}`).join(" ");
    s += `<polyline points="${pts}" style="fill:none;stroke:var(--tenue);stroke-width:1.4${f.guion ? ";stroke-dasharray:5 4" : ""}" marker-end="url(#fl-${el.id})"/>`;
    if (f.rotulo) s += `<text x="${f.rotulo.x}" y="${f.rotulo.y}" style="fill:var(--tenue);font-size:11.5px" text-anchor="${f.rotulo.anchor || "start"}">${esc(f.rotulo.t)}</text>`;
  }
  for (const c of cajas) {
    s += `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="8" style="${estilo[c.tipo || "normal"]}"/>`;
    const n = c.t.length, y0 = c.y + c.h / 2 - (n - 1) * 8 + 4.5;
    c.t.forEach((linea, i) => {
      s += `<text x="${c.x + c.w / 2}" y="${y0 + i * 16}" text-anchor="middle" style="fill:var(--texto);font-size:${i === 0 ? 13 : 11.5}px;${i === 0 ? "font-weight:600" : ""}">${esc(linea)}</text>`;
    });
  }
  for (const r of rotulos) s += `<text x="${r.x}" y="${r.y}" text-anchor="${r.anchor || "start"}" style="fill:var(--tenue);font-size:11.5px;${r.negrita ? "font-weight:600" : ""}">${esc(r.t)}</text>`;
  el.innerHTML = s + "</svg>";
}
