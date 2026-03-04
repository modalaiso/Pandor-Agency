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

/* Showcase carousel navigation */
(function() {
    const list = document.querySelector('.sc-list');
    const btnLeft = document.querySelector('.sc-nav--left');
    const btnRight = document.querySelector('.sc-nav--right');
    if (!list || !btnLeft || !btnRight) return;

    function updateButtons() {
        btnLeft.disabled = list.scrollLeft <= 0;
        btnRight.disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
    }

    btnLeft.addEventListener('click', function() {
        var card = list.querySelector('.sc-card');
        if (card) list.scrollBy({ left: -(card.offsetWidth + 14), behavior: 'smooth' });
    });

    btnRight.addEventListener('click', function() {
        var card = list.querySelector('.sc-card');
        if (card) list.scrollBy({ left: card.offsetWidth + 14, behavior: 'smooth' });
    });

    list.addEventListener('scroll', updateButtons);
    updateButtons();

    // Make all cards visible when carousel enters viewport
    var carouselObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                list.querySelectorAll('.sc-card').forEach(function(card, i) {
                    setTimeout(function() { card.classList.add('visible'); }, i * 90);
                });
                carouselObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.05 });
    carouselObs.observe(list);
})();

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