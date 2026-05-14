// App State
const state = {
    currentSection: 'home',
    grammarIndex: 0,
    readingIndex: 0,
    selectedGrammarOption: null,
    selectedReadingAnswers: {},
    progress: {
        grammar: { total: 0, correct: 0 },
        reading: { total: 0, correct: 0 },
        writing: { essaysChecked: 0 }
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    setupNavigation();
    setupGrammarSection();
    setupReadingSection();
    setupWritingIntegration();
    updateStatsDisplay();
});

// Navigation
function navigateTo(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    state.currentSection = section;
    
    if (section === 'grammar') {
        loadGrammarTask();
    } else if (section === 'reading') {
        loadReadingTask();
    } else if (section === 'writing') {
        // Writing section is self-contained in writing-service.js
    } else if (section === 'progress') {
        updateProgressDisplay();
    }
}

function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.section);
        });
    });
}

// Grammar Section
function setupGrammarSection() {
    const topicSelector = document.getElementById('grammar-topic');
    const levelSelector = document.getElementById('grammar-level');
    
    topicSelector.addEventListener('change', () => {
        state.grammarIndex = 0;
        loadGrammarTask();
    });
    
    levelSelector.addEventListener('change', () => {
        state.grammarIndex = 0;
        loadGrammarTask();
    });

    document.getElementById('grammar-submit').addEventListener('click', submitGrammarAnswer);
    document.getElementById('grammar-next').addEventListener('click', () => changeGrammarTask(1));
    document.getElementById('grammar-prev').addEventListener('click', () => changeGrammarTask(-1));
}

function getFilteredGrammarData() {
    const topic = document.getElementById('grammar-topic').value;
    const level = document.getElementById('grammar-level').value;
    
    let filtered = grammarData;
    
    if (topic !== 'all') {
        filtered = filtered.filter(item => item.topic === topic);
    }
    
    if (level !== 'all') {
        filtered = filtered.filter(item => item.level === level);
    }
    
    return filtered;
}

function loadGrammarTask() {
    const filteredData = getFilteredGrammarData();
    if (filteredData.length === 0) return;
    
    const task = filteredData[state.grammarIndex];
    
    document.getElementById('grammar-question').textContent = task.question;
    document.getElementById('grammar-topic-label').textContent = `Topic: ${task.topic.charAt(0).toUpperCase() + task.topic.slice(1)}`;
    
    const optionsContainer = document.getElementById('grammar-options');
    optionsContainer.innerHTML = '';
    
    task.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => selectGrammarOption(index));
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('grammar-feedback').className = 'feedback';
    document.getElementById('grammar-feedback').innerHTML = '';
    state.selectedGrammarOption = null;
    
    updateGrammarProgress(filteredData.length);
}

function selectGrammarOption(index) {
    const options = document.querySelectorAll('#grammar-options .option-btn');
    options.forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
    state.selectedGrammarOption = index;
}

function submitGrammarAnswer() {
    if (state.selectedGrammarOption === null) {
        alert('Please select an answer first!');
        return;
    }
    
    const filteredData = getFilteredGrammarData();
    const task = filteredData[state.grammarIndex];
    const feedbackEl = document.getElementById('grammar-feedback');
    const options = document.querySelectorAll('#grammar-options .option-btn');
    
    // Disable all options after submission
    options.forEach(btn => btn.disabled = true);
    
    if (state.selectedGrammarOption === task.correct) {
        options[state.selectedGrammarOption].classList.add('correct');
        feedbackEl.className = 'feedback show correct';
        feedbackEl.innerHTML = `<strong>✓ Correct!</strong><div class="explanation">${task.explanation}</div>`;
        
        // Update progress
        state.progress.grammar.total++;
        state.progress.grammar.correct++;
        saveProgress();
    } else {
        options[state.selectedGrammarOption].classList.add('incorrect');
        options[task.correct].classList.add('correct');
        feedbackEl.className = 'feedback show incorrect';
        feedbackEl.innerHTML = `<strong>✗ Incorrect</strong><div class="explanation">${task.explanation}</div>`;
        
        // Update progress
        state.progress.grammar.total++;
        saveProgress();
    }
    
    updateStatsDisplay();
}

function changeGrammarTask(direction) {
    const filteredData = getFilteredGrammarData();
    const newIndex = state.grammarIndex + direction;
    
    if (newIndex >= 0 && newIndex < filteredData.length) {
        state.grammarIndex = newIndex;
        loadGrammarTask();
    }
}

function updateGrammarProgress(total) {
    document.getElementById('grammar-progress').textContent = `${state.grammarIndex + 1} / ${total}`;
}

// Reading Section
function setupReadingSection() {
    const difficultySelector = document.getElementById('reading-difficulty');
    difficultySelector.addEventListener('change', () => {
        state.readingIndex = 0;
        state.selectedReadingAnswers = {};
        loadReadingTask();
    });

    document.getElementById('reading-submit').addEventListener('click', submitReadingAnswers);
    document.getElementById('reading-next').addEventListener('click', () => changeReadingTask(1));
    document.getElementById('reading-prev').addEventListener('click', () => changeReadingTask(-1));
}

function getFilteredReadingData() {
    const difficulty = document.getElementById('reading-difficulty').value;
    if (difficulty === 'all') return readingData;
    return readingData.filter(item => item.difficulty === difficulty);
}

