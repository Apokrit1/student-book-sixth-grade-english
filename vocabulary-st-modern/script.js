/**
 * The Companion — Modernization Preview (rev 2)
 * Image swap · Staggered scroll-in · Filter logic · Hero parallax
 */

(function () {
  'use strict';

  // ----- Image swap when ready (if generated illustration exists) -----
  const featuredArt = document.getElementById('featuredArt');
  if (featuredArt) {
    const img = new Image();
    img.src = './imgs/unit1_featured.jpg';
    img.alt = 'Hand-drawn illustration of three 6th graders waving flags of Greece, Ukraine, and Albania';
    img.loading = 'eager';
    img.onload = () => {
      const fallback = featuredArt.querySelector('.v1-cover-fallback');
      if (fallback) fallback.style.display = 'none';
      featuredArt.appendChild(img);
    };
    img.onerror = () => {
      // keep fallback
    };
  }

  // ----- Staggered scroll-in animation -----
  const cards = Array.from(document.querySelectorAll('.unit-split'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const i = cards.indexOf(el);
          setTimeout(() => {
            el.classList.add('visible');
          }, Math.max(0, i) * 90);
          io.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(c => c.classList.add('visible'));
  }

  // ----- Filter chips -----
  const chips = document.querySelectorAll('.chip');
  if (chips.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const colorClass = ['sage', 'mustard'].find(c => chip.classList.contains(c)) || 'default';
        chips.forEach(c => {
          if ((colorClass === 'default' && !c.classList.contains('sage') && !c.classList.contains('mustard')) ||
              (colorClass !== 'default' && c.classList.contains(colorClass))) {
            c.classList.remove('active');
          }
        });
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

        // Re-trigger stagger animation on visible cards
        visibleCards.forEach((c, i) => {
          c.classList.remove('visible');
          void c.offsetWidth; // reflow
          setTimeout(() => c.classList.add('visible'), i * 70);
        });
      });
    });
  }

  // ----- Subtle parallax on hero art (scroll) -----
  const heroArt = document.querySelector('.hero-art');
  if (heroArt) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = Math.min(120, window.scrollY * 0.08);
          heroArt.style.transform = `translateY(${y}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();