/* ============================================================
   Liberty James — Portfolio interactions
   Vanilla JS. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  const GITHUB_USER = "ghost-p-l";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Typed role text ---------- */
  const roles = [
    "Computer Scientist",
    "AI & Full-Stack Developer",
    "Founder @ Nurish",
    "Fintech / Trading Systems Builder"
  ];
  (function type() {
    const el = $("#typed");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = roles[0];
      return;
    }
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      el.textContent = word.slice(0, i);
      if (!deleting && i < word.length) { i++; setTimeout(tick, 65); }
      else if (!deleting && i === word.length) { deleting = true; setTimeout(tick, 1500); }
      else if (deleting && i > 0) { i--; setTimeout(tick, 32); }
      else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 320); }
    };
    tick();
  })();

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const saved = localStorage.getItem("theme");
  const initial = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  root.setAttribute("data-theme", initial);
  if (themeBtn) {
    themeBtn.querySelector(".theme-toggle__icon").textContent = initial === "dark" ? "🌙" : "☀️";
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      themeBtn.querySelector(".theme-toggle__icon").textContent = next === "dark" ? "🌙" : "☀️";
    });
  }

  /* ---------- Mobile nav ---------- */
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", links).forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Nav progress + active section ---------- */
  const progress = $("#navProgress");
  const sections = $$("main section[id]");
  const navMap = {};
  $$("#navLinks a").forEach((a) => { navMap[a.getAttribute("href").slice(1)] = a; });

  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";

    let current = "";
    const y = h.scrollTop + 120;
    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
    Object.values(navMap).forEach((a) => a.classList.remove("active"));
    if (navMap[current]) navMap[current].classList.add("active");
  };
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Copy phone ---------- */
  const copyBtn = $("#copyPhone");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const phone = copyBtn.dataset.phone;
      const orig = copyBtn.textContent;
      try {
        await navigator.clipboard.writeText(phone);
        copyBtn.textContent = "Copied ✓";
      } catch {
        copyBtn.textContent = phone;
      }
      setTimeout(() => { copyBtn.textContent = orig; }, 1600);
    });
  }

  /* ---------- Year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- GitHub repos ---------- */
  const ghGrid = $("#ghGrid");
  const LANG_EMOJI = { Python: "🐍", TypeScript: "🟦", JavaScript: "🟨", HTML: "🌐", "C++": "⚙️", C: "⚙️" };

  function repoCard(repo) {
    const el = document.createElement("article");
    el.className = "card card--project card--repo reveal";
    const lang = repo.language ? `${LANG_EMOJI[repo.language] || "📄"} ${repo.language}` : "";
    el.innerHTML = `
      <div class="card__top">
        <span class="card__icon">${repo.fork ? "🍴" : "📦"}</span>
        <span class="card__tag">${repo.fork ? "Fork" : "GitHub"}</span>
      </div>
      <h3 class="card__title">${repo.name}</h3>
      <p class="card__desc">${repo.description || "No description provided."}</p>
      <ul class="card__stack">
        ${lang ? `<li>${lang}</li>` : ""}
        <li>★ ${repo.stargazers_count}</li>
      </ul>
      <div class="card__links">
        <a href="${repo.html_url}" target="_blank" rel="noopener">Code ↗</a>
      </div>`;
    // Make the whole card clickable
    el.querySelector(".card__title").innerHTML =
      `<a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>`;
    return el;
  }

  async function loadRepos() {
    if (!ghGrid) return;
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error("rate limited");
      let repos = await res.json();
      if (!Array.isArray(repos)) throw new Error("bad payload");
      const pinned = ["tradingview-mcp", "synx_mt5_mcp", "shennina"];
      repos = repos.filter((r) => !r.fork);
      repos.sort((a, b) => {
        const pa = pinned.indexOf(a.name), pb = pinned.indexOf(b.name);
        if (pa !== -1 || pb !== -1) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      ghGrid.innerHTML = "";
      repos.slice(0, 6).forEach((r) => ghGrid.appendChild(repoCard(r)));
      inkReveal();
    } catch {
      // Fallback: static links to known repos
      const fallback = [
        { name: "tradingview-mcp", html_url: "https://github.com/ghost-p-l/tradingview-mcp", description: "AI-assisted TradingView chart analysis — connect AI agents to TradingView Desktop.", language: "TypeScript", stargazers_count: 0 },
        { name: "synx_mt5_mcp", html_url: "https://github.com/ghost-p-l/synx_mt5_mcp", description: "SYNX — production-grade MCP server for MetaTrader 5.", language: "Python", stargazers_count: 0 },
        { name: "shennina", html_url: "https://github.com/ghost-p-l/shennina", description: "Automating host exploitation with AI.", language: "Python", stargazers_count: 0 }
      ];
      ghGrid.innerHTML = "";
      fallback.forEach((r) => ghGrid.appendChild(repoCard(r)));
      inkReveal();
    }
  }

  function inkReveal() {
    const els = $$("#ghGrid .reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((e) => io.observe(e));
  }

  loadRepos();
})();
