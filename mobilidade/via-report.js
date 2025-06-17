// Inicialização do mapa
let map = L.map('report-map').setView([-23.5505, -46.6333], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Elementos do DOM
const reportButton = document.getElementById('report-problem');

// Array para armazenar os problemas reportados
let reportedProblems = [];

// Pontos fictícios por todo o Brasil
const fakePoints = [
  // Semáforos
  { type: 'semaforo', lat: -23.561684, lng: -46.625378, description: 'Semáforo funcionando normalmente' },
  { type: 'semaforo', lat: -22.906847, lng: -43.172896, description: 'Semáforo piscando' },
  { type: 'semaforo', lat: -19.916681, lng: -43.934493, description: 'Semáforo com possível defeito' },
  // Postes quebrados
  { type: 'poste', lat: -23.55052, lng: -46.633308, description: 'Poste quebrado na Av. Paulista' },
  { type: 'poste', lat: -12.9714, lng: -38.5014, description: 'Poste quebrado em Salvador' },
  // Acidentes
  { type: 'acidente', lat: -30.0346, lng: -51.2177, description: 'Acidente em Porto Alegre' },
  { type: 'acidente', lat: -3.7319, lng: -38.5267, description: 'Acidente em Fortaleza' },
  // Buracos
  { type: 'buraco', lat: -15.7942, lng: -47.8822, description: 'Buraco em Brasília' },
  { type: 'buraco', lat: -8.0476, lng: -34.8770, description: 'Buraco em Recife' },
  // Problemas em vias
  { type: 'via', lat: -22.9083, lng: -47.0632, description: 'Via com má condição em Campinas' },
  { type: 'via', lat: -25.4284, lng: -49.2733, description: 'Via com má condição em Curitiba' },
];

// Ícones para cada tipo
const iconMap = {
  poste: { icon: 'lightbulb', color: '#ff4444' },
  buraco: { icon: 'road', color: '#ff8800' },
  acidente: { icon: 'car-crash', color: '#ff0000' },
  via: { icon: 'exclamation-triangle', color: '#FFA500' },
  semaforo: { icon: 'traffic-light', color: '#2ecc40' }
};

// Funções para LocalStorage
function getLocalReports() {
  return JSON.parse(localStorage.getItem('reports') || '[]');
}

function saveLocalReport(report) {
  const reports = getLocalReports();
  reports.push(report);
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Função para buscar denúncias (agora local)
async function fetchReports() {
  return getLocalReports();
}

// Função para exibir denúncias no mapa
async function showReportsOnMap() {
  if (window.reportMarkers) {
    window.reportMarkers.forEach(m => m.remove());
  }
  window.reportMarkers = [];

  const reports = await fetchReports();
  reports.forEach(report => {
    const iconType = report.type === 'poste' ? 'lightbulb' : report.type === 'buraco' ? 'road' : 'car-crash';
    const color = report.type === 'poste' ? '#ff4444' : report.type === 'buraco' ? '#ff8800' : '#ff0000';
    const marker = L.marker([report.lat, report.lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<i class="fas fa-${iconType}" style="color: ${color}; font-size: 24px;"></i>`,
        iconSize: [24, 24]
      })
    }).addTo(map);
    marker.bindPopup(`<b>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</b><br>${report.description || ''}`);
    window.reportMarkers.push(marker);
  });
}

// Função para registrar nova denúncia (agora local)
async function sendReport(type, lat, lng, description) {
  saveLocalReport({ type, lat, lng, description, date: new Date().toISOString() });
  await showReportsOnMap();
}

// Modal de denúncia
let currentLatLng = null;
const reportModal = document.getElementById('report-modal');
const reportType = document.getElementById('report-type');
const reportDesc = document.getElementById('report-desc');
const sendReportBtn = document.getElementById('send-report-btn');
const closeReportBtn = document.getElementById('close-report-btn');
const reportSuccess = document.getElementById('report-success');

function openReportModal(latlng) {
  currentLatLng = latlng;
  reportModal.classList.remove('hidden');
}

function closeReportModal() {
  reportModal.classList.add('hidden');
  reportType.value = 'poste';
  reportDesc.value = '';
  currentLatLng = null;
}

function showSuccessMessage() {
  reportSuccess.classList.remove('hidden');
  setTimeout(() => {
    reportSuccess.classList.add('hidden');
  }, 2200);
}

sendReportBtn.addEventListener('click', () => {
  if (!currentLatLng) return;
  sendReport(reportType.value, currentLatLng.lat, currentLatLng.lng, reportDesc.value);
  closeReportModal();
  showSuccessMessage();
});

closeReportBtn.addEventListener('click', closeReportModal);

// Ao clicar no mapa, abrir modal
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

// Adicionar pontos fictícios ao mapa
function showFakePointsOnMap() {
  fakePoints.forEach(point => {
    const { icon, color } = iconMap[point.type] || { icon: 'question', color: '#888' };
    const marker = L.marker([point.lat, point.lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<i class="fas fa-${icon}" style="color: ${color}; font-size: 24px;"></i>`,
        iconSize: [24, 24]
      })
    }).addTo(map);
    marker.bindPopup(`<b>${point.type.charAt(0).toUpperCase() + point.type.slice(1)}</b><br>${point.description || ''}<br><button onclick="window.reportFakePoint('${point.type}', ${point.lat}, ${point.lng}, '${point.description.replace(/'/g, '')}')">Reportar problema aqui</button>`);
  });
}

// Para pontos fictícios, sobrescrever a função global
window.reportFakePoint = function(type, lat, lng, description) {
  reportModal.classList.remove('hidden');
  currentLatLng = { lat, lng };
  reportType.value = type;
  reportDesc.value = description;
};

// Inicializar o mapa com as denúncias do backend
showReportsOnMap();
// Chamar após inicializar o mapa
showFakePointsOnMap(); 