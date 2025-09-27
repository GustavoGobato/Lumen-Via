document.addEventListener('DOMContentLoaded', function() {
    function initQuiz() {
        if (questions.length < quizSettings.totalQuestions) {
            console.error(`Necessário ${quizSettings.totalQuestions} perguntas. Atualmente há apenas ${questions.length}.`);
            return;
        }

        setupEventListeners();
        showScreen(DOM.introScreen);
    }

    function setupEventListeners() {
        DOM.startButton.addEventListener('click', startQuiz);
        DOM.nextButton.addEventListener('click', loadNextQuestion);
        DOM.restartButton.addEventListener('click', restartQuiz);
        DOM.shareButton.addEventListener('click', shareResults);
    }

    function showScreen(screenElement) {
        DOM.introScreen.classList.add('via-quiz-hidden');
        DOM.questionsScreen.classList.add('via-quiz-hidden');
        DOM.resultsScreen.classList.add('via-quiz-hidden');
        screenElement.classList.remove('via-quiz-hidden');
    }

    function startQuiz() {
        quizState.currentQuestion = 0;
        quizState.score = 0;
        quizState.quizCompleted = false;
        updateScoreDisplay();
        showScreen(DOM.questionsScreen);
        loadQuestion();
    }

    function loadQuestion() {
        if (quizState.currentQuestion >= quizSettings.totalQuestions) {
            showResults();
            return;
        }

        const question = questions[quizState.currentQuestion];
        DOM.questionText.textContent = question.question;
        DOM.optionsContainer.innerHTML = '';
        updateProgress();

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

        DOM.feedbackScreen.classList.add('via-quiz-hidden');
    }

    function selectOption(selectedIndex) {
        if (quizState.selectedOption !== null) return;
        
        quizState.selectedOption = selectedIndex;
        const question = questions[quizState.currentQuestion];
        const optionElements = document.querySelectorAll('.via-quiz-option');
        
        optionElements.forEach((option, index) => {
            option.disabled = true;
            if (index === question.answer) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== question.answer) {
                option.classList.add('wrong');
            }
        });

        const isCorrect = selectedIndex === question.answer;
        if (isCorrect) {
            quizState.score += quizSettings.pointsPerQuestion;
            updateScoreDisplay();
        }

        showFeedback(isCorrect, question.explanation);
    }

    function showFeedback(isCorrect, explanation) {
        DOM.feedbackIcon.className = isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle';
        DOM.feedbackText.textContent = isCorrect 
            ? `✅ Correto! ${explanation}` 
            : `❌ Incorreto. ${explanation}`;
        
        DOM.feedbackScreen.classList.remove('via-quiz-hidden');
        DOM.feedbackScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function loadNextQuestion() {
        quizState.selectedOption = null;
        quizState.currentQuestion++;
        
        if (quizState.currentQuestion < quizSettings.totalQuestions) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function updateProgress() {
        const progressPercent = ((quizState.currentQuestion + 1) / quizSettings.totalQuestions) * 100;
        DOM.progressBar.style.width = `${progressPercent}%`;
        DOM.progressText.textContent = `${quizState.currentQuestion + 1}/${quizSettings.totalQuestions}`;
    }

    function updateScoreDisplay() {
        DOM.scoreDisplay.textContent = quizState.score;
    }

    function showResults() {
        const percentage = Math.round((quizState.score / (quizSettings.totalQuestions * quizSettings.pointsPerQuestion)) * 100);
        
        DOM.finalScore.textContent = percentage;
        DOM.correctAnswers.textContent = Math.floor(quizState.score / quizSettings.pointsPerQuestion);
        DOM.wrongAnswers.textContent = quizSettings.totalQuestions - Math.floor(quizState.score / quizSettings.pointsPerQuestion);
        
        setResultMessage(percentage);
        animateCircleProgress(percentage);
        showScreen(DOM.resultsScreen);
    }

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

    function animateCircleProgress(targetPercentage) {
        let currentPercentage = 0;
        const animationDuration = 1500; 
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

    function restartQuiz() {
        quizState.currentQuestion = 0;
        quizState.score = 0;
        quizState.quizCompleted = false;
        showScreen(DOM.introScreen);
    }

    function shareResults() {
        const correct = Math.floor(quizState.score / quizSettings.pointsPerQuestion);
        const percentage = Math.round((quizState.score / (quizSettings.totalQuestions * quizSettings.pointsPerQuestion)) * 100);
        
        const shareText = `Acabei de fazer ${correct} acertos (${percentage}%) no Quiz de Mobilidade Sustentável da Lumen Via! 🚲🌱 Teste seus conhecimentos também: ${window.location.href}`;
        
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

    function fallbackShare(shareText) {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Resultados copiados para a área de transferência! Cole nas suas redes sociais.');
        }).catch(err => {
            prompt('Copie o texto abaixo para compartilhar seus resultados:', shareText);
        });
    }
});