import { initCarousel } from '../components/carousel.js';

// Carrusel
initCarousel();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Back to top
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
