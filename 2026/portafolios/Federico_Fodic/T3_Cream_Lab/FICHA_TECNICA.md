# Cream Lab — montaje, controles y contingencias

Versión solista autorizada según Federico · una laptop · 124 BPM · duración libre. La aplicación contiene 66 sonidos dentro de `index.html`; 24 loops adicionales se generan en el navegador. No usa internet, OSC ni otras estaciones. Salida estéreo del Mac a un par de parlantes o a una interfaz de audio. Proyección visual de la mezcla: opcional. La ESP32 y su panel aún no están garantizados: mouse/trackpad controlan toda la obra.

## Arranque

1. Abre la página publicada de Cream Lab desde el portafolio en GitHub Pages, usando Chrome de escritorio en el Mac de concierto. El HTML incluye los sonidos, scripts y estilos.
2. Comprueba que se muestran los pads y controles. Para la presentación con GitHub Pages hace falta acceso al sitio; si se usa una red local aislada, sirve el mismo archivo `index.html` por HTTP desde uno de los computadores.
3. Baja el volumen de los parlantes, pulsa **Iniciar audio** y verifica que todos los pads están apagados. La salida parte silenciosa; P5/P6 comienzan en 55 %, F1/F2/delay/reverb en cero. Ajusta el nivel de referencia con los parlantes reales antes de la función (pendiente de ensayo).
4. Toca libremente. Si quieres registrar el resultado, pulsa **Grabar obra**, al final **Finalizar grabación** y **Descargar obra**. El audio se guarda solo si haces clic en descargar. Pulsa **Detener todo** para silenciar la mezcla.

Tiempo de montaje esperado: menos de cinco minutos, **no medido** en una laptop OLUC. El equipo real, interfaz, volumen de sistema y nivel de referencia deben anotarse después de la prueba. En Chrome con HTTPS de GitHub Pages se puede conectar opcionalmente una ESP32 mediante Web Serial si el equipo y navegador lo admiten; una IP HTTP común no garantiza esa función. El firmware para 10 perillas, dos faders y dos encoders **no está incluido ni probado**.

## Mapeo (hardware opcional = mismo control visible en la página)

| Control | Rango | Efecto |
|---|---|---|
| Pad | clic alterna | activa/desactiva loop al siguiente compás; superposición libre |
| P1–P2 / P3–P4 | 0–100 % | parámetros 1 y 2 del efecto A / B; rótulos cambian según el efecto |
| F1 / F2 | 0–100 % | mezcla procesada A / B, 0 = seco |
| E1 / E2 giro | 10 pasos | elige uno de diez efectos A / B |
| E1 / E2 pulsación | activo/bypass | permite o evita el procesamiento A / B |
| P5 / P6 | 0–100 % | entrada / salida general |
| P7 / P8 | 0–100 % | corte 80–18 000 Hz aproximados / resonancia Q 0,35–16,35 |
| P9 / P10 | 0–100 % | delay / reverb |
| Volumen y «Restablecer» | 0–100 % / clic | salida general y retorno a parámetros iniciales |

Cada ranura puede elegir: rectificador, suboctava flip-flop, PLL, ring modulator, bitcrusher, reductor de muestreo, waveshaper/wavefolder, desplazador espectral aproximado, filtro resonante saturado o simulación de cinta. Los dos osciloscopios muestran señal antes y después de los efectos **en este Mac**, no la de un ensamble. El DSP ocurre en el navegador; la ESP32 solo enviaría movimientos seriales. El protocolo esperado figura en «Mapa físico y formato de datos» dentro de la web.

## Fallas y límites

Si no se conecta el panel, no marques «Aplicar datos» y usa mouse. Si la página falla, pulsa **Detener todo** si responde, recarga la página y comienza otra vez en silencio. Si el audio satura, baja primero F1/F2 y P6, después retira pads. Si el navegador no admite AudioWorklet o MediaRecorder, prueba Chrome actualizado en la laptop real antes de la presentación; MediaRecorder solo afecta el registro, no la mezcla. No hay mensajes de red ni recuperación OSC. La procedencia/licencia para redistribuir los samples originales debe confirmarse antes de publicar el repositorio.

**Pendiente de evidencia:** laptop OLUC concreta, compatibilidad en la red de concierto, tiempo de montaje, nivel de referencia medido, archivo de una ejecución y duración real de esa toma.
