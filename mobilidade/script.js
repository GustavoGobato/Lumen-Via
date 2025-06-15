// Novo problemas.json de exemplo:
// Salve como problemas.json na mesma pasta do seu HTML

/*
[
  {
    "cep": "04475-060",
    "nome": "Buraco perigoso",
    "tipo": "buraco",
    "raio": 100
  },
  {
    "lat": -23.6829,
    "lon": -46.6407,
    "nome": "Área de risco",
    "tipo": "risco",
    "raio": 80
  }
]
*/

const ORS_API_KEY = '5b3ce3597851110001cf6248808852743a2c4b4db7eb20f055825b4b';

const calculateBtn = document.getElementById("calculate");
const openGoogleMapsBtn = document.getElementById("openGoogleMaps");
const errorDiv = document.getElementById("error");
const resultsDiv = document.getElementById("results");
const distanceSpan = document.getElementById("distance");
const durationSpan = document.getElementById("duration");

let map = L.map('map').setView([-14.2350, -51.9253], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  className: 'map-tiles'
}).addTo(map);

let routeLayer;
let markers = [];

const style = document.createElement('style');
style.textContent = `
  .map-tiles {
    filter: grayscale(20%) contrast(110%) brightness(95%);
  }
  .route-path {
    stroke: ${getComputedStyle(document.documentElement).getPropertyValue('--secondary')};
    stroke-width: 5;
    stroke-opacity: 0.7;
    fill: none;
  }
`;
document.head.appendChild(style);

async function getCoordinates(addressOrCep) {
  if (!addressOrCep) throw new Error("Informe um endereço ou CEP.");
  const geocode = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressOrCep)}`);
  const geoData = await geocode.json();
  if (!geoData.length) throw new Error("Endereço não encontrado: " + addressOrCep);
  return {
    lon: parseFloat(geoData[0].lon),
    lat: parseFloat(geoData[0].lat),
    display_name: geoData[0].display_name
  };
}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

async function calculateRoute() {
  const startAddr = document.getElementById("start").value.trim();
  const endAddr = document.getElementById("end").value.trim();
  errorDiv.style.display = 'none';
  resultsDiv.style.display = 'none';
  openGoogleMapsBtn.style.display = 'none';

  try {
    calculateBtn.disabled = true;
    calculateBtn.innerHTML = '<span>Calculando...</span><i class="fas fa-spinner fa-spin"></i>';

    const [startCoord, endCoord] = await Promise.all([
      getCoordinates(startAddr),
      getCoordinates(endAddr)
    ]);

    const body = {
      coordinates: [
        [startCoord.lon, startCoord.lat],
        [endCoord.lon, endCoord.lat]
      ],
      options: {
        avoid_features: ["ferries", "highways"]
      }
    };

    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error("Erro ao calcular rota.");

    const data = await response.json();
    const route = data.features[0];

    const distancia = (route.properties.summary.distance / 1000).toFixed(2);
    const duracao = (route.properties.summary.duration / 60).toFixed(1);

    distanceSpan.textContent = `${distancia} km`;
    durationSpan.textContent = `${duracao} min`;
    resultsDiv.style.display = 'block';
    openGoogleMapsBtn.style.display = 'flex';

    if (routeLayer) map.removeLayer(routeLayer);
    clearMarkers();

    routeLayer = L.geoJSON(route, {
      style: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--secondary'),
        weight: 5,
        opacity: 0.7,
        className: 'route-path'
      }
    }).addTo(map);

    const startIcon = L.divIcon({ className: 'custom-marker', html: 'A', iconSize: [30, 30] });
    const endIcon = L.divIcon({ className: 'custom-marker', html: 'B', iconSize: [30, 30] });

    const startMarker = L.marker([startCoord.lat, startCoord.lon], { icon: startIcon }).addTo(map).bindPopup(`<b>Origem:</b><br>${startCoord.display_name}`).openPopup();
    const endMarker = L.marker([endCoord.lat, endCoord.lon], { icon: endIcon }).addTo(map).bindPopup(`<b>Destino:</b><br>${endCoord.display_name}`);

    markers.push(startMarker, endMarker);

    const group = new L.featureGroup([routeLayer, startMarker, endMarker]);
    map.fitBounds(group.getBounds(), { padding: [50, 50] });

  } catch (err) {
    console.error(err);
    errorDiv.textContent = err.message || "Erro ao buscar rota. Verifique os endereços e tente novamente.";
    errorDiv.style.display = 'block';
  } finally {
    calculateBtn.disabled = false;
    calculateBtn.innerHTML = '<span>Calcular Rota</span><i class="fas fa-route"></i>';
  }
}

calculateBtn.addEventListener("click", calculateRoute);

openGoogleMapsBtn.addEventListener("click", () => {
  const startAddr = document.getElementById("start").value.trim();
  const endAddr = document.getElementById("end").value.trim();
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startAddr)}&destination=${encodeURIComponent(endAddr)}`;
  window.open(url, '_blank');
});

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') calculateRoute();
});

// Animações para os botões
function addButtonAnimations() {
  const buttons = document.querySelectorAll('.primary-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Animações para as abas
function addTabAnimations() {
  const tabs = document.querySelectorAll('.nav-tab:not(.disabled)');
  
  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    tab.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Controle do header ao rolar
function handleScrollHeader() {
  const navbar = document.querySelector('.navbar');
  const scrollPosition = window.scrollY;
  
  if (scrollPosition > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Inicializar animações
document.addEventListener('DOMContentLoaded', () => {
  addButtonAnimations();
  addTabAnimations();
  
  // Adicionar evento de scroll
  window.addEventListener('scroll', handleScrollHeader);
  // Verificar posição inicial
  handleScrollHeader();
});
