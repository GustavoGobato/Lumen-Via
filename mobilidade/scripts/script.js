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

let map;
const mapElement = document.getElementById('map');
if (mapElement) {
  map = L.map('map').setView([-14.2350, -51.9253], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    className: 'map-tiles'
  }).addTo(map);
}

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

// Lista global de problemas (expandida para todas as capitais)
const globalProblems = [
  // Acre - Rio Branco
  { type: 'buraco', lat: -9.97499, lng: -67.8243, description: 'Buraco na Av. Ceará, Rio Branco, AC' },
  { type: 'poste', lat: -9.9765, lng: -67.8221, description: 'Poste quebrado no Centro, Rio Branco, AC' },
  { type: 'policial', lat: -9.9782, lng: -67.8106, description: 'Blitz policial na Via Verde, Rio Branco, AC' },
  { type: 'acidente', lat: -9.9700, lng: -67.8360, description: 'Acidente na Estrada do Calafate, Rio Branco, AC' },
  // Alagoas - Maceió
  { type: 'buraco', lat: -9.6658, lng: -35.7350, description: 'Buraco na Ponta Verde, Maceió, AL' },
  { type: 'poste', lat: -9.6498, lng: -35.7089, description: 'Poste quebrado no Farol, Maceió, AL' },
  { type: 'policial', lat: -9.6486, lng: -35.7202, description: 'Blitz policial na Jatiúca, Maceió, AL' },
  { type: 'acidente', lat: -9.6742, lng: -35.7351, description: 'Acidente na Av. Fernandes Lima, Maceió, AL' },
  // Amapá - Macapá
  { type: 'buraco', lat: 0.0349, lng: -51.0694, description: 'Buraco no Centro, Macapá, AP' },
  { type: 'poste', lat: 0.0389, lng: -51.0664, description: 'Poste quebrado na Av. FAB, Macapá, AP' },
  { type: 'policial', lat: 0.0300, lng: -51.0700, description: 'Blitz policial no Trem, Macapá, AP' },
  { type: 'acidente', lat: 0.0250, lng: -51.0700, description: 'Acidente na Av. Padre Júlio, Macapá, AP' },
  // Amazonas - Manaus
  { type: 'buraco', lat: -3.1190, lng: -60.0217, description: 'Buraco no Centro, Manaus, AM' },
  { type: 'poste', lat: -3.1019, lng: -60.0250, description: 'Poste quebrado na Av. Djalma Batista, Manaus, AM' },
  { type: 'policial', lat: -3.1316, lng: -59.9822, description: 'Blitz policial no Adrianópolis, Manaus, AM' },
  { type: 'acidente', lat: -3.1274, lng: -60.0238, description: 'Acidente na Ponta Negra, Manaus, AM' },
  // Bahia - Salvador
  { type: 'buraco', lat: -12.9718, lng: -38.5011, description: 'Buraco na Av. Sete de Setembro, Salvador, BA' },
  { type: 'poste', lat: -12.9777, lng: -38.5016, description: 'Poste danificado no Pelourinho, Salvador, BA' },
  { type: 'policial', lat: -12.9822, lng: -38.4813, description: 'Blitz policial na Barra, Salvador, BA' },
  { type: 'acidente', lat: -12.9958, lng: -38.5108, description: 'Acidente na Av. Paralela, Salvador, BA' },
  // Ceará - Fortaleza
  { type: 'buraco', lat: -3.7319, lng: -38.5267, description: 'Buraco na Aldeota, Fortaleza, CE' },
  { type: 'poste', lat: -3.7277, lng: -38.5270, description: 'Poste quebrado no Meireles, Fortaleza, CE' },
  { type: 'policial', lat: -3.7327, lng: -38.5270, description: 'Blitz policial no Centro, Fortaleza, CE' },
  { type: 'acidente', lat: -3.7350, lng: -38.5290, description: 'Acidente na Av. Beira Mar, Fortaleza, CE' },
  // Espírito Santo - Vitória
  { type: 'buraco', lat: -20.3155, lng: -40.3128, description: 'Buraco na Praia do Canto, Vitória, ES' },
  { type: 'poste', lat: -20.3194, lng: -40.3382, description: 'Poste quebrado no Centro, Vitória, ES' },
  { type: 'policial', lat: -20.3222, lng: -40.3400, description: 'Blitz policial em Jardim da Penha, Vitória, ES' },
  { type: 'acidente', lat: -20.3250, lng: -40.3450, description: 'Acidente na Av. Reta da Penha, Vitória, ES' },
  // Goiás - Goiânia
  { type: 'buraco', lat: -16.6869, lng: -49.2648, description: 'Buraco no Setor Bueno, Goiânia, GO' },
  { type: 'poste', lat: -16.6785, lng: -49.2535, description: 'Poste quebrado no Centro, Goiânia, GO' },
  { type: 'policial', lat: -16.6840, lng: -49.2550, description: 'Blitz policial no Setor Oeste, Goiânia, GO' },
  { type: 'acidente', lat: -16.6900, lng: -49.2700, description: 'Acidente na Av. T-63, Goiânia, GO' },
  // Maranhão - São Luís
  { type: 'buraco', lat: -2.5307, lng: -44.3068, description: 'Buraco no Renascença, São Luís, MA' },
  { type: 'poste', lat: -2.5295, lng: -44.3028, description: 'Poste quebrado no Centro, São Luís, MA' },
  { type: 'policial', lat: -2.5300, lng: -44.3000, description: 'Blitz policial na Ponta d"Areia, São Luís, MA' },
  { type: 'acidente', lat: -2.5320, lng: -44.3100, description: 'Acidente na Av. dos Holandeses, São Luís, MA' },
  // Mato Grosso - Cuiabá
  { type: 'buraco', lat: -15.5958, lng: -56.0927, description: 'Buraco na Av. do CPA, Cuiabá, MT' },
  { type: 'poste', lat: -15.6014, lng: -56.0979, description: 'Poste caído no Centro, Cuiabá, MT' },
  { type: 'policial', lat: -15.6146, lng: -56.1042, description: 'Blitz policial no Bosque da Saúde, Cuiabá, MT' },
  { type: 'acidente', lat: -15.5898, lng: -56.0816, description: 'Acidente na Av. Fernando Corrêa, Cuiabá, MT' },
  // Mato Grosso do Sul - Campo Grande
  { type: 'buraco', lat: -20.4697, lng: -54.6201, description: 'Buraco no Centro, Campo Grande, MS' },
  { type: 'poste', lat: -20.4486, lng: -54.6295, description: 'Poste quebrado na Vila Glória, Campo Grande, MS' },
  { type: 'policial', lat: -20.4630, lng: -54.6110, description: 'Blitz policial na Moreninha, Campo Grande, MS' },
  { type: 'acidente', lat: -20.4800, lng: -54.6200, description: 'Acidente na Av. Afonso Pena, Campo Grande, MS' },
  // Minas Gerais - Belo Horizonte
  { type: 'buraco', lat: -19.9167, lng: -43.9345, description: 'Buraco na Savassi, Belo Horizonte, MG' },
  { type: 'poste', lat: -19.9208, lng: -43.9378, description: 'Poste quebrado no Centro, Belo Horizonte, MG' },
  { type: 'policial', lat: -19.9245, lng: -43.9352, description: 'Blitz policial no Funcionários, Belo Horizonte, MG' },
  { type: 'acidente', lat: -19.9150, lng: -43.9260, description: 'Acidente na Av. Afonso Pena, Belo Horizonte, MG' },
  // Pará - Belém
  { type: 'buraco', lat: -1.4550, lng: -48.5022, description: 'Buraco no Umarizal, Belém, PA' },
  { type: 'poste', lat: -1.4500, lng: -48.4900, description: 'Poste quebrado no Centro, Belém, PA' },
  { type: 'policial', lat: -1.4520, lng: -48.4950, description: 'Blitz policial em Nazaré, Belém, PA' },
  { type: 'acidente', lat: -1.4600, lng: -48.5100, description: 'Acidente na Av. Almirante Barroso, Belém, PA' },
  // Paraíba - João Pessoa
  { type: 'buraco', lat: -7.1195, lng: -34.8450, description: 'Buraco em Tambaú, João Pessoa, PB' },
  { type: 'poste', lat: -7.1153, lng: -34.8631, description: 'Poste quebrado no Centro, João Pessoa, PB' },
  { type: 'policial', lat: -7.1200, lng: -34.8700, description: 'Blitz policial em Manaíra, João Pessoa, PB' },
  { type: 'acidente', lat: -7.1300, lng: -34.8500, description: 'Acidente na Av. Epitácio Pessoa, João Pessoa, PB' },
  // Paraná - Curitiba
  { type: 'buraco', lat: -25.4411, lng: -49.2769, description: 'Buraco na Av. Batel, Curitiba, PR' },
  { type: 'poste', lat: -25.4284, lng: -49.2733, description: 'Poste caído no Centro, Curitiba, PR' },
  { type: 'policial', lat: -25.4372, lng: -49.2691, description: 'Blitz policial no Juvevê, Curitiba, PR' },
  { type: 'acidente', lat: -25.4481, lng: -49.2765, description: 'Acidente no Parque Barigui, Curitiba, PR' },
  // Pernambuco - Recife
  { type: 'buraco', lat: -8.0476, lng: -34.8770, description: 'Buraco em Boa Viagem, Recife, PE' },
  { type: 'poste', lat: -8.0522, lng: -34.8726, description: 'Poste quebrado no Centro, Recife, PE' },
  { type: 'policial', lat: -8.0543, lng: -34.8813, description: 'Blitz policial em Casa Forte, Recife, PE' },
  { type: 'acidente', lat: -8.0600, lng: -34.8800, description: 'Acidente na Av. Agamenon Magalhães, Recife, PE' },
  // Piauí - Teresina
  { type: 'buraco', lat: -5.0892, lng: -42.8016, description: 'Buraco no Centro, Teresina, PI' },
  { type: 'poste', lat: -5.0827, lng: -42.8000, description: 'Poste quebrado na Piçarra, Teresina, PI' },
  { type: 'policial', lat: -5.0850, lng: -42.8100, description: 'Blitz policial no Dirceu, Teresina, PI' },
  { type: 'acidente', lat: -5.0900, lng: -42.8200, description: 'Acidente na Av. Frei Serafim, Teresina, PI' },
  // Rio de Janeiro - Rio de Janeiro
  { type: 'buraco', lat: -22.9068, lng: -43.1729, description: 'Buraco em Copacabana, Rio de Janeiro, RJ' },
  { type: 'poste', lat: -22.9083, lng: -43.1964, description: 'Poste quebrado na Lapa, Rio de Janeiro, RJ' },
  { type: 'policial', lat: -22.9121, lng: -43.2302, description: 'Blitz policial na Barra da Tijuca, Rio de Janeiro, RJ' },
  { type: 'acidente', lat: -22.9707, lng: -43.1823, description: 'Acidente na Lagoa, Rio de Janeiro, RJ' },
  // Rio Grande do Norte - Natal
  { type: 'buraco', lat: -5.7945, lng: -35.2110, description: 'Buraco em Ponta Negra, Natal, RN' },
  { type: 'poste', lat: -5.7935, lng: -35.2090, description: 'Poste quebrado no Centro, Natal, RN' },
  { type: 'policial', lat: -5.7900, lng: -35.2000, description: 'Blitz policial em Lagoa Nova, Natal, RN' },
  { type: 'acidente', lat: -5.8000, lng: -35.2200, description: 'Acidente na Av. Salgado Filho, Natal, RN' },
  // Rio Grande do Sul - Porto Alegre
  { type: 'buraco', lat: -30.0277, lng: -51.2287, description: 'Buraco na Av. Ipiranga, Porto Alegre, RS' },
  { type: 'poste', lat: -30.0346, lng: -51.2177, description: 'Poste caído no Centro Histórico, Porto Alegre, RS' },
  { type: 'policial', lat: -30.0325, lng: -51.2304, description: 'Blitz policial no Moinhos de Vento, Porto Alegre, RS' },
  { type: 'acidente', lat: -30.0405, lng: -51.2146, description: 'Acidente na Orla do Guaíba, Porto Alegre, RS' },
  // Rondônia - Porto Velho
  { type: 'buraco', lat: -8.7612, lng: -63.9039, description: 'Buraco no Centro, Porto Velho, RO' },
  { type: 'poste', lat: -8.7600, lng: -63.9000, description: 'Poste quebrado na Nova Porto Velho, Porto Velho, RO' },
  { type: 'policial', lat: -8.7550, lng: -63.9050, description: 'Blitz policial no Areal, Porto Velho, RO' },
  { type: 'acidente', lat: -8.7700, lng: -63.9100, description: 'Acidente na Av. Jorge Teixeira, Porto Velho, RO' },
  // Roraima - Boa Vista
  { type: 'buraco', lat: 2.8235, lng: -60.6753, description: 'Buraco no Centro, Boa Vista, RR' },
  { type: 'poste', lat: 2.8200, lng: -60.6700, description: 'Poste quebrado no São Vicente, Boa Vista, RR' },
  { type: 'policial', lat: 2.8250, lng: -60.6800, description: 'Blitz policial no Mecejana, Boa Vista, RR' },
  { type: 'acidente', lat: 2.8300, lng: -60.6900, description: 'Acidente na Av. Ene Garcez, Boa Vista, RR' },
  // Santa Catarina - Florianópolis
  { type: 'buraco', lat: -27.5954, lng: -48.5480, description: 'Buraco no Centro, Florianópolis, SC' },
  { type: 'poste', lat: -27.5969, lng: -48.5495, description: 'Poste quebrado na Trindade, Florianópolis, SC' },
  { type: 'policial', lat: -27.6000, lng: -48.5500, description: 'Blitz policial no Itacorubi, Florianópolis, SC' },
  { type: 'acidente', lat: -27.6100, lng: -48.5600, description: 'Acidente na Av. Beira-Mar Norte, Florianópolis, SC' },
  // São Paulo - São Paulo
  { type: 'buraco', lat: -23.5505, lng: -46.6333, description: 'Buraco na Av. Paulista, São Paulo, SP' },
  { type: 'poste', lat: -23.5605, lng: -46.6433, description: 'Poste quebrado na Rua Augusta, São Paulo, SP' },
  { type: 'policial', lat: -23.5489, lng: -46.6388, description: 'Blitz policial na Praça da Sé, São Paulo, SP' },
  { type: 'acidente', lat: -23.5405, lng: -46.6233, description: 'Acidente na Marginal Tietê, São Paulo, SP' },
  // Sergipe - Aracaju
  { type: 'buraco', lat: -10.9472, lng: -37.0731, description: 'Buraco no Centro, Aracaju, SE' },
  { type: 'poste', lat: -10.9400, lng: -37.0700, description: 'Poste quebrado na Atalaia, Aracaju, SE' },
  { type: 'policial', lat: -10.9500, lng: -37.0800, description: 'Blitz policial no Siqueira Campos, Aracaju, SE' },
  { type: 'acidente', lat: -10.9600, lng: -37.0900, description: 'Acidente na Av. Beira Mar, Aracaju, SE' },
  // Tocantins - Palmas
  { type: 'buraco', lat: -10.2491, lng: -48.3243, description: 'Buraco no Plano Diretor Sul, Palmas, TO' },
  { type: 'poste', lat: -10.2500, lng: -48.3300, description: 'Poste quebrado no Centro, Palmas, TO' },
  { type: 'policial', lat: -10.2550, lng: -48.3400, description: 'Blitz policial em Taquaralto, Palmas, TO' },
  { type: 'acidente', lat: -10.2600, lng: -48.3500, description: 'Acidente na Av. Teotônio Segurado, Palmas, TO' },
  // Distrito Federal - Brasília
  { type: 'buraco', lat: -15.7998, lng: -47.8645, description: 'Buraco no Eixo Monumental, Brasília, DF' },
  { type: 'poste', lat: -15.7939, lng: -47.8828, description: 'Poste danificado na Esplanada dos Ministérios, Brasília, DF' },
  { type: 'policial', lat: -15.8080, lng: -47.8750, description: 'Blitz policial no Lago Sul, Brasília, DF' },
  { type: 'acidente', lat: -15.7801, lng: -47.9292, description: 'Acidente no Setor Comercial Sul, Brasília, DF' },
  // Problemas em cidades da América do Sul e do mundo
  // Argentina - Buenos Aires
  { type: 'acidente', lat: -34.6037, lng: -58.3816, description: 'Acidente na Av. 9 de Julio, Buenos Aires, Argentina' },
  { type: 'buraco', lat: -34.6090, lng: -58.3847, description: 'Buraco em Palermo, Buenos Aires, Argentina' },
  { type: 'policial', lat: -34.6030, lng: -58.3820, description: 'Blitz policial em San Telmo, Buenos Aires, Argentina' },
  { type: 'crime', lat: -34.6158, lng: -58.4333, description: 'Crime recente em La Boca, Buenos Aires, Argentina' },
  { type: 'pouca_luz', lat: -34.5997, lng: -58.3737, description: 'Pouca iluminação em Retiro, Buenos Aires, Argentina' },
  // Chile - Santiago
  { type: 'acidente', lat: -33.4489, lng: -70.6693, description: 'Acidente no Centro, Santiago, Chile' },
  { type: 'buraco', lat: -33.4569, lng: -70.6483, description: 'Buraco em Providencia, Santiago, Chile' },
  { type: 'poste', lat: -33.4400, lng: -70.6500, description: 'Poste quebrado em Las Condes, Santiago, Chile' },
  { type: 'sem_energia', lat: -33.4420, lng: -70.6550, description: 'Sem energia em Ñuñoa, Santiago, Chile' },
  // Colômbia - Bogotá
  { type: 'acidente', lat: 4.7110, lng: -74.0721, description: 'Acidente na Zona T, Bogotá, Colômbia' },
  { type: 'buraco', lat: 4.6483, lng: -74.0836, description: 'Buraco em Chapinero, Bogotá, Colômbia' },
  { type: 'crime', lat: 4.6097, lng: -74.0817, description: 'Crime recente em La Candelaria, Bogotá, Colômbia' },
  { type: 'periculosidade', lat: 4.5981, lng: -74.0760, description: 'Área de periculosidade em Teusaquillo, Bogotá, Colômbia' },
  // Peru - Lima
  { type: 'acidente', lat: -12.0464, lng: -77.0428, description: 'Acidente em Miraflores, Lima, Peru' },
  { type: 'buraco', lat: -12.0631, lng: -77.0365, description: 'Buraco em Barranco, Lima, Peru' },
  { type: 'sem_energia', lat: -12.0500, lng: -77.0300, description: 'Sem energia em San Isidro, Lima, Peru' },
  { type: 'poste', lat: -12.0453, lng: -77.0311, description: 'Poste quebrado no Centro, Lima, Peru' },
  // Uruguai - Montevidéu
  { type: 'acidente', lat: -34.9011, lng: -56.1645, description: 'Acidente na Ciudad Vieja, Montevidéu, Uruguai' },
  { type: 'buraco', lat: -34.8836, lng: -56.1819, description: 'Buraco em Pocitos, Montevidéu, Uruguai' },
  { type: 'sem_energia', lat: -34.9000, lng: -56.1700, description: 'Sem energia em Cordón, Montevidéu, Uruguai' },
  { type: 'crime', lat: -34.9100, lng: -56.1620, description: 'Crime recente em Centro, Montevidéu, Uruguai' },
  // Venezuela - Caracas
  { type: 'acidente', lat: 10.4806, lng: -66.9036, description: 'Acidente em Chacao, Caracas, Venezuela' },
  { type: 'buraco', lat: 10.5000, lng: -66.9167, description: 'Buraco em Altamira, Caracas, Venezuela' },
  { type: 'poste', lat: 10.4900, lng: -66.9000, description: 'Poste quebrado em El Rosal, Caracas, Venezuela' },
  { type: 'pouca_luz', lat: 10.4800, lng: -66.9000, description: 'Pouca iluminação em Sabana Grande, Caracas, Venezuela' },
  // Estados Unidos - Nova York
  { type: 'acidente', lat: 40.7128, lng: -74.0060, description: 'Acidente na Times Square, New York, USA' },
  { type: 'buraco', lat: 40.7306, lng: -73.9352, description: 'Buraco no Brooklyn, New York, USA' },
  { type: 'crime', lat: 40.7580, lng: -73.9855, description: 'Crime recente na 5th Avenue, New York, USA' },
  { type: 'sem_energia', lat: 40.7484, lng: -73.9857, description: 'Sem energia próximo ao Empire State, New York, USA' },
  // França - Paris
  { type: 'acidente', lat: 48.8566, lng: 2.3522, description: 'Acidente na Champs-Élysées, Paris, França' },
  { type: 'buraco', lat: 48.8606, lng: 2.3376, description: 'Buraco próximo ao Louvre, Paris, França' },
  { type: 'poste', lat: 48.8584, lng: 2.2945, description: 'Poste quebrado na Torre Eiffel, Paris, França' },
  { type: 'pouca_luz', lat: 48.8530, lng: 2.3499, description: 'Pouca iluminação em Notre-Dame, Paris, França' },
  // Problemas extras para todos os tipos do painel lateral
  // Semáforo quebrado
  { type: 'semaforo', lat: -23.5610, lng: -46.6550, description: 'Semáforo quebrado na Av. Paulista, São Paulo, SP' },
  { type: 'semaforo', lat: -22.9080, lng: -43.1960, description: 'Semáforo quebrado na Lapa, Rio de Janeiro, RJ' },
  { type: 'semaforo', lat: -3.7310, lng: -38.5260, description: 'Semáforo quebrado na Aldeota, Fortaleza, CE' },
  // Pouca luz
  { type: 'pouca_luz', lat: -19.9160, lng: -43.9340, description: 'Pouca luz na Savassi, Belo Horizonte, MG' },
  { type: 'pouca_luz', lat: -8.0470, lng: -34.8775, description: 'Pouca luz em Boa Viagem, Recife, PE' },
  { type: 'pouca_luz', lat: -30.0340, lng: -51.2170, description: 'Pouca luz no Centro Histórico, Porto Alegre, RS' },
  // Periculosidade
  { type: 'periculosidade', lat: -15.7930, lng: -47.8820, description: 'Área de periculosidade na Esplanada, Brasília, DF' },
  { type: 'periculosidade', lat: -12.9770, lng: -38.5010, description: 'Área de periculosidade no Pelourinho, Salvador, BA' },
  { type: 'periculosidade', lat: -1.4555, lng: -48.5025, description: 'Área de periculosidade no Umarizal, Belém, PA' },
  // Sem energia
  { type: 'sem_energia', lat: -16.6860, lng: -49.2640, description: 'Sem energia no Setor Bueno, Goiânia, GO' },
  { type: 'sem_energia', lat: -10.9470, lng: -37.0735, description: 'Sem energia no Centro, Aracaju, SE' },
  { type: 'sem_energia', lat: -27.5950, lng: -48.5485, description: 'Sem energia no Centro, Florianópolis, SC' },
  // ... existing code ...
];

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

    mostrarResultados();

    // Após mostrarResultados(), verificar problemas próximos à rota
    if (route && route.geometry && route.geometry.coordinates) {
      const problemasProximos = [];
      const routeCoords = route.geometry.coordinates.map(([lon, lat]) => ({ lat, lon }));
      // globalProblems.forEach(problem => {
      //   for (const coord of routeCoords) {
      //     const dist = calcularDistanciaKm(coord.lat, coord.lon, problem.lat, problem.lng);
      //     if (dist <= 5) {
      //       problemasProximos.push(problem);
      //       break;
      //     }
      //   }
      // });
      if (problemasProximos.length > 0) {
        let mensagem = 'Atenção! Foram encontrados os seguintes problemas no raio de 5km da rota:\n';
        problemasProximos.forEach(p => {
          mensagem += `- ${p.type.toUpperCase()}: ${p.description}\n`;
        });
        mensagem += '\nTem certeza que deseja continuar?';
        if (!window.confirm(mensagem)) {
          // Se cancelar, remove a rota e marcadores
          if (routeLayer) map.removeLayer(routeLayer);
          clearMarkers();
          resultsDiv.style.display = 'none';
          openGoogleMapsBtn.style.display = 'none';
          return;
        }
      }
    }

    // Após confirmação dos problemas, adicionar problema fictício próximo ao destino
    if (endCoord) {
      const fakeProblem = {
        type: 'buraco',
        lat: endCoord.lat + (Math.random() - 0.5) * 0.01,
        lng: endCoord.lon + (Math.random() - 0.5) * 0.01,
        description: 'Buraco fictício: Obras emergenciais na via próxima ao destino.'
      };
      addProblemMarker(fakeProblem);
    }

  } catch (err) {
    console.error(err);
    errorDiv.textContent = err.message || "Erro ao buscar rota. Verifique os endereços e tente novamente.";
    errorDiv.style.display = 'block';
  } finally {
    calculateBtn.disabled = false;
    calculateBtn.innerHTML = '<span>Calcular Rota</span><i class="fas fa-route"></i>';
  }
}

