/* Hopefield MMA — Professional interaction layer
   This file improves behavior only. It does not change fighter data,
   records, coach information, session times, membership pricing, or page copy.
*/

const fighterGrid = document.getElementById("fighterGrid");

function fighterCard(f) {
  const image = f.image
    ? `<img src="${f.image}" alt="${f.name} — Hopefield MMA"
         style="object-position:${f.image_position || "center center"}; --fighter-scale:${f.image_scale || 1};"
         loading="lazy" decoding="async">`
    : `<div class="no-photo" aria-label="Photo to be added">${f.name.split(" ").map(x => x[0]).join("").slice(0, 2)}</div>`;

  const chips = [
    f.weight_class ? `<span class="meta-chip">${f.weight_class}</span>` : "",
    f.mma_record ? `<span class="meta-chip">Record: ${f.mma_record}</span>` : ""
  ].join("");

  const social = f.instagram_url
    ? `<a class="fighter-social" href="${f.instagram_url}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>`
    : "";

  return `
    <article class="fighter-card reveal">
      <div class="fighter-image-wrap">
        ${image}
        <span class="fighter-status">${f.status}</span>
      </div>
      <div class="fighter-body">
        <h3>${f.name}</h3>
        <div class="fighter-meta">${chips || '<span class="meta-chip">PROFILE DETAILS UPDATABLE</span>'}</div>
        <p>${f.bio}</p>
        <div class="fighter-achievement">${f.achievement}</div>
        ${social}
      </div>
    </article>
  `;
}

if (fighterGrid && typeof FIGHTERS !== "undefined" && Array.isArray(FIGHTERS)) {
  fighterGrid.innerHTML = FIGHTERS.map(fighterCard).join("");
}

/* ---------- Mobile navigation ---------- */
const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  if (!mainNav || !menuBtn) return;
  mainNav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", () => {
  const open = mainNav?.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(Boolean(open)));
});

document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", closeMenu));

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeMenu();
});

document.addEventListener("click", e => {
  if (!mainNav?.classList.contains("open")) return;
  if (!mainNav.contains(e.target) && !menuBtn?.contains(e.target)) closeMenu();
});

/* ---------- Fixed-header-aware smooth scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const headerHeight = document.querySelector(".topbar")?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ---------- Reveal animation ---------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px" });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

/* ---------- Coach details ---------- */
(function addCoachTrainingDetails() {
  const coachInfo = document.querySelector(".coach-info");
  if (!coachInfo || coachInfo.querySelector(".coach-specialties")) return;

  const intro = coachInfo.querySelector("p");
  if (intro) {
    intro.textContent = "Coach at Hopefield MMA, working across striking and grappling in private and group sessions.";
  }

  const specialties = document.createElement("div");
  specialties.className = "coach-specialties";
  specialties.innerHTML = `
    <div class="coach-specialty">
      <span>STRIKING</span>
      <strong>Boxing + Muay Thai</strong>
      <p>A mixed striking approach combining boxing and Muay Thai.</p>
    </div>
    <div class="coach-specialty">
      <span>GRAPPLING</span>
      <strong>Judo + Jiu-Jitsu + Wrestling</strong>
      <p>A mixed grappling approach combining judo, jiu-jitsu and wrestling.</p>
    </div>
    <div class="coach-specialty">
      <span>SESSIONS</span>
      <strong>Private + Group</strong>
      <p>One-on-one private sessions and group training sessions.</p>
    </div>`;
  coachInfo.appendChild(specialties);
})();

/* ---------- Contact form ---------- */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name")?.value.trim();
  const reply = document.getElementById("reply")?.value.trim();
  const msg = document.getElementById("message")?.value.trim();

  if (!name || !reply || !msg) {
    if (formStatus) formStatus.textContent = "Please complete all fields.";
    return;
  }

  const subject = encodeURIComponent(`Hopefield MMA enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nPhone / Email: ${reply}\n\n${msg}`);
  if (formStatus) formStatus.textContent = "Opening your email app…";
  window.location.href = `mailto:erasmusj468@gmail.com?subject=${subject}&body=${body}`;
});

