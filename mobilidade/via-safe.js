// Via Safe - JavaScript Principal

// Inicialização do mapa
window.safeMap = L.map('safe-map').setView([-23.5505, -46.6333], 13);
let safeMap = window.safeMap;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(safeMap);

// Variáveis globais
let userLocation = null;
let safeRoute = null;
let problemMarkers = [];
let routeMarkers = [];
let isPanicActive = false;
let emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
let routePreferences = JSON.parse(localStorage.getItem('routePreferences') || {
  avoidCrime: true,
  avoidDark: true,
  avoidProblems: true
});

// Elementos do DOM
const panicButton = document.getElementById('panic-button');
const panicModal = document.getElementById('panic-modal');
const cancelPanicBtn = document.getElementById('cancel-panic');
const confirmPanicBtn = document.getElementById('confirm-panic');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-modal');
const addContactBtn = document.getElementById('add-contact-btn');
const saveSettingsBtn = document.getElementById('save-settings');
const toggleSafeBtn = document.getElementById('toggle-safe');
// Botões de rota e problemas removidos

// Ícones para diferentes tipos de problemas
const problemIcons = {
  poste: { icon: 'lightbulb', color: '#ff4444' },
  buraco: { icon: 'road', color: '#ff8800' },
  policial: { icon: 'user-shield', color: '#007bff' },
  acidente: { icon: 'car-crash', color: '#ff0000' },
  semaforo: { icon: 'traffic-light', color: '#2ecc40' },
  crime: { icon: 'exclamation-triangle', color: '#ff4444' },
  pouca_luz: { icon: 'moon', color: '#888' },
  sem_energia: { icon: 'bolt', color: '#ffbb00' },
  periculosidade: { icon: 'skull-crossbones', color: '#222' }
};

// Função removida - não há mais obtenção de problemas do Via Report

// Função para carregar problemas do Via Report automaticamente
// Função removida - não há mais carregamento de problemas do Via Report

// Função removida - não há mais sincronização

// Função para criar marcador de problema
function createProblemMarker(problem) {
  const iconInfo = problemIcons[problem.type] || { icon: 'question', color: '#888' };
  
  const marker = L.marker([problem.lat, problem.lng], {
    icon: L.divIcon({
      className: 'problem-marker',
      html: `<i class="fas fa-${iconInfo.icon}" style="color: ${iconInfo.color}; font-size: 20px;"></i>`,
      iconSize: [20, 20]
    })
  });

  const popupContent = `
    <div class="problem-popup">
      <h3>${problem.type.charAt(0).toUpperCase() + problem.type.slice(1)}</h3>
      <p>${problem.description || 'Problema reportado'}</p>
      <small>Reportado em: ${new Date(problem.date).toLocaleDateString()}</small>
    </div>
  `;

  marker.bindPopup(popupContent);
  return marker;
}

// Função removida - não há mais exibição de problemas do Via Report

// Função para obter localização do usuário
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          userLocation = [position.coords.latitude, position.coords.longitude];
          resolve(userLocation);
        },
        error => {
          console.error('Erro ao obter localização:', error);
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocalização não suportada'));
    }
  });
}

// Função para calcular rota segura
async function calculateSafeRoute(destination) {
  if (!userLocation) {
    try {
      await getUserLocation();
    } catch (error) {
      showAlert('Erro ao obter sua localização', 'error');
      return;
    }
  }

  // Simular cálculo de rota segura
  // Em implementação real, isso seria integrado com APIs de roteamento
  const problems = []; // Não há mais problemas do Via Report
  
  // Criar pontos intermediários para evitar problemas
  let routePoints = [userLocation];
  
  // Adicionar pontos de desvio se necessário
  problems.forEach(problem => {
    const distance = getDistance(userLocation, [problem.lat, problem.lng]);
    if (distance < 0.5 && routePreferences.avoidProblems) { // 500m
      // Adicionar ponto de desvio
      const detourPoint = calculateDetourPoint(userLocation, [problem.lat, problem.lng]);
      routePoints.push(detourPoint);
    }
  });
  
  routePoints.push(destination);
  
  // Desenhar rota no mapa
  drawSafeRoute(routePoints);
}

