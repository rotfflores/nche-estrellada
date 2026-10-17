# La alegría de coincidir

Invitación digital con entrada musical, portada, carta personal, álbum de fotos, lugar de la celebración, karaoke, confirmación de asistencia y cierre. La invitación pública sigue en GitHub Pages; el panel privado y el guardado de respuestas usan un Cloudflare Worker conectado a D1.

## Orden y fondos (observaciones de la clienta, 16 de octubre)

1. Entrada: solo la frase «Como buenos productos del 14 de febrero, quienes cumplimos años en noviembre, aquí estamos presentes», que aparece palabra por palabra; después aparece el botón para abrir.
2. Portada (cielo pintado): «Victoria / celebra su cumpleaños / la alegría de coincidir», boleto con fecha y hora (4:30 p. m.) y cuenta regresiva.
3. Frase principal (blanco): «No tengo lugares favoritos, tengo personas favoritas» en letras muy grandes y, debajo, «Mi lugar favorito es con ustedes» con la explicación (`letter`).
4. Etapas de mi vida (café): montón de polaroids con etapa, nombre y descripción de la clienta, más una tarjeta independiente «Y así pasaron etapas y décadas… hasta llegar al 2022».
5. Carrusel de fotos individuales (arena): rollo de película con los nombres y un corazón de color distinto para cada foto (rojo para Yes).
6. Fotografías grupales (cielo pintado): fijas, formando un corazón; al tocar una se amplía con su frase.
7. Lugar (blanco): «¿Dónde nos vemos? ¡A comer rico y diferente!», textos de Doña Vero, hora de encuentro, dirección y agradecimiento a Camilo.
8. Karaoke (café): «¡El micrófono nos espera!».
9. Cierre (arena): agradecimiento de Victoria, «Los quiero mucho.» y la firma con un corazón rojo.
10. Confirmación (cielo pintado): «¡Confirmen su asistencia!», y al pie «Volver al inicio» y el agradecimiento.

Cada sección tiene un fondo distinto al de la anterior. Las secciones de color (clases `theme-white`, `theme-cafe`, `theme-arena` con `sheet` en `index.html`) son paneles de cristal translúcido (fondo al ~40 % con un desenfoque ligero, `--glass-blur` en `.sheet`) que flotan con un pequeño margen, para que se aprecie la pintura de Van Gogh detrás y los textos sigan leyéndose; las de cielo pintado usan `theme-night`. Los colores están al final de `styles.css` (`--ivory`, `--cafe`, `--arena`, `--ink-navy`, `--accent-warm`).

## Editar información

Todos los datos están en `config.js`: nombre, fotografía, encuadre, fecha, hora, ruta de audio y segundo de inicio. No se incluye la fotografía de la clienta.

La fotografía proporcionada por la clienta está en `assets/festejada.jpg`. La canción proporcionada por la clienta está en `assets/milagros.mp3`. Si la fotografía falta, se muestra un marcador editorial. Si el audio falta, no bloquea la apertura. La música intenta iniciar sola desde el segundo 35 al cargar la página; como la mayoría de los navegadores bloquea el audio automático, si no se permite empieza con el primer toque, clic o tecla (incluido el botón de entrada); deslizar no cuenta como toque. El control de música silencia la canción sin detenerla (bocina tachada) y al activar el sonido sigue donde va; si la canción terminó o el navegador no la dejó empezar, el mismo control la reproduce. Aparece en cuanto la música suena, también en la pantalla de entrada, para poder silenciarla desde el principio: en celular es un ícono redondo arriba a la derecha que se hace a un lado mientras un título o un botón pasa por esa esquina; en laptops angostas (hasta 1299 px de ancho), un ícono redondo abajo a la derecha; en pantallas más anchas, la píldora «Silenciar / Activar sonido».

La pantalla de entrada usa como fondo `assets/fondo-inicio.mp4` (con respaldo `fondo-inicio.webm` e imagen fija `fondo-inicio.jpg`), silenciado y en bucle.

El inicio abre con la frase que dio Victoria sobre cumplir años en noviembre; después muestra «No tengo lugares favoritos, tengo personas favoritas 🌍❤️» y «La alegría de coincidir».

El fondo de la invitación abierta es la pintura `assets/fondo-cielo.jpg`. El remolino de la luna (`assets/remolino.webp`, con `remolino.png` como original y respaldo) gira despacio, un brillo cálido recorre las pinceladas y las estrellas doradas titilan. Los adornos que se mueven en bucle (sello del boleto, ondas del micrófono, etc.) se detienen mientras su sección está lejos de la pantalla. En pantallas anchas la pintura se recorre de arriba abajo al desplazarse. Con movimiento reducido el fondo queda quieto.

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

