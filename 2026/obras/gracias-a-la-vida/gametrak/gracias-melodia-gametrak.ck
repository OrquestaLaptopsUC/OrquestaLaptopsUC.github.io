// =============================================================================
// gracias-melodia-gametrak.ck
//
// "Gracias a la vida" (Violeta Parra), versión Orquesta de Laptops UC
// Parte de MELODÍA, tocada en vivo con un Gametrak.
//
//   Mano A (cordel A)  eje vertical: cada cambio de dirección avanza una nota.
//                      extensión a fondo: salta al siguiente comienzo de frase.
//   Mano B (cordel B)  extensión: soplo (presión del chorro y amplitud).
//                      eje horizontal: largo de la cola de reverberación.
//   Pedal MIDI (2 interruptores): índice -1 / +1, en silencio.
//
// Antes del primer ensayo:
//   1. Correr gametrak-monitor.ck y fijar DISPOSITIVO_GAMETRAK, EJE_* y RANGO_*.
//   2. Correr midi-monitor.ck y fijar PEDAL_*.
//   Mientras los EJE_* sigan en -1 este archivo no arranca (lo avisa en consola).
//
// En miniAudicle: Start Virtual Machine (⌘.), abrir este archivo, Add Shred (⌘,).
// Para iterar: Replace Shred (⌘=). Consola: Window > Console Monitor (⌘2).
// Para volver al principio o saltar a un índice sin detener nada:
//   gracias-melodia-control.ck (Add Shred).
// =============================================================================


// =============================================================================
// 1. PARÁMETROS AJUSTABLES
// =============================================================================

// ---------------------------------------------------------------------------
// 1.1 Detección de cambios de dirección (mano A)
// ---------------------------------------------------------------------------

// UMBRAL DE RECORRIDO, en unidades normalizadas del eje vertical (0 a 1).
// Un cambio de dirección solo cuenta como nota si la mano recorrió al menos
// esta distancia desde la posición del último disparo aceptado.
//
//   Más alto: rechaza limpio el temblor y los rebotes, pero obliga a gestos
//             más amplios y baja la velocidad máxima de ejecución.
//   Más bajo: permite tocar más rápido, pero aparecen disparos espurios
//             (dos notas donde se quería una).
//
// Punto de partida: unos 4 a 5 cm de recorrido del cordel. Con la base del
// Gametrak en el suelo, subir y bajar la mano cambia sobre todo la EXTENSIÓN
// del cordel (en este Gametrak, el eje 2). Estimación: el rango calibrado
// (+1.000 recogido a -0.325 con la mano arriba) son unos 2 m de cordel, o sea
// ~0.005 del rango por cm, y 4 a 5 cm dan ~0.025. Medirlo de verdad: poner
// MOSTRAR_EJES en 1, mover la mano 4 a 5 cm en la posición de juego y leer
// cuánto cambia "A.vert".
//
// Regla práctica (verificada con gestos simulados): un trazo más largo que
// 2 x UMBRAL puede dar DOS notas si el temblor es grande y el gesto lento,
// porque el temblor produce cambios de signo a mitad de camino. Con temblor
// normal (~1 mm) no pasa; con ~6 mm y trazos de 2 s, sí. Si en ensayo
// aparecen notas dobles en gestos lentos y largos: subir el umbral hasta algo
// más de la mitad del trazo típico, o hacer trazos más cortos.
0.025 => float UMBRAL_RECORRIDO;

// Coeficiente del suavizado exponencial del eje vertical (0 < ALFA <= 1).
// y = y_anterior + ALFA * (x - y_anterior), una vez por TASA_CONTROL.
// Más bajo: más suave, pero el giro se detecta con más retardo.
// Con TASA_CONTROL = 5 ms: ALFA 0.2 da unos 22 ms de constante de tiempo,
// 0.3 unos 14 ms, 0.4 unos 10 ms (se imprime al arrancar). Ese retardo se
// suma a la latencia del gesto; el temblor (8 a 12 Hz) casi no lo quita un
// filtro de primer orden: de eso se encarga el umbral de recorrido.
0.3 => float ALFA;

// Periodo del bucle de control (lectura de ejes, detector, soplo, cola).
// ALFA está pensado para este periodo: si se cambia, reajustar ALFA.
5::ms => dur TASA_CONTROL;

// ---------------------------------------------------------------------------
// 1.2 Síntesis (BlowBotl) y reverberación
// ---------------------------------------------------------------------------

// Tiempo de portamento entre alturas (0::ms = salto directo).
40::ms => dur PORTAMENTO;

