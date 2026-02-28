/* MENU TOGGLE  */

(() => {
  const burger  = document.getElementById('burgerBtn');
  const menu    = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');

  // Sécurité : si les éléments n'existent pas, on sort sans erreur
  if (!burger || !menu || !overlay) return;

  let isOpen = false;
  let closeTimeout = null; // fallback si transitionend ne se déclenche pas

  /* Focusables pour le trap focus */
  const getFocusables = () =>
    [...menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')];

  /* Ouvrir */
  function openMenu() {
    isOpen = true;

    // Annule un éventuel closeTimeout en cours
    clearTimeout(closeTimeout);

    // Retire hidden avant la frame pour que la transition parte
    menu.removeAttribute('hidden');

    requestAnimationFrame(() => {
      menu.classList.add('is-open');
      overlay.classList.add('is-visible');
      burger.classList.add('is-active');
      burger.setAttribute('aria-expanded', 'true');
      overlay.setAttribute('aria-hidden', 'false');

      const first = getFocusables()[0];
      if (first) first.focus();
    });

    // keydown uniquement sur le menu lui-même, pas sur document entier
    menu.addEventListener('keydown', handleKeydown);
  }

  /* Fermer */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    menu.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');

    menu.removeEventListener('keydown', handleKeydown);
    closeTimeout = setTimeout(() => {
      if (!isOpen) menu.setAttribute('hidden', '');
    }, 400);

    menu.addEventListener('transitionend', function onEnd(e) {
      // S'assure que c'est bien la transition du menu et pas d'un enfant
      if (e.target !== menu) return;
      clearTimeout(closeTimeout);
      if (!isOpen) menu.setAttribute('hidden', '');
      menu.removeEventListener('transitionend', onEnd);
    });

    burger.focus();
  }

  /* Trap focus : Echap + Tab */
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      // stopPropagation pour ne pas déclencher d'autres listeners Escape
      e.stopPropagation();
      closeMenu();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusables = getFocusables();
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* Burger click */
  burger.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

  overlay.addEventListener('click', closeMenu);

  /* Liens dans le menu */
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeMenu, 10);
    });
  });

})();