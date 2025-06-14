// Configurações iniciais
const ORS_API_KEY = '5b3ce3597851110001cf6248808852743a2c4b4db7eb20f055825b4b';
let map, routeLayer, markers = [];

// Inicialização do mapa
function initMap() {
  map = L.map('map').setView([-14.2350, -51.9253], 4);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    className: 'map-tiles'
  }).addTo(map);
  
  // Estilo personalizado para o mapa
  const style = document.createElement('style');
  style.textContent = `
    .map-tiles {
      filter: grayscale(30%) contrast(110%) brightness(90%);
    }
    .custom-marker {
      background: ${getComputedStyle(document.documentElement).getPropertyValue('--secondary')};
      width: 24px;
      height: 24px;
      display: block;
      left: -12px;
      top: -12px;
      position: relative;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    .custom-marker::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 10px solid #fff;
    }
    .route-path {
      stroke: ${getComputedStyle(document.documentElement).getPropertyValue('--secondary')};
      stroke-width: 5;
      stroke-opacity: 0.8;
      fill: none;
    }
  `;
  document.head.appendChild(style);
}

// Obter coordenadas do endereço
async function getCoordinates(address) {
  if (!address) throw new Error("Por favor, informe um endereço válido.");
  
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    if (!data.length) throw new Error("Endereço não encontrado. Verifique e tente novamente.");
    
    return {
      lon: parseFloat(data[0].lon),
      lat: parseFloat(data[0].lat),
      display_name: data[0].display_name
    };
  } catch (error) {
    console.error("Erro ao geocodificar:", error);
    throw new Error("Erro ao processar o endereço. Tente novamente.");
  }
}

// Limpar marcadores e rota
function clearMap() {
  if (routeLayer) map.removeLayer(routeLayer);
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

// Calcular rota
async function calculateRoute() {
  const startAddress = document.getElementById('start').value.trim();
  const endAddress = document.getElementById('end').value.trim();
  const resultsSection = document.getElementById('results');
  const calculateBtn = document.getElementById('calculate');
  
  // Validar entradas
  if (!startAddress || !endAddress) {
    showError("Por favor, preencha ambos os endereços.");
    return;
  }
  
  try {
    // Mostrar estado de carregamento
    calculateBtn.disabled = true;
    calculateBtn.innerHTML = '<span>Calculando...</span><i class="fas fa-spinner fa-spin"></i>';
    
    // Obter coordenadas
    const [startCoords, endCoords] = await Promise.all([
      getCoordinates(startAddress),
      getCoordinates(endAddress)
    ]);
    
    // Calcular rota
    const route = await fetchRoute(startCoords, endCoords);
    
    // Atualizar UI
    updateResults(route);
    updateMap(route, startCoords, endCoords);
    resultsSection.style.display = 'block';
    
    // Rolagem suave para os resultados
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
  } catch (error) {
    showError(error.message);
    console.error("Erro ao calcular rota:", error);
  } finally {
    // Restaurar botão
    calculateBtn.disabled = false;
    calculateBtn.innerHTML = '<span>Calcular Rota</span><i class="fas fa-route"></i>';
  }
}

// Buscar rota da API
async function fetchRoute(startCoords, endCoords) {
  const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
    method: 'POST',
    headers: {
      'Authorization': ORS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coordinates: [
        [startCoords.lon, startCoords.lat],
        [endCoords.lon, endCoords.lat]
      ],
      options: {
        avoid_features: ["ferries", "highways"],
        preference: "recommended"
      }
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Erro ao calcular a rota.");
  }
  
  return await response.json();
}

// Atualizar resultados
function updateResults(routeData) {
  const route = routeData.features[0];
  const distance = (route.properties.summary.distance / 1000).toFixed(2);
  const duration = (route.properties.summary.duration / 60).toFixed(0);
  
  document.getElementById('distance').textContent = `${distance} km`;
  document.getElementById('duration').textContent = `${duration} minutos`;
  
  // Calcular impacto ecológico (simplificado)
  const ecoImpact = distance < 10 ? 'Muito baixo' : 
                   distance < 50 ? 'Baixo' : 
                   distance < 200 ? 'Moderado' : 'Alto';
  document.getElementById('eco-impact').textContent = ecoImpact;
}

// Atualizar mapa
function updateMap(routeData, startCoords, endCoords) {
  clearMap();
  
  // Adicionar rota
  routeLayer = L.geoJSON(routeData, {
    style: {
      color: getComputedStyle(document.documentElement).getPropertyValue('--secondary'),
      weight: 5,
      opacity: 0.7,
      className: 'route-path'
    }
  }).addTo(map);
  
  // Adicionar marcadores
  const startIcon = L.divIcon({ className: 'custom-marker start-marker', html: 'A' });
  const endIcon = L.divIcon({ className: 'custom-marker end-marker', html: 'B' });
  
  const startMarker = L.marker([startCoords.lat, startCoords.lon], {
    icon: startIcon,
    title: "Origem"
  }).addTo(map).bindPopup(`<b>Origem:</b><br>${startCoords.display_name}`).openPopup();
  
  const endMarker = L.marker([endCoords.lat, endCoords.lon], {
    icon: endIcon,
    title: "Destino"
  }).addTo(map).bindPopup(`<b>Destino:</b><br>${endCoords.display_name}`);
  
  markers.push(startMarker, endMarker);
  
  // Ajustar visualização
  const bounds = L.latLngBounds(
    L.latLng(startCoords.lat, startCoords.lon),
    L.latLng(endCoords.lat, endCoords.lon)
  );
  map.fitBounds(bounds, { padding: [50, 50] });
}

// Mostrar erro
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  
  // Posicionar após o botão
  const calculateBtn = document.getElementById('calculate');
  calculateBtn.parentNode.insertBefore(errorDiv, calculateBtn.nextSibling);
  
  // Remover após 5 segundos
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  
  document.getElementById('calculate').addEventListener('click', calculateRoute);
  
  // Permitir calcular com Enter
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateRoute();
  });
  
  // CTA button scroll
  document.querySelector('.cta-section .primary-btn').addEventListener('click', () => {
    document.querySelector('.search-container').scrollIntoView({ behavior: 'smooth' });
  });
});