function loadReadingTask() {
    const filteredData = getFilteredReadingData();
    if (filteredData.length === 0) return;
    
    const passage = filteredData[state.readingIndex];
    state.selectedReadingAnswers = {};
    
    document.getElementById('reading-title').textContent = passage.title;
    document.getElementById('reading-text').textContent = passage.text;
    
    const questionsContainer = document.getElementById('reading-questions-container');
    questionsContainer.innerHTML = '';
    
    passage.questions.forEach((q, qIndex) => {
        const questionEl = document.createElement('div');
        questionEl.className = 'question-item';
        
        const questionText = document.createElement('p');
        questionText.textContent = `${qIndex + 1}. ${q.question}`;
        questionEl.appendChild(questionText);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options-container';
        
        q.options.forEach((option, oIndex) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => selectReadingAnswer(qIndex, oIndex, btn));
            optionsDiv.appendChild(btn);
        });
        
        questionEl.appendChild(optionsDiv);
        questionsContainer.appendChild(questionEl);
    });
    
    document.getElementById('reading-feedback').className = 'feedback';
    document.getElementById('reading-feedback').innerHTML = '';
    
    updateReadingProgress(filteredData.length);
}

function selectReadingAnswer(questionIndex, answerIndex, btnElement) {
    state.selectedReadingAnswers[questionIndex] = answerIndex;
    
    const questionEl = document.querySelectorAll('.question-item')[questionIndex];
    questionEl.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === answerIndex);
    });
}

function submitReadingAnswers() {
    const filteredData = getFilteredReadingData();
    const passage = filteredData[state.readingIndex];
    const feedbackEl = document.getElementById('reading-feedback');
    
    let correctCount = 0;
    const totalQuestions = passage.questions.length;
    
    // Check each question
    passage.questions.forEach((q, qIndex) => {
        const questionEl = document.querySelectorAll('.question-item')[qIndex];
        const buttons = questionEl.querySelectorAll('.option-btn');
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);
        
        const userAnswer = state.selectedReadingAnswers[qIndex];
        
        if (userAnswer !== undefined) {
            if (userAnswer === q.correct) {
                buttons[userAnswer].classList.add('correct');
                correctCount++;
            } else {
                buttons[userAnswer].classList.add('incorrect');
                buttons[q.correct].classList.add('correct');
            }
        } else {
            // Show correct answer if none selected
            buttons[q.correct].classList.add('correct');
        }
    });
    
    // Update progress
    state.progress.reading.total += totalQuestions;
    state.progress.reading.correct += correctCount;
    saveProgress();
    
    // Show feedback
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    feedbackEl.className = `feedback show ${percentage >= 70 ? 'correct' : 'incorrect'}`;
    feedbackEl.innerHTML = `<strong>You scored ${correctCount}/${totalQuestions} (${percentage}%)</strong>`;
    
    updateStatsDisplay();
}

function changeReadingTask(direction) {
    const filteredData = getFilteredReadingData();
    const newIndex = state.readingIndex + direction;
    
    if (newIndex >= 0 && newIndex < filteredData.length) {
        state.readingIndex = newIndex;
        loadReadingTask();
    }
}

function updateReadingProgress(total) {
    document.getElementById('reading-progress').textContent = `${state.readingIndex + 1} / ${total}`;
}

// Progress Management
function loadProgress() {
    const saved = localStorage.getItem('hseExamPrepProgress');
    if (saved) {
        state.progress = JSON.parse(saved);
    }
}

function saveProgress() {
    localStorage.setItem('hseExamPrepProgress', JSON.stringify(state.progress));
}

function updateStatsDisplay() {
    document.getElementById('grammar-completed').textContent = state.progress.grammar.total;
    document.getElementById('reading-completed').textContent = state.progress.reading.total;
    
    // Update writing stats if element exists
    const writingEl = document.getElementById('writing-completed');
    if (writingEl) {
        writingEl.textContent = state.progress.writing.essaysChecked;
    }
    
    const totalTasks = state.progress.grammar.total + state.progress.reading.total + state.progress.writing.essaysChecked;
    const totalCorrect = state.progress.grammar.correct + state.progress.reading.correct;
    const accuracy = totalTasks > 0 ? Math.round((totalCorrect / totalTasks) * 100) : 0;
    document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
}

function updateProgressDisplay() {
    document.getElementById('total-grammar').textContent = state.progress.grammar.total;
    document.getElementById('correct-grammar').textContent = state.progress.grammar.correct;
    document.getElementById('total-reading').textContent = state.progress.reading.total;
    document.getElementById('correct-reading').textContent = state.progress.reading.correct;
}

// Reset Progress
document.getElementById('reset-progress')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all your progress?')) {
        state.progress = {
            grammar: { total: 0, correct: 0 },
            reading: { total: 0, correct: 0 },
            writing: { essaysChecked: 0 }
        };
        saveProgress();
        updateStatsDisplay();
        updateProgressDisplay();
        alert('Progress has been reset!');
    }
});

// Writing Section Integration
function setupWritingIntegration() {
    // Listen for writing progress updates from WritingService
    window.addEventListener('writing-progress-update', (e) => {
        if (e.detail && e.detail.action === 'essay_checked') {
            state.progress.writing.essaysChecked++;
            saveProgress();
            updateStatsDisplay();
        }
    });
}

// Make navigateTo available globally
window.navigateTo = navigateTo;
