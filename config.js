// Toda la información que cambia durante el desarrollo está aquí.
//
// PENDIENTE DE LA CLIENTA (busca «PENDIENTE» en este archivo):
// 1. Número de WhatsApp de Victoria en rsvp.whatsapp. Sin él, las respuestas NO llegan a nadie.
// 2. Textos definitivos de la carta (letter) y del cierre (closing), incluido el agradecimiento del pie; los actuales son provisionales.
// 3. Acompañantes o fecha límite para confirmar: no se muestran hasta que la clienta lo indique.
// 4. Texto introductorio de «Cada versión de mí» y contexto opcional de sus etapas; el actual es provisional.
window.INVITATION_CONFIG = Object.freeze({
  name: "Victoria",
  photo: "assets/festejada.jpg", // Fotografía de Victoria proporcionada por la clienta.
  photoPosition: "50% 8%", // Mantiene visible el rostro en el recorte horizontal del celular.
  date: "07 de noviembre",
  time: "16:00 h",
  // Inicio exacto para la cuenta regresiva (hora del centro de México, UTC-6).
  eventStart: "2026-11-07T16:00:00-06:00",
  countdownDone: "¡Hoy celebramos juntos!", // Se muestra cuando llega la hora.
  audio: "assets/milagros.mp3", // Archivo proporcionado por la clienta.
  audioStart: 35,
  nextSection: "carta", // Sección a la que lleva el botón «Compartamos este día».
  // Carta de la segunda sección. PENDIENTE: texto provisional, reemplazar con las palabras de la clienta.
  letter: {
    title: "Mi lugar favorito es con ustedes",
    message: [
      "Este cumpleaños quiero celebrarlo cerca de las personas que hacen mis días más bonitos.",
      "Compartir la mesa, reírnos, cantar y sumar un recuerdo juntos será mi manera favorita de celebrar.",
      "Por eso, me encantaría que estuvieras ahí.",
    ],
    closing: "Con cariño,",
    signature: "Victoria", // Si se deja vacío, se usa el nombre de la festejada.
  },
  // Cada versión de mí: recorrido fotográfico entre la carta y el álbum.
  evolution: {
    title: "Cada versión de mí",
    highlight: "versión", // Palabra del título en cursiva. Vacío para no resaltar.
    intro: "He cambiado, he aprendido y he descubierto nuevas formas de ser yo. Hoy celebro todo lo vivido y la persona en la que me estoy convirtiendo.", // PENDIENTE: texto provisional.
    // Las seis fotos proporcionadas por la clienta se muestran en este orden.
    // stage: nombre de la etapa. phrase: comentario que dio la clienta (opcional).
    // position: encuadre de cada foto ("50% 30%" = centrada y un poco hacia arriba, para no cortar la cabeza).
    photos: [
      { src: "assets/etapas/etapa-1.jpg", alt: "Victoria de niña, con vestido a cuadros frente a un fondo rojo y negro", stage: "Etapa 1", phrase: "", position: "50% 35%" },
      { src: "assets/etapas/etapa-2.jpg", alt: "Fotografía familiar de infancia: tres niños y un adulto junto a un pastel de cumpleaños", stage: "Etapa 2", phrase: "Pasaron etapas … hasta los 2022.. jaja", position: "50% 48%" },
      { src: "assets/etapas/etapa-3.jpg", alt: "Victoria con los brazos abiertos junto a una laguna y montañas", stage: "Etapa 3", phrase: "", position: "50% 52%" },
      { src: "assets/etapas/etapa-4.jpg", alt: "Victoria corre sonriente en una carrera por una avenida", stage: "Etapa 4", phrase: "", position: "50% 40%" },
      { src: "assets/etapas/etapa-5.jpg", alt: "Victoria sentada en un sofá, con vestido negro, frente a un muro verde", stage: "Etapa 5", phrase: "", position: "50% 37%" },
      { src: "assets/etapas/etapa-6.jpg", alt: "Victoria de pie al aire libre con un micrófono en la mano", stage: "Etapa 6", phrase: "", position: "50% 43%" },
    ],
  },
  album: {
    title: "Mis recuerdos favoritos tienen compañía",
    highlight: "compañía", // Palabra del título en cursiva. Vacío para no resaltar.
    photos: [
      { src: "assets/album/recuerdo-1.jpg", alt: "Tres mujeres posan en un jardín junto a una cascada", caption: "Nancy y Sure 🫶🏻", position: "50% 55%" },
      { src: "assets/album/recuerdo-2.png", alt: "Dos hombres y una mujer sonríen ante una decoración de globos", caption: "Leo y Ramiro 💜", position: "50% 45%" },
      { src: "assets/album/recuerdo-3.png", alt: "Tres mujeres sonríen durante una reunión", caption: "Ilse e Ixnán 💛", position: "50% 45%" },
      { src: "assets/album/recuerdo-4.png", alt: "Tres mujeres posan en una tienda de figuras coleccionables", caption: "Yanai y Ana 💚", position: "50% 42%" },
      { src: "assets/album/recuerdo-5.png", alt: "Tres personas posan frente a una exhibición de figuras", caption: "Elo y Pao 🧡", position: "50% 38%" },
      { src: "assets/album/recuerdo-6.png", alt: "Tres personas sonríen al aire libre entre árboles", caption: "Vishal y Ana Karen 🫶🏻", position: "50% 45%" },
      { src: "assets/album/recuerdo-7.png", alt: "Dos mujeres sonríen juntas en una mesa", caption: "Alexandra 🙂", position: "50% 43%" },
      { src: "assets/album/recuerdo-8.png", alt: "Dos mujeres sonríen durante un paseo al aire libre", caption: "Nay 😊", position: "50% 45%" },
      { src: "assets/album/recuerdo-9.jpg", alt: "Dos mujeres sonríen juntas en una fotografía nocturna", caption: "Yes ❤️", position: "50% 50%" },
    ],
  },
  // Fotografías grupales, en un apartado independiente y sin desplazamiento horizontal.
  // Cada frase corresponde a la fotografía de la misma posición en esta lista.
  groupGallery: {
    title: "Caminos compartidos",
    photos: [
      { src: "assets/grupales/grupo-1.jpg", alt: "Seis amigos reunidos alrededor de una mesa en un restaurante", caption: "Cumplir años también es mirar atrás y sonreír por tantas personas que hacen bonito el camino." },
      { src: "assets/grupales/grupo-2.jpg", alt: "Cuatro amigas sonríen juntas durante un paseo", caption: "Uno de los regalos más bonitos de la vida es coincidir con personas que dejan huella en el corazón." },
      { src: "assets/grupales/grupo-3.jpg", alt: "Grupo de amigos posando juntos en una bolera", caption: "Entre tantas razones para celebrar, están las personas que hacen más bonitos mis días." },
      { src: "assets/grupales/grupo-4.jpg", alt: "Dos amigas posan juntas durante una reunión", caption: "Hoy brindo por la vida, por los caminos compartidos y por la dicha de coincidir." },
      { src: "assets/grupales/grupo-5.jpg", alt: "Dos amigas posan juntas ante una pared clara", caption: "Celebro la vida, sus sorpresas y esas coincidencias que, sin hacer ruido, se vuelven muy importantes." },
    ],
  },
  // Tercera sección: el lugar. La fecha y la hora se toman de date y time.
  venue: {
    eyebrow: "Compartamos la mesa",
    title: "Nos vemos en Doña Vero", // El nombre del lugar se resalta dentro del título.
    description: "Una tarde para reunirnos, disfrutar sabores mexicanos y celebrar con nuestras personas favoritas.",
    name: "Doña Vero",
    address: "Av. Monterrey 313, Roma Sur, CDMX",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Do%C3%B1a+Vero+Av.+Monterrey+313+Roma+Sur+CDMX",
    note: "Tendremos un espacio reservado para nuestro festejo.",
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
    title: "El micrófono nos espera",
    highlight: "micrófono", // Palabra del título en cursiva. Vacío para no resaltar.
    description: "Habrá karaoke para cantar nuestras favoritas, reírnos y hacer de esta tarde un recuerdo todavía más bonito.",
    cue: "¡Ve pensando cuál vas a cantar!", // Frase final destacada. Vacío para ocultarla.
  },
  // Cuarta sección: confirmación de asistencia por WhatsApp.
  rsvp: {
    // Número de WhatsApp de la festejada con lada de país, por ejemplo "5215512345678" (México: 52 + 1 + 10 dígitos).
    // Mientras esté vacío, la respuesta muestra el agradecimiento pero NO llega a nadie. No usar el número del restaurante.
    whatsapp: "", // PENDIENTE: número de Victoria.
    title: "¿Compartimos este día?",
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
  // Quinta sección: cierre. PENDIENTE: texto provisional, reemplazar con las palabras de la clienta.
  closing: {
    title: "Qué bonito coincidir contigo",
    highlight: "coincidir", // Palabra del título que va en cursiva con el trazo amarillo. Vacío para no resaltar.
    message: "Lo que hará especial este cumpleaños será compartirlo con ustedes. Gracias por ser parte de mi vida y de los recuerdos que más quiero.", // Texto o lista de párrafos.
    farewell: "Con cariño,",
    signature: "Victoria", // Si se deja vacío, se usa el nombre de la festejada.
    backLabel: "Volver al inicio", // Sube a la portada sin repetir la entrada ni reiniciar la música.
    footerThanks: "Gracias por ser una de mis personas favoritas.", // Agradecimiento de la festejada al pie. PENDIENTE: confirmar con la clienta.
  },
});
