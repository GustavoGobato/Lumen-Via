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

const ORS_API_KEY = '5b3ce3597851110001cf6248808852743a2c4b4db7eb20f055825b4b';

// Pontos fictícios por todo o Brasil (expandido e detalhado)
const fakePoints = [
  // São Paulo - Avenida Paulista e regiões populares
  { type: 'buraco', lat: -23.561414, lng: -46.655881, description: 'Buraco na Av. Paulista, próximo ao MASP' },
  { type: 'poste', lat: -23.563210, lng: -46.654250, description: 'Poste quebrado na Av. Paulista, esquina com Rua Augusta' },
  { type: 'acidente', lat: -23.564224, lng: -46.652857, description: 'Acidente na Av. Paulista, próximo ao Shopping Cidade São Paulo' },
  { type: 'semaforo', lat: -23.561900, lng: -46.656000, description: 'Semáforo piscando na Av. Paulista' },
  { type: 'via', lat: -23.558703, lng: -46.661897, description: 'Via com má condição na Consolação' },
  { type: 'buraco', lat: -23.550520, lng: -46.633308, description: 'Buraco no centro de SP' },
  { type: 'poste', lat: -23.553800, lng: -46.639600, description: 'Poste quebrado na Sé' },
  { type: 'acidente', lat: -23.551000, lng: -46.638000, description: 'Acidente na Liberdade' },
  { type: 'semaforo', lat: -23.555000, lng: -46.640000, description: 'Semáforo com defeito na República' },
  { type: 'via', lat: -23.558000, lng: -46.649000, description: 'Via com má condição na Bela Vista' },
  // Outras capitais e regiões movimentadas
  { type: 'buraco', lat: -22.906847, lng: -43.172896, description: 'Buraco no centro do Rio de Janeiro' },
  { type: 'poste', lat: -12.9714, lng: -38.5014, description: 'Poste quebrado em Salvador' },
  { type: 'acidente', lat: -19.916681, lng: -43.934493, description: 'Acidente em Belo Horizonte' },
  { type: 'semaforo', lat: -15.7942, lng: -47.8822, description: 'Semáforo piscando em Brasília' },
  { type: 'via', lat: -8.0476, lng: -34.8770, description: 'Via com má condição em Recife' },
  { type: 'buraco', lat: -3.7319, lng: -38.5267, description: 'Buraco em Fortaleza' },
  { type: 'poste', lat: -30.0346, lng: -51.2177, description: 'Poste quebrado em Porto Alegre' },
  { type: 'acidente', lat: -25.4284, lng: -49.2733, description: 'Acidente em Curitiba' },
  { type: 'semaforo', lat: -16.6869, lng: -49.2648, description: 'Semáforo com defeito em Goiânia' },
  { type: 'via', lat: -1.4550, lng: -48.5022, description: 'Via com má condição em Belém' },
  // Diversos pontos pelo interior e regiões menos populosas
  { type: 'buraco', lat: -10.9472, lng: -37.0731, description: 'Buraco em Aracaju' },
  { type: 'poste', lat: -2.5307, lng: -44.3068, description: 'Poste quebrado em São Luís' },
  { type: 'acidente', lat: -9.6658, lng: -35.7350, description: 'Acidente em Maceió' },
  { type: 'semaforo', lat: -7.1195, lng: -34.8450, description: 'Semáforo piscando em João Pessoa' },
  { type: 'via', lat: -3.1190, lng: -60.0217, description: 'Via com má condição em Manaus' },
  // Mais pontos em São Paulo (regiões movimentadas)
  { type: 'buraco', lat: -23.567776, lng: -46.648964, description: 'Buraco na Av. Brigadeiro Luís Antônio' },
  { type: 'poste', lat: -23.570000, lng: -46.642000, description: 'Poste quebrado na Av. Nove de Julho' },
  { type: 'acidente', lat: -23.573000, lng: -46.641000, description: 'Acidente na Av. Rebouças' },
  { type: 'semaforo', lat: -23.564000, lng: -46.651000, description: 'Semáforo com defeito na Av. Paulista, próximo ao Trianon' },
  { type: 'via', lat: -23.559000, lng: -46.655000, description: 'Via com má condição na Av. da Consolação' },
  // Pontos aleatórios pelo Brasil
  { type: 'buraco', lat: -20.4697, lng: -54.6201, description: 'Buraco em Campo Grande' },
  { type: 'poste', lat: -22.1200, lng: -51.3926, description: 'Poste quebrado em Presidente Prudente' },
  { type: 'acidente', lat: -5.7945, lng: -35.2110, description: 'Acidente em Natal' },
  { type: 'semaforo', lat: -12.2614, lng: -38.9684, description: 'Semáforo piscando em Feira de Santana' },
  { type: 'via', lat: -21.7857, lng: -43.3434, description: 'Via com má condição em Juiz de Fora' },
  // Mais pontos em SP capital
  { type: 'buraco', lat: -23.5450, lng: -46.6380, description: 'Buraco na Mooca' },
  { type: 'poste', lat: -23.5489, lng: -46.6388, description: 'Poste quebrado no Brás' },
  { type: 'acidente', lat: -23.5515, lng: -46.6333, description: 'Acidente no Anhangabaú' },
  { type: 'semaforo', lat: -23.5530, lng: -46.6390, description: 'Semáforo com defeito na Sé' },
  { type: 'via', lat: -23.5550, lng: -46.6460, description: 'Via com má condição na República' },
  // Pedreira (São Paulo)
  { type: 'buraco', lat: -23.6775, lng: -46.6912, description: 'Buraco na Av. Nossa Senhora do Sabará, Pedreira' },
  { type: 'poste', lat: -23.6782, lng: -46.6930, description: 'Poste quebrado na Rua Antônio de Barros Muniz, Pedreira' },
  { type: 'acidente', lat: -23.6790, lng: -46.6905, description: 'Acidente na Av. do Rio Bonito, Pedreira' },
  // Sabará (São Paulo)
  { type: 'buraco', lat: -23.6700, lng: -46.6840, description: 'Buraco na Rua Sabará' },
  { type: 'poste', lat: -23.6715, lng: -46.6865, description: 'Poste quebrado na Av. Sabará' },
  { type: 'acidente', lat: -23.6722, lng: -46.6850, description: 'Acidente na Av. Nossa Senhora do Sabará, Sabará' },
  // Interlagos (São Paulo)
  { type: 'buraco', lat: -23.7015, lng: -46.6970, description: 'Buraco na Av. Interlagos' },
  { type: 'poste', lat: -23.7030, lng: -46.6955, description: 'Poste quebrado na Av. Interlagos, próximo ao Autódromo' },
  { type: 'acidente', lat: -23.7050, lng: -46.6930, description: 'Acidente na Av. Interlagos, região do Autódromo' },
  { type: 'semaforo', lat: -23.7020, lng: -46.6960, description: 'Semáforo piscando na Av. Interlagos' },
  { type: 'via', lat: -23.7040, lng: -46.6940, description: 'Via com má condição em Interlagos' },
  // E muitos outros pontos fictícios podem ser adicionados conforme desejar
];

