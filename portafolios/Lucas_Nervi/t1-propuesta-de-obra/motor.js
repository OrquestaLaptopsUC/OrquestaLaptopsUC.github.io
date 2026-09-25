// motor.js — TALEA (título provisorio) — motor compartido
// Orquesta de Laptops UC · IEE2003 · T1: Propuesta de obra · Lucas Nervi
//
// Lógica pura (sin audio): filas diatónicas generadoras, operaciones seriales
// P/R/I/RI, colecciones diatónicas móviles y combinación isorrítmica (color x talea).
// La usan por igual estacion.html (ejecución en vivo, Web Audio) y render.js
// (render offline a WAV), para que el render suene exactamente lo que este
// motor genera.

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

  // ---------- colecciones diatónicas móviles ----------
  // k = pasos en el círculo de quintas respecto de Do mayor (k=0).
  // tónica (clase de altura) = (7*k) mod 12. Escala mayor sobre esa tónica.
  const INTERVALOS_MAYOR = [0, 2, 4, 5, 7, 9, 11];
  const NOMBRES_COLECCION = {
    "-2": "Sib mayor / Sol menor (2b)",
    "-1": "Fa mayor / Re menor (1b)",
    "0": "Do mayor / La menor (natural)",
    "1": "Sol mayor / Mi menor (1#)",
    "2": "Re mayor / Si menor (2#)",
  };

  function tonicaPC(k) {
    return (((7 * k) % 12) + 12) % 12;
  }

  function gradoAPC(grado, k) {
    const tonica = tonicaPC(k);
    return (tonica + INTERVALOS_MAYOR[grado - 1]) % 12;
  }

  // octava 4 = la que contiene el Do central (C4 = MIDI 60)
  function gradoAFrecuencia(grado, k, octava) {
    const pc = gradoAPC(grado, k);
    const midi = 12 * (octava + 1) + pc;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // ---------- nombre de nota (para la partitura visual) ----------
  // Deriva letra + alteración de un grado en una colección, para poder
  // dibujarlo en un pentagrama: el alfabeto musical (C D E F G A B) siempre
  // se recorre en orden a partir de la tónica, sea cual sea su alteración.
  const LETRAS = ["C", "D", "E", "F", "G", "A", "B"];
  const LETRA_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const TONICA_LETRA = { "-2": "B", "-1": "F", "0": "C", "1": "G", "2": "D" };

  function letraYAlteracion(grado, k) {
    const tonica = TONICA_LETRA[String(k)];
    const ti = LETRAS.indexOf(tonica);
    const letra = LETRAS[(ti + grado - 1 + 7) % 7];
    const pcReal = gradoAPC(grado, k);
    let dif = pcReal - LETRA_PC[letra];
    if (dif > 6) dif -= 12;
    if (dif < -6) dif += 12;
    return { letra, alteracion: dif };
  }

  // posición diatónica relativa a E4 (línea inferior del pentagrama en clave
  // de sol) — cada paso vale un espacio o línea, sin importar semitonos.
  function posDiatonica(letra, octava) {
    const li = LETRAS.indexOf(letra);
    return octava * 7 + li - (4 * 7 + 2);
  }

  // ---------- talea (células rítmicas, en corcheas) ----------
  // El arco formal de la obra: células largas al comienzo, cortas al medio,
  // convergencia final de todas las voces en 4-3-4 (11 corcheas).
  const TALEAS = {
    larga: [
      [3, 3, 4, 2, 4], // 16 corcheas
      [3, 3, 4, 4], // 14 corcheas
      [3, 3, 2, 2], // 10 corcheas
    ],
    corta: [
      [3, 3, 2], // 8 corcheas
      [2, 3], // 5 corcheas
      [2, 2, 3], // 7 corcheas
    ],
    convergencia: [
      [4, 3, 4], // 11 corcheas — célula final compartida por todas las voces
    ],
  };

  function duracionTalea(celula) {
    return celula.reduce((a, b) => a + b, 0);
  }

  // Genera n eventos isorrítmicos ciclando la fila (color, largo 7) contra la
  // célula rítmica (talea, largo variable) de forma independiente: cada una
  // avanza a su propio paso y solo vuelven a coincidir en la combinación de
  // origen cada mcm(7, talea.length) eventos. Es el mecanismo isorrítmico
  // (color x talea) de la Parte 1, aplicado a una melodía en vez de a acordes.
  function generarEventos(row, celula, n) {
    const eventos = [];
    let ic = 0,
      it = 0;
    for (let e = 0; e < n; e++) {
      eventos.push({
        grado: row[ic],
        duracionCorcheas: celula[it],
        indiceColor: ic,
        indiceTalea: it,
      });
      ic = (ic + 1) % row.length;
      it = (it + 1) % celula.length;
    }
    return eventos;
  }

  return {
    filaGeneradora,
    retrogradacion,
    inversion,
    retrogradacionInversion,
    leer,
    tonicaPC,
    gradoAPC,
    gradoAFrecuencia,
    letraYAlteracion,
    posDiatonica,
    TALEAS,
    NOMBRES_COLECCION,
    duracionTalea,
    generarEventos,
    INTERVALOS_MAYOR,
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = OLUC_TALEA;
