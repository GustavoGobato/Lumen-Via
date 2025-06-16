// Inicialização do mapa
let map = L.map('report-map').setView([-23.5505, -46.6333], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Elementos do DOM
const reportButton = document.getElementById('report-problem');

// Array para armazenar os problemas reportados
let reportedProblems = [];

// Função para adicionar marcador de problema
function addProblemMarker(latlng, type) {
  const markerIcons = {
    'poste': 'lightbulb',
    'buraco': 'road',
    'acidente': 'car-crash'
  };

  const markerColors = {
    'poste': '#ff4444',
    'buraco': '#ff8800',
    'acidente': '#ff0000'
  };

  const marker = L.marker(latlng, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<i class="fas fa-${markerIcons[type]}" style="color: ${markerColors[type]};"></i>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(map);

  reportedProblems.push({
    marker: marker,
    type: type,
    location: latlng
  });

  // Adiciona popup com informações do problema
  marker.bindPopup(`
    <div class="problem-popup">
      <h3>Problema Reportado</h3>
      <p>Tipo: ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
      <p>Status: Em análise</p>
    </div>
  `).openPopup();
}

// Função para abrir modal de reporte
function openReportModal(latlng) {
  // Simula a seleção do tipo de problema (em um caso real, teríamos um modal)
  const problemTypes = ['poste', 'buraco', 'acidente'];
  const randomType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
  
  addProblemMarker(latlng, randomType);
}

// Event Listeners
map.on('click', function(e) {
  openReportModal(e.latlng);
});

// Animação suave ao rolar para as seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
}); 