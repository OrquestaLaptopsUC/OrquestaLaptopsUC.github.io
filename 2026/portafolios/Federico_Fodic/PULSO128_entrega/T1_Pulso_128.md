# T1: Propuesta de obra — PULSO 128

## Idea general

**PULSO 128** es una obra para orquesta de laptops basada en un pulso de house a **128 BPM**. La idea es tomar una estructura que normalmente se escucha muy precisa y repetitiva, como en la música electrónica de baile, y repartirla entre varios intérpretes. Cada computador controla una parte distinta del sonido: kick, percusión, hi-hat, bajo, acordes, arpegios o efectos digitales.

La obra parte muy ordenada, después se va desarmando y dejando más libertad a los intérpretes, y finalmente vuelve a sincronizarse. Me interesa trabajar justamente con algo que hemos vivido en clases: a veces todos terminamos muy coordinados y otras veces el grupo se empieza a desplazar o perder. En vez de tratar ese desfase solamente como un error, la propuesta lo usa como parte de la forma de la obra.

Quiero además que el sonido sea claramente computacional. Por eso no se basa solo en imitar instrumentos tradicionales, sino que mezcla sonidos de house con síntesis, ruido, burbujeos, glitches y timbres que no tienen un equivalente acústico directo.

---

# Parte 1 — Contexto y referentes

## 1. NUBE — Orquesta de Laptops UC

### Qué hace

NUBE es una obra para ocho voces de laptop y dura aproximadamente siete minutos. En vez de trabajar con melodías tradicionales, construye una textura colectiva a partir de síntesis granular. Los intérpretes producen granos sonoros que cambian en densidad, duración, altura y dispersión. La obra está dividida en cinco secciones y cada intérprete recibe instrucciones ligeramente distintas.

Lo interesante es que el resultado no depende de una sola persona haciendo una melodía, sino de la suma de muchas acciones pequeñas. El objetivo es que entre todos se forme una textura común.

### Cómo está construida

La obra funciona en una interfaz web. Cada intérprete selecciona una voz y controla parámetros del sonido desde el teclado. El sonido aparece al mantener apretada la barra espaciadora y desaparece al soltarla. La partitura contiene instrucciones temporales y rangos de parámetros para cada sección.

No depende de una red local entre computadores. La sincronización se obtiene usando el reloj del sistema operativo y un inicio común. Esto permite que cada computador ejecute su parte de forma independiente.

### Qué tomaría para mi propuesta

De NUBE tomaría principalmente dos ideas. La primera es que cada computador tenga un rol distinto pero que el resultado solo tenga sentido cuando se escuchan todos juntos. La segunda es usar una interfaz clara que indique al intérprete qué puede hacer en cada momento.

También me interesa el uso de sonidos claramente digitales. Para PULSO 128 quiero conservar esa exploración tímbrica, pero dentro de una estructura rítmica más cercana al house.

Lo que no tomaría es la síntesis granular como elemento principal, porque mi propuesta necesita ataques rítmicos más claros y una referencia fuerte de pulso.

**Fuente consultada:** código e interfaz de NUBE en el repositorio de Orquesta de Laptops UC:  
https://raw.githubusercontent.com/OrquestaLaptopsUC/OrquestaLaptopsUC.github.io/main/obras/nube/index.html

---

## 2. In C — Terry Riley / realización web OLUC

### Qué hace

In C está construida a partir de muchos patrones musicales pequeños. Los intérpretes repiten un patrón y luego avanzan al siguiente, pero no todos tienen que avanzar exactamente al mismo tiempo. Esto hace que la obra tenga una estructura común, pero permita diferencias entre intérpretes.

En la realización web utilizada en el curso aparecen 53 patrones y el intérprete puede navegar entre ellos, repetirlos y modificar algunos aspectos de la interpretación como el timbre, la octava y la articulación.

### Cómo está construida

La interfaz permite escoger distintos timbres y controlar el tempo. La versión del curso usa 120 BPM por defecto y permite cambiarlo. Cada patrón puede tocarse y repetirse desde el teclado, de manera que cada intérprete toma decisiones en tiempo real sobre cuánto permanecer en una figura antes de avanzar.

Esto genera una combinación interesante entre reglas claras y libertad individual.

### Qué tomaría para mi propuesta

De In C me interesa especialmente la libertad controlada. En PULSO 128 quiero que exista un pulso común muy claro, pero que cada intérprete pueda decidir cuándo agregar un fill, cambiar una variación, aumentar intensidad o callar durante algunos compases.