- Las seis fotos forman un solo montón de polaroids blancas, ligeramente giradas. Se ve una al frente y los bordes de las demás detrás. Las etiquetas de etapa y cualquier comentario forman parte del borde inferior de cada polaroid.
- Al deslizar la polaroid superior hacia la izquierda, pasa detrás del montón y aparece la siguiente. Hacia la derecha se ve la anterior. El recorrido vuelve a empezar después de la sexta. Deslizar hacia arriba o abajo sigue moviendo la página.
- La hoja se adapta al ancho de la pantalla. En pantallas bajas puede continuar verticalmente para mantener las polaroids legibles.
- Los botones «Etapa anterior» y «Etapa siguiente» permiten el mismo movimiento y muestran el número de etapa; también funcionan las flechas del teclado. El montón nunca avanza solo.
- Al aparecer, la hoja y el montón entran suavemente. Con movimiento reducido el cambio de foto es inmediato.

Las seis fotos de Victoria están en `assets/etapas/` y se editan en `config.js`, dentro de `evolution.photos`, en el orden de la lista. Cada una lleva `src` (ruta), `alt` (lo que se ve), `stage` («Etapa 1»), `title` (nombre de la etapa, escrito a mano en la polaroid), `phrase` (descripción breve de la clienta) y `position` (encuadre). Una entrada con `note` y sin `src` es una tarjeta independiente de papel, sin foto (hoy, «Y así pasaron etapas y décadas… hasta llegar al 2022», entre la etapa 2 y la 3); el año final se destaca. Las fotos no llevan filtros ni se deforman: solo se elige el encuadre. Mientras falte un archivo se ve un espacio con el nombre de la etapa. Sin fotos ni tarjetas se oculta la sección. `title`, `highlight` e `intro` son el título, la palabra en cursiva y el texto introductorio (provisional).

## Álbum de fotos

Después de «Cada versión de mí» está `#album` («Mis recuerdos favoritos tienen compañía»): un rollo de película que avanza solo hacia la izquierda, con perforaciones, el texto «La alegría de coincidir» en el borde y, en la franja de abajo, los nombres escritos a mano con un corazón de color. Es infinito; se pausa con el dedo o el mouse encima, se desliza o arrastra, y al soltarlo sigue de inmediato con la inercia del gesto. Un toque o clic sin arrastrar amplía la foto, completa y con sus nombres, en la misma vista ampliada del corazón de fotos grupales. Con el teclado, las flechas lo recorren foto por foto y Enter amplía la foto del centro. Fuera de la pantalla o con movimiento reducido no avanza solo.

Las fotos se editan en `config.js`, en `album.photos` (`src`, `alt`, `caption` con los nombres y `heart` con el color del corazón; cada uno distinto y el de Yes en rojo). El título queda solo para lectores de pantalla.

## Fotografías grupales en forma de corazón

`#grupales` reúne las fotos grupales formando un corazón, fijas, sin movimiento. Son 14 fotos: la del vestido rojo, marcada con `featured: true`, va al centro, más grande y con un marco dorado fino (a petición de la clienta); alrededor, una fila sobre los lóbulos, una columna de fotos a cada lado y dos filas que bajan hacia la punta. Cada foto ocupa el espacio que mejor le queda según su forma (las verticales arriba, las horizontales a los lados y abajo). Sin foto destacada, el corazón se divide en filas (de 1 a 12 fotos con acomodos hechos a mano; más, en filas de cuatro). Al tocar o hacer clic en una foto se abre ampliada, completa y con su frase; se cambia con las flechas de la pantalla o del teclado, o deslizando, y se cierra con la X, tocando el fondo o con Escape. La música sigue sonando. Las fotos y frases se editan en `config.js`, en `groupGallery.photos` (`src`, `alt`, `caption` opcional, `featured` y `position` opcional para el encuadre dentro del corazón); el orden de la lista es el orden al ampliarlas. Las cinco frases se conservan en sus fotos; la que acompañaba a la foto que ya no está pasó a la de las mismas amigas frente al escenario.

## Lugar

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

## Confirmación (al final)

Después del lugar está `#confirmar`. Primero se elige «Sí, ahí estaré» o «Esta vez no podré». Con «Sí» se despliegan el nombre (obligatorio) y un mensaje opcional; con «No» solo aparece el botón para enviar, sin formulario. Al enviar, el formulario se desvanece y aparece el agradecimiento: un corazón dorado se dibuja, suelta destellos y el título entra palabra por palabra. Con movimiento reducido aparece sin animación. «Cambiar mi respuesta» regresa al formulario con los datos escritos. Con D1 activo, una corrección hecha desde el mismo navegador actualiza la respuesta previa.

Todo se edita en `config.js`, dentro de `rsvp`:

- `button`: texto del botón de envío directo. El ícono es una marca de confirmación.
- `thanksYesTitle`, `thanksYesText`, `thanksNoTitle`, `thanksNoText` y `editLabel`: textos del agradecimiento.
- Etiquetas y mensajes de validación. Las respuestas se guardan en D1 antes de mostrar el agradecimiento; si el guardado falla, se muestra un error.

## Panel privado y guardado duradero en Cloudflare

