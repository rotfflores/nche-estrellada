# La alegría de coincidir

Invitación digital con entrada musical, portada, carta personal, álbum de fotos, lugar de la celebración, karaoke, confirmación de asistencia y cierre. HTML, CSS y JavaScript sin dependencias ni compilación.

## Editar información

Todos los datos están en `config.js`: nombre, fotografía, encuadre, fecha, hora, ruta de audio y segundo de inicio. No se incluye la fotografía de la clienta.

Coloca la fotografía en `assets/festejada.jpg`. La canción proporcionada por la clienta está en `assets/milagros.mp3`. Si la fotografía falta, se muestra un marcador editorial. Si el audio falta, no bloquea la apertura. La música intenta iniciar sola desde el segundo 35 al cargar la página; como la mayoría de los navegadores bloquea el audio automático, si no se permite empieza con el primer toque, clic o tecla (incluido el botón de entrada); deslizar no cuenta como toque. Pausar y reanudar conserva la posición. El control de música aparece en cuanto la música suena, también en la pantalla de entrada, para poder pausarla desde el principio: en celular es un ícono redondo arriba a la derecha que se hace a un lado mientras un título o un botón pasa por esa esquina; en laptops angostas (hasta 1299 px de ancho), un ícono redondo abajo a la derecha; en pantallas más anchas, la píldora «Pausar / Reanudar».

La pantalla de entrada usa como fondo `assets/fondo-inicio.mp4` (con respaldo `fondo-inicio.webm` e imagen fija `fondo-inicio.jpg`), silenciado y en bucle.

El fondo de la invitación abierta es la pintura `assets/fondo-cielo.jpg`. El remolino de la luna (`assets/remolino.webp`, con `remolino.png` como original y respaldo) gira despacio, un brillo cálido recorre las pinceladas y las estrellas doradas titilan. Los adornos que se mueven en bucle (sello del boleto, mano del álbum, ondas del micrófono, etc.) se detienen mientras su sección está lejos de la pantalla. En pantallas anchas la pintura se recorre de arriba abajo al desplazarse. Con movimiento reducido el fondo queda quieto.

## Vista local

Ejecuta `node server.js` y abre `http://localhost:4173`. Para verla desde un celular conectado a la misma red Wi-Fi, ejecuta `HOST=0.0.0.0 node server.js` (en Windows PowerShell: `$env:HOST="0.0.0.0"; node server.js`) y abre en el celular la dirección IP de la computadora con `:4173`. También puedes abrir `index.html` directamente. Las fuentes (Cormorant Garamond, Manrope y Caveat para los pies de foto, licencia SIL Open Font License) están en `assets/fonts`, así que la invitación no necesita internet; hay fuentes de sistema de respaldo.

## Cuenta regresiva

Debajo de «Compartamos este día» hay una cuenta regresiva con días, horas, minutos y segundos; cada cifra que cambia rueda hacia arriba. La fecha y hora exactas están en `eventStart` de `config.js` (hora del centro de México, UTC-6) y el mensaje que aparece al llegar la hora en `countdownDone`. Doce horas después del inicio la cuenta regresiva se retira, para que días después no siga diciendo «hoy».

## Carta (segunda sección)

Después de la portada está la carta `#carta`. El botón «Compartamos este día» baja hasta ella con desplazamiento suave (inmediato si el sistema pide reducir movimiento) y la música sigue sonando sin reiniciarse.

Los textos se editan en `config.js`, dentro de `letter`:

- `title`: título de la carta.
- `message`: lista de párrafos; cada elemento es un párrafo.
- `closing`: despedida, por ejemplo «Con cariño,».
- `signature`: firma; si se deja vacía, se usa `name`.

El texto actual es provisional.

## Cada versión de mí

Entre la carta y el álbum está `#evolucion`, «Cada versión de mí»: un recorrido fotográfico por las etapas de la festejada, de la más antigua a la más reciente. Va sobre una hoja de papel crema, con el título en azul iris (la palabra «versión» en cursiva con un trazo amarillo mantequilla) y el texto introductorio debajo.

- Las fotos son rectangulares, montadas con un borde blanco fino y un filete azul; no se apilan. Debajo, una línea fina las une con un punto amarillo mantequilla por etapa; la línea entra desde la izquierda y sigue hacia la derecha después de la última foto, que tiene un brillo suave.
- En celular se ve una foto completa y asoma la siguiente. Se desliza con el dedo y al soltar cada foto queda alineada; deslizar hacia arriba o abajo sigue moviendo la página.
- En escritorio las fotos se acomodan en una fila si caben; si no, se recorren igual que en celular.
- La hoja se ajusta al alto de la pantalla (título, fotos y tamaños se reducen en laptops y celulares bajos) para que se vea completa sin cortarse.
- Los botones «Etapa anterior» y «Etapa siguiente» aparecen solo cuando hay fotos fuera de la vista y funcionan con teclado. El recorrido nunca avanza solo.
- Al aparecer, la hoja sube, las fotos entran en orden y la línea se dibuja de punto en punto. Con movimiento reducido todo se muestra quieto.

