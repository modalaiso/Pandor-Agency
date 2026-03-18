/* HERO BLUR-WORD REVEAL */
(function () {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;

    const frag = document.createDocumentFragment();

    h1.childNodes.forEach(node => {
        const wrap = (text, tag) => {
            text.split(/(\s+)/).forEach(part => {
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else if (part) {
                    const span = document.createElement('span');
                    span.className = 'hero-word';
                    span.textContent = part;
                    if (tag) {
                        const outer = document.createElement(tag);
                        outer.appendChild(span);
                        frag.appendChild(outer);
                    } else {
                        frag.appendChild(span);
                    }
                }
            });
        };
        if (node.nodeType === Node.TEXT_NODE) wrap(node.textContent, null);
        else if (node.nodeName === 'BR') frag.appendChild(node.cloneNode());
        else if (node.nodeName === 'EM') wrap(node.textContent, 'em');
    });

    h1.innerHTML = '';
    h1.appendChild(frag);
    h1.querySelectorAll('.hero-word').forEach((w, i) =>
        setTimeout(() => w.classList.add('lit'), 300 + i * 55)
    );
})();


/* SMOOTH SCROLL (souris uniquement) */
if (window.matchMedia('(pointer: fine) and (hover: hover)').matches) {

    let pos = window.scrollY;
    let vel = 0;
    const FRICTION = 0.88;

    /* Wheel — ignore les events venant de la scrollbar */
    let scrollbarActive = false;
    window.addEventListener('pointerdown', e => {
        scrollbarActive = e.clientX >= document.documentElement.clientWidth - 20;
    });
    window.addEventListener('pointerup', () => { scrollbarActive = false; });
    window.addEventListener('wheel', e => {
        if (scrollbarActive) return;
        e.preventDefault();
        vel += e.deltaY * 0.2;
    }, { passive: false });

    /* Boucle RAF */
    const tick = () => {
        vel *= FRICTION;
        if (Math.abs(vel) < 0.1) vel = 0;
        if (vel !== 0) {
            const max = document.body.scrollHeight - window.innerHeight;
            pos = Math.max(0, Math.min(pos + vel, max));
            window.scrollTo(0, pos);
        }
        requestAnimationFrame(tick);
    };
    tick();

    /* Sync si la scrollbar passe quand même */
    window.addEventListener('scroll', () => { pos = window.scrollY; }, { passive: true });

    /* Ancres même page */
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const hash = a.getAttribute('href');
        if (!hash || hash === '#') return;
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        pos = el.getBoundingClientRect().top + window.scrollY - 80;
        vel = 0;
        window.scrollTo(0, pos);
        history.pushState(null, '', hash);
    });

    /* Hash à l'arrivée cross-page */
    if (window.location.hash) {
        const tryHash = (n = 0) => {
            const el = document.querySelector(window.location.hash);
            if (el) {
                setTimeout(() => {
                    pos = el.getBoundingClientRect().top + window.scrollY - 80;
                    vel = 0;
                    window.scrollTo(0, pos);
                }, 150);
            } else if (n < 10) setTimeout(() => tryHash(n + 1), 100);
        };
        tryHash();
    }

} else {
    /* Touch / tablette — scroll natif */
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const hash = a.getAttribute('href');
        if (!hash || hash === '#') return;
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', hash);
    });

    if (window.location.hash) {
        setTimeout(() => {
            const el = document.querySelector(window.location.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
}

/* NAV SHRINK */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* REVEAL */
const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 90);
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll(
    '.reveal,.service-card,.process-step,.portfolio-card,.pricing-card,.testimonial-card,.stat-item,.container-card-charts'
).forEach(el => obs.observe(el));


/* COUNTER */
const statsEl = document.querySelector('.stats');
if (statsEl) {
    new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                const target = parseInt(el.dataset.target) || 0;
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                const start = performance.now();
                const run = now => {
                    const p = Math.min((now - start) / 1600, 1);
                    el.textContent = prefix + Math.floor(p * target) + suffix;
                    if (p < 1) requestAnimationFrame(run);
                };
                requestAnimationFrame(run);
            });
            o.unobserve(entry.target);
        });
    }, { threshold: 0.5 }).observe(statsEl);
}


/* PROBLEM CARDS STAGGER */
const pc = document.getElementById('problemCards');
if (pc) {
    new IntersectionObserver((entries, o) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.problem-card').forEach((c, i) =>
                setTimeout(() => c.classList.add('visible'), i * 110)
            );
            o.unobserve(e.target);
        });
    }, { threshold: 0.1 }).observe(pc);
}


/* INK REVEAL */
function checkInk() {
    const vh = window.innerHeight;
    document.querySelectorAll('.ink-line,.ink-line-g').forEach(el =>
        el.classList.toggle('lit', el.getBoundingClientRect().top + el.offsetHeight / 2 < vh * 0.78)
    );
    document.querySelectorAll('.ink-p').forEach(el =>
        el.classList.toggle('lit', el.getBoundingClientRect().top + el.offsetHeight / 2 < vh * 0.82)
    );
}
window.addEventListener('scroll', checkInk, { passive: true });
checkInk();


/* PARALLAX GLOW */
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - .5) * 35;
        const y = (e.clientY / window.innerHeight - .5) * 35;
        heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
}


/* FAQ */
function toggleFaq(btn) {
    const a = btn.nextElementSibling;
    const ic = btn.querySelector('.faq-icon');
    const open = a.classList.contains('open');
    document.querySelectorAll('.faq-a').forEach(x => x.classList.remove('open'));
    document.querySelectorAll('.faq-icon').forEach(x => x.classList.remove('rotated'));
    if (!open) { a.classList.add('open'); ic.classList.add('rotated'); }
}


/* PAGE TRANSITION */
const overlay = document.createElement('div');
overlay.id = 'page-overlay';
document.body.appendChild(overlay);

document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    e.preventDefault();
    overlay.classList.add('fade-in');
    setTimeout(() => { window.location.href = href; }, 400);
});