// Keep the English page's structure in sync with the Spanish invitation.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
let html = readFileSync(new URL("index.html", root), "utf8");
const replace = (from, to) => {
  if (!html.includes(from)) throw new Error(`Missing source text: ${from}`);
  html = html.replaceAll(from, to);
};

replace('<html lang="es">', '<html lang="en">');
replace('content="La alegría de coincidir. Una invitación para celebrar con mis personas favoritas."', 'content="The joy of crossing paths. An invitation to celebrate with my favorite people."');
replace('La alegría de coincidir · Invitación de cumpleaños', 'The joy of crossing paths · Birthday invitation');
replace('content="es_MX"', 'content="en_US"');
replace('content="https://noche-estrellada.rotfstudio.com/"', 'content="https://noche-estrellada.rotfstudio.com/en/"');
replace('Cielo pintado de noche con la invitación La alegría de coincidir de Victoria, 07 de noviembre a las 16:00 h', "Painted night sky for Victoria's birthday invitation, November 7 at 4:30 p.m.");
replace('https://noche-estrellada.rotfstudio.com/assets/compartir.jpg?v=20261016b', 'https://noche-estrellada.rotfstudio.com/assets/share-en.png?v=20261016en');
replace('content="image/jpeg"', 'content="image/png"');
replace('content="1200"', 'content="1731"');
replace('content="630"', 'content="909"');
replace('href="styles.css?v=20261016-direct"', 'href="../styles.css?v=20261016-en"');
replace('<script src="config.js?v=20261016-album10b" defer></script>', '<script src="../config.js?v=20261016-album10b" defer></script>\n  <script src="../config-en.js?v=20261016-en" defer></script>');
replace('src="script.js?v=20261016-i18n"', 'src="../script.js?v=20261016-en"');
replace('poster="assets/', 'poster="../assets/');
replace('src="assets/', 'src="../assets/');

// Entry and cover. The opening phrase remains the first visible content.
const lead = '<p class="entry-lead" id="entry-lead">';
const leadStart = html.indexOf(lead);
const leadEnd = html.indexOf('</p>', leadStart);
if (leadStart < 0 || leadEnd < 0) throw new Error("Opening phrase missing");
const words = ["As", "proud", "products", "of", "Valentine's", "Day,", "those", "of", "us", "born", "in", "November", "are", "here!"];
const leadHtml = `${lead}${words.map((word, index) => `<span class="w${index >= 12 ? " ew-hl" : ""}" style="--i:${index}">${word}</span>`).join(" ")}</p>`;
html = html.slice(0, leadStart) + leadHtml + html.slice(leadEnd + 4);
replace('Abrir mi invitación', 'Open my invitation');
replace('Reproducir música', 'Play music');
replace('id="music-label">Reproducir', 'id="music-label">Play');
replace('Espacio reservado para la fotografía de la festejada', "Space reserved for Victoria's photograph");
replace('un instante<br><i>para celebrar</i>', 'a moment<br><i>to celebrate</i>');
replace('Tu fotografía aquí', 'Your photo here');
replace('La alegría de coincidir', 'The joy of crossing paths');
replace('la alegría de coincidir', 'the joy of crossing paths');
replace('celebra su cumpleaños', 'celebrates her birthday');
replace('Fecha y hora de la celebración', 'Celebration date and time');
replace('>Fecha</span>', '>Date</span>');
replace('>Hora</span>', '>Time</span>');
replace('07 de noviembre', 'November 7');
replace('4:30 p. m.', '4:30 p.m.');
replace('Admite 1', 'Admits one');
replace('Compartamos este día', "Let's share this day");
replace('id="countdown-title">Faltan', 'id="countdown-title">Counting down');
replace('>Días</span>', '>Days</span>');
replace('>Horas</span>', '>Hours</span>');
replace('>Minutos</span>', '>Minutes</span>');
replace('>Segundos</span>', '>Seconds</span>');

// Letter, polaroids, film strip and group photographs.
replace('No tengo lugares favoritos, tengo <em class="cw letter-quote-highlight">personas</em> <em class="cw letter-quote-highlight">favoritas</em>', "I don't have favorite places, I have <em class=\"cw letter-quote-highlight\">favorite</em> <em class=\"cw letter-quote-highlight\">people</em>");
replace('Mi lugar favorito es con ustedes', 'My favorite place is with you');
replace('Este cumpleaños quiero celebrarlo cerca de las personas que hacen mis días más bonitos.', 'This birthday, I want to be close to the people who make my days brighter.');
replace('Compartir la mesa, reírnos, cantar y sumar un recuerdo juntos será mi manera favorita de celebrar.', 'Sharing a meal, laughing, singing and making another memory together is my favorite way to celebrate.');
replace('Por eso, me encantaría que estuvieras ahí.', "I'd love for you to be there.");
replace('Cada <em class="cw evolution-highlight">versión</em> de mí', 'Every <em class="cw evolution-highlight">version</em> of me');
replace('He cambiado, he aprendido y he descubierto nuevas formas de ser yo. Hoy celebro todo lo vivido y la persona en la que me estoy convirtiendo.', "I've changed, learned and discovered new ways to be myself. Today I celebrate everything I've lived through and the person I'm becoming.");
replace('Montón de polaroids de las etapas; desliza a un lado para cambiar de foto', 'Stack of polaroids; swipe sideways to change photos');
replace('Desliza las fotos para descubrir cada etapa', 'Swipe to discover each stage');
replace('Mis recuerdos favoritos tienen <em class="cw album-highlight">compañía</em>', 'My favorite memories are <em class="cw album-highlight">shared</em>');
replace('Recuerdos con mis personas favoritas', 'Memories with my favorite people');
replace('Rollo de fotos de mis recuerdos. Usa las flechas para recorrerlo y Enter para ampliar la foto del centro.', 'Film strip of memories. Use the arrow keys to move and Enter to enlarge the centered photograph.');
replace('Desliza o toca una foto para ampliarla', 'Swipe or tap a photo to enlarge it');
replace('Caminos compartidos', "Paths we've shared");
replace('Fotografías grupales; toca una para verla completa', 'Group photographs; tap one to see it in full');
replace('Toca una foto para verla completa', 'Tap a photo to see it in full');

