// =============================================================================
// gracias-melodia-control.ck
//
// Mueve el índice de gracias-melodia-gametrak.ck SIN detenerlo y sin sonar:
// fijar IR_A, Add Shred (⌘,) en la misma VM de miniAudicle. Este shred avisa
// y termina solo. La altura que está sonando no cambia; el próximo giro de
// la mano A toca la nota IR_A.
//
//   0      = reinicio: vuelve al principio de la melodía
//   otro n = la próxima nota será MELODIA[n] (índices como en el arreglo)
// =============================================================================

0 => int IR_A;

global Event gm_ir;
global int gm_irA;

IR_A => gm_irA;
gm_ir.broadcast();
1::ms => now;
