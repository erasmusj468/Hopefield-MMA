// Hopefield MMA visual polish layer. Loaded after the existing stylesheet so current colours/content remain intact.
if (!document.querySelector('link[data-hopefield-polish]')) {
  const polish = document.createElement("link");
  polish.rel = "stylesheet";
  polish.href = "polish.css";
  polish.dataset.hopefieldPolish = "true";
  document.head.appendChild(polish);
}

document.documentElement.classList.add("js");

const page = document.body.dataset.page;
document.querySelector(`[data-page-link="${page}"]`)?.classList.add("active");

document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());


// Mobile page navigation: always visible on phones so visitors can move between pages quickly.
const mobileNav=document.createElement("nav");
mobileNav.className="mobile-page-nav";
mobileNav.setAttribute("aria-label","Mobile page navigation");
mobileNav.innerHTML=`
  <a data-mobile-page="home" href="index.html" aria-label="Home">
    <svg class="mobile-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m3 10 9-7 9 7"></path><path d="M5 9v12h14V9"></path><path d="M9 21v-7h6v7"></path></svg>
    <span>Home</span>
  </a>
  <a data-mobile-page="team" href="team.html" aria-label="Team">
    <svg class="mobile-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    <span>Team</span>
  </a>
  <a data-mobile-page="achievements" href="achievements.html" aria-label="Awards">
    <svg class="mobile-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path><path d="M7 6H4v2a4 4 0 0 0 4 4"></path><path d="M17 6h3v2a4 4 0 0 1-4 4"></path></svg>
    <span>Awards</span>
  </a>
  <a data-mobile-page="training" href="training.html" aria-label="Training">
    <svg class="mobile-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9v6"></path><path d="M18 9v6"></path><path d="M3 10v4"></path><path d="M21 10v4"></path><path d="M6 12h12"></path><path d="M3 11h3"></path><path d="M18 11h3"></path></svg>
    <span>Training</span>
  </a>
  <a data-mobile-page="gallery" href="gallery.html" aria-label="Gallery">
    <svg class="mobile-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="8.5" cy="9" r="1.5"></circle><path d="m21 15-5-5L5 20"></path></svg>
    <span>Gallery</span>
  </a>
  <a data-mobile-page="contact" href="contact.html" aria-label="Contact">
    <svg class="mobile-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.1-4.8A8.5 8.5 0 1 1 21 11.5Z"></path></svg>
    <span>Contact</span>
  </a>
`;
document.body.appendChild(mobileNav);
const activeMobileLink = mobileNav.querySelector('[data-mobile-page="' + page + '"]');
activeMobileLink?.classList.add("active");
activeMobileLink?.setAttribute("aria-current", "page");
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
    <div class="fighter-image" role="button" tabindex="0" aria-label="View ${f.short_name} photo full screen"><img loading="lazy" decoding="async" src="${f.image}" alt="${f.short_name} — Hopefield MMA" style="--fighter-position:${f.image_position};--fighter-scale:${f.image_scale}"><span class="fighter-badge">${f.status}</span><span class="image-hint">Tap photo</span></div>
    <div class="fighter-body"><h3>${f.name}</h3><div class="chips">${chips}</div><div class="fighter-extra"><p>${f.bio}</p><div class="achievement">${f.achievement}</div>${social}</div><button class="fighter-more" type="button" aria-expanded="false">Details</button></div>
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


// Compact mobile fighter cards can be expanded without forcing long scrolling.
document.addEventListener("click",e=>{
  const btn=e.target.closest(".fighter-more");
  if(!btn)return;
  const card=btn.closest(".fighter-card");
  const expanded=card.classList.toggle("expanded");
  btn.setAttribute("aria-expanded",String(expanded));
  btn.textContent=expanded?"Hide details":"Details";
});

const galleryGrid=document.getElementById("galleryGrid");
if(galleryGrid && Array.isArray(GALLERY)) galleryGrid.innerHTML=GALLERY.map((g,i)=>`<figure class="gallery-item reveal" tabindex="0" role="button" data-index="${i}" aria-label="Open gallery image"><img loading="lazy" decoding="async" src="${g.src}" alt="${g.alt}"></figure>`).join("");
if(galleryGrid) galleryGrid.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"));