// Ruido en el chorro, escala de ChucK 0 a 1 (STK lo multiplica por 30).
// El valor por defecto de STK es 0.67, muy soplado. Aquí se parte bajo.
0.15 => float RUIDO_CHORRO;

// Transposición de toda la melodía, en semitonos (12 = una octava arriba).
0 => int TRANSPORTE;

// Cola de reverberación: tiempo de decaimiento (T60, en segundos) en los dos
// extremos del eje horizontal de la mano B. El recorrido es exponencial.
2.0 => float COLA_T60_MIN;
14.0 => float COLA_T60_MAX;
// Proporción de señal reverberada (0 = seca, 1 = solo cola).
0.35 => float COLA_MEZCLA;
// Amortiguación de agudos dentro de la cola (0 = nada, 0.5 = mucha).
0.2 => float COLA_AMORTIGUACION;
// 1 = cola estéreo (izquierda en los canales pares, derecha en los impares).
// 0 = la misma cola en todos los canales. Usar 0 si algo SUMA los canales
// (un parlante mono, un cable en Y): con un tono sostenido, las dos colas
// pueden quedar casi en contrafase según la altura exacta (medido en prueba:
// correlación -0.93 en un mi5) y al sumarse la cola se cancela.
1 => int COLA_ESTEREO;

// Volumen general de salida (antes del limitador de protección).
0.8 => float GANANCIA_SALIDA;

// ---------------------------------------------------------------------------
// 1.3 Soplo (mano B, extensión)
// ---------------------------------------------------------------------------
// La extensión del cordel B, normalizada a 0..1, maneja dos cosas a la vez:
//   - la PRESIÓN del chorro dentro del modelo (timbre: de soplo a tono), y
//   - la AMPLITUD de salida (la dinámica).
// Hace falta separar las dos porque la botella de BlowBotl, medida, tiene un
// umbral: por debajo de una presión de ~0.9 solo da soplo afinado (ruido
// filtrado por el resonador); al cruzarlo "habla" y salta unos 20 dB; ya
// hablando, subir la presión solo agrega unos 6 dB. Con la presión sola no
// habría pianissimo con tono. Además tiene histéresis: una vez que habla, se
// sostiene hasta ~0.65. Es el comportamiento de un soplo real.

// Por debajo de esta extensión no hay soplo: silencio total aunque la mano A
// dispare (sirve para ensayar el gesto en silencio y para dejar frases mudas).
0.05 => float SOPLO_ZONA_MUERTA;
// Presión del chorro al salir de la zona muerta y con el cordel a fondo.
0.75 => float PRESION_MIN;
1.35 => float PRESION_MAX;
// Curva de amplitud: 1 = lineal, 2 = cuadrática (más control en el piano).
2.0 => float CURVA_AMPLITUD;

// Notas repetidas: como no hay noteOn, dos notas iguales seguidas no se
// oirían separadas (la altura no cambia). Con esto activado, una nota
// repetida produce un "respiro": la amplitud baja y vuelve, sin tocar la
// presión del chorro (así la botella no se corta ni vuelve a atacar).
// La melodía de esta obra tiene muchas notas repetidas ("e e e e f b").
1 => int REARTICULAR_REPETIDAS;
0.5 => float RESPIRO_PROFUNDIDAD;   // 0.5 = la amplitud baja a la mitad (-6 dB)
80::ms => dur RESPIRO_DURACION;

// ---------------------------------------------------------------------------
// 1.4 Gametrak: dispositivo, números de eje y rangos
// ---------------------------------------------------------------------------
// TODO lo de esta sección sale de gametrak-monitor.ck. No adivinar.
// -1 = sin asignar (el programa no arranca hasta que se asignen los cuatro).

0 => int DISPOSITIVO_GAMETRAK;     // número de joystick que lista el monitor

// Calibrado con gametrak-monitor.ck el 11-sep-2026 (joystick 0, base en el
// suelo). Cordel A = ejes 0, 1, 2; cordel B = ejes 3, 4, 5.
// Con la base en el suelo, "arriba/abajo" de la mano A ES la extensión del
// cordel A: por eso EJE_A_VERTICAL y EJE_A_EXTENSION son el mismo eje, y el
// ancla es subir la mano A hasta arriba del todo.
// EJE_B_EXTENSION = 5 sale por simetría con el 2 (mismo reposo, +0.987, y
// mismo rango); confirmarlo con MOSTRAR_EJES: "B.ext" debe subir al estirar B.
2 => int EJE_A_VERTICAL;           // cordel A, subir/bajar la mano
2 => int EJE_A_EXTENSION;          // cordel A, largo del cordel (el mismo)
5 => int EJE_B_EXTENSION;          // cordel B, largo del cordel
3 => int EJE_B_HORIZONTAL;         // cordel B, izquierda/derecha

