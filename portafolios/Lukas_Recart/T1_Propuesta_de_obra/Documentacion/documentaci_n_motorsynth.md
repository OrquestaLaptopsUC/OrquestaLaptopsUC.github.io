# MotorSynth | Instrumento Orquesta de Laptops

## 1. Introducción

MotorSynth es un instrumento musical experimental y secuenciador basado en la web, diseñado para emular y componer con los sonidos de motores eléctricos y maquinaria. Funciona íntegramente en el navegador web mediante la Web Audio API y permite a los usuarios encadenar sonidos en una "línea de tiempo" de múltiples pistas, manipular sus parámetros físicos en tiempo real y crear patrones rítmicos complejos utilizando bloques de bucle (loops).

La interfaz está inspirada en las líneas de tiempo de los editores de video (como Premiere Pro o DaVinci Resolve), pero optimizada para la creación musical performativa desde una laptop.

## 2. Guía de Interfaz y Uso

La interfaz de MotorSynth se divide en cuatro áreas principales: la barra superior (controles globales y visualizadores), el Catálogo de presets, la Línea de Tiempo (Workspace) y el Inspector.

### 2.1 La Línea de Tiempo y Múltiples Pistas (Tracks)
El núcleo del instrumento es su sistema de colas multicanal (Tracks). La línea de tiempo contiene pistas dispuestas horizontalmente donde se agregan los "bloques de motor" y los "bloques de bucle".

*   **Pista Activa:** Solo se reproduce una pista a la vez. La pista activa resalta visualmente (con un borde más brillante y fondo más opaco). Puedes hacer clic en una zona vacía de cualquier pista para hacerla activa.
*   **Moverse entre Pistas (W/S):** Si tienes un bloque (o varios) seleccionado, puedes usar la tecla `W` (Arriba) o `S` (Abajo) para mover la selección a la pista superior o inferior. Si no existe una pista en esa dirección, se creará una nueva automáticamente.
*   **Navegación (Flechas Izquierda/Derecha):** Cuando tienes un solo bloque seleccionado, las flechas del teclado te permiten mover la selección al bloque adyacente dentro de la misma pista.

### 2.2 Agregando y Editando Bloques
*   **Agregando Motores:** Presiona la tecla `A` para añadir un motor (basado en la configuración actual del Inspector) al final de la pista activa.
*   **Seleccionando Presets:** Haz clic en cualquier preset en el Catálogo superior (o presiona las teclas del `1` al `9`) para cargar esa configuración en el Inspector. El catálogo contiene simulaciones pre-diseñadas (Ej. Taladro fallando, Inversor de auto eléctrico, Escáner de resonancia magnética).
*   **Reordenar y Mover:** Los bloques se pueden reordenar arrastrándolos y soltándolos con el ratón dentro de cualquier pista.

### 2.3 Bloques de Bucle (Loops)
Los bucles son esenciales para crear ritmo. Un bloque de bucle repite una secuencia específica de bloques anteriores en la pista.

*   **Agregando un Bucle:** Presiona la tecla `L` para añadir un bloque de bucle a la pista activa.
*   **Envoltura Visual (Bounding Box):** Al agregar un bucle, aparecerá un rectángulo naranja translúcido superpuesto en la pista, indicando visualmente qué bloques están siendo afectados por ese bucle. Los bucles anidados tendrán colores más intensos.
*   **Control del Alcance (Span):** Puedes editar cuántos bloques anteriores abarca el bucle arrastrando el "controlador" (handle) en el borde izquierdo del rectángulo naranja hacia la izquierda o la derecha. También puedes cambiar el número "Span" en el panel del Inspector.
*   **Conteo (Count):** Determina cuántas veces se ejecutará esa sección antes de que el cabezal de reproducción continúe hacia la derecha.

### 2.4 El Inspector (Edición en Tiempo Real)
El panel lateral derecho muestra los parámetros del bloque seleccionado o del preset actual.
*   Si mantienes presionada la tecla `Ctrl` (o Cmd) y haces clic, puedes seleccionar **múltiples bloques** y editar todos sus parámetros al mismo tiempo (Edición en bloque).
*   Si los bloques seleccionados tienen valores diferentes en un parámetro, el Inspector mostrará `---` o el deslizador en cero. Escribir un nuevo valor lo unificará para toda la selección.

### 2.5 Controles de Transporte y Previsualización
*   **Play (Espacio):** Inicia la reproducción secuencial de la pista activa.
*   **Stop (Espacio):** Detiene el sonido y reinicia el progreso de los bloques.
*   **Reset:** Devuelve el cabezal de reproducción al principio de la pista activa, pero *no* detiene el sonido si ya está reproduciéndose.
*   **Play Next (D):** Salta inmediatamente al siguiente bloque en la secuencia.
*   **Preview (Enter):** Audiciona la configuración actual del Inspector de manera aislada sin alterar la secuencia en reproducción.

