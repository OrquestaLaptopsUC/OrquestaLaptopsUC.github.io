# Documentación Técnica: Sintetizador Espectral IFFT

Esta herramienta es un laboratorio DSP (Procesamiento Digital de Señales) alojado íntegramente en el navegador web. Permite analizar el ruido acústico de un resonador magnético (u otra fuente), extraer sus picos espectrales dominantes y re-sintetizarlos en tiempo real utilizando modulación cruzada mediante micrófono.

A continuación, se detalla la arquitectura, teoría y funcionamiento de los parámetros.

---

## 1. Arquitectura Técnica (Stack Offline)

*   **Lenguajes:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
*   **Librerías/Frameworks:** **Cero.** El código se ha diseñado expresamente para no depender de librerías externas (sin jQuery, sin React, sin Tailwind CDN ni Google Fonts). Es 100% portable y funcional sin conexión a internet.
*   **Motor de Audio:** Web Audio API (`AudioContext`, `AnalyserNode`, `ScriptProcessorNode`).
*   **Procesamiento Matemático:** Implementación algorítmica explícita in-place de la FFT de Cooley-Tukey Radix-2 en Javascript Puro (`Float64Array`).

---

## 2. Diagrama de Flujo de la Señal

El siguiente diagrama textual ilustra cómo viajan los datos desde la entrada del archivo hasta la generación sonora:

```text
[ Audio Input (WAV/MP3/Demo) ]
            |
            v
 [ Enventanado de Análisis (Hann) ] ---> [ FFT Directa Offline (Magnitud y Fase) ]
                                                        |
                                                        v
                                             [ Espectro Crudo ]
                                                        |
       (Micrófono) --> [ Seguidor de Envolvente ]       v
                            + [ Centroide ] ---> [ Filtrado Dinámico por Umbral ]
                            + [ Flux Detector ]         | (Selección Top N=12 Picos)
                                                        |
                     (Teclado) -> [ Multiplicador de Frecuencia (Pitch Ratio) ]
                                                        |
      +-------------------------------------------------+------------------------------------------+
      | MODO A: IFFT por Bloques (OLA)                  | MODO B: Suma IDFT Continua               |
      |-------------------------------------------------|------------------------------------------|
      | 1. Creación de vector X[k] vacío (N=2048)       | 1. Iteración por cada muestra (sample)   |
      | 2. Inserción de Coeficientes Re + j*Im          | 2. $x[n] = \sum A_m \cos(2\pi f_m t + \phi_m)$ |
      | 3. IFFT (Transformada Inversa de Fourier)       | 3. Osciladores puros sin fugas espectrales |
      | 4. Multiplicación por Ventana de Hann (Síntesis)| 4. Mantiene inarmónicos exactos          |
      | 5. Suma con Solapamiento 4x (Overlap-Add)       |                                          |
      +-------------------------------------------------+------------------------------------------+
                                                        |
      (Micrófono RMS) ----> [ Multiplicador de Ganancia Final ]
                                                        |
                                                        v
                                     [ DAC Salida (Web Audio API Destination) ]
```

---

## 3. Teoría DSP: Parámetros de Fourier a Detalle

La base de este modelo es la **Transformada Rápida de Fourier (FFT)**, que convierte una señal desde el dominio del tiempo al dominio de la frecuencia. 

### Parámetros Clave:
*   **Tamaño de Ventana ($N$ / FFT Size):** Dicta la resolución frecuencial. 
    *   $N=2048$: Resolución más pobre, respuesta temporal más ágil.
    *   $N=4096$: Punto intermedio (resolución $\Delta f = \frac{48000}{4096} = 11.7\text{ Hz}$).
    *   $N=8192$: Muy alta resolución espectral, ideal para aislar parciales cercanos, a costa de "difuminar" el tiempo (eventos transitorios).
