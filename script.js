const fighterGrid = document.getElementById("fighterGrid");

function fighterCard(f) {
  const image = f.image
    ? `<img src="${f.image}" alt="${f.name} — Hopefield MMA"
         style="object-position:${f.image_position || "center center"}; --fighter-scale:${f.image_scale || 1};">`
    : `<div class="no-photo" aria-label="Photo to be added">${f.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div>`;

  const chips = [
    f.weight_class ? `<span class="meta-chip">${f.weight_class}</span>` : "",
    f.mma_record ? `<span class="meta-chip">Record: ${f.mma_record}</span>` : ""
  ].join("");

  const social = f.instagram_url
    ? `<a class="fighter-social" href="${f.instagram_url}" target="_blank" rel="noopener">Instagram ↗</a>`
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

const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

menuBtn?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#mainNav a").forEach(a => {
  a.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const style = document.createElement("style");
style.textContent = `
.no-photo{width:100%;height:100%;display:grid;place-items:center;font:700 48px Oswald,Arial;background:linear-gradient(135deg,#201b14,#111113);color:#6f5834}
`;
document.head.appendChild(style);

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const reply = document.getElementById("reply").value.trim();
  const msg = document.getElementById("message").value.trim();

  if (!name || !reply || !msg) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  const subject = encodeURIComponent(`Hopefield MMA enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nPhone / Email: ${reply}\n\n${msg}`);
  window.location.href = `mailto:erasmusj468@gmail.com?subject=${subject}&body=${body}`;
  formStatus.textContent = "Opening your email app…";
});


// Coach training details — injected so the coach card remains easy to update.
(function addCoachTrainingDetails() {
  const coachInfo = document.querySelector('.coach-info');
  if (!coachInfo || coachInfo.querySelector('.coach-specialties')) return;

  const intro = coachInfo.querySelector('p');
  if (intro) {
    intro.textContent = 'Coach at Hopefield MMA, working across striking and grappling in private and group sessions.';
  }

  const specialties = document.createElement('div');
  specialties.className = 'coach-specialties';
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

  // Styling lives here so this patch only needs script.js.
  const coachStyle = document.createElement('style');
  coachStyle.textContent = `
    .coach-specialties{display:grid;gap:10px;margin-top:20px}
    .coach-specialty{padding:13px 15px;background:#0b0b0d;border:1px solid #2b2926;border-left:3px solid var(--gold,#bf8a38)}
    .coach-specialty span{display:block;color:var(--gold2,#e0b766);font-size:9px;font-weight:800;letter-spacing:.16em;margin-bottom:3px}
    .coach-specialty strong{display:block;color:#eee9df;font-family:Oswald,Impact,sans-serif;text-transform:uppercase;font-size:17px;line-height:1.25}
    .coach-specialty p{margin-top:4px;font-size:12px;color:#8f8a82;line-height:1.45}
    @media(max-width:620px){.coach-specialty{padding:12px}.coach-specialty strong{font-size:16px}}
  `;
  document.head.appendChild(coachStyle);
})();


// Training membership price — shown beside the Saturday session times.
(function addTrainingPrice() {
  const cards = document.querySelectorAll('.training-card');
  if (!cards.length) return;

  cards.forEach(card => {
    if (card.querySelector('.training-price')) return;
    const time = card.querySelector('.time');
    if (!time) return;

    const price = document.createElement('div');
    price.className = 'training-price';
    price.innerHTML = `<span>MONTHLY MEMBERSHIP</span><strong>R200 p/m</strong>`;
    time.insertAdjacentElement('afterend', price);
  });

  const priceStyle = document.createElement('style');
  priceStyle.textContent = `
    .training-price{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:10px 0 16px;padding:11px 13px;border:1px solid #3b3428;background:#0b0b0d}
    .training-price span{font-size:9px;font-weight:800;letter-spacing:.14em;color:#8f8a82}
    .training-price strong{font-family:Oswald,Impact,sans-serif;font-size:20px;letter-spacing:.04em;color:var(--gold2,#e0b766);text-transform:uppercase}
    @media(max-width:620px){.training-price{align-items:flex-start;flex-direction:column;gap:4px}.training-price strong{font-size:19px}}
  `;
  document.head.appendChild(priceStyle);
})();
