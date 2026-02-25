/* ─── LERP ─── */
function lerp(a, b, t) { return a + (b - a) * t; }

/* ─── SMOOTH SCROLL (desktop only) ─── */
if (window.innerWidth > 900) {
    let current = window.scrollY;
    let target = window.scrollY;
    let wheelAcc = 0;

    window.addEventListener('wheel', e => {
        e.preventDefault();
        wheelAcc += e.deltaY * 0.85;
    }, { passive: false });

    // Also handle anchor clicks
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) {
                e.preventDefault();
                target = el.getBoundingClientRect().top + window.scrollY - 80;
                current = target; // snap to avoid drift
                wheelAcc = 0;
            }
        });
    });

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
}

/* ─── CURSOR ─── */
const cur = document.getElementById('cur');
const curRing = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left=mx+'px'; cur.style.top=my+'px'; });
(function animRing() {
    rx = lerp(rx, mx, 0.11); ry = lerp(ry, my, 0.11);
    curRing.style.left=rx+'px'; curRing.style.top=ry+'px';
    requestAnimationFrame(animRing);
})();

/* ─── NAV SHRINK ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

/* ─── INTERSECTION OBSERVER ─── */
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

/* ─── TEXT INK REVEAL: gray → white on scroll ─── */
function checkInk() {
    const vh = window.innerHeight;
    document.querySelectorAll('.ink-line').forEach(el => {
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

/* ─── PARALLAX GLOW ─── */
document.addEventListener('mousemove', e => {
    const g = document.querySelector('.hero-glow');
    if (!g) return;
    const x = (e.clientX / window.innerWidth - .5) * 35;
    const y = (e.clientY / window.innerHeight - .5) * 35;
    g.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});

/* ─── FAQ ─── */
    function toggleFaq(btn) {
        const a = btn.nextElementSibling;
        const ic = btn.querySelector('.faq-icon');
        const open = a.classList.contains('open');
        document.querySelectorAll('.faq-a').forEach(x => x.classList.remove('open'));
        document.querySelectorAll('.faq-icon').forEach(x => x.classList.remove('rotated'));
        if (!open) { a.classList.add('open'); ic.classList.add('rotated'); }
    }