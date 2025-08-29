

document.addEventListener('DOMContentLoaded', function() {
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  
  if (!prefersReducedMotion) {
    activateAnimations();
  }
});

function activateAnimations() {
  
  document.body.classList.add('animations-enabled');
  
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });
  
  
  const elementsToAnimate = document.querySelectorAll(
    '.hero, .solucao-card, .solucoes-content h2'
  );
  
  
  elementsToAnimate.forEach((element, index) => {
    
    if (element.classList.contains('solucao-card')) {
      element.style.setProperty('--animation-delay', `${index * 0.1}s`);
    }
    observer.observe(element);
  });
}

function animateElement(element) {
  element.classList.add('animate-in');
  
  
  if (element.classList.contains('hero')) {
    const h1 = element.querySelector('h1');
    const p = element.querySelector('p');
    
    if (h1) h1.classList.add('animate-in');
    if (p) p.classList.add('animate-in');
  }
}