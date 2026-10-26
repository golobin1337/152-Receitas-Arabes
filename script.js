// Links de checkout — cole aqui as URLs da sua plataforma (Kiwify, Hotmart, Eduzz etc.)
const CHECKOUT = {
  basico: "https://pay.wiapy.com/ZxKjuw09kjVt",
  premium: "https://pay.wiapy.com/pY_q5c1l7ibW"
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

// Faixa de promoção: mostra sempre a data de hoje
const promoDate = document.getElementById("promoDate");
if (promoDate) promoDate.textContent = " - " + new Date().toLocaleDateString("pt-BR");

// Carrossel da amostra do livro
const carousel = document.getElementById("carousel");
if (carousel) {
  const slides = [...carousel.querySelectorAll(".slide")];
  const dots = document.getElementById("carouselDots");
  const lightbox = document.getElementById("lightbox");
  let current = 0;

  // Enquanto a imagem não existir, mostra o espaço reservado
  slides.forEach(s => s.querySelector("img").addEventListener("error", e => e.target.remove()));

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ver receita " + (i + 1));
    b.addEventListener("click", () => goTo(i));
    dots.appendChild(b);
  });

  const goTo = i => {
    i = Math.max(0, Math.min(slides.length - 1, i));
    carousel.scrollTo({ left: slides[i].offsetLeft - (carousel.clientWidth - slides[i].clientWidth) / 2, behavior: "smooth" });
  };
  const setActive = i => { current = i; [...dots.children].forEach((d, j) => d.classList.toggle("on", j === i)); };
  setActive(0);

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(slides.indexOf(e.target)); });
  }, { root: carousel, threshold: 0.6 });
  slides.forEach(s => io.observe(s));

  document.querySelectorAll(".carousel-arrow").forEach(a =>
    a.addEventListener("click", () => goTo(current + Number(a.dataset.dir))));

  // Toque para ampliar
  slides.forEach(s => s.addEventListener("click", () => {
    const img = s.querySelector("img");
    if (!img) return;
    lightbox.querySelector("img").src = img.src;
    lightbox.querySelector("img").alt = img.alt;
    lightbox.showModal();
  }));
  lightbox.addEventListener("click", () => lightbox.close());
}