Las fotos se editan en `config.js`, dentro de `evolution.photos`, y se muestran en el orden de la lista (de tres a cinco). Cada una lleva `src` (ruta), `alt` (lo que se ve), `stage` (fecha o nombre de la etapa, opcional), `phrase` (frase breve de la clienta, opcional) y `position` (encuadre; `"50% 30%"` deja la foto centrada y un poco hacia arriba para no cortar la cabeza). Si `stage` y `phrase` van vacíos no se muestra nada debajo de la foto. Las fotos no llevan filtros ni se deforman: solo se elige el encuadre. Mientras falte un archivo se ve un espacio «Etapa N». Sin fotos en la lista se oculta la sección. `title`, `highlight` e `intro` son el título, la palabra en cursiva y el texto introductorio (provisional).

## Álbum de fotos

Entre «Cada versión de mí» y el lugar está `#album`, «Mis recuerdos favoritos tienen compañía»: una pila centrada de fotografías tipo instantánea con borde blanco cálido, margen inferior amplio, inclinaciones distintas y sombra suave. Se ven hasta cuatro a la vez; la de arriba completa y las demás asomándose por los bordes.

- La foto de arriba se arrastra con el dedo o el mouse: sigue el movimiento y gira un poco. Si pasa cierta distancia (o se lanza rápido) sale hacia ese lado y pasa al fondo; si no, regresa a su lugar. Un gesto mueve solo una foto.
- El arrastre solo se activa cuando el gesto es horizontal: deslizar hacia arriba o abajo sigue desplazando la página.
- Debajo de las fotos hay una indicación con una mano que hace el gesto de deslizar («Desliza las fotos para descubrir más recuerdos»); no hay botones ni contador. Con el álbum enfocado, las flechas izquierda y derecha del teclado también cambian de foto. El álbum es circular y nunca avanza solo.
- Con movimiento reducido las fotos cambian sin animación.

Las fotos se editan en `config.js`, dentro de `album.photos`; cada una lleva `src` (ruta), `alt` (lo que se ve), `caption` (pie de foto opcional, en letra manuscrita) y `position` (encuadre, por ejemplo `"50% 30%"`). La imagen nunca se deforma: se recorta según el encuadre. Agrega o borra elementos de la lista: con una sola foto se oculta la indicación; sin fotos se oculta la sección. `title`, `highlight` y `hint` son el título, la palabra en cursiva y la indicación.

Coloca las fotografías en `assets/album/` (hoy la lista espera `recuerdo-1.jpg` a `recuerdo-6.jpg`). Mientras falte un archivo se ve un espacio provisional.

## Lugar (tercera sección)

Después de la carta está la sección `#lugar`, dedicada a Doña Vero. Sus datos se editan en `config.js`, dentro de `venue`:

- `eyebrow`, `title` y `description`: texto pequeño, título y descripción. El nombre del lugar se resalta en cursiva si aparece en el título.
- `name` y `address`: nombre y dirección. La fecha y la hora se toman de `date` y `time`.
- `mapsUrl`: búsqueda de Google Maps que abre el botón «Cómo llegar» en una pestaña nueva.
- `note`: nota sobre el espacio reservado (el karaoke tiene su propia sección).
- `foodCaption`: texto junto a las fotografías de comida.
- `photos`: ruta (`src`), texto alternativo (`alt`) y encuadre (`position`) de cada fotografía.

Coloca las fotografías reales del restaurante en `assets/dona-vero/`: `espacio.jpg` (fotografía principal del lugar), `tacos-corazon.jpg` (tacos con tortillas en forma de corazón) y `cocina.jpg` (otra fotografía de su cocina). Mientras falte un archivo se muestra un espacio provisional. Al agregarlas, ajusta cada `alt` para que describa lo que se ve en la fotografía.

En celular el orden es fotografía principal, datos del lugar y fotografías de comida; en escritorio, fotografías e información van en dos columnas.

## Karaoke

Entre el lugar y la confirmación está `#karaoke`: un bloque de cristal translúcido con un tinte azul iris muy ligero (la pintura se ve suavemente desenfocada detrás), sin bordes, con texto claro y la ilustración de un micrófono de líneas finas con acentos amarillo mantequilla (la rejilla recuerda al mundo de la frase inicial). En escritorio, ilustración y texto van en dos columnas; en celular, la ilustración va sobre el título. Al aparecer, el bloque sube suavemente, el micrófono se dibuja y luego aparecen las ondas, los destellos y la nota; con movimiento reducido se muestra quieto.

El micrófono es solo decorativo: no graba, no pide permisos ni reproduce audio. La música de fondo sigue igual.

Los textos se editan en `config.js`, dentro de `karaoke`: `eyebrow` (texto pequeño), `title`, `highlight` (palabra del título en cursiva), `description` y `cue` (frase final destacada; vacía para ocultarla). Anuncia el karaoke presencial: no incluye horarios, concursos, premios ni canciones.

## Confirmación (cuarta sección)

