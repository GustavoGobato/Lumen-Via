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
      routeProblemsQueue.push(report);
      routeProblemsDistances.push(nearest * 111.32); // Aproximação para km
    }
  });
  showNextRouteAlert();
}

// Adicionar função utilitária para obter ícone do problema
function getProblemIcon(tipo) {
  switch (tipo) {
    case 'buraco': return 'road';
    case 'policial': return 'user-shield';
    case 'crime': return 'exclamation-triangle';
    case 'acidente': return 'car-crash';
    case 'poste': return 'lightbulb';
    case 'semaforo': return 'traffic-light';
    default: return 'question-circle';
  }
}

// Variáveis globais para controle do problema exibido
let problemMarker = null;
let problemLine = null;
let lastProblemCoords = null;
let lastProblemInfo = null;

// Função utilitária para encontrar o ponto mais próximo da rota ao problema
function pontoMaisProximoDaRota(problemLat, problemLng, routeCoords) {
  let minDist = Infinity;
  let closest = null;
  routeCoords.forEach(([lat, lng]) => {
    const dist = Math.sqrt(Math.pow(lat - problemLat, 2) + Math.pow(lng - problemLng, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = [lat, lng];
    }
  });
  return closest;
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

    // Após calcular a rota e antes de exibir a rota no mapa:
    // Gerar problema aleatório
    const tiposProblema = [
      { tipo: 'buraco', descricao: 'Buraco na pista' },
      { tipo: 'policial', descricao: 'Blitz policial' },
      { tipo: 'crime', descricao: 'Ocorrência de crime recente' },
      { tipo: 'acidente', descricao: 'Acidente de trânsito' },
      { tipo: 'poste', descricao: 'Poste quebrado' },
      { tipo: 'semaforo', descricao: 'Semáforo quebrado' }
    ];
    const problemaSorteado = tiposProblema[Math.floor(Math.random() * tiposProblema.length)];
    // Gerar raio fictício entre 0.5km e 5km
    const raioProblema = (Math.random() * 4.5 + 0.5).toFixed(2);
    // Posição do problema: próximo ao meio da rota
    let problemaLat = null;
    let problemaLng = null;
    if (routeCoords && routeCoords.length > 0) {
      const meio = Math.floor(routeCoords.length / 2);
      problemaLat = routeCoords[meio][0] + (Math.random() - 0.5) * 0.01;
      problemaLng = routeCoords[meio][1] + (Math.random() - 0.5) * 0.01;
    } else {
      problemaLat = startCoords[0] + (Math.random() - 0.5) * 0.01;
      problemaLng = startCoords[1] + (Math.random() - 0.5) * 0.01;
    }
    // Mostrar modal customizado
    const modal = document.getElementById('route-alert-modal');
    const modalText = document.getElementById('route-alert-text');
    const iconClass = getProblemIcon(problemaSorteado.tipo);
    modalText.innerHTML = `
      <div class='route-alert-problem-icon'><i class="fas fa-${iconClass}"></i></div>
      <strong>Tipo:</strong> ${problemaSorteado.descricao}<br>
      <strong>Distância até o problema:</strong> ${raioProblema} km<br><br>
      Deseja continuar na rota mais otimizada?`;
    modal.classList.remove('hidden');
    const btnDesviar = document.getElementById('route-divert-btn');
    const btnIgnorar = document.getElementById('route-ignore-btn');
    function fecharModal() {
      modal.classList.add('hidden');
      btnDesviar.removeEventListener('click', onDesviar);
      btnIgnorar.removeEventListener('click', onIgnorar);
    }
    function onDesviar() {
      fecharModal();
      // Distância e duração reais
      const distance = (route.properties.summary.distance / 1000).toFixed(2) + ' km';
      const duration = Math.round(route.properties.summary.duration / 60) + ' minutos';
      distanceElement.textContent = distance;
      durationElement.textContent = duration;
      resultsDiv.classList.remove('hidden');
      openGoogleMapsButton.style.display = 'block';
      // Remover destaque
      if (problemMarker) { map.removeLayer(problemMarker); problemMarker = null; }
      if (problemLine) { map.removeLayer(problemLine); problemLine = null; }
      // Adicionar ícone pequeno vermelho de alerta no ponto mais próximo da rota
      if (lastProblemInfo && lastProblemInfo.closest) {
        problemMarker = L.marker(lastProblemInfo.closest, {
          icon: L.divIcon({
            html: `<i class='fas fa-exclamation-triangle' style='color:#ff4444;'></i>`,
            className: 'custom-marker',
            iconSize: [18, 18]
          })
        }).addTo(map);
      }
    }
    function onIgnorar() {
      fecharModal();
      // Apagar rota do mapa
      if (routeLine) {
        routeLine.remove();
        routeLine = null;
      }
      // Apagar marcadores
      markers.forEach(marker => marker.remove());
      markers = [];
      // Limpar campos de endereço
      if (startInput) startInput.value = '';
      if (endInput) endInput.value = '';
      // Remover destaque e ícone de alerta
      if (problemMarker) { map.removeLayer(problemMarker); problemMarker = null; }
      if (problemLine) { map.removeLayer(problemLine); problemLine = null; }
    }
    btnDesviar.addEventListener('click', onDesviar);
    btnIgnorar.addEventListener('click', onIgnorar);

    const btnShowProblem = document.getElementById('route-show-problem-btn');
    btnShowProblem.onclick = () => {
      // Minimizar modal
      modal.classList.add('minimized');
      // Adicionar marcador do problema
      if (problemMarker) { map.removeLayer(problemMarker); problemMarker = null; }
      if (problemLine) { map.removeLayer(problemLine); problemLine = null; }
      const iconClass = getProblemIcon(problemaSorteado.tipo);
      problemMarker = L.marker([problemaLat, problemaLng], {
        icon: L.divIcon({
          html: `<i class='fas fa-${iconClass}'></i>`,
          className: 'custom-marker problem-highlight-marker',
          iconSize: [32, 32]
        })
      }).addTo(map);
      // Calcular ponto mais próximo da rota
      const closestPoint = pontoMaisProximoDaRota(problemaLat, problemaLng, routeCoords);
      // Linha animada da origem até o ponto mais próximo da rota
      problemLine = L.polyline([
        [closestPoint[0], closestPoint[1]],
        [problemaLat, problemaLng]
      ], {
        color: '#ffe066',
        weight: 5,
        dashArray: '8 8',
        className: 'problem-distance-line'
      }).addTo(map);
      // Popup criativo
      const distKm = (Math.sqrt(Math.pow(closestPoint[0] - problemaLat, 2) + Math.pow(closestPoint[1] - problemaLng, 2)) * 111.32).toFixed(2);
      problemMarker.bindPopup(`<b>${problemaSorteado.descricao}</b><br>Distância: <span style='color:#ff4444;font-weight:700;'>${distKm} km</span><br><span style='font-size:0.95em;'>⚡ Atenção: desvie se possível!</span>`).openPopup();
      // Zoom no problema
      map.setView([problemaLat, problemaLng], 16, { animate: true });
      // Salvar para restaurar
      lastProblemCoords = [problemaLat, problemaLng];
      lastProblemInfo = { tipo: problemaSorteado.tipo, descricao: problemaSorteado.descricao, distancia: distKm, closest: closestPoint };
    };
    // Restaurar modal ao clicar nele minimizado
    modal.onclick = (e) => {
      if (modal.classList.contains('minimized') && e.target === modal) {
        modal.classList.remove('minimized');
        if (lastProblemCoords && map) {
          map.setView(lastProblemCoords, 16, { animate: true });
        }
      }
    };
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

// Lista global de problemas para o Lumen Via (igual ao Via Report)
const globalProblems = [
  // Poste Quebrado
  { type: 'poste', lat: -23.5505, lng: -46.6333, description: 'Poste quebrado na Av. Paulista, São Paulo, SP' },
  { type: 'poste', lat: -22.9083, lng: -43.1964, description: 'Poste quebrado na Lapa, Rio de Janeiro, RJ' },
  { type: 'poste', lat: -3.7277, lng: -38.5270, description: 'Poste quebrado no Meireles, Fortaleza, CE' },
  // Buraco
  { type: 'buraco', lat: -23.5610, lng: -46.6550, description: 'Buraco na Av. Paulista, São Paulo, SP' },
  { type: 'buraco', lat: -22.9068, lng: -43.1729, description: 'Buraco em Copacabana, Rio de Janeiro, RJ' },
  { type: 'buraco', lat: -3.7319, lng: -38.5267, description: 'Buraco na Aldeota, Fortaleza, CE' },
  // Acidente
  { type: 'acidente', lat: -23.5405, lng: -46.6233, description: 'Acidente na Marginal Tietê, São Paulo, SP' },
  { type: 'acidente', lat: -22.9707, lng: -43.1823, description: 'Acidente na Lagoa, Rio de Janeiro, RJ' },
  { type: 'acidente', lat: -3.7350, lng: -38.5290, description: 'Acidente na Av. Beira Mar, Fortaleza, CE' },
  // Policial
  { type: 'policial', lat: -23.5489, lng: -46.6388, description: 'Blitz policial na Praça da Sé, São Paulo, SP' },
  { type: 'policial', lat: -22.9121, lng: -43.2302, description: 'Blitz policial na Barra da Tijuca, Rio de Janeiro, RJ' },
  { type: 'policial', lat: -3.7327, lng: -38.5270, description: 'Blitz policial no Centro, Fortaleza, CE' },
  // Crime
  { type: 'crime', lat: -23.5550, lng: -46.6460, description: 'Crime recente na República, São Paulo, SP' },
  { type: 'crime', lat: -22.9150, lng: -43.1970, description: 'Crime recente em Santa Teresa, Rio de Janeiro, RJ' },
  { type: 'crime', lat: -3.7300, lng: -38.5280, description: 'Crime recente em Meireles, Fortaleza, CE' },
  // Pouca luz
  { type: 'pouca_luz', lat: -19.9160, lng: -43.9340, description: 'Pouca luz na Savassi, Belo Horizonte, MG' },
  { type: 'pouca_luz', lat: -8.0470, lng: -34.8775, description: 'Pouca luz em Boa Viagem, Recife, PE' },
  { type: 'pouca_luz', lat: -30.0340, lng: -51.2170, description: 'Pouca luz no Centro Histórico, Porto Alegre, RS' },
  // Semáforo
  { type: 'semaforo', lat: -23.5610, lng: -46.6550, description: 'Semáforo quebrado na Av. Paulista, São Paulo, SP' },
  { type: 'semaforo', lat: -22.9080, lng: -43.1960, description: 'Semáforo quebrado na Lapa, Rio de Janeiro, RJ' },
  { type: 'semaforo', lat: -3.7310, lng: -38.5260, description: 'Semáforo quebrado na Aldeota, Fortaleza, CE' },
  // Sem energia
  { type: 'sem_energia', lat: -16.6860, lng: -49.2640, description: 'Sem energia no Setor Bueno, Goiânia, GO' },
  { type: 'sem_energia', lat: -10.9470, lng: -37.0735, description: 'Sem energia no Centro, Aracaju, SE' },
  { type: 'sem_energia', lat: -27.5950, lng: -48.5485, description: 'Sem energia no Centro, Florianópolis, SC' },
  // Periculosidade
  { type: 'periculosidade', lat: -15.7930, lng: -47.8820, description: 'Área de periculosidade na Esplanada, Brasília, DF' },
  { type: 'periculosidade', lat: -12.9770, lng: -38.5010, description: 'Área de periculosidade no Pelourinho, Salvador, BA' },
  { type: 'periculosidade', lat: -1.4555, lng: -48.5025, description: 'Área de periculosidade no Umarizal, Belém, PA' },
];

function addProblemMarker(problem) {
  let icon;
  let color;
  switch(problem.type) {
    case 'poste': icon = 'lightbulb'; color = '#ff4444'; break;
    case 'buraco': icon = 'road'; color = '#ff8800'; break;
    case 'acidente': icon = 'car-crash'; color = '#ff0000'; break;
    case 'policial': icon = 'user-shield'; color = '#007bff'; break;
    case 'crime': icon = 'exclamation-triangle'; color = '#ff4444'; break;
    case 'pouca_luz': icon = 'moon'; color = '#888'; break;
    case 'semaforo': icon = 'traffic-light'; color = '#2ecc40'; break;
    case 'sem_energia': icon = 'bolt'; color = '#ffbb00'; break;
    case 'periculosidade': icon = 'skull-crossbones'; color = '#222'; break;
    default: icon = 'question'; color = '#888';
  }
  const marker = L.marker([problem.lat, problem.lng], {
    icon: L.divIcon({
      html: `<i class=\"fas fa-${icon}\" style=\"color: ${color}; font-size: 24px;\"></i>`,
      className: 'custom-marker',
      iconSize: [24, 24]
    }),
    interactive: false // Torna o marcador não clicável
  }).addTo(map);
}

document.addEventListener('DOMContentLoaded', () => {
  // Remover o loop que adiciona todos os problemas globais ao carregar o mapa
});

// --- Sistema de Reporte de Problemas (adaptado do via-report.js) ---

// Elementos do sistema de reporte
const openReportModalBtn = document.getElementById('open-report-modal');
const reportModal = document.getElementById('report-modal');
const closeReportModalBtn = document.getElementById('close-report-modal');
const reportForm = document.getElementById('report-form');
const reportSuccess = document.getElementById('report-success');
const useMyLocationBtn = document.getElementById('use-my-location');
const reportLocationInput = document.getElementById('report-location');
let selectedLatLng = null;
let tempMarker = null;
let tempMarkerTimeout = null;
let errorAlertDiv = null;

// Função para mostrar alerta de erro animado
function showErrorAlert(msg) {
  if (errorAlertDiv) errorAlertDiv.remove();
  errorAlertDiv = document.createElement('div');
  errorAlertDiv.className = 'report-error-alert';
  errorAlertDiv.innerHTML = `<i class='fas fa-exclamation-triangle'></i> ${msg}`;
  document.body.appendChild(errorAlertDiv);
  setTimeout(() => {
    errorAlertDiv.classList.add('visible');
  }, 10);
  setTimeout(() => {
    errorAlertDiv.classList.remove('visible');
    setTimeout(() => errorAlertDiv.remove(), 400);
  }, 2200);
}

// Abrir modal
if (openReportModalBtn) {
  openReportModalBtn.addEventListener('click', async () => {
    if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
    reportModal.classList.remove('hidden');
    reportModal.classList.add('modal-anim-in');
    setTimeout(() => reportModal.classList.remove('modal-anim-in'), 500);
    reportSuccess.classList.add('hidden');
    reportForm.reset();
    // Limpar localização ao abrir modal
    if (selectedLatLng) {
      await updateLocationInput(selectedLatLng[0], selectedLatLng[1]);
    } else {
      reportLocationInput.value = '';
    }
    updateUseMyLocationBtn();
  });
}

// Fechar modal
if (closeReportModalBtn) {
  closeReportModalBtn.addEventListener('click', () => {
    reportModal.classList.add('hidden');
    if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
  });
}

// Selecionar localização no mapa
map.on('click', async function(e) {
  if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
  tempMarker = L.marker([e.latlng.lat, e.latlng.lng], {
    icon: L.divIcon({
      html: `<i class='fas fa-map-marker-alt temp-marker-anim'></i>`,
      className: 'custom-marker',
      iconSize: [32, 32]
    }),
    interactive: false
  }).addTo(map);
  selectedLatLng = [e.latlng.lat, e.latlng.lng];
  await updateLocationInput(e.latlng.lat, e.latlng.lng);
  updateUseMyLocationBtn();
  // Destacar botão de reportar problema
  const fabBtn = document.getElementById('open-report-modal');
  if (fabBtn) {
    fabBtn.classList.add('highlight-fab-btn');
    setTimeout(() => fabBtn.classList.remove('highlight-fab-btn'), 1200);
  }
  if (tempMarkerTimeout) clearTimeout(tempMarkerTimeout);
  tempMarkerTimeout = setTimeout(() => {
    if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
  }, 10000);
});

// Atualizar campo de localização
async function updateLocationInput(lat, lng) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    reportLocationInput.value = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    reportLocationInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

// Usar minha localização
if (useMyLocationBtn) {
  useMyLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        selectedLatLng = [pos.coords.latitude, pos.coords.longitude];
        await updateLocationInput(pos.coords.latitude, pos.coords.longitude);
        map.setView(selectedLatLng, 16, { animate: true });
        if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
        tempMarker = L.marker(selectedLatLng, {
          icon: L.divIcon({
            html: `<i class='fas fa-map-marker-alt temp-marker-anim'></i>`,
            className: 'custom-marker',
            iconSize: [32, 32]
          }),
          interactive: false
        }).addTo(map);
        updateUseMyLocationBtn();
      });
    }
  });
}

