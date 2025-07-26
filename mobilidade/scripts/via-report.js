// Inicialização do mapa
let map = L.map('report-map').setView([-23.5505, -46.6333], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Elementos do DOM
const reportButton = document.getElementById('report-problem');

// Array para armazenar os problemas reportados
let reportedProblems = [];

// Lista global de problemas para o Via Report (todos os tipos)
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
  // Inicializar array se não existir
  if (!window.reportMarkers) {
    window.reportMarkers = [];
  }

  const reports = await fetchReports();
  
  // Adicionar apenas novos reports que ainda não estão no mapa
  reports.forEach(report => {
    // Verificar se este report já existe no mapa
    const existingMarker = window.reportMarkers.find(marker => 
      marker._latlng.lat === report.lat && 
      marker._latlng.lng === report.lng && 
      marker._reportType === report.type
    );
    
    if (!existingMarker) {
      const { icon, color } = getReportIconAndColor(report.type);
      const marker = L.marker([report.lat, report.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<i class="fas fa-${icon}" style="color: ${color}; font-size: 24px;"></i>`,
          iconSize: [24, 24]
        })
      }).addTo(map);
      
      marker.bindPopup(`<b>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</b><br>${report.description || ''}`);
      marker._reportType = report.type; // Marcar o tipo para identificação
      window.reportMarkers.push(marker);
    }
  });
}

// Função para adicionar apenas um novo marcador
function addNewReportMarker(report) {
  const { icon, color } = getReportIconAndColor(report.type);
  const marker = L.marker([report.lat, report.lng], {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<i class="fas fa-${icon}" style="color: ${color}; font-size: 24px;"></i>`,
      iconSize: [24, 24]
    })
  }).addTo(map);
  
  marker.bindPopup(`<b>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</b><br>${report.description || ''}`);
  marker._reportType = report.type;
  window.reportMarkers.push(marker);
}

// Função para registrar nova denúncia (agora local)
async function sendReport(type, lat, lng, description) {
  const newReport = { type, lat, lng, description, date: new Date().toISOString() };
  saveLocalReport(newReport);
  await showReportsOnMap();
}

// Função para limpar todos os relatórios quando o site for fechado
function clearReportsOnClose() {
  // Limpar localStorage
  localStorage.removeItem('reports');
  
  // Limpar marcadores do mapa
  if (window.reportMarkers) {
    window.reportMarkers.forEach(marker => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    window.reportMarkers = [];
  }
  
  // Limpar marcadores do Via Safe também
  if (window.problemMarkers) {
    window.problemMarkers.forEach(marker => {
      if (window.safeMap && window.safeMap.hasLayer(marker)) {
        window.safeMap.removeLayer(marker);
      }
    });
    window.problemMarkers = [];
  }
}

// Adicionar listener para quando a página for fechada (apenas quando realmente fechar)
window.addEventListener('pagehide', function(e) {
  // Só limpar se realmente estiver fechando o site
  if (e.persisted === false) {
    clearReportsOnClose();
  }
});

// NÃO limpar quando mudar de aba ou recarregar
window.addEventListener('beforeunload', function(e) {
  // Não fazer nada aqui - só limpar no pagehide
});

// Função para obter ícone e cor do tipo de problema
function getReportIconAndColor(type) {
  switch(type) {
    case 'poste': return { icon: 'lightbulb', color: '#ff4444' };
    case 'buraco': return { icon: 'road', color: '#ff8800' };
    case 'policial': return { icon: 'user-shield', color: '#007bff' };
    case 'acidente': return { icon: 'car-crash', color: '#ff0000' };
    case 'semaforo': return { icon: 'traffic-light', color: '#2ecc40' };
    case 'crime': return { icon: 'exclamation-triangle', color: '#ff4444' };
    case 'pouca_luz': return { icon: 'moon', color: '#888' };
    case 'sem_energia': return { icon: 'bolt', color: '#ffbb00' };
    case 'periculosidade': return { icon: 'skull-crossbones', color: '#222' };
    default: return { icon: 'question', color: '#888' };
  }
}

// Modal e botões
const openReportModalBtn = document.getElementById('open-report-modal');
const reportModal = document.getElementById('report-modal');
const closeReportModalBtn = document.getElementById('close-report-modal');
const reportForm = document.getElementById('report-form');
const reportSuccess = document.getElementById('report-success');
const useMyLocationBtn = document.getElementById('use-my-location');
const reportLocationInput = document.getElementById('report-location');
let selectedLatLng = null;
let selectedStreetLayer = null;
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

// Função para mostrar overlay animado de sucesso no centro da tela
function showCentralSuccess(msg, callback) {
  let overlay = document.createElement('div');
  overlay.className = 'central-success-overlay';
  overlay.innerHTML = `
    <div class="central-success-content">
      <i class="fas fa-check-circle"></i>
      <span>${msg}</span>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('visible'), 10);
  setTimeout(() => {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 500);
  }, 1500);
}

// Função para buscar endereço reverso via Nominatim
async function getAddressFromCoords(lat, lng) {
  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=pt-BR`);
    const data = await resp.json();
    if (data && data.display_name) {
      // Montar endereço resumido
      let parts = [];
      if (data.address.road) parts.push(data.address.road);
      if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
      if (data.address.suburb) parts.push(data.address.suburb);
      if (data.address.city) parts.push(data.address.city);
      else if (data.address.town) parts.push(data.address.town);
      else if (data.address.village) parts.push(data.address.village);
      if (data.address.state) parts.push(data.address.state);
      if (data.address.country) parts.push(data.address.country);
      return parts.join(', ');
    }
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

// Atualizar campo de localização com endereço
async function updateLocationInput(lat, lng) {
  reportLocationInput.value = 'Buscando endereço...';
  const address = await getAddressFromCoords(lat, lng);
  reportLocationInput.value = address;
}

function updateUseMyLocationBtn() {
  if (!selectedLatLng) {
    useMyLocationBtn.style.display = 'block';
  } else {
    useMyLocationBtn.style.display = 'none';
  }
}

// Abrir modal
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

// Fechar modal
closeReportModalBtn.addEventListener('click', () => {
  reportModal.classList.add('hidden');
});

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

// Usar localização automática
useMyLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      selectedLatLng = [pos.coords.latitude, pos.coords.longitude];
      await updateLocationInput(pos.coords.latitude, pos.coords.longitude);
      updateUseMyLocationBtn();
    }, () => {
      showErrorAlert('Não foi possível obter sua localização.');
    });
  } else {
    showErrorAlert('Geolocalização não suportada.');
  }
});

