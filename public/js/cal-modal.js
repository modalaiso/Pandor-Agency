/* ── CAL.COM BOOKING MODAL ── */

(() => {
  /* ── Config Cal.com embed ── */
  const CAL_LINK   = 'pandor.agency/20min';
  const CAL_ORIGIN = 'https://cal.com';

  /* Paramètres passés via postMessage après chargement de l'embed */
  const CAL_CONFIG = {
    layout: 'month_view',
    hideEventTypeDetails: false,
    theme: 'dark',         // force dark pour que cal-brand dark s'applique
    cssVarsPerTheme: {
      light: { 'cal-brand': '#0a0905' },
      dark:  { 'cal-brand': '#d4a953' },
    },
  };

  /* URL iframe avec paramètres de base */
  const CAL_URL =
    `${CAL_ORIGIN}/${CAL_LINK}?embed=true` +
    `&theme=${CAL_CONFIG.theme}` +
    `&layout=${CAL_CONFIG.layout}` +
    `&hideEventTypeDetails=${CAL_CONFIG.hideEventTypeDetails}`;

  /* ── Injection du HTML ── */
  const html = `
    <div class="cal-overlay" id="calOverlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Réserver un appel">
      <div class="cal-modal" id="calModal">
        <div class="cal-modal-header">
          <div class="cal-modal-title">
            <span class="cal-modal-dot"></span>
            <span class="cal-modal-label">Réserver un appel de 20 min</span>
          </div>
          <button class="cal-modal-close" id="calClose" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="cal-modal-body">
          <div class="cal-loading" id="calLoading">
            <div class="cal-spinner"></div>
            <span class="cal-loading-text">Chargement du calendrier…</span>
          </div>
          <iframe
            id="calFrame"
            src=""
            title="Réserver un appel Pandor"
            loading="lazy"
            allow="camera; microphone; payment"
          ></iframe>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const overlay  = document.getElementById('calOverlay');
  const modal    = document.getElementById('calModal');
  const closeBtn = document.getElementById('calClose');
  const frame    = document.getElementById('calFrame');
  const loading  = document.getElementById('calLoading');

  let iframeLoaded = false;

  /* ── Envoi config CSS vars via postMessage (méthode officielle Cal.com embed) ── */
  function sendCalConfig() {
    frame.contentWindow?.postMessage(
      {
        originator: 'CAL',
        method: 'ui',
        arg: {
          theme: CAL_CONFIG.theme,
          cssVarsPerTheme: CAL_CONFIG.cssVarsPerTheme,
          hideEventTypeDetails: CAL_CONFIG.hideEventTypeDetails,
          layout: CAL_CONFIG.layout,
        },
      },
      CAL_ORIGIN
    );
  }

  /* ── Ouvrir ── */
  function openModal() {
    // Charge l'iframe seulement à la première ouverture
    if (!iframeLoaded) {
      frame.src = CAL_URL;
      iframeLoaded = true;
      frame.addEventListener('load', () => {
        loading.classList.add('hidden');
        // Envoie la config brand une fois l'iframe prête
        sendCalConfig();
        // Re-envoie après 500ms en cas de latence de rendu Cal
        setTimeout(sendCalConfig, 500);
      }, { once: true });
    }

    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Focus trap : focus sur le bouton fermer
    setTimeout(() => closeBtn.focus(), 80);

    overlay.addEventListener('keydown', handleKeydown);
  }

  /* ── Fermer ── */
  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    overlay.removeEventListener('keydown', handleKeydown);
  }

  /* ── Keydown (Echap + trap focus) ── */
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeModal();
    }
  }

  /* ── Fermeture au clic sur l'overlay (hors modal) ── */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  closeBtn.addEventListener('click', closeModal);

  /* ── Bind tous les boutons "Réserver un appel" ── */
  function bindTriggers() {
    // Cible les boutons et liens qui contiennent le texte (insensible à la casse)
    document.querySelectorAll('a, button').forEach(el => {
      const text = el.textContent.trim().toLowerCase();
      if (text.includes('réserver un appel') || text.includes('reserver un appel')) {
        // Empêche le lien # de scroller en haut
        el.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          openModal();
        });
      }
    });
  }

  // Lance au chargement + après un tick pour les éléments dynamiques
  bindTriggers();
  window.addEventListener('load', bindTriggers);

})();