/* ---------- Professional enhancement styles ---------- */
const enhancementStyle = document.createElement("style");
enhancementStyle.id = "professional-js-styles";
enhancementStyle.textContent = `
  .no-photo{width:100%;height:100%;display:grid;place-items:center;font:700 48px Oswald,Arial;background:linear-gradient(135deg,#201b14,#111113);color:#6f5834}

  .coach-specialties{display:grid;gap:10px;margin-top:20px}
  .coach-specialty{padding:13px 15px;background:#0b0b0d;border:1px solid #2b2926;border-left:3px solid var(--gold,#bf8a38)}
  .coach-specialty span{display:block;color:var(--gold2,#e0b766);font-size:9px;font-weight:800;letter-spacing:.16em;margin-bottom:3px}
  .coach-specialty strong{display:block;color:#eee9df;font-family:Oswald,Impact,sans-serif;text-transform:uppercase;font-size:17px;line-height:1.25}
  .coach-specialty p{margin-top:4px;font-size:12px;color:#8f8a82;line-height:1.45}

  #scrollProgress{position:fixed;top:0;left:0;width:0;height:2px;background:linear-gradient(90deg,var(--gold,#bf8a38),var(--gold2,#e0b766));z-index:99999;pointer-events:none;box-shadow:0 0 10px rgba(224,183,102,.35)}
  .topbar.scrolled{box-shadow:0 10px 30px rgba(0,0,0,.32);border-bottom-color:rgba(224,183,102,.12)}

  #backToTop{position:fixed;right:22px;bottom:22px;width:46px;height:46px;border:1px solid rgba(224,183,102,.48);background:rgba(10,10,11,.88);backdrop-filter:blur(10px);color:var(--gold2,#e0b766);font-size:20px;display:grid;place-items:center;z-index:950;cursor:pointer;opacity:0;visibility:hidden;transform:translateY(12px);transition:.25s ease}
  #backToTop.show{opacity:1;visibility:visible;transform:none}
  #backToTop:hover{background:var(--gold2,#e0b766);color:#090909;transform:translateY(-2px)}

  #mainNav a.active:not(.nav-contact){color:var(--gold2,#e0b766)}
  #mainNav a.active:not(.nav-contact)::after{content:"";display:block;height:1px;background:var(--gold2,#e0b766);margin-top:4px;opacity:.7}

  .gallery figure{cursor:zoom-in}
  .gallery figure:focus-visible{outline:2px solid var(--gold2,#e0b766);outline-offset:3px}

  .mma-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.94);z-index:10000;display:grid;place-items:center;padding:70px 70px 40px;opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease}
  .mma-lightbox.open{opacity:1;visibility:visible}
  .mma-lightbox img{max-width:min(1200px,94vw);max-height:84vh;object-fit:contain;box-shadow:0 30px 90px rgba(0,0,0,.65)}
  .mma-lightbox-close,.mma-lightbox-prev,.mma-lightbox-next{position:absolute;border:1px solid rgba(224,183,102,.35);background:rgba(10,10,10,.72);color:#fff;cursor:pointer;font:600 22px/1 Inter,sans-serif;display:grid;place-items:center;transition:.2s}
  .mma-lightbox-close:hover,.mma-lightbox-prev:hover,.mma-lightbox-next:hover{background:var(--gold2,#e0b766);color:#080808}
  .mma-lightbox-close{top:22px;right:22px;width:44px;height:44px}
  .mma-lightbox-prev,.mma-lightbox-next{top:50%;transform:translateY(-50%);width:48px;height:60px}
  .mma-lightbox-prev{left:18px}.mma-lightbox-next{right:18px}
  .mma-lightbox-count{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);font-size:10px;letter-spacing:.16em;color:#aaa39a;text-transform:uppercase}

  img.mma-image-loaded{animation:mmaImageFade .35s ease both}
  @keyframes mmaImageFade{from{opacity:.72}to{opacity:1}}

  @media(max-width:620px){
    .coach-specialty{padding:12px}.coach-specialty strong{font-size:16px}
    #backToTop{right:14px;bottom:14px;width:42px;height:42px}
    .mma-lightbox{padding:65px 12px 48px}
    .mma-lightbox-prev,.mma-lightbox-next{top:auto;bottom:12px;width:42px;height:42px;transform:none}
    .mma-lightbox-prev{left:12px}.mma-lightbox-next{right:12px}
  }

  @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}
`;
document.head.appendChild(enhancementStyle);

