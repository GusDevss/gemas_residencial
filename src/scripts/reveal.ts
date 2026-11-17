// Animaciones de entrada al hacer scroll. La clase .js se agrega en <head> (Base.astro).
const els = document.querySelectorAll('.reveal');
if (document.documentElement.classList.contains('js')) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}
