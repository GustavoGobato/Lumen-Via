document.addEventListener('DOMContentLoaded', function() {
    const questions = [
        {
            question: "Qual destes meios de transporte é considerado o mais sustentável para distâncias curtas?",
            options: [
                "Carro particular",
                "Bicicleta",
                "Moto",
                "Ônibus convencional"
            ],
            answer: 1,
            explanation: "A bicicleta é a opção mais sustentável para curtas distâncias, pois não emite poluentes e promove a saúde do usuário."
        },
        {
            question: "O que significa o termo 'transporte multimodal'?",
            options: [
                "Uso de um único meio de transporte",
                "Combinação de diferentes modais em uma viagem",
                "Transporte de múltiplos passageiros",
                "Veículos com múltiplas fontes de energia"
            ],
            answer: 1,
            explanation: "Transporte multimodal envolve usar diferentes modos de transporte (ex: bicicleta + metrô) em uma mesma viagem para maior eficiência."
        },
        {
            question: "Qual a principal vantagem dos veículos elétricos para a mobilidade urbana?",
            options: [
                "Menor custo de aquisição",
                "Zero emissões diretas de poluentes",
                "Não precisam de manutenção",
                "Maior velocidade que veículos convencionais"
            ],
            answer: 1,
            explanation: "Veículos elétricos não emitem poluentes durante o uso, melhorando a qualidade do ar nas cidades."
        },
        {
            question: "O que é um 'corredor de ônibus'?",
            options: [
                "Estacionamento exclusivo para ônibus",
                "Faixa de tráfego exclusiva para ônibus",
                "Local de embarque de passageiros",
                "Garagem de ônibus"
            ],
            answer: 1,
            explanation: "Corredores de ônibus são faixas exclusivas que agilizam o transporte público, tornando-o mais eficiente que carros particulares."
        },
        {
            question: "Qual destes NÃO é um benefício do transporte público?",
            options: [
                "Redução de congestionamentos",
                "Menor consumo de energia por passageiro",
                "Aumento da poluição sonora",
                "Democratização do acesso à cidade"
            ],
            answer: 2,
            explanation: "O transporte público reduz a poluição sonora ao diminuir o número de veículos em circulação."
        },
        {
            question: "O que significa 'mobilidade como serviço' (MaaS)?",
            options: [
                "Venda de veículos particulares",
                "Plataforma que integra diferentes opções de transporte",
                "Serviço de entrega de encomendas",
                "Manutenção de veículos compartilhados"
            ],
            answer: 1,
            explanation: "MaaS integra diversos modais (ônibus, bike, táxi) em uma única plataforma digital para planejamento de viagens."
        },
        {
            question: "Qual a função dos 'parklets' na mobilidade urbana?",
            options: [
                "Ampliar vagas de estacionamento",
                "Converter vagas de carro em espaços públicos",
                "Criar estacionamentos subterrâneos",
                "Organizar o estacionamento de bicicletas"
            ],
            answer: 1,
            explanation: "Parklets transformam vagas de estacionamento em áreas de convivência, desestimulando o uso de carros particulares."
        },
        {
            question: "Qual destes é um exemplo de 'transporte ativo'?",
            options: [
                "Carro elétrico",
                "Ônibus híbrido",
                "Caminhada",
                "Metrô"
            ],
            answer: 2,
            explanation: "Transporte ativo refere-se a modos que usam a energia humana, como caminhar e pedalar."
        },
        {
            question: "O que é 'acalmamento de tráfego'?",
            options: [
                "Redução do limite de velocidade",
                "Uso de buzinas silenciosas",
                "Proibição total de veículos",
                "Aumento de faixas de rolamento"
            ],
            answer: 0,
            explanation: "Consiste em medidas físicas e regulatórias para reduzir velocidade de veículos e priorizar pedestres e ciclistas."
        },
        {
            question: "Qual a vantagem do BRT sobre o ônibus convencional?",
            options: [
                "Menor capacidade de passageiros",
                "Maior velocidade e eficiência",
                "Não precisa de motorista",
                "Custo de implantação mais baixo"
            ],
            answer: 1,
            explanation: "O BRT (Bus Rapid Transit) tem faixas exclusivas e estações específicas, oferecendo desempenho similar a metrôs com custo menor."
        },
        {
            question: "O que é 'última milha' no contexto de mobilidade?",
            options: [
                "Distância final entre estação de transporte e destino",
                "Último modelo de veículo lançado",
                "Fronteira entre cidades",
                "Extensão máxima de ciclovias"
            ],
            answer: 0,
            explanation: "Refere-se ao trecho final da viagem, solucionado por modos como bicicletas compartilhadas ou caminhada."
        },
        {
            question: "Qual destes é um benefício das ciclovias protegidas?",
            options: [
                "Aumentam o fluxo de carros",
                "Reduzem acidentes com ciclistas",
                "Diminuem o espaço para pedestres",
                "Exigem menos manutenção"
            ],
            answer: 1,
            explanation: "Ciclovias com separação física reduzem em até 90% os riscos de acidentes para ciclistas."
        },
        {
            question: "O que é 'carona solidária'?",
            options: [
                "Uso exclusivo de carros por famílias",
                "Compartilhamento de veículos entre vizinhos",
                "Venda de carros usados",
                "Transporte gratuito para idosos"
            ],
            answer: 1,
            explanation: "Prática onde pessoas compartilham um mesmo veículo para trajetos similares, reduzindo número de carros na via."
        },
        {
            question: "Qual a principal vantagem dos veículos híbridos?",
            options: [
                "Não precisam de combustível",
                "Reduzem consumo de combustível fóssil",
                "São mais baratos que convencionais",
                "Não exigem manutenção"
            ],
            answer: 1,
            explanation: "Veículos híbridos combinam motor a combustão com elétrico, reduzindo em até 30% o consumo de combustível."
        },
        {
            question: "O que é 'urbanismo tático'?",
            options: [
                "Planejamento urbano de longo prazo",
                "Intervenções rápidas e de baixo custo para melhorar espaços",
                "Demolição de vias antigas",
                "Construção de viadutos"
            ],
            answer: 1,
            explanation: "Intervenções temporárias ou permanentes de baixo custo (como extensão de calçadas) para testar melhorias na mobilidade."
        }
    ];
});