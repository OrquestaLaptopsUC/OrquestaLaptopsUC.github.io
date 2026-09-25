# Documentación técnica - PULSO 128

## Archivo

`PULSO128_v2.html`

## Entorno

Aplicación web autónoma desarrollada en HTML, CSS y JavaScript usando **Web Audio API**. No utiliza librerías externas, servidor, samples ni conexión a internet para producir sonido.

La versión base fue probada en Safari en macOS. La versión 2 fue verificada en Chromium; se recomienda una última prueba en Safari antes de subirla.

## Objetivo

Demostrar el vocabulario sonoro de la propuesta **PULSO 128: Club distribuido**. El prototipo reúne los siete roles en una sola interfaz para facilitar la prueba. En una ejecución con la Orquesta de Laptops, estos roles se repartirían entre intérpretes.

## Inicio rápido

1. Abrir `PULSO128_v2.html` en Safari, Chrome o Firefox.
2. Presionar **INICIAR MOTOR**. Este clic es necesario porque los navegadores bloquean audio automático.
3. Dejar sonar el groove o cambiar de escena.
4. Usar 1-7 para silenciar/activar roles.
5. Usar las teclas de la biblioteca para disparar sonidos manualmente.
6. Presionar espacio para un fill.

## Roles automáticos

| Tecla | Rol | Función |
|---|---|---|
| 1 | Kick / pulso | Kick en negras, referencia temporal |
| 2 | Percusión | Clap, conga, bongo, cowbell |
| 3 | Hats / shaker | Contratiempo, brillo y energía |
| 4 | Bajo | Patrón tech-house con síncopas |
| 5 | Armonía | Stabs, Rhodes y órgano |
| 6 | Melodía | Arpa, marimba, piano y pluck |
| 7 | FX digital | Burbujeos, chirps, glitches y risers |

## Escenas

**TECH HOUSE:** groove base con kick, bajo, hats y stabs.  
**JAZZ + FUNK:** más Rhodes, acordes extendidos, órgano y síncopas.  
**TROPICAL:** shaker, conga, bongo, marimba y color más luminoso.  
**DIGITAL / GLITCH:** reduce elementos tradicionales y aumenta procesos sintéticos y efectos.

## Biblioteca manual

| Tecla | Sonido |
|---|---|
| A | Piano house |
| S | Rhodes jazz |
| D | Órgano funk |
| F | Brass stab |
| G | Arpa sintética |
| H | Marimba tropical |
| J | Synth pluck |
| K | Cowbell |
| Z | Conga |
| X | Bongo |
| C | Shaker |
| V | Clap |
| B | Burbuja |
| N | Chirp |
| M | Glitch |
| , | Riser |

## Parámetros

**Brillo:** frecuencia de corte del bus tonal. Cambia especialmente bajo, armonía y melodía.  
**Intensidad:** ganancia global previa al compresor.  
**Ambiente:** cantidad enviada a un delay corto con realimentación.  
**Fill:** ráfaga breve de hats, percusión y FX para marcar transición.

## Síntesis

Los sonidos son generados en tiempo real. El kick usa un oscilador sinusoidal con caída rápida de frecuencia; los hats y shaker usan ruido; las percusiones combinan ruido y osciladores; bajo, piano, Rhodes, órgano, arpa, marimba y pluck utilizan osciladores y envolventes; los FX utilizan barridos de frecuencia, ruido y patrones breves.

La progresión armónica principal es **Fm9 - Dbmaj9 - Abmaj9 - Eb9**. El tempo está fijado en **128 BPM**.

## Render incluido

`pulso128_demo_45s.wav`

- duración: 45 segundos;
- estéreo;
- 44,1 kHz;
- 16 bits PCM.

El render muestra una secuencia abreviada de los colores tech-house, jazz/funk, tropical y digital utilizados en la propuesta.

## Solución de problemas

**No suena nada:** presionar primero INICIAR MOTOR y revisar que la pestaña no esté silenciada.  
**Una tecla no responde:** hacer clic una vez sobre el fondo de la página para devolver el foco al documento.  
**El sonido satura:** bajar Intensidad.  
**Safari suspende el audio:** volver a presionar INICIAR MOTOR después de interactuar con la página.

## Archivos asociados

- `PULSO128_v2.html`: prototipo funcional.
- `pulso128_demo_45s.wav`: render solicitado.
- `Propuesta_PULSO128.pdf`: propuesta completa.
- `Documentacion/Interfaz.png`: imagen de referencia de la interfaz, si se incluye.
