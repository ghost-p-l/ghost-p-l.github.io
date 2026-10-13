/* ==========================================================================
   Liberty James — Portfolio interactions
   Vanilla JS. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $html = document.documentElement;

  /* ---------------------------------------------------------------- THEME */
  const THEMES = [
    { id: "midnight", name: "Midnight", c: ["#6366f1", "#22d3ee"] },
    { id: "tokyo",    name: "Tokyo",    c: ["#bb9af7", "#7aa2f7"] },
    { id: "sunset",   name: "Sunset",   c: ["#f472b6", "#fb923c"] },
    { id: "forest",   name: "Forest",   c: ["#34d399", "#4ade80"] },
    { id: "ocean",    name: "Ocean",    c: ["#38bdf8", "#2dd4bf"] },
    { id: "mono",     name: "Mono",     c: ["#e5e7eb", "#9ca3af"] },
    { id: "daylight", name: "Daylight", c: ["#4f46e5", "#0891b2"] },
  ];
  const THEME_KEY = "lj-theme";

  function applyTheme(id) {
    const t = THEMES.find((x) => x.id === id) || THEMES[0];
    $html.setAttribute("data-theme", t.id);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.id === "daylight" ? "#f6f7fb" : "#0a0e1a");
    const dot = $("#themeDot");
    if (dot) dot.style.background = `linear-gradient(135deg, ${t.c[0]}, ${t.c[1]})`;
    $$("#themeMenu button").forEach((b) => b.classList.toggle("active", b.dataset.theme === t.id));
    try { localStorage.setItem(THEME_KEY, t.id); } catch (e) {}
  }

  function buildThemeMenu() {
    const menu = $("#themeMenu");
    if (!menu) return;
    menu.innerHTML = "";
    THEMES.forEach((t) => {
      const b = document.createElement("button");
      b.dataset.theme = t.id;
      b.innerHTML = `<span class="sw" style="background:linear-gradient(135deg, ${t.c[0]}, ${t.c[1]})"></span>${t.name}`;
      b.addEventListener("click", () => { applyTheme(t.id); menu.classList.remove("open"); $("#themeBtn").setAttribute("aria-expanded", "false"); });
      menu.appendChild(b);
    });
  }

  let saved = "midnight";
  try { saved = localStorage.getItem(THEME_KEY) || "midnight"; } catch (e) {}
  buildThemeMenu();
  applyTheme(saved);

  const themeBtn = $("#themeBtn");
  const themeMenu = $("#themeMenu");
  themeBtn?.addEventListener("click", () => {
    const open = menu_open(themeMenu);
    themeBtn.setAttribute("aria-expanded", String(!open));
  });
  function menu_open(m) { const willOpen = !m.classList.contains("open"); m.classList.toggle("open", willOpen); return willOpen; }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-switch")) { themeMenu?.classList.remove("open"); themeBtn?.setAttribute("aria-expanded", "false"); }
  });
  function cycleTheme() {
    const cur = $html.getAttribute("data-theme");
    const i = THEMES.findIndex((t) => t.id === cur);
    applyTheme(THEMES[(i + 1) % THEMES.length].id);
  }

  /* --------------------------------------------------------- SCROLL EFFECTS */
  const scrollBar = $("#scrollBar");
  const toTop = $("#toTop");
  const nav = $("#nav");
  function onScroll() {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (scrollBar) scrollBar.style.width = (pct * 100) + "%";
    if (toTop) toTop.classList.toggle("show", h.scrollTop > 600);
    if (nav) nav.style.boxShadow = h.scrollTop > 10 ? "0 10px 30px -20px rgba(0,0,0,.7)" : "none";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* --------------------------------------------------------------- REVEAL */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  $$(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("is-visible")));

  /* -------------------------------------------------------- SIDE ACTIVE NAV */
  const sections = $$("main section[id]");
  const dotLinks = $$("#dots a");
  const navLinks = $$("#navLinks a");
  const secIO = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const id = "#" + en.target.id;
            dotLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
            navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
          }
        });
      }, { threshold: 0.4 })
    : null;
  sections.forEach((s) => secIO && secIO.observe(s));

  /* ------------------------------------------------------------ MOBILE NAV */
  const toggle = $("#navToggle"), links = $("#navLinks");
  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links?.addEventListener("click", (e) => { if (e.target.tagName === "A") { links.classList.remove("open"); toggle?.setAttribute("aria-expanded", "false"); } });

  /* ---------------------------------------------------------------- TYPED */
  const roles = ["Computer Scientist", "AI Developer", "Full-Stack Engineer", "Algorithmic Trader", "Founder @ Nurish"];
  const typedEl = $("#typed");
  if (typedEl && !REDUCED) {
    let ri = 0, ci = 0, deleting = false;
    (function tick() {
      const word = roles[ri];
      typedEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) ci++;
      else if (deleting && ci > 0) ci--;
      else { deleting = !deleting; if (!deleting) ri = (ri + 1) % roles.length; setTimeout(tick, 1100); return; }
      setTimeout(tick, deleting ? 42 : 82);
    })();
  } else if (typedEl) { typedEl.textContent = roles[0]; }

  /* -------------------------------------------------------------- COUNTERS */
  const statIO = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target, target = +el.dataset.count, suffix = el.dataset.suffix || "";
          statIO.unobserve(el);
          if (REDUCED) return; // HTML already carries the final value (noscript-safe)
          el.textContent = "0" + suffix;
          const t0 = performance.now(), dur = 1200;
          (function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          })(t0);
        });
      }, { threshold: 0.5 })
    : null;
  $$("#stats strong").forEach((el) => (statIO ? statIO.observe(el) : (el.textContent = el.dataset.count + (el.dataset.suffix || ""))));

  /* -------------------------------------------------------------- MARQUEE */
  const STACK = ["Python", "TypeScript", "JavaScript", "MQL5", "Pine Script", "SQL", "LLMs", "MCP", "AI Agents", "TradingView", "MetaTrader 5", "REST APIs", "Node.js", "Git", "Automation"];
  const track = $("#marqueeTrack");
  if (track) {
    const half = STACK.map((s) => `<span>${s}</span>`).join("");
    track.innerHTML = half + half;
  }

  /* ---------------------------------------------------------- PARALLAX BLOBS */
  const blobs = $$("[data-parallax]");
  if (blobs.length && !REDUCED) {
    let sy = window.scrollY, heroVisible = true;
    const hero = $(".hero");
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver((en) => { heroVisible = en[0].isIntersecting; }).observe(hero);
    }
    window.addEventListener("scroll", () => { sy = window.scrollY; }, { passive: true });
    (function raf() {
      if (heroVisible) blobs.forEach((b) => { b.style.transform = `translateY(${sy * parseFloat(b.dataset.parallax)}px)`; });
      requestAnimationFrame(raf);
    })();
  }

  /* ------------------------------------------------------------- PROJECTS */
  const filters = $("#filters");
  filters?.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$(".chip", filters).forEach((c) => c.classList.toggle("is-active", c === chip));
    const f = chip.dataset.filter;
    $$("#projGrid .card").forEach((card) => {
      const cats = (card.dataset.cat || "").split(" ");
      card.classList.toggle("hide", !(f === "all" || cats.includes(f)));
    });
  });

  /* card spotlight + tilt */
  $$(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      card.style.setProperty("--mx", mx + "px");
      card.style.setProperty("--my", my + "px");
      if (REDUCED) return;
      const rx = ((my / r.height) - 0.5) * -6;
      const ry = ((mx / r.width) - 0.5) * 6;
      card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  /* --------------------------------------------------------- GITHUB REPOS */
  const PIN = [
    { name: "tradingview-mcp", desc: "Model Context Protocol server enabling AI agents to interact with TradingView.", lang: "TypeScript", url: "https://github.com/ghost-p-l/tradingview-mcp", tag: "AI · Fintech" },
    { name: "synx_mt5_mcp", desc: "MCP integration connecting AI agents to MetaTrader 5 for trading automation.", lang: "Python", url: "https://github.com/ghost-p-l/synx_mt5_mcp", tag: "AI · Fintech" },
    { name: "shennina", desc: "Open-source project by ghost-p-l.", lang: "Code", url: "https://github.com/ghost-p-l/shennina", tag: "Open Source" },
  ];
  const ghGrid = $("#ghGrid");
  function safeUrl(u) {
    try { const p = new URL(u, location.origin); return p.protocol === "https:" ? p.href : "#"; }
    catch (e) { return "#"; }
  }
  function repoCard(r) {
    // Never inject API-supplied strings as raw HTML (repo descriptions are
    // free text and could carry markup). Escape everything, allow https only.
    const url = safeUrl(r.url || "#");
    const name = esc(String(r.name || "repo"));
    const desc = esc(String(r.desc || "Open-source project."));
    const lang = esc(String(r.lang || "Code"));
    const tag = esc(String(r.tag || "Repo"));
    const stars = Number.isFinite(+r.stars) && +r.stars > 0 ? `<li>★ ${Math.floor(+r.stars)}</li>` : "";
    return `<article class="card card--project tilt">
      <div class="card__top"><span class="card__icon">📦</span><span class="card__tag">${tag}</span></div>
      <h3 class="card__title"><a href="${url}" target="_blank" rel="noopener">${name}</a></h3>
      <p class="card__desc">${desc}</p>
      <ul class="card__stack"><li>${lang}</li>${stars}</ul>
      <div class="card__links"><a href="${url}" target="_blank" rel="noopener">View on GitHub ↗</a></div>
    </article>`;
  }
  async function loadRepos() {
    if (!ghGrid) return;
    try {
      const res = await fetch("https://api.github.com/users/ghost-p-l/repos?sort=updated&per_page=30");
      if (!res.ok) throw new Error("api");
      const data = await res.json();
      const wanted = ["tradingview-mcp", "synx_mt5_mcp", "shennina"];
      let list = data.filter((x) => wanted.includes(x.name));
      const order = (n) => (wanted.indexOf(n) === -1 ? 99 : wanted.indexOf(n));
      list.sort((a, b) => order(a.name) - order(b.name));
      if (list.length) {
        ghGrid.innerHTML = list.map((x) => repoCard({
          name: x.name, desc: x.description || "Open-source project.", lang: x.language || "Code",
          stars: x.stargazers_count, url: x.html_url, tag: "Open Source",
        })).join("");
        return;
      }
      throw new Error("none");
    } catch (e) {
      ghGrid.innerHTML = PIN.map(repoCard).join("");
    }
  }
  loadRepos();

  /* -------------------------------------------------------------- COPY/TOAST */
  const toast = $("#toast");
  let toastT;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-copy]");
    if (!el) return;
    const text = el.dataset.copy;
    navigator.clipboard?.writeText(text).then(
      () => showToast("Copied: " + text),
      () => showToast(text)
    );
  });

  /* ----------------------------------------------------- COMMAND PALETTE */
  const palette = $("#palette"), pInput = $("#paletteInput"), pList = $("#paletteList");
  const ACTIONS = [
    { id: "home", icon: "🏠", label: "Go to Home", hint: "section", run: () => go("#home") },
    { id: "about", icon: "👤", label: "Go to About", hint: "section", run: () => go("#about") },
    { id: "experience", icon: "💼", label: "Go to Experience", hint: "section", run: () => go("#experience") },
    { id: "projects", icon: "🚀", label: "Go to Projects", hint: "section", run: () => go("#projects") },
    { id: "skills", icon: "🧠", label: "Go to Skills", hint: "section", run: () => go("#skills") },
    { id: "education", icon: "🎓", label: "Go to Education", hint: "section", run: () => go("#education") },
    { id: "contact", icon: "✉️", label: "Go to Contact", hint: "section", run: () => go("#contact") },
    { id: "cv", icon: "📄", label: "Download CV", hint: "action", run: () => (window.location.href = "assets/Liberty_James_CV.pdf") },
    { id: "email", icon: "📧", label: "Copy email address", hint: "action", run: () => copy("libertyjames200@gmail.com") },
    { id: "phone", icon: "📱", label: "Copy phone number", hint: "action", run: () => copy("+254 790 689 052") },
    { id: "github", icon: "🐙", label: "Open GitHub profile", hint: "link", run: () => window.open("https://github.com/ghost-p-l", "_blank") },
    { id: "terminal", icon: "⌨️", label: "Open terminal", hint: "action", run: () => openTerminal() },
    { id: "theme", icon: "🎨", label: "Cycle theme", hint: "action", run: () => cycleTheme() },
    { id: "matrix", icon: "🟢", label: "Toggle matrix mode", hint: "easter egg", run: () => toggleMatrix() },
    { id: "help", icon: "❓", label: "Keyboard shortcuts", hint: "action", run: () => toggleOverlay(helpOverlay) },
  ];
  THEMES.forEach((t) => ACTIONS.push({ id: "theme-" + t.id, icon: "🎨", label: "Theme: " + t.name, hint: "theme", run: () => applyTheme(t.id) }));

  let pActive = 0, pFiltered = ACTIONS.slice();
  function go(sel) { closeAll(); location.hash = sel; }
  function copy(t) { navigator.clipboard?.writeText(t); showToast("Copied: " + t); }

  function renderPalette(q) {
    const query = q.trim().toLowerCase();
    pFiltered = ACTIONS.filter((a) => a.label.toLowerCase().includes(query) || a.id.includes(query));
    pActive = 0;
    if (!pFiltered.length) { pList.innerHTML = '<li class="palette__empty">No results</li>'; return; }
    pList.innerHTML = pFiltered.map((a, i) =>
      `<li data-i="${i}" class="${i === 0 ? "active" : ""}"><span class="pi">${a.icon}</span>${a.label}<small>${a.hint}</small></li>`
    ).join("");
  }
  function setActive(i) {
    pActive = i;
    $$("#paletteList li[data-i]").forEach((li) => li.classList.toggle("active", +li.dataset.i === i));
  }
  function runPalette(i) { const a = pFiltered[i]; if (!a) return; closeAll(); a.run(); }

  function openPalette() { toggleOverlay(palette); if (!palette.hidden) { pInput.value = ""; renderPalette(""); setTimeout(() => pInput.focus(), 30); } }

  pInput?.addEventListener("input", () => renderPalette(pInput.value));
  pInput?.addEventListener("keydown", (e) => {
    if (!pFiltered.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((pActive + 1) % pFiltered.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((pActive - 1 + pFiltered.length) % pFiltered.length); }
    else if (e.key === "Enter") { e.preventDefault(); runPalette(pActive); }
  });
  pList?.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) runPalette(+li.dataset.i); });
  pList?.addEventListener("mousemove", (e) => { const li = e.target.closest("li[data-i]"); if (li) setActive(+li.dataset.i); });
  $("#openPalette")?.addEventListener("click", openPalette);

  /* -------------------------------------------------------------- TERMINAL */
  const termOverlay = $("#terminalOverlay"), termBody = $("#termBody"), termForm = $("#termForm"), termInput = $("#termInput");
  const cmdHistory = [];
  let histIdx = -1;

  const BANNER =
    "Liberty James — interactive shell\n" +
    "Type 'help' to see available commands.\n";
  function termWrite(html) { if (!termBody) return; termBody.insertAdjacentHTML("beforeend", html + "\n"); termBody.scrollTop = termBody.scrollHeight; }
  function esc(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  const COMMANDS = {
    help: () => `Available commands:
  <span class="c-acc">about</span>       who I am
  <span class="c-acc">projects</span>    list projects
  <span class="c-acc">skills</span>      technical skills
  <span class="c-acc">experience</span>  work history
  <span class="c-acc">education</span>   studies
  <span class="c-acc">contact</span>     how to reach me
  <span class="c-acc">cv</span>          download my CV
  <span class="c-acc">theme</span> <span class="c-dim">[name]</span>  list or set theme
  <span class="c-acc">matrix</span>      toggle matrix mode
  <span class="c-acc">neofetch</span>    system info
  <span class="c-acc">clear</span>       clear screen`,
    about: () => `Computer Scientist & Software Developer based in Nairobi, Kenya.
Founder of Nurish (AI wellness). I build AI products, automated
trading systems, and full-stack web applications.`,
    projects: () => `<span class="c-acc">Projects:</span>
  • Nurish — AI wellness app (founder & lead dev)
  • AI Financial Expert Advisors (MQL5/Python)
  • Custom Trading Indicators (Pine Script / MT5)
  • MCP Trading Integrations (TradingView + MetaTrader)
  • Corporate websites (full-stack)
  • Open source: tradingview-mcp, synx_mt5_mcp, shennina`,
    skills: () => `<span class="c-acc">Skills:</span>
  AI/ML: LLM integration, agents, MCP, prompt engineering
  Languages: Python, TypeScript, JavaScript, MQL5, Pine Script, SQL
  Fintech: algorithmic indicators, TradingView, MetaTrader 5, EAs, backtesting
  Web: front-end, back-end, responsive UI/UX, relational DBs, deployment`,
    experience: () => `<span class="c-acc">Experience:</span>
  2025–2026  Founder & Lead Developer — Nurish
  2022–2026  Algorithmic Trading Developer — Fin. Trading Systems
  2021–2026  Full-Stack Web Developer — Client Projects
  2019–2024  Project Manager`,
    education: () => `Computer Science`,
    contact: () => `<span class="c-acc">Contact:</span>
  email  libertyjames200@gmail.com
  phone  +254 790 689 052
  github github.com/ghost-p-l`,
    whoami: () => "liberty",
    date: () => new Date().toString(),
    echo: (args) => esc(args.join(" ")),
    cv: () => { window.location.href = "assets/Liberty_James_CV.pdf"; return "Downloading CV…"; },
    theme: (args) => {
      if (!args.length) return "Themes: " + THEMES.map((t) => t.id).join(", ");
      if (THEMES.some((t) => t.id === args[0])) { applyTheme(args[0]); return "Theme → " + args[0]; }
      return "Unknown theme. Try: " + THEMES.map((t) => t.id).join(", ");
    },
    matrix: () => { toggleMatrix(); return "Matrix mode toggled. (type 'matrix' again or press Esc)"; },
    neofetch: () => `<span class="c-acc">        liberty@ghost-p-l</span>
       -------------------
       OS: Web (Blender-grade curiosity)
       Host: Nairobi, Kenya
       Role: Computer Scientist / AI Developer
       Stack: Python · TypeScript · MQL5 · LLMs · MCP
       Projects: Nurish · Trading EAs · MCP servers
       Uptime: building since 2021`,
    sudo: () => "Nice try. You don't have root here. 😉",
    ls: () => "about  projects  skills  experience  education  contact  cv",
    clear: () => { termBody.innerHTML = ""; return null; },
  };

  function runCommand(raw) {
    const line = raw.trim();
    if (!line) return;
    termWrite(`<span class="c-cmd">➜ ~ ${esc(line)}</span>`);
    cmdHistory.push(line); histIdx = cmdHistory.length;
    const [cmd, ...args] = line.split(/\s+/);
    const fn = COMMANDS[cmd.toLowerCase()];
    if (fn) { const out = fn(args); if (out) termWrite(out); }
    else termWrite(`<span class="c-err">command not found: ${esc(cmd)}</span> — type 'help'`);
  }

  function openTerminal() {
    closeAll();
    termOverlay.hidden = false;
    if (!termBody.dataset.init) { termWrite(BANNER); termBody.dataset.init = "1"; }
    setTimeout(() => termInput.focus(), 30);
  }
  termForm?.addEventListener("submit", (e) => { e.preventDefault(); runCommand(termInput.value); termInput.value = ""; });
  termInput?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") { e.preventDefault(); if (histIdx > 0) { histIdx--; termInput.value = cmdHistory[histIdx]; } }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (histIdx < cmdHistory.length - 1) { histIdx++; termInput.value = cmdHistory[histIdx]; } else { histIdx = cmdHistory.length; termInput.value = ""; } }
  });
  $("#closeTerminal")?.addEventListener("click", () => (termOverlay.hidden = true));
  $("#openTerminal")?.addEventListener("click", openTerminal);
  $("#hintBtn")?.addEventListener("click", openTerminal);

  /* ----------------------------------------------------------------- HELP */
  const helpOverlay = $("#helpOverlay");
  $("#openHelp")?.addEventListener("click", () => toggleOverlay(helpOverlay));

  /* ------------------------------------------------------------- OVERLAY IO */
  function toggleOverlay(el) {
    if (!el) return;
    const willOpen = el.hidden;
    closeOverlaysExcept(el);
    el.hidden = !willOpen;
    document.body.style.overflow = willOpen ? "hidden" : "";
  }
  function closeOverlaysExcept(keep) {
    [palette, termOverlay, helpOverlay].forEach((o) => { if (o && o !== keep) o.hidden = true; });
  }
  function closeAll() {
    [palette, termOverlay, helpOverlay].forEach((o) => { if (o) o.hidden = true; });
    document.body.style.overflow = "";
  }
  [palette, termOverlay, helpOverlay].forEach((o) => {
    o?.addEventListener("click", (e) => { if (e.target === o) closeAll(); });
  });

  /* --------------------------------------------------------------- MATRIX */
  const matrix = $("#matrix");
  let mRAF = null, mCtx = null, mCols = [], mRunning = false;
  function matrixOn() { return mRunning; }
  function toggleMatrix() {
    if (!matrix) return;
    mRunning = !mRunning;
    matrix.classList.toggle("on", mRunning);
    if (mRunning) { startMatrix(); } else { stopMatrix(); }
  }
  function startMatrix() {
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFXYZ<>/\\[]{}=+*";
    matrix.width = innerWidth; matrix.height = innerHeight;
    mCtx = matrix.getContext("2d");
    const size = 16, cols = Math.floor(matrix.width / size);
    mCols = new Array(cols).fill(1).map(() => Math.random() * -50);
    let last = 0;
    (function draw(now) {
      if (!mRunning) return;
      mRAF = requestAnimationFrame(draw);
      if (now - last < 55) return;
      last = now;
      mCtx.fillStyle = "rgba(0,0,0,0.08)";
      mCtx.fillRect(0, 0, matrix.width, matrix.height);
      mCtx.fillStyle = "#39ff88";
      mCtx.font = size + "px monospace";
      for (let i = 0; i < mCols.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        mCtx.fillText(ch, i * size, mCols[i] * size);
        if (mCols[i] * size > matrix.height && Math.random() > 0.975) mCols[i] = 0;
        mCols[i]++;
      }
    })(0);
  }
  function stopMatrix() { mRunning = false; cancelAnimationFrame(mRAF); if (mCtx) mCtx.clearRect(0, 0, matrix.width, matrix.height); }

  /* --------------------------------------------------------------- CURSOR */
  const cursor = $("#cursor"), cursorDot = $("#cursorDot");
  if (cursor && !REDUCED && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; cursorDot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`; });
    (function loop() { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", (e) => { if (e.target.closest("a, button, [data-cursor], input")) cursor.classList.add("grow"); });
    document.addEventListener("mouseout", (e) => { if (e.target.closest("a, button, [data-cursor], input")) cursor.classList.remove("grow"); });
  }

  /* ----------------------------------------------------------- MAGNETIC B */
  if (!REDUCED) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ------------------------------------------------------- BUTTONS WIRING */
  $("#copyEmail")?.addEventListener("click", () => { navigator.clipboard?.writeText("libertyjames200@gmail.com"); showToast("Email copied"); });
  $("#copyPhone")?.addEventListener("click", () => { navigator.clipboard?.writeText("+254 790 689 052"); showToast("Phone copied"); });

  /* ------------------------------------------------------------- KEYBOARD */
  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kbuf = [];
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea";

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") { e.preventDefault(); cycleTheme(); return; }
    if (e.key === "Escape") { if (typeof stopMatrix === "function" && matrixOn()) stopMatrix(); closeAll(); return; }
    if (typing) return;

    if (e.key === "?") { e.preventDefault(); toggleOverlay(helpOverlay); return; }
    if (e.key === "`") { e.preventDefault(); toggleOverlay(termOverlay); if (!termOverlay.hidden) setTimeout(() => termInput.focus(), 30); return; }

    kbuf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    if (kbuf.length > konami.length) kbuf.shift();
    if (kbuf.join("|") === konami.join("|")) { kbuf = []; toggleMatrix(); }
  });

  /* open terminal when user types > in hero hint area is decorative */

  /* ----------------------------------------------------------------- BOOT */
  const boot = $("#boot"), bootBar = $("#bootBar"), bootLog = $("#bootLog");
  function runBoot() {
    if (!boot) return;
    if (REDUCED) { boot.classList.add("done"); return; }
    const steps = ["init portfolio", "load modules", "connect github", "ready"];
    let i = 0;
    const advance = () => {
      if (i < steps.length) {
        bootLog.textContent = "› " + steps[i];
        bootBar.style.width = ((i + 1) / steps.length * 100) + "%";
        i++;
        setTimeout(advance, 200);
      } else {
        setTimeout(() => boot.classList.add("done"), 200);
      }
    };
    advance();
  }
  window.addEventListener("load", runBoot);
  setTimeout(() => boot?.classList.add("done"), 2600); // safety

  /* ---------------------------------------------------------------- YEAR */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* expose a couple of helpers for debugging */
  window.LJ = { applyTheme, openPalette, openTerminal, toggleMatrix, stopMatrix, cycleTheme };
})();
