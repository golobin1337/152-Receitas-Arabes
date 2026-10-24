// Links de checkout — cole aqui as URLs da sua plataforma (Kiwify, Hotmart, Eduzz etc.)
const CHECKOUT = {
  basico: "#",
  premium: "#"
};
document.querySelectorAll("[data-checkout]").forEach(a => {
  const url = CHECKOUT[a.dataset.checkout];
  if (url && url !== "#") a.href = url;
});

// Mostra o botão fixo no celular depois do topo e esconde na área de planos
const sticky = document.getElementById("stickyCta");
const hero = document.querySelector(".hero");
const plans = document.getElementById("planos");
let pastHero = false, onPlans = false;
const update = () => sticky.classList.toggle("show", pastHero && !onPlans);
new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; update(); }).observe(hero);
new IntersectionObserver(([e]) => { onPlans = e.isIntersecting; update(); }, { threshold: 0.15 }).observe(plans);
