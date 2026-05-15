// writing-service.js
// Strict IELTS Essay Checker with Google Gemini API

let currentApiKey = '';
let currentTopic = '';

// DOM Elements
const apiKeyInput = document.getElementById('api-key-input');
const setKeyBtn = document.getElementById('set-key-btn');
const topicSelect = document.getElementById('topic-select');
const essayTextarea = document.getElementById('essay-textarea');
const checkBtn = document.getElementById('check-ai-btn');
const loadDemoBtn = document.getElementById('load-demo-btn');
const resultsContainer = document.getElementById('ai-results');
const scoreDisplay = document.getElementById('ielts-score');
const feedbackList = document.getElementById('feedback-list');
const loadingSpinner = document.getElementById('loading-spinner');

// Initialize
function init() {
    setupEventListeners();
    updateKeyStatus();
}

function setupEventListeners() {
    setKeyBtn.addEventListener('click', handleSetKey);
    checkBtn.addEventListener('click', handleCheckEssay);
    loadDemoBtn.addEventListener('click', loadDemoEssay);
    
    window.addEventListener('beforeunload', (e) => {
        if (essayTextarea.value.length > 10) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function handleSetKey() {
    const key = apiKeyInput.value.trim();
    if (!key) {
        alert('Please enter a valid API key');
        return;
    }
    currentApiKey = key;
    updateKeyStatus();
    alert('API Key set for this session! (Will be lost on refresh)');
    apiKeyInput.value = '';
}

function updateKeyStatus() {
    const statusSpan = document.getElementById('key-status');
    if (currentApiKey) {
        statusSpan.textContent = '✅ Key Active (Session Only)';
        statusSpan.style.color = '#28a745';
        checkBtn.disabled = false;
    } else {
        statusSpan.textContent = '❌ No Key Set';
        statusSpan.style.color = '#dc3545';
        checkBtn.disabled = true;
    }
}

function loadDemoEssay() {
    const badEssay = "i poop likeing being yesterday. technology is good thing. me and him goes to school but we dont know nothing. the sky is green and fish fly in air. internet make people stupid because they no read book. i think computer is bad for health eye. many people use phone all day and night. they cant sleep. government should ban phone. also i like pizza very much it is tasty. the end.";
    topicSelect.value = 'technology_impact'; 
    essayTextarea.value = badEssay;
    alert('Demo essay loaded: Contains grammar, logic, spelling, relevance, and style errors.');
}

async function handleCheckEssay() {
    if (!currentApiKey) {
        alert('Please set your API key first.');
        return;
    }

    const text = essayTextarea.value.trim();
    const topic = topicSelect.options[topicSelect.selectedIndex].text;

    if (text.length < 20) {
        alert('Essay is too short to analyze.');
        return;
    }

    loadingSpinner.style.display = 'block';
    resultsContainer.style.display = 'none';
    checkBtn.disabled = true;

    try {
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        let localErrors = [];
        
        if (wordCount < 250) {
            localErrors.push({
                type: 'critical',
                message: 'Word Count Warning: Your essay has only ' + wordCount + ' words. IELTS Task 2 requires at least 250 words. This will significantly lower your score.',
                suggestion: 'Expand your ideas with more examples and explanations.',
                severity: 'high'
            });
        }

        const aiResult = await callGeminiAI(text, topic);
        
        const allErrors = localErrors.concat(aiResult.errors);
        const finalScore = calculateFinalScore(aiResult.scores, localErrors.length);

        renderResults(finalScore, allErrors, aiResult.commentary);

    } catch (error) {
        console.error('Analysis failed:', error);
        alert('Error analyzing essay: ' + error.message);
    } finally {
        loadingSpinner.style.display = 'none';
        checkBtn.disabled = false;
    }
}

async function callGeminiAI(text, topic) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + currentApiKey;

    const escapedText = text.replace(/"/g, '\\"');
    
    const systemPrompt = 'YOU ARE A RUTHLESS, HYPER-STRICT IELTS EXAMINER. YOUR JOB IS TO DESTROY WEAK ESSAYS. DO NOT BE POLITE. FIND EVERY SINGLE ERROR. IF A SENTENCE IS SLIGHTLY OFF, MARK IT. IF THE VOCABULARY IS BASIC, CRITICIZE IT. IF THE LOGIC IS FLAWED, POINT IT OUT AGGRESSIVELY. CRITERIA: 1. GRAMMAR: Check every verb tense, subject-verb agreement, preposition, article. 2. LEXICAL RESOURCE: Identify repetitive, simple, or incorrect words. Suggest C1/C2 alternatives. 3. COHERENCE & COHESION: Check linking words, paragraph structure, logical flow. 4. TASK RESPONSE: COMPARE THE TEXT WITH THIS TOPIC: "' + topic + '". IF THE TEXT DEVIATES EVEN SLIGHTLY, PENALIZE HEAVILY. IF ITS OFF-TOPIC, GIVE BAND 0 FOR THIS CRITERIA. 5. LOGIC/MEANING: If a sentence makes no sense (e.g., "fish fly in air"), mark it as nonsense. OUTPUT FORMAT: You MUST return ONLY valid JSON. No markdown, no explanations outside JSON. Structure: { "scores": { "taskResponse": 0-9, "coherence": 0-9, "lexicalResource": 0-9, "grammar": 0-9, "overall": 0-9 }, "errors": [ { "type": "grammar" or "spelling" or "vocabulary" or "logic" or "relevance" or "punctuation", "original": "the wrong phrase", "correction": "the correct phrase", "explanation": "Strict explanation why this is wrong and how it lowers the band score.", "severity": "low" or "medium" or "high" } ], "commentary": "A harsh 2-sentence summary of why the score is low/high." } TEXT TO ANALYZE: "' + escapedText + '"';

    const payload = {
        contents: [{
            parts: [{
                text: systemPrompt
            }]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'API Error: ' + response.status);
    }

    const data = await response.json();
    
    let rawText = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] ? data.candidates[0].content.parts[0].text : null;
    
    if (!rawText) throw new Error("No response from AI");

    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(rawText);
    } catch (e) {
        console.error("Failed to parse AI JSON:", rawText);
        throw new Error("AI returned invalid format. Try again.");
    }
}

function calculateFinalScore(scores, localErrorCount) {
    const avg = (scores.taskResponse + scores.coherence + scores.lexicalResource + scores.grammar) / 4;
    
    const wordCount = essayTextarea.value.split(/\s+/).length;
    if (wordCount < 150 && avg > 5.0) return 5.0;
    if (wordCount < 100 && avg > 4.0) return 4.0;

    return Math.round(avg * 2) / 2;
}

function renderResults(score, errors, commentary) {
    resultsContainer.style.display = 'block';
    
    scoreDisplay.textContent = score.toFixed(1);
    scoreDisplay.className = 'score-badge';
    if (score >= 7.0) scoreDisplay.classList.add('score-high');
    else if (score >= 5.5) scoreDisplay.classList.add('score-med');
    else scoreDisplay.classList.add('score-low');

    feedbackList.innerHTML = '';
    
    if (errors.length === 0) {
        feedbackList.innerHTML = '<li class="feedback-item success">No obvious errors found. But are you sure? The AI might have been too nice.</li>';
    } else {
        errors.forEach(function(err, index) {
            const li = document.createElement('li');
            li.className = 'feedback-item error-' + err.severity;
            
            let icon = '⚠️';
            if (err.type === 'grammar') icon = '📝';
            if (err.type === 'spelling') icon = '🔤';
            if (err.type === 'logic') icon = '🧠';
            if (err.type === 'relevance') icon = '🎯';
            if (err.type === 'vocabulary') icon = '📚';

            li.innerHTML = '<div class="error-header"><span class="error-icon">' + icon + '</span><strong>' + err.type.toUpperCase() + '</strong> <span class="severity-tag">' + err.severity + '</span></div><div class="error-content"><p><span class="bad-text">"' + err.original + '"</span> → <span class="good-text">"' + err.correction + '"</span></p><p class="explanation">' + err.explanation + '</p></div>';
            feedbackList.appendChild(li);
        });
    }

    const commDiv = document.getElementById('ai-commentary');
    commDiv.innerHTML = '<strong>Examiner\'s Verdict:</strong> ' + commentary;
    
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

init();
