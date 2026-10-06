/* =====================================================
   ✏️  EDIT THIS SECTION WITH YOUR OWN INFO!
   Every page reads from here, so you only change it once.
   ===================================================== */
const CAMPAIGN = {
  name: "Cody H.",
  firstName: "Cody",
  initials: "CH",
  position: "Mr. Schreiber's 4th Period Government Class President",
  slogan: "Fitting America together piece by piece",
  logo: "images/logo-circle.png",
  puzzlePieces: "images/puzzle-pieces.png", // the pieces-only image, used in the banner
  school: "Heritage High School",
  mascot: "Eagles",
  schoolLogo: "images/heritage-logo.png",
  grade: "11th grade",
  email: "votecody.campaign@example.com",
  instagram: "@votecody",
  tiktok: "@votecody",
  hashtag: "#PieceByPiece",
  // Put your photo in the "images" folder and write its file name here,
  // e.g. "images/me.jpg". Leave it "" to show a placeholder.
  photo: "images/cody-cutout.png",
};

/* ===================================================== */

// The site's top folder, worked out from where script.js lives,
// so links and images work from the home page AND from sub-pages like /about/
const ROOT = new URL(".", document.currentScript.src).href;
const url = path => new URL(path, ROOT).href;

// Campaign logo, always shown as a circle — reused on every page
function logoSVG(size = 42) {
  return `<img class="logo-circle" src="${url(CAMPAIGN.logo)}" width="${size}" height="${size}" alt="Campaign logo: puzzle pieces fitting together">`;
}

// Each page is its own folder: /about/, /platform/, ...
const PAGES = [
  ["", "Home"],
  ["about/", "About"],
  ["platform/", "Platform"],
  ["promises/", "Promises"],
  ["merch/", "Merch"],
  ["media/", "Media"],
  ["involved/", "Get Involved"],
  ["contact/", "Contact"],
];

function buildHeader() {
  const here = location.href.split("#")[0].replace(/index\.html$/, "");
  const links = PAGES.map(([path, label]) =>
    `<li><a href="${url(path)}" class="${url(path) === here ? "active" : ""}">${label}</a></li>`
  ).join("");

  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <nav class="container nav">
        <a class="brand" href="${url("")}">${logoSVG()} ${CAMPAIGN.name}</a>
        <button class="nav-toggle" aria-label="Open menu">☰</button>
        <ul class="nav-links">${links}</ul>
      </nav>`;
    const toggle = header.querySelector(".nav-toggle");
    const list = header.querySelector(".nav-links");
    toggle.addEventListener("click", () => list.classList.toggle("open"));
  }

  // Scrolling slogan banner
  const banner = document.getElementById("slogan-banner");
  if (banner) {
    // Puzzle pieces between each phrase (falls back to a ★ if the image is missing)
    const piece = `<img class="puzzle-sep" src="${url(CAMPAIGN.puzzlePieces)}" alt="" onerror="this.outerHTML='★'">`;
    const phrase = `${CAMPAIGN.slogan} · Vote ${CAMPAIGN.name}`;
    const items = Array(6).fill(`<span>${phrase}</span>${piece}`).join("");
    banner.className = "slogan-banner";
    banner.innerHTML = `<div class="slogan-track">${items}${items}</div>`;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <img class="school-logo" src="${url(CAMPAIGN.schoolLogo)}" alt="${CAMPAIGN.school} ${CAMPAIGN.mascot} logo">
        <div class="social">
          <a href="${url("instantgram/")}">📸 Instantgram ${CAMPAIGN.instagram}</a>
          <a href="${url("toktik/")}">🎵 TokTik ${CAMPAIGN.tiktok}</a>
          <a href="mailto:${CAMPAIGN.email}">✉️ Email</a>
        </div>
        <p>${CAMPAIGN.hashtag} · ${CAMPAIGN.name} for ${CAMPAIGN.position} · ${CAMPAIGN.school}</p>
        <p style="opacity:.6">A student campaign project. Go ${CAMPAIGN.mascot}! 🦅</p>
      </div>`;
  }
}

