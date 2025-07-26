// via-quiz.js - Quiz profissional de Mobilidade Sustentável

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Configurações do Quiz
    // =============================================
    const quizSettings = {
    totalQuestions: 15, // Corresponde ao número de perguntas
    pointsPerQuestion: 10,
    passingScore: 70
};

    // =============================================
    // Elementos do DOM
    // =============================================
    const DOM = {
        // Containers
        introScreen: document.getElementById('via-quiz-intro'),
        questionsScreen: document.getElementById('via-quiz-questions'),
        feedbackScreen: document.getElementById('via-quiz-feedback'),
        resultsScreen: document.getElementById('via-quiz-results'),
        
        // Elementos de controle
        startButton: document.getElementById('via-quiz-start'),
        nextButton: document.getElementById('via-quiz-next'),
        restartButton: document.getElementById('via-quiz-restart'),
        shareButton: document.getElementById('via-quiz-share'),
        
        // Elementos de progresso
        progressBar: document.getElementById('via-quiz-progress-bar'),
        progressText: document.getElementById('via-quiz-progress-text'),
        scoreDisplay: document.getElementById('via-quiz-score'),
        
        // Elementos de perguntas
        questionText: document.getElementById('via-quiz-question'),
        optionsContainer: document.getElementById('via-quiz-options'),
        
        // Elementos de feedback
        feedbackIcon: document.getElementById('via-quiz-feedback-icon'),
        feedbackText: document.getElementById('via-quiz-feedback-text'),
        
        // Elementos de resultados
        finalScore: document.getElementById('via-quiz-final-score'),
        resultMessage: document.getElementById('via-quiz-result-message'),
        correctAnswers: document.getElementById('via-quiz-correct-answers'),
        wrongAnswers: document.getElementById('via-quiz-wrong-answers'),
        circleProgress: document.getElementById('via-quiz-circle-progress')
    };

    // =============================================
    // Estado do Quiz
    // =============================================
    const quizState = {
        currentQuestion: 0,
        score: 0,
        selectedOption: null,
        quizCompleted: false
    };

    // =============================================
    // Banco de Perguntas
    // =============================================
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

    // =============================================
    // Inicialização do Quiz
    // =============================================
    function initQuiz() {
        // Verifica se há perguntas suficientes
        if (questions.length < quizSettings.totalQuestions) {
            console.error(`Necessário ${quizSettings.totalQuestions} perguntas. Atualmente há apenas ${questions.length}.`);
            return;
        }

        // Configura event listeners
        setupEventListeners();
        
        // Mostra a tela inicial
        showScreen(DOM.introScreen);
    }

    // =============================================
    // Configuração dos Event Listeners
    // =============================================
    function setupEventListeners() {
        // Botão Iniciar
        DOM.startButton.addEventListener('click', startQuiz);
        
        // Botão Próxima Pergunta
        DOM.nextButton.addEventListener('click', loadNextQuestion);
        
        // Botão Reiniciar
        DOM.restartButton.addEventListener('click', restartQuiz);
        
        // Botão Compartilhar
        DOM.shareButton.addEventListener('click', shareResults);
    }

    // =============================================
    // Controle de Telas
    // =============================================
    function showScreen(screenElement) {
        // Esconde todas as telas
        DOM.introScreen.classList.add('via-quiz-hidden');
        DOM.questionsScreen.classList.add('via-quiz-hidden');
        DOM.resultsScreen.classList.add('via-quiz-hidden');
        
        // Mostra a tela solicitada
        screenElement.classList.remove('via-quiz-hidden');
    }

    // =============================================
    // Iniciar Quiz
    // =============================================
    function startQuiz() {
        // Reinicia o estado do quiz
        quizState.currentQuestion = 0;
        quizState.score = 0;
        quizState.quizCompleted = false;
        
        // Atualiza a exibição da pontuação
        updateScoreDisplay();
        
        // Mostra a tela de perguntas
        showScreen(DOM.questionsScreen);
        
        // Carrega a primeira pergunta
        loadQuestion();
    }

    // =============================================
    // Carregar Pergunta
    // =============================================
    function loadQuestion() {
        // Verifica se o quiz terminou
        if (quizState.currentQuestion >= quizSettings.totalQuestions) {
            showResults();
            return;
        }

        // Obtém a pergunta atual
        const question = questions[quizState.currentQuestion];
        
        // Atualiza o texto da pergunta
        DOM.questionText.textContent = question.question;
        
        // Limpa as opções anteriores
        DOM.optionsContainer.innerHTML = '';
        
        // Atualiza a barra de progresso
        updateProgress();
        
        // Adiciona as opções de resposta
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.className = 'via-quiz-option';
            optionElement.innerHTML = `
                <span class="via-quiz-option-prefix">${String.fromCharCode(65 + index)}</span>
                <span class="via-quiz-option-text">${option}</span>
            `;
            optionElement.addEventListener('click', () => selectOption(index));
            DOM.optionsContainer.appendChild(optionElement);
        });
        
        // Esconde o feedback
        DOM.feedbackScreen.classList.add('via-quiz-hidden');
    }

    // =============================================
    // Selecionar Opção
    // =============================================
    function selectOption(selectedIndex) {
        // Impede múltiplas seleções
        if (quizState.selectedOption !== null) return;
        
        quizState.selectedOption = selectedIndex;
        const question = questions[quizState.currentQuestion];
        const optionElements = document.querySelectorAll('.via-quiz-option');
        
        // Marca a opção selecionada como correta ou incorreta
        optionElements.forEach((option, index) => {
            option.disabled = true;
            
            if (index === question.answer) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== question.answer) {
                option.classList.add('wrong');
            }
        });
        
        // Verifica se a resposta está correta
        const isCorrect = selectedIndex === question.answer;
        
        // Atualiza a pontuação
        if (isCorrect) {
            quizState.score += quizSettings.pointsPerQuestion;
            updateScoreDisplay();
        }
        
        // Mostra o feedback
        showFeedback(isCorrect, question.explanation);
    }

    // =============================================
    // Mostrar Feedback
    // =============================================
    function showFeedback(isCorrect, explanation) {
        // Configura o ícone e o texto de feedback
        DOM.feedbackIcon.className = isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle';
        DOM.feedbackText.textContent = isCorrect 
            ? `✅ Correto! ${explanation}` 
            : `❌ Incorreto. ${explanation}`;
        
        // Mostra o feedback
        DOM.feedbackScreen.classList.remove('via-quiz-hidden');
        
        // Rola a tela para o feedback
        DOM.feedbackScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // =============================================
    // Carregar Próxima Pergunta
    // =============================================
    function loadNextQuestion() {
        // Reseta a seleção
        quizState.selectedOption = null;
        
        // Avança para a próxima pergunta
        quizState.currentQuestion++;
        
        // Carrega a próxima pergunta ou mostra os resultados
        if (quizState.currentQuestion < quizSettings.totalQuestions) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    // =============================================
    // Atualizar Progresso
    // =============================================
    function updateProgress() {
        // Calcula o progresso
        const progressPercent = ((quizState.currentQuestion + 1) / quizSettings.totalQuestions) * 100;
        
        // Atualiza a barra de progresso
        DOM.progressBar.style.width = `${progressPercent}%`;
        DOM.progressText.textContent = `${quizState.currentQuestion + 1}/${quizSettings.totalQuestions}`;
    }

    // =============================================
    // Atualizar Pontuação
    // =============================================
    function updateScoreDisplay() {
        DOM.scoreDisplay.textContent = quizState.score;
    }

    // =============================================
    // Mostrar Resultados
    // =============================================
    function showResults() {
        // Calcula a porcentagem de acertos
        const percentage = Math.round((quizState.score / (quizSettings.totalQuestions * quizSettings.pointsPerQuestion)) * 100);
        
        // Atualiza o display de resultados
        DOM.finalScore.textContent = percentage;
        DOM.correctAnswers.textContent = Math.floor(quizState.score / quizSettings.pointsPerQuestion);
        DOM.wrongAnswers.textContent = quizSettings.totalQuestions - Math.floor(quizState.score / quizSettings.pointsPerQuestion);
        
        // Atualiza a mensagem de resultado
        setResultMessage(percentage);
        
        // Anima o círculo de progresso
        animateCircleProgress(percentage);
        
        // Mostra a tela de resultados
        showScreen(DOM.resultsScreen);
    }

    // =============================================
    // Definir Mensagem de Resultado
    // =============================================
    function setResultMessage(percentage) {
        let message, emoji;
        
        if (percentage >= 90) {
            message = "Excelente! Você é um expert em mobilidade sustentável!";
            emoji = "🏆";
        } else if (percentage >= quizSettings.passingScore) {
            message = "Bom trabalho! Você sabe bastante sobre o tema!";
            emoji = "👍";
        } else if (percentage >= 50) {
            message = "Você está no caminho certo! Continue aprendendo!";
            emoji = "📚";
        } else {
            message = "Opa! Que tal estudar mais sobre mobilidade sustentável?";
            emoji = "🤔";
        }
        
        DOM.resultMessage.textContent = `${emoji} ${message}`;
    }

    // =============================================
    // Animar Círculo de Progresso
    // =============================================
    function animateCircleProgress(targetPercentage) {
        let currentPercentage = 0;
        const animationDuration = 1500; // 1.5 segundos
        const steps = 60;
        const increment = targetPercentage / steps;
        const interval = animationDuration / steps;
        
        const animation = setInterval(() => {
            currentPercentage += increment;
            
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
                clearInterval(animation);
            }
            
            DOM.circleProgress.style.background = `conic-gradient(var(--secondary) ${currentPercentage}%, var(--gray-200) ${currentPercentage}%)`;
        }, interval);
    }

    // =============================================
    // Reiniciar Quiz
    // =============================================
    function restartQuiz() {
        // Reinicia o estado do quiz
        quizState.currentQuestion = 0;
        quizState.score = 0;
        quizState.quizCompleted = false;
        
        // Mostra a tela inicial
        showScreen(DOM.introScreen);
    }

    // =============================================
    // Compartilhar Resultados
    // =============================================
    function shareResults() {
        const correct = Math.floor(quizState.score / quizSettings.pointsPerQuestion);
        const percentage = Math.round((quizState.score / (quizSettings.totalQuestions * quizSettings.pointsPerQuestion)) * 100);
        
        const shareText = `Acabei de fazer ${correct} acertos (${percentage}%) no Quiz de Mobilidade Sustentável da Lumen Via! 🚲🌱 Teste seus conhecimentos também: ${window.location.href}`;
        
        // Verifica se a API de compartilhamento está disponível
        if (navigator.share) {
            navigator.share({
                title: 'Quiz de Mobilidade Sustentável',
                text: shareText,
                url: window.location.href
            }).catch(err => {
                console.error('Erro ao compartilhar:', err);
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
    }

    // =============================================
    // Fallback para Compartilhamento
    // =============================================
    function fallbackShare(shareText) {
        // Tenta copiar para a área de transferência
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Resultados copiados para a área de transferência! Cole nas suas redes sociais.');
        }).catch(err => {
            // Fallback para o método antigo
            prompt('Copie o texto abaixo para compartilhar seus resultados:', shareText);
        });
    }

    // =============================================
    // Inicializa o Quiz quando o DOM estiver pronto
    // =============================================
    initQuiz();
});