// Inicialização do mapa
let map = L.map('map').setView([-23.5505, -46.6333], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Elementos do DOM
const startInput = document.getElementById('start');
const endInput = document.getElementById('end');
const calculateButton = document.getElementById('calculate');
const openGoogleMapsButton = document.getElementById('openGoogleMaps');
const resultsDiv = document.getElementById('results');
const distanceElement = document.getElementById('distance');
const durationElement = document.getElementById('duration');
const errorElement = document.getElementById('error');

let markers = [];
let routeLine;

// Função para limpar marcadores e rotas anteriores
function clearMap() {
  markers.forEach(marker => marker.remove());
  markers = [];
  if (routeLine) {
    routeLine.remove();
  }
}

// Função para adicionar marcador
function addMarker(latlng, isStart) {
  const marker = L.marker(latlng, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<i class="fas fa-${isStart ? 'map-marker-alt' : 'flag-checkered'}"></i>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(map);
  markers.push(marker);
}

// Função para calcular rota
async function calculateRoute() {
  try {
    clearMap();
    errorElement.textContent = '';
    resultsDiv.classList.add('hidden');
    openGoogleMapsButton.style.display = 'none';

    // Simulação de coordenadas (em um caso real, usaríamos uma API de geocoding)
    const startCoords = [-23.5505, -46.6333];
    const endCoords = [-23.5605, -46.6433];

    // Adiciona marcadores
    addMarker(startCoords, true);
    addMarker(endCoords, false);

    // Desenha a linha da rota
    const routeCoords = [startCoords, endCoords];
    routeLine = L.polyline(routeCoords, {
      color: '#FFD700',
      weight: 5,
      opacity: 0.7
    }).addTo(map);

    // Ajusta o zoom para mostrar toda a rota
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    // Simula o cálculo de distância e tempo
    const distance = '2.5 km';
    const duration = '10 minutos';

    // Atualiza os resultados
    distanceElement.textContent = distance;
    durationElement.textContent = duration;
    resultsDiv.classList.remove('hidden');
    openGoogleMapsButton.style.display = 'block';

  } catch (error) {
    errorElement.textContent = 'Erro ao calcular a rota. Por favor, tente novamente.';
    console.error('Erro:', error);
  }
}

// Event Listeners
calculateButton.addEventListener('click', calculateRoute);

openGoogleMapsButton.addEventListener('click', () => {
  const start = startInput.value;
  const end = endInput.value;
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}`;
  window.open(url, '_blank');
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