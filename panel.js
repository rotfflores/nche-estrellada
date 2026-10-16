(() => {
  "use strict";
  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");
  const loadingView = document.getElementById("loading-view");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const dashboardError = document.getElementById("dashboard-error");
  const list = document.getElementById("responses");
  const search = document.getElementById("search");
  let responses = [];
  let filter = "si";

  async function api(path, options) {
    const response = await fetch(path, { credentials:"same-origin", cache:"no-store", ...options });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.error || "No se pudo conectar. Intenta de nuevo.");
      error.status = response.status;
      throw error;
    }
    return result;
  }

  function view(name) {
    loadingView.hidden = name !== "loading";
    loginView.hidden = name !== "login";
    dashboardView.hidden = name !== "dashboard";
  }

  function dateText(value) {
    const parsed = new Date(String(value).replace(" ", "T") + "Z");
    return Number.isNaN(parsed.valueOf()) ? "" : new Intl.DateTimeFormat("es-MX", {
      dateStyle:"medium", timeStyle:"short", timeZone:"America/Mexico_City"
    }).format(parsed);
  }

  function render() {
    const accepted = responses.filter(item => item.answer === "si");
    document.getElementById("yes-count").textContent = accepted.length;
    document.getElementById("no-count").textContent = responses.length - accepted.length;
    document.getElementById("message-count").textContent = responses.filter(item => item.message?.trim()).length;
    const query = search.value.trim().toLocaleLowerCase("es-MX");
    const visible = responses.filter(item => (filter === "todos" || item.answer === filter) &&
      (!query || `${item.name} ${item.message}`.toLocaleLowerCase("es-MX").includes(query)));
    document.getElementById("result-count").textContent = `${visible.length} ${visible.length === 1 ? "respuesta" : "respuestas"}`;
    list.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = query ? "No encontramos respuestas con esa búsqueda." : "Todavía no hay respuestas en esta vista.";
      list.append(empty);
      return;
    }
    visible.forEach(item => {
      const article = document.createElement("article");
      article.className = "response-card";
      const head = document.createElement("div");
      head.className = "response-head";
      const name = document.createElement("h3");
      name.textContent = item.name || "Sin nombre";
      const date = document.createElement("time");
      date.className = "response-date";
      date.textContent = dateText(item.updated_at);
      head.append(name, date);
      const answer = document.createElement("span");
      answer.className = `response-answer${item.answer === "no" ? " is-no" : ""}`;
      answer.textContent = item.answer === "si" ? "Sí, ahí estará" : "No podrá asistir";
      article.append(head, answer);
      if (item.message) {
        const message = document.createElement("p");
        message.className = "response-message";
        message.textContent = item.message;
        article.append(message);
      }
      list.append(article);
    });
  }

  async function loadResponses() {
    dashboardError.textContent = "";
    try {
      const result = await api("/api/admin/responses");
      responses = Array.isArray(result.responses) ? result.responses : [];
      render();
    } catch (error) {
      if (error.status === 401) { view("login"); return; }
      dashboardError.textContent = error.message;
    }
  }

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    loginError.textContent = "";
    const button = document.getElementById("login-button");
    button.disabled = true;
    try {
      await api("/api/admin/login", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ password:document.getElementById("password").value }),
      });
      loginForm.reset();
      view("dashboard");
      await loadResponses();
    } catch (error) {
      loginError.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById("logout-button").addEventListener("click", async () => {
    try { await api("/api/admin/logout", { method:"POST" }); }
    catch { /* La sesión local también se oculta si falla la red. */ }
    responses = [];
    view("login");
  });
  document.getElementById("refresh-button").addEventListener("click", loadResponses);
  search.addEventListener("input", render);
  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(item => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    render();
  }));
  document.getElementById("export-button").addEventListener("click", () => {
    const safeCell = value => {
      let text = String(value ?? "");
      if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
      return `"${text.replaceAll('"', '""')}"`;
    };
    const rows = [["Respuesta", "Nombre", "Mensaje", "Recibida", "Actualizada"],
      ...responses.map(item => [item.answer === "si" ? "Sí" : "No", item.name, item.message, item.created_at, item.updated_at])];
    const blob = new Blob(["\uFEFF", rows.map(row => row.map(safeCell).join(",")).join("\r\n")], { type:"text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `confirmaciones-victoria-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  api("/api/admin/session").then(result => {
    view(result.authenticated ? "dashboard" : "login");
    if (result.authenticated) loadResponses();
  }).catch(() => {
    view("login");
    loginError.textContent = "El panel necesita conectarse a Cloudflare para iniciar sesión.";
  });
})();
