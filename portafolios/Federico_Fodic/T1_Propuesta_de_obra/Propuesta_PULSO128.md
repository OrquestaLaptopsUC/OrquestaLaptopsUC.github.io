# T1: Propuesta de obra

## PULSO 128: Club distribuido

**IEE2003 - Orquesta de Laptops UC**  
**Segundo semestre 2026**

## Idea general

**PULSO 128** es una obra de aproximadamente seis minutos para siete a doce laptops. La idea es construir una pieza bailable de **tech house a 128 BPM**, pero evitando que suene como una pista terminada reproducida por computadores. El groove aparece porque distintos intérpretes controlan partes separadas de la música y toman decisiones en tiempo real.

La base viene del house: kick en negras, bajo sincopado, hi-hats a contratiempo y acordes cortos. Sobre esa base se agregan colores que me interesa mezclar: acordes con séptimas y novenas cercanos al jazz, órgano y bajo con gestos funk, sonidos más pop, marimba, congas, bongos y arpa sintética, además de timbres claramente computacionales como burbujeos, chirps, glitches y ruido filtrado.

La experiencia del curso también influye en la idea. En *Gracias a la Vida* me interesó que cada computador tuviera una función instrumental distinta, pero sentí que podía explorarse más el carácter propio del computador como instrumento. En los ejercicios más libres me interesó especialmente lo que ocurre cuando el grupo se sincroniza, se separa un poco y luego vuelve a encontrarse. En esta propuesta esa situación deja de ser un problema y pasa a ser parte de la forma musical.

---

# Parte 1 - Contexto y referentes

## 1. In C - Terry Riley / realización web OLUC

### Qué hace

*In C* está construida a partir de 53 patrones musicales breves. En la realización web usada por la Orquesta de Laptops UC, cada intérprete comienza en el patrón 1, puede repetir cada patrón la cantidad de veces que quiera y luego avanzar en orden. La propia interfaz indica que nadie debería adelantarse más de dos o tres patrones respecto del resto y que una persona mantiene un pulso constante.

El resultado es que todos comparten el mismo material y una referencia temporal común, pero nunca ejecutan exactamente lo mismo al mismo tiempo. Se genera una textura colectiva que cambia gradualmente.

### Cómo está construida

La versión del curso está implementada como una aplicación web. Incluye los 53 patrones, control de tempo, selección de timbre y octava, y control mediante el teclado. Entre los timbres disponibles aparecen marimba, pluck, órgano, campana, cuerda y la posibilidad de cargar un sample propio.

La coordinación no depende de que todos sigan una partitura tradicional compás por compás. El sistema combina un pulso común con decisiones individuales acerca de repetición y avance.

### Qué tomo y qué no

De *In C* tomo la **libertad controlada**: cada intérprete recibe reglas simples, pero puede decidir pequeñas variaciones, silencios, fills o el momento exacto en que cambia de comportamiento. También tomo la idea de una referencia temporal clara que mantiene unido al grupo.

No quiero utilizar una secuencia extensa de patrones melódicos iguales para todos. En PULSO 128 cada estación tiene una función sonora diferente y la libertad ocurre dentro de su rol.

**Fuente consultada:** realización web OLUC de *In C*, repositorio OrquestaLaptopsUC.  
https://github.com/OrquestaLaptopsUC/OrquestaLaptopsUC.github.io/tree/main/obras/in-c

---

## 2. NUBE - Orquesta de Laptops UC

### Qué hace

*NUBE* trabaja con una textura colectiva en la que ningún intérprete produce por sí solo la obra completa. La interfaz propone ocho voces y utiliza síntesis granular. Los intérpretes modifican parámetros y hacen aparecer o desaparecer su sonido dentro de una estructura de cinco secciones.

Lo que me interesa especialmente es que el resultado no intenta imitar simplemente una banda acústica: el sonido nace de procesos propios del computador y se percibe como una masa que cambia continuamente.

### Cómo está construida

La aplicación está hecha en web y contiene la partitura, selección de voz, distintos materiales de origen y controles de síntesis granular. El código de la obra indica explícitamente que es un archivo autónomo, sin servidor ni red local entre laptops, y que la sincronía se obtiene usando el reloj del sistema operativo.

Cada voz recibe indicaciones diferentes y la propia interfaz muestra el tiempo, la sección actual y rangos de parámetros que el intérprete debe buscar usando las teclas y el oído.

### Qué tomo y qué no

De *NUBE* tomo tres ideas: **roles diferentes por estación**, una **interfaz que entrega instrucciones al intérprete** y el uso de **timbres que se sienten computacionales**. También me interesa que la obra pueda funcionar sin depender de una red local.

No quiero usar síntesis granular como mecanismo principal porque mi obra necesita ataques rítmicos más definidos para producir un groove de house. En cambio usaría síntesis sustractiva, ruido, sonidos percusivos y algunos procesos digitales breves.

