// motor.js — TALEA (título provisorio) — motor compartido
// Orquesta de Laptops UC · IEE2003 · T1: Propuesta de obra · Lucas Nervi
//
// Lógica pura (sin audio): filas diatónicas generadoras, operaciones seriales
// P/R/I/RI, un conjunto de alteraciones editable nota a nota (lo controla el
// director) y la combinación isorrítmica (color x talea). La usan por igual
// estacion.html (ejecución en vivo, Web Audio), director.html (el brazalete
// de alteraciones) y render.js (render offline a WAV).

const OLUC_TALEA = (function () {

  // ---------- filas generadoras (el "color") ----------
  // Fila k (k = 1..6): row[i] = (i*k mod 7) + 1, i = 0..6
  // Es el análogo diatónico de una fila de doce tonos generada por un solo
  // intervalo (p. ej. una fila de cuartas). k=1: por grado conjunto. k=2: por
  // terceras. k=3: por cuartas. k=4..6 son las mismas trayectorias en sentido
  // contrario (k y 7-k son recíprocas bajo inversión, ver más abajo).
  function filaGeneradora(k) {
    const row = [];
    for (let i = 0; i < 7; i++) row.push(((i * k) % 7) + 1);
    return row;
  }

  function retrogradacion(row) {
    return row.slice().reverse();
  }

  // Inversión: se fija la primera nota de la fila como eje y se refleja el
  // resto. Con grados 0-indexados: inv(d) = (2*eje - d) mod 7.
  function inversion(row) {
    const eje = row[0] - 1;
    return row.map((g) => {
      const d = g - 1;
      const inv = (((2 * eje - d) % 7) + 7) % 7;
      return inv + 1;
    });
  }

  function retrogradacionInversion(row) {
    return retrogradacion(inversion(row));
  }

  function leer(row, modo) {
    if (modo === "P") return row;
    if (modo === "R") return retrogradacion(row);
    if (modo === "I") return inversion(row);
    if (modo === "RI") return retrogradacionInversion(row);
    throw new Error("modo desconocido: " + modo);
  }

  // ---------- alteraciones (el conjunto de notas disponible) ----------
  // El director controla, nota a nota, si C D E F G A B suenan naturales,
  // sostenidas o bemoles. No hay "tónica": el grado i siempre es la nota
  // natural i-ésima (1=C, 2=D, ... 7=B), alterada según este objeto.
  // { C:0, D:0, E:0, F:0, G:0, A:0, B:0 } — valores en {-1, 0, 1}.
  const LETRAS = ["C", "D", "E", "F", "G", "A", "B"];
  const LETRA_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  function alteracionesPorDefecto() {
    return { C: 0, D: 0, E: 0, F: 0, G: 0, A: 0, B: 0 };
  }

  function gradoALetra(grado) {
    return LETRAS[(grado - 1 + 700) % 7];
  }

  function gradoALetraYAlteracion(grado, alteraciones) {
    const letra = gradoALetra(grado);
    return { letra, alteracion: alteraciones[letra] || 0 };
  }

  function gradoAPC(grado, alteraciones) {
    const letra = gradoALetra(grado);
    const alt = alteraciones[letra] || 0;
    return ((LETRA_PC[letra] + alt) % 12 + 12) % 12;
  }

  function notaAFrecuencia(letra, alteracion, octava) {
    const midi = 12 * (octava + 1) + LETRA_PC[letra] + alteracion;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function gradoAFrecuencia(grado, alteraciones, octava) {
    const { letra, alteracion } = gradoALetraYAlteracion(grado, alteraciones);
    return notaAFrecuencia(letra, alteracion, octava);
  }

  // posición diatónica relativa a E4 (línea inferior del pentagrama en clave
  // de sol) — cada paso vale un espacio o línea, sin importar semitonos.
  function posDiatonica(letra, octava) {
    const li = LETRAS.indexOf(letra);
    return octava * 7 + li - (4 * 7 + 2);
  }

  // nota cromática a `semitonos` de la raíz dada por `grado` (dentro de las
  // alteraciones activas), deletreada `letraOffset` letras musicales por
  // encima de la letra de esa raíz (0=unísono, 2=3a, 6=7a...). Permite notas
  // fuera del conjunto de 7 que definió el director.
  function notaCromaticaDesdeGrado(grado, alteraciones, letraOffset, semitonos) {
    const raizIdx = (grado - 1 + 700) % 7;
    const letra = LETRAS[(raizIdx + letraOffset + 700) % 7];
    const raizPC = gradoAPC(grado, alteraciones);
    const pcObjetivo = ((raizPC + semitonos) % 12 + 12) % 12;
    let dif = pcObjetivo - LETRA_PC[letra];
    if (dif > 6) dif -= 12;
    if (dif < -6) dif += 12;
    return { letra, alteracion: dif };
  }

  // "Master Chord" de Slonimsky: acorde dominante 7 sin quinta (fundamental,
  // 3a mayor, 7a menor) — Thesaurus of Scales and Melodic Patterns (1947),
  // donde Slonimsky tabula un Master Chord para armonizar cada grado de una
  // escala. Aquí: uno por cada uno de los 7 grados, sobre las alteraciones
  // activas en ese momento (las define el director).
  function masterChordSobreGrado(grado, alteraciones) {
    return [
      notaCromaticaDesdeGrado(grado, alteraciones, 0, 0),
      notaCromaticaDesdeGrado(grado, alteraciones, 2, 4),
      notaCromaticaDesdeGrado(grado, alteraciones, 6, 10),
    ];
  }

  // ---------- talea (ritmo, en corcheas) ----------
  // Lo más simple posible: un solo pulso parejo por sección, igual para
  // TODAS las voces (nadie elige ni varía su propio ritmo). El arco formal
  // de la obra queda en la velocidad del pulso, no en patrones distintos:
  // golpes lentos al comienzo, el doble de rápido al medio, golpes lentos
  // de nuevo al converger — todo el ensamble pega junto, cada quien en su
  // propia nota (ver eventosTruncados).
  const TALEAS = {
    larga: [4, 4, 4, 4], // sección A: un golpe cada negra (lento)
    corta: [2, 2, 2, 2, 2, 2], // sección B: un golpe cada corchea doble (el doble de rápido)
    convergencia: [4, 4, 4], // C y Evaporación: todas las voces vuelven al pulso lento, juntas
  };

  function duracionTalea(celula) {
    return celula.reduce((a, b) => a + b, 0);
  }

  // Trunca la fila (color) al largo de la célula (talea): evento i toma la
  // nota i de la fila (ciclando si la célula tuviera más de 7 eventos) junto
  // a la duración i de la célula. Sin cómputo independiente de color y
  // talea: el patrón resultante es fijo y se repite completo cada vez que
  // se recorre la célula — por ejemplo, para la célula [3,3,4,4] sobre la
  // fila natural da C(3) D(3) E(4) F(4), siempre las mismas cuatro notas.
  function eventosTruncados(row, celula) {
    return celula.map((duracionCorcheas, i) => ({
      grado: row[i % row.length],
      duracionCorcheas,
      indice: i,
    }));
  }

  return {
    filaGeneradora,
    retrogradacion,
    inversion,
    retrogradacionInversion,
    leer,
    LETRAS,
    alteracionesPorDefecto,
    gradoALetra,
    gradoALetraYAlteracion,
    gradoAPC,
    gradoAFrecuencia,
    notaAFrecuencia,
    notaCromaticaDesdeGrado,
    masterChordSobreGrado,
    posDiatonica,
    TALEAS,
    duracionTalea,
    eventosTruncados,
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = OLUC_TALEA;