La diferencia es que mi propuesta no estaría formada por 53 patrones melódicos consecutivos. Cada estación tendría una función sonora fija dentro de un groove de house.

**Fuente consultada:** realización web de In C utilizada por OLUC:  
https://raw.githubusercontent.com/OrquestaLaptopsUC/OrquestaLaptopsUC.github.io/main/obras/in-c/index.html

---

## 3. Twilight — Ge Wang / Stanford Laptop Orchestra

### Qué hace

Twilight es una obra para laptop orchestra compuesta por Ge Wang para SLOrk. La obra utiliza sonidos electrónicos, gestos físicos e interacción entre grupos de intérpretes. La partitura propone al menos seis intérpretes, idealmente ocho o más, divididos en dos grupos.

Uno de los elementos que me parece más interesante es que la interpretación no consiste simplemente en presionar play. Los intérpretes responden a indicaciones del director y modifican el sonido usando interfaces gestuales.

### Cómo está construida

La obra fue desarrollada para la Stanford Laptop Orchestra y su documentación incluye partitura y código en ChucK. La partitura divide a los intérpretes en grupos y utiliza señales del director para coordinar entradas, cambios y movimientos. También se utilizan controladores gestuales GameTrak para modificar los sonidos.

### Qué tomaría para mi propuesta

De Twilight tomaría la idea de que el computador sea realmente un instrumento interpretado en vivo y no solamente un reproductor. También me interesa que existan funciones distintas dentro del ensamble y que la coordinación pueda depender de señales humanas.

No utilizaría GameTrak porque no es una interfaz garantizada para nuestro curso. En PULSO 128 todos los controles principales se pueden realizar con teclado, mouse o trackpad.

**Fuentes consultadas:**  
Stanford Laptop Orchestra — Twilight: https://slork.stanford.edu/works/twilight/  
Partitura: https://slork.stanford.edu/works/twilight/twilight.pdf

---

# Parte 2 — Propuesta de obra

## 1. Título provisorio e idea

**PULSO 128** propone construir una pieza de house en vivo entre siete o más laptops. En vez de que una sola persona controle una pista completa, cada integrante controla una capa del groove. La obra comienza con elementos separados, alcanza momentos donde el grupo funciona como una sola máquina rítmica, entra después en una sección de mayor libertad y desfase, y finalmente vuelve a sincronizarse.

La relación con los referentes está en tres aspectos: de NUBE tomo la distribución de funciones entre distintas laptops y el interés por timbres digitales; de In C tomo la libertad del intérprete dentro de reglas simples; y de Twilight tomo la idea de que cada computador sea interpretado activamente y que la coordinación humana forme parte de la obra.

## 2. Estructura formal

La obra dura aproximadamente **6 minutos**, siempre alrededor de **128 BPM** y en 4/4.

| Sección | Tiempo | Duración | Qué sucede |
|---|---:|---:|---|
| I. Encendido | 0:00–0:30 | 16 compases | Comienza solo el kick. Aparecen sonidos digitales cortos y burbujeos. Los demás escuchan el pulso antes de entrar. |
| II. Construcción | 0:30–1:30 | 32 compases | Entran progresivamente hi-hat, percusión, bajo y acordes. Cada nueva capa entra por señal del director. |
| III. Groove | 1:30–2:30 | 32 compases | Suena el ensamble completo. Los intérpretes pueden introducir pequeñas variaciones y fills sin perder el pulso. |
| IV. Desfase | 2:30–3:30 | 32 compases | Se reduce el kick y aumenta la libertad. Algunos patrones pueden desplazarse o repetirse más tiempo. Aparecen glitches y texturas digitales. |
| V. Reencuentro | 3:30–5:00 | 48 compases | El kick vuelve solo. El director hace una cuenta de cuatro tiempos y las estaciones se vuelven a incorporar. Es la sección de mayor energía. |
| VI. Apagado | 5:00–6:00 | 32 compases | Las capas desaparecen una por una. Quedan efectos digitales y finalmente un último pulso aislado. |

La forma completa sigue una trayectoria de **orden → acumulación → desorden → reencuentro → desaparición**.

## 3. Estrategia de coordinación

La obra no necesita una red local para funcionar.

La estación 1 produce el kick en negras a 128 BPM y funciona como referencia auditiva para todo el ensamble. Antes de empezar, todos los intérpretes configuran su interfaz a 128 BPM. El inicio se hace con una cuenta de cuatro tiempos del director.

Los cambios grandes de sección son indicados por el director con una señal de mano y aparecen también en una línea de tiempo dentro de la interfaz. En los momentos de mayor libertad no es necesario que todos los sonidos estén perfectamente alineados, pero al comenzar la sección V todos vuelven a escuchar el kick y se sincronizan con una nueva cuenta de cuatro tiempos.