// Permitir reportar problema apenas ao clicar em uma rua (feature do mapa)
// Supondo que as ruas são camadas GeoJSON ou similares, exemplo:
// Adapte para sua fonte de dados de ruas, aqui um exemplo genérico:
if (typeof reportMap !== 'undefined') {
  reportMap.eachLayer(function(layer) {
    if (layer.feature && layer.feature.geometry && layer.feature.geometry.type === 'LineString') {
      layer.on('click', async function(e) {
        if (selectedStreetLayer) {
          selectedStreetLayer.setStyle && selectedStreetLayer.setStyle({ color: '#ffe066', weight: 4 });
        }
        selectedStreetLayer = layer;
        layer.setStyle && layer.setStyle({ color: '#ff4444', weight: 7, dashArray: '8 4' });
        selectedLatLng = [e.latlng.lat, e.latlng.lng];
        await updateLocationInput(e.latlng.lat, e.latlng.lng);
        // Destacar botão de reportar problema
        const reportBtn = document.getElementById('report-problem');
        if (reportBtn) {
          reportBtn.classList.add('highlight-report-btn');
          setTimeout(() => reportBtn.classList.remove('highlight-report-btn'), 1200);
        }
      });
      layer.setStyle && layer.setStyle({ color: '#ffe066', weight: 4 });
      layer.on('mouseover', function() { this.setStyle && this.setStyle({ color: '#ffbb00', weight: 6 }); });
      layer.on('mouseout', function() {
        if (selectedStreetLayer !== layer) {
          this.setStyle && this.setStyle({ color: '#ffe066', weight: 4 });
        }
      });
    }
  });
}

// Botão de reportar problema só abre modal se houver rua selecionada
const reportBtn = document.getElementById('report-problem');
if (reportBtn) {
  reportBtn.onclick = () => {
    if (!selectedLatLng) {
      alert('Selecione uma rua no mapa para reportar um problema.');
      return;
    }
    reportModal.classList.remove('hidden');
    reportSuccess.classList.add('hidden');
    reportForm.reset();
  };
}

// Enviar reporte
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
    
    // Atualizar problemas no Via Safe imediatamente
    if (window.safeMap && typeof window.addNewProblemToSafe === 'function') {
      console.log('Adicionando novo problema ao Via Safe...');
      window.addNewProblemToSafe(newReport);
    }
  });
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

// Inicializar marcadores quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  showReportsOnMap();
}); 