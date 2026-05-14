// Main application logic
let currentSection = 'home';
let currentGrammarTopic = 'tenses';
let currentGrammarIndex = 0;
let currentReadingLevel = 'intermediate';
let currentReadingIndex = 0;
let selectedGrammarOption = null;
let selectedReadingAnswers = [];

// Progress tracking
let progress = {
    grammar: {
        total: 0,
        correct: 0,
        byTopic: {}
    },
    reading: {
        total: 0,
        correct: 0
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    setupNavigation();
    setupGrammarSection();
    setupReadingSection();
    updateStats();
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('hseExamPrepProgress');
    if (saved) {
        progress = JSON.parse(saved);
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('hseExamPrepProgress', JSON.stringify(progress));
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            navigateTo(section);
        });
    });
}

function navigateTo(section) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Update sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.toggle('active', sec.id === section);
    });

    currentSection = section;

    // Load content for section
    if (section === 'grammar') {
        loadGrammarTask();
    } else if (section === 'reading') {
        loadReadingTask();
    } else if (section === 'writing') {
        setupWritingSection();
    } else if (section === 'progress') {
        updateProgressDisplay();
    }
}

// Grammar Section
function setupGrammarSection() {
    const topicSelect = document.getElementById('grammar-topic');
    topicSelect.addEventListener('change', (e) => {
        currentGrammarTopic = e.target.value;
        currentGrammarIndex = 0;
        loadGrammarTask();
    });

    document.getElementById('grammar-submit').addEventListener('click', submitGrammarAnswer);
    document.getElementById('grammar-next').addEventListener('click', nextGrammarTask);
    document.getElementById('grammar-prev').addEventListener('click', prevGrammarTask);
}

function getGrammarQuestions() {
    if (currentGrammarTopic === 'all') {
        // Combine all topics
        let allQuestions = [];
        Object.keys(grammarData).forEach(topic => {
            allQuestions = allQuestions.concat(grammarData[topic].map(q => ({...q, topic})));
        });
        return allQuestions;
    }
    return grammarData[currentGrammarTopic].map(q => ({...q, topic: currentGrammarTopic}));
}

function loadGrammarTask() {
    const questions = getGrammarQuestions();
    if (questions.length === 0) return;

    const task = questions[currentGrammarIndex];
    const topicLabel = document.getElementById('grammar-topic-label');
    const questionText = document.getElementById('grammar-question');
    const optionsContainer = document.getElementById('grammar-options');
    const feedback = document.getElementById('grammar-feedback');
    const progressIndicator = document.getElementById('grammar-progress');

    // Update topic label
    const topicNames = {
        tenses: 'Tenses',
        conditionals: 'Conditionals',
        passive: 'Passive Voice',
        articles: 'Articles',
        prepositions: 'Prepositions'
    };
    topicLabel.textContent = `Topic: ${topicNames[task.topic] || task.topic}`;

    // Update question
    questionText.textContent = task.question;

    // Create options
    optionsContainer.innerHTML = '';
    task.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => selectGrammarOption(index));
        optionsContainer.appendChild(optionEl);
    });

    // Reset state
    selectedGrammarOption = null;
    feedback.className = 'feedback';
    feedback.innerHTML = '';

    // Update progress
    progressIndicator.textContent = `${currentGrammarIndex + 1} / ${questions.length}`;

    // Update button states
    document.getElementById('grammar-prev').disabled = currentGrammarIndex === 0;
    document.getElementById('grammar-next').disabled = currentGrammarIndex === questions.length - 1;
}

function selectGrammarOption(index) {
    if (document.getElementById('grammar-feedback').classList.contains('show')) return;

    selectedGrammarOption = index;
    document.querySelectorAll('#grammar-options .option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === index);
    });
}

