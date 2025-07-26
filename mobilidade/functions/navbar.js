document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Impede a rolagem do corpo quando o menu está aberto
    document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
  });
  
  // Fechar o menu quando um link for clicado
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
});