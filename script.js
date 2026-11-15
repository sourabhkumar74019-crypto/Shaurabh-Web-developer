/* =====================================================
   EDIT THIS PART ONLY
   Empty ("") fields hide themselves automatically.
   ===================================================== */
const CONFIG = {
  name: "Shaurabh Kumar",
  phone: "+91 83768 91847",
  whatsapp: "918376891847",       // country code + number, no + or spaces
  email: "",                      // e.g. "you@gmail.com"
  upi: "",                        // e.g. "name@upi"
  paylink: "",                    // PayPal.me / Wise link for international clients
  instagram: "https://www.instagram.com/shaurabh6833",
  x: "https://x.com/BAZYOUTUBER1",
  linkedin: "https://www.linkedin.com/in/shaurabh-k-66411a273",
  p1: "$99", p2: "$299+", p3: "$1000+",
  commission: "25%",
  heroWords: ["more customers", "more bookings", "more enquiries", "a professional look"],
  services: ["Hotels", "Clinics", "Salons", "Coaching Centres", "Cafes", "Gyms", "Real Estate", "E-commerce"],
  /* img: add a screenshot path like "assets/demos/hotel.jpg" to show it instead of the emoji */
  demos: [
    {icon:"🩺", cat:"Healthcare",  name:"DocCare Clinic",    desc:"Doctor profiles, appointment booking and services.",     url:"https://doccare-clinic.vercel.app",               img:"assets/demos/doccare.jpg", c:"#f8dcc4"},
    {icon:"🏨", cat:"Hospitality", name:"StayHaven Hotel",   desc:"Rooms, offers, price calculator and WhatsApp booking.",  url:"https://stayhaven-hotel.vercel.app",              img:"assets/demos/stayhaven.jpg", c:"#f4dda7"},
    {icon:"💇", cat:"Beauty",      name:"GlowUp Salon",      desc:"Services, pricing, gallery and booking.",                url:"https://glowup-salon-seven.vercel.app",           img:"assets/demos/glowup.jpg", c:"#f6cfd0"},
    {icon:"🎓", cat:"Education",   name:"EduPrime Coaching", desc:"Courses, batches, results and enquiry form.",            url:"https://eduprime-coaching.vercel.app",            img:"assets/demos/eduprime.jpg", c:"#d9e4c8"},
    {icon:"🏠", cat:"Real estate", name:"LuxEstate Portal",  desc:"Property listings, filters and enquiry.",                url:"https://luxestate-property-portal.vercel.app",    img:"assets/demos/luxestate.jpg", c:"#d5dfe6"},
    {icon:"☕", cat:"Food",        name:"Bake & Brew Cafe",  desc:"Menu, specials and table reservations.",                 url:"https://bake-and-brew-cafe.vercel.app",           img:"assets/demos/bakebrew.jpg", c:"#ead5c1"},
    {icon:"💪", cat:"Fitness",     name:"FitPulse Gym",      desc:"Plans, trainers, class timings and joining form.",       url:"https://fitpulse-gym-fitness-portal.vercel.app",  img:"assets/demos/fitpulse.jpg", c:"#f1d3b8"}
  ]
};
/* ===================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const wa = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

function toast(m){
  const t = $("#toast"); t.textContent = m; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200);
}

/* ---------- fill from CONFIG ---------- */
function bind(){
  $$("[data-bind]").forEach(e => e.textContent = CONFIG[e.dataset.bind] || "");
  $$("[data-hide-empty]").forEach(e => { if(!CONFIG[e.dataset.hideEmpty]) e.hidden = true; });
  $$("[data-link]").forEach(e => { const v = CONFIG[e.dataset.link]; v ? e.href = v : e.hidden = true; });
  $$("[data-wa]").forEach(e => {
    e.href = wa(e.dataset.wa || "Hi Shaurabh! I saw your website and want to discuss a project.");
    e.target = "_blank"; e.rel = "noopener";
  });
  $$("[data-tel]").forEach(e => e.href = "tel:" + CONFIG.phone.replace(/[^\d+]/g, ""));
  $("#yr").textContent = new Date().getFullYear();
  $("#demoCount").dataset.count = CONFIG.demos.length;
}

