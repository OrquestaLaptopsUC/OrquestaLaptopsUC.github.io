# Documentación Técnica y Manual de Usuario: ResoDance v1.0

## 1. Introducción
**ResoDance** es un instrumento virtual y sintetizador experimental que emula la acústica electromecánica de un escáner de resonancia magnética (MRI) de $3.0$ Tesla. A diferencia de un *sampler* tradicional que reproduce grabaciones estáticas, ResoDance genera el sonido en tiempo real utilizando síntesis híbrida de modelamiento físico. 

Esta herramienta está diseñada para funcionar de manera 100% *offline* en cualquier navegador web moderno, sin dependencias externas, librerías gráficas de terceros, ni fuentes descargables.

## 2. Arquitectura y Tecnología
*   **Lenguajes de Desarrollo:** HTML5, CSS3 (utilidades nativas integradas), y Vanilla JavaScript (ECMAScript 6+).
*   **Motor de Audio:** Web Audio API nativa del navegador.
*   **Método de Síntesis:** **Síntesis Híbrida de Modelamiento Físico** (*Physical Modeling Synthesis*). Se divide específicamente en:
    *   *Modelamiento de Masas Agrupadas* (*Lumped-mass modeling*) para la sección electromecánica y la fuerza de Lorentz.
    *   *Síntesis Modal y de Guías de Onda* (*Modal/Waveguide Synthesis*) para la cavidad acústica.

### 2.1. Tratamiento de Señal en DSP
ResoDance hace un uso intensivo de filtros y líneas de retardo para lograr el hiperrealismo, pero **no utiliza convolución** (para evitar la necesidad de cargar respuestas a impulsos [IR] externas en archivos de audio, garantizando su portabilidad absoluta).

*   **Filtros Digitales:** Se implementan mediante `BiquadFilterNode` (IIR) para modelar el sistema inercial de la bobina (Paso-bajo resonante), limitar la derivada de la corriente eléctrica (Paso-bajo) y aislar las resonancias cilíndricas (Paso-banda múltiple).
*   **Líneas de Retardo:** Se utiliza un `DelayNode` realimentado para conformar un filtro de peine (*Comb Filter*), el cual simula la propagación de ondas y reflexiones acústicas ultracortas dentro del tubo de plástico duro y fibra de vidrio.

## 3. Diagrama de Flujo de Señal (Signal Flow)

El motor DSP opera calculando en tiempo real la siguiente topología de nodos de audio:

```text
[GENERADORES DE EXCITACIÓN ELÉCTRICA]
   │
   ├─ Gx (Oscilador Cuadrado + Envolvente Trapezoidal)
   ├─ Gy (Oscilador Diente de Sierra + Envolvente Exponencial)
   └─ Gz (Fuente DC Constante + Envolvente Trapezoidal)
   │
   ▼
[ETAPA 01: FILTRADO DE SLEW RATE]
   │
   └─► Slew Filter (Lowpass) ──> Limita la derivada dI/dt (escalones a trapecios)
   │
   ▼
[ETAPA 02: MECÁNICA DE LORENTZ]
   │
   └─► Coil Spring (Lowpass + Q) ──> Inercia de bobina de cobre (Masa-Resorte)
   └─► Lorentz Drive (WaveShaper) ──> Saturación asimétrica (Impacto físico de chasis)
   │
   ▼
[ETAPA 03: DIVISIÓN ACÚSTICA CILÍNDRICA]
   │
   ├─► [Ruta DRY: Mecánica Pura] ──┐
   │                               │
   └─► [Ruta WET: Acústica Tubo]   │
         │                         │
         ├─► Modal Filter 1 (BP) ──┐
         ├─► Modal Filter 2 (BP) ──┼─► Mezclador WET ──┐
         ├─► Modal Filter 3 (BP) ──┤                   │
         ├─► Modal Filter 4 (BP) ──┘                   │
         │                                             │
         └─► Waveguide (Línea de retardo) <──┐         │
               │                             │         │
               └─► Filtro Absorción ─┬─► Feedback ─────┘
                                     │                 │
                                     └─────────────────┘
                                                       │
[ETAPA DE SALIDA] <────────────────────────────────────┘
   │
   └─► Dynamics Compressor (Limitador de seguridad)
   └─► Master Output Gain
   └─► AnalyserNode (Osciloscopio visual UI)
   └─► AudioContext Destination (Altavoces)
```

## 4. Diccionario de Parámetros

La interfaz se divide en tres etapas discretas que siguen fielmente el proceso físico de generación de ruido en un escáner real.

### Etapa 01: Excitador de Gradientes
Define las secuencias de pulsos médicos. Aquí se "componen" los ritmos.

