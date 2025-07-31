// animations.js - Ativação automática de animações

document.addEventListener('DOMContentLoaded', function() {
  // Verifica se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Se não preferir movimento reduzido, ativa as animações
  if (!prefersReducedMotion) {
    activateAnimations();
  }
});

function activateAnimations() {
  // Adiciona a classe global que habilita as animações
  document.body.classList.add('animations-enabled');
  
  // Configura o Intersection Observer para animar elementos quando aparecem
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
  
  // Elementos que devem ser animados
  const elementsToAnimate = document.querySelectorAll(
    '.hero, .solucao-card, .solucoes-content h2'
  );
  
  // Observa cada elemento
  elementsToAnimate.forEach((element, index) => {
    // Adiciona delay progressivo para os cards
    if (element.classList.contains('solucao-card')) {
      element.style.setProperty('--animation-delay', `${index * 0.1}s`);
    }
    observer.observe(element);
  });
}

function animateElement(element) {
  element.classList.add('animate-in');
  
  // Efeito especial para o hero
  if (element.classList.contains('hero')) {
    const h1 = element.querySelector('h1');
    const p = element.querySelector('p');
    
    if (h1) h1.classList.add('animate-in');
    if (p) p.classList.add('animate-in');
  }
}