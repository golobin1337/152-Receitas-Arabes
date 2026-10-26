// Links de checkout — cole aqui as URLs da sua plataforma (Kiwify, Hotmart, Eduzz etc.)
const CHECKOUT = {
  basico: "#",
  premium: "#"
};
document.querySelectorAll("[data-checkout]").forEach(a => {
  const url = CHECKOUT[a.dataset.checkout];
  if (url && url !== "#") a.href = url;
});

// Mostra o botão fixo no celular só depois que o Plano Básico (último card) saiu da tela por cima
const sticky = document.getElementById("stickyCta");
const lastPlan = document.querySelector("#planos .plan:last-child");
new IntersectionObserver(([e]) => {
  sticky.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0);
}).observe(lastPlan);