// Rangos: [valor crudo que vale 0, valor crudo que vale 1], en las unidades
// que imprime el monitor (ChucK entrega -1..1). Si el eje va al revés, basta
// con dar vuelta los dos números.
[1.0, -0.325] @=> float RANGO_A_VERTICAL[];   // 0 = abajo,     1 = arriba
[1.0, -0.325] @=> float RANGO_A_EXTENSION[];  // 0 = recogido,  1 = a fondo
[1.0, -0.355] @=> float RANGO_B_EXTENSION[];  // 0 = recogido,  1 = a fondo
[-0.985, 1.0] @=> float RANGO_B_HORIZONTAL[]; // 0 = cola corta, 1 = cola larga

// Ancla de frase: cordel A extendido MUY por encima del rango de juego.
// Dispara al pasar UMBRAL_ANCLA; se rearma al volver bajo UMBRAL_ANCLA_REARME.
// Mientras el cordel A está sobre el umbral, el detector de giros no cuenta.
0.90 => float UMBRAL_ANCLA;
0.75 => float UMBRAL_ANCLA_REARME;

// 1 = imprimir cada 250 ms los cuatro ejes ya normalizados (para medir el
// umbral de recorrido y los rangos). 0 en concierto.
1 => int MOSTRAR_EJES;

// ---------------------------------------------------------------------------
// 1.5 Pedal MIDI de dos interruptores
// ---------------------------------------------------------------------------
// TODO lo de esta sección sale de midi-monitor.ck. No adivinar.
// Con PEDAL_NUM_MENOS o PEDAL_NUM_MAS en -1 el programa corre sin pedal.

0 => int PEDAL_PUERTO;             // número de puerto MIDI que lista el monitor
0xB0 => int PEDAL_TIPO;            // 0x90 note-on, 0xB0 control change, 0xC0 program change
0 => int PEDAL_CANAL;              // 1 a 16; 0 = cualquier canal
-1 => int PEDAL_NUM_MENOS;         // número de nota / CC / programa del interruptor 1 (índice -1)
-1 => int PEDAL_NUM_MAS;           // número de nota / CC / programa del interruptor 2 (índice +1)
// Valor mínimo que cuenta como "pisar". 1 ignora los note-on con velocidad 0
// y los CC en 0 (el soltar). Si el pedal es de tipo alternado (manda 127 una
// vez y 0 la siguiente), poner 0 para que cada pisada cuente.
1 => int PEDAL_VALOR_MINIMO;
120::ms => dur PEDAL_ANTIRREBOTE;

// ---------------------------------------------------------------------------
// 1.6 Melodía y puntos de anclaje
// ---------------------------------------------------------------------------
// Números de nota MIDI, uno por paso. SIN duraciones: el ritmo lo pone la mano.
//
// Fuente: voz S de "Gracias a la Vida.txt" (carpeta del curso, 29-ago-2026),
// en la menor, tal como está escrita allí. Octava: g, a, b en la octava 4 y
// c, d, e, f en la 5 (la línea queda entre sol4 y fa5).
// Ese archivo llega hasta "su fondo estrellado"; lo que sigue de la estrofa
// y las estrofas siguientes se agregan aquí, al final del arreglo.
//
//   referencia:  G4 67  A4 69  B4 71  C5 72  D5 74  E5 76  F5 77
[
    76, 76, 76, 76, 77, 71,     //  0  e e e e f b
    74, 74, 74, 74, 76, 69,     //  6  d d d d e a
    72, 72, 72, 72, 72, 67,     // 12  c c c c c g
    76, 76, 76, 76, 76, 72,     // 18  e e e e e c
    76, 76, 76, 76, 76, 74,     // 24  e e e e e d
    74, 74, 74, 74, 74, 72,     // 30  d d d d d c
    72, 72, 72, 72, 72, 67,     // 36  c c c c c g
    71, 72, 74, 76, 77, 76      // 42  b c d e f e
] @=> int MELODIA[];

// Índices (del arreglo de arriba) donde empieza una frase. El ancla salta al
// primero que sea mayor o igual al índice actual. Por ahora, uno por cada
// grupo entre barras del archivo fuente. Deben ir en orden creciente.
[0, 6, 12, 18, 24, 30, 36, 42] @=> int ANCLAS[];

// Al llegar al final: 1 = volver al principio, 0 = detenerse (los giros ya no
// cambian la altura; el pedal -1 o el control permiten volver).
0 => int FINAL_REINICIA;