function updateUseMyLocationBtn() {
  if (!useMyLocationBtn) return;
  if (selectedLatLng) {
    useMyLocationBtn.style.display = 'none';
  } else {
    useMyLocationBtn.style.display = 'block';
  }
}

// Salvar report localmente
function saveLocalReport(report) {
  const reports = getLocalReports();
  reports.push(report);
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Adicionar marcador de novo report
function addNewReportMarker(report) {
  let icon, color;
  switch(report.type) {
    case 'poste': icon = 'lightbulb'; color = '#ff4444'; break;
    case 'buraco': icon = 'road'; color = '#ff8800'; break;
    case 'acidente': icon = 'car-crash'; color = '#ff0000'; break;
    case 'policial': icon = 'user-shield'; color = '#007bff'; break;
    case 'crime': icon = 'exclamation-triangle'; color = '#ff4444'; break;
    case 'pouca_luz': icon = 'moon'; color = '#888'; break;
    case 'semaforo': icon = 'traffic-light'; color = '#2ecc40'; break;
    case 'sem_energia': icon = 'bolt'; color = '#ffbb00'; break;
    case 'periculosidade': icon = 'skull-crossbones'; color = '#222'; break;
    default: icon = 'question'; color = '#888';
  }
  const marker = L.marker([report.lat, report.lng], {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<i class="fas fa-${icon}" style="color: ${color}; font-size: 24px;"></i>`,
      iconSize: [24, 24]
    })
  }).addTo(map);
  marker.bindPopup(`<b>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</b><br>${report.description || ''}`);
}

// Enviar reporte
if (reportForm) {
  reportForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const type = reportForm.elements['report-type'].value;
    const description = reportForm.elements['report-description'].value;
    if (!selectedLatLng) {
      showErrorAlert('Selecione um local no mapa para reportar!');
      return;
    }
    if (!type) {
      showErrorAlert('Selecione o tipo de problema!');
      return;
    }
    // Salvar o report
    const newReport = { type, lat: selectedLatLng[0], lng: selectedLatLng[1], description, date: new Date().toISOString() };
    saveLocalReport(newReport);
    // Fechar modal imediatamente
    reportModal.classList.add('hidden');
    // Mostrar overlay central animado
    showCentralSuccess('Problema reportado com sucesso!', () => {
      // Após animação, dar zoom e adicionar marcador
      map.setView(selectedLatLng, 17, { animate: true, duration: 1.2 });
      // Adicionar novo marcador
      addNewReportMarker(newReport);
    });
  });
}

// Overlay central de sucesso
function showCentralSuccess(msg, cb) {
  let overlay = document.createElement('div');
  overlay.className = 'central-success-overlay visible';
  overlay.innerHTML = `<div class='central-success-content'><i class='fas fa-check-circle'></i><span>${msg}</span></div>`;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.remove();
      if (cb) cb();
    }, 600);
  }, 1600);
}

// Animação da navbar: diminui ao tirar o mouse, volta ao passar o mouse
const navbar = document.querySelector('.navbar');
if (navbar) {
  navbar.addEventListener('mouseleave', () => {
    navbar.classList.add('shrink');
  });
  navbar.addEventListener('mouseenter', () => {
    navbar.classList.remove('shrink');
  });
} 