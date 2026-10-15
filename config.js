// Toda la información que cambia durante el desarrollo está aquí.
window.INVITATION_CONFIG = Object.freeze({
  name: "Victoria",
  photo: "assets/festejada.jpg", // Reemplazar por la fotografía de la clienta.
  photoPosition: "50% 40%", // Ajusta el encuadre sin modificar el CSS.
  date: "07 de noviembre",
  time: "16:00 h",
  // Inicio exacto para la cuenta regresiva (hora del centro de México, UTC-6).
  eventStart: "2026-11-07T16:00:00-06:00",
  countdownDone: "¡Hoy celebramos juntos!", // Se muestra cuando llega la hora.
  audio: "assets/milagros.mp3", // Archivo proporcionado por la clienta.
  audioStart: 35,
  nextSection: "carta", // Sección a la que lleva el botón «Compartamos este día».
  // Carta de la segunda sección. Texto provisional: reemplazar con las palabras de la clienta.
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
  // Tercera sección: el lugar. La fecha y la hora se toman de date y time.
  venue: {
    eyebrow: "Compartamos la mesa",
    title: "Nos vemos en Doña Vero", // El nombre del lugar se resalta dentro del título.
    description: "Una tarde para reunirnos, disfrutar sabores mexicanos y celebrar con nuestras personas favoritas.",
    name: "Doña Vero",
    address: "Av. Monterrey 313, Roma Sur, CDMX",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Do%C3%B1a+Vero+Av.+Monterrey+313+Roma+Sur+CDMX",
    note: "Tendremos un espacio reservado para nuestro festejo y karaoke para cantar juntos.",
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
  // Cuarta sección: confirmación de asistencia por WhatsApp.
  rsvp: {
    // Número de WhatsApp de la festejada con lada de país, por ejemplo "5215512345678" (México: 52 + 1 + 10 dígitos).
    // Mientras esté vacío, la respuesta muestra el agradecimiento pero NO llega a nadie. No usar el número del restaurante.
    whatsapp: "",
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
    yesMessage: "Hola, soy {nombre}. ¡Sí podré acompañarte a celebrar tu cumpleaños el {fecha} a las {hora} en {lugar}! ❤️",
    noMessage: "Hola, soy {nombre}. Esta vez no podré acompañarte el {fecha}. Gracias por invitarme y pensar en mí. ❤️",
    nameError: "Escribe tu nombre para saber quién responde.",
    answerError: "Elige si podrás acompañarme.",
    // Agradecimiento que aparece al enviar.
    thanksYesTitle: "¡Gracias, {nombre}!",
    thanksYesText: "Me hace muy feliz saber que estarás. Nos vemos el {fecha} a las {hora} en {lugar}.",
    thanksNoTitle: "Gracias, {nombre}",
    thanksNoText: "Gracias por avisarme y por pensar en mí. Te voy a extrañar ese día.",
    whatsappReminder: "Tu mensaje quedó listo en WhatsApp: envíalo desde ahí para que me llegue.",
    editLabel: "Cambiar mi respuesta",
  },
});