const iconMap = {
  poste: { icon: 'lightbulb', color: '#ff4444' },
  buraco: { icon: 'road', color: '#ff8800' },
  acidente: { icon: 'car-crash', color: '#ff0000' },
  via: { icon: 'exclamation-triangle', color: '#FFA500' },
  semaforo: { icon: 'traffic-light', color: '#2ecc40' }
};

async function getCoordinates(address) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await response.json();
  if (!data.length) throw new Error('Endereço não encontrado: ' + address);
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

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

// Funções para LocalStorage (igual Via Report)
function getLocalReports() {
  return JSON.parse(localStorage.getItem('reports') || '[]');
}

// Função para buscar denúncias (agora local)
async function fetchReports() {
  return getLocalReports();
}

// Modal de alerta de problema na rota
const routeAlertModal = document.getElementById('route-alert-modal');
const routeAlertText = document.getElementById('route-alert-text');
const routeDivertBtn = document.getElementById('route-divert-btn');
const routeIgnoreBtn = document.getElementById('route-ignore-btn');
const routeSuccess = document.getElementById('route-success');

function showRouteAlert(problem, distance) {
  routeAlertText.innerHTML = `Problema detectado: <b>${problem.type.charAt(0).toUpperCase() + problem.type.slice(1)}</b><br>Local: ${problem.description}<br>Distância até o problema: <b>${distance.toFixed(2)} km</b><br><br>Deseja desviar da rota?`;
  routeAlertModal.classList.remove('hidden');
}

