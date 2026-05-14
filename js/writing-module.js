// Writing Module for HSE English Exam Prep
// Handles essay writing, AI checking, and progress tracking

class WritingModule {
    constructor() {
        this.currentTopic = null;
        this.currentEssay = null;
        this.errors = [];
        this.savedEssays = this.loadSavedEssays();
        this.init();
    }

    init() {
        this.renderTopicSelection();
        this.setupEventListeners();
        this.updateStats();
    }

    // Load saved essays from localStorage
    loadSavedEssays() {
        const saved = localStorage.getItem('hse_writing_essays');
        return saved ? JSON.parse(saved) : [];
    }

    // Save essays to localStorage
    saveEssays() {
        localStorage.setItem('hse_writing_essays', JSON.stringify(this.savedEssays));
        this.updateStats();
    }

    // Setup event listeners
    setupEventListeners() {
        // Topic selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('topic-card')) {
                const topicId = parseInt(e.target.dataset.topicId);
                this.selectTopic(topicId);
            }
            
            if (e.target.classList.contains('check-btn')) {
                this.checkEssay();
            }
            
            if (e.target.classList.contains('save-btn')) {
                this.saveCurrentEssay();
            }
            
            if (e.target.classList.contains('error-highlight')) {
                this.showErrorExplanation(e.target);
            }
            
            if (e.target.classList.contains('fix-btn')) {
                this.fixError(e.target);
            }
            
            if (e.target.classList.contains('back-btn')) {
                this.showTopicSelection();
            }
            
            if (e.target.classList.contains('view-essay-btn')) {
                const essayId = parseInt(e.target.dataset.essayId);
                this.viewSavedEssay(essayId);
            }
            
