const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contactInfo").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !contact || !message) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  const subject = encodeURIComponent(`Hopefield MMA enquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nPhone/email: ${contact}\n\nMessage:\n${message}`
  );

  // Replace the placeholder email below with Hopefield MMA's real email
  // before launch.
  window.location.href = `mailto:erasmusj468@gmail.com?subject=${subject}&body=${body}`;
  formStatus.textContent = "Opening your email app...";
});
