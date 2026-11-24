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
const mainContent=document.querySelector("main");
if(mainContent&&!mainContent.id)mainContent.id="mainContent";
const skipLink=document.createElement("a");
skipLink.href="#mainContent";skipLink.className="skip-link";skipLink.textContent="Skip to main content";
document.body.insertBefore(skipLink,document.body.firstChild);
const footerMeta=document.querySelector(".footer-meta");
if(footerMeta&&!footerMeta.querySelector(".footer-legal")){
  const legalNav=document.createElement("nav");
  legalNav.className="footer-legal";legalNav.setAttribute("aria-label","Legal and accessibility information");
  legalNav.innerHTML='<a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="cookies.html">Cookies</a><a href="refunds.html">Refunds</a><a href="accessibility.html">Accessibility</a>';
  footerMeta.appendChild(legalNav);
}
const activeNavLink=document.querySelector(`[data-page-link="${page}"]`);
activeNavLink?.classList.add("active");
activeNavLink?.setAttribute("aria-current","page");

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
const prefersReducedMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
backTop?.addEventListener("click",()=>window.scrollTo({top:0,behavior:prefersReducedMotion?"auto":"smooth"}));

const menuBtn=document.getElementById("menuBtn"), mainNav=document.getElementById("mainNav");
menuBtn?.setAttribute("aria-controls","mainNav");
function closeMenu(){mainNav?.classList.remove("open");menuBtn?.setAttribute("aria-expanded","false");menuBtn?.setAttribute("aria-label","Open menu")}
menuBtn?.addEventListener("click",()=>{const open=mainNav?.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(Boolean(open)));menuBtn.setAttribute("aria-label",open?"Close menu":"Open menu")});
document.addEventListener("click",e=>{if(mainNav?.classList.contains("open")&&!mainNav.contains(e.target)&&!menuBtn?.contains(e.target))closeMenu()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});

const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.08}) : null;
document.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"));

function fighterCard(f){
  const chips=[f.weight_class?`<span class="chip">${f.weight_class}</span>`:"",f.mma_record?`<span class="chip">Record: ${f.mma_record}</span>`:""].join("");
  const social=f.instagram_url?`<a class="social-link" href="${f.instagram_url}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>`:"";
  return `<article class="fighter-card reveal" data-category="${f.category}">
    <div class="fighter-image" role="button" tabindex="0" aria-label="View ${f.short_name} photo full size"><img loading="lazy" decoding="async" src="${f.image}" alt="${f.short_name} — Hopefield MMA" style="--fighter-position:${f.image_position};--fighter-scale:${f.image_scale}"><span class="fighter-badge">${f.status}</span><span class="image-hint">Tap photo</span></div>
    <div class="fighter-body"><h3>${f.name}</h3><div class="chips">${chips}</div><div class="fighter-extra" id="fighter-details-${f.id}"><p>${f.bio}</p><div class="achievement">${f.achievement}</div>${social}</div><button class="fighter-more" type="button" aria-expanded="false" aria-controls="fighter-details-${f.id}">Show details</button></div>
  </article>`
}

const fighterGrid=document.getElementById("fighterGrid");
if(fighterGrid && Array.isArray(FIGHTERS)){fighterGrid.innerHTML=FIGHTERS.map(fighterCard).join("");fighterGrid.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"))}
const featured=document.getElementById("featuredFighters");
if(featured && Array.isArray(FIGHTERS)){featured.innerHTML=FIGHTERS.filter(f=>f.category==="competitor").slice(0,3).map(fighterCard).join("");featured.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"))}

document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.setAttribute("aria-pressed",String(btn.classList.contains("active")));
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-pressed","false")});
    btn.classList.add("active");btn.setAttribute("aria-pressed","true");
    const target=btn.dataset.filter;document.querySelectorAll("#fighterGrid .fighter-card").forEach(card=>card.hidden=target!=="all"&&card.dataset.category!==target);
  });
});


// Compact mobile fighter cards can be expanded without forcing long scrolling.
document.addEventListener("click",e=>{
  const btn=e.target.closest(".fighter-more");
  if(!btn)return;
  const card=btn.closest(".fighter-card");
  const expanded=card.classList.toggle("expanded");
  btn.setAttribute("aria-expanded",String(expanded));
  btn.textContent=expanded?"Hide details":"Show details";
});

document.querySelectorAll(".coach-photo,.medal-card").forEach(el=>{
  el.setAttribute("role","button");el.setAttribute("tabindex","0");
  const img=el.querySelector("img");if(!el.hasAttribute("aria-label"))el.setAttribute("aria-label",`View ${img?.alt||"photo"} full size`);
});
const galleryGrid=document.getElementById("galleryGrid");
if(galleryGrid && Array.isArray(GALLERY)) galleryGrid.innerHTML=GALLERY.map((g,i)=>`<figure class="gallery-item reveal" tabindex="0" role="button" data-index="${i}" aria-haspopup="dialog" aria-label="${g.alt}. Open full size"><img loading="lazy" decoding="async" src="${g.src}" alt="${g.alt}"></figure>`).join("");
if(galleryGrid) galleryGrid.querySelectorAll(".reveal").forEach(el=>observer?observer.observe(el):el.classList.add("visible"));