// Função para calcular distância entre dois pontos
function getDistance(point1, point2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (point2[0] - point1[0]) * Math.PI / 180;
  const dLon = (point2[1] - point1[1]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Função para calcular ponto de desvio
function calculateDetourPoint(start, problem) {
  // Simular ponto de desvio (em implementação real seria mais complexo)
  const lat = (start[0] + problem[0]) / 2 + (Math.random() - 0.5) * 0.01;
  const lng = (start[1] + problem[1]) / 2 + (Math.random() - 0.5) * 0.01;
  return [lat, lng];
}

// Função para desenhar rota segura
function drawSafeRoute(points) {
  // Limpar rota anterior
  routeMarkers.forEach(marker => safeMap.removeLayer(marker));
  routeMarkers = [];

  // Criar linha da rota
  const routeLine = L.polyline(points, {
    color: '#4caf50',
    weight: 6,
    opacity: 0.8,
    dashArray: '10, 5'
  }).addTo(safeMap);

  // Adicionar marcadores para pontos da rota
  points.forEach((point, index) => {
    const icon = index === 0 ? 'map-marker-alt' : 
                 index === points.length - 1 ? 'flag-checkered' : 'circle';
    const color = index === 0 ? '#4caf50' : 
                  index === points.length - 1 ? '#ff4444' : '#2196f3';
    
    const marker = L.marker(point, {
      icon: L.divIcon({
        className: 'route-marker',
        html: `<i class="fas fa-${icon}" style="color: ${color}; font-size: 16px;"></i>`,
        iconSize: [16, 16]
      })
    }).addTo(safeMap);
    
    routeMarkers.push(marker);
  });

  // Ajustar zoom para mostrar toda a rota
  safeMap.fitBounds(routeLine.getBounds());
}

// Função para mostrar alerta
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#ff4444' : '#4caf50'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    z-index: 10000;
    font-weight: 600;
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// Função para adicionar contato de emergência
function addEmergencyContact() {
  const contactsContainer = document.querySelector('.emergency-contacts');
  const contactItem = document.createElement('div');
  contactItem.className = 'contact-item';
  contactItem.innerHTML = `
    <input type="text" placeholder="Nome" class="contact-name">
    <input type="tel" placeholder="Telefone" class="contact-phone">
    <button class="remove-contact-btn"><i class="fas fa-trash"></i></button>
  `;
  
  contactsContainer.appendChild(contactItem);
  
  // Adicionar evento para remover contato
  const removeBtn = contactItem.querySelector('.remove-contact-btn');
  removeBtn.addEventListener('click', () => {
    contactItem.remove();
  });
}

// Função para salvar configurações
function saveSettings() {
  const contacts = [];
  document.querySelectorAll('.contact-item').forEach(item => {
    const name = item.querySelector('.contact-name').value;
    const phone = item.querySelector('.contact-phone').value;
    if (name && phone) {
      contacts.push({ name, phone });
    }
  });

  const preferences = {
    avoidCrime: document.getElementById('avoid-crime').checked,
    avoidDark: document.getElementById('avoid-dark').checked,
    avoidProblems: document.getElementById('avoid-problems').checked
  };

  localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  localStorage.setItem('routePreferences', JSON.stringify(preferences));
  
  emergencyContacts = contacts;
  routePreferences = preferences;
  
  showAlert('Configurações salvas com sucesso!', 'success');
  settingsModal.classList.add('hidden');
}

// Função para carregar configurações
function loadSettings() {
  // Carregar contatos
  const contactsContainer = document.querySelector('.emergency-contacts');
  contactsContainer.innerHTML = '';
  
  emergencyContacts.forEach(contact => {
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';
    contactItem.innerHTML = `
      <input type="text" placeholder="Nome" class="contact-name" value="${contact.name}">
      <input type="tel" placeholder="Telefone" class="contact-phone" value="${contact.phone}">
      <button class="remove-contact-btn"><i class="fas fa-trash"></i></button>
    `;
    contactsContainer.appendChild(contactItem);
    
    const removeBtn = contactItem.querySelector('.remove-contact-btn');
    removeBtn.addEventListener('click', () => {
      contactItem.remove();
    });
  });

  // Carregar preferências
  document.getElementById('avoid-crime').checked = routePreferences.avoidCrime;
  document.getElementById('avoid-dark').checked = routePreferences.avoidDark;
  document.getElementById('avoid-problems').checked = routePreferences.avoidProblems;
}

// Função para ativar pânico
function activatePanic() {
  isPanicActive = true;
  panicModal.classList.remove('hidden');
  
  // Simular chamada para polícia
  setTimeout(() => {
    showAlert('Chamando a polícia...', 'error');
    
    // Notificar contatos de emergência
    emergencyContacts.forEach(contact => {
      console.log(`Notificando ${contact.name} (${contact.phone})`);
      // Em implementação real, enviaria SMS/email
    });
  }, 1000);
}

// Função para cancelar pânico
function cancelPanic() {
  isPanicActive = false;
  panicModal.classList.add('hidden');
  showAlert('Pânico cancelado', 'info');
}

// Função para confirmar pânico
function confirmPanic() {
  showAlert('Polícia notificada! Mantenha a calma.', 'error');
  panicModal.classList.add('hidden');
  isPanicActive = false;
}

// Função para toggle do Via Safe
function toggleViaSafe() {
  const isActive = toggleSafeBtn.classList.contains('active');
  
  if (isActive) {
    // Fechar Via Safe
    console.log('Fechando Via Safe...');
    
    // Animação de fechamento
    toggleSafeBtn.classList.add('power-off-animation');
    
    setTimeout(() => {
      // Mudar aparência do botão
      toggleSafeBtn.classList.remove('active');
      toggleSafeBtn.classList.add('inactive');
      toggleSafeBtn.classList.remove('power-off-animation');
      toggleSafeBtn.innerHTML = '<i class="fas fa-times-circle"></i><span>Via Safe Fechado</span>';
      
      // ESCONDER O MAPA COMPLETAMENTE
      const mapContainer = document.querySelector('.map-container');
      mapContainer.classList.add('hidden');
      mapContainer.classList.remove('visible');
      
      // Mostrar mensagem de fechado
      showAlert('Via Safe fechado!', 'error');
      
    }, 800);
    
  } else {
    // Abrir Via Safe
    console.log('Abrindo Via Safe...');
    
    // Restaurar aparência do botão
    toggleSafeBtn.classList.remove('inactive');
    toggleSafeBtn.classList.add('active');
    toggleSafeBtn.innerHTML = '<i class="fas fa-shield-alt"></i><span>Via Safe Ativo</span>';
    
    // MOSTRAR O MAPA NOVAMENTE
    const mapContainer = document.querySelector('.map-container');
    mapContainer.classList.add('visible');
    mapContainer.classList.remove('hidden');
    
    // Mostrar mensagem de aberto
    showAlert('Via Safe ativado!', 'success');
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('Via Safe inicializando...');
  
  // Debug: Verificar se o botão foi encontrado
  console.log('Botão toggle encontrado:', toggleSafeBtn);
  console.log('Botão pânico encontrado:', panicButton);
  
  // Event Listeners
  if (panicButton) {
    panicButton.addEventListener('click', activatePanic);
    console.log('Event listener do pânico adicionado');
  }
  if (cancelPanicBtn) cancelPanicBtn.addEventListener('click', cancelPanic);
  if (confirmPanicBtn) confirmPanicBtn.addEventListener('click', confirmPanic);
  if (toggleSafeBtn) {
    toggleSafeBtn.addEventListener('click', () => {
      console.log('Botão toggle clicado!');
      toggleViaSafe();
    });
    console.log('Event listener do toggle adicionado');
  } else {
    console.error('ERRO: Botão toggle não encontrado!');
    // Tentar encontrar o botão novamente
    const retryToggleBtn = document.getElementById('toggle-safe');
    console.log('Tentativa de encontrar botão novamente:', retryToggleBtn);
  }

  // Controles do mapa removidos

  // Configurações
  if (addContactBtn) addContactBtn.addEventListener('click', addEmergencyContact);
  if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);

  // Fechar modal de configurações
  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }
  // Carregar configurações
  loadSettings();
  
  // Não carregar problemas do Via Report mais
  console.log('Via Safe inicializado - sem sincronização com Via Report');
  
  // Toggle de problemas removido
  
  // Obter localização do usuário
  getUserLocation().then(location => {
    const userMarker = L.marker(location, {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<i class="fas fa-user" style="color: #4caf50; font-size: 20px;"></i>',
        iconSize: [20, 20]
      })
    }).addTo(safeMap);
    
    safeMap.setView(location, 15);
  }).catch(error => {
    console.log('Localização não disponível:', error);
  });
});

