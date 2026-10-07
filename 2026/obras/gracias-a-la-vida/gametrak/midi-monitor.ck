// =============================================================================
// midi-monitor.ck
//
// Imprime TODOS los mensajes MIDI que llegan, de todos los puertos de entrada:
//
//   p0  control change   canal 1   número 64   valor 127    [B0 40 7F]
//
// Uso: Add Shred, pisar cada interruptor del pedal (y soltarlo) y anotar:
//   - el puerto (p0, p1, ...)            -> PEDAL_PUERTO
//   - el tipo (note-on, control change, program change)
//                                        -> PEDAL_TIPO (0x90, 0xB0, 0xC0)
//   - el canal                           -> PEDAL_CANAL (o 0 = cualquiera)
//   - el número de cada interruptor      -> PEDAL_NUM_MENOS, PEDAL_NUM_MAS
//   - el valor al pisar y al soltar. Si al pisar una vez llega 127 y a la
//     siguiente 0 (pedal alternado), poner PEDAL_VALOR_MINIMO en 0.
// en la sección 1.5 de gracias-melodia-gametrak.ck.
// =============================================================================

16 => int MAX_PUERTOS;
MidiIn entrada[MAX_PUERTOS];

"0123456789ABCDEF" => string HEX;
fun string hex2(int n)
{
    return HEX.substring((n >> 4) & 15, 1) + HEX.substring(n & 15, 1);
}

fun string col(string s, int ancho)
{
    while (s.length() < ancho) " " +=> s;
    return s;
}

fun void muestra(int puerto, int b1, int b2, int b3)
{
    b1 & 0xF0 => int tipo;
    (b1 & 0x0F) + 1 => int canal;
    "" => string nombre;
    "numero " + b2 => string num;
    "valor " + b3 => string val;

    if (tipo == 0x80) "note-off" => nombre;
    else if (tipo == 0x90)
    {
        "note-on" => nombre;
        if (b3 == 0) "valor 0 (= note-off)" => val;
    }
    else if (tipo == 0xA0) "aftertouch poli." => nombre;
    else if (tipo == 0xB0) "control change" => nombre;
    else if (tipo == 0xC0) { "program change" => nombre; "(sin valor)" => val; }
    else if (tipo == 0xD0) { "channel pressure" => nombre; "" => num; "valor " + b2 => val; }
    else if (tipo == 0xE0) { "pitch bend" => nombre; "" => num; "valor " + (b2 + 128 * b3) => val; }
    else { "sistema" => nombre; "" => num; "" => val; }

    "canal " + canal => string can;
    if (tipo == 0xF0) "" => can;

    chout <= col("p" + puerto, 5) <= col(nombre, 19) <= col(can, 10)
          <= col(num, 12) <= col(val, 22)
          <= "[" <= hex2(b1) <= " " <= hex2(b2) <= " " <= hex2(b3) <= "]" <= IO.nl();
}

fun void escucha(int p)
{
    MidiMsg msg;
    while (true)
    {
        entrada[p] => now;
        while (entrada[p].recv(msg)) muestra(p, msg.data1, msg.data2, msg.data3);
    }
}

0 => int cuantos;
chout <= "Puertos MIDI de entrada:" <= IO.nl();
for (0 => int p; p < MAX_PUERTOS; p++)
{
    entrada[p].printerr(0);
    if (entrada[p].open(p))
    {
        chout <= "  p" <= p <= ": " <= entrada[p].name() <= IO.nl();
        spork ~ escucha(p);
        cuantos++;
    }
}
if (cuantos == 0)
{
    chout <= "No hay ningun puerto MIDI de entrada. Revisar la conexion del pedal." <= IO.nl();
    me.exit();
}
chout <= "Esperando mensajes (pisar cada interruptor)..." <= IO.nl();
while (true) 1::second => now;