let lightboxIndex=0;
let lightboxOpener=null;
function ensureLightbox(){
  let viewer=document.getElementById("lightbox");
  if(viewer)return viewer;
  viewer=document.createElement("div");
  viewer.className="lightbox";viewer.id="lightbox";viewer.setAttribute("role","dialog");viewer.setAttribute("aria-modal","true");viewer.setAttribute("aria-label","Image viewer");
  viewer.innerHTML='<button class="lb-close" id="lbClose" aria-label="Close image viewer">×</button><button class="lb-prev" id="lbPrev" aria-label="Previous image">‹</button><img id="lightboxImg" alt=""><button class="lb-next" id="lbNext" aria-label="Next image">›</button>';
  document.body.appendChild(viewer);return viewer;
}
const lb=ensureLightbox(), lbImg=document.getElementById("lightboxImg"), lbPrev=document.getElementById("lbPrev"), lbNext=document.getElementById("lbNext");
function setLightboxNavigation(show){lbPrev.hidden=!show;lbNext.hidden=!show}
function openLightbox(opener){if(opener)lightboxOpener=opener;lb.classList.add("open");document.body.style.overflow="hidden";document.getElementById("lbClose")?.focus()}
function showLightbox(i,opener){
  if(!lb||!lbImg||!Array.isArray(GALLERY)||!GALLERY.length)return;
  lightboxIndex=(i+GALLERY.length)%GALLERY.length;lbImg.src=GALLERY[lightboxIndex].src;lbImg.alt=GALLERY[lightboxIndex].alt;
  setLightboxNavigation(true);openLightbox(opener);
}
function showSingleImage(src,alt,opener){if(!lb||!lbImg)return;lbImg.src=src;lbImg.alt=alt||"Hopefield MMA image";setLightboxNavigation(false);openLightbox(opener)}
function closeLightbox(){
  if(!lb)return;lb.classList.remove("open");document.body.style.overflow="";
  const opener=lightboxOpener;lightboxOpener=null;opener?.focus();
}
galleryGrid?.addEventListener("click",e=>{const item=e.target.closest(".gallery-item");if(item)showLightbox(Number(item.dataset.index),item)});
galleryGrid?.addEventListener("keydown",e=>{const item=e.target.closest(".gallery-item");if(item&&(e.key==="Enter"||e.key===" ")){e.preventDefault();showLightbox(Number(item.dataset.index),item)}});
document.addEventListener("click",e=>{
  const imageWrap=e.target.closest(".fighter-image,.coach-photo,.medal-card");
  if(!imageWrap||imageWrap.closest("#galleryGrid"))return;
  const img=imageWrap.querySelector("img");if(img)showSingleImage(img.currentSrc||img.src,img.alt,imageWrap);
});
document.addEventListener("keydown",e=>{
  const imageWrap=e.target.closest?.(".fighter-image,.coach-photo,.medal-card");
  if(imageWrap&&(e.key==="Enter"||e.key===" ")){const img=imageWrap.querySelector("img");if(img){e.preventDefault();showSingleImage(img.currentSrc||img.src,img.alt,imageWrap)}}
  if(!lb?.classList.contains("open"))return;
  if(e.key==="Escape"){e.preventDefault();closeLightbox();return}
  if(e.key==="Tab"){
    const focusable=[...lb.querySelectorAll("button:not([hidden]):not([disabled])")];
    const first=focusable[0],last=focusable[focusable.length-1];if(!first)return;
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    return;
  }
  if(!lbPrev.hidden&&e.key==="ArrowLeft")showLightbox(lightboxIndex-1);
  if(!lbNext.hidden&&e.key==="ArrowRight")showLightbox(lightboxIndex+1);
});
document.getElementById("lbClose")?.addEventListener("click",closeLightbox);
lbPrev?.addEventListener("click",()=>showLightbox(lightboxIndex-1));
lbNext?.addEventListener("click",()=>showLightbox(lightboxIndex+1));
lb?.addEventListener("click",e=>{if(e.target===lb)closeLightbox()});
let touchStartX=0;
lb?.addEventListener("touchstart",e=>{touchStartX=e.changedTouches[0]?.screenX||0},{passive:true});
lb?.addEventListener("touchend",e=>{if(lbPrev.hidden)return;const dx=(e.changedTouches[0]?.screenX||0)-touchStartX;if(Math.abs(dx)>55)showLightbox(lightboxIndex+(dx<0?1:-1))},{passive:true});