## 3. Síntesis de Sonido (Bajo el Capó)

El MotorSynth no usa *samples* pregrabados; todo el sonido es sintetizado en tiempo real matemáticamente. El motor de audio se basa en la simulación de dos fenómenos físicos de una máquina giratoria: el "Zumbido" electromagnético (Hum) y el ruido de fricción mecánica o "Giro" (Chug/Turn Noise).

### 3.1 Parámetros Físicos Modificables
1.  **Frecuencia Base Inicial/Final (Hum en Hz):**
    *   Este es el tono fundamental del motor eléctrico. Define qué tan "agudo" o "grave" suena la vibración electromagnética (Ej. un motor de inducción a 60Hz). Al definir un valor inicial y uno final diferente, el sonido creará un efecto *Doppler* o el efecto de un motor encendiéndose/apagándose (Pitch sweep).
2.  **Oscilación Inicial/Final (Hz o BPM):**
    *   Representa la frecuencia de giro del rotor físico. Es un efecto cíclico mucho más lento que el tono base (usualmente entre 1 y 40 Hz). Modula la intensidad del ruido mecánico.
3.  **Masa (Inercia):**
    *   Físicamente, un motor más masivo tarda más en cambiar de velocidad. En términos de síntesis, este valor (`Time Constant`) define la velocidad exponencial con la que las frecuencias (Base y Oscilación) transicionan desde sus valores iniciales a sus valores finales. Una masa alta crea curvas de aceleración lentas y suaves.
4.  **Tiempo (Duración en Segundos):**
    *   El tiempo de vida de la nota antes de pasar al siguiente bloque en la cola.

### 3.2 Técnica de Síntesis (Web Audio API)

Cuando se reproduce un motor, se genera la siguiente topología de nodos de audio:

*   **Capa 1: El Zumbido Electromagnético (Osciladores):**
    Se utiliza síntesis aditiva básica combinando tres osciladores afinados en serie armónica para crear un tono áspero:
    *   *Oscilador 1 (Sine):* La fundamental pura. Aporta el "peso" grave.
    *   *Oscilador 2 (Triangle):* 2do armónico (Frecuencia Base * 2). Añade armónicos pares para darle cuerpo.
    *   *Oscilador 3 (Sawtooth):* 3er armónico (Frecuencia Base * 3). Añade un componente "eléctrico" o "zumbido de abeja".
*   **Capa 2: El Ruido Mecánico de Giro (Ruido Modulado):**
    Se genera Ruido Blanco (White Noise) que pasa a través de un Filtro Pasa-Banda (Bandpass Filter). La frecuencia central del filtro está atada a los cambios de la frecuencia base para que el ruido parezca originarse de la misma fuente.
*   **Modulación (LFO):**
    Un Oscilador de Baja Frecuencia (LFO) de tipo "Diente de Sierra" (Sawtooth) modula la amplitud (volumen) del ruido mecánico. Esta forma de onda crea una caída brusca en el volumen, emulando físicamente un engranaje o la fricción de rotación en un punto específico del ciclo (el "chug"). La velocidad de este LFO es dictada por los parámetros de "Oscilación".

*   **Envolventes y Compresión:**
    Todos los generadores pasan por ganancias individuales, luego una envolvente principal (para evitar clics o chasquidos al iniciar/cortar el sonido), y finalmente hacia un Compresor Maestro que controla los picos y engorda la mezcla resultante.

## 4. Detalles de Código y Tecnologías

El instrumento está empaquetado como un único archivo `.html` para facilitar su portabilidad.

*   **Librerías Externas:** Solo utiliza [Tailwind CSS](https://tailwindcss.com/) a través de CDN (Content Delivery Network) para la capa de presentación y diseño de la interfaz de usuario. Tailwind se usa intensivamente para lograr el estilo oscuro y utilitario de forma rápida sin archivos CSS separados.
*   **Fuentes:** 'Inter' (para texto general) y 'JetBrains Mono' (para los números e inputs) importadas vía Google Fonts.
*   **Lógica Fundamental (JavaScript Vanilla):** Toda la gestión del estado (selecciones múltiples, portapapeles, reproducción secuencial de `tracks`) está escrita en JavaScript puro, sin necesidad de frameworks de interfaz reactiva (como React o Vue).
*   **Motor de Audio:** Utiliza la API nativa del navegador `AudioContext` (Web Audio API). Los sonidos son deterministas (generados al vuelo mediante código) y no dependen de la carga de recursos externos de audio.
*   **Renderizado de Bounding Boxes:** Las áreas de envoltura de los bucles se calculan en el DOM interrogando las posiciones (`offsetLeft`, `offsetWidth`) de los elementos visuales (bloques) y pintando contenedores con una opacidad variable según su nivel de anidamiento (`depth`).