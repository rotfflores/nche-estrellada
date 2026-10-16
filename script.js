(() => {
  "use strict";
  // Si config.js tiene un error (una coma o comilla de más), la invitación abre igual con los textos de index.html.
  const config = window.INVITATION_CONFIG || {};
  if (!window.INVITATION_CONFIG) console.error("config.js no se pudo leer (revisa comas y comillas). Se usan los textos de index.html.");
  const entry = document.getElementById("entry");
  const invitation = document.getElementById("invitation");
  const openButton = document.getElementById("open-invitation");
  const audio = document.getElementById("birthday-audio");
  const musicButton = document.getElementById("music-control");
  const musicLabel = document.getElementById("music-label");
  const musicStatus = document.getElementById("music-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let opened = false;
  let userPaused = false; // El invitado pausó la música con el control: nada la vuelve a iniciar sola.
  let seekApplied = false;
  let audioFailed = false;
  const startAt = Math.max(0, Number(config.audioStart) || 0);

  if (config.name) document.getElementById("birthday-name").textContent = config.name;
  if (config.date) document.getElementById("birthday-date").textContent = config.date;
  if (config.time) document.getElementById("birthday-time").textContent = config.time;
  const hostName = document.getElementById("birthday-name").textContent;
  const eventDate = document.getElementById("birthday-date").textContent;
  const eventTime = document.getElementById("birthday-time").textContent;
  const photo = document.getElementById("birthday-photo");
  photo.alt = `Fotografía de ${hostName}`;
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
  document.getElementById("letter-name").textContent = letter.signature || hostName;

  // Lugar: textos, enlace y fotografías vienen de config.js.
  const venue = config.venue || {};
  const setText = (id, value) => { if (value) document.getElementById(id).textContent = value; };
  // Título con una palabra resaltada en cursiva; cada palabra queda en su propio elemento para animarla.
  function buildTitle(element, text, highlight, highlightClass, decoration) {
    const target = (highlight || "").trim().toLocaleLowerCase("es");
    let highlighted = false;
    const parts = [];
    String(text).trim().split(/\s+/).forEach((word, index) => {
      const clean = word.replace(/[^\p{L}\p{N}]/gu, "").toLocaleLowerCase("es");
      const isHighlight = Boolean(target) && !highlighted && clean === target;
      const part = document.createElement(isHighlight ? "em" : "span");
      part.className = isHighlight ? `cw ${highlightClass}` : "cw";
      part.style.setProperty("--i", index);
      part.textContent = word;
      if (isHighlight) {
        highlighted = true;
        if (decoration) part.append(decoration);
      }
      if (parts.length) parts.push(" ");
      parts.push(part);
    });
    element.replaceChildren(...parts);
  }
  setText("venue-eyebrow", venue.eyebrow);
  setText("venue-description", venue.description);
  setText("venue-date", eventDate);
  setText("venue-time", eventTime);
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
      // La foto aparece ya decodificada encima del marcador; el marcador se retira cuando terminó de aparecer.
      const show = () => {
        frame.classList.add("has-photo");
        window.setTimeout(() => { placeholder.hidden = true; }, reducedMotion.matches ? 0 : 950);
      };
      if (image.decode) image.decode().then(show, show);
      else show();
    }, { once:true });
    image.addEventListener("error", showPlaceholder, { once:true });
    image.src = data.src;
  });

  function updateMusic() {
    const playing = !audio.paused && !audio.ended;
    musicButton.classList.toggle("is-playing", playing);
    musicButton.setAttribute("aria-label", playing ? "Pausar música" : "Reanudar música");
    musicLabel.textContent = playing ? "Pausar" : "Reanudar";
    if (playing) musicStatus.textContent = "";
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
        // En la entrada, si el gesto no bastó (deslizar, Escape), se espera el siguiente sin mostrar el control en silencio.
        if (!opened) {
          unlockEvents.forEach(type => document.addEventListener(type, unlockAudio, { capture:true, passive:true }));
          return;
        }
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
  // En celulares el gesto cuenta cuando el dedo se levanta (al tocar, no al deslizar), por eso también se escuchan pointerup, touchend y click.
  const unlockEvents = ["pointerdown", "touchstart", "pointerup", "touchend", "click", "keydown"];
  function unlockAudio() {
    // Si el navegador indica que este evento aún no es un gesto válido (el dedo apenas toca, Escape), se espera el siguiente.
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    unlockEvents.forEach(type => document.removeEventListener(type, unlockAudio, true));
    if (audio.paused && !userPaused) playMusic();
  }
  if (config.audio) {
    loadAudio();
    // Si el navegador permite que suene sola, el control para pausarla aparece desde la entrada.
    audio.play().then(() => { if (!audioFailed) musicButton.hidden = false; }).catch(error => {
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
    // play() se llama dentro del gesto del usuario, sin esperar la transición. Si el invitado la pausó en la entrada, sigue en pausa.
    unlockEvents.forEach(type => document.removeEventListener(type, unlockAudio, true));
    if (!userPaused) playMusic();
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
    let tilted = false;
    const resetTilt = () => {
      if (!tilted) return;
      portraitWrap.style.setProperty("--ry", "0deg");
      portraitWrap.style.setProperty("--rx", "0deg");
      tilted = false;
    };
    const limit = value => Math.max(-.75, Math.min(.75, value));
    invitation.addEventListener("pointermove", event => {
      if (reducedMotion.matches) return;
      const box = portraitWrap.getBoundingClientRect();
      // Lejos de la portada el retrato queda derecho, así regresa sin deformarse con «Volver al inicio».
      if (box.bottom < 0 || box.top > window.innerHeight) { resetTilt(); return; }
      const x = limit((event.clientX - (box.left + box.width / 2)) / window.innerWidth);
      const y = limit((event.clientY - (box.top + box.height / 2)) / window.innerHeight);
      portraitWrap.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
      portraitWrap.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
      tilted = true;
    });
    invitation.addEventListener("pointerleave", resetTilt);
  }
  musicButton.addEventListener("click", () => {
    if (audio.paused) { userPaused = false; playMusic(); }
    else { userPaused = true; audio.pause(); }
  });
  // Celular: el control de música se hace a un lado mientras un título o un botón pasa por la esquina superior donde vive.
  const phoneLayout = window.matchMedia("(max-width:849px), (orientation:landscape) and (max-height:500px) and (pointer:coarse)");
  const underMusic = document.querySelectorAll(".letter-title, .evolution-title, .album-title, .venue-title, .karaoke-title, .rsvp-title, .thanks-title, .closing-title, .button, .rsvp-option, .rsvp-input, .thanks-edit, .closing-back");
  let musicBand = null;
  let musicBandTimer = 0;
  const watchMusicBand = () => {
    if (musicBand) musicBand.disconnect();
    if (!phoneLayout.matches || !("IntersectionObserver" in window)) { musicButton.classList.remove("is-tucked"); return; }
    const under = new Set();
    musicBand = new IntersectionObserver(entries => {
      // Borde izquierdo sin el desplazamiento de «is-tucked»: offsetLeft no incluye transformaciones.
      const left = (musicButton.hidden ? window.innerWidth - 58 : musicButton.offsetLeft) - 8;
      entries.forEach(item => {
        if (item.isIntersecting && item.boundingClientRect.right > left) under.add(item.target);
        else under.delete(item.target);
      });
      musicButton.classList.toggle("is-tucked", under.size > 0);
    }, { rootMargin:`0px 0px ${-(window.innerHeight - 66)}px 0px` });
    underMusic.forEach(element => musicBand.observe(element));
  };
  watchMusicBand();
  window.addEventListener("resize", () => {
    window.clearTimeout(musicBandTimer);
    musicBandTimer = window.setTimeout(watchMusicBand, 150);
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
    let phone = String(rsvp.whatsapp || "").replace(/\D/g, "");
    // Un número de México sin lada (10 dígitos) se completa como indica config.js: 52 + 1 + 10 dígitos.
    if (phone.length === 10) phone = `521${phone}`;
    const hasWhatsapp = phone.length >= 11;
    if (rsvp.whatsapp && !hasWhatsapp) console.warn("rsvp.whatsapp no parece un número completo con lada de país.");
    setText("rsvp-submit-text", hasWhatsapp ? rsvp.button : (rsvp.buttonWithoutWhatsapp || rsvp.button));

    const showError = (field, error, message) => {
      error.textContent = message;
      field.setAttribute("aria-invalid", message ? "true" : "false");
    };
    const fill = (template, name) => String(template || "")
      .replaceAll("{nombre}", name)
      .replaceAll("{fecha}", eventDate)
      .replaceAll("{hora}", eventTime)
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

    // «Sí» abre el nombre y el mensaje opcional; «No» solo muestra el botón para enviar.
    answers.forEach(input => input.addEventListener("change", () => {
      showError(choicesField, answerError, "");
      if (input.value === "no") showError(nameInput, nameError, "");
      details.inert = false;
      details.classList.add("is-open");
      rsvpForm.dataset.answer = input.value;
    }));
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim()) showError(nameInput, nameError, "");
    });

    rsvpForm.addEventListener("submit", event => {
      event.preventDefault();
      // Mientras el formulario se despide, un segundo toque no vuelve a enviar.
      if (rsvpForm.classList.contains("is-leaving")) return;
      const answer = answers.find(input => input.checked);
      showError(choicesField, answerError, answer ? "" : (rsvp.answerError || "Elige una respuesta."));
      if (!answer) { answers[0].focus(); return; }
      const yes = answer.value === "si";
      // Con «No» no se pide nombre ni mensaje.
      const name = yes ? nameInput.value.trim().replace(/\s+/g, " ") : "";
      if (yes) {
        showError(nameInput, nameError, name ? "" : (rsvp.nameError || "Escribe tu nombre."));
        if (!name) { nameInput.focus(); return; }
      }
      if (hasWhatsapp) {
        let message = fill(yes ? rsvp.yesMessage : rsvp.noMessage, name);
        const note = yes ? messageInput.value.trim() : "";
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
        if (box.top < 0 || box.top > window.innerHeight * .6) thanks.scrollIntoView({ behavior:reducedMotion.matches ? "auto" : "smooth", block:"center" });
      }, reducedMotion.matches ? 0 : 450);
    });

    document.getElementById("rsvp-edit").addEventListener("click", () => {
      thanks.hidden = true;
      thanks.classList.remove("is-in");
      rsvpForm.hidden = false;
      const answer = answers.find(input => input.checked);
      if (answer && answer.value === "si") nameInput.focus();
      else (answer || answers[0]).focus();
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
        // Días después ya no dice «hoy»: la línea se retira 12 horas después del inicio.
        if (left < -12 * 3600 * 1000) { countdown.hidden = true; return; }
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
      if (reducedMotion.matches) return;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      skyArt.style.setProperty("--pan", progress.toFixed(4));
    };
    const requestSky = () => { if (!skyFrame) skyFrame = window.requestAnimationFrame(moveSky); };
    window.addEventListener("scroll", requestSky, { passive:true });
    window.addEventListener("resize", requestSky);
    moveSky();
  }

  // Aparición suave de las secciones al entrar en pantalla.
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(item => {
        if (!item.isIntersecting) return;
        item.target.classList.add("is-in");
        observer.unobserve(item.target);
      });
    }, { threshold:0, rootMargin:"0px 0px -60px 0px" });
    revealItems.forEach(item => observer.observe(item));
    // Los adornos en bucle (sello, ondas del micrófono…) se detienen lejos de la pantalla.
    const loops = new IntersectionObserver(entries => {
      entries.forEach(item => item.target.classList.toggle("is-offscreen", !item.isIntersecting));
    }, { rootMargin:"120px 0px" });
    document.querySelectorAll(".cover, #evolucion, #album, #grupales, .karaoke-panel, #rsvp-thanks").forEach(element => loops.observe(element));
  } else {
    revealItems.forEach(item => item.classList.add("is-in"));
  }

  // Karaoke: textos de config.js. El micrófono es solo una ilustración.
  const karaoke = config.karaoke || {};
  setText("karaoke-eyebrow", karaoke.eyebrow);
  if (karaoke.title) buildTitle(document.getElementById("karaoke-title"), karaoke.title, karaoke.highlight, "karaoke-highlight");
  setText("karaoke-description", karaoke.description);
  const karaokeCue = document.getElementById("karaoke-cue");
  if (karaoke.cue !== undefined) karaokeCue.textContent = karaoke.cue;
  karaokeCue.hidden = !karaokeCue.textContent.trim();

  // Cada versión de mí: un montón de polaroids; la de arriba pasa detrás al deslizar.
  const evolution = config.evolution || {};
  const evolutionSection = document.getElementById("evolucion");
  const stages = (Array.isArray(evolution.photos) ? evolution.photos : []).filter(photo => photo && typeof photo === "object" && photo.src);
  if (!stages.length) {
    evolutionSection.hidden = true;
  } else {
    if (evolution.title) buildTitle(document.getElementById("evolution-title"), evolution.title, evolution.highlight, "evolution-highlight");
    const evolutionIntro = document.getElementById("evolution-intro");
    if (evolution.intro !== undefined) evolutionIntro.textContent = evolution.intro;
    evolutionIntro.hidden = !evolutionIntro.textContent.trim();
    const track = document.getElementById("evolution-track");
    const controls = document.getElementById("evolution-controls");
    const previousStage = document.getElementById("evolution-prev");
    const nextStage = document.getElementById("evolution-next");
    const items = stages.map((photo, index) => {
      const item = document.createElement("li");
      item.className = "evolution-card";
      const figure = document.createElement("figure");
      figure.className = "evolution-figure";
      const frame = document.createElement("div");
      frame.className = "evolution-photo";
      const placeholder = document.createElement("div");
      placeholder.className = "evolution-ph";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", `Espacio reservado para la fotografía ${index + 1}`);
      placeholder.innerHTML = '<span class="evolution-ph-word"></span><span class="evolution-ph-note">Tu fotografía aquí</span>';
      placeholder.querySelector(".evolution-ph-word").textContent = `Etapa ${index + 1}`;
      // Sin filtros: la foto se muestra tal cual, solo se elige el encuadre.
      const image = document.createElement("img");
      image.alt = photo.alt || `${hostName}, fotografía ${index + 1} de ${stages.length} del recorrido`;
      image.decoding = "async";
      image.draggable = false;
      image.style.objectPosition = photo.position || "50% 30%";
      image.addEventListener("load", () => item.classList.add("has-photo"));
      image.addEventListener("error", () => item.classList.remove("has-photo"));
      image.loading = "lazy";
      image.src = photo.src;
      frame.append(placeholder, image);
      figure.append(frame);
      const stageText = String(photo.stage || "").trim();
      const phraseText = String(photo.phrase || "").trim();
      if (stageText || phraseText) {
        const caption = document.createElement("figcaption");
        caption.className = "evolution-caption";
        if (stageText) {
          const stage = document.createElement("span");
          stage.className = "evolution-stage";
          stage.textContent = stageText;
          caption.append(stage);
        }
        if (phraseText) {
          const phrase = document.createElement("span");
          phrase.className = "evolution-phrase";
          phrase.textContent = phraseText;
          caption.append(phrase);
        }
        figure.append(caption);
      }
      item.append(figure);
      return item;
    });
    track.replaceChildren(...items);
    // Las fotos esperan mientras se ve la entrada; cuando la sección se acerca se piden todas, también las que están fuera del carrusel.
    if ("IntersectionObserver" in window) {
      const warm = new IntersectionObserver(([item]) => {
        if (!item.isIntersecting) return;
        track.querySelectorAll("img").forEach(img => { img.loading = "eager"; });
        warm.disconnect();
      }, { rootMargin:"150% 0px" });
      warm.observe(evolutionSection);
    }

    let activeStage = 0;
    let movingStage = false;
    const count = document.getElementById("evolution-count");
    function showStack() {
      items.forEach((item, index) => {
        const depth = (index - activeStage + items.length) % items.length;
        item.style.setProperty("--depth", String(Math.min(depth, 4)));
        item.style.setProperty("--tilt", depth === 0 ? "-2deg" : `${depth % 2 ? 3 : -3}deg`);
        item.style.zIndex = String(items.length - depth);
        item.classList.toggle("is-active", depth === 0);
        item.setAttribute("aria-hidden", String(depth !== 0));
      });
      count.textContent = `${String(activeStage + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      count.setAttribute("aria-label", `Etapa ${activeStage + 1} de ${items.length}`);
    }
    function moveStack(direction) {
      if (movingStage || items.length < 2) return;
      movingStage = true;
      const outgoing = items[activeStage];
      outgoing.style.setProperty("--swipe-exit", direction > 0 ? "-100vw" : "100vw");
      outgoing.style.setProperty("--swipe-rotate", direction > 0 ? "-16deg" : "16deg");
      outgoing.style.zIndex = String(items.length + 1);
      outgoing.classList.add("is-departing");
      const finish = () => {
        activeStage = (activeStage + direction + items.length) % items.length;
        outgoing.classList.add("is-resetting");
        outgoing.classList.remove("is-departing");
        showStack();
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          outgoing.classList.remove("is-resetting");
          movingStage = false;
        }));
      };
      if (reducedMotion.matches) finish();
      else window.setTimeout(finish, 380);
    }
    controls.hidden = items.length < 2;
    if (items.length > 1) track.tabIndex = 0;
    showStack();
    // Las flechas se quitaron: se cambia de foto deslizando o con las teclas izquierda y derecha.
    if (previousStage) previousStage.addEventListener("click", () => moveStack(-1));
    if (nextStage) nextStage.addEventListener("click", () => moveStack(1));
    track.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      moveStack(event.key === "ArrowLeft" ? -1 : 1);
    });
    let pointerStart = null;
    track.addEventListener("pointerdown", event => {
      if (movingStage || items.length < 2 || (event.pointerType === "mouse" && event.button !== 0)) return;
      pointerStart = { id:event.pointerId, x:event.clientX, y:event.clientY };
      items[activeStage].classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    });
    track.addEventListener("pointermove", event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      const drag = Math.abs(dx) > Math.abs(dy) * 1.1 ? dx : 0;
      items[activeStage].style.setProperty("--drag-x", `${drag}px`);
      items[activeStage].style.setProperty("--drag-rotate", `${Math.max(-12, Math.min(12, drag / 18))}deg`);
    });
    track.addEventListener("pointerup", event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      items[activeStage].classList.remove("is-dragging");
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) moveStack(dx < 0 ? 1 : -1);
    });
    track.addEventListener("pointercancel", () => {
      pointerStart = null;
      items[activeStage].classList.remove("is-dragging");
    });
  }

  // Cintas de película: «Mis recuerdos» avanza hacia la izquierda y «Caminos compartidos» hacia la derecha.
  // Avanzan solas; se detienen con suavidad mientras el dedo o el mouse está encima, se arrastran a mano
  // y, al soltarlas, conservan el impulso del gesto y regresan enseguida a su ritmo.
  const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)");
  function buildFilmRoll(roll, photos, options) {
    const track = roll.querySelector(".film-track");
    const makeFrame = (photo, index, copy) => {
      const item = document.createElement("li");
      item.className = "film-frame";
      if (copy) {
        // Las copias solo sirven para que la cinta no tenga fin; los lectores de pantalla leen una sola vez.
        item.setAttribute("aria-hidden", "true");
        item.inert = true;
      }
      const cell = document.createElement("div");
      cell.className = "film-cell";
      const edge = document.createElement("span");
      edge.className = "film-edge";
      edge.setAttribute("aria-hidden", "true");
      edge.textContent = "La alegría de coincidir";
      const frame = document.createElement("figure");
      frame.className = "film-window";
      const image = document.createElement("img");
      image.alt = copy ? "" : (photo.alt || `${options.label} ${index + 1}`);
      image.decoding = "async";
      image.loading = "lazy";
      image.draggable = false;
      image.addEventListener("load", () => item.classList.add("has-photo"));
      image.addEventListener("error", () => { item.hidden = true; });
      if (photo.src) image.src = photo.src;
      frame.append(image);
      // El nombre o el párrafo de cada foto va impreso en la cinta, debajo del cuadro.
      const caption = document.createElement("p");
      caption.className = `film-caption ${options.captionClass}`;
      const words = document.createElement("span");
      words.textContent = String(photo.caption || "").trim();
      caption.append(words);
      cell.append(edge, frame, caption);
      item.append(cell);
      return item;
    };
    // La tira oscura con perforaciones es una sola pieza continua detrás de todas las fotos.
    const band = document.createElement("li");
    band.className = "film-band";
    band.setAttribute("aria-hidden", "true");
    // Tres juegos seguidos: se avanza por el del centro y al llegar a un extremo se salta al juego equivalente.
    track.replaceChildren(band, ...[0, 1, 2].flatMap(copy => photos.map((photo, index) => makeFrame(photo, index, copy !== 1))));
    const frames = [...track.querySelectorAll(".film-frame")];
    const count = photos.length;
    let setWidth = 0;
    let position = 0; // cuánto se ha recorrido la cinta, en píxeles
    let velocity = 0; // píxeles por segundo; positivo avanza hacia la izquierda
    let dragging = null;
    let holding = false;
    let hovering = false;
    let focused = false;
    let visible = !("IntersectionObserver" in window);
    let keyTarget = null;
    let previous = 0;
    const cruise = () => (window.innerWidth < 850 ? 26 : 34) * options.direction;
    const wrap = () => {
      if (!setWidth) return;
      while (position < setWidth * .5) position += setWidth;
      while (position > setWidth * 1.5) position -= setWidth;
    };
    const render = () => { track.style.transform = `translate3d(${(-position).toFixed(2)}px,0,0)`; };
    const captions = [...track.querySelectorAll(".film-caption span")];
    let captionHeight = 0;
    const measure = () => {
      // La franja de texto mide lo que el pie más largo, para que ningún texto se corte.
      const tallest = Math.ceil(Math.max(0, ...captions.map(text => text.offsetHeight)));
      if (tallest && tallest !== captionHeight) {
        captionHeight = tallest;
        roll.style.setProperty("--cap-h", `${tallest}px`);
      }
      const width = frames[count].offsetLeft - frames[0].offsetLeft;
      if (!width) return;
      // Conserva el punto de la cinta cuando cambia el ancho (fotos que terminan de cargar, giro de pantalla).
      position = setWidth ? width + (position - setWidth) * (width / setWidth) : width;
      setWidth = width;
      wrap();
      render();
    };
    const step = now => {
      const dt = previous ? Math.min(now - previous, 50) / 1000 : 0;
      previous = now;
      if (setWidth && !dragging && visible && !document.hidden) {
        if (keyTarget !== null) {
          // Flechas del teclado: se desliza hasta la siguiente foto con una curva suave.
          const gap = keyTarget - position;
          position += gap * (1 - Math.exp(-dt / .12));
          velocity = 0;
          if (Math.abs(gap) < .5) { position = keyTarget; keyTarget = null; }
        } else {
          const stopped = holding || hovering || focused || reducedMotion.matches;
          const target = stopped ? 0 : cruise();
          // El impulso del gesto se disipa poco a poco hasta volver al ritmo de crucero (o detenerse si está en pausa).
          const ease = Math.abs(velocity) > Math.abs(cruise()) * 1.5 ? .55 : .35;
          velocity += (target - velocity) * (1 - Math.exp(-dt / ease));
          position += velocity * dt;
        }
        wrap();
        render();
      }
      window.requestAnimationFrame(step);
    };
    // Arrastre con el dedo o el mouse. touch-action: pan-y deja libre el desplazamiento vertical de la página.
    let samples = [];
    roll.addEventListener("pointerdown", event => {
      if (event.button > 0) return;
      holding = true;
      keyTarget = null;
      dragging = { id:event.pointerId, x:event.clientX, start:position, moved:false };
      samples = [{ t:event.timeStamp, dx:0 }];
      velocity = 0;
    });
    roll.addEventListener("pointermove", event => {
      if (!dragging || event.pointerId !== dragging.id) return;
      const dx = event.clientX - dragging.x;
      if (!dragging.moved && Math.abs(dx) > 3) {
        dragging.moved = true;
        roll.classList.add("is-dragging");
        // Con mouse se captura el puntero para seguir el arrastre aunque salga de la cinta (el dedo ya queda capturado).
        if (event.pointerType === "mouse") try { roll.setPointerCapture(event.pointerId); } catch { /* el puntero ya se soltó */ }
      }
      if (!dragging.moved) return;
      position = dragging.start - dx;
      wrap();
      if (position - dragging.start + dx !== 0) { dragging.start = position + dx; }
      render();
      samples.push({ t:event.timeStamp, dx });
      while (samples.length > 2 && event.timeStamp - samples[0].t > 90) samples.shift();
    });
    const release = event => {
      if (!dragging || (event && event.pointerId !== dragging.id)) return;
      if (dragging.moved && samples.length > 1) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        const span = (last.t - first.t) / 1000;
        // Velocidad del gesto en los últimos instantes: la cinta sigue con ese impulso.
        if (span > 0) velocity = Math.max(-2600, Math.min(2600, -(last.dx - first.dx) / span));
      }
      dragging = null;
      holding = false; // Al soltar, la cinta sigue de inmediato.
      roll.classList.remove("is-dragging");
    };
    roll.addEventListener("pointerup", release);
    roll.addEventListener("pointercancel", release);
    roll.addEventListener("pointerleave", event => { if (event.pointerType !== "mouse" && !dragging) holding = false; });
    roll.addEventListener("mouseenter", () => { if (finePointer.matches) hovering = true; });
    roll.addEventListener("mouseleave", () => { hovering = false; });
    // Solo el foco con teclado detiene la cinta; un clic con el mouse no la deja quieta.
    roll.addEventListener("focusin", () => { focused = roll.matches(":focus-visible"); });
    roll.addEventListener("focusout", () => { focused = false; });
    roll.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      focused = true;
      const frameWidth = setWidth / count || 240;
      keyTarget = (keyTarget ?? position) + (event.key === "ArrowLeft" ? -frameWidth : frameWidth);
    });
    if (!visible) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        // Las fotos se piden cuando la cinta se acerca a la pantalla.
        if (visible) track.querySelectorAll("img").forEach(img => { img.loading = "eager"; });
      }, { rootMargin:"60% 0px" }).observe(roll);
    }
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(track);
    window.addEventListener("resize", measure);
    velocity = reducedMotion.matches ? 0 : cruise();
    measure();
    window.requestAnimationFrame(step);
  }
  // Con movimiento reducido las cintas no avanzan solas: la instrucción solo invita a deslizar.
  const filmHintText = () => reducedMotion.matches
    ? (finePointer.matches ? "Arrastra para ver más fotos" : "Desliza para ver más fotos")
    : (finePointer.matches ? "Pasa el mouse para pausar o arrastra para ver más" : "Toca para pausar o desliza para ver más");
  document.querySelectorAll(".film-hint span").forEach(hint => { hint.textContent = filmHintText(); });

  // Álbum: rollo de película con las fotos en el orden de config.js.
  const album = config.album || {};
  const albumSection = document.getElementById("album");
  const albumPhotos = (Array.isArray(album.photos) ? album.photos : []).filter(photo => photo && typeof photo === "object" && photo.src);
  if (!albumPhotos.length) {
    albumSection.hidden = true;
  } else {
    if (album.title) buildTitle(document.getElementById("album-title"), album.title, album.highlight, "album-highlight");
    buildFilmRoll(document.getElementById("album-film"), albumPhotos, { direction:1, captionClass:"film-caption-hand", label:"Recuerdo" });
  }
  // Fotos grupales: segundo rollo, avanza en sentido contrario.
  const groupGallery = config.groupGallery || {};
  const groupSection = document.getElementById("grupales");
  const groupPhotos = (Array.isArray(groupGallery.photos) ? groupGallery.photos : []).filter(photo => photo && photo.src);
  if (!groupPhotos.length) {
    groupSection.hidden = true;
  } else {
    if (groupGallery.title) document.getElementById("group-title").textContent = groupGallery.title;
    buildFilmRoll(document.getElementById("group-film"), groupPhotos, { direction:-1, captionClass:"film-caption-text", label:"Fotografía grupal" });
  }
  // Cierre: título, mensaje, firma y pie vienen de config.js.
  const closing = config.closing || {};
  const closingTitle = document.getElementById("closing-title");
  // Cada palabra entra por separado; la palabra resaltada va en cursiva con el trazo amarillo.
  buildTitle(closingTitle, closing.title || closingTitle.textContent, closing.highlight, "closing-highlight", closingTitle.querySelector(".closing-swash"));
  const closingMessage = [].concat(closing.message || []).filter(Boolean);
  if (closingMessage.length) {
    document.getElementById("closing-message").replaceChildren(...closingMessage.map(text => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    }));
  }
  if (closing.farewell !== undefined) document.getElementById("closing-farewell").textContent = closing.farewell;
  document.getElementById("closing-name").textContent = closing.signature || hostName;
  setText("closing-back-label", closing.backLabel);
  const footerThanks = document.getElementById("footer-thanks-text");
  if (closing.footerThanks !== undefined) footerThanks.textContent = closing.footerThanks;
  footerThanks.parentElement.hidden = !footerThanks.textContent.trim();

  // «Volver al inicio» solo sube a la portada: la entrada sigue oculta y la música no se toca.
  document.getElementById("closing-back").addEventListener("click", event => {
    event.preventDefault();
    window.scrollTo({ top:0, behavior:reducedMotion.matches ? "auto" : "smooth" });
    document.getElementById("cover-phrase").focus({ preventScroll:true });
  });

  document.getElementById("next-section").addEventListener("click", () => {
    const next = document.getElementById(config.nextSection || "carta");
    if (next) {
      next.scrollIntoView({ behavior:reducedMotion.matches ? "auto" : "smooth", block:"start" });
      next.focus({ preventScroll:true });
    } else {
      document.getElementById("next-message").textContent = "Pronto, más detalles para compartir este día.";
    }
    // Punto de integración para las secciones que agregaremos después.
    document.dispatchEvent(new CustomEvent("invitation:continue"));
  });
})();
