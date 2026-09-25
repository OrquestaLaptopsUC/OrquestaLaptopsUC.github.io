# Guion de presentación - PULSO 128

## 0:00-1:00 - Idea y referentes

Mi propuesta se llama **PULSO 128: Club distribuido**. Es una obra de aproximadamente seis minutos para siete laptops, construida sobre un pulso de tech house a 128 BPM. La idea principal es que ninguna laptop tenga la canción completa: cada intérprete controla una parte y el groove aparece solamente cuando el grupo se coordina.

Quiero mezclar la base del house con colores de jazz, funk y pop, además de percusión tropical y sonidos más computacionales. Mis tres referentes son **In C**, por la libertad que tiene cada intérprete dentro de reglas comunes; **NUBE**, por el uso de roles, interfaces e instrumentos que se sienten propios del computador; y **Beijing**, de la Stanford Laptop Orchestra, por la forma de distribuir y transformar materiales sonoros entre distintas estaciones.

## 1:00-3:00 - Estructura y coordinación

La obra tiene siete secciones. Primero aparece solamente el kick, junto con pequeños efectos. Después entran progresivamente hats, clap, bajo y armonía hasta formar el groove completo.

En la cuarta sección cambia el color: aparecen Rhodes, órgano, acordes con séptimas y novenas, marimba, arpa, congas y bongos. Después viene una sección de fractura donde el groove pierde estabilidad y aparecen más glitches, burbujeos y chirps. Finalmente el kick vuelve solo, hago una nueva cuenta de cuatro tiempos y todos reconstruyen el groove para llegar al punto de mayor energía antes del cierre.

La obra no necesita red local. La estación 1 mantiene el kick en negras y funciona como reloj audible. Los cambios grandes los indica un director y, cuando sea necesario, se vuelve a contar cuatro tiempos.

Los siete roles son: kick, percusión, hats, bajo, armonía, melodía y efectos digitales. Cada intérprete tiene decisiones propias, pero dentro de límites. Por ejemplo, la estación de melodía puede elegir entre piano, arpa, marimba o pluck, pero tiene que dejar espacios y no tocar permanentemente.

## 3:00-4:00 - Material sonoro

El prototipo está hecho en HTML y JavaScript usando Web Audio API. Lo puedo abrir directamente en el navegador y no usa samples ni librerías externas.

[ABRIR PULSO128_v2.html Y PRESIONAR INICIAR MOTOR]

Aquí puedo activar o silenciar los siete roles con las teclas 1 a 7. También puedo cambiar entre cuatro colores: Tech House, Jazz + Funk, Tropical y Digital/Glitch.

[CAMBIAR RAPIDAMENTE ENTRE TECH HOUSE, JAZZ + FUNK Y TROPICAL]

Además hay una biblioteca de sonidos manuales: piano, Rhodes, órgano, brass, arpa, marimba, conga, bongo y efectos digitales.

[TOCAR 2 O 3 SONIDOS, NO MAS]

La idea es que en la obra real estos controles estén repartidos entre las laptops y no concentrados en una sola interfaz.

## 4:00-5:00 - Riesgos y cierre

El principal riesgo es la sincronización, porque los computadores pueden derivar ligeramente. Por eso el kick es una referencia audible y se pueden hacer nuevas cuentas en los cambios importantes.

Otro riesgo es que haya demasiados sonidos. Para evitarlo, cada sección limita qué puede hacer cada rol y se incluyen reglas de silencio. También preparé una versión reducida para poder redistribuir funciones si falla una estación.

Lo que me interesa de la propuesta es mezclar dos cosas que hemos experimentado en el curso: por un lado, una estructura clara y roles definidos; por otro, la libertad de cada intérprete. En vez de reproducir una pista de house terminada, quiero que el carácter bailable aparezca como resultado de la coordinación del ensamble y que el computador tenga una identidad sonora propia.
