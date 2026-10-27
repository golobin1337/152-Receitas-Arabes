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

// Depoimentos de clientes — cadastre aqui SOMENTE depoimentos reais, com autorização do cliente.
// A nota média, as barras e o total de avaliações são calculados a partir desta lista.
// Exemplo (remova as barras // para usar):
// { nome: "Nome S.", data: "27 de outubro de 2026", nota: 5, texto: "O que o cliente escreveu.", foto: "assets/depoimento-1.webp" },
const DEPOIMENTOS = [
];

const reviewsSection = document.getElementById("depoimentos");
if (reviewsSection && DEPOIMENTOS.length) {
  const colors = ["#5b7b3a", "#e8763a", "#1f9d55", "#8a5a9e", "#2f7fb5"];
  const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };

  const total = DEPOIMENTOS.length;
  const avg = DEPOIMENTOS.reduce((s, d) => s + d.nota, 0) / total;
  document.getElementById("ratingAvg").textContent = avg.toFixed(1).replace(".", ",");
  document.getElementById("ratingStars").textContent = stars(Math.round(avg));
  document.getElementById("ratingCount").textContent = total + (total === 1 ? " avaliação" : " avaliações");

  const bars = document.getElementById("ratingBars");
  for (let n = 5; n >= 1; n--) {
    const pct = Math.round(DEPOIMENTOS.filter(d => d.nota === n).length / total * 100);
    const row = el("div", "rating-row");
    const track = el("div", "rating-track");
    const fill = el("i");
    fill.style.width = pct + "%";
    track.appendChild(fill);
    row.append(el("span", "", n + (n === 1 ? " estrela" : " estrelas")), track, el("span", "", pct + "%"));
    bars.appendChild(row);
  }

  const grid = document.getElementById("reviewsGrid");
  DEPOIMENTOS.forEach((d, i) => {
    const card = el("article", "review");
    const initials = d.nome.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
    const avatar = el("div", "review-avatar", initials);
    avatar.style.background = colors[i % colors.length];
    const who = el("div");
    who.append(el("b", "", d.nome), el("small", "", d.data || ""));
    const author = el("div", "review-author");
    author.append(avatar, who);
    card.append(el("div", "review-stars", stars(d.nota)), author, el("p", "", d.texto));
    if (d.foto) {
      const img = el("img");
      img.src = d.foto;
      img.alt = "Foto enviada por " + d.nome;
      img.loading = "lazy";
      card.appendChild(img);
    }
    grid.appendChild(card);
  });

  reviewsSection.hidden = false;
}