// =============================================================================
// 2. CANAL DE CONTROL EXTERNO (gracias-melodia-control.ck)
// =============================================================================
// Variables globales de la VM: otro shred las escribe y avisa con el evento.
global Event gm_ir;
global int gm_irA;


// =============================================================================
// 3. REVERBERACIÓN CON T60 VARIABLE
// =============================================================================
// JCRev y NRev de ChucK tienen el T60 fijo en 4 segundos y solo exponen .mix,
// así que no se puede rutear su decaimiento a un eje. Esta clase es la misma
// topología de JCRev (Chowning/Schroeder, la de STK: 3 pasatodo en serie, 4
// peines en paralelo, 2 retardos de salida para el estéreo) con las mismas
// longitudes, pero con la ganancia de los peines calculada desde el T60 y un
// pasabajos en cada lazo (amortiguación).
class Cola
{
    Gain entrada;
    Gain salida[2];                  // señal húmeda, izquierda y derecha

    Gain apV[3]; Delay apD[3]; Gain apFb[3]; Gain apFf[3]; Gain apSal[3];
    Gain pcV[4]; Delay pcD[4]; OnePole pcLp[4]; Gain pcFb[4];
    Gain suma;
    Delay salD[2];
    int largos[9];
    float sr;

    fun int esPrimo(int n)
    {
        if (n < 2) return 0;
        for (2 => int d; d * d <= n; d++) if (n % d == 0) return 0;
        return 1;
    }

    fun void init(float amortiguacion)
    {
        (second / samp) => sr;
        [1777, 1847, 1993, 2137, 389, 127, 43, 211, 179] @=> int base[];
        sr / 44100.0 => float escala;
        for (0 => int i; i < 9; i++)
        {
            Math.floor(escala * base[i]) $ int => int d;
            if (escala == 1.0) base[i] => d;
            else
            {
                if (d % 2 == 0) d++;
                while (!esPrimo(d)) 2 +=> d;
            }
            d => largos[i];
        }

        // pasatodo: v = x + g*v[n-D];  y = -g*v + v[n-D]
        // (el lazo de realimentación de ChucK agrega 1 muestra: retardo D-1)
        entrada => apV[0];
        for (0 => int i; i < 3; i++)
        {
            apV[i] => apD[i] => apFb[i] => apV[i];
            apV[i] => apFf[i] => apSal[i];
            apD[i] => apSal[i];
            (largos[i + 4] + 1)::samp => apD[i].max;
            (largos[i + 4] - 1)::samp => apD[i].delay;
            0.7 => apFb[i].gain;
            -0.7 => apFf[i].gain;
            if (i < 2) apSal[i] => apV[i + 1];
        }

        // peines: c = x + g*pasabajos(c[n-D])
        for (0 => int k; k < 4; k++)
        {
            apSal[2] => pcV[k] => pcD[k] => pcLp[k] => pcFb[k] => pcV[k];
            pcV[k] => suma;
            (largos[k] + 1)::samp => pcD[k].max;
            (largos[k] - 1)::samp => pcD[k].delay;
            amortiguacion => pcLp[k].pole;
        }
        0.25 => suma.gain;

        // estéreo: la misma suma con dos retardos distintos
        for (0 => int c; c < 2; c++)
        {
            suma => salD[c] => salida[c];
            (largos[7 + c] + 1)::samp => salD[c].max;
            largos[7 + c]::samp => salD[c].delay;
        }
        t60(4.0);
    }

    // Tiempo de decaimiento a -60 dB (en graves: la amortiguación acorta los
    // agudos). Un peine de largo L decae 60 dB en T60 si g = 10^(-3 L / (T60 sr)).
    fun void t60(float segundos)
    {
        if (segundos < 0.1) 0.1 => segundos;
        for (0 => int k; k < 4; k++)
            Math.pow(10.0, -3.0 * largos[k] / (segundos * sr)) => pcFb[k].gain;
    }
}


// =============================================================================
// 4. CADENA DE AUDIO
// =============================================================================
//   BlowBotl -> VCA (amplitud de la mano B) -> seco + Cola -> limitador -> dac
BlowBotl botella;
Gain vca;
3 => vca.op;                         // multiplica sus entradas
botella => vca;
Step nivel => OnePole suavNivel => vca;
0.995 => suavNivel.pole;             // alisa los saltos de 5 ms (~4.5 ms)
0.0 => nivel.next;

Cola cola;
cola.init(COLA_AMORTIGUACION);
vca => cola.entrada;

