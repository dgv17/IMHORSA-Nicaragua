"use strict";
console.log("proyecto ing. de software UNI segundo semestre 2025");
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
                obs.unobserve(target); // Animar solo una vez
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
    });
    serviceBoxes.forEach((box) => observer.observe(box));
});
document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.menu-toggle');
    const submenus = document.querySelectorAll('.submenu');
    toggles.forEach((toggle, index) => {
        const submenu = submenus[index];
        if (submenu) {
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                // SI ya esta abierto el submenu
                const isOpen = submenu.classList.contains('visible');
                // cierra los submenus
                if (window.innerWidth > 768) {
                    // close others only on desktop
                    submenus.forEach((sm, i) => {
                        if (i !== index)
                            sm.classList.remove('visible');
                    });
                }
                submenu.classList.toggle('visible');
                // solo reabrir si no esta abierto ya
                if (!isOpen) {
                    submenu.classList.add('visible');
                }
            });
        }
    });
});
