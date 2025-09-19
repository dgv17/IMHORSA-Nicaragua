"use strict";
console.log("proyecto ing. de software UNI segundo semestre 2025");
// reveal-on-scroll animacion
const supportsIntersectionObserver = 'IntersectionObserver' in window;
const gridBoxes = document.querySelectorAll('#valores-virtudes .wrapper > div');
if (!supportsIntersectionObserver) {
    gridBoxes.forEach((box) => box.classList.add('reveal'));
}
else {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('reveal');
                obs.unobserve(target); //animar una sola vez
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
    });
    gridBoxes.forEach((box) => observer.observe(box));
}
document.addEventListener('DOMContentLoaded', () => {
    const serviceBoxes = document.querySelectorAll('#servicios .container > div');
    const supportsIO = 'IntersectionObserver' in window;
    if (!supportsIO) {
        serviceBoxes.forEach((box) => box.classList.add('reveal'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const index = Array.from(serviceBoxes).indexOf(target);
                target.style.animationDelay = `${index * 120}ms`;
                target.classList.add('reveal');
                obs.unobserve(target); // Animate only once
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
    });
    serviceBoxes.forEach((box) => observer.observe(box));
});