let lightboxIndex=0;
function ensureLightbox(){
  let viewer=document.getElementById("lightbox");
  if(viewer)return viewer;
  viewer=document.createElement("div");
  viewer.className="lightbox";viewer.id="lightbox";viewer.setAttribute("role","dialog");viewer.setAttribute("aria-modal","true");viewer.setAttribute("aria-label","Image viewer");
  viewer.innerHTML='<button class="lb-close" id="lbClose" aria-label="Close">×</button><button class="lb-prev" id="lbPrev" aria-label="Previous image">‹</button><img id="lightboxImg" alt=""><button class="lb-next" id="lbNext" aria-label="Next image">›</button>';
  document.body.appendChild(viewer);
  return viewer;
}
const lb=ensureLightbox(), lbImg=document.getElementById("lightboxImg"), lbPrev=document.getElementById("lbPrev"), lbNext=document.getElementById("lbNext");
function setLightboxNavigation(show){lbPrev.hidden=!show;lbNext.hidden=!show}
function showLightbox(i){if(!lb||!lbImg||!Array.isArray(GALLERY)||!GALLERY.length)return;lightboxIndex=(i+GALLERY.length)%GALLERY.length;lbImg.src=GALLERY[lightboxIndex].src;lbImg.alt=GALLERY[lightboxIndex].alt;setLightboxNavigation(true);lb.classList.add("open");document.body.style.overflow="hidden"}
function showSingleImage(src,alt){if(!lb||!lbImg)return;lbImg.src=src;lbImg.alt=alt||"Hopefield MMA image";setLightboxNavigation(false);lb.classList.add("open");document.body.style.overflow="hidden"}
function closeLightbox(){lb?.classList.remove("open");document.body.style.overflow=""}
galleryGrid?.addEventListener("click",e=>{const item=e.target.closest(".gallery-item");if(item)showLightbox(Number(item.dataset.index))});
galleryGrid?.addEventListener("keydown",e=>{const item=e.target.closest(".gallery-item");if(item&&(e.key==="Enter"||e.key===" ")){e.preventDefault();showLightbox(Number(item.dataset.index))}});
document.addEventListener("click",e=>{
  const imageWrap=e.target.closest(".fighter-image,.coach-photo,.medal-card");
  if(!imageWrap || imageWrap.closest("#galleryGrid"))return;
  const img=imageWrap.querySelector("img");if(img)showSingleImage(img.currentSrc||img.src,img.alt);
});
document.addEventListener("keydown",e=>{
  const imageWrap=e.target.closest?.(".fighter-image,.coach-photo,.medal-card");
  if(imageWrap&&(e.key==="Enter"||e.key===" ")){const img=imageWrap.querySelector("img");if(img){e.preventDefault();showSingleImage(img.currentSrc||img.src,img.alt)}}
  if(!lb?.classList.contains("open"))return;
  if(e.key==="Escape")closeLightbox();
  if(!lbPrev.hidden&&e.key==="ArrowLeft")showLightbox(lightboxIndex-1);
  if(!lbNext.hidden&&e.key==="ArrowRight")showLightbox(lightboxIndex+1);
});
document.getElementById("lbClose")?.addEventListener("click",closeLightbox);
lbPrev?.addEventListener("click",()=>showLightbox(lightboxIndex-1));
lbNext?.addEventListener("click",()=>showLightbox(lightboxIndex+1));
lb?.addEventListener("click",e=>{if(e.target===lb)closeLightbox()});

// Simple swipe support in the gallery lightbox on touch devices.
let touchStartX=0;
lb?.addEventListener("touchstart",e=>{touchStartX=e.changedTouches[0]?.screenX||0},{passive:true});
lb?.addEventListener("touchend",e=>{if(lbPrev.hidden)return;const dx=(e.changedTouches[0]?.screenX||0)-touchStartX;if(Math.abs(dx)>55)showLightbox(lightboxIndex+(dx<0?1:-1))},{passive:true});

const form=document.getElementById("contactForm");
form?.addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("name").value.trim(),reply=document.getElementById("reply").value.trim(),message=document.getElementById("message").value.trim();if(!name||!reply||!message)return;const subject=encodeURIComponent(`Hopefield MMA enquiry from ${name}`),body=encodeURIComponent(`Name: ${name}\nPhone / Email: ${reply}\n\n${message}`);window.location.href=`mailto:erasmusj468@gmail.com?subject=${subject}&body=${body}`});