function submitGrammarAnswer() {
    if (selectedGrammarOption === null) {
        alert('Please select an answer!');
        return;
    }

    const questions = getGrammarQuestions();
    const task = questions[currentGrammarIndex];
    const feedback = document.getElementById('grammar-feedback');
    const options = document.querySelectorAll('#grammar-options .option');

    // Update progress
    progress.grammar.total++;
    if (!progress.grammar.byTopic[task.topic]) {
        progress.grammar.byTopic[task.topic] = { total: 0, correct: 0 };
    }
    progress.grammar.byTopic[task.topic].total++;

    if (selectedGrammarOption === task.correct) {
        // Correct
        progress.grammar.correct++;
        progress.grammar.byTopic[task.topic].correct++;
        options[selectedGrammarOption].classList.add('correct');
        feedback.className = 'feedback success show';
        feedback.innerHTML = `
            <strong>✓ Correct!</strong>
            <div class="explanation">${task.explanation}</div>
        `;
    } else {
        // Incorrect
        options[selectedGrammarOption].classList.add('incorrect');
        options[task.correct].classList.add('correct');
        feedback.className = 'feedback error show';
        feedback.innerHTML = `
            <strong>✗ Incorrect</strong>
            <div class="explanation">${task.explanation}</div>
        `;
    }

    saveProgress();
    updateStats();
}

function nextGrammarTask() {
    const questions = getGrammarQuestions();
    if (currentGrammarIndex < questions.length - 1) {
        currentGrammarIndex++;
        loadGrammarTask();
    }
}

function prevGrammarTask() {
    if (currentGrammarIndex > 0) {
        currentGrammarIndex--;
        loadGrammarTask();
    }
}

// Reading Section
function setupReadingSection() {
    const difficultySelect = document.getElementById('reading-difficulty');
    difficultySelect.addEventListener('change', (e) => {
        currentReadingLevel = e.target.value;
        currentReadingIndex = 0;
        loadReadingTask();
    });

    document.getElementById('reading-submit').addEventListener('click', submitReadingAnswers);
    document.getElementById('reading-next').addEventListener('click', nextReadingTask);
    document.getElementById('reading-prev').addEventListener('click', prevReadingTask);
}

function getReadingPassages() {
    if (currentReadingLevel === 'all') {
        return [...readingData.intermediate, ...readingData.advanced];
    }
    return readingData[currentReadingLevel] || [];
}

function loadReadingTask() {
    const passages = getReadingPassages();
    if (passages.length === 0) return;

    const passage = passages[currentReadingIndex];
    const title = document.getElementById('reading-title');
    const text = document.getElementById('reading-text');
    const questionsContainer = document.getElementById('reading-questions-container');
    const feedback = document.getElementById('reading-feedback');
    const progressIndicator = document.getElementById('reading-progress');

    // Update content
    title.textContent = passage.title;
    text.textContent = passage.text;

    // Create questions
    questionsContainer.innerHTML = '';
    selectedReadingAnswers = new Array(passage.questions.length).fill(null);

    passage.questions.forEach((q, qIndex) => {
        const qEl = document.createElement('div');
        qEl.className = 'reading-question';
        qEl.innerHTML = `<p>${qIndex + 1}. ${q.question}</p>`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options-container';

        q.options.forEach((option, oIndex) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            optionEl.textContent = option;
            optionEl.addEventListener('click', () => selectReadingAnswer(qIndex, oIndex, optionEl));
            optionsDiv.appendChild(optionEl);
        });

        qEl.appendChild(optionsDiv);
        questionsContainer.appendChild(qEl);
    });

    // Reset feedback
    feedback.className = 'feedback';
    feedback.innerHTML = '';

    // Update progress
    progressIndicator.textContent = `${currentReadingIndex + 1} / ${passages.length}`;

    // Update button states
    document.getElementById('reading-prev').disabled = currentReadingIndex === 0;
    document.getElementById('reading-next').disabled = currentReadingIndex === passages.length - 1;
}

// Writing Section Navigation Handler
function setupWritingSection() {
    // Writing module initializes automatically
    if (typeof writingModule !== 'undefined') {
        writingModule.init();
    }
}