Si existiera red local, podría agregarse más adelante un mensaje OSC que indique cambios de sección, pero la obra está diseñada para funcionar completamente sin OSC.

## 4. Roles por estación

### Estación 1 — Kick / pulso
Mantiene el patrón de cuatro golpes por compás. Puede controlar intensidad y hacer silencios solamente cuando la partitura lo permite. Es la principal referencia temporal del ensamble.

### Estación 2 — Clap + percusión
Toca clap en los tiempos 2 y 4 y puede agregar variaciones con sonidos tipo bongo o percusión sintética durante los fills.

### Estación 3 — Hi-hat / ruido
Controla hi-hats cerrados, abiertos y capas de ruido filtrado. Puede cambiar el brillo y la densidad para aumentar o disminuir energía.

### Estación 4 — Bass
Interpreta un patrón de bajo sintetizado. Puede elegir entre una versión simple y una versión más sincopada, además de abrir o cerrar el filtro.

### Estación 5 — Chords / pad
Controla acordes cortos y pads. La progresión base propuesta es **Fm – Db – Ab – Eb**, pero el intérprete decide en qué momentos hacer ataques cortos o sostener una textura.

### Estación 6 — Arpegio / pluck
Genera notas cortas y repetitivas. Puede aumentar la densidad durante las secciones de construcción y reencuentro.

### Estación 7 — FX digital
Produce sonidos que no intentan imitar instrumentos acústicos: burbujeos, chirps, glitches, ruido filtrado y pequeños ecos. Tiene mayor libertad durante la sección de desfase.

### Si existen estaciones 8–12
Las estaciones adicionales pueden duplicar funciones pero con materiales distintos: una segunda percusión, otro arpegio, texturas graves, ruido espacial o una segunda estación de efectos. Las duplicaciones deberían distribuirse físicamente lejos de la estación original para generar movimiento en el espacio.

## 5. Notación e instrucciones de ejecución

Cada intérprete tendría una interfaz con:

- nombre de su rol;
- sección actual;
- contador de tiempo;
- acciones permitidas en esa sección;
- teclas disponibles;
- una indicación de intensidad aproximada: baja, media o alta.

Las instrucciones no necesitan indicar cada nota de forma exacta. Por ejemplo, para la estación de FX durante la sección IV podría aparecer:

> Durante 8 compases haz intervenciones cortas. Deja siempre espacios de silencio. En los siguientes 8 compases aumenta la densidad. Cuando aparezca la señal REENCUENTRO, deja de tocar y espera cuatro tiempos antes de volver a entrar.

De esta manera existe una estructura clara, pero todavía queda interpretación en tiempo real.

## 6. Sonido en la sala

Cada estación utiliza su propio sistema de parlantes, de manera que las capas de la obra están físicamente separadas. Esto permite que el público pueda percibir de dónde viene cada elemento del groove.

Intentaría separar espacialmente estaciones con funciones parecidas. Por ejemplo, percusión y hi-hat no quedarían juntas, y los efectos digitales podrían ubicarse en posiciones opuestas. Durante la sección de desfase esto permitiría escuchar sonidos apareciendo desde distintas zonas del ensamble.

No se necesita un sistema central de mezcla para que la obra funcione.

## 7. Riesgos y versión reducida

### Riesgo 1: pérdida de sincronización
Es posible que los relojes internos de distintos navegadores tengan pequeñas diferencias o que algún intérprete pierda el pulso.

**Solución:** el kick de la estación 1 funciona como reloj audible. En puntos importantes el director puede hacer una nueva cuenta de cuatro tiempos.

### Riesgo 2: un computador o instrumento deja de funcionar

**Solución:** la interfaz puede incluir varias capas. Si una estación falla, otro intérprete puede activar temporalmente ese rol.

### Riesgo 3: demasiados sonidos al mismo tiempo

El house depende mucho de dejar espacio entre elementos. Si todas las estaciones improvisan demasiado, el resultado puede saturarse.

**Solución:** cada sección limita qué parámetros y variaciones están permitidos.

### Versión reducida

La obra todavía puede funcionar con cuatro funciones principales: kick, bajo, acordes y efectos. Las estaciones restantes pueden permanecer en silencio o duplicar alguna de estas funciones si existe un problema técnico.

---

# Parte 3 — Material sonoro

## Prototipo

El material desarrollado para esta propuesta es una aplicación web llamada **pulso128.html**. Está programada en HTML y JavaScript usando Web Audio API y no necesita librerías externas ni archivos de audio pregrabados.

