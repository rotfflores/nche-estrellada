(() => {
  "use strict";
  // Si config.js tiene un error (una coma o comilla de más), la invitación abre igual con los textos de index.html.
  const config = window.INVITATION_CONFIG || {};
  const english = config.locale === "en";
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
  photo.alt = english ? `Photograph of ${hostName}` : `Fotografía de ${hostName}`;
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

  // Frase principal y carta: textos de config.js.
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

  // Frase principal en letras muy grandes: cada palabra entra por separado y las resaltadas van en cursiva.
  const quote = document.getElementById("letter-quote");
  const quoteText = String(letter.quote || quote.textContent).trim();
  const quoteWords = quoteText.split(/\s+/);
  const cleanWord = word => word.replace(/[^\p{L}\p{N}]/gu, "").toLocaleLowerCase("es");
  const highlightWords = String(letter.quoteHighlight || "").trim().split(/\s+/).filter(Boolean).map(cleanWord);
  let highlightAt = -1;
  if (highlightWords.length) {
    for (let index = 0; index + highlightWords.length <= quoteWords.length; index += 1) {
      if (highlightWords.every((word, offset) => cleanWord(quoteWords[index + offset]) === word)) { highlightAt = index; break; }
    }
  }
  quote.replaceChildren(...quoteWords.flatMap((word, index) => {
    const marked = highlightAt >= 0 && index >= highlightAt && index < highlightAt + highlightWords.length;
    const part = document.createElement(marked ? "em" : "span");
    part.className = marked ? "cw letter-quote-highlight" : "cw";
    part.style.setProperty("--i", index);
    part.textContent = word;
    return index ? [" ", part] : [part];
  }));

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
  setText("venue-flavors", venue.flavors);
  // Variedad de comida (veganas, tlayudas...) en dorado, a petición de la clienta.
  {
    const flavors = document.getElementById("venue-flavors");
    const strong = String(venue.flavorsStrong || "");
    const at = flavors && strong ? String(venue.flavors || "").indexOf(strong) : -1;
    if (at >= 0) {
      const bold = document.createElement("strong");
      bold.textContent = strong;
      flavors.replaceChildren(venue.flavors.slice(0, at), bold, venue.flavors.slice(at + strong.length));
    }
  }
  setText("venue-time-label", venue.timeLabel);
  setText("venue-thanks", venue.thanks);
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
  if (venue.title) buildTitle(document.getElementById("venue-title"), venue.title, venue.highlight, "venue-title-highlight");
  // El nombre del lugar va en negritas al inicio de la descripción.
  textWithName("venue-description", venue.description, "strong");
  textWithName("venue-food-caption", venue.foodCaption, "span");
  // Lo especial del lugar: cada línea con su ícono dibujado.
  if (Array.isArray(venue.highlights)) {
    const list = document.getElementById("venue-highlights");
    const icons = {};
    list.querySelectorAll("[data-icon]").forEach(item => { icons[item.dataset.icon] = item.querySelector("svg"); });
    const items = venue.highlights.filter(item => item && item.text).map(data => {
      const item = document.createElement("li");
      item.className = "venue-highlight";
      const icon = icons[data.icon] || icons.corazon;
      if (icon) item.append(icon.cloneNode(true));
      const text = document.createElement("span");
      const strong = String(data.strong || "");
      const at = strong ? data.text.indexOf(strong) : -1;
      if (at >= 0) {
        const bold = document.createElement("strong");
        bold.textContent = strong;
        text.append(data.text.slice(0, at), bold, data.text.slice(at + strong.length));
      } else {
        text.textContent = data.text;
      }
      item.append(text);
      return item;
    });
    list.replaceChildren(...items);
    list.hidden = !items.length;
  }
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

  // El control silencia la canción sin detenerla: al volver a activar el sonido sigue justo donde va.
  function updateMusic() {
    const playing = !audio.paused && !audio.ended;
    const muted = playing && audio.muted;
    musicButton.classList.toggle("is-playing", playing && !muted);
    musicButton.classList.toggle("is-muted", muted);
    musicButton.setAttribute("aria-label", !playing ? (english ? "Play music" : "Reproducir música") : muted ? (english ? "Turn music sound on" : "Activar el sonido de la música") : (english ? "Mute music" : "Silenciar la música"));
    musicLabel.textContent = !playing ? (english ? "Play" : "Reproducir") : muted ? (english ? "Turn sound on" : "Activar sonido") : (english ? "Mute" : "Silenciar");
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
    // El control sigue visible: al tocarlo se vuelve a intentar cargar la canción.
    updateMusic();
    musicStatus.textContent = english ? "The music could not be loaded. Tap the music control to try again." : "La música no se pudo cargar. Toca el control de música para intentarlo de nuevo.";
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
        musicLabel.textContent = english ? "Play" : "Reproducir";
        musicButton.setAttribute("aria-label", english ? "Play music" : "Reproducir música");
        musicStatus.textContent = english ? "Tap the music control to start playback." : "Toca el control de música para iniciar la reproducción.";
      } else {
        failAudio();
      }
    }
  }
  audio.addEventListener("loadedmetadata", applyStart);
  audio.addEventListener("canplay", applyStart);
  audio.addEventListener("error", failAudio);
  ["play", "pause", "ended", "volumechange"].forEach(event => audio.addEventListener(event, updateMusic));

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
  function unlockAudio(event) {
    // Un toque sobre el propio control de música lo resuelve su clic (así no arranca y se silencia en el mismo toque).
    if (event && event.target instanceof Node && musicButton.contains(event.target)) return;
    // Si el navegador indica que este evento aún no es un gesto válido (el dedo apenas toca, Escape), se espera el siguiente.
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    unlockEvents.forEach(type => document.removeEventListener(type, unlockAudio, true));
    if (audio.paused) playMusic();
  }
  if (config.audio) {
    loadAudio();
    // El control se ve siempre desde el inicio (en celular algunos navegadores tardan o fallan al confirmar que la música suena).
    musicButton.hidden = false;
    updateMusic();
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
    // play() se llama dentro del gesto del usuario, sin esperar la transición. Si el invitado la silenció en la entrada, sigue en silencio.
    unlockEvents.forEach(type => document.removeEventListener(type, unlockAudio, true));
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
          document.getElementById("cover-title").focus({ preventScroll:true });
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
    if (audioFailed) {
      audioFailed = false;
      seekApplied = false;
      audio.removeAttribute("src");
      audio.load();
    }
    if (audio.paused || audio.ended) { audio.muted = false; playMusic(); }
    else audio.muted = !audio.muted;
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
    const submitError = document.getElementById("rsvp-submit-error");
    const submitButton = document.getElementById("rsvp-submit");
    const submitText = document.getElementById("rsvp-submit-text");
    let savingRsvp = false;
    const submitLabel = rsvp.button || "Enviar respuesta";
    submitText.textContent = submitLabel;

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

    rsvpForm.addEventListener("submit", async event => {
      event.preventDefault();
      // Mientras el formulario se despide, un segundo toque no vuelve a enviar.
      if (savingRsvp || rsvpForm.classList.contains("is-leaving")) return;
      submitError.textContent = "";
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
      savingRsvp = true;
      submitButton.disabled = true;
      submitText.textContent = english ? "Saving your reply…" : "Guardando respuesta…";
      try {
        let id;
        try {
          id = window.localStorage.getItem("victoria-rsvp-id");
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || "")) {
            id = window.crypto.randomUUID();
            window.localStorage.setItem("victoria-rsvp-id", id);
          }
        } catch { id = window.crypto.randomUUID(); }
        const response = await fetch("/api/rsvp", {
          method:"POST", credentials:"same-origin", cache:"no-store",
          headers:{ "Content-Type":"application/json" },
          body:JSON.stringify({ id, answer:answer.value, name, message:yes ? messageInput.value.trim() : "" }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.saved) throw new Error(english ? "We couldn't save your reply. Please try again." : (result.error || "No se pudo guardar. Intenta de nuevo."));
      } catch (error) {
        submitError.textContent = english ? "We couldn't save your reply. Please try again." : (error.message || "No se pudo guardar. Intenta de nuevo.");
        submitError.scrollIntoView({ behavior:reducedMotion.matches ? "auto" : "smooth", block:"nearest" });
        return;
      } finally {
        savingRsvp = false;
        submitButton.disabled = false;
        submitText.textContent = submitLabel;
      }
      // Agradecimiento con animación (inmediato si se pidió reducir movimiento).
      wordsInto(thanksTitle, fill(yes ? rsvp.thanksYesTitle : rsvp.thanksNoTitle, name));
      document.getElementById("rsvp-thanks-text").textContent = fill(yes ? rsvp.thanksYesText : rsvp.thanksNoText, name);
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
    const labels = english
      ? { days:["Day","Days"], hours:["Hour","Hours"], minutes:["Minute","Minutes"], seconds:["Second","Seconds"] }
      : { days:["Día","Días"], hours:["Hora","Horas"], minutes:["Minuto","Minutos"], seconds:["Segundo","Segundos"] };
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
        document.getElementById("countdown-title").textContent = config.countdownDone || (english ? "Today's the day!" : "¡Hoy celebramos!");
        countdownText.textContent = "";
        return;
      }
      const total = Math.floor(left / 1000);
      const parts = { days:Math.floor(total / 86400), hours:Math.floor(total / 3600) % 24, minutes:Math.floor(total / 60) % 60, seconds:total % 60 };
      // Sin animación mientras la invitación está oculta o si se pidió reducir movimiento.
      const animate = !reducedMotion.matches && !invitation.hidden && !document.hidden;
      Object.entries(parts).forEach(([unit, value]) => showNumber(unit, value, animate));
      const spoken = english
        ? `${parts.days} ${labels.days[parts.days === 1 ? 0 : 1].toLowerCase()}, ${parts.hours} ${labels.hours[parts.hours === 1 ? 0 : 1].toLowerCase()} and ${parts.minutes} ${labels.minutes[parts.minutes === 1 ? 0 : 1].toLowerCase()} until the celebration.`
        : `Faltan ${parts.days} ${labels.days[parts.days === 1 ? 0 : 1].toLowerCase()}, ${parts.hours} ${labels.hours[parts.hours === 1 ? 0 : 1].toLowerCase()} y ${parts.minutes} ${labels.minutes[parts.minutes === 1 ? 0 : 1].toLowerCase()} para la celebración.`;
      if (spoken !== lastSpoken) countdownText.textContent = lastSpoken = spoken;
      window.setTimeout(tick, 1000 - (Date.now() % 1000) + 15);
    }
    tick();
  }

  // El cielo pintado acompaña el desplazamiento: arriba la luna, abajo el río dorado.
  const skyArt = document.getElementById("sky-art");
  if (skyArt && !window.matchMedia("(pointer:coarse), (max-width:849px)").matches) {
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
  // Fotos de cada etapa y tarjetas independientes (entradas con note y sin src).
  const stages = (Array.isArray(evolution.photos) ? evolution.photos : []).filter(photo => photo && typeof photo === "object" && (photo.src || String(photo.note || "").trim()));
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
      if (!photo.src) {
        // Tarjeta independiente: el recorrido entre etapas, escrito a mano sobre papel.
        item.classList.add("evolution-note");
        item.dataset.label = String(photo.note).trim();
        const card = document.createElement("div");
        card.className = "evolution-note-card";
        card.innerHTML = '<svg class="evolution-note-art" viewBox="0 0 120 40" aria-hidden="true"><path class="note-path" pathLength="1" d="M4 30C22 30 26 10 44 10S66 30 84 26S106 8 116 10"/><circle cx="4" cy="30" r="3"/><circle cx="44" cy="10" r="2.4"/><circle cx="84" cy="26" r="2.4"/><path class="note-heart" d="M116 17.5C113.7 15.6 108.6 12.8 108.9 9.2C109.1 5.9 113.5 5.6 116 8.8C118.5 5.6 122.9 5.9 123.1 9.2C123.4 12.8 118.3 15.6 116 17.5Z" transform="translate(-4 -4)"/></svg><p class="evolution-note-text"></p>';
        const text = card.querySelector(".evolution-note-text");
        // El año final se destaca.
        const note = item.dataset.label;
        const year = note.match(/(\d{4})\s*$/);
        if (year) {
          const strong = document.createElement("strong");
          strong.textContent = year[1];
          text.append(note.slice(0, year.index), strong);
        } else {
          text.textContent = note;
        }
        item.append(card);
        return item;
      }
      const figure = document.createElement("figure");
      figure.className = "evolution-figure";
      const frame = document.createElement("div");
      frame.className = "evolution-photo";
      const placeholder = document.createElement("div");
      placeholder.className = "evolution-ph";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", english ? `Space reserved for photograph ${index + 1}` : `Espacio reservado para la fotografía ${index + 1}`);
      placeholder.innerHTML = `<span class="evolution-ph-word"></span><span class="evolution-ph-note">${english ? "Your photo here" : "Tu fotografía aquí"}</span>`;
      placeholder.querySelector(".evolution-ph-word").textContent = photo.stage || (english ? `Stage ${index + 1}` : `Etapa ${index + 1}`);
      // Sin filtros: la foto se muestra tal cual, solo se elige el encuadre.
      const image = document.createElement("img");
      image.alt = photo.alt || (english ? `${hostName}, photograph ${index + 1} of ${stages.length}` : `${hostName}, fotografía ${index + 1} de ${stages.length} del recorrido`);
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
      const titleText = String(photo.title || "").trim();
      const phraseText = String(photo.phrase || "").trim();
      item.dataset.label = [stageText, titleText].filter(Boolean).join(": ") || (english ? `Photograph ${index + 1}` : `Fotografía ${index + 1}`);
      if (stageText || titleText || phraseText) {
        const caption = document.createElement("figcaption");
        caption.className = "evolution-caption";
        if (stageText) {
          const stage = document.createElement("span");
          stage.className = "evolution-stage";
          stage.textContent = stageText;
          caption.append(stage);
        }
        if (titleText) {
          const title = document.createElement("span");
          title.className = "evolution-name";
          title.textContent = titleText;
          caption.append(title);
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
      count.textContent = english ? `${items[activeStage].dataset.label} (${activeStage + 1} of ${items.length})` : `${items[activeStage].dataset.label} (${activeStage + 1} de ${items.length})`;
    }
    // direction: 1 avanza a la siguiente etapa, -1 regresa. side: hacia dónde sale volando la foto (el lado del gesto).
    function moveStack(direction, side = direction) {
      if (movingStage || items.length < 2) return;
      movingStage = true;
      const outgoing = items[activeStage];
      // Conserva el punto exacto donde se soltó la foto para que no salte al centro.
      const heldTransform = window.getComputedStyle(outgoing).transform;
      outgoing.classList.remove("is-dragging");
      outgoing.style.transform = heldTransform;
      activeStage = (activeStage + direction + items.length) % items.length;
      showStack(); // La siguiente foto avanza mientras la anterior sale.
      outgoing.style.setProperty("--swipe-exit", side > 0 ? "-100vw" : "100vw");
      outgoing.style.setProperty("--swipe-rotate", side > 0 ? "-16deg" : "16deg");
      outgoing.style.zIndex = String(items.length + 1);
      // Fija el estado inicial antes de activar la transición de salida.
      outgoing.getBoundingClientRect();
      outgoing.classList.add("is-departing");
      outgoing.style.removeProperty("transform");
      let finished = false;
      let fallback;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(fallback);
        outgoing.removeEventListener("transitionend", onTransitionEnd);
        outgoing.classList.add("is-resetting");
        outgoing.classList.remove("is-departing");
        showStack();
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          outgoing.classList.remove("is-resetting");
          movingStage = false;
        }));
      };
      const onTransitionEnd = event => {
        if (event.target === outgoing && event.propertyName === "transform") finish();
      };
      if (reducedMotion.matches) finish();
      else {
        outgoing.addEventListener("transitionend", onTransitionEnd);
        fallback = window.setTimeout(finish, 650);
      }
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
      if (movingStage || pointerStart || items.length < 2 || (event.pointerType === "mouse" && event.button !== 0)) return;
      pointerStart = { id:event.pointerId, x:event.clientX, y:event.clientY, time:performance.now(), dragging:false };
      items[activeStage].style.setProperty("--drag-x", "0px");
      items[activeStage].style.setProperty("--drag-rotate", "0deg");
    });
    track.addEventListener("pointermove", event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      if (!pointerStart.dragging) {
        if (Math.abs(dx) < 9 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        pointerStart.dragging = true;
        items[activeStage].classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      }
      items[activeStage].style.setProperty("--drag-x", `${dx}px`);
      items[activeStage].style.setProperty("--drag-rotate", `${Math.max(-12, Math.min(12, dx / 18))}deg`);
    });
    track.addEventListener("pointerup", event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      const dx = event.clientX - pointerStart.x;
      const dragging = pointerStart.dragging;
      const speed = Math.abs(dx) / Math.max(1, performance.now() - pointerStart.time);
      pointerStart = null;
      // Deslizar hacia cualquier lado pasa siempre a la etapa siguiente, en orden (1, 2, la tarjeta, 3…).
      if (dragging && (Math.abs(dx) >= 36 || (Math.abs(dx) >= 18 && speed > .35))) {
        moveStack(1, dx < 0 ? 1 : -1);
      } else {
        items[activeStage].classList.remove("is-dragging");
      }
    });
    track.addEventListener("pointercancel", event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      pointerStart = null;
      items[activeStage].classList.remove("is-dragging");
    });
  }

  // Foto ampliada (la comparten la cinta de recuerdos y el corazón de fotos grupales): se ve completa,
  // con su frase o sus nombres; flechas, deslizar o teclado para cambiar. Escape, la X o tocar el fondo la cierran.
  const photoViewer = (() => {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxCount = document.getElementById("lightbox-count");
    const prevButton = document.getElementById("lightbox-prev");
    const nextButton = document.getElementById("lightbox-next");
    let photos = [];
    let current = 0;
    let opener = null;
    const show = (index, direction) => {
      current = (index + photos.length) % photos.length;
      const photo = photos[current];
      lightbox.dataset.direction = direction > 0 ? "next" : direction < 0 ? "prev" : "";
      lightbox.classList.remove("is-changing");
      void lightbox.offsetWidth;
      lightbox.classList.add("is-changing");
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt || "";
      lightboxCaption.textContent = String(photo.caption || "").trim();
      // Los nombres del álbum conservan su corazón de color.
      if (photo.heart && lightboxCaption.textContent) {
        lightboxCaption.append(" ");
        lightboxCaption.append(heartIcon(photo.heart));
      }
      lightboxCaption.hidden = !lightboxCaption.textContent;
      if (lightboxCaption.hidden) lightbox.setAttribute("aria-label", photo.alt || (english ? "Enlarged photograph" : "Fotografía ampliada"));
      else lightbox.removeAttribute("aria-label");
      lightboxCount.textContent = `${current + 1} / ${photos.length}`;
    };
    const step = direction => { if (photos.length > 1) show(current + direction, direction); };
    const close = () => {
      if (!lightbox.open) return;
      lightbox.classList.add("is-closing");
      window.setTimeout(() => {
        lightbox.classList.remove("is-open", "is-closing");
        if (typeof lightbox.close === "function") lightbox.close();
        else { lightbox.removeAttribute("open"); lightbox.dispatchEvent(new Event("close")); }
      }, reducedMotion.matches ? 0 : 260);
    };
    lightbox.addEventListener("close", () => {
      lightbox.classList.remove("is-open", "is-closing");
      document.documentElement.classList.remove("has-lightbox");
      if (opener) opener.focus({ preventScroll:true });
    });
    lightbox.addEventListener("cancel", event => { event.preventDefault(); close(); });
    document.getElementById("lightbox-close").addEventListener("click", close);
    prevButton.addEventListener("click", () => step(-1));
    nextButton.addEventListener("click", () => step(1));
    // Tocar el fondo oscuro cierra la foto.
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox || event.target.classList.contains("lightbox-stage")) close();
    });
    lightbox.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    });
    let swipe = null;
    lightbox.addEventListener("pointerdown", event => { if (event.pointerType !== "mouse") swipe = { x:event.clientX, y:event.clientY }; });
    lightbox.addEventListener("pointerup", event => {
      if (!swipe) return;
      const dx = event.clientX - swipe.x;
      const dy = event.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
    });
    lightbox.addEventListener("pointercancel", () => { swipe = null; });
    return {
      open(list, index, from) {
        photos = list;
        opener = from;
        prevButton.hidden = nextButton.hidden = lightboxCount.hidden = photos.length < 2;
        show(index, 0);
        if (typeof lightbox.showModal === "function") lightbox.showModal();
        else lightbox.setAttribute("open", "");
        document.documentElement.classList.add("has-lightbox");
        lightbox.classList.remove("is-closing");
        lightbox.classList.add("is-open");
      },
    };
  })();
  // Corazón de color junto a los nombres (dibujado, se ve igual en cualquier teléfono).
  function heartIcon(color) {
    const heart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    heart.setAttribute("viewBox", "0 0 24 22");
    heart.setAttribute("aria-hidden", "true");
    heart.classList.add("film-heart");
    heart.style.setProperty("--heart", color);
    heart.innerHTML = '<path d="M12 20.5C9.2 18.1 1.7 13.8 2 7.6C2.3 2.5 8.6 2.1 12 7C15.4 2.1 21.7 2.5 22 7.6C22.3 13.8 14.8 18.1 12 20.5Z"/><path class="film-heart-shine" d="M6.2 6.4C7.4 5.4 9 5.6 10 6.8"/>';
    return heart;
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
      edge.textContent = english ? "The joy of crossing paths" : "La alegría de coincidir";
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
      if (photo.heart && words.textContent) words.append(" ", heartIcon(photo.heart));
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
    let frameId = 0;
    const requestStep = () => {
      if (!frameId && visible && !document.hidden) frameId = window.requestAnimationFrame(step);
    };
    const step = now => {
      frameId = 0;
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
          // También se detiene mientras una foto está ampliada.
          const stopped = holding || hovering || focused || reducedMotion.matches || document.documentElement.classList.contains("has-lightbox");
          const target = stopped ? 0 : cruise();
          // El impulso del gesto se disipa poco a poco hasta volver al ritmo de crucero (o detenerse si está en pausa).
          const ease = Math.abs(velocity) > Math.abs(cruise()) * 1.5 ? .55 : .35;
          velocity += (target - velocity) * (1 - Math.exp(-dt / ease));
          position += velocity * dt;
        }
        wrap();
        render();
      }
      requestStep();
    };
    // Arrastre con el dedo o el mouse. touch-action: pan-y deja libre el desplazamiento vertical de la página.
    let samples = [];
    roll.addEventListener("pointerdown", event => {
      if (event.button > 0) return;
      holding = true;
      keyTarget = null;
      dragging = { id:event.pointerId, x:event.clientX, start:position, moved:false, slop:event.pointerType === "mouse" ? 3 : 7 };
      samples = [{ t:event.timeStamp, dx:0 }];
      velocity = 0;
    });
    roll.addEventListener("pointermove", event => {
      if (!dragging || event.pointerId !== dragging.id) return;
      const dx = event.clientX - dragging.x;
      if (!dragging.moved && Math.abs(dx) > dragging.slop) {
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
    // Un toque o clic sin arrastrar amplía la foto que está debajo (también las copias que hacen la cinta infinita).
    const frameAt = x => frames.findIndex(item => {
      if (item.hidden) return false;
      const box = item.getBoundingClientRect();
      return x >= box.left && x <= box.right;
    });
    const openPhoto = index => { if (index >= 0) photoViewer.open(photos, index % count, roll); };
    let tapped = -1;
    roll.addEventListener("click", () => {
      const index = tapped;
      tapped = -1;
      openPhoto(index);
    });
    const release = event => {
      if (!dragging || (event && event.pointerId !== dragging.id)) return;
      // La foto se abre con el clic que sigue al toque, así ese mismo clic no cae sobre la foto ampliada.
      tapped = !dragging.moved && event && event.type === "pointerup" ? frameAt(event.clientX) : -1;
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
      if (event.key === "Enter" || event.key === " ") {
        // Con teclado se amplía la foto que está al centro de la cinta.
        event.preventDefault();
        const box = roll.getBoundingClientRect();
        openPhoto(frameAt(box.left + box.width / 2));
        return;
      }
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
        if (visible) {
          track.querySelectorAll("img").forEach(img => { img.loading = "eager"; });
          previous = 0;
          requestStep();
        } else if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
      }, { rootMargin:"60% 0px" }).observe(roll);
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!document.hidden) {
        previous = 0;
        requestStep();
      }
    });
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(track);
    window.addEventListener("resize", measure);
    velocity = reducedMotion.matches ? 0 : cruise();
    measure();
    requestStep();
  }
  // Con movimiento reducido las cintas no avanzan solas: la instrucción solo invita a deslizar.
  const filmHintText = () => english
    ? (reducedMotion.matches ? (finePointer.matches ? "Drag or click a photo to enlarge it" : "Swipe or tap a photo to enlarge it") : (finePointer.matches ? "Hover to pause or click a photo to enlarge it" : "Swipe or tap a photo to enlarge it"))
    : (reducedMotion.matches ? (finePointer.matches ? "Arrastra o haz clic en una foto para ampliarla" : "Desliza o toca una foto para ampliarla") : (finePointer.matches ? "Pasa el mouse para pausar o haz clic en una foto para ampliarla" : "Desliza o toca una foto para ampliarla"));
  document.querySelectorAll(".film-hint:not(.collage-hint) span").forEach(hint => { hint.textContent = filmHintText(); });
  const collageHint = document.getElementById("collage-hint-text");
  if (collageHint && finePointer.matches) collageHint.textContent = english ? "Click a photo to see it in full" : "Haz clic en una foto para verla completa";

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
  // Fotos grupales formando un corazón. Las fotos están fijas; al tocar una se amplía con su frase.
  const groupGallery = config.groupGallery || {};
  const groupSection = document.getElementById("grupales");
  const groupPhotos = (Array.isArray(groupGallery.photos) ? groupGallery.photos : []).filter(photo => photo && photo.src);
  if (!groupPhotos.length) {
    groupSection.hidden = true;
  } else {
    if (groupGallery.title) document.getElementById("group-title").textContent = groupGallery.title;
    buildHeartCollage(document.getElementById("heart-collage"), groupPhotos);
  }

  // Corazón de fotografías: el corazón se divide en filas (una foto por lóbulo arriba, la punta abajo) y cada foto
  // ocupa el espacio que mejor le queda según su forma. La silueta la recorta una máscara con forma de corazón.
  function heartRows(count) {
    // La fila de arriba siempre se divide justo en el centro, donde el corazón se hunde, para no cortar caras.
    const table = { 1:[1], 2:[2], 3:[2,1], 4:[2,2], 5:[2,2,1], 6:[2,3,1], 7:[2,3,2], 8:[2,4,2], 9:[2,3,3,1], 10:[2,4,3,1], 11:[2,4,4,1], 12:[4,4,3,1] };
    if (table[count]) return table[count];
    const rows = [2];
    for (let left = count - 2; left > 0; left -= 4) rows.push(Math.min(4, left));
    return rows;
  }
  // Ancho del corazón a cada altura (0 arriba, 1 abajo), en porcentaje: sirve para no poner fotos donde no se verían.
  function heartSpan(y) {
    // Medido sobre la misma curva de la máscara del corazón.
    const profile = [[0,0,100],[.4,2.9,97.1],[.5,6.4,93.6],[.6,11.9,88.1],[.7,19.7,80.3],[.8,29.6,70.4],[.9,41,59],[.97,50,50],[1,50,50]];
    for (let index = 1; index < profile.length; index += 1) {
      const [y1, a1, b1] = profile[index];
      const [y0, a0, b0] = profile[index - 1];
      if (y <= y1) {
        const t = (y - y0) / (y1 - y0 || 1);
        return [a0 + (a1 - a0) * t, b0 + (b1 - b0) * t];
      }
    }
    return [47, 53];
  }
  // Espacios en filas, de arriba abajo (sin foto central).
  function rowSlots(count) {
    const rows = heartRows(count);
    const heights = { 1:[1], 2:[.54,.46], 3:[.46,.29,.25], 4:[.36,.26,.22,.16] }[rows.length] || rows.map(() => 1 / rows.length);
    const slots = [];
    let top = 0;
    rows.forEach((columns, row) => {
      const height = heights[row];
      const [left, right] = heartSpan(top);
      const width = (right - left) / columns;
      for (let column = 0; column < columns; column += 1) {
        slots.push({ x:left + width * column, y:top * 100, w:width, h:height * 100 });
      }
      top += height;
    });
    return slots;
  }
  // Con una foto destacada: ella ocupa el centro, vertical, con otra foto debajo; arriba una fila sobre los lóbulos,
  // a cada lado una columna de fotos y abajo las filas que bajan hacia la punta.
  function featuredSlots(count) {
    const top = count >= 10 ? 4 : 2;
    const topHeight = 24;
    const rest = count - top - 1; // una foto va debajo de la destacada
    const perSide = Math.min(3, Math.max(1, Math.floor((rest - 1) / 2)));
    let left = rest - perSide * 2;
    const lower = [];
    if (left > 1) { lower.push(Math.min(4, left - 1)); left -= lower[0]; }
    while (left > 0) { const columns = Math.min(4, left); lower.push(columns); left -= columns; }
    const middleEnd = lower.length > 1 ? 74 : lower.length ? 80 : 100;
    const slots = [];
    for (let column = 0; column < top; column += 1) slots.push({ x:100 / top * column, y:0, w:100 / top, h:topHeight });
    const side = 40; // la foto central ocupa el 20 % del ancho y el 62 % de la altura del bloque central
    const sideHeight = (middleEnd - topHeight) / perSide;
    // Cada foto empieza donde pasa el borde del corazón a la altura de su lado de arriba: el corazón queda lleno
    // y la silueta solo recorta la esquina de abajo, así las caras quedan a la vista.
    for (let row = 0; row < perSide; row += 1) {
      const y = topHeight + sideHeight * row;
      const [from, to] = heartSpan(y / 100);
      slots.push({ x:from, y, w:side - from, h:sideHeight });
      slots.push({ x:100 - side, y, w:to - (100 - side), h:sideHeight });
    }
    const lowerHeights = lower.length > 1 ? [14, 12] : [20];
    let y = middleEnd;
    lower.forEach((columns, row) => {
      const height = lowerHeights[row] || 10;
      const [from, to] = heartSpan(y / 100);
      const width = (to - from) / columns;
      for (let column = 0; column < columns; column += 1) slots.push({ x:from + width * column, y, w:width, h:height });
      y += height;
    });
    const centerHeight = (middleEnd - topHeight) * .62;
    slots.push({ x:side, y:topHeight + centerHeight, w:100 - side * 2, h:middleEnd - topHeight - centerHeight });
    return { center:{ x:side, y:topHeight, w:100 - side * 2, h:centerHeight }, slots };
  }
  function buildHeartCollage(list, photos) {
    // La foto marcada con featured va al centro, más grande (si hay suficientes fotos para rodearla).
    const featured = photos.findIndex(photo => photo.featured);
    const layout = featured >= 0 && photos.length >= 7 ? featuredSlots(photos.length - 1) : { center:null, slots:rowSlots(photos.length) };
    const slots = layout.slots;
    const tiles = photos.map((photo, index) => {
      const item = document.createElement("li");
      item.className = layout.center && index === featured ? "collage-tile is-featured" : "collage-tile";
      item.style.setProperty("--k", index);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "collage-button";
      button.setAttribute("aria-label", `${english ? "Enlarge" : "Ampliar"}: ${photo.alt || (english ? `group photograph ${index + 1}` : `fotografía grupal ${index + 1}`)}`);
      const image = document.createElement("img");
      image.alt = "";
      image.decoding = "async";
      image.loading = "lazy";
      image.draggable = false;
      // Las caras suelen estar arriba del centro: el recorte las conserva.
      image.style.objectPosition = photo.position || photo.face || "50% 32%";
      image.addEventListener("load", () => { item.classList.add("has-photo"); arrange(); }, { once:true });
      image.addEventListener("error", () => arrange(), { once:true });
      image.src = photo.src;
      button.append(image);
      button.addEventListener("click", () => photoViewer.open(photos, index, button));
      item.append(button);
      return { item, image, photo };
    });
    list.replaceChildren(...tiles.map(tile => tile.item));
    // Cada foto va al espacio cuya forma se parece más a la suya: las verticales a los lóbulos, las horizontales a la punta.
    const place = pairs => pairs.forEach(([tile, slot]) => {
      const style = tile.item.style;
      style.left = `${slot.x}%`;
      style.top = `${slot.y}%`;
      style.width = `${slot.w}%`;
      style.height = `${slot.h}%`;
    });
    const centerTile = layout.center ? tiles[featured] : null;
    const around = tiles.filter(tile => tile !== centerTile);
    const withCenter = pairs => (centerTile ? [...pairs, [centerTile, layout.center]] : pairs);
    place(withCenter(around.map((tile, index) => [tile, slots[index]])));
    let pending = tiles.length;
    function arrange() {
      pending -= 1;
      if (pending > 0) return;
      const aspect = tile => (tile.image.naturalWidth && tile.image.naturalHeight ? tile.image.naturalWidth / tile.image.naturalHeight : 1);
      const order = [...around].sort((a, b) => aspect(a) - aspect(b));
      // Mismo orden que la forma real de cada espacio (el corazón es un poco más ancho que alto).
      const spaces = [...slots].sort((a, b) => (a.w / a.h) - (b.w / b.h));
      place(withCenter(order.map((tile, rank) => [tile, spaces[rank]])));
      list.classList.toggle("has-center", Boolean(centerTile));
      list.classList.add("is-ready");
      focusFaces();
      if ("ResizeObserver" in window) new ResizeObserver(focusFaces).observe(list);
    }
    // Encuadre centrado en las caras: con el tamaño real de cada espacio se calcula el recorte que deja
    // el punto «face» de la foto (dónde están las caras) lo más cerca posible del centro del espacio.
    function focusFaces() {
      tiles.forEach(tile => {
        const point = String(tile.photo.face || "").match(/[\d.]+/g);
        const { naturalWidth:nw, naturalHeight:nh, clientWidth:w, clientHeight:h } = tile.image;
        if (!point || point.length < 2 || !nw || !nh || !w || !h) return;
        const scale = Math.max(w / nw, h / nh);
        const axis = (focus, shown, room) => (shown - room > 1 ? Math.min(1, Math.max(0, (focus * shown - room / 2) / (shown - room))) : .5);
        const x = axis(point[0] / 100, nw * scale, w);
        const y = axis(point[1] / 100, nh * scale, h);
        tile.image.style.objectPosition = `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`;
      });
    }
    // Las fotos se piden cuando el corazón se acerca a la pantalla.
    if ("IntersectionObserver" in window) {
      const warm = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        tiles.forEach(tile => { tile.image.loading = "eager"; });
        warm.disconnect();
      }, { rootMargin:"120% 0px" });
      warm.observe(list);
    }
  }

  // Cierre: título, mensaje, firma y pie vienen de config.js.
  const closing = config.closing || {};
  const closingTitle = document.getElementById("closing-title");
  // Cada palabra entra por separado; la palabra resaltada va en cursiva con el trazo amarillo.
  buildTitle(closingTitle, closing.title || closingTitle.textContent, closing.highlight, "closing-highlight", closingTitle.querySelector(".closing-swash"));
  const closingMessage = [].concat(closing.message || []).filter(Boolean);
  if (closingMessage.length) {
    document.getElementById("closing-message").replaceChildren(...closingMessage.map((text, index) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      // Con varios párrafos, el último («Los quiero mucho.») se destaca.
      if (closingMessage.length > 1 && index === closingMessage.length - 1) paragraph.className = "closing-love";
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
    document.getElementById("cover-title").focus({ preventScroll:true });
  });

  document.getElementById("next-section").addEventListener("click", () => {
    const next = document.getElementById(config.nextSection || "carta");
    if (next) {
      next.scrollIntoView({ behavior:reducedMotion.matches ? "auto" : "smooth", block:"start" });
      next.focus({ preventScroll:true });
    } else {
      document.getElementById("next-message").textContent = english ? "More details to share this day are coming soon." : "Pronto, más detalles para compartir este día.";
    }
    // Punto de integración para las secciones que agregaremos después.
    document.dispatchEvent(new CustomEvent("invitation:continue"));
  });
})();