**Fuente consultada:** código e interfaz de *NUBE*, repositorio OrquestaLaptopsUC.  
https://github.com/OrquestaLaptopsUC/OrquestaLaptopsUC.github.io/tree/main/obras/nube

---

## 3. Beijing - Madeline Huberth y Ge Wang, Stanford Laptop Orchestra (2014)

### Qué hace

*Beijing* es una obra de la Stanford Laptop Orchestra construida a partir de sonidos cotidianos grabados en Beijing. Sus tres partes utilizan materiales asociados al metro, la comida y el tráfico. Los sonidos originales siguen siendo reconocibles, pero son procesados en tiempo real y se convierten en acordes y patrones rítmicos distribuidos entre varios parlantes.

### Cómo está construida

La página oficial de SLOrk publica plan, partitura, código en ChucK y una grabación. Según sus notas de programa, todos los sonidos parten de grabaciones reales de Beijing y luego se procesan en tiempo real. El material se distribuye entre varios parlantes hemisféricos de la orquesta.

### Qué tomo y qué no

De *Beijing* tomo la idea de que una laptop orchestra puede mezclar **ritmo, armonía, procesamiento y espacialización**, y que el color de la obra puede venir de una colección muy diversa de timbres. Esto se relaciona con mi intención de mezclar elementos de club con piano/Rhodes, órgano, arpa, marimba, percusión tropical y sonidos digitales.

No quiero basar PULSO 128 en grabaciones de una ciudad específica ni en un concepto documental. El centro de mi obra es el groove colectivo y la interacción entre intérpretes.

**Fuente consultada:** Stanford Laptop Orchestra, página oficial de *Beijing*.  
https://slork.stanford.edu/works/beijing/

---

# Parte 2 - Propuesta de obra

## 1. Título e idea

**PULSO 128: Club distribuido** propone convertir a la Orquesta de Laptops en una especie de sistema de club repartido entre personas. Ningún computador contiene la canción completa. Cada estación controla una capa y la música aparece solamente cuando el ensamble se escucha y coordina.

La obra cruza dos comportamientos que hemos trabajado durante el curso: por una parte, funciones claramente asignadas como en *Gracias a la Vida*; por otra, libertad individual dentro de reglas, como en *In C* y en las experiencias de improvisación. A esto se suma un lenguaje sonoro más ligado a la síntesis y al procesamiento digital, tomando como referencia *NUBE* y la distribución de materiales de *Beijing*.

## 2. Estructura formal

El tempo permanece en **128 BPM**, compás 4/4. A ese tempo un compás dura 1,875 segundos. La propuesta usa 192 compases, equivalentes a seis minutos.

| Sección | Tiempo | Compases | Qué ocurre |
|---|---:|---:|---|
| I. Arranque | 0:00-0:30 | 16 | Aparece el kick. Entran ruido, shaker y pequeños FX. El pulso queda establecido. |
| II. Ensamble | 0:30-1:15 | 24 | Se agregan hi-hats, clap, bajo y primeros stabs armónicos. Cada entrada se hace por señal del director. |
| III. Groove tech-house | 1:15-2:15 | 32 | Se completa el groove. Hay pequeñas variaciones permitidas por rol y fills breves. |
| IV. Cruce jazz/funk/tropical | 2:15-3:30 | 40 | Rhodes, órgano, acordes con 7ª/9ª, marimba, congas, bongos y arpa entran por bloques. La música sigue siendo bailable, pero el color cambia. |
| V. Fractura digital | 3:30-4:15 | 24 | Se retiran varias capas estables. Aumentan glitches, burbujeos, chirps y silencios. Algunos intérpretes pueden desplazar sus ataques respecto del pulso. |
| VI. Reencuentro / peak | 4:15-5:30 | 40 | El kick vuelve solo durante cuatro tiempos. El director cuenta la nueva entrada y las capas regresan hasta llegar al punto de mayor energía. |
| VII. Apagado | 5:30-6:00 | 16 | Los roles desaparecen uno por uno. Queda una armonía corta, un sonido de arpa y un último efecto digital. |

La forma general puede resumirse como **pulso -> acumulación -> groove -> expansión de color -> fractura -> reencuentro -> apagado**.

## 3. Estrategia de coordinación

La obra está diseñada para **no depender de una red local**.

La estación 1 mantiene el kick en negras y funciona como reloj audible. Todas las estaciones trabajan a 128 BPM y el director marca el inicio y los cambios importantes de sección con gestos claros. En el comienzo de cada gran sección puede hacerse una cuenta de cuatro tiempos para corregir cualquier deriva entre computadores.

Dentro de una sección no se exige sincronía perfecta en cada evento. El groove principal sí debe permanecer reconocible, pero los roles melódicos, armónicos y de efectos pueden decidir cuándo intervenir dentro de ventanas determinadas.