*   **Frecuencia de Ciclo ($1 / TR$) y BPM:**
    *   *Origen Físico:* $TR$ (Tiempo de Repetición) es el parámetro médico fundamental que define el lapso entre excitaciones de cortes espaciales.
    *   *Efecto Sonoro:* Actúa como el BPM (Tempo) maestro del sintetizador. Define la velocidad de los "golpes graves" rítmicos.
*   **Conmutación EPI (Tono $G_x$):**
    *   *Origen Físico:* Gradiente *Echo Planar Imaging*. El eje X oscila su polaridad velozmente para leer el espacio-k en una sola pasada.
    *   *Efecto Sonoro:* Controla la nota o frecuencia fundamental del zumbido penetrante. Es la "voz" principal que caracteriza la resonancia.
*   **Slew Rate (Flanco Trapezoidal):**
    *   *Origen Físico:* Medido en $T/m/s$ (Teslas por metro por segundo). Es la aceleración máxima permitida para cambiar el campo magnético.
    *   *Efecto Sonoro:* Altera la pendiente de los pulsos digitales. Funciona como un control de "brillo". Valores bajos (rampas lentas) generan sonidos opacos; valores altos (flancos verticales) producen transitorios afilados y metálicos.

### Etapa 02: Inercia de Bobina y Lorentz
Convierte la señal eléctrica en fuerza física.

*   **Rigidez del Anclaje ($f_0$):**
    *   *Origen Físico:* Las bobinas de gradiente están encapsuladas en resina epoxi. Este anclaje tiene una frecuencia de resonancia natural definida por la ecuación clásica del oscilador armónico: $f_0 = \frac{1}{2\pi} \sqrt{\frac{k}{m}}$ (donde $k$ es rigidez y $m$ es masa).
    *   *Efecto Sonoro:* Ajusta el pico resonante mecánico. Define si la máquina se percibe densa y hueca (frecuencias bajas) o tensa y ligera (frecuencias altas).
*   **Resonancia Mecánica (Factor Q):**
    *   *Origen Físico:* El coeficiente de amortiguamiento del chasis. Qué tanta energía vibratoria disipa la resina.
    *   *Efecto Sonoro:* Controla la duración del timbre residual tras un impacto. Un $Q$ alto emula una estructura suelta que sigue vibrando (como una campana); un $Q$ bajo suena amortiguado y percusivo (plástico sólido).
*   **Impacto de Chasis (Lorentz Drive):**
    *   *Origen Físico:* La Fuerza de Lorentz, $\vec{F} = \int (\vec{I} \times \vec{B_0}) dl$, deforma las bobinas violentamente contra sus topes físicos debido al campo estático masivo ($B_0$).
    *   *Efecto Sonoro:* Distorsión por *Waveshaping* asimétrico. Agrega saturación extrema y *hard-clipping*. Transforma vibraciones puras en latigazos violentos e industriales.

### Etapa 03: Resonador Acústico Modal
Modela el entorno espacial (el tubo de la máquina).

*   **Diámetro de Cavidad (Bore Size):**
    *   *Origen Físico:* El diámetro interno (usualmente entre $60$ y $70$ cm) del cilindro plástico donde entra el paciente. 
    *   *Efecto Sonoro:* Escala matemáticamente los formantes del banco de filtros modales y altera el retardo de la guía de onda. Modificarlo en tiempo real actúa como un *phaser* arquitectónico.
*   **Reflexión de Fibra (Bore Res):**
    *   *Origen Físico:* El coeficiente de reflexión acústica y reverberación interna dictada por la geometría de tubo cerrado/abierto.
    *   *Efecto Sonoro:* Controla la ganancia del resonador acústico (Dry/Wet mix) y la retroalimentación del *comb filter*. Valores altos sumergen al usuario en la sensación claustrofóbica de estar dentro de la máquina.

## 5. Acoplamiento de Ejes y Ejecución en Vivo

ResoDance cuenta con tres modos de acoplamiento de gradientes que alteran el comportamiento rítmico general, permitiendo variaciones musicales:
1.  **Síncrono:** Todos los ejes ($G_x, G_y, G_z$) disparan de manera lineal, como un bloque sólido repetitivo.
2.  **Polirrítmico:** Introduce desfases matemáticos entre la selección de corte ($G_z$) y la lectura ($G_x$), creando ritmos entrelazados complejos muy útiles para música electrónica (Techno/Industrial).
3.  **Alternado:** Introduce micropausas que simulan los tiempos de relajación reales de los tejidos entre adquisiciones, generando un patrón rítmico espaciado.

**Pads de Excitación Manual:**
Permiten utilizar ResoDance como un instrumento *drum machine* en vivo. Puedes pulsar los botones de la interfaz o utilizar las teclas `1`, `2` y `3` del teclado numérico para disparar ráfagas aisladas de cada gradiente en tiempo real de forma percusiva, anulando la secuencia clínica regular.