/* ---------- marquee ---------- */
function marquee(){
  const html = CONFIG.services.map(s => `<span>${esc(s)}</span>`).join("");
  $("#track").innerHTML = html + html + html + html;
}

/* ---------- demos + filters ---------- */
function demos(){
  const cats = ["All", ...new Set(CONFIG.demos.map(d => d.cat))];
  $("#filters").innerHTML = cats.map((c, i) => `<button class="fbtn${i ? "" : " on"}" data-c="${esc(c)}" type="button">${esc(c)}</button>`).join("");
  $("#workGrid").innerHTML = CONFIG.demos.map(d => `
    <article class="card rv" data-cat="${esc(d.cat)}">
      <div class="thumb" style="background:${d.c}">${d.img ? `<img src="${esc(d.img)}" alt="${esc(d.name)} preview" loading="lazy">` : esc(d.icon)}</div>
      <div class="body"><span class="tag">${esc(d.cat)}</span><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p>
      <a class="go" href="${esc(d.url)}" target="_blank" rel="noopener">View live demo →</a></div>
    </article>`).join("");
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest(".fbtn"); if(!b) return;
    $$(".fbtn").forEach(x => x.classList.toggle("on", x === b));
    $$("#workGrid .card").forEach(c => c.classList.toggle("hide", b.dataset.c !== "All" && c.dataset.cat !== b.dataset.c));
  });
}

/* ---------- typing headline ---------- */
function typing(){
  const el = $("#typed"), words = CONFIG.heroWords;
  if(reduce){ el.textContent = words[0]; return; }
  let wi = 0, ci = 0, del = false;
  (function step(){
    const w = words[wi];
    el.textContent = w.slice(0, ci) || " ";
    if(!del && ci === w.length){ del = true; return setTimeout(step, 1500); }
    if(del && ci === 0){ del = false; wi = (wi + 1) % words.length; }
    ci += del ? -1 : 1;
    setTimeout(step, del ? 35 : 75);
  })();
}

/* ---------- UI: menu, scroll, top button, scrollspy ---------- */
function ui(){
  const menu = $("#menu"), burger = $("#burger");
  burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
  $$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

  const bar = $("#bar"), hd = $("#hd"), top = $("#toTop");
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + "%";
    hd.classList.toggle("scrolled", h.scrollTop > 10);
    top.hidden = h.scrollTop < 600;
  };
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
  top.onclick = () => scrollTo({top:0, behavior: reduce ? "auto" : "smooth"});

  const links = $$("#menu a"), map = new Map();
  links.forEach(a => { const s = $(a.getAttribute("href")); if(s) map.set(s, a); });
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting) links.forEach(a => a.classList.toggle("active", a === map.get(e.target)));
  }), {rootMargin:"-45% 0px -50% 0px"});
  map.forEach((_, s) => spy.observe(s));
}

/* ---------- reveal + counters ---------- */
function reveal(){
  const count = el => {
    const n = +el.dataset.count, suf = el.dataset.suffix || "";
    if(reduce || !n){ el.textContent = n + suf; return; }
    let i = 0; const step = Math.max(1, Math.ceil(n / 30));
    const t = setInterval(() => { i = Math.min(n, i + step); el.textContent = i + suf; if(i >= n) clearInterval(t); }, 40);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
    const c = e.target.matches("[data-count]") ? e.target : $("[data-count]", e.target);
    if(c) count(c);
  }), {threshold:.15});
  $$(".rv").forEach(e => io.observe(e));
}

/* ---------- contact: copy UPI + WhatsApp form ---------- */
function contact(){
  $("#copyUpi").onclick = () => {
    if(navigator.clipboard) navigator.clipboard.writeText(CONFIG.upi).then(() => toast("UPI ID copied"), () => toast(CONFIG.upi));
    else toast(CONFIG.upi);
  };
  $("#cf").onsubmit = e => {
    e.preventDefault();
    const note = $("#fm").value.trim();
    const m = `Hi Shaurabh! I'm ${$("#fn").value.trim()}.\nBusiness: ${$("#fb").value.trim()}\nPlan: ${$("#fp").value}` + (note ? `\nDetails: ${note}` : "");
    window.open(wa(m), "_blank", "noopener");
    toast("Opening WhatsApp...");
  };
}

bind(); marquee(); demos(); typing(); ui(); reveal(); contact();