Si en el futuro se quisiera agregar OSC, podría utilizarse solo para mostrar automáticamente el número de sección en todas las interfaces. No es necesario para ejecutar la obra.

## 4. Roles por estación

### Estación 1 - Kick / pulso

Mantiene la referencia principal de 128 BPM. En las secciones estables toca cuatro golpes por compás. Solo puede retirar el kick cuando la partitura lo indica.

### Estación 2 - Percusión

Controla clap, congas, bongos y cowbell. En las secciones iniciales cumple una función simple; en la sección tropical y en los fills obtiene mayor libertad.

### Estación 3 - Hats / shaker

Controla hi-hat cerrado, abierto, shaker y ruido corto. Su función principal es modificar la sensación de energía sin cambiar el tempo.

### Estación 4 - Bajo

Interpreta un patrón de bajo tech-house y puede cambiar entre una versión estable y una variante más sincopada de carácter funk. También controla el brillo del filtro.

### Estación 5 - Armonía

Controla stabs house, Rhodes, órgano y acordes con séptimas y novenas. La progresión base es **Fm9 - Dbmaj9 - Abmaj9 - Eb9**.

### Estación 6 - Melodía / color

Utiliza arpa sintética, marimba, piano y synth pluck. No toca una melodía continua: realiza respuestas cortas y deja espacios para no saturar el groove.

### Estación 7 - FX digital

Produce burbujeos, chirps, glitches, ruido filtrado y risers. Su presencia es pequeña al comienzo y aumenta en la sección V.

### Estaciones 8-12

Si existen intérpretes adicionales, pueden duplicarse algunos roles con material distinto: percusión secundaria, segunda capa armónica, melodía alternativa, ambiente o FX. Las estaciones duplicadas deberían ubicarse en posiciones diferentes de la sala para ampliar el efecto espacial.

## 5. Notación e instrucciones de ejecución

Cada intérprete utilizaría una interfaz con su rol, la sección actual, los controles permitidos y una indicación aproximada de intensidad. La notación es principalmente textual y por escenas.

### Boceto de partitura - Sección IV: Cruce jazz/funk/tropical

| Rol | Instrucción |
|---|---|
| Kick | Mantén negras constantes. No hacer fills. |
| Percusión | Durante 8 compases usa clap. Luego agrega conga/bongo en intervenciones cortas. |
| Hats | Contratiempo estable. Cada 8 compases puedes abrir un hi-hat al final. |
| Bajo | Mantén el patrón base; una vez cada 4 compases puedes usar la variante funk. |
| Armonía | Alterna Rhodes y órgano. Máximo un ataque por cada dos tiempos. |
| Melodía | Responde con marimba, arpa o piano. No más de cuatro eventos por compás. Deja silencios. |
| FX | Intervenciones muy breves. Evitar cubrir la percusión o el bajo. |

En la sección V las instrucciones cambian: los roles 5, 6 y 7 obtienen más libertad, mientras el kick se reduce y el grupo deja aparecer pequeñas desalineaciones. Al entrar a la sección VI todos esperan una nueva cuenta de cuatro tiempos.

## 6. Sonido en la sala

Cada estación utiliza su propio sistema de parlantes. Esto permite que el público perciba físicamente las distintas capas del groove. Intentaría separar roles similares: percusión y hats en lados diferentes, armonía y melodía alejadas entre sí, y FX en una posición opuesta al bajo.

En la sección IV se pueden producir respuestas espaciales entre marimba/harpa y Rhodes/órgano. En la sección V los efectos digitales pueden aparecer desde distintos puntos de la sala, haciendo que la pérdida de estabilidad rítmica también se perciba espacialmente.

## 7. Riesgos y versión reducida

**Deriva temporal entre laptops.** Solución: el kick funciona como referencia audible y el director vuelve a contar cuatro tiempos al entrar a secciones importantes.

**Demasiadas capas simultáneas.** Solución: cada sección restringe qué sonidos puede usar cada rol y se incluyen reglas explícitas de silencio.

**Desbalance de volumen entre estaciones.** Solución: realizar una prueba de nivel antes del ensayo y limitar el nivel máximo de cada interfaz.

**Problemas de navegador o audio.** Solución: usar un archivo HTML autónomo, sin librerías ni samples externos. La versión base del prototipo fue probada en Safari en macOS. La versión 2 fue verificada en un navegador Chromium; antes de entregar conviene abrirla una vez en Safari para confirmar el audio.

**Versión reducida.** Si durante un ensayo falla una estación, la obra puede continuar redistribuyendo temporalmente sus funciones. Una versión mínima de emergencia mantiene cuatro funciones: (1) kick + hats, (2) percusión + bajo, (3) armonía + melodía y (4) FX. La propuesta normal está pensada y ensayada para siete intérpretes.

