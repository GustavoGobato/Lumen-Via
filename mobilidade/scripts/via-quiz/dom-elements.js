document.addEventListener('DOMContentLoaded', function() {
    const DOM = {
        introScreen: document.getElementById('via-quiz-intro'),
        questionsScreen: document.getElementById('via-quiz-questions'),
        feedbackScreen: document.getElementById('via-quiz-feedback'),
        resultsScreen: document.getElementById('via-quiz-results'),
        
        startButton: document.getElementById('via-quiz-start'),
        nextButton: document.getElementById('via-quiz-next'),
        restartButton: document.getElementById('via-quiz-restart'),
        shareButton: document.getElementById('via-quiz-share'),
        
        progressBar: document.getElementById('via-quiz-progress-bar'),
        progressText: document.getElementById('via-quiz-progress-text'),
        scoreDisplay: document.getElementById('via-quiz-score'),
        
        questionText: document.getElementById('via-quiz-question'),
        optionsContainer: document.getElementById('via-quiz-options'),
        
        feedbackIcon: document.getElementById('via-quiz-feedback-icon'),
        feedbackText: document.getElementById('via-quiz-feedback-text'),
        
        finalScore: document.getElementByid('via-quiz-final-score'),
        resultMessage: document.getElementById('via-quiz-result-message'),
        correctAnswers: document.getElementById('via-quiz-correct-answers'),
        wrongAnswers: document.getElementById('via-quiz-wrong-answers'),
        circleProgress: document.getElementById('via-quiz-circle-progress')
    };
});