const form=document.getElementById("contactForm");
form?.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const reply=document.getElementById("reply").value.trim();
  const message=document.getElementById("message").value.trim();
  const privacyConsent=document.getElementById("privacyConsent")?.checked;
  if(!name||!reply||!message||!privacyConsent)return;
  const subject=encodeURIComponent(`Hopefield MMA enquiry from ${name}`);
  const body=encodeURIComponent(`Name: ${name}\\nPhone / Email: ${reply}\\n\\n${message}`);
  window.location.href=`mailto:erasmusj468@gmail.com?subject=${subject}&body=${body}`;
});


// Public reviews are stored in Neon Postgres. Email addresses never leave the server.
const reviewForm=document.getElementById("reviewForm");
const reviewList=document.getElementById("publishedReviews");
const reviewAverage=document.getElementById("reviewAverage");
const reviewAverageStars=document.getElementById("reviewAverageStars");
const reviewCount=document.getElementById("reviewCount");
const reviewNote=document.getElementById("reviewFormNote");
const reviewSubmit=document.getElementById("reviewSubmit");

function renderReviews(data){
  if(!reviewList)return;
  const summary=data?.summary||{count:0,average:0};
  const count=Number(summary.count)||0;
  const average=Number(summary.average)||0;
  if(reviewAverage)reviewAverage.textContent=count?average.toFixed(1):"—";
  if(reviewAverageStars){
    const rounded=Math.round(average);
    reviewAverageStars.textContent="★".repeat(rounded)+"☆".repeat(5-rounded);
    reviewAverageStars.setAttribute("aria-label",count?average.toFixed(1)+" out of 5 stars":"No ratings yet");
  }
  if(reviewCount)reviewCount.textContent=count+(count===1?" published review":" published reviews");
  reviewList.replaceChildren();
  if(!Array.isArray(data?.reviews)||!data.reviews.length){
    const empty=document.createElement("p");empty.className="reviews-empty";empty.textContent="No reviews yet. Be the first to share your experience.";reviewList.appendChild(empty);return;
  }
  data.reviews.forEach(item=>{
    const card=document.createElement("article");card.className="published-review";
    const header=document.createElement("div");header.className="published-review-header";
    const author=document.createElement("strong");author.textContent=item.name;
    const stars=document.createElement("span");stars.className="published-review-stars";stars.textContent="★".repeat(Number(item.rating))+"☆".repeat(5-Number(item.rating));stars.setAttribute("aria-label",item.rating+" out of 5 stars");
    const date=document.createElement("time");date.className="published-review-date";
    const parsed=new Date(item.created_at);date.dateTime=parsed.toISOString();date.textContent=parsed.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
    const content=document.createElement("p");content.textContent=item.review;
    header.append(author,stars);card.append(header,content,date);reviewList.appendChild(card);
  });
}
async function loadReviews(){
  if(!reviewList)return;
  try{
    const response=await fetch("/api/reviews",{headers:{"Accept":"application/json"}});
    if(!response.ok)throw new Error("Could not load reviews");
    renderReviews(await response.json());
  }catch(error){
    reviewList.replaceChildren();
    const message=document.createElement("p");message.className="reviews-empty";message.textContent="Reviews are temporarily unavailable. Please try again later.";reviewList.appendChild(message);
    if(reviewCount)reviewCount.textContent="Unable to load ratings";
  }
}
reviewForm?.addEventListener("submit",async e=>{
  e.preventDefault();
  const name=document.getElementById("reviewName").value.trim();
  const email=document.getElementById("reviewEmail").value.trim();
  const rating=Number(reviewForm.querySelector('input[name="rating"]:checked')?.value);
  const review=document.getElementById("reviewText").value.trim();
  const verificationConsent=document.getElementById("reviewConsent").checked;
  const agePermissionConfirmed=document.getElementById("reviewAgeConsent").checked;
  const website=document.getElementById("reviewWebsite").value;
  if(!name||!email||!rating||!review||!verificationConsent||!agePermissionConfirmed)return;
  if(reviewSubmit)reviewSubmit.disabled=true;
  if(reviewNote)reviewNote.textContent="Publishing your review…";
  try{
    const response=await fetch("/api/reviews",{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({name,email,rating,review,verificationConsent,agePermissionConfirmed,website})
    });
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||"Your review could not be published.");
    reviewForm.reset();
    if(reviewNote)reviewNote.textContent="Thanks! Your review has been published.";
    await loadReviews();
  }catch(error){
    if(reviewNote)reviewNote.textContent=error.message||"Something went wrong. Please try again.";
  }finally{
    if(reviewSubmit)reviewSubmit.disabled=false;
  }
});
loadReviews();
