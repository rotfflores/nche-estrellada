// Toda la información que cambia durante el desarrollo está aquí.
//
// PENDIENTE DE LA CLIENTA (busca «PENDIENTE» en este archivo):
// 1. Fotografía de la festejada: guardarla como assets/festejada.jpg (mientras falte se ve un marcador).
// 2. Número de WhatsApp de Victoria en rsvp.whatsapp. Sin él, las respuestas NO llegan a nadie.
// 3. Textos definitivos de la carta (letter) y del cierre (closing), incluido el agradecimiento del pie; los actuales son provisionales.
// 4. Acompañantes o fecha límite para confirmar: no se muestran hasta que la clienta lo indique.
// 5. Fotografías del álbum en assets/album/ (mientras falten se ven espacios provisionales), con su alt y pie de foto.
// 6. Fotografías de «Cada versión de mí» en assets/etapas/, de la etapa más antigua a la más reciente, con su alt; etapa y frase solo si la clienta las da. El texto introductorio es provisional.
window.INVITATION_CONFIG = Object.freeze({
  name: "Victoria",
  photo: "assets/festejada.jpg", // PENDIENTE: fotografía de la clienta.
  photoPosition: "50% 40%", // Ajusta el encuadre sin modificar el CSS.
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
  // Álbum de fotos (entre la carta y el lugar): pila de instantáneas que se desliza a los lados.
  // Cada foto: src (ruta), alt (describe lo que se ve), caption (pie de foto opcional) y position (encuadre, como "50% 30%").
  // Agrega o borra fotos de la lista: el contador se ajusta solo. Con una sola foto se ocultan los controles; sin fotos se oculta la sección.
  // PENDIENTE: fotografías de la clienta. Mientras un archivo falte se ve un espacio provisional.
  // Cada versión de mí: recorrido fotográfico entre la carta y el álbum.
  evolution: {
    title: "Cada versión de mí",
    highlight: "versión", // Palabra del título en cursiva. Vacío para no resaltar.
    intro: "He cambiado, he aprendido y he descubierto nuevas formas de ser yo. Hoy celebro todo lo vivido y la persona en la que me estoy convirtiendo.", // PENDIENTE: texto provisional.
    // PENDIENTE: fotos de la clienta. Entre tres y cinco, de la etapa más antigua a la más reciente; se muestran en este orden.
    // stage: fecha o nombre de la etapa (opcional). phrase: frase breve de la clienta (opcional). Si van vacíos, no se muestran.
    // position: encuadre de cada foto ("50% 30%" = centrada y un poco hacia arriba, para no cortar la cabeza).
    photos: [
      { src: "assets/etapas/etapa-1.jpg", alt: "", stage: "", phrase: "", position: "50% 30%" },
      { src: "assets/etapas/etapa-2.jpg", alt: "", stage: "", phrase: "", position: "50% 30%" },
      { src: "assets/etapas/etapa-3.jpg", alt: "", stage: "", phrase: "", position: "50% 30%" },
      { src: "assets/etapas/etapa-4.jpg", alt: "", stage: "", phrase: "", position: "50% 30%" },
    ],
  },
  album: {
    title: "Mis recuerdos favoritos tienen compañía",
    highlight: "compañía", // Palabra del título en cursiva. Vacío para no resaltar.
    hint: "Desliza las fotos para descubrir más recuerdos",
    photos: [
      { src: "assets/album/recuerdo-1.jpg", alt: "", caption: "", position: "50% 50%" },
      { src: "assets/album/recuerdo-2.jpg", alt: "", caption: "", position: "50% 50%" },
      { src: "assets/album/recuerdo-3.jpg", alt: "", caption: "", position: "50% 50%" },
      { src: "assets/album/recuerdo-4.jpg", alt: "", caption: "", position: "50% 50%" },
      { src: "assets/album/recuerdo-5.jpg", alt: "", caption: "", position: "50% 50%" },
      { src: "assets/album/recuerdo-6.jpg", alt: "", caption: "", position: "50% 50%" },
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