/* ---------- Scroll progress + header state ---------- */
const progress = document.createElement("div");
progress.id = "scrollProgress";
document.body.appendChild(progress);

const topbar = document.querySelector(".topbar");
const backToTop = document.createElement("button");
backToTop.id = "backToTop";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.textContent = "↑";
document.body.appendChild(backToTop);

function updateScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
  progress.style.width = `${percent}%`;
  topbar?.classList.toggle("scrolled", window.scrollY > 20);
  backToTop.classList.toggle("show", window.scrollY > 650);
}

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScrollUI();
    scrollTicking = false;
  });
}, { passive: true });

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
updateScrollUI();

/* ---------- Active navigation section ---------- */
if ("IntersectionObserver" in window) {
  const navLinks = [...document.querySelectorAll('#mainNav a[href^="#"]')];
  const sectionMap = new Map(navLinks.map(link => [link.getAttribute("href")?.slice(1), link]));
  const watchedSections = [...sectionMap.keys()].map(id => document.getElementById(id)).filter(Boolean);

  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach(link => link.classList.remove("active"));
    const current = sectionMap.get(visible.target.id);
    current?.classList.add("active");
  }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, .05, .2, .5] });

  watchedSections.forEach(section => navObserver.observe(section));
}

/* ---------- Image performance ---------- */
document.querySelectorAll("main img").forEach((img, index) => {
  if (!img.closest(".hero-logo-card") && index > 1) img.loading = "lazy";
  img.decoding = "async";
  if (img.complete) img.classList.add("mma-image-loaded");
  else img.addEventListener("load", () => img.classList.add("mma-image-loaded"), { once: true });
});

/* ---------- Gallery lightbox ---------- */
(function setupGalleryLightbox() {
  const galleryImages = [...document.querySelectorAll(".gallery img")];
  if (!galleryImages.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "mma-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Gallery image viewer");
  lightbox.innerHTML = `
    <button class="mma-lightbox-close" type="button" aria-label="Close image viewer">×</button>
    <button class="mma-lightbox-prev" type="button" aria-label="Previous image">‹</button>
    <img alt="">
    <button class="mma-lightbox-next" type="button" aria-label="Next image">›</button>
    <div class="mma-lightbox-count"></div>`;
  document.body.appendChild(lightbox);

  const display = lightbox.querySelector("img");
  const count = lightbox.querySelector(".mma-lightbox-count");
  const closeBtn = lightbox.querySelector(".mma-lightbox-close");
  const prevBtn = lightbox.querySelector(".mma-lightbox-prev");
  const nextBtn = lightbox.querySelector(".mma-lightbox-next");
  let current = 0;
  let previouslyFocused = null;

  function show(index) {
    current = (index + galleryImages.length) % galleryImages.length;
    const source = galleryImages[current];
    display.src = source.currentSrc || source.src;
    display.alt = source.alt || "Hopefield MMA gallery image";
    count.textContent = `${current + 1} / ${galleryImages.length}`;
  }

  function open(index) {
    previouslyFocused = document.activeElement;
    show(index);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    previouslyFocused?.focus?.();
  }

  galleryImages.forEach((img, i) => {
    const figure = img.closest("figure") || img;
    figure.setAttribute("tabindex", "0");
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `${img.alt || "Gallery image"}. Open full size.`);
    figure.addEventListener("click", () => open(i));
    figure.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
