/* HERO BLUR-WORD REVEAL  */
(function heroBlurReveal() {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;

    // Walk child nodes: text nodes get split by word,
    // <em> and <br> pass through intact
    const fragment = document.createDocumentFragment();

    h1.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Split text into words, preserve spaces
            const words = node.textContent.split(/(\s+)/);
            words.forEach(part => {
                if (/^\s+$/.test(part)) {
                    // Pure whitespace — keep as text so line breaks work
                    fragment.appendChild(document.createTextNode(part));
                } else if (part.length > 0) {
                    const span = document.createElement('span');
                    span.className = 'hero-word';
                    span.textContent = part;
                    fragment.appendChild(span);
                }
            });
        } else if (node.nodeName === 'BR') {
            fragment.appendChild(node.cloneNode());
        } else if (node.nodeName === 'EM') {
            // Wrap em words too
            const words = node.textContent.split(/(\s+)/);
            words.forEach(part => {
                if (/^\s+$/.test(part)) {
                    fragment.appendChild(document.createTextNode(part));
                } else if (part.length > 0) {
                    const em = document.createElement('em');
                    const span = document.createElement('span');
                    span.className = 'hero-word';
                    span.textContent = part;
                    em.appendChild(span);
                    fragment.appendChild(em);
                }
            });
        }
    });
    h1.innerHTML = '';
    h1.appendChild(fragment);

    // Stagger each word reveal
    const words = h1.querySelectorAll('.hero-word');
    words.forEach((word, i) => {
        setTimeout(() => {
            word.classList.add('lit');
        }, 300 + i * 55); // starts at 300ms, 55ms between each word
    });
})();

/* LERP */
function lerp(a, b, t) { return a + (b - a) * t; }

/* SMOOTH SCROLL lerp (desktop only) */
if (window.innerWidth > 900) {
    let current = window.scrollY;
    let target  = window.scrollY;
    let wheelAcc = 0;

    /* Roue souris */
    window.addEventListener('wheel', e => {
        e.preventDefault();
        wheelAcc += e.deltaY * 0.85;
    }, { passive: false });

    /* Clic ancre sur la même page : #services, #portfolio… */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const hash = a.getAttribute('href');
            if (hash === '#' || hash === '') return;
            const el = document.querySelector(hash);
            if (el) {
                e.preventDefault();
                target  = el.getBoundingClientRect().top + window.scrollY - 80;
                current = target;   // snap : évite la dérive
                wheelAcc = 0;
                history.pushState(null, '', hash);
            }
        });
    });

    /* Boucle lerp */
    function tick() {
        wheelAcc = lerp(wheelAcc, 0, 0.1);
        if (Math.abs(wheelAcc) < 0.05) wheelAcc = 0;

        const maxScroll = document.body.scrollHeight - window.innerHeight;
        current = lerp(current, current + wheelAcc, 0.14);
        current = Math.max(0, Math.min(current, maxScroll));
        window.scrollTo(0, current);

        requestAnimationFrame(tick);
    }
    tick();

    /* ── CROSS-PAGE : arrivée depuis réalisations.html avec /#services ──
       Le navigateur charge index.html#services → on lit le hash et on
       repositionne current + target dans le moteur lerp.               */
    (function scrollToHashOnLoad() {
        const hash = window.location.hash;   // ex : "#services"
        if (!hash) return;

        const tryScroll = (attempts = 0) => {
            const el = document.querySelector(hash);
            if (el) {
                // Léger délai pour que les animations CSS soient prêtes
                setTimeout(() => {
                    const dest = el.getBoundingClientRect().top + window.scrollY - 80;
                    // Injecte directement dans le moteur lerp
                    current  = dest;
                    target   = dest;
                    wheelAcc = 0;
                    window.scrollTo(0, dest);
                }, 150);
            } else if (attempts < 10) {
                setTimeout(() => tryScroll(attempts + 1), 100);
            }
        };
        tryScroll();
    })();

} else {
    /* ── Mobile : scroll natif CSS ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const hash = a.getAttribute('href');
            if (hash === '#' || hash === '') return;
            const el = document.querySelector(hash);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', hash);
            }
        });
    });

    /* Cross-page mobile */
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
}

/* CURSOR */
/*const cur = document.getElementById('cur');
const curRing = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left=mx+'px'; cur.style.top=my+'px'; });
(function animRing() {
    rx = lerp(rx, mx, 0.11); ry = lerp(ry, my, 0.11);
    curRing.style.left=rx+'px'; curRing.style.top=ry+'px';
    requestAnimationFrame(animRing);
})();*/

/* NAV SHRINK */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

/* INTERSECTION OBSERVER */
const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 90);
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal,.service-card,.process-step,.portfolio-card,.pricing-card,.testimonial-card,.stat-item,.container-card-charts').forEach(el => obs.observe(el));

// Animated counter
function animateCounter(el) {
  const target = parseInt(el.dataset.target) || 0;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';

  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);

    el.textContent = `${prefix}${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const nums = entry.target.querySelectorAll('.stat-num');
    nums.forEach(num => animateCounter(num));

    observer.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.stats');
if (statsEl) statsObserver.observe(statsEl);

// Problem cards stagger
const pcObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.problem-card').forEach((c, i) => {
                setTimeout(() => c.classList.add('visible'), i * 110);
            });
            pcObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
const pc = document.getElementById('problemCards');
if (pc) pcObs.observe(pc);

/* TEXT INK REVEAL: gray → white on scroll */
function checkInk() {
    const vh = window.innerHeight;
    document.querySelectorAll('.ink-line,.ink-line-g').forEach(el => {
        const r = el.getBoundingClientRect();
        // Light up when element center passes 60% of viewport
        if (r.top + r.height / 2 < vh * 0.78) el.classList.add('lit');
        else el.classList.remove('lit');
    });
    document.querySelectorAll('.ink-p').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 < vh * 0.82) el.classList.add('lit');
        else el.classList.remove('lit');
    });
}
window.addEventListener('scroll', checkInk, { passive: true });
checkInk();

/* PARALLAX GLOW */
document.addEventListener('mousemove', e => {
    const g = document.querySelector('.hero-glow');
    if (!g) return;
    const x = (e.clientX / window.innerWidth - .5) * 35;
    const y = (e.clientY / window.innerHeight - .5) * 35;
    g.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});

/* FAQ */
function toggleFaq(btn) {
    const a = btn.nextElementSibling;
    const ic = btn.querySelector('.faq-icon');
    const open = a.classList.contains('open');
    document.querySelectorAll('.faq-a').forEach(x => x.classList.remove('open'));
    document.querySelectorAll('.faq-icon').forEach(x => x.classList.remove('rotated'));
    if (!open) { a.classList.add('open'); ic.classList.add('rotated'); }
}