function selectReadingAnswer(questionIndex, answerIndex, element) {
    if (document.getElementById('reading-feedback').classList.contains('show')) return;

    selectedReadingAnswers[questionIndex] = answerIndex;

    // Update visual selection
    const questionEl = element.closest('.reading-question');
    questionEl.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === answerIndex);
    });
}

function submitReadingAnswers() {
    const passages = getReadingPassages();
    const passage = passages[currentReadingIndex];
    const feedback = document.getElementById('reading-feedback');

    // Check if all answered
    if (selectedReadingAnswers.includes(null)) {
        alert('Please answer all questions!');
        return;
    }

    // Calculate score
    let correctCount = 0;
    passage.questions.forEach((q, index) => {
        if (selectedReadingAnswers[index] === q.correct) {
            correctCount++;
        }
    });

    // Update progress
    progress.reading.total += passage.questions.length;
    progress.reading.correct += correctCount;
    saveProgress();
    updateStats();

    // Show feedback
    const percentage = Math.round((correctCount / passage.questions.length) * 100);
    let message, className;

    if (percentage >= 80) {
        message = `Excellent! You got ${correctCount}/${passage.questions.length} correct (${percentage}%)`;
        className = 'success';
    } else if (percentage >= 60) {
        message = `Good job! You got ${correctCount}/${passage.questions.length} correct (${percentage}%)`;
        className = 'success';
    } else {
        message = `Keep practicing! You got ${correctCount}/${passage.questions.length} correct (${percentage}%)`;
        className = 'error';
    }

    feedback.className = `feedback ${className} show`;
    feedback.innerHTML = `<strong>${message}</strong>`;

    // Show correct answers
    passage.questions.forEach((q, qIndex) => {
        const questionEl = document.querySelectorAll('.reading-question')[qIndex];
        const options = questionEl.querySelectorAll('.option');

        options.forEach((opt, oIndex) => {
            if (oIndex === q.correct) {
                opt.classList.add('correct');
            } else if (oIndex === selectedReadingAnswers[qIndex] && oIndex !== q.correct) {
                opt.classList.add('incorrect');
            }
        });
    });
}

function nextReadingTask() {
    const passages = getReadingPassages();
    if (currentReadingIndex < passages.length - 1) {
        currentReadingIndex++;
        loadReadingTask();
    }
}

function prevReadingTask() {
    if (currentReadingIndex > 0) {
        currentReadingIndex--;
        loadReadingTask();
    }
}

// Stats and Progress
function updateStats() {
    const grammarCompleted = progress.grammar.total;
    const readingCompleted = progress.reading.total;

    const totalAttempts = grammarCompleted + readingCompleted;
    const totalCorrect = progress.grammar.correct + progress.reading.correct;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    document.getElementById('grammar-completed').textContent = grammarCompleted;
    document.getElementById('reading-completed').textContent = readingCompleted;
    document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
    
    // Update writing stats if element exists
    const writingCompletedEl = document.getElementById('writing-completed');
    if (writingCompletedEl && typeof writingModule !== 'undefined') {
        writingCompletedEl.textContent = writingModule.savedEssays.length;
    }
}

function updateProgressDisplay() {
    document.getElementById('total-grammar').textContent = progress.grammar.total;
    document.getElementById('correct-grammar').textContent = progress.grammar.correct;
    document.getElementById('total-reading').textContent = progress.reading.total;
    document.getElementById('correct-reading').textContent = progress.reading.correct;

    // Setup reset button
    const resetBtn = document.getElementById('reset-progress');
    resetBtn.onclick = () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            progress = {
                grammar: { total: 0, correct: 0, byTopic: {} },
                reading: { total: 0, correct: 0 }
            };
            saveProgress();
            updateStats();
            updateProgressDisplay();
            alert('Progress has been reset!');
        }
    };
}

// Make navigateTo available globally for onclick handlers
window.navigateTo = navigateTo;