Después del lugar está `#confirmar`. Primero se elige «Sí, ahí estaré» o «Esta vez no podré». Con «Sí» se despliegan el nombre (obligatorio) y un mensaje opcional; con «No» solo aparece el botón para enviar, sin formulario. Al enviar, el formulario se desvanece y aparece el agradecimiento: un corazón dorado se dibuja, suelta destellos y el título entra palabra por palabra. Con movimiento reducido aparece sin animación. «Cambiar mi respuesta» regresa al formulario con los datos escritos.

Todo se edita en `config.js`, dentro de `rsvp`:

- `whatsapp`: número de la festejada con lada de país, por ejemplo `5215512345678`. Si se escribe un número de México de 10 dígitos sin lada, se completa solo con `521`. Con número, al enviar también se abre WhatsApp con el mensaje preparado (más el mensaje opcional al final) y el agradecimiento recuerda enviarlo desde ahí. **Mientras esté vacío, se muestra el agradecimiento pero la respuesta no llega a nadie.** No usar el número del restaurante.
- `yesMessage` y `noMessage`: mensajes de WhatsApp. `{nombre}`, `{fecha}`, `{hora}` y `{lugar}` se reemplazan solos; `noMessage` no lleva `{nombre}` porque con «No» no se pide (WhatsApp ya muestra quién lo envía).
- `thanksYesTitle`, `thanksYesText`, `thanksNoTitle`, `thanksNoText`, `whatsappReminder` y `editLabel`: textos del agradecimiento.
- Etiquetas, botones (`button` con número, `buttonWithoutWhatsapp` sin número) y mensajes de validación.

## Cierre (quinta sección)

Después de la confirmación está `#despedida`, «Qué bonito coincidir contigo»: composición centrada, título grande que entra palabra por palabra, la palabra resaltada en cursiva con un trazo amarillo, dos líneas que coinciden en un corazón de trazo fino y la firma. Cada parte aparece al llegar a ella; con movimiento reducido todo se muestra sin animación. La altura se adapta al contenido.

«Volver al inicio» sube a la portada con desplazamiento suave (inmediato con movimiento reducido): no vuelve a mostrar la entrada y no toca la música. Al final, el pie muestra un agradecimiento de la festejada. El espacio inferior deja libre el control de música.

Todo se edita en `config.js`, dentro de `closing`:

- `title`: título del cierre. `highlight`: palabra del título que va en cursiva con el trazo amarillo (vacío para no resaltar).
- `message`: texto, o lista de párrafos.
- `farewell` y `signature`: despedida y firma; si la firma se deja vacía, se usa `name`.
- `backLabel`: texto de «Volver al inicio».
- `footerThanks`: agradecimiento de la festejada al pie (vacío para ocultarlo).

El texto actual es provisional.

## Datos pendientes de la clienta

Al inicio de `config.js` está la lista; cada dato lleva la marca `PENDIENTE`:

- Fotografía de la festejada en `assets/festejada.jpg`.
- Número de WhatsApp de Victoria en `rsvp.whatsapp` (sin él, las respuestas no llegan a nadie).
- Textos definitivos de la carta (`letter`) y del cierre (`closing`), incluido el agradecimiento del pie.
- Acompañantes o fecha límite para confirmar: no se muestran hasta que la clienta lo indique.
- Fotografías del álbum en `assets/album/`, con su `alt` y pie de foto.
- Fotografías de «Cada versión de mí» en `assets/etapas/`, de la etapa más antigua a la más reciente, con su `alt`; etapa y frase solo si la clienta las da. El texto introductorio es provisional.

## Navegación

`nextSection` en `config.js` indica a qué sección lleva el botón «Compartamos este día» (hoy `carta`). Si se borra, lleva a la carta; si indica una sección que no existe, el botón muestra un mensaje breve. También emite el evento `invitation:continue` para integrar navegación personalizada.

El diseño respeta `prefers-reduced-motion` (sin destello al abrir, sin movimiento de la pintura al desplazarse y sin animaciones), ofrece navegación por teclado y adapta todas las secciones a celular y escritorio. En pantallas pequeñas la fecha y la hora se sitúan antes del botón; el contenido puede desplazarse al ampliar texto.

## Ajuste a cada pantalla

- Laptops (desde 850 px de ancho): la portada, la carta, el álbum, los datos del lugar y el karaoke se ajustan al alto de la pantalla (`--screen-h` en `styles.css`), así que en laptops de 600 a 730 px de alto la portada se ve completa con la cuenta regresiva, y la carta llega con la firma a la vista. En monitores altos todo conserva su tamaño completo.
- Celular acostado: usa el diseño de celular; la entrada, «Cada versión de mí», el álbum y la foto del lugar se compactan para caber en la pantalla baja.
- Si `config.js` tiene un error de escritura (una coma o comilla de más), la invitación abre igual con los textos de `index.html` y la consola del navegador lo indica. En ese caso no suena la música hasta corregir `config.js`.

## Al publicar

`index.html` ya trae el título y la descripción para la vista previa al compartir el enlace (WhatsApp, redes) y un ícono de corazón para la pestaña. Falta la imagen de vista previa (`og:image`), que necesita la dirección completa del sitio publicado; hay un comentario `PENDIENTE` en `index.html`.
