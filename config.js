/* =====================================================
   EDIT THIS FILE ONLY (config.js). Nothing else needs touching.
   Empty ("") fields hide themselves automatically.
   ===================================================== */
const CONFIG = {
  name: "Shaurabh Kumar",
  phone: "+91 83768 91847",
  whatsapp: "918376891847",       // country code + number, no + or spaces
  email: "",                      // e.g. "you@gmail.com"
  upi: "sourabh725890@ybl",        // your UPI ID
  upiName: "SHAURABH KUMAR",      // name shown in the UPI app
  paylink: "",                    // PayPal.me / Wise link for international clients
  instagram: "https://www.instagram.com/shaurabh6833",
  x: "https://x.com/BAZYOUTUBER1",
  linkedin: "https://www.linkedin.com/in/shaurabh-k-66411a273",
  /* ---------- PLANS: change a price, feature or commission here and it updates everywhere on the site ---------- */
  /* pop:true = "Most popular" badge. commission = what a sales partner earns on that plan. */
  plans: [
    { name:"Basic", price:"$99", unit:"one-time", commission:"15%", cta:"Choose Basic",
      for:"Ready-made one-page site",
      features:[
        "One-page HTML website (pick any demo above)",
        "Your name, logo, colours and photos",
        "WhatsApp enquiry button and form",
        "Mobile responsive",
        "Delivered in 2-3 days",
        "3 days of free fixes"
      ]},
    { name:"Standard", price:"$299", unit:"one-time", commission:"20%", pop:true, cta:"Choose Standard",
      for:"Multi-page business website",
      features:[
        "Everything in Basic",
        "HTML, CSS and JavaScript, up to 5 pages",
        "Custom layout, booking form or price calculator",
        "Google SEO and Search Console setup",
        "Domain and hosting setup",
        "Delivered in 5-7 days",
        "7 days of free edits"
      ]},
    { name:"Premium", price:"$1,000", unit:"one-time", commission:"25%", cta:"Choose Premium",
      for:"Website with backend and admin panel",
      features:[
        "Everything in Standard",
        "HTML, CSS, JavaScript plus a normal backend and database",
        "Admin panel to manage bookings, enquiries and content",
        "Email / WhatsApp notification on every new booking",
        "Delivered in 10-14 days",
        "30 days of free support"
      ]},
    { name:"Ultra", price:"$1,500+", unit:"starting", commission:"30%", cta:"Get a quote",
      for:"Fully custom business system",
      features:[
        "Everything in Premium",
        "Advanced backend built around your exact workflow",
        "Fully custom design and features: online payments, login, dashboards, integrations",
        "Anything extra you want, scoped and agreed before we start",
        "Priority support on WhatsApp",
        "90 days of free support"
      ]}
  ],
  commissionRange: "15-30%",
  heroWords: ["more customers", "more bookings", "more enquiries", "a professional look"],
  services: ["Hotels", "Clinics", "Salons", "Coaching Centres", "Cafes", "Gyms", "Real Estate", "E-commerce"],
  /* img: add a screenshot path like "demo-hotel.jpg" to show it instead of the emoji */
  demos: [
    {icon:"🩺", cat:"Healthcare",  name:"DocCare Clinic",    desc:"Doctor profiles, appointment booking and services.",     url:"https://doccare-clinic.vercel.app",               img:"demo-doccare.jpg", c:"#f8dcc4"},
    {icon:"🏨", cat:"Hospitality", name:"StayHaven Hotel",   desc:"Rooms, offers, price calculator and WhatsApp booking.",  url:"https://stayhaven-hotel.vercel.app",              img:"demo-stayhaven.jpg", c:"#f4dda7"},
    {icon:"💇", cat:"Beauty",      name:"GlowUp Salon",      desc:"Services, pricing, gallery and booking.",                url:"https://glowup-salon-seven.vercel.app",           img:"demo-glowup.jpg", c:"#f6cfd0"},
    {icon:"🎓", cat:"Education",   name:"EduPrime Coaching", desc:"Courses, batches, results and enquiry form.",            url:"https://eduprime-coaching.vercel.app",            img:"demo-eduprime.jpg", c:"#d9e4c8"},
    {icon:"🏠", cat:"Real estate", name:"LuxEstate Portal",  desc:"Property listings, filters and enquiry.",                url:"https://luxestate-property-portal.vercel.app",    img:"demo-luxestate.jpg", c:"#d5dfe6"},
    {icon:"☕", cat:"Food",        name:"Bake & Brew Cafe",  desc:"Menu, specials and table reservations.",                 url:"https://bake-and-brew-cafe.vercel.app",           img:"demo-bakebrew.jpg", c:"#ead5c1"},
    {icon:"💪", cat:"Fitness",     name:"FitPulse Gym",      desc:"Plans, trainers, class timings and joining form.",       url:"https://fitpulse-gym-fitness-portal.vercel.app",  img:"demo-fitpulse.jpg", c:"#f1d3b8"}
  ]
};
/* ===================================================== */