            if (e.target.classList.contains('delete-essay-btn')) {
                const essayId = parseInt(e.target.dataset.essayId);
                this.deleteEssay(essayId);
            }
        });

        // Text area input - update error positions dynamically
        const textarea = document.getElementById('essay-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.recalculateErrorPositions();
            });
        }
    }

    // Render topic selection screen
    renderTopicSelection() {
        const container = document.getElementById('writing-content');
        if (!container) return;

        const prosConsTopics = writingTopics.filter(t => t.type === 'pros_cons');
        const opinionTopics = writingTopics.filter(t => t.type === 'opinion');

        container.innerHTML = `
            <div class="writing-header">
                <h2>📝 Writing Practice - IELTS Style</h2>
                <p>Choose a topic and write your essay. AI will check it for errors.</p>
            </div>

            <div class="api-status" id="api-status">
                <span class="status-indicator ${aiService.hasApiKey() ? 'connected' : 'disconnected'}"></span>
                <span>${aiService.hasApiKey() ? 'AI Connected' : 'Demo Mode (Configure API Key for full features)'}</span>
                <button class="configure-key-btn" onclick="writingModule.showApiKeyConfig()">⚙️ Configure API Key</button>
            </div>

            <div class="topics-grid">
                <div class="topic-section">
                    <h3>Pros & Cons Topics</h3>
                    <div class="topics-list">
                        ${prosConsTopics.map(topic => `
                            <div class="topic-card" data-topic-id="${topic.id}">
                                <h4>${topic.title}</h4>
                                <p>${topic.prompt}</p>
                                <span class="topic-type badge-pros-cons">Pros & Cons</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="topic-section">
                    <h3>Opinion Topics</h3>
                    <div class="topics-list">
                        ${opinionTopics.map(topic => `
                            <div class="topic-card" data-topic-id="${topic.id}">
                                <h4>${topic.title}</h4>
                                <p>${topic.prompt}</p>
                                <span class="topic-type badge-opinion">Opinion</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="saved-essays-section">
                <h3>📁 Your Saved Essays</h3>
                <div class="essays-list" id="essays-list">
                    ${this.savedEssays.length === 0 ? 
                        '<p class="no-essays">No saved essays yet. Write and save your first essay!</p>' : 
                        this.savedEssays.map(essay => `
                            <div class="essay-item">
                                <div class="essay-info">
                                    <h4>${essay.topicTitle}</h4>
                                    <p class="essay-date">${new Date(essay.savedAt).toLocaleDateString()}</p>
                                    ${essay.score ? `<p class="essay-score">Score: ${essay.score.band}</p>` : ''}
                                </div>
                                <div class="essay-actions">
                                    <button class="btn btn-small view-essay-btn" data-essay-id="${essay.id}">View</button>
                                    <button class="btn btn-small btn-danger delete-essay-btn" data-essay-id="${essay.id}">Delete</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    }

    // Show API key configuration modal
    showApiKeyConfig() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>🔑 Configure Qwen API Key</h3>
                <p>Enter your encoded API key for Qwen (DashScope). To get your key:</p>
                <ol>
                    <li>Go to <a href="https://dashscope.console.aliyun.com/" target="_blank">DashScope Console</a></li>
                    <li>Create an API key</li>
                    <li>Encode it using Base64 (you can use any online Base64 encoder)</li>
                    <li>Paste the encoded key below</li>
                </ol>
                <div class="form-group">
                    <label for="api-key-input">Encoded API Key:</label>
                    <input type="password" id="api-key-input" placeholder="Paste your encoded API key here">
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="writingModule.saveApiKey()">Save Key</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
                <p class="note">Your key is stored locally in your browser and never sent to our servers.</p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Save API key
    saveApiKey() {
        const input = document.getElementById('api-key-input');
        const encodedKey = input.value.trim();
        
        if (!encodedKey) {
            alert('Please enter an API key');
            return;
        }

        if (aiService.setApiKey(encodedKey)) {
            localStorage.setItem('hse_qwen_api_key', encodedKey);
            alert('API key saved successfully!');
            document.querySelector('.modal')?.remove();
            this.renderTopicSelection();
        } else {
            alert('Invalid API key. Please check and try again.');
        }
    }

    // Load saved API key on init
    loadSavedApiKey() {
        const savedKey = localStorage.getItem('hse_qwen_api_key');
        if (savedKey) {
            aiService.setApiKey(savedKey);
        }
    }

    // Select a topic and show writing interface
    selectTopic(topicId) {
        this.currentTopic = writingTopics.find(t => t.id === topicId);
        if (!this.currentTopic) return;

        const container = document.getElementById('writing-content');
        container.innerHTML = `
            <div class="writing-interface">
                <button class="back-btn">← Back to Topics</button>
                
                <div class="topic-header">
                    <span class="topic-type badge-${this.currentTopic.type === 'pros_cons' ? 'pros-cons' : 'opinion'}">
                        ${this.currentTopic.type === 'pros_cons' ? 'Pros & Cons' : 'Opinion'}
                    </span>
                    <h2>${this.currentTopic.title}</h2>
                </div>

                <div class="prompt-box">
                    <h3>Task:</h3>
                    <p>${this.currentTopic.prompt}</p>
                    <p class="instruction"><strong>Instruction:</strong> ${this.currentTopic.instruction}</p>
                </div>

                <div class="writing-area">
                    <textarea id="essay-textarea" placeholder="Start writing your essay here... Aim for at least 250 words." rows="15"></textarea>
                    <div class="word-count">
                        <span id="word-count">0</span> words
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary check-btn">🔍 Check with AI</button>
                    <button class="btn btn-secondary save-btn">💾 Save Essay</button>
                </div>

                <div class="results-area" id="results-area" style="display: none;">
                    <div class="feedback-summary">
                        <h3>📊 Feedback</h3>
                        <div id="score-display"></div>
                        <p id="overall-feedback"></p>
                    </div>

                    <div class="errors-container">
                        <h3>⚠️ Errors Found (<span id="error-count">0</span>)</h3>
                        <p class="hint">Click on highlighted errors to see explanations and fix them.</p>
                        <div id="errors-display" class="errors-display"></div>
                    </div>
                </div>
            </div>
        `;

        // Add word count listener
        const textarea = document.getElementById('essay-textarea');
        textarea.addEventListener('input', () => {
            const wordCount = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
            document.getElementById('word-count').textContent = wordCount;
        });
    }

    // Check essay with AI
    async checkEssay() {
        const textarea = document.getElementById('essay-textarea');
        const text = textarea.value.trim();

        if (!text || text.split(/\s+/).length < 50) {
            alert('Please write at least 50 words before checking.');
            return;
        }

        const resultsArea = document.getElementById('results-area');
        const checkBtn = document.querySelector('.check-btn');
        
        checkBtn.disabled = true;
        checkBtn.textContent = '⏳ Checking...';
        resultsArea.style.display = 'block';

        try {
            let result;
            
            if (aiService.hasApiKey()) {
                result = await aiService.checkEssay(text, this.currentTopic.prompt);
            } else {
                // Demo mode
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
                result = await aiService.getDemoCheck(text, this.currentTopic.prompt);
            }

            this.errors = result.errors;
            this.displayResults(result);
            this.highlightErrorsInText();

        } catch (error) {
            alert(`Error checking essay: ${error.message}`);
            console.error(error);
        } finally {
            checkBtn.disabled = false;
            checkBtn.textContent = '🔍 Check with AI';
        }
    }

    // Display results
    displayResults(result) {
        const scoreDisplay = document.getElementById('score-display');
        const overallFeedback = document.getElementById('overall-feedback');
        const errorCount = document.getElementById('error-count');

        if (result.score) {
            scoreDisplay.innerHTML = `
                <div class="score-band">Overall Band: <strong>${result.score.band}</strong></div>
                <div class="score-breakdown">
                    <span>Grammar: ${result.score.breakdown.grammar}</span>
                    <span>Vocabulary: ${result.score.breakdown.vocabulary}</span>
                    <span>Coherence: ${result.score.breakdown.coherence}</span>
                    <span>Task Response: ${result.score.breakdown.taskResponse}</span>
                </div>
            `;
        } else {
            scoreDisplay.innerHTML = '';
        }

        overallFeedback.textContent = result.overallFeedback;
        errorCount.textContent = this.errors.length;
    }

    // Highlight errors in the text
    highlightErrorsInText() {
        const textarea = document.getElementById('essay-textarea');
        const text = textarea.value;
        const errorsDisplay = document.getElementById('errors-display');

        // Create a rich text editor overlay
        const writingArea = document.querySelector('.writing-area');
        const overlay = document.createElement('div');
        overlay.className = 'text-overlay';
        overlay.innerHTML = this.wrapTextWithHighlights(text);
        
        // Replace textarea with overlay temporarily
        textarea.style.display = 'none';
        writingArea.appendChild(overlay);

        // Show fix buttons for each error
        errorsDisplay.innerHTML = this.errors.map(error => `
            <div class="error-item" data-error-id="${error.id}">
                <div class="error-header">
                    <span class="error-type badge-${error.type}">${error.type}</span>
                    <strong>"${error.original}"</strong> → <span class="suggestion">"${error.suggestion}"</span>
                </div>
                <p class="error-explanation">${error.explanation}</p>
                <button class="btn btn-small fix-btn" data-error-id="${error.id}">
                    ${error.fixed ? '✓ Fixed' : '🔧 Fix This Error'}
                </button>
            </div>
        `).join('');
    }

    // Wrap text with error highlights
    wrapTextWithHighlights(text) {
        let result = '';
        let lastIndex = 0;

        // Sort errors by position
        const sortedErrors = [...this.errors].sort((a, b) => a.position.start - b.position.start);

        sortedErrors.forEach(error => {
            if (!error.fixed) {
                // Add text before error
                result += this.escapeHtml(text.substring(lastIndex, error.position.start));
                
                // Add highlighted error
                result += `<span class="error-highlight" data-error-id="${error.id}" title="${error.explanation}">`;
                result += this.escapeHtml(text.substring(error.position.start, error.position.end));
                result += '</span>';
                
                lastIndex = error.position.end;
            }
        });

        // Add remaining text
        result += this.escapeHtml(text.substring(lastIndex));

        return result;
    }

    // Escape HTML special characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show error explanation on click
    showErrorExplanation(element) {
        const errorId = parseFloat(element.dataset.errorId);
        const error = this.errors.find(e => e.id === errorId);
        
        if (error) {
            alert(`Error Type: ${error.type}\n\nOriginal: "${error.original}"\nSuggestion: "${error.suggestion}"\n\nExplanation: ${error.explanation}\n\nClick "Fix This Error" below to correct it.`);
        }
    }

    // Fix error
    fixError(button) {
        const errorId = parseFloat(button.dataset.errorId);
        const errorIndex = this.errors.findIndex(e => e.id === errorId);
        
        if (errorIndex === -1) return;

        const error = this.errors[errorIndex];
        const textarea = document.getElementById('essay-textarea');
        const text = textarea.value;

        // Replace error in text
        const newText = text.substring(0, error.position.start) + 
                       error.suggestion + 
                       text.substring(error.position.end);

        textarea.value = newText;
        
        // Mark error as fixed
        error.fixed = true;
        error.original = error.suggestion;
        error.position.end = error.position.start + error.suggestion.length;

        // Update UI
        button.textContent = '✓ Fixed';
        button.disabled = true;
        
        // Recalculate positions and re-highlight
        this.recalculateErrorPositions();
        this.highlightErrorsInText();
        
        // Update error count
        const remainingErrors = this.errors.filter(e => !e.fixed).length;
        document.getElementById('error-count').textContent = remainingErrors;

        // Trigger input event to update word count
        textarea.dispatchEvent(new Event('input'));
    }

    // Recalculate error positions after text changes
    recalculateErrorPositions() {
        const textarea = document.getElementById('essay-textarea');
        const currentText = textarea.value;
        
        // This is a simplified version - in production, you'd want more sophisticated tracking
        this.errors.forEach(error => {
            if (!error.fixed) {
                const newIndex = currentText.indexOf(error.original);
                if (newIndex !== -1) {
                    error.position.start = newIndex;
                    error.position.end = newIndex + error.original.length;
                }
            }
        });
    }

    // Save current essay
    saveCurrentEssay() {
        const textarea = document.getElementById('essay-textarea');
        const text = textarea.value.trim();

        if (!text) {
            alert('Please write something before saving.');
            return;
        }

        const essay = {
            id: Date.now(),
            topicId: this.currentTopic.id,
            topicTitle: this.currentTopic.title,
            topicType: this.currentTopic.type,
            prompt: this.currentTopic.prompt,
            text: text,
            savedAt: new Date().toISOString(),
            errors: this.errors,
            score: this.errors.length > 0 ? 
                { band: Math.max(5, 9 - Math.floor(this.errors.length / 3)) } : 
                { band: 8 }
        };

        this.savedEssays.unshift(essay);
        this.saveEssays();

        alert('Essay saved successfully!');
        this.renderTopicSelection();
    }

    // View saved essay
    viewSavedEssay(essayId) {
        const essay = this.savedEssays.find(e => e.id === essayId);
        if (!essay) return;

        this.currentTopic = {
            id: essay.topicId,
            title: essay.topicTitle,
            type: essay.topicType,
            prompt: essay.prompt,
            instruction: ''
        };

        const container = document.getElementById('writing-content');
        container.innerHTML = `
            <div class="writing-interface">
                <button class="back-btn">← Back to Essays</button>
                
                <div class="topic-header">
                    <span class="topic-type badge-${essay.topicType === 'pros_cons' ? 'pros-cons' : 'opinion'}">
                        ${essay.topicType === 'pros_cons' ? 'Pros & Cons' : 'Opinion'}
                    </span>
                    <h2>${essay.topicTitle}</h2>
                </div>

                <div class="prompt-box">
                    <h3>Task:</h3>
                    <p>${essay.prompt}</p>
                </div>

                <div class="saved-essay-view">
                    <h3>Your Essay (Saved on ${new Date(essay.savedAt).toLocaleDateString()})</h3>
                    <div class="essay-text">${this.escapeHtml(essay.text).replace(/\n/g, '<br>')}</div>
                    
                    ${essay.score ? `
                        <div class="essay-score-display">
                            <h4>Score: ${essay.score.band}</h4>
                        </div>
                    ` : ''}

                    ${essay.errors && essay.errors.length > 0 ? `
                        <div class="errors-review">
                            <h4>Errors Found (${essay.errors.length})</h4>
                            ${essay.errors.map(error => `
                                <div class="error-review-item">
                                    <span class="error-type badge-${error.type}">${error.type}</span>
                                    <strong>"${error.original}"</strong> → <span class="suggestion">"${error.suggestion}"</span>
                                    <p>${error.explanation}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="no-errors">No errors found! Great job!</p>'}
                </div>

                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="writingModule.renderTopicSelection()">Back to Topics</button>
                </div>
            </div>
        `;
    }

    // Delete essay
    deleteEssay(essayId) {
        if (confirm('Are you sure you want to delete this essay?')) {
            this.savedEssays = this.savedEssays.filter(e => e.id !== essayId);
            this.saveEssays();
            this.renderTopicSelection();
        }
    }

    // Show topic selection
    showTopicSelection() {
        this.renderTopicSelection();
    }

    // Update stats
    updateStats() {
        const essaysCountEl = document.getElementById('writing-completed');
        if (essaysCountEl) {
            essaysCountEl.textContent = this.savedEssays.length;
        }
    }
}

// Initialize writing module
const writingModule = new WritingModule();

// Load saved API key
writingModule.loadSavedApiKey();
