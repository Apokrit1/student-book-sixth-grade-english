/**
 * ENGLISH 6TH GRADE COURSEBOOK PORTAL - Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const unitsGrid = document.getElementById('unitsGrid');

  if (window.COURSEBOOK_CATALOG && window.COURSEBOOK_CATALOG.units) {
    renderUnits(window.COURSEBOOK_CATALOG.units);
  } else {
    fetch('data/coursebook_catalog.json')
      .then(res => res.json())
      .then(data => {
        renderUnits(data.units || []);
      })
      .catch(err => {
        console.warn('Could not load coursebook catalog, using fallback content:', err);
      });
  }

  function renderUnits(units) {
    if (!unitsGrid) return;
    unitsGrid.innerHTML = '';

    units.forEach(u => {
      const isReady = u.status === 'ready';
      const card = document.createElement('article');
      card.className = `unit-card ${isReady ? 'featured' : ''}`;
      
      const padNum = String(u.unit).padStart(2, '0');
      const badgeClass = isReady ? 'ready' : 'planned';
      
      card.innerHTML = `
        <div class="unit-card-header">
          <div class="unit-number-pill" style="${isReady ? '' : 'background: #718096;'}">Unit ${padNum}</div>
          <div class="unit-badge ${badgeClass}">${u.badge}</div>
        </div>
        <h3 class="unit-title">${u.title}</h3>
        <p class="unit-tagline">${u.tagline}</p>
        
        <div class="unit-meta-tags">
          <span class="meta-tag"><strong>Grammar:</strong> ${u.grammar}</span>
          <span class="meta-tag"><strong>Theme:</strong> ${u.theme}</span>
          ${u.cross_curricular.map(c => `<span class="meta-tag">📚 ${c}</span>`).join('')}
        </div>

        <div class="unit-card-actions">
          ${isReady ? `
            <a href="${u.v2_url}" class="action-btn v2-btn">
              <span>🚀</span> Launch Version 2 (CLIL & Portfolio)
            </a>
            <a href="${u.v1_url}" class="action-btn v1-btn">
              <span>📖</span> Version 1 (Vocabulary Lab)
            </a>
            ${u.photodentro_url ? `
              <a href="${u.photodentro_url}" target="_blank" class="action-btn oer-btn">
                <span>🏛️</span> Photodentro OER Lab
              </a>
            ` : ''}
          ` : `
            <span class="action-btn disabled">
              <span>🔒</span> In Preparation for Term ${u.unit <= 4 ? '1' : (u.unit <= 7 ? '2' : '3')}
            </span>
          `}
        </div>
      `;

      unitsGrid.appendChild(card);
    });
  }

  // --- Video Modal Controls ---
  const videoModal = document.getElementById('videoModal');
  const modalVideoElement = document.getElementById('modalVideoElement');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const watchPitchVideoBtn = document.getElementById('watchPitchVideoBtn');
  const heroWatchVideoBtn = document.getElementById('heroWatchVideoBtn');
  const previewPlayBtn = document.getElementById('previewPlayBtn');
  const videoPreviewTrigger = document.getElementById('videoPreviewTrigger');

  function openModal(e) {
    if (e) e.preventDefault();
    if (!videoModal) return;
    videoModal.style.display = 'flex';
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalVideoElement) {
      modalVideoElement.currentTime = 0;
      modalVideoElement.play().catch(err => {
        console.log('Video autoplay prevented or suspended:', err);
      });
    }
  }

  function closeModal() {
    if (!videoModal) return;
    videoModal.style.display = 'none';
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalVideoElement) {
      modalVideoElement.pause();
    }
  }

  if (watchPitchVideoBtn) watchPitchVideoBtn.addEventListener('click', openModal);
  if (heroWatchVideoBtn) heroWatchVideoBtn.addEventListener('click', openModal);
  if (previewPlayBtn) previewPlayBtn.addEventListener('click', openModal);
  if (videoPreviewTrigger) {
    videoPreviewTrigger.addEventListener('click', (e) => {
      // Don't trigger if clicked directly on a child button that already has a handler
      if (e.target.closest('#previewPlayBtn')) return;
      openModal(e);
    });
    videoPreviewTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(e);
      }
    });
  }

  if (closeVideoModal) closeVideoModal.addEventListener('click', closeModal);

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.style.display === 'flex') {
      closeModal();
    }
  });
});
