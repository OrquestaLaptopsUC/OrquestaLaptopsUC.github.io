// =============================================================================
// gametrak-monitor.ck
//
// Monitor de ejes del Gametrak (y de cualquier joystick conectado).
// Sirve para descubrir la numeración real de los ejes y sus rangos útiles,
// y copiarlos en la sección 1.4 de gracias-melodia-gametrak.ck.
//
// Abre TODOS los joysticks que encuentra y, cada PERIODO, imprime una línea
// por dispositivo con cada eje que se haya movido:
//
//   j0  e0 +0.123 [-0.981 +0.954] r0.210  e1 ...   | más activo: e0
//        |    |       |      |      |
//        |    |       |      |      recorrido en el último segundo (máx - mín)
//        |    |       |      máximo visto desde que arrancó
//        |    |       mínimo visto desde que arrancó
//        |    valor actual (ChucK entrega -1 a 1)
//        número de eje
//
// Procedimiento (una mano por vez, la otra quieta):
//   1. Cordel A arriba y abajo: el "más activo" es EJE_A_VERTICAL.
//   2. Cordel A, estirar y recoger: EJE_A_EXTENSION.
//   3. Cordel B, estirar y recoger: EJE_B_EXTENSION.
//   4. Cordel B, izquierda y derecha: EJE_B_HORIZONTAL.
//   5. Rangos: llevar cada eje a los extremos que se van a usar tocando y
//      anotar [mínimo, máximo]. Para reiniciar mínimos y máximos: Replace
//      Shred (⌘=).
//   6. Umbral de recorrido: en la posición de juego, subir y bajar la mano
//      4 a 5 cm varias veces y leer "r" del eje vertical. Ese valor dividido
//      por (máximo - mínimo) del rango elegido es UMBRAL_RECORRIDO.
//      (O más directo: MOSTRAR_EJES = 1 en el parche principal, que ya
//      muestra los ejes normalizados.)
//
// También muestra los botones (la entrada de pedal de la base).
// =============================================================================

200::ms => dur PERIODO;       // cada cuánto imprime
8 => int MAX_JOYSTICKS;       // cuántos números de joystick probar
16 => int MAX_EJES;

Hid hid[MAX_JOYSTICKS];
int abierto[MAX_JOYSTICKS];
string nombre[MAX_JOYSTICKS];

float valor[MAX_JOYSTICKS * MAX_EJES];
float minimo[MAX_JOYSTICKS * MAX_EJES];
float maximo[MAX_JOYSTICKS * MAX_EJES];
float vMin[MAX_JOYSTICKS * MAX_EJES];     // ventana de 1 s en curso
float vMax[MAX_JOYSTICKS * MAX_EJES];
float recorrido[MAX_JOYSTICKS * MAX_EJES];
int visto[MAX_JOYSTICKS * MAX_EJES];
int cambio[MAX_JOYSTICKS];

fun string f3(float x)
{
    if (x >= 0) return "+" + Std.ftoa(x, 3);
    return Std.ftoa(x, 3);
}

fun void lee(int j)
{
    HidMsg msg;
    while (true)
    {
        hid[j] => now;
        while (hid[j].recv(msg))
        {
            if (msg.isAxisMotion() && msg.which >= 0 && msg.which < MAX_EJES)
            {
                j * MAX_EJES + msg.which => int k;
                msg.axisPosition => float v;
                v => valor[k];
                if (!visto[k])
                {
                    1 => visto[k];
                    v => minimo[k]; v => maximo[k]; v => vMin[k]; v => vMax[k];
                }
                if (v < minimo[k]) v => minimo[k];
                if (v > maximo[k]) v => maximo[k];
                if (v < vMin[k]) v => vMin[k];
                if (v > vMax[k]) v => vMax[k];
                1 => cambio[j];
            }
            else if (msg.isButtonDown())
                chout <= "j" <= j <= "  boton " <= msg.which <= " ABAJO" <= IO.nl();
            else if (msg.isButtonUp())
                chout <= "j" <= j <= "  boton " <= msg.which <= " arriba" <= IO.nl();
            else if (msg.isHatMotion())
                chout <= "j" <= j <= "  hat " <= msg.which <= " = " <= msg.idata <= IO.nl();
        }
    }
}

// cierra la ventana de 1 segundo del recorrido
fun void ventana()
{
    while (true)
    {
        1::second => now;
        for (0 => int k; k < valor.size(); k++)
        {
            if (!visto[k]) continue;
            vMax[k] - vMin[k] => recorrido[k];
            valor[k] => vMin[k];
            valor[k] => vMax[k];
        }
    }
}

fun void imprime()
{
    while (true)
    {
        PERIODO => now;
        for (0 => int j; j < MAX_JOYSTICKS; j++)
        {
            if (!abierto[j] || !cambio[j]) continue;
            0 => cambio[j];
            "j" + j + " " => string s;
            -1 => int activo;
            0.02 => float mejor;             // bajo esto no se considera movimiento
            for (0 => int e; e < MAX_EJES; e++)
            {
                j * MAX_EJES + e => int k;
                if (!visto[k]) continue;
                " e" + e + " " + f3(valor[k]) + " [" + f3(minimo[k]) + " " + f3(maximo[k])
                    + "] r" + Std.ftoa(recorrido[k], 3) + " " +=> s;
                if (recorrido[k] > mejor) { recorrido[k] => mejor; e => activo; }
            }
            if (activo >= 0) " | mas activo: e" + activo +=> s;
            chout <= s <= IO.nl();
        }
    }
}

// --- abrir todo lo que haya ---
0 => int cuantos;
chout <= "Buscando joysticks..." <= IO.nl();
for (0 => int j; j < MAX_JOYSTICKS; j++)
{
    hid[j].printerr(0);
    if (hid[j].openJoystick(j))
    {
        1 => abierto[j];
        hid[j].name() => nombre[j];
        chout <= "  joystick " <= j <= ": " <= nombre[j] <= IO.nl();
        spork ~ lee(j);
        cuantos++;
    }
}
if (cuantos == 0)
{
    chout <= "No se encontro ningun joystick. Revisar el cable USB del Gametrak." <= IO.nl();
    chout <= "En macOS puede hacer falta darle a miniAudicle permiso de" <= IO.nl();
    chout <= "Monitoreo de entrada (Ajustes del Sistema > Privacidad y seguridad)." <= IO.nl();
    me.exit();
}
chout <= "(Los avisos \"couldn't open joystick N\" de ChucK son normales: se prueban" <= IO.nl();
chout <= "numeros de joystick que no existen.)" <= IO.nl();
chout <= "El numero de joystick del Gametrak va en DISPOSITIVO_GAMETRAK." <= IO.nl();
chout <= "Mover un cordel por vez. Solo se imprime cuando algo se mueve." <= IO.nl();

spork ~ ventana();
spork ~ imprime();
while (true) 1::second => now;
