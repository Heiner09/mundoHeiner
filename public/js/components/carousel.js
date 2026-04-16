export function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const dots  = document.querySelectorAll('.dot');
  const total = dots.length;
  let current = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  document.getElementById('nextBtn').addEventListener('click', () => { next(); resetAuto(); });
  document.getElementById('prevBtn').addEventListener('click', () => { prev(); resetAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.idx); resetAuto(); }));

  autoTimer = setInterval(next, 5000);
}
