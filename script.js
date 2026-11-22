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

/* ---------- pricing cards, form options and partner table, all built from CONFIG.plans ---------- */
function plans(){
  const P = CONFIG.plans;
  $("#planGrid").innerHTML = P.map(p => `
    <div class="card price rv${p.pop ? " pop" : ""}">
      ${p.pop ? '<span class="badge-pop">Most popular</span>' : ""}
      <h3>${esc(p.name)}</h3><p class="for">${esc(p.for)}</p>
      <div class="amt">${esc(p.price)} <small>${esc(p.unit)}</small></div>
      <ul>${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      <a class="btn ${p.pop ? "btn-p shine" : "btn-g"}" data-wa="${esc("Hi! I want the " + p.name + " plan (" + p.price + ").")}" href="#">${esc(p.cta)}</a>
    </div>`).join("");
  $("#fp").innerHTML = P.map(p => `<option>${esc(p.name + " (" + p.price + ")")}</option>`).join("") + "<option>Not sure yet</option>";
  $("#commTable").innerHTML = P.map(p => `<div><span>${esc(p.name)}</span><b>${esc(p.commission)}</b></div>`).join("");
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
  const pay = $("#payUpi"); if(pay && CONFIG.upi) pay.href = "upi://pay?pa=" + CONFIG.upi + "&pn=" + encodeURIComponent(CONFIG.upiName || CONFIG.name) + "&cu=INR";
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

/* ---------- live previews ---------- */
let VIEW = matchMedia("(min-width:900px)").matches ? "desktop" : "mobile";
const DEV = { mobile:{w:390,h:720}, desktop:{w:1280,h:800} };
function fitThumb(t){
  const f = $("iframe", t), sc = $(".screen", t); if(!f) return;
  const tw = t.clientWidth; if(!tw) return;
  const d = DEV[VIEW], mob = VIEW === "mobile";
  const sw = mob ? Math.min(210, tw - 60) : Math.min(tw - 44, 560);
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
    el.textContent = w.slice(0, ci) || "\u00a0";
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

/* ---------- AI Assistant Widget ---------- */
function localAssistantReply(q){
  const s = q.toLowerCase();
  if(s.includes("price") || s.includes("cost") || s.includes("plan") || s.includes("budget")){
    return `Plans start at ${CONFIG.plans[0].price} (Basic) up to ${CONFIG.plans[3].price} (Ultra). 50% advance to start and 50% on delivery.`;
  }
  if(s.includes("demo") || s.includes("sample") || s.includes("clinic") || s.includes("hotel") || s.includes("salon")){
    return `We have live demos for ${CONFIG.demos.map(d => d.name).slice(0, 4).join(", ")}, and more in the Live Demos section.`;
  }
  if(s.includes("partner") || s.includes("commission")){
    return `Partners earn ${CONFIG.commissionRange} commission depending on the plan closed.`;
  }
  return `I can help with plans, live demos, timelines (2-14 days), or connecting you directly with ${CONFIG.name} on WhatsApp.`;
}

function aiWidget(){
  const cfg = CONFIG.aiAssistant;
  if(!cfg || !cfg.enabled) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ai-btn";
  btn.setAttribute("aria-label", "Open AI Assistant");
  btn.innerHTML = `<span>🤖</span><span>Ask AI</span>`;

  const panel = document.createElement("div");
  panel.className = "ai-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="ai-hd">
      <span>${esc(cfg.botName || "AI Assistant")}</span>
      <button type="button" class="ai-close" aria-label="Close chat">✕</button>
    </div>
    <div class="ai-msgs" id="aiMsgs"></div>
    <form class="ai-form" id="aiForm">
      <input id="aiInput" type="text" placeholder="Ask about plans, demos, or WhatsApp..." required autocomplete="off">
      <button type="submit">Send</button>
    </form>
  `;

  document.body.append(btn, panel);
  const msgs = $("#aiMsgs", panel);
  const input = $("#aiInput", panel);

  const appendMsg = (text, who, showWa = false) => {
    const div = document.createElement("div");
    div.className = `ai-msg ${who}`;
    div.innerHTML = esc(text).replace(/\n/g, "<br>");
    if(showWa){
      const a = document.createElement("a");
      a.className = "ai-wa-link";
      a.target = "_blank";
      a.rel = "noopener";
      a.href = wa(`Hi ${CONFIG.name}, I chatted with your AI assistant regarding: ${text}`);
      a.textContent = "Chat on WhatsApp →";
      div.appendChild(a);
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  };

  appendMsg(cfg.greeting, "bot", true);

  btn.onclick = () => {
    panel.hidden = !panel.hidden;
    if(!panel.hidden) input.focus();
  };
  $(".ai-close", panel).onclick = () => { panel.hidden = true; };

  $("#aiForm", panel).onsubmit = async e => {
    e.preventDefault();
    const q = input.value.trim();
    if(!q) return;
    input.value = "";
    appendMsg(q, "user");

    const thinking = document.createElement("div");
    thinking.className = "ai-msg bot";
    thinking.textContent = "Thinking...";
    msgs.appendChild(thinking);
    msgs.scrollTop = msgs.scrollHeight;

    let reply = "";
    try {
      const res = await fetch(cfg.endpoint || "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          context: {
            developer: CONFIG.name,
            phone: CONFIG.phone,
            plans: CONFIG.plans.map(p => ({ name: p.name, price: p.price, for: p.for })),
            demos: CONFIG.demos.map(d => ({ name: d.name, cat: d.cat }))
          }
        })
      });
      if(res.ok){
        const data = await res.json();
        reply = data.reply || "";
      }
    } catch (_) {}

    thinking.remove();
    appendMsg(reply || localAssistantReply(q), "bot", true);
  };
}

plans(); bind(); marquee(); demos(); livePreviews(); typing(); ui(); reveal(); contact(); aiWidget();