if (calculateBtn) {
  calculateBtn.addEventListener("click", calculateRoute);
}

if (openGoogleMapsBtn) {
  openGoogleMapsBtn.addEventListener("click", () => {
    const startAddr = document.getElementById("start").value.trim();
    const endAddr = document.getElementById("end").value.trim();
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startAddr)}&destination=${encodeURIComponent(endAddr)}`;
    window.open(url, '_blank');
  });
}

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

// Controle do header durante o scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

const handleScroll = () => {
  const currentScroll = window.scrollY;
  
  // Adiciona classe scrolled quando rolar mais que 50px
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
};

window.addEventListener('scroll', () => {
  requestAnimationFrame(handleScroll);
});

// Smooth scroll para links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Garantir que as seções principais sejam visíveis
document.addEventListener('DOMContentLoaded', () => {
    const mainSections = document.querySelectorAll('.hero, .sobre');
    mainSections.forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'none';
    });
});

// Intersection Observer para animar as seções
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observa todas as seções
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Atualiza o link ativo no menu
const updateActiveLink = () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    const scroll = window.scrollY;

    if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
      const id = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', updateActiveLink);

// Função para exibir resultados após calcular rota
function mostrarResultados() {
  const results = document.getElementById('results');
  if (results) {
    results.classList.remove('hidden');
  }
}

// Inicialização do mapa do Via Report
let reportMap;
let reportMarkers = [];

function initReportMap() {
  reportMap = L.map('report-map').setView([-23.5505, -46.6333], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(reportMap);

  // Adicionar alguns marcadores de exemplo
  globalProblems.forEach(problem => {
    addProblemMarker(problem);
  });
}

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
    })
  }).addTo(reportMap);
  reportMarkers.push(marker);
}

// Adicionar menu suspenso de filtro de problemas no canto superior do mapa
function addProblemFilterMenu() {
  const filterDiv = document.createElement('div');
  filterDiv.className = 'problem-filter-menu';
  filterDiv.innerHTML = `
    <select id="problem-filter-select">
      <option value="all">Todos os problemas</option>
      <option value="poste">Poste</option>
      <option value="buraco">Buraco</option>
      <option value="acidente">Acidente</option>
      <option value="policial">Policial</option>
      <option value="crime">Crime</option>
      <option value="pouca_luz">Pouca luz</option>
      <option value="semaforo">Semáforo</option>
      <option value="sem_energia">Sem energia</option>
      <option value="periculosidade">Periculosidade</option>
    </select>
  `;
  const mapContainer = document.getElementById('report-map');
  mapContainer.parentElement.insertBefore(filterDiv, mapContainer);
  document.getElementById('problem-filter-select').addEventListener('change', function() {
    const value = this.value;
    // Remover todos os marcadores
    reportMarkers.forEach(m => reportMap.removeLayer(m));
    reportMarkers = [];
    // Adicionar novamente conforme filtro
    globalProblems.forEach(problem => {
      if (value === 'all' || problem.type === value) {
        addProblemMarker(problem);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initReportMap();
  addProblemFilterMenu();
  
  // Adicionar evento ao botão de reportar
  const reportBtn = document.getElementById('report-problem');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      // Aqui vamos implementar o modal de reporte depois
      alert('Funcionalidade de reporte será implementada em breve!');
    });
  }
});

// Função para calcular a distância entre dois pontos geográficos em km
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
