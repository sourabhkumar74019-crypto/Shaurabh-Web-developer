/* Site logic. You normally never need to edit this file. All your details live in config.js */
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
      <div class="thumb${d.live === false ? "" : " live"}" style="background:${d.c}">${d.live === false
        ? (d.img ? `<img src="${esc(d.img)}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode('${esc(d.icon)}'))">` : esc(d.icon))
        : `<div class="dev"><div class="dbar"><i></i><i></i><i></i><span>${esc(d.url.replace("https://",""))}</span></div><div class="screen">${d.img ? `<img src="${esc(d.img)}" alt="" loading="lazy">` : ""}<iframe data-src="${esc(d.url)}" title="${esc(d.name)} live preview" tabindex="-1" sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer"></iframe></div></div>`}<a class="cover" href="${esc(d.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(d.name)} live demo"></a></div>
      <div class="body"><span class="tag">${esc(d.cat)}</span><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p>
      <a class="go" href="${esc(d.url)}" target="_blank" rel="noopener">View live demo →</a></div>
    </article>`).join("");
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest(".fbtn"); if(!b) return;
    $$(".fbtn").forEach(x => x.classList.toggle("on", x === b));
    $$("#workGrid .card").forEach(c => c.classList.toggle("hide", b.dataset.c !== "All" && c.dataset.cat !== b.dataset.c));
  });
}


/* ---------- live previews: real websites inside a phone / laptop frame ---------- */
let VIEW = matchMedia("(min-width:900px)").matches ? "desktop" : "mobile";
const DEV = { mobile:{w:390,h:720}, desktop:{w:1280,h:800} };
function fitThumb(t){
  const f = $("iframe", t), sc = $(".screen", t); if(!f) return;
  const tw = t.clientWidth; if(!tw) return;
  const d = DEV[VIEW], mob = VIEW === "mobile";
  const sw = mob ? Math.min(210, tw - 60) : Math.min(tw - 44, 560);   // visible screen width in px
  const k = sw / d.w, sh = d.h * k;
  t.classList.toggle("v-mobile", mob); t.classList.toggle("v-desktop", !mob);
  $(".dev", t).style.width = (sw + (mob ? 12 : 2)) + "px"; sc.style.width = sw + "px"; sc.style.height = sh + "px";
  f.style.width = d.w + "px"; f.style.height = d.h + "px"; f.style.transform = `scale(${k})`;
  t.style.height = Math.round(sh + (mob ? 56 : 80)) + "px";
}
function livePreviews(){
  const all = () => $$(".thumb.live");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(!e.isIntersecting) return;
    const f = $("iframe", e.target);
    if(f && !f.src){ f.src = f.dataset.src; f.addEventListener("load", () => f.classList.add("ready")); }
    io.unobserve(e.target);
  }), {rootMargin:"300px"});
  const refit = () => all().forEach(fitThumb);
  all().forEach(t => io.observe(t));
  refit(); addEventListener("resize", refit); addEventListener("load", refit);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  if("ResizeObserver" in window){
    const widths = new WeakMap();
    const ro = new ResizeObserver(es => es.forEach(e => {
      const w = e.target.clientWidth;
      if(widths.get(e.target) !== w){ widths.set(e.target, w); fitThumb(e.target); }
    }));
    all().forEach(t => ro.observe(t));
  }
  const tg = $("#viewToggle");
  const mark = () => $$("button", tg).forEach(b => b.classList.toggle("on", b.dataset.v === VIEW));
  tg.addEventListener("click", e => { const b = e.target.closest("button"); if(!b) return; VIEW = b.dataset.v; mark(); refit(); });
  $("#filters").addEventListener("click", () => setTimeout(refit, 30));
  mark();
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

bind(); marquee(); demos(); livePreviews(); typing(); ui(); reveal(); contact();
