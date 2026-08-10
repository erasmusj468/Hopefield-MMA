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

if (fighterGrid && Array.isArray(FIGHTERS)) {
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
