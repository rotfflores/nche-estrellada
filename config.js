// Toda la información que cambia durante el desarrollo está aquí.
window.INVITATION_CONFIG = Object.freeze({
  name: "Victoria",
  photo: "assets/festejada.jpg", // Reemplazar por la fotografía de la clienta.
  photoPosition: "50% 40%", // Ajusta el encuadre sin modificar el CSS.
  date: "07 de noviembre",
  time: "16:00 h",
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
        alt: "Interior del restaurante Doña Vero, en la colonia Roma Sur",
        position: "50% 50%",
      },
      tacos: {
        src: "assets/dona-vero/tacos-corazon.jpg",
        alt: "Tacos de Doña Vero servidos en tortillas en forma de corazón",
        position: "50% 50%",
      },
      kitchen: {
        src: "assets/dona-vero/cocina.jpg",
        alt: "Platillo de la cocina mexicana de Doña Vero",
        position: "50% 50%",
      },
    },
  },
});