function hideRouteAlert() {
  routeAlertModal.classList.add('hidden');
}

function showRouteSuccess() {
  routeSuccess.classList.remove('hidden');
  setTimeout(() => {
    routeSuccess.classList.add('hidden');
  }, 2200);
}

// Notificações sequenciais de problemas na rota
let routeProblemsQueue = [];
let routeProblemsDistances = [];

function showNextRouteAlert() {
  if (routeProblemsQueue.length > 0) {
    const problem = routeProblemsQueue.shift();
    const distance = routeProblemsDistances.shift();
    showRouteAlert(problem, distance);
  }
}

routeDivertBtn.addEventListener('click', () => {
  hideRouteAlert();
  showRouteSuccess();
  setTimeout(showNextRouteAlert, 800);
});
routeIgnoreBtn.addEventListener('click', () => {
  hideRouteAlert();
  setTimeout(showNextRouteAlert, 400);
});

// Função para mostrar problemas na rota (local + fictícios)
async function showProblemsOnRoute(routeCoords) {
  const reports = await fetchReports();
  const allPoints = [...reports, ...fakePoints];
  routeProblemsQueue = [];
  routeProblemsDistances = [];
  allPoints.forEach(report => {
    const nearest = routeCoords.reduce((min, [lat, lng]) => {
      const dist = Math.sqrt(Math.pow(lat - report.lat, 2) + Math.pow(lng - report.lng, 2));
      return dist < min ? dist : min;
    }, Infinity);
    if (nearest < 0.0005) {
      const icon = iconMap[report.type]?.icon || 'question';
      const color = iconMap[report.type]?.color || '#888';
      L.marker([report.lat, report.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<i class=\"fas fa-${icon}\" style=\"color: ${color}; font-size: 24px;\"></i>`,
          iconSize: [24, 24]
        })
      }).addTo(map).bindPopup(`<b>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</b><br>${report.description || ''}`);
      // Distância em km (aprox)
      const distKm = nearest * 111.32;
      routeProblemsQueue.push(report);
      routeProblemsDistances.push(distKm);
    }
  });
  showNextRouteAlert();
}

// Função para calcular rota
async function calculateRoute() {
  try {
    clearMap();
    errorElement.textContent = '';
    resultsDiv.classList.add('hidden');
    openGoogleMapsButton.style.display = 'none';

    const startAddress = startInput.value.trim();
    const endAddress = endInput.value.trim();
    if (!startAddress || !endAddress) {
      errorElement.textContent = 'Preencha os dois endereços.';
      return;
    }

    const startCoords = await getCoordinates(startAddress);
    const endCoords = await getCoordinates(endAddress);

    addMarker(startCoords, true);
    addMarker(endCoords, false);

    // Buscar rota real na API OpenRouteService
    const body = {
      coordinates: [
        [startCoords[1], startCoords[0]],
        [endCoords[1], endCoords[0]]
      ]
    };
    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Erro ao calcular rota.');
    const data = await response.json();
    const route = data.features[0];
    const routeCoords = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    routeLine = L.polyline(routeCoords, {
      color: '#FFD700',
      weight: 5,
      opacity: 0.7
    }).addTo(map);
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    // Mostrar problemas na rota
    await showProblemsOnRoute(routeCoords);

    // Distância e duração reais
    const distance = (route.properties.summary.distance / 1000).toFixed(2) + ' km';
    const duration = Math.round(route.properties.summary.duration / 60) + ' minutos';
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

// Exibir todos os problemas fictícios no mapa
function showAllFakePointsOnMap() {
  fakePoints.forEach(point => {
    const icon = iconMap[point.type]?.icon || 'question';
    const color = iconMap[point.type]?.color || '#888';
    L.marker([point.lat, point.lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<i class=\"fas fa-${icon}\" style=\"color: ${color}; font-size: 24px;\"></i>`,
        iconSize: [24, 24]
      })
    }).addTo(map).bindPopup(`<b>${point.type.charAt(0).toUpperCase() + point.type.slice(1)}</b><br>${point.description || ''}`);
  });
}

// Chamar ao carregar a página
showAllFakePointsOnMap(); 