// Botão de configurações removido - não há mais controles de mapa

// Função para limpar todos os relatórios quando o site for fechado
function clearReportsOnClose() {
  // Limpar localStorage
  localStorage.removeItem('reports');
  
  // Limpar marcadores do Via Safe
  if (problemMarkers) {
    problemMarkers.forEach(marker => {
      if (safeMap.hasLayer(marker)) {
        safeMap.removeLayer(marker);
      }
    });
    problemMarkers = [];
  }
  
  // Limpar marcadores do Via Report também (se estiver aberto)
  if (window.reportMarkers) {
    window.reportMarkers.forEach(marker => {
      if (window.map && window.map.hasLayer(marker)) {
        window.map.removeLayer(marker);
      }
    });
    window.reportMarkers = [];
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

// Teste adicional para garantir que o botão funcione
setTimeout(() => {
  const testToggleBtn = document.getElementById('toggle-safe');
  if (testToggleBtn) {
    console.log('Botão encontrado no timeout:', testToggleBtn);
    testToggleBtn.addEventListener('click', () => {
      console.log('Botão clicado via timeout!');
      toggleViaSafe();
    });
  }
}, 1000);

// Teste direto no window para garantir que funcione
window.testToggleButton = function() {
  const btn = document.getElementById('toggle-safe');
  if (btn) {
    console.log('Testando botão diretamente...');
    btn.click();
  } else {
    console.error('Botão não encontrado no teste direto');
  }
}; 