// Restaurant and karaoke.
replace('Espacio reservado para la fotografía del restaurante', 'Space reserved for a photograph of the restaurant');
replace('Fotografía del lugar', 'Restaurant photograph');
replace('¿Dónde nos vemos?', 'Where shall we meet?');
replace('¡A comer rico y <em>diferente!</em>', "Let's eat something delicious and <em>different!</em>");
replace('tradición mexicana con un toque extravagante.', 'Mexican tradition with an extravagant twist.');
replace('Una aventura de sabores que va de lo prehispánico a lo inesperado, con tlayudas, opciones veganas y quesadillas fuera de lo común.', 'A journey of flavors from pre-Hispanic cuisine to the unexpected, with tlayudas, vegan options and unusual quesadillas.');
replace('¡Seis veces campeona', 'Six-time winner');
replace(' de la quesadilla más exótica de la CDMX!', " of Mexico City's most exotic quesadilla!");
replace('Tacos y tortillas en forma de corazón.', 'Heart-shaped tacos and tortillas.');
replace('Pulque de cempasúchil, disponible por temporada, entre otros sabores…', 'Seasonal marigold pulque, among other flavors…');
replace('Hora de encuentro', 'Meet-up time');
replace('>Lugar</dt>', '>Venue</dt>');
replace('>Dirección</dt>', '>Address</dt>');
replace('Espacio privado para nuestra celebración.', 'A private space for our celebration.');
replace('Cómo llegar', 'Get directions');
replace('Abre Google Maps en una pestaña nueva', 'Opens Google Maps in a new tab');
replace('Gracias, Camilo, por darnos un espacio.', 'Thank you, Camilo, for giving us a space to celebrate.');
replace('Una mirada a los sabores de', 'A taste of the flavors at');
replace('Espacio reservado para la fotografía de los tacos', 'Space reserved for a photograph of the tacos');
replace('Tacos de corazón', 'Heart-shaped tacos');
replace('Espacio reservado para una fotografía de la cocina', 'Space reserved for a food photograph');
replace('>Cocina</span>', '>Kitchen</span>');
replace('También se vale cantar a todo pulmón', 'Singing at the top of our lungs is encouraged');
replace('¡El <em class="cw karaoke-highlight">micrófono</em> nos espera!', 'The <em class="cw karaoke-highlight">microphone</em> is waiting for us!');
replace('¡Habrá karaoke, dinámicas y sorpresas! Pero, sobre todo, mucho cariño y alegría de compartir con ustedes.', "There'll be karaoke, games and surprises! Most of all, lots of love and the joy of being together.");
replace('¡Ve pensando cuál vas a cantar!', 'Start thinking about your song!');

// Closing, RSVP and accessibility text.
replace('Qué bonito <em class="closing-highlight">coincidir', 'How lovely that our paths <em class="closing-highlight">crossed');
replace('</em> contigo</h2>', '</em></h2>');
replace('Gracias por hacerse un espacio para acompañarme en un día tan especial. Son personas importantes para mí y me hace muy feliz coincidir con ustedes.', "Thank you for making time to be with me on such a special day. You mean so much to me, and I'm so happy our paths crossed.");
replace('Los quiero mucho.', 'I love you all so much.');
replace('Con cariño,', 'With love,');
replace('¡Confirmen su asistencia!', 'Please RSVP!');
replace('Me encantará celebrar contigo. Confírmame si podrás acompañarme para organizar nuestro encuentro.', "I'd love to celebrate with you. Let me know if you can make it so I can plan our gathering.");
replace('Tu respuesta', 'Your reply');
replace('Sí, ahí estaré', "Yes, I'll be there");
replace('Esta vez no podré', "I can't make it this time");
replace('Tu nombre', 'Your name');
replace('Déjame un mensaje', 'Leave me a message');
replace('Opcional', 'Optional');
replace('Enviar respuesta', 'Send reply');
replace('Cambiar mi respuesta', 'Change my reply');
replace('Volver al inicio', 'Back to the beginning');
replace('Gracias por ser una de mis personas favoritas.', 'Thank you for being one of my favorite people.');
replace('Foto anterior', 'Previous photo');
replace('Foto siguiente', 'Next photo');
replace('Cerrar', 'Close');
replace('Activa JavaScript para abrir tu invitación.', 'Enable JavaScript to open your invitation.');

html = html.replace('</head>', '  <link rel="alternate" hreflang="es-MX" href="https://noche-estrellada.rotfstudio.com/">\n  <link rel="canonical" href="https://noche-estrellada.rotfstudio.com/en/">\n</head>');
html = html.replace('  <link rel="alternate" hreflang="en" href="https://noche-estrellada.rotfstudio.com/en/">\n', '');
mkdirSync(new URL("en/", root), { recursive:true });
writeFileSync(new URL("en/index.html", root), html);
console.log("Built en/index.html");
