document.documentElement.classList.add("js");

const page = document.body.dataset.page;
document.querySelector(`[data-page-link="${page}"]`)?.classList.add("active");

document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

const fightersData = (typeof FIGHTERS !== "undefined" && Array.isArray(FIGHTERS)) ? FIGHTERS : [];
const galleryData = (typeof GALLERY !== "undefined" && Array.isArray(GALLERY)) ? GALLERY : [];


// Mobile page navigation: always visible on phones so visitors can move between pages quickly.
const mobileNav=document.createElement("nav");
mobileNav.className="mobile-page-nav";
mobileNav.setAttribute("aria-label","Mobile page navigation");
mobileNav.innerHTML=`
  <a data-mobile-page="home" href="index.html"><span>Home</span></a>
  <a data-mobile-page="team" href="team.html"><span>Team</span></a>
  <a data-mobile-page="achievements" href="achievements.html"><span>Awards</span></a>
  <a data-mobile-page="training" href="training.html"><span>Training</span></a>
  <a data-mobile-page="gallery" href="gallery.html"><span>Gallery</span></a>
  <a data-mobile-page="contact" href="contact.html"><span>Contact</span></a>`;
document.body.appendChild(mobileNav);
mobileNav.querySelector(`[data-mobile-page="${page}"]`)?.classList.add("active");

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
if(fighterGrid && fightersData.length){fighterGrid.innerHTML=fightersData.map(fighterCard).join("");fighterGrid.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"))}
const featured=document.getElementById("featuredFighters");
if(featured && fightersData.length){featured.innerHTML=fightersData.filter(f=>f.category==="competitor").slice(0,3).map(fighterCard).join("");featured.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"))}

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
if(galleryGrid && galleryData.length) galleryGrid.innerHTML=galleryData.map((g,i)=>`<figure class="gallery-item reveal" tabindex="0" role="button" data-index="${i}" aria-label="Open gallery image"><img loading="lazy" decoding="async" src="${g.src}" alt="${g.alt}"></figure>`).join("");
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
function showLightbox(i){if(!lb||!lbImg||!galleryData.length)return;lightboxIndex=(i+galleryData.length)%galleryData.length;lbImg.src=galleryData[lightboxIndex].src;lbImg.alt=galleryData[lightboxIndex].alt;setLightboxNavigation(true);lb.classList.add("open");document.body.style.overflow="hidden"}
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


// Keep cards visible even if one image path fails during a deployment.
document.addEventListener("error", e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;
  img.classList.add("photo-load-error");
  const wrap = img.closest(".fighter-image,.gallery-item,.coach-photo");
  if (wrap) wrap.classList.add("has-image-error");
}, true);
