(() => {
  "use strict";
  const config = window.INVITATION_CONFIG;
  const entry = document.getElementById("entry");
  const invitation = document.getElementById("invitation");
  const openButton = document.getElementById("open-invitation");
  const audio = document.getElementById("birthday-audio");
  const musicButton = document.getElementById("music-control");
  const musicLabel = document.getElementById("music-label");
  const musicStatus = document.getElementById("music-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let opened = false;
  let seekApplied = false;
  let audioFailed = false;
  const startAt = Math.max(0, Number(config.audioStart) || 0);

  document.getElementById("birthday-name").textContent = config.name;
  document.getElementById("birthday-date").textContent = config.date;
  document.getElementById("birthday-time").textContent = config.time;
  const photo = document.getElementById("birthday-photo");
  photo.alt = `Fotografía de ${config.name}`;
  photo.style.objectPosition = config.photoPosition || "center";
  photo.addEventListener("load", () => {
    photo.hidden = false;
    document.getElementById("photo-placeholder").hidden = true;
  });
  photo.addEventListener("error", () => {
    photo.hidden = true;
    document.getElementById("photo-placeholder").hidden = false;
  });
  if (config.photo) photo.src = config.photo;

  // Carta: título, mensaje y firma vienen de config.js.
  const letter = config.letter || {};
  if (letter.title) document.getElementById("letter-title").textContent = letter.title;
  if (Array.isArray(letter.message) && letter.message.length) {
    const body = document.getElementById("letter-body");
    body.replaceChildren(...letter.message.filter(Boolean).map(text => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    }));
  }
  if (letter.closing !== undefined) document.getElementById("letter-closing").textContent = letter.closing;
  document.getElementById("letter-name").textContent = letter.signature || config.name;

  // Lugar: textos, enlace y fotografías vienen de config.js.
  const venue = config.venue || {};
  const setText = (id, value) => { if (value) document.getElementById(id).textContent = value; };
  setText("venue-eyebrow", venue.eyebrow);
  setText("venue-description", venue.description);
  setText("venue-date", config.date);
  setText("venue-time", config.time);
  setText("venue-name", venue.name);
  setText("venue-ph-name", venue.name);
  setText("venue-address", venue.address);
  setText("venue-note", venue.note);
  // El nombre del lugar no se parte en dos líneas; en el título además va en cursiva.
  function textWithName(id, text, tag) {
    if (!text) return;
    const element = document.getElementById(id);
    const at = venue.name ? text.lastIndexOf(venue.name) : -1;
    if (at < 0) {
      element.textContent = text;
      return;
    }
    const name = document.createElement(tag);
    name.className = "venue-nowrap";
    name.textContent = venue.name;
    element.replaceChildren(text.slice(0, at), name, text.slice(at + venue.name.length));
  }
  textWithName("venue-title", venue.title, "em");
  textWithName("venue-food-caption", venue.foodCaption, "span");
  if (venue.mapsUrl) document.getElementById("venue-map").href = venue.mapsUrl;
  const venuePhotos = venue.photos || {};
  document.querySelectorAll("[data-venue-photo]").forEach(frame => {
    const data = venuePhotos[frame.dataset.venuePhoto] || {};
    const image = frame.querySelector("img");
    const placeholder = frame.querySelector(".venue-ph");
    // Sin archivo, el espacio provisional ocupa su lugar y se anuncia a lectores de pantalla.
    const showPlaceholder = () => {
      image.hidden = true;
      placeholder.hidden = false;
      placeholder.removeAttribute("aria-hidden");
    };
    if (!data.src) {
      showPlaceholder();
      return;
    }
    image.alt = data.alt || "";
    image.style.objectPosition = data.position || "center";
    image.addEventListener("load", () => {
      frame.classList.add("has-photo");
      placeholder.hidden = true;
    }, { once:true });
    image.addEventListener("error", showPlaceholder, { once:true });
    image.src = data.src;
  });

  function updateMusic() {
    const playing = !audio.paused && !audio.ended;
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute("aria-label", playing ? "Pausar música" : "Reanudar música");
    musicLabel.textContent = playing ? "Pausar" : "Reanudar";
  }
  function applyStart() {
    if (seekApplied || audio.readyState < 1) return;
    // Si se proporciona un archivo demasiado corto, abre igualmente sin música.
    if (Number.isFinite(audio.duration) && startAt >= audio.duration) {
      failAudio();
      return;
    }
    try {
      audio.currentTime = startAt;
      seekApplied = true;
    } catch { /* Se reintenta cuando haya datos disponibles. */ }
  }
  function failAudio() {
    audioFailed = true;
    audio.pause();
    musicButton.hidden = true;
    musicStatus.textContent = "La música no está disponible. Puedes disfrutar de la invitación.";
  }
  function loadAudio() {
    if (!config.audio || audio.getAttribute("src")) return;
    // El fragmento #t indica al navegador que empiece directamente en el segundo configurado.
    audio.src = `${config.audio}#t=${startAt}`;
  }
  async function playMusic() {
    if (!config.audio || audioFailed) return;
    loadAudio();
    try {
      if (audio.ended && seekApplied) audio.currentTime = startAt;
      await audio.play();
      if (!audioFailed) musicButton.hidden = false;
    } catch (error) {
      if (error.name === "NotAllowedError") {
        musicButton.hidden = false;
        musicLabel.textContent = "Reproducir";
        musicButton.setAttribute("aria-label", "Reproducir música");
        musicStatus.textContent = "Toca el control de música para iniciar la reproducción.";
      } else {
        failAudio();
      }
    }
  }
  audio.addEventListener("loadedmetadata", applyStart);
  audio.addEventListener("canplay", applyStart);
  audio.addEventListener("error", failAudio);
  ["play", "pause", "ended"].forEach(event => audio.addEventListener(event, updateMusic));

  // Video de fondo de la entrada (silenciado, en bucle).
  const entryVideo = document.getElementById("entry-video");
  if (entryVideo) {
    entryVideo.muted = true;
    if (!reducedMotion.matches) entryVideo.play().catch(() => { /* Se muestra la imagen fija. */ });
  }

  // La música intenta iniciar sola al cargar la página. Si el navegador lo bloquea
  // (la mayoría exige una interacción), empieza con el primer toque, clic o tecla.
  const unlockEvents = ["pointerdown", "touchstart", "keydown"];
  function unlockAudio() {
    unlockEvents.forEach(type => document.removeEventListener(type, unlockAudio, true));
    if (audio.paused) playMusic();
  }
  if (config.audio) {
    loadAudio();
    audio.play().catch(error => {
      if (error.name !== "NotAllowedError") return;
      unlockEvents.forEach(type => document.addEventListener(type, unlockAudio, { capture:true, passive:true }));
    });
  }

  openButton.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    openButton.disabled = true;
    // La transición de apertura se expande desde el botón.
    const origin = openButton.getBoundingClientRect();
    entry.style.setProperty("--ox", `${origin.left + origin.width / 2}px`);
    entry.style.setProperty("--oy", `${origin.top + origin.height / 2}px`);
    void getComputedStyle(entry, "::after").clipPath; // Fija el origen antes de iniciar la transición.
    // play() se llama dentro del gesto del usuario, sin esperar la transición.
    playMusic();
    entry.classList.add("is-leaving");
    window.setTimeout(() => {
      entry.hidden = true;
      if (entryVideo) entryVideo.pause();
      invitation.hidden = false;
      invitation.inert = false;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          invitation.classList.add("is-visible");
          document.getElementById("cover-phrase").focus({ preventScroll:true });
        });
      });
    }, reducedMotion.matches ? 0 : 800);
  });
  // Inclinación sutil del retrato al mover el cursor (solo escritorio).
  const portraitWrap = document.getElementById("portrait-wrap");
  if (portraitWrap && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    invitation.addEventListener("pointermove", event => {
      if (reducedMotion.matches) return;
      const box = portraitWrap.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) / window.innerWidth;
      const y = (event.clientY - (box.top + box.height / 2)) / window.innerHeight;
      portraitWrap.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
      portraitWrap.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
    });
    invitation.addEventListener("pointerleave", () => {
      portraitWrap.style.setProperty("--ry", "0deg");
      portraitWrap.style.setProperty("--rx", "0deg");
    });
  }
  musicButton.addEventListener("click", () => {
    if (audio.paused) playMusic();
    else audio.pause();
  });
  // El cielo pintado acompaña el desplazamiento: arriba la luna, abajo el río dorado.
  const skyArt = document.getElementById("sky-art");
  if (skyArt) {
    let skyFrame = 0;
    const moveSky = () => {
      skyFrame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      skyArt.style.setProperty("--pan", progress.toFixed(4));
    };
    const requestSky = () => { if (!skyFrame) skyFrame = window.requestAnimationFrame(moveSky); };
    window.addEventListener("scroll", requestSky, { passive:true });
    window.addEventListener("resize", requestSky);
    moveSky();
  }

  // Aparición suave de la carta y del lugar al entrar en pantalla.
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(item => {
        if (!item.isIntersecting) return;
        item.target.classList.add("is-in");
        observer.unobserve(item.target);
      });
    }, { threshold:.15, rootMargin:"0px 0px -8% 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-in"));
  }

  document.getElementById("next-section").addEventListener("click", () => {
    const next = config.nextSection && document.getElementById(config.nextSection);
    if (next) {
      next.scrollIntoView({ behavior:reducedMotion.matches ? "instant" : "smooth", block:"start" });
      next.focus({ preventScroll:true });
    } else {
      document.getElementById("next-message").textContent = "Pronto, más detalles para compartir este día.";
    }
    // Punto de integración para las secciones que agregaremos después.
    document.dispatchEvent(new CustomEvent("invitation:continue"));
  });
})();