`panel.html` muestra las confirmaciones, nombres y mensajes después de iniciar sesión. Incluye filtros, búsqueda, actualización y descarga CSV. `worker.mjs` atiende `/api/*` desde Cloudflare y guarda en D1; la base está separada de los archivos de GitHub Pages, por lo que un nuevo despliegue de la invitación no borra sus registros. El panel HTML puede abrirse públicamente, pero la API no entrega ninguna respuesta sin una sesión válida. Las sesiones caducan a las 12 horas y el inicio de sesión bloquea un origen durante 15 minutos después de cinco intentos erróneos.

Está activo en `https://noche-estrellada.rotfstudio.com/`: el subdominio usa el proxy de Cloudflare, la base D1 `victoria-rsvp` y el Worker `victoria-rsvp` atiende `/api/*`. Para reproducir o actualizar la instalación:

1. En Cloudflare DNS, comprobar que `noche-estrellada.rotfstudio.com` esté en modo **Proxied** (nube naranja). El Worker usa una ruta delante del sitio existente de GitHub Pages; las demás URL siguen pasando a GitHub Pages.
2. Crear una base **D1** llamada `victoria-rsvp`. En su consola SQL, ejecutar `migrations/0001_rsvp.sql` una sola vez. El script crea las tablas si aún no existen y no elimina datos.
3. Copiar `wrangler.example.toml` a `wrangler.toml` y sustituir `REEMPLAZAR_CON_ID_DE_D1` por el UUID real de la base. El binding debe llamarse exactamente `DB`. Iniciar sesión con Wrangler y desplegar `worker.mjs` (`npx wrangler deploy`). La ruta es `noche-estrellada.rotfstudio.com/api/*`; el resto del sitio no cambia.
4. En la configuración del Worker, agregar dos **secretos**: `ADMIN_PASSWORD` (contraseña larga y única para la clienta) y `SESSION_SECRET` (cadena aleatoria independiente, de al menos 32 caracteres). No escribirlos en `config.js`, Git ni archivos públicos.
5. Comprobar que `https://noche-estrellada.rotfstudio.com/api/admin/session` responde JSON y que `/panel.html` muestra el acceso. El formulario envía siempre a D1.

Las respuestas enviadas **antes** de activar D1 no aparecen automáticamente en el panel. El botón «Descargar CSV» da un respaldo manual. D1 ofrece recuperación temporal, pero para conservación a largo plazo conviene guardar periódicamente ese CSV fuera de Cloudflare.

Para probar la lógica local sin servicio remoto: `npm test`. `panel.html`, `panel.css` y `panel.js` se publican como archivos estáticos junto con la invitación; las funciones y las migraciones no contienen contraseñas.

## Cierre (antes de la confirmación)

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

- Las confirmaciones nuevas llegan a D1 y al panel. Las respuestas anteriores, si se enviaron por WhatsApp, no se importan automáticamente.
- Explicación bajo «Mi lugar favorito es con ustedes» (`letter.message`) y agradecimiento del pie (`closing.footerThanks`): son provisionales.
- Acompañantes o fecha límite para confirmar: no se muestran hasta que la clienta lo indique.
- Texto introductorio definitivo de «Cada versión de mí» y contexto opcional de las etapas; las seis fotografías ya están incorporadas.

## Navegación

`nextSection` en `config.js` indica a qué sección lleva el botón «Compartamos este día» (hoy `carta`). Si se borra, lleva a la carta; si indica una sección que no existe, el botón muestra un mensaje breve. También emite el evento `invitation:continue` para integrar navegación personalizada.

El diseño respeta `prefers-reduced-motion` (sin destello al abrir, sin movimiento de la pintura al desplazarse y sin animaciones), ofrece navegación por teclado y adapta todas las secciones a celular y escritorio. En pantallas pequeñas la fecha y la hora se sitúan antes del botón; el contenido puede desplazarse al ampliar texto.

## Ajuste a cada pantalla

- Laptops (desde 850 px de ancho): la portada, la carta, los datos del lugar y el karaoke se ajustan al alto de la pantalla (`--screen-h` en `styles.css`), así que en laptops de 600 a 730 px de alto la portada se ve completa con la cuenta regresiva, y la carta llega con la firma a la vista.
- Celular acostado: usa el diseño de celular; la entrada, «Cada versión de mí» y la foto del lugar se compactan para la pantalla baja.
- Si `config.js` tiene un error de escritura (una coma o comilla de más), la invitación abre igual con los textos de `index.html` y la consola del navegador lo indica. En ese caso no suena la música hasta corregir `config.js`.

## Al publicar

`index.html` publica las etiquetas Open Graph con la imagen `assets/compartir.jpg` (1200 × 630 px), título, descripción y URL absoluta para la vista previa en WhatsApp y redes. La imagen usa el cielo pintado de la invitación, sin fotografía, y se puede regenerar con `scripts/build-share-image.py` cuando cambie el título o la fecha. Si una aplicación conserva una vista previa antigua, puede tardar en renovar su caché aunque la página ya esté actualizada.