---

# Parte 3 - Material sonoro

## Prototipo: PULSO128_v2.html

El material funcional es una aplicación web autónoma realizada en HTML y JavaScript con Web Audio API. No utiliza archivos de audio externos ni requiere instalación.

El prototipo incluye siete roles y una biblioteca de timbres más amplia que la primera versión:

- kick;
- clap;
- hi-hat cerrado y abierto;
- shaker;
- conga;
- bongo;
- cowbell;
- bajo sintetizado;
- piano house;
- Rhodes;
- órgano funk;
- brass stab;
- arpa sintética;
- marimba;
- synth pluck;
- burbujas;
- chirps;
- glitches;
- riser de ruido.

También existen cuatro colores o escenas: **Tech House**, **Jazz + Funk**, **Tropical** y **Digital / Glitch**. Todas mantienen el mismo pulso de 128 BPM, pero modifican qué timbres aparecen automáticamente.

## Controles principales

- **INICIAR MOTOR:** activa el AudioContext y el secuenciador.
- **DETENER:** detiene el secuenciador.
- **1-7:** activa o silencia los siete roles.
- **A, S, D, F, G, H, J, K, Z, X, C, V, B, N, M y coma:** disparan sonidos individuales.
- **Espacio:** ejecuta un fill corto.
- **Brillo:** modifica el filtrado de los elementos armónicos y graves.
- **Intensidad:** modifica el nivel general.
- **Ambiente:** controla cuánto sonido entra al delay.

## Cómo reproducirlo

1. Abrir `PULSO128_v2.html` en Safari, Chrome o Firefox.
2. Presionar **INICIAR MOTOR**.
3. Cambiar entre las cuatro escenas para escuchar diferentes combinaciones de timbres.
4. Activar y silenciar roles con las teclas 1 a 7.
5. Probar la biblioteca con las teclas indicadas en pantalla.
6. Presionar espacio para hacer un fill.

La versión base fue probada en Safari en macOS. La versión 2 fue verificada en Chromium; antes de entregar conviene abrir `PULSO128_v2.html` una vez en Safari para confirmar el audio.

## Render de audio

Se incluye `pulso128_demo_45s.wav`, un render estéreo de 45 segundos a 44,1 kHz. Resume varias situaciones de la propuesta: introducción, groove tech-house, color jazz/funk, percusión tropical, sección de mayor energía y cierre.

## Papel del material dentro de la obra

El prototipo no representa una laptop tocando toda la obra en el concierto. Su función es demostrar el **vocabulario sonoro** y la lógica rítmica. En la ejecución final, los controles se repartirían entre las estaciones según los siete roles descritos anteriormente.

---

# Declaración de uso de IA

Para esta tarea utilicé **ChatGPT (OpenAI)** como herramienta de apoyo. Lo usé para organizar la propuesta, buscar y verificar referentes, transformar mis ideas musicales en una estructura ejecutable para siete laptops, desarrollar y revisar código JavaScript/Web Audio API y preparar una documentación inicial del prototipo.

La dirección musical fue definida a partir de mis intereses y de mi experiencia en el curso: trabajar a 128 BPM, utilizar una base tech-house, mezclarla con elementos de jazz, funk, pop y sonidos tropicales, mantener libertad de interpretación y utilizar timbres más computacionales que los de una banda tradicional. Probé personalmente la versión base del prototipo en Safari. La versión 2 mantiene la misma lógica general, amplía la biblioteca sonora y fue verificada en Chromium.

**Prompt relevante utilizado:**

> Quiero crear una propuesta para la Orquesta de Laptops basada en música electrónica tech-house a 128 BPM. En el curso hemos trabajado con In C, NUBE, Campo y Gracias a la Vida, usando interfaces web donde cada computador tiene un rol distinto. Quiero mantener libertad para el intérprete, pero construir un groove bailable y agregar una biblioteca de timbres con piano, Rhodes, órgano, arpa, marimba, percusión tropical y sonidos digitales como burbujeos y glitches. Ayúdame a estructurar la obra y a construir un prototipo funcional en HTML y JavaScript que pueda ejecutarse sin dependencias externas.

---

# Fuentes consultadas

1. Orquesta de Laptops UC. *In C - realización web OLUC*. Repositorio público.  
   https://github.com/OrquestaLaptopsUC/OrquestaLaptopsUC.github.io/tree/main/obras/in-c

2. Orquesta de Laptops UC. *NUBE*. Repositorio público.  
   https://github.com/OrquestaLaptopsUC/OrquestaLaptopsUC.github.io/tree/main/obras/nube

3. Stanford Laptop Orchestra. Madeline Huberth y Ge Wang, *Beijing* (2014).  
   https://slork.stanford.edu/works/beijing/
