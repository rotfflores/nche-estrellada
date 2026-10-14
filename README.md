# La alegría de coincidir

Invitación digital con entrada musical, portada, carta personal y lugar de la celebración. HTML, CSS y JavaScript sin dependencias ni compilación.

## Editar información

Todos los datos están en `config.js`: nombre, fotografía, encuadre, fecha, hora, ruta de audio y segundo de inicio. No se incluye la fotografía de la clienta.

Coloca la fotografía en `assets/festejada.jpg`. La canción proporcionada por la clienta está en `assets/milagros.mp3`. Si la fotografía falta, se muestra un marcador editorial. Si el audio falta, no bloquea la apertura. La música intenta iniciar sola desde el segundo 35 al cargar la página; como la mayoría de los navegadores bloquea el audio automático, si no se permite empieza con el primer toque, clic o tecla (incluido el botón de entrada). Pausar y reanudar conserva la posición.

La pantalla de entrada usa como fondo `assets/fondo-inicio.mp4` (con respaldo `fondo-inicio.webm` e imagen fija `fondo-inicio.jpg`), silenciado y en bucle.

El fondo de la invitación abierta es la pintura `assets/fondo-cielo.jpg`. El remolino de la luna (`assets/remolino.png`) gira despacio, un brillo cálido recorre las pinceladas y las estrellas doradas titilan. En pantallas anchas la pintura se recorre de arriba abajo al desplazarse. Con movimiento reducido el fondo queda quieto.

## Vista local

Ejecuta `node server.js` y abre `http://localhost:4173`. También puedes abrir `index.html` directamente. Las fuentes (Cormorant Garamond y Manrope, licencia SIL Open Font License) están en `assets/fonts`, así que la invitación no necesita internet; hay fuentes de sistema de respaldo.

## Carta (segunda sección)

Después de la portada está la carta `#carta`. El botón «Compartamos este día» baja hasta ella con desplazamiento suave (inmediato si el sistema pide reducir movimiento) y la música sigue sonando sin reiniciarse.

Los textos se editan en `config.js`, dentro de `letter`:

- `title`: título de la carta.
- `message`: lista de párrafos; cada elemento es un párrafo.
- `closing`: despedida, por ejemplo «Con cariño,».
- `signature`: firma; si se deja vacía, se usa `name`.

El texto actual es provisional.

## Lugar (tercera sección)

Después de la carta está la sección `#lugar`, dedicada a Doña Vero. Sus datos se editan en `config.js`, dentro de `venue`:

- `eyebrow`, `title` y `description`: texto pequeño, título y descripción. El nombre del lugar se resalta en cursiva si aparece en el título.
- `name` y `address`: nombre y dirección. La fecha y la hora se toman de `date` y `time`.
- `mapsUrl`: búsqueda de Google Maps que abre el botón «Cómo llegar» en una pestaña nueva.
- `note`: nota sobre el espacio reservado.
- `foodCaption`: texto junto a las fotografías de comida.
- `photos`: ruta (`src`), texto alternativo (`alt`) y encuadre (`position`) de cada fotografía.

Coloca las fotografías reales del restaurante en `assets/dona-vero/`: `espacio.jpg` (fotografía principal del lugar), `tacos-corazon.jpg` (tacos con tortillas en forma de corazón) y `cocina.jpg` (otra fotografía de su cocina). Mientras falte un archivo se muestra un espacio provisional. Al agregarlas, ajusta cada `alt` para que describa lo que se ve en la fotografía.

En celular el orden es fotografía principal, datos del lugar y fotografías de comida; en escritorio, fotografías e información van en dos columnas.

## Próximas secciones

`nextSection` en `config.js` indica a qué sección lleva el botón «Compartamos este día» (hoy `carta`). Si se borra, el botón muestra un mensaje breve. También emite el evento `invitation:continue` para integrar navegación personalizada.

El diseño respeta `prefers-reduced-motion`, ofrece navegación por teclado y adapta la portada, la carta y el lugar a celular y escritorio. En pantallas pequeñas la fecha y la hora se sitúan antes del botón; el contenido puede desplazarse al ampliar texto o en vista horizontal.
