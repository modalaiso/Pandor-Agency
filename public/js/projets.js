/* Reveal générique */
const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* Showcase cards */
const scObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 90);
            scObs.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });
document.querySelectorAll('.sc-card').forEach(el => scObs.observe(el));

/* Archive cards */
const archObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 65);
            archObs.unobserve(e.target);
        }
    });
}, { threshold: 0.06 });
document.querySelectorAll('.arch-card').forEach(el => archObs.observe(el));

/* Filtres */
document.querySelectorAll('.f-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.arch-card').forEach(card => {
            card.style.display = (f === 'all' || card.dataset.cat === f) ? '' : 'none';
        });
    });
});