// Salida: todos los canales del dac reciben la señal seca; la cola alterna
// izquierda/derecha entre canales (sirve para 2 o 4 canales), o va igual a
// todos si COLA_ESTEREO es 0.
dac.channels() => int NCANALES;
Gain bus[NCANALES];
Dyno limitador[NCANALES];
Gain seco;
vca => seco;
for (0 => int c; c < NCANALES; c++)
{
    seco => bus[c];
    if (COLA_ESTEREO) cola.salida[c % 2] => bus[c];
    else cola.salida[0] => bus[c];
    bus[c] => limitador[c] => dac.chan(c);
    limitador[c].limit();
    GANANCIA_SALIDA => bus[c].gain;
}
(1.0 - COLA_MEZCLA) => seco.gain;
COLA_MEZCLA => cola.salida[0].gain;
COLA_MEZCLA => cola.salida[1].gain;

// Presión interna del modelo: .volume (0..1) escala una presión techo.
2.0 => float PRESION_TECHO;


// =============================================================================
// 5. ESTADO
// =============================================================================
0 => int indice;                     // índice de la PRÓXIMA nota del arreglo
-1 => int notaSonando;               // nota MIDI (ya transpuesta) de la botella

// Detector de giros: las tres variables de la especificación.
0.0 => float yAnt;                   // posición suavizada anterior
0 => int signoAnt;                   // signo anterior de la diferencia (+1, -1; 0 = aún no hay)
0.0 => float yDisparo;               // posición del último disparo aceptado
0 => int detectorListo;              // 0 hasta recibir el primer valor del eje

// Ancla
0 => int enAncla;

// Portamento
0.0 => float semiActual;
0.0 => float semiInicio;
0.0 => float semiDestino;
time tGlis;
0 => int glisando;

// Respiro de las notas repetidas
now - 1::second => time tRespiro;

// Soplo y cola
0.0 => float presionActual;
0.0 => float amplitudActual;
0.0 => float volumenEnviado;
-1.0 => float t60Actual;
-1.0 => float t60Enviado;

// Ejes crudos
float ejeCrudo[64];
int ejeVisto[64];

// Pedal
time pedalUltimo[2];
now - 1::second => pedalUltimo[0];
now - 1::second => pedalUltimo[1];

