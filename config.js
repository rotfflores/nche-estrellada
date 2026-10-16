// Toda la información que cambia durante el desarrollo está aquí.
//
// PENDIENTE DE LA CLIENTA (busca «PENDIENTE» en este archivo):
// 1. Número de WhatsApp de Victoria en rsvp.whatsapp. Sin él, las respuestas NO llegan a nadie.
// 2. Explicación bajo «Mi lugar favorito es con ustedes» (letter.message) y agradecimiento del pie (closing.footerThanks): son provisionales.
// 3. Acompañantes o fecha límite para confirmar: no se muestran hasta que la clienta lo indique.
// 4. Texto introductorio de «Cada versión de mí»; el actual es provisional.
window.INVITATION_CONFIG = Object.freeze({
  name: "Victoria",
  photo: "assets/festejada.jpg", // Fotografía de Victoria proporcionada por la clienta.
  photoPosition: "50% 8%", // Mantiene visible el rostro en el recorte horizontal del celular.
  date: "07 de noviembre",
  time: "4:30 p. m.", // Hora de encuentro indicada por la clienta.
  // Inicio exacto para la cuenta regresiva (hora del centro de México, UTC-6).
  eventStart: "2026-11-07T16:30:00-06:00",
  countdownDone: "¡Hoy celebramos juntos!", // Se muestra cuando llega la hora.
  audio: "assets/milagros.mp3", // Archivo proporcionado por la clienta.
  audioStart: 35,
  nextSection: "carta", // Sección a la que lleva el botón «Compartamos este día».
  // Frase principal (en letras muy grandes) y, debajo, «Mi lugar favorito es con ustedes» con una breve explicación.
  letter: {
    quote: "No tengo lugares favoritos, tengo personas favoritas",
    quoteHighlight: "personas favoritas", // Palabras de la frase que van en cursiva. Vacío para no resaltar.
    title: "Mi lugar favorito es con ustedes",
    // PENDIENTE: explicación provisional; reemplazar con las palabras de la clienta si envía las suyas.
    message: [
      "Este cumpleaños quiero celebrarlo cerca de las personas que hacen mis días más bonitos.",
      "Compartir la mesa, reírnos, cantar y sumar un recuerdo juntos será mi manera favorita de celebrar.",
      "Por eso, me encantaría que estuvieras ahí.",
    ],
  },
  // Cada versión de mí: recorrido fotográfico entre la carta y el álbum.
  evolution: {
    title: "Cada versión de mí",
    highlight: "versión", // Palabra del título en cursiva. Vacío para no resaltar.
    intro: "He cambiado, he aprendido y he descubierto nuevas formas de ser yo. Hoy celebro todo lo vivido y la persona en la que me estoy convirtiendo.", // PENDIENTE: texto provisional.
    // Las fotos y la tarjeta se muestran en este orden. Textos de la clienta.
    // stage: número de la etapa. title: nombre de la etapa. phrase: descripción breve.
    // position: encuadre de cada foto ("50% 30%" = centrada y un poco hacia arriba, para no cortar la cabeza).
    // Una entrada con note (sin src) es una tarjeta independiente, sin fotografía.
    photos: [
      { src: "assets/etapas/etapa-1.jpg", alt: "Victoria de niña, con vestido a cuadros frente a un fondo rojo y negro", stage: "Etapa 1", title: "La niña futbolera", phrase: "Me encantaba jugar fútbol y, ¡siempre terminaba con las rodillas raspadas!", position: "50% 35%" },
      { src: "assets/etapas/etapa-2.jpg", alt: "Fotografía familiar de infancia: tres niños y un adulto junto a un pastel de cumpleaños", stage: "Etapa 2", title: "Los cumpleaños en familia", phrase: "Siempre fui muy consentida por mis papás, mi mejor regalo: un Super Nintendo.", position: "50% 48%" },
      { note: "Y así pasaron etapas y décadas… hasta llegar al 2022" },
      { src: "assets/etapas/etapa-3.jpg", alt: "Victoria con los brazos abiertos junto a una laguna y montañas", stage: "Etapa 3", title: "Trepa cerros", phrase: "Después de tantas desilusiones amorosas, ya solo me falta escalar el Everest. Jaja, no es cierto.", position: "50% 52%" },
      { src: "assets/etapas/etapa-4.jpg", alt: "Victoria corre sonriente en una carrera por una avenida", stage: "Etapa 4", title: "Mi etapa de corredora", phrase: "Una de las etapas más bonitas de mi vida. Espero que mis rodillas me permitan continuar corriendo.", position: "50% 40%" },
      { src: "assets/etapas/etapa-5.jpg", alt: "Victoria sentada en un sofá, con vestido negro, frente a un muro verde", stage: "Etapa 5", title: "Mi lado más femenino", phrase: "Y que me gustaría retomar poco a poco. Me lo prometo.", position: "50% 37%" },
      { src: "assets/etapas/etapa-6.jpg", alt: "Victoria de pie al aire libre con un micrófono en la mano", stage: "Etapa 6", title: "Soltar para reencontrarme", phrase: "Dejé atrás una profesión y vínculos para reconectar conmigo. Hoy lo agradezco.", position: "50% 43%" },
    ],
  },
  album: {
    title: "Mis recuerdos favoritos tienen compañía",
    highlight: "compañía", // Palabra del título en cursiva. Vacío para no resaltar.
    // heart: color del corazón junto a los nombres; cada uno distinto y el de Yes en rojo, como pidió la clienta.
    photos: [
      { src: "assets/album/recuerdo-1.jpg", alt: "Tres mujeres posan en un jardín junto a una cascada", caption: "Nancy y Sure", heart: "#F27DB5", position: "50% 55%" }, // rosa
      { src: "assets/album/recuerdo-2.png", alt: "Dos hombres y una mujer sonríen ante una decoración de globos", caption: "Leo y Ramiro", heart: "#A274F2", position: "50% 45%" }, // morado
      { src: "assets/album/recuerdo-3.png", alt: "Tres mujeres sonríen durante una reunión", caption: "Ilse e Ixnán", heart: "#F6C83E", position: "50% 45%" }, // amarillo
      { src: "assets/album/recuerdo-4.png", alt: "Tres mujeres posan en una tienda de figuras coleccionables", caption: "Yanai y Ana", heart: "#44C176", position: "50% 42%" }, // verde
      { src: "assets/album/recuerdo-5.png", alt: "Tres personas posan frente a una exhibición de figuras", caption: "Elo y Pao", heart: "#F78F3C", position: "50% 38%" }, // naranja
      { src: "assets/album/recuerdo-6.png", alt: "Tres personas sonríen al aire libre entre árboles", caption: "Vishal y Ana Karen", heart: "#4D95F0", position: "50% 45%" }, // azul
      { src: "assets/album/recuerdo-7.png", alt: "Dos mujeres sonríen juntas en una mesa", caption: "Alexandra", heart: "#2CC7C2", position: "50% 43%" }, // turquesa
      { src: "assets/album/recuerdo-8.png", alt: "Dos mujeres sonríen durante un paseo al aire libre", caption: "Nay", heart: "#FFFFFF", position: "50% 45%" }, // blanco
      { src: "assets/album/recuerdo-9.jpg", alt: "Dos mujeres sonríen juntas en una fotografía nocturna", caption: "Yes", heart: "#E5262F", position: "50% 50%" }, // rojo
    ],
  },
  // Fotografías grupales: forman un corazón, fijas. Al tocar una se amplía (con su frase, si tiene).
  // La foto marcada con featured: true ocupa el centro del corazón, más grande; las demás se acomodan
  // alrededor en el espacio que mejor le queda a su forma. El orden de la lista es el orden al ampliarlas.
  // position ajusta el recorte dentro del corazón (la foto ampliada siempre se ve completa).
  groupGallery: {
    title: "Caminos compartidos",
    photos: [
      { src: "assets/grupales/grupo-3.jpg", alt: "Grupo de amigos posando juntos en una bolera", caption: "Entre tantas razones para celebrar, están las personas que hacen más bonitos mis días.", face: "55% 30%" },
      { src: "assets/grupales/grupo-6.jpg", alt: "Tres amigas con gorros de fiesta sentadas juntas en un sillón", face: "50% 45%" },
      { src: "assets/grupales/grupo-4.jpg", alt: "Dos amigas posan juntas durante una reunión", caption: "Hoy brindo por la vida, por los caminos compartidos y por la dicha de coincidir.", face: "48% 26%" },
      { src: "assets/grupales/grupo-7.jpg", alt: "Dos amigas posan con dos actores caracterizados con batas blancas", face: "42% 30%" },
      { src: "assets/grupales/grupo-8.jpg", alt: "Selfi de dos amigas al atardecer junto a una bandera de Grecia", face: "55% 45%" },
      { src: "assets/grupales/grupo-9.jpg", alt: "Selfi de dos amigas bajo luces moradas", face: "50% 40%" },
      { src: "assets/grupales/grupo-10.jpg", alt: "Dos amigas con playeras iguales en un parque", face: "48% 25%" },
      { src: "assets/grupales/grupo-1.jpg", alt: "Seis amigos reunidos alrededor de una mesa en un restaurante", caption: "Cumplir años también es mirar atrás y sonreír por tantas personas que hacen bonito el camino.", face: "50% 42%" },
      { src: "assets/grupales/grupo-11.jpg", alt: "Dos amigas posan con dos personajes de terror dentro de un vagón de tren", face: "55% 38%" },
      { src: "assets/grupales/grupo-12.jpg", alt: "Dos amigas hacen la señal de amor y paz frente a un escenario", caption: "Celebro la vida, sus sorpresas y esas coincidencias que, sin hacer ruido, se vuelven muy importantes.", face: "50% 30%" },
      { src: "assets/grupales/grupo-13.jpg", alt: "Selfi de tres amigas sonrientes", face: "52% 33%" },
      { src: "assets/grupales/grupo-2.jpg", alt: "Cuatro amigas sonríen juntas durante un paseo", caption: "Uno de los regalos más bonitos de la vida es coincidir con personas que dejan huella en el corazón.", face: "55% 28%" },
      { src: "assets/grupales/grupo-centro.jpg", alt: "Retrato con vestido rojo sobre fondo gris", featured: true, face: "50% 15%" }, // al centro, a petición de la clienta
      { src: "assets/grupales/grupo-14.jpg", alt: "Una amiga maquilla a otra en la calle", face: "40% 8%" },
    ],
  },
  // El lugar. La fecha y la hora se toman de date y time. Textos de la clienta.
  venue: {
    eyebrow: "¿Dónde nos vemos?",
    title: "¡A comer rico y diferente!",
    highlight: "diferente", // Palabra del título en cursiva. Vacío para no resaltar.
    description: "Doña Vero: tradición mexicana con un toque extravagante.", // El nombre del lugar va en negritas.
    flavors: "Una aventura de sabores que va de lo prehispánico a lo inesperado, con tlayudas, opciones veganas y quesadillas fuera de lo común.",
    // icon: "trofeo", "corazon" o "flor". strong: parte del texto que va en negritas (opcional).
    highlights: [
      { icon: "trofeo", text: "¡Seis veces campeona de la quesadilla más exótica de la CDMX!", strong: "¡Seis veces campeona" },
      { icon: "corazon", text: "Tacos y tortillas en forma de corazón." },
      { icon: "flor", text: "Pulque de cempasúchil, disponible por temporada, entre otros sabores…" },
    ],
    timeLabel: "Hora de encuentro",
    name: "Doña Vero",
    address: "Monterrey 313, Roma Sur",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Do%C3%B1a+Vero+Av.+Monterrey+313+Roma+Sur+CDMX",
    note: "Espacio privado para nuestra celebración.",
    thanks: "Gracias, Camilo, por darnos un espacio.",
    foodCaption: "Una mirada a los sabores de Doña Vero",
    // Fotografías reales del restaurante. Mientras el archivo no exista se muestra un espacio provisional.
    // Al recibirlas, ajusta alt para que describa exactamente lo que se ve en cada una.
    photos: {
      space: {
        src: "assets/dona-vero/espacio.jpg",
        alt: "Mesa de Doña Vero vista desde arriba: un plato amarillo con su nombre rodeado de tamales, salsas y frutas sobre platos de colores",
        position: "50% 47%",
      },
      tacos: {
        src: "assets/dona-vero/tacos-corazon.jpg",
        alt: "Tacos de Doña Vero en tortillas verdes en forma de corazón, con carne asada, nopales, cebolla y aguacate",
        position: "50% 50%",
      },
      kitchen: {
        src: "assets/dona-vero/cocina.jpg",
        alt: "Bebida naranja en tarro de vidrio decorada con una flor de cempasúchil, junto a pan de muerto",
        position: "40% 50%",
      },
    },
  },
  // Karaoke: entre el lugar y la confirmación. Anuncia el karaoke presencial; sin horarios, concursos, premios ni canciones.
  karaoke: {
    eyebrow: "También se vale cantar a todo pulmón",
    title: "¡El micrófono nos espera!",
    highlight: "micrófono", // Palabra del título en cursiva. Vacío para no resaltar.
    description: "¡Habrá karaoke, dinámicas y sorpresas! Pero, sobre todo, mucho cariño y alegría de compartir con ustedes.",
    cue: "¡Ve pensando cuál vas a cantar!", // Frase final destacada. Vacío para ocultarla.
  },
  // Confirmación de asistencia por WhatsApp: última sección, después del cierre.
  rsvp: {
    // Número de WhatsApp de la festejada con lada de país, por ejemplo "5215512345678" (México: 52 + 1 + 10 dígitos).
    // Mientras esté vacío, la respuesta muestra el agradecimiento pero NO llega a nadie. No usar el número del restaurante.
    whatsapp: "", // PENDIENTE: número de Victoria.
    title: "¡Confirmen su asistencia!",
    text: "Me encantará celebrar contigo. Confírmame si podrás acompañarme para organizar nuestro encuentro.",
    answerLabel: "Tu respuesta",
    yesLabel: "Sí, ahí estaré",
    noLabel: "Esta vez no podré",
    nameLabel: "Tu nombre",
    messageLabel: "Déjame un mensaje",
    optionalLabel: "Opcional",
    button: "Enviar respuesta por WhatsApp", // Con número configurado.
    buttonWithoutWhatsapp: "Enviar respuesta", // Mientras no hay número.
    // {nombre}, {fecha}, {hora} y {lugar} se reemplazan automáticamente. El mensaje opcional se agrega al final.
    // Con «Esta vez no podré» no se pide nombre ni mensaje: noMessage y los textos thanksNo* no usan {nombre}.
    yesMessage: "Hola, soy {nombre}. ¡Sí podré acompañarte a celebrar tu cumpleaños el {fecha} a las {hora} en {lugar}! ❤️",
    noMessage: "Hola, esta vez no podré acompañarte el {fecha}. Gracias por invitarme y pensar en mí. ❤️",
    nameError: "Escribe tu nombre para saber quién responde.",
    answerError: "Elige si podrás acompañarme.",
    // Agradecimiento que aparece al enviar.
    thanksYesTitle: "¡Gracias, {nombre}!",
    thanksYesText: "Me hace muy feliz saber que estarás. Nos vemos el {fecha} a las {hora} en {lugar}.",
    thanksNoTitle: "Gracias por avisarme",
    thanksNoText: "Gracias por pensar en mí. Te voy a extrañar ese día.",
    whatsappReminder: "Tu mensaje quedó listo en WhatsApp: envíalo desde ahí para que me llegue.",
    editLabel: "Cambiar mi respuesta",
  },
  // Cierre: agradecimiento de Victoria, antes de la confirmación. Mensaje de la clienta.
  closing: {
    title: "Qué bonito coincidir contigo",
    highlight: "coincidir", // Palabra del título que va en cursiva con el trazo amarillo. Vacío para no resaltar.
    message: [ // Texto o lista de párrafos. El último párrafo se destaca.
      "Gracias por hacerse un espacio para acompañarme en un día tan especial. Son personas importantes para mí y me hace muy feliz coincidir con ustedes.",
      "Los quiero mucho.",
    ],
    farewell: "Con cariño,",
    signature: "Victoria", // Si se deja vacío, se usa el nombre de la festejada. Lleva un corazón rojo al lado.
    backLabel: "Volver al inicio", // Sube a la portada sin repetir la entrada ni reiniciar la música.
    footerThanks: "Gracias por ser una de mis personas favoritas.", // Agradecimiento de la festejada al pie. PENDIENTE: confirmar con la clienta.
  },
});
