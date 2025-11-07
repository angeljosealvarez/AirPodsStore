const ticketInput = document.querySelector('#tickets');
const totalOutput = document.querySelector('#total');
const ticketControls = document.querySelectorAll('.ticket-control');
const animatedElements = document.querySelectorAll('[data-animate]');
const counters = document.querySelectorAll('[data-counter]');
const progressBars = document.querySelectorAll('.progress[data-progress]');
const navBar = document.querySelector('.nav-bar');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const marqueeTrack = document.querySelector('.marquee-track');
const heroMedia = document.querySelector('.hero-media');

const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
let shouldReduceMotion = motionQuery ? motionQuery.matches : false;

if (motionQuery) {
    if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', (event) => {
            shouldReduceMotion = event.matches;
        });
    } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener((event) => {
            shouldReduceMotion = event.matches;
        });
    }
}

const TICKET_PRICE = 3.5;

function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function updateTotal() {
    const tickets = Math.min(Math.max(parseInt(ticketInput.value, 10) || 1, parseInt(ticketInput.min, 10)), parseInt(ticketInput.max, 10));
    ticketInput.value = tickets;
    const total = tickets * TICKET_PRICE;
    totalOutput.textContent = formatCurrency(total);
}

updateTotal();

ticketControls.forEach((control) => {
    control.addEventListener('click', () => {
        const action = control.dataset.action;
        const current = parseInt(ticketInput.value, 10) || 1;
        if (action === 'increment') {
            ticketInput.value = Math.min(current + 1, parseInt(ticketInput.max, 10));
        } else if (action === 'decrement') {
            ticketInput.value = Math.max(current - 1, parseInt(ticketInput.min, 10));
        }
        updateTotal();
    });
});

ticketInput.addEventListener('input', updateTotal);

function formatCounterValue(value, format) {
    if (format === 'currency') {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
    return Math.round(value).toLocaleString('es-ES');
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    if (Number.isNaN(target)) {
        return;
    }

    const format = element.dataset.format;
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        element.textContent = formatCounterValue(value, format);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    element.textContent = formatCounterValue(0, format);
    requestAnimationFrame(step);
}

function activateProgressBar(bar) {
    const value = parseFloat(bar.dataset.progress);
    if (Number.isNaN(value)) {
        return;
    }
    bar.style.width = `${value}%`;
}

const smoothLinks = document.querySelectorAll('a[href^="#"]');

smoothLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    animatedElements.forEach((element) => observer.observe(element));
} else {
    animatedElements.forEach((element) => element.classList.add('is-visible'));
}

if (!shouldReduceMotion && 'IntersectionObserver' in window) {
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '0px 0px -10%'
        });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    if (progressBars.length) {
        const progressObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activateProgressBar(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.35
        });

        progressBars.forEach((bar) => progressObserver.observe(bar));
    }
} else {
    counters.forEach((counter) => {
        const target = parseFloat(counter.dataset.target);
        if (!Number.isNaN(target)) {
            counter.textContent = formatCounterValue(target, counter.dataset.format);
        }
    });
    progressBars.forEach((bar) => activateProgressBar(bar));
}

if (navBar) {
    const updateNavBar = () => {
        navBar.classList.toggle('nav-bar--scrolled', window.scrollY > 12);
    };

    updateNavBar();
    window.addEventListener('scroll', updateNavBar, { passive: true });
}

if (marqueeTrack) {
    marqueeTrack.innerHTML = `${marqueeTrack.innerHTML}${marqueeTrack.innerHTML}`;
}

if (!shouldReduceMotion && heroMedia) {
    const updateTilt = (event) => {
        const rect = heroMedia.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const tiltX = (x - 0.5) * 16;
        const tiltY = (0.5 - y) * 12;
        heroMedia.style.setProperty('--tiltX', `${tiltX.toFixed(2)}deg`);
        heroMedia.style.setProperty('--tiltY', `${tiltY.toFixed(2)}deg`);
        heroMedia.classList.add('is-active');
    };

    const resetTilt = () => {
        heroMedia.style.setProperty('--tiltX', '0deg');
        heroMedia.style.setProperty('--tiltY', '0deg');
        heroMedia.classList.remove('is-active');
    };

    heroMedia.addEventListener('pointermove', updateTilt);
    heroMedia.addEventListener('pointerenter', updateTilt);
    heroMedia.addEventListener('pointerleave', resetTilt);
    heroMedia.addEventListener('pointerup', resetTilt);
}

if (!shouldReduceMotion && parallaxItems.length) {
    let latestScroll = window.scrollY;
    let ticking = false;

    const applyParallax = () => {
        parallaxItems.forEach((item) => {
            const strength = parseFloat(item.dataset.strength || '14');
            const translate = (latestScroll * strength) / 100;
            item.style.transform = `translate3d(0, ${translate}px, 0)`;
        });
        ticking = false;
    };

    const onScroll = () => {
        latestScroll = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(applyParallax);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    applyParallax();
} else if (parallaxItems.length) {
    parallaxItems.forEach((item) => {
        item.style.transform = 'translate3d(0, 0, 0)';
    });
}