El prototipo genera seis capas:

1. kick sintetizado;
2. clap/percusión;
3. hi-hat mediante ruido filtrado;
4. bajo sintetizado;
5. acordes electrónicos;
6. efectos de burbujeo y chirps digitales.

El tempo se mantiene fijo en 128 BPM. Las capas se pueden activar y desactivar con las teclas 1 a 6 y existe un fill activado con la barra espaciadora.

## Cómo abrirlo

1. Abrir `pulso128.html` en Chrome, Safari o Firefox.
2. Presionar **INICIAR 128 BPM** para autorizar el audio del navegador.
3. Usar las teclas 1 a 6 para activar o desactivar capas.
4. Usar la barra espaciadora para ejecutar un fill.
5. Los controles de brillo e intensidad modifican el timbre y el nivel general.

## Render

La propia interfaz contiene un botón **EXPORTAR DEMO 45 s (.wav)**. Este genera localmente un render estéreo de 45 segundos usando la misma lógica de síntesis del prototipo.

Para la entrega se incluye también el archivo `pulso128_demo_45s.wav`.

## Papel dentro de la obra

El prototipo demuestra la estética general de PULSO 128 y especialmente los roles de las estaciones de ritmo, bajo, acordes y efectos. En la versión final de la obra no sería necesario que una sola estación controlara todas estas capas: el código puede separarse para entregar a cada intérprete solamente los controles correspondientes a su rol.

El sonido de burbujas y chirps es especialmente importante porque agrega el carácter computacional que quiero incorporar y evita que la obra se transforme solamente en una imitación digital de una banda tradicional.

---

# Declaración de uso de IA

Para esta tarea utilicé **ChatGPT (OpenAI)** como apoyo para organizar la propuesta, investigar y contrastar referentes, estructurar la forma de la obra y desarrollar una primera versión del instrumento web en JavaScript/Web Audio API. También se utilizó IA para ayudar a documentar el funcionamiento del código y generar el material sonoro de prueba.

Las decisiones principales de la propuesta —trabajar con música house a 128 BPM, repartir las capas musicales entre distintas laptops, incorporar sonidos digitales y utilizar momentos de sincronización y desfase— fueron definidas a partir de mis intereses y de las experiencias realizadas durante el curso.

### Prompt relevante

> Quiero crear una propuesta para Orquesta de Laptops basada en música electrónica house a 128 BPM. En el curso hemos trabajado con In C, Nube, Campo y Gracias a la Vida, usando interfaces web donde cada computador tiene un rol distinto. Me interesa mantener la libertad de interpretación que hemos usado en clases, pero combinarla con un groove de house y sonidos más computacionales como burbujeos, glitches y síntesis. Ayúdame a estructurar la obra, elegir referentes y crear un prototipo sonoro funcional en HTML y JavaScript.

---

# Guion corto para presentación oral (5 minutos)

**0:00–1:00 — Idea y referentes**  
Mi propuesta se llama PULSO 128. Es una obra de aproximadamente seis minutos donde siete laptops construyen en conjunto un groove de house a 128 BPM. Me basé en NUBE por la distribución de funciones y los timbres digitales, en In C por la libertad del intérprete dentro de reglas simples, y en Twilight de SLOrk por la idea de usar cada laptop como un instrumento realmente interpretado en vivo.

**1:00–3:00 — Estructura y coordinación**  
La obra empieza solamente con el kick, después se agregan las demás capas hasta llegar a un groove completo. En la mitad aparece una sección de desfase donde los intérpretes tienen mayor libertad y luego el kick vuelve a ordenar al grupo. Cada laptop tiene un rol: kick, percusión, hi-hat, bajo, acordes, arpegio o efectos. No necesito red: el kick funciona como referencia y los cambios importantes se hacen con señales del director.

**3:00–4:00 — Material sonoro**  
El prototipo que hice funciona en el navegador y genera todos los sonidos mediante Web Audio API. No usa samples externos. Puedo prender y apagar las capas, cambiar el brillo y hacer fills. La idea es que en la obra final estas funciones se repartan entre los intérpretes.

**4:00–5:00 — Riesgos y cierre**  
El principal riesgo es que los computadores se desincronicen, pero eso se resuelve usando el kick como reloj audible y haciendo cuentas de cuatro tiempos en los puntos importantes. Si falla una estación, otro computador puede asumir temporalmente esa capa. Lo que me interesa de la obra es mezclar la precisión del house con la incertidumbre de un grupo de personas tocando computadores en vivo.