["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] @=> string NOMBRES[];


// =============================================================================
// 6. UTILIDADES
// =============================================================================
fun string nombreNota(int m)
{
    return NOMBRES[m % 12] + ((m / 12) - 1);
}

fun float limita(float x, float lo, float hi)
{
    if (x < lo) return lo;
    if (x > hi) return hi;
    return x;
}

fun float normaliza(float x, float rango[])
{
    if (rango[1] == rango[0]) return 0.0;
    return limita((x - rango[0]) / (rango[1] - rango[0]), 0.0, 1.0);
}

fun int visto(int eje)
{
    if (eje < 0 || eje >= ejeCrudo.size()) return 0;
    return ejeVisto[eje];
}

fun float leeEje(int eje, float rango[])
{
    return normaliza(ejeCrudo[eje], rango);
}

fun string descripcionProxima()
{
    if (indice >= MELODIA.size()) return "fin";
    return indice + " " + nombreNota(MELODIA[indice] + TRANSPORTE);
}

fun void log(string s)
{
    chout <= s <= IO.nl();
}


// =============================================================================
// 7. MELODÍA: disparo, pedal, anclas, reinicio
// =============================================================================

// Un giro aceptado: suena la nota del índice actual y el índice avanza.
// NO hay noteOn: solo cambia la altura; el soplo sigue abierto.
fun void disparo()
{
    if (indice >= MELODIA.size())
    {
        log("   (fin del arreglo: el giro no cambia nada)");
        return;
    }
    MELODIA[indice] + TRANSPORTE => int nota;
    indice => int tocado;
    (nota == notaSonando) => int repetida;

    glisaA(nota);
    if (repetida && REARTICULAR_REPETIDAS) now => tRespiro;

    indice++;
    "" => string extra;
    if (repetida) "  =" => extra;
    if (amplitudActual <= 0.0) extra + "  (sin soplo)" => extra;
    log("nota " + tocado + "  " + nombreNota(nota) + " (" + nota + ")" + extra);

    if (indice >= MELODIA.size())
    {
        if (FINAL_REINICIA)
        {
            0 => indice;
            log("   fin del arreglo: vuelve al principio");
        }
        else log("   fin del arreglo");
    }
}

// Pedal: mueve el índice sin sonar (la altura que suena no cambia).
fun void mueveIndice(int delta)
{
    indice + delta => int n;
    if (n < 0) 0 => n;
    if (n >= MELODIA.size())
    {
        if (FINAL_REINICIA) 0 => n;
        else MELODIA.size() => n;
    }
    n => indice;
    "+1" => string s;
    if (delta < 0) "-1" => s;
    log("[pedal " + s + "]  proxima: " + descripcionProxima());
}

// Ancla: salta al primer comienzo de frase >= índice actual.
fun void saltaAncla()
{
    -1 => int destino;
    for (0 => int i; i < ANCLAS.size(); i++)
    {
        if (ANCLAS[i] >= indice) { ANCLAS[i] => destino; break; }
    }
    if (destino < 0)
    {
        if (FINAL_REINICIA && ANCLAS.size() > 0) ANCLAS[0] => destino;
        else { log("[ancla]  no hay mas frases adelante"); return; }
    }
    destino => indice;
    log("[ancla]  proxima: " + descripcionProxima());
}

// Lleva el índice a n sin sonar. reiniciar() es irA(0).
fun void irA(int n)
{
    limita(n, 0, MELODIA.size() - 1) $ int => indice;
    log("[control]  proxima: " + descripcionProxima());
}

fun void reiniciar()
{
    irA(0);
}

fun void escuchaControl()
{
    while (true)
    {
        gm_ir => now;
        irA(gm_irA);
    }
}


// =============================================================================
// 8. DETECTOR DE CAMBIOS DE DIRECCIÓN (núcleo)
// =============================================================================
// Por cada muestra del bucle de control:
//   1. suavizado exponencial de la posición vertical,
//   2. diferencia de primer orden,
//   3. cambio de signo de esa diferencia,
//   4-5. se acepta solo si, desde la posición del último disparo aceptado, se
//        recorrió al menos UMBRAL_RECORRIDO; si no, se ignora y la posición de
//        referencia NO se mueve.
// Diferencia exactamente nula (el Gametrak no mandó un valor nuevo y el filtro
// ya convergió): se conserva el signo anterior; un reposo no es un giro.
//
// Si 'contar' es 0 (cordel A en zona de ancla) el filtro sigue corriendo
// pero no se aceptan giros.
fun void pasoDetector(float x, int contar)
{
    if (!detectorListo)
    {
        x => yAnt;
        x => yDisparo;
        0 => signoAnt;
        1 => detectorListo;
        return;
    }
    yAnt + ALFA * (x - yAnt) => float y;
    y - yAnt => float d;
    0 => int s;
    if (d > 1e-9) 1 => s;
    else if (d < -1e-9) -1 => s;

    if (s != 0)
    {
        if (contar && signoAnt != 0 && s != signoAnt)
        {
            // el extremo recién pasado es yAnt
            if (Math.fabs(yAnt - yDisparo) >= UMBRAL_RECORRIDO)
            {
                yAnt => yDisparo;
                disparo();
            }
        }
        s => signoAnt;
    }
    y => yAnt;
}


// =============================================================================
// 9. PORTAMENTO
// =============================================================================
fun void glisaA(int nota)
{
    nota => notaSonando;
    if (PORTAMENTO <= 0::ms)
    {
        nota => semiActual;
        0 => glisando;
        Std.mtof(semiActual) => botella.freq;
        return;
    }
    semiActual => semiInicio;
    nota => semiDestino;
    now => tGlis;
    1 => glisando;
}

fun void bucleGlisando()
{
    while (true)
    {
        if (glisando)
        {
            (now - tGlis) / PORTAMENTO => float f;
            if (f >= 1.0)
            {
                semiDestino => semiActual;
                0 => glisando;
            }
            else semiInicio + (semiDestino - semiInicio) * f => semiActual;
            Std.mtof(semiActual) => botella.freq;
        }
        1::ms => now;
    }
}


// =============================================================================
// 10. BUCLE DE CONTROL
// =============================================================================
fun float factorRespiro()
{
    now - tRespiro => dur t;
    if (t < 0::ms || t >= RESPIRO_DURACION) return 1.0;
    t / RESPIRO_DURACION => float x;
    return 1.0 - RESPIRO_PROFUNDIDAD * 0.5 * (1.0 - Math.cos(2.0 * pi * x));
}

fun void bucleControl()
{
    now => time proximoMostrar;
    while (true)
    {
        // --- mano A: ancla (antes que el detector, porque lo congela) ---
        if (visto(EJE_A_EXTENSION))
        {
            leeEje(EJE_A_EXTENSION, RANGO_A_EXTENSION) => float ext;
            if (!enAncla && ext >= UMBRAL_ANCLA)
            {
                1 => enAncla;
                saltaAncla();
            }
            else if (enAncla && ext < UMBRAL_ANCLA_REARME)
            {
                0 => enAncla;
                // al volver, el recorrido se mide desde donde quedó la mano
                yAnt => yDisparo;
                0 => signoAnt;
            }
        }

        // --- mano A: giros ---
        if (visto(EJE_A_VERTICAL))
            pasoDetector(leeEje(EJE_A_VERTICAL, RANGO_A_VERTICAL), !enAncla);

        // --- mano B: soplo ---
        0.0 => float presion;
        0.0 => float amplitud;
        if (visto(EJE_B_EXTENSION))
        {
            leeEje(EJE_B_EXTENSION, RANGO_B_EXTENSION) => float e;
            if (e > SOPLO_ZONA_MUERTA)
            {
                (e - SOPLO_ZONA_MUERTA) / (1.0 - SOPLO_ZONA_MUERTA) => float u;
                PRESION_MIN + (PRESION_MAX - PRESION_MIN) * u => presion;
                Math.pow(u, CURVA_AMPLITUD) => amplitud;
            }
        }
        presion => presionActual;
        amplitud => amplitudActual;
        limita(presion / PRESION_TECHO, 0.0, 1.0) => float vol;
        if (Math.fabs(vol - volumenEnviado) > 1e-4)
        {
            vol => botella.volume;
            vol => volumenEnviado;
        }
        amplitud * factorRespiro() => nivel.next;

        // --- mano B: cola ---
        if (visto(EJE_B_HORIZONTAL))
        {
            leeEje(EJE_B_HORIZONTAL, RANGO_B_HORIZONTAL) => float h;
            COLA_T60_MIN * Math.pow(COLA_T60_MAX / COLA_T60_MIN, h) => float objetivo;
            if (t60Actual < 0) objetivo => t60Actual;
            else t60Actual + 0.05 * (objetivo - t60Actual) => t60Actual;   // ~100 ms
            if (t60Enviado < 0 || Math.fabs(t60Actual - t60Enviado) > 0.01 * t60Enviado)
            {
                cola.t60(t60Actual);
                t60Actual => t60Enviado;
            }
        }

        if (MOSTRAR_EJES && now >= proximoMostrar)
        {
            muestraEjes();
            now + 250::ms => proximoMostrar;
        }
        TASA_CONTROL => now;
    }
}

fun string ejeTexto(string nombre, int eje, float rango[])
{
    if (!visto(eje)) return nombre + " --  ";
    return nombre + " " + Std.ftoa(leeEje(eje, rango), 3) + "  ";
}

fun void muestraEjes()
{
    "" => string s;
    ejeTexto("A.vert", EJE_A_VERTICAL, RANGO_A_VERTICAL) +=> s;
    ejeTexto("A.ext", EJE_A_EXTENSION, RANGO_A_EXTENSION) +=> s;
    ejeTexto("B.ext", EJE_B_EXTENSION, RANGO_B_EXTENSION) +=> s;
    ejeTexto("B.hor", EJE_B_HORIZONTAL, RANGO_B_HORIZONTAL) +=> s;
    if (t60Actual > 0) "cola " + Std.ftoa(t60Actual, 1) + " s" +=> s;
    log(s);
}


// =============================================================================
// 11. ENTRADAS: Gametrak (Hid) y pedal (MidiIn)
// =============================================================================
fun void recibeEje(int eje, float valor)
{
    if (eje < 0 || eje >= ejeCrudo.size()) return;
    valor => ejeCrudo[eje];
    1 => ejeVisto[eje];
}

fun void leeGametrak(Hid hi)
{
    HidMsg msg;
    while (true)
    {
        hi => now;
        while (hi.recv(msg))
        {
            if (msg.isAxisMotion()) recibeEje(msg.which, msg.axisPosition);
        }
    }
}

fun void abreGametrak()
{
    Hid hi;
    if (!hi.openJoystick(DISPOSITIVO_GAMETRAK))
    {
        log("ERROR: no se pudo abrir el joystick " + DISPOSITIVO_GAMETRAK
            + ". Revisar con gametrak-monitor.ck.");
        me.exit();
    }
    log("Gametrak: joystick " + DISPOSITIVO_GAMETRAK + " (" + hi.name() + ")");
    spork ~ leeGametrak(hi);
}

fun void recibeMidi(int estado, int numero, int valor)
{
    estado & 0xF0 => int tipo;
    (estado & 0x0F) + 1 => int canal;
    if (tipo != PEDAL_TIPO) return;
    if (PEDAL_CANAL != 0 && canal != PEDAL_CANAL) return;
    if (tipo == 0xC0) 127 => valor;            // program change no trae valor
    if (valor < PEDAL_VALOR_MINIMO) return;

    -1 => int cual;
    if (numero == PEDAL_NUM_MENOS) 0 => cual;
    else if (numero == PEDAL_NUM_MAS) 1 => cual;
    if (cual < 0) return;

    if (now - pedalUltimo[cual] < PEDAL_ANTIRREBOTE) return;
    now => pedalUltimo[cual];
    if (cual == 0) mueveIndice(-1);
    else mueveIndice(1);
}

fun void leePedal(MidiIn min)
{
    MidiMsg msg;
    while (true)
    {
        min => now;
        while (min.recv(msg)) recibeMidi(msg.data1, msg.data2, msg.data3);
    }
}

fun void abrePedal()
{
    if (PEDAL_NUM_MENOS < 0 || PEDAL_NUM_MAS < 0)
    {
        log("AVISO: pedal sin configurar (PEDAL_NUM_MENOS / PEDAL_NUM_MAS en -1). Se sigue sin pedal.");
        return;
    }
    MidiIn min;
    if (!min.open(PEDAL_PUERTO))
    {
        log("AVISO: no se pudo abrir el puerto MIDI " + PEDAL_PUERTO + ". Se sigue sin pedal.");
        return;
    }
    log("Pedal: puerto " + PEDAL_PUERTO + " (" + min.name() + ")");
    spork ~ leePedal(min);
}


// =============================================================================
// 12. ARRANQUE
// =============================================================================
fun void revisaConfiguracion()
{
    0 => int faltan;
    if (EJE_A_VERTICAL < 0)   { log("  falta EJE_A_VERTICAL");   1 => faltan; }
    if (EJE_A_EXTENSION < 0)  { log("  falta EJE_A_EXTENSION");  1 => faltan; }
    if (EJE_B_EXTENSION < 0)  { log("  falta EJE_B_EXTENSION");  1 => faltan; }
    if (EJE_B_HORIZONTAL < 0) { log("  falta EJE_B_HORIZONTAL"); 1 => faltan; }
    if (faltan)
    {
        log("Los numeros de eje no estan asignados. Correr gametrak-monitor.ck,");
        log("anotar que numero mueve cada cordel y fijarlos en la seccion 1.4.");
        me.exit();
    }
    if (MELODIA.size() == 0) { log("ERROR: MELODIA esta vacia."); me.exit(); }
    for (0 => int i; i < ANCLAS.size(); i++)
    {
        if (ANCLAS[i] < 0 || ANCLAS[i] >= MELODIA.size())
            log("AVISO: el ancla " + ANCLAS[i] + " esta fuera del arreglo.");
        if (i > 0 && ANCLAS[i] <= ANCLAS[i - 1])
            log("AVISO: ANCLAS no esta en orden creciente.");
    }
}

fun void preparaBotella()
{
    RUIDO_CHORRO => botella.noiseGain;
    0.0 => botella.vibratoGain;
    0.001 => botella.rate;           // pendiente de subida de la presión (por muestra)
    MELODIA[0] + TRANSPORTE => notaSonando;
    notaSonando => semiActual;
    Std.mtof(semiActual) => botella.freq;
    // Se abre el chorro UNA vez y queda abierto; desde aquí la presión la
    // maneja .volume (objetivo de la envolvente interna, 0..1).
    // Ojo con la envolvente de STK: .volume(0) justo después de abrir no hace
    // nada si el valor aún es 0 exacto; por eso se deja correr 2 muestras.
    botella.startBlowing(PRESION_TECHO);
    2::samp => now;
    0.0 => botella.volume;
    0.0 => volumenEnviado;
}

revisaConfiguracion();
preparaBotella();

-1000.0 * (TASA_CONTROL / 1::second) / Math.log(1.0 - ALFA) => float tauMs;
log("--------------------------------------------------------------");
log("Gracias a la vida: melodia con Gametrak");
log("  " + MELODIA.size() + " notas, " + ANCLAS.size() + " anclas, transporte " + TRANSPORTE);
log("  umbral de recorrido " + Std.ftoa(UMBRAL_RECORRIDO, 3)
    + ", suavizado ALFA " + Std.ftoa(ALFA, 2) + " (~" + Std.ftoa(tauMs, 0) + " ms)");
log("  portamento " + Std.ftoa(PORTAMENTO / 1::ms, 0) + " ms, cola "
    + Std.ftoa(COLA_T60_MIN, 1) + " a " + Std.ftoa(COLA_T60_MAX, 1) + " s, "
    + NCANALES + " canales");
log("  proxima: " + descripcionProxima());
log("--------------------------------------------------------------");

spork ~ bucleGlisando();
spork ~ bucleControl();
spork ~ escuchaControl();
abreGametrak();   // [ENTRADA-GAMETRAK]
abrePedal();      // [ENTRADA-PEDAL]

while (true) 1::second => now;   // [ESPERA]