// Fill in any element like <span data-c="name"></span> with CAMPAIGN.name
function fillPlaceholders() {
  document.querySelectorAll("[data-c]").forEach(el => {
    const key = el.dataset.c;
    if (CAMPAIGN[key] !== undefined) el.textContent = CAMPAIGN[key];
  });
  document.querySelectorAll("[data-logo]").forEach(el => {
    el.innerHTML = logoSVG(el.dataset.logo || 120);
  });
  document.querySelectorAll("[data-photo]").forEach(el => {
    if (CAMPAIGN.photo) {
      const img = document.createElement("img");
      img.src = url(CAMPAIGN.photo);
      img.alt = `Photo of ${CAMPAIGN.name}`;
      el.replaceWith(img);
    }
  });
  document.querySelectorAll("[data-school-logo]").forEach(el => {
    el.src = url(CAMPAIGN.schoolLogo);
    el.alt = `${CAMPAIGN.school} ${CAMPAIGN.mascot} logo`;
  });
  document.querySelectorAll("[data-mail]").forEach(el => {
    el.href = `mailto:${CAMPAIGN.email}`;
    el.textContent = CAMPAIGN.email;
  });
  document.title = document.title.replace("{name}", CAMPAIGN.name);
}

// Forms: there is no server, so we save entries in the browser and show a thank-you
function setupForms() {
  document.querySelectorAll("form[data-store]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const key = form.dataset.store;
      const entry = Object.fromEntries(new FormData(form).entries());
      entry.interests = new FormData(form).getAll("interests");
      entry.time = new Date().toLocaleString();
      try {
        const all = JSON.parse(localStorage.getItem(key) || "[]");
        all.push(entry);
        localStorage.setItem(key, JSON.stringify(all));
      } catch (err) { /* storage unavailable — still show thanks */ }

      const msg = form.querySelector(".form-success");
      const who = entry.name ? entry.name.split(" ")[0] : "friend";
      msg.textContent = form.dataset.thanks.replace("{who}", who);
      msg.classList.add("show");
      form.reset();
      updateCounter();
    });
  });
}

function updateCounter() {
  const el = document.getElementById("team-count");
  if (!el) return;
  let n = 0;
  try { n = JSON.parse(localStorage.getItem("signups") || "[]").length; } catch (e) {}
  el.textContent = 47 + n; // starting number just for fun
}

// Promise filter buttons (All / Serious / Fun)
function setupFilters() {
  const buttons = document.querySelectorAll(".filter-row button");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const type = btn.dataset.filter;
    document.querySelectorAll("[data-type]").forEach(card => {
      card.style.display = type === "all" || card.dataset.type === type ? "" : "none";
    });
  }));
}

// Merch "I'd wear this!" vote buttons
function setupVotes() {
  document.querySelectorAll(".vote-btn").forEach(btn => {
    const id = "vote-" + btn.dataset.id;
    const base = Number(btn.dataset.base || 0);
    let voted = false;
    try { voted = localStorage.getItem(id) === "1"; } catch (e) {}
    const render = () => {
      btn.textContent = `${voted ? "❤️" : "🤍"} I'd wear this! (${base + (voted ? 1 : 0)})`;
      btn.classList.toggle("voted", voted);
    };
    btn.addEventListener("click", () => {
      voted = !voted;
      try { localStorage.setItem(id, voted ? "1" : "0"); } catch (e) {}
      render();
    });
    render();
  });
}

// Fade sections in as you scroll
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach(el => el.classList.add("visible"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

// When opened straight from your computer (file://), browsers don't open
// index.html inside a folder by themselves, so add it to every folder link.
function fixLocalLinks() {
  if (location.protocol !== "file:") return;
  document.querySelectorAll("a[href]").forEach(a => {
    const u = new URL(a.href);
    if (u.protocol === "file:" && u.pathname.endsWith("/")) {
      u.pathname += "index.html";
      a.href = u.href;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  fixLocalLinks();
  fillPlaceholders();
  setupForms();
  updateCounter();
  setupFilters();
  setupVotes();
  setupReveal();
});