*   **Ventana de Hann:** Antes de ejecutar la FFT, la señal de audio se multiplica por una campana `Hann` ($0.5 \times (1 - \cos(\dots))$). Esto atenúa los extremos del bloque de audio a cero, previniendo el efecto *Spectral Leakage* (fugas espectrales) que ocurriría si se cortara la onda abruptamente.
*   **Bins ($k$):** La FFT devuelve un arreglo donde cada índice (bin) representa una banda de frecuencia estrecha.
*   **Magnitud y Fase:** El resultado de la FFT es complejo ($\text{Re} + j\text{Im}$).
    *   La **Magnitud** ($|X| = \sqrt{\text{Re}^2 + \text{Im}^2}$) indica qué tan fuerte es esa frecuencia.
    *   La **Fase** ($\phi = \text{atan2}(\text{Im}, \text{Re})$) indica el desplazamiento temporal exacto del pico de esa onda. Guardar la fase original es vital para que la reconstrucción (IFFT) suene como el objeto real (resonador) y no como un grupo de pitidos aleatorios.

---

## 4. Acústica: ¿Por qué el Resonador Magnético suena así?

Al cargar la muestra generada o tu propio mp3 de un resonador de resonancia magnética (MRI), escucharás un zumbido agudo, rítmico y áspero (similar a la música tecno de 8 bits).

**Causa Física:** 
El sonido no proviene del paciente, sino de las **Bobinas de Gradiente**. Cuando se aplica la secuencia rápida de campos magnéticos (ej. técnica *Echo-Planar Imaging* EPI), corrientes inmensas atraviesan las bobinas inmersas en el campo magnético principal (3 Tesla). Esto genera gigantescas **Fuerzas de Lorentz**, haciendo que los cilindros de fibra de vidrio vibren violentamente y golpeen sus anclajes.

**Acústica del Fenómeno:**
*   **Inarmónico:** A diferencia de una flauta o guitarra donde los armónicos son múltiplos exactos ($f, 2f, 3f$), las estructuras cilíndricas del MRI vibran en "modos de campana". Sus frecuencias son fracciones complejas (ej. $825\text{ Hz}, 1142\text{ Hz}, 1650\text{ Hz}$).
*   **Motor IFFT vs. Síntesis Aditiva:** 
    *   Si utilizas el modo **"Modo A: IFFT"**, obligamos a que esas frecuencias caigan dentro de las "cajas" (bins) matemáticas exactas de la computadora, introduciendo un ligero ruido robótico conocido como *cuantización de fase*.
    *   Si utilizas el **"Modo B: Suma IDFT"**, la computadora evalúa senoides flotantes puras que no están atadas a bins. El sonido es increíblemente sedoso y conserva la aspereza del metal vibrando (inharmonía matemática pura).

---

## 5. Glosario y Control de Parámetros Interfaz

### Análisis (Izquierda)
*   **Posición de Ventana:** Te permite "arrastrar" la porción de tiempo exacta que el algoritmo "observa" para sacar la foto espectral.
*   **Umbral (dB):** Es el filtro maestro. Todo lo que esté por debajo de esta línea roja se considera ruido térmico o ambiental y es borrado matemáticamente del espectro ($X[k]=0$).
*   **Máx. Picos (12):** Límite superior de sinusoides a sintetizar. Doce suele ser suficiente para reconstruir el timbre de casi cualquier objeto resonante sin saturar la CPU.

### Resíntesis IFFT (Derecha)
*   **Modos A y B:** Explicados en la sección 4.
*   **Tilt Espectral (Inclinación):** Filtro tipo "Shelving". Valores positivos amplifican agresivamente los picos de las altas frecuencias (agudos metálicos). Valores negativos ahogan los agudos, dejando un zumbido sordo grave.

### Control por Micrófono (Descriptores)
Esta sección realiza extracción de características (*Feature Extraction*) en vivo sobre tu voz:
*   **Seguidor de Envolvente:** Mide el nivel RMS (energía) de tu micrófono y actúa como un "VCA" (Voltage Controlled Amplifier) sobre el volumen maestro de los 12 picos del resonador. Si hablas fuerte, el resonador suena fuerte.
*   **Centroide Espectral:** Calcula el "Centro de masa" de la luz sonora (Brillo). Si haces el sonido "ssssss" o "shhhh", el centroide sube (mucho brillo). Puedes rutear esto para que **abra más el umbral** (descubriendo frecuencias ocultas) o altere el **Tilt Espectral** (cambiando el color tonal de tu resíntesis).
*   **Detector de Ataque:** Analiza el *Spectral Flux* (cambio brusco de energía). Si haces un chasquido o sonido de caja "Pah!", detecta el transiente y reinicia artificialmente las Fases de los 12 picos a 0, creando el "golpe magnético" inicial característico del gradiente EPI del resonador.