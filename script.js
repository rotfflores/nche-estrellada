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
  // Confirmación: textos y número vienen de config.js.
  const rsvp = config.rsvp || {};
  setText("rsvp-title", rsvp.title);
  setText("rsvp-text", rsvp.text);
  setText("rsvp-answer-legend", rsvp.answerLabel);
  setText("rsvp-si-label", rsvp.yesLabel);
  setText("rsvp-no-label", rsvp.noLabel);
  setText("rsvp-name-label", rsvp.nameLabel);
  setText("rsvp-message-label", rsvp.messageLabel);
  setText("rsvp-optional", rsvp.optionalLabel);
  setText("rsvp-edit", rsvp.editLabel);
  const rsvpForm = document.getElementById("rsvp-form");
  if (rsvpForm) {
    const details = document.getElementById("rsvp-details");
    const nameInput = document.getElementById("rsvp-name");
    const messageInput = document.getElementById("rsvp-message");
    const nameError = document.getElementById("rsvp-name-error");
    const answerError = document.getElementById("rsvp-answer-error");
    const choicesField = rsvpForm.querySelector(".rsvp-choices");
    const answers = [...rsvpForm.querySelectorAll('input[name="rsvp-answer"]')];
    const thanks = document.getElementById("rsvp-thanks");
    const thanksTitle = document.getElementById("rsvp-thanks-title");
    const phone = String(rsvp.whatsapp || "").replace(/\D/g, "");
    const hasWhatsapp = phone.length >= 10;
    setText("rsvp-submit-text", hasWhatsapp ? rsvp.button : (rsvp.buttonWithoutWhatsapp || rsvp.button));

    const showError = (field, error, message) => {
      error.textContent = message;
      field.setAttribute("aria-invalid", message ? "true" : "false");
    };
    const fill = (template, name) => String(template || "")
      .replaceAll("{nombre}", name)
      .replaceAll("{fecha}", config.date)
      .replaceAll("{hora}", config.time)
      .replaceAll("{lugar}", venue.name || "");
    // El título del agradecimiento aparece palabra por palabra.
    const wordsInto = (element, text) => {
      element.replaceChildren(...text.split(" ").flatMap((word, index) => {
        const span = document.createElement("span");
        span.className = "tw";
        span.style.setProperty("--i", index);
        span.textContent = word;
        return index ? [" ", span] : [span];
      }));
    };

    // Elegir una respuesta abre el nombre y el mensaje opcional.
    answers.forEach(input => input.addEventListener("change", () => {
      showError(choicesField, answerError, "");
      details.inert = false;
      details.classList.add("is-open");
      rsvpForm.dataset.answer = input.value;
    }));
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim()) showError(nameInput, nameError, "");
    });

    rsvpForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = nameInput.value.trim().replace(/\s+/g, " ");
      const answer = answers.find(input => input.checked);
      showError(choicesField, answerError, answer ? "" : (rsvp.answerError || "Elige una respuesta."));
      showError(nameInput, nameError, name ? "" : (rsvp.nameError || "Escribe tu nombre."));
      if (!answer) { answers[0].focus(); return; }
      if (!name) { nameInput.focus(); return; }
      const yes = answer.value === "si";
      if (hasWhatsapp) {
        let message = fill(yes ? rsvp.yesMessage : rsvp.noMessage, name);
        const note = messageInput.value.trim();
        if (note) message += `\n\n${note}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        // WhatsApp se abre aparte para que la invitación y la música sigan aquí.
        const opened = window.open(url, "_blank");
        if (opened) opened.opener = null;
        else window.location.href = url;
      }
      // Agradecimiento con animación (inmediato si se pidió reducir movimiento).
      wordsInto(thanksTitle, fill(yes ? rsvp.thanksYesTitle : rsvp.thanksNoTitle, name));
      document.getElementById("rsvp-thanks-text").textContent = fill(yes ? rsvp.thanksYesText : rsvp.thanksNoText, name);
      // Solo se pide enviar desde WhatsApp cuando de verdad se abrió.
      document.getElementById("rsvp-thanks-reminder").textContent = hasWhatsapp ? (rsvp.whatsappReminder || "") : "";
      thanks.classList.toggle("is-no", !yes);
      rsvpForm.classList.add("is-leaving");
      window.setTimeout(() => {
        rsvpForm.hidden = true;
        rsvpForm.classList.remove("is-leaving");
        thanks.hidden = false;
        thanks.classList.remove("is-in");
        void thanks.offsetWidth; // Reinicia la animación si se vuelve a enviar.
        thanks.classList.add("is-in");
        thanksTitle.focus({ preventScroll:true });
        const box = thanks.getBoundingClientRect();
        if (box.top < 0 || box.top > window.innerHeight * .6) thanks.scrollIntoView({ behavior:reducedMotion.matches ? "instant" : "smooth", block:"center" });
      }, reducedMotion.matches ? 0 : 450);
    });

    document.getElementById("rsvp-edit").addEventListener("click", () => {
      thanks.hidden = true;
      thanks.classList.remove("is-in");
      rsvpForm.hidden = false;
      nameInput.focus();
    });
  }

  // Cuenta regresiva: cada cifra que cambia rueda hacia arriba.
  const countdown = document.getElementById("countdown");
  const eventStart = Date.parse(config.eventStart);
  if (countdown && Number.isFinite(eventStart)) {
    countdown.hidden = false;
    const units = {};
    countdown.querySelectorAll("[data-unit]").forEach(element => { units[element.dataset.unit] = element; });
    const labels = { days:["Día","Días"], hours:["Hora","Horas"], minutes:["Minuto","Minutos"], seconds:["Segundo","Segundos"] };
    const countdownText = document.getElementById("countdown-text");
    let lastSpoken = "";
    function rollDigit(slot, char, animate) {
      const current = slot.lastElementChild;
      if (current && current.textContent === char && !current.classList.contains("is-out")) return;
      const next = document.createElement("span");
      next.textContent = char;
      if (current && animate) {
        current.className = "is-out";
        next.className = "is-in";
        window.setTimeout(() => current.remove(), 800);
      } else if (current) {
        current.remove();
      }
      slot.append(next);
    }
    function showNumber(unit, value, animate) {
      const element = units[unit];
      const text = String(value).padStart(2, "0");
      while (element.children.length < text.length) {
        const slot = document.createElement("span");
        slot.className = "cd-digit";
        element.prepend(slot);
      }
      while (element.children.length > text.length) element.firstElementChild.remove();
      [...text].forEach((char, index) => rollDigit(element.children[index], char, animate));
      document.getElementById(`cd-label-${unit}`).textContent = labels[unit][value === 1 ? 0 : 1];
    }
    function tick() {
      const left = eventStart - Date.now();
      if (left <= 0) {
        countdown.classList.add("is-done");
        document.getElementById("countdown-title").textContent = config.countdownDone || "¡Hoy celebramos!";
        countdownText.textContent = "";
        return;
      }
      const total = Math.floor(left / 1000);
      const parts = { days:Math.floor(total / 86400), hours:Math.floor(total / 3600) % 24, minutes:Math.floor(total / 60) % 60, seconds:total % 60 };
      // Sin animación mientras la invitación está oculta o si se pidió reducir movimiento.
      const animate = !reducedMotion.matches && !invitation.hidden && !document.hidden;
      Object.entries(parts).forEach(([unit, value]) => showNumber(unit, value, animate));
      const spoken = `Faltan ${parts.days} ${labels.days[parts.days === 1 ? 0 : 1].toLowerCase()}, ${parts.hours} ${labels.hours[parts.hours === 1 ? 0 : 1].toLowerCase()} y ${parts.minutes} ${labels.minutes[parts.minutes === 1 ? 0 : 1].toLowerCase()} para la celebración.`;
      if (spoken !== lastSpoken) countdownText.textContent = lastSpoken = spoken;
      window.setTimeout(tick, 1000 - (Date.now() % 1000) + 15);
    }
    tick();
  }

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
