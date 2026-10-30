/**
 * The Modernized Coursebook — Bio-Warm 2026 & Graphic Novel Edition (rev 5)
 * Image check · Staggered scroll-in · Filter logic · Hero parallax
 */

(function () {
  'use strict';

  // ----- Ensure featuredArt fallback is hidden when image loads -----
  const featuredArt = document.getElementById('featuredArt');
  if (featuredArt && !featuredArt.querySelector('img')) {
    const img = new Image();
    img.src = './imgs/unit1_featured.jpg';
    img.alt = 'Middle-grade graphic novel illustration of four 11-year-old classmates gathered around a classroom globe and wall map of Europe';
    img.loading = 'eager';
    img.onload = () => {
      const fallback = featuredArt.querySelector('.v1-cover-fallback');
      if (fallback) fallback.style.display = 'none';
      featuredArt.appendChild(img);
    };
    img.onerror = () => {};
  }

  // ----- Staggered scroll-in animation -----
  const cards = Array.from(document.querySelectorAll('.unit-split'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const i = cards.indexOf(el);
          setTimeout(() => {
            el.classList.add('visible');
          }, Math.max(0, i) * 70);
          io.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(c => c.classList.add('visible'));
  }

  // ----- Filter chips -----
  const chips = document.querySelectorAll('.chip');
  if (chips.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.dataset.filter;
        const visibleCards = [];

        cards.forEach(card => {
          const terms = (card.dataset.terms || '').split(/\s+/);
          const flags = (card.dataset.flags || '').split(/\s+/);
          let show = false;
          if (filter === 'all') show = true;
          else if (filter.startsWith('term-')) show = terms.includes(filter);
          else if (filter === 'ready')     show = flags.includes('ready');
          else if (filter === 'featured')  show = flags.includes('featured');

          card.classList.toggle('hidden', !show);
          if (show) visibleCards.push(card);
        });

        visibleCards.forEach((c, i) => {
          c.classList.remove('visible');
          void c.offsetWidth;
          setTimeout(() => c.classList.add('visible'), i * 60);
        });
      });
    });
  }

  // ----- Subtle parallax on hero art -----
  const heroArt = document.querySelector('.hero-art');
  if (heroArt) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = Math.min(90, window.scrollY * 0.06);
          heroArt.style.transform = `translateY(${y}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
