document.documentElement.classList.add("js");

const page = document.body.dataset.page;
document.querySelector(`[data-page-link="${page}"]`)?.classList.add("active");

document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

const header = document.getElementById("siteHeader");
const progress = document.getElementById("scrollProgress");
const backTop = document.getElementById("backTop");
function onScroll(){
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 12);
  backTop?.classList.toggle("show", y > 650);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if(progress) progress.style.width = `${max > 0 ? (y/max)*100 : 0}%`;
}
window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
backTop?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

const menuBtn=document.getElementById("menuBtn"), mainNav=document.getElementById("mainNav");
function closeMenu(){mainNav?.classList.remove("open");menuBtn?.setAttribute("aria-expanded","false")}
menuBtn?.addEventListener("click",()=>{const open=mainNav?.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(Boolean(open)))});
document.addEventListener("click",e=>{if(mainNav?.classList.contains("open")&&!mainNav.contains(e.target)&&!menuBtn?.contains(e.target))closeMenu()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});

const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.08}) : null;
document.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"));

function fighterCard(f){
  const chips=[f.weight_class?`<span class="chip">${f.weight_class}</span>`:"",f.mma_record?`<span class="chip">Record: ${f.mma_record}</span>`:""].join("");
  const social=f.instagram_url?`<a class="social-link" href="${f.instagram_url}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>`:"";
  return `<article class="fighter-card reveal" data-category="${f.category}">
    <div class="fighter-image"><img loading="lazy" decoding="async" src="${f.image}" alt="${f.short_name} — Hopefield MMA" style="--fighter-position:${f.image_position};--fighter-scale:${f.image_scale}"><span class="fighter-badge">${f.status}</span></div>
    <div class="fighter-body"><h3>${f.name}</h3><div class="chips">${chips}</div><p>${f.bio}</p><div class="achievement">${f.achievement}</div>${social}</div>
  </article>`
}

const fighterGrid=document.getElementById("fighterGrid");
if(fighterGrid && Array.isArray(FIGHTERS)){fighterGrid.innerHTML=FIGHTERS.map(fighterCard).join("");fighterGrid.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"))}
const featured=document.getElementById("featuredFighters");
if(featured && Array.isArray(FIGHTERS)){featured.innerHTML=FIGHTERS.filter(f=>f.category==="competitor").slice(0,3).map(fighterCard).join("");featured.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"))}

document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const target=btn.dataset.filter;document.querySelectorAll("#fighterGrid .fighter-card").forEach(card=>card.hidden=target!=="all"&&card.dataset.category!==target);
}));

const galleryGrid=document.getElementById("galleryGrid");
if(galleryGrid && Array.isArray(GALLERY)) galleryGrid.innerHTML=GALLERY.map((g,i)=>`<figure class="gallery-item reveal" tabindex="0" role="button" data-index="${i}" aria-label="Open gallery image"><img loading="lazy" decoding="async" src="${g.src}" alt="${g.alt}"></figure>`).join("");
if(galleryGrid) galleryGrid.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"));

let lightboxIndex=0; const lb=document.getElementById("lightbox"), lbImg=document.getElementById("lightboxImg");
function showLightbox(i){if(!lb||!lbImg||!GALLERY?.length)return;lightboxIndex=(i+GALLERY.length)%GALLERY.length;lbImg.src=GALLERY[lightboxIndex].src;lbImg.alt=GALLERY[lightboxIndex].alt;lb.classList.add("open");document.body.style.overflow="hidden"}
function closeLightbox(){lb?.classList.remove("open");document.body.style.overflow=""}
galleryGrid?.addEventListener("click",e=>{const item=e.target.closest(".gallery-item");if(item)showLightbox(Number(item.dataset.index))});
galleryGrid?.addEventListener("keydown",e=>{const item=e.target.closest(".gallery-item");if(item&&(e.key==="Enter"||e.key===" ")){e.preventDefault();showLightbox(Number(item.dataset.index))}});
document.getElementById("lbClose")?.addEventListener("click",closeLightbox);document.getElementById("lbPrev")?.addEventListener("click",()=>showLightbox(lightboxIndex-1));document.getElementById("lbNext")?.addEventListener("click",()=>showLightbox(lightboxIndex+1));
document.addEventListener("keydown",e=>{if(!lb?.classList.contains("open"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")showLightbox(lightboxIndex-1);if(e.key==="ArrowRight")showLightbox(lightboxIndex+1)});
lb?.addEventListener("click",e=>{if(e.target===lb)closeLightbox()});

const form=document.getElementById("contactForm");
form?.addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("name").value.trim(),reply=document.getElementById("reply").value.trim(),message=document.getElementById("message").value.trim();if(!name||!reply||!message)return;const subject=encodeURIComponent(`Hopefield MMA enquiry from ${name}`),body=encodeURIComponent(`Name: ${name}\nPhone / Email: ${reply}\n\n${message}`);window.location.href=`mailto:erasmusj468@gmail.com?subject=${subject}&body=${body}`});
