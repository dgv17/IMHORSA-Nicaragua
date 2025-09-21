console.log("proyecto ing. de software UNI segundo semestre 2025");
const supportsIntersectionObserver = 'IntersectionObserver' in window;

const gridBoxes: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  '#valores-virtudes .wrapper > div'
);

if (!supportsIntersectionObserver) {
  gridBoxes.forEach((box) => box.classList.add('reveal'));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLDivElement;
          target.classList.add('reveal');
          obs.unobserve(target); //animar una sola vez
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    }
  );

  gridBoxes.forEach((box) => observer.observe(box));
}
document.addEventListener('DOMContentLoaded', () => {
  const serviceBoxes: NodeListOf<HTMLDivElement> = document.querySelectorAll(
    '#servicios .container > div'
  );

  const supportsIO = 'IntersectionObserver' in window;

  if (!supportsIO) {
    serviceBoxes.forEach((box) => box.classList.add('reveal'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLDivElement;
          const index = Array.from(serviceBoxes).indexOf(target);
          
          target.style.animationDelay = `${index * 120}ms`;
          target.classList.add('reveal');

          obs.unobserve(target); // Animar solo una vez
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    }
  );

  serviceBoxes.forEach((box) => observer.observe(box));
});

document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.menu-toggle') as NodeListOf<HTMLButtonElement>;
  const submenus = document.querySelectorAll('.submenu') as NodeListOf<HTMLUListElement>;

  toggles.forEach((toggle, index) => {
    const submenu = submenus[index];
    if (!submenu) return;

    toggle.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();

      const isOpen = submenu.classList.contains('visible');

      // Desktop: close others first
      if (window.innerWidth > 768) {
        submenus.forEach((sm, i) => {
          if (i !== index) sm.classList.remove('visible');
        });
      }

      if (isOpen) {
        // If already open, close immediately
        submenu.classList.remove('visible');
      } else {
        // If closed, open with a small delay
        setTimeout(() => {
          submenu.classList.add('visible');
        }, 400); // 0.4s delay
      }
    });
  });
});
