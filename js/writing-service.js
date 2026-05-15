// Writing Service Module
// Handles essay writing practice with AI-powered checking via Google Gemini API

// Global variable for API key (not saved to localStorage, cleared on page refresh)
let userApiKey = null;

const WritingService = (function() {
    // Essay topics data
    const essayTopics = [
        // Discuss both views and give your opinion (5 topics)
        {
            id: 1,
            type: 'discuss_both',
            topic: 'Some people believe that university education should be free for everyone. Others think that students should pay for their own studies. Discuss both views and give your opinion.'
        },
        {
            id: 2,
            type: 'discuss_both',
            topic: 'Some argue that technology has made our lives more complex, while others believe it has simplified life. Discuss both views and give your opinion.'
        },
        {
            id: 3,
            type: 'discuss_both',
            topic: 'There are those who think that children should start learning a foreign language at primary school, while others believe they should wait until secondary school. Discuss both views and give your opinion.'
        },
        {
            id: 4,
            type: 'discuss_both',
            topic: 'Some people think that governments should spend money on public transport, while others believe that individuals should pay for their own travel. Discuss both views and give your opinion.'
        },
        {
            id: 5,
            type: 'discuss_both',
            topic: 'Some believe that work is the most important thing in life, while others think that leisure time is more valuable. Discuss both views and give your opinion.'
        },
        // To what extent do you agree or disagree (5 topics)
        {
            id: 6,
            type: 'agree_disagree',
            topic: 'Social media has had a negative impact on society. To what extent do you agree or disagree?'
        },
        {
            id: 7,
            type: 'agree_disagree',
            topic: 'The best way to reduce crime is to increase the length of prison sentences. To what extent do you agree or disagree?'
        },
        {
            id: 8,
            type: 'agree_disagree',
            topic: 'Environmental problems are too big for individuals to solve. Only governments can make a difference. To what extent do you agree or disagree?'
        },
        {
            id: 9,
            type: 'agree_disagree',
            topic: 'Artificial intelligence will eventually replace most human jobs. To what extent do you agree or disagree?'
        },
        {
            id: 10,
            type: 'agree_disagree',
            topic: 'Success in life is determined by hard work, not by luck. To what extent do you agree or disagree?'
        }
    ];

    // Demo errors for fallback mode
    const demoErrors = [
        {
            original_text: "teh",
            suggestion: "the",
            explanation: "Spelling error: 'teh' should be 'the'",
            start_index: 0,
            end_index: 3
        },
        {
            original_text: "dont",
            suggestion: "don't",
            explanation: "Missing apostrophe in contraction",
            start_index: 10,
            end_index: 14
        },
        {
            original_text: "very good",
            suggestion: "excellent",
            explanation: "Consider using more sophisticated vocabulary",
            start_index: 20,
            end_index: 29
        }
    ];

    // State
    let currentTopicId = null;
    let currentEssayText = '';
    let detectedErrors = [];
    // API Key stored only in memory (cleared on page refresh) - using global variable from main scope
    // userApiKey is defined globally to be accessible by callGeminiAPI

    // Initialize the writing section
    function init() {
        loadApiKey();
        renderTopicList();
        loadEssayHistory();
        setupEventListeners();
    }

    // API Key management - stored only in memory (cleared on page refresh)
    function saveApiKey(key) {
        if (!key || key.trim() === '') {
            userApiKey = null;
            return false;
        }
        try {
            userApiKey = key.trim();
            return true;
        } catch (e) {
            console.error('Error setting API key:', e);
            return false;
        }
    }

    function loadApiKey() {
        // Don't load from localStorage - key must be entered each session
        userApiKey = null;
        return null;
    }

    function getApiKey() {
        return userApiKey;
    }

    function isDemoMode() {
        return !userApiKey || userApiKey.trim() === '';
    }

    // Render topic selection list
    function renderTopicList() {
        const container = document.getElementById('writing-topics-list');
        if (!container) return;

        container.innerHTML = '';
        
        // Group by type
        const discussBothTopics = essayTopics.filter(t => t.type === 'discuss_both');
        const agreeDisagreeTopics = essayTopics.filter(t => t.type === 'agree_disagree');

        // Create sections
        const section1 = createTopicSection('Discuss Both Views (5 topics)', discussBothTopics);
        const section2 = createTopicSection('Agree or Disagree (5 topics)', agreeDisagreeTopics);

        container.appendChild(section1);
        container.appendChild(section2);
    }

    function createTopicSection(title, topics) {
        const section = document.createElement('div');
        section.className = 'topic-section';
        
        const heading = document.createElement('h4');
        heading.textContent = title;
        heading.className = 'topic-section-title';
        section.appendChild(heading);

        const list = document.createElement('div');
        list.className = 'topic-list';

        topics.forEach(topic => {
            const item = document.createElement('button');
            item.className = 'topic-item';
            item.dataset.topicId = topic.id;
            item.textContent = topic.topic.substring(0, 80) + (topic.topic.length > 80 ? '...' : '');
            item.title = topic.topic;
            item.addEventListener('click', () => selectTopic(topic.id));
            list.appendChild(item);
        });

        section.appendChild(list);
        return section;
    }

    // Select a topic for writing
    function selectTopic(topicId) {
        currentTopicId = topicId;
        const topic = essayTopics.find(t => t.id === topicId);
        
        // Update UI
        document.querySelectorAll('.topic-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.topicId) === topicId);
        });

        // Display selected topic
        const selectedTopicEl = document.getElementById('selected-topic-display');
        if (selectedTopicEl) {
            selectedTopicEl.textContent = topic.topic;
            selectedTopicEl.dataset.topicId = topic.id;
        }

        // Load existing essay if any
        loadExistingEssay(topicId);
        
        // Clear previous results
        clearResults();
    }

    function loadExistingEssay(topicId) {
        const essays = getUserEssays();
        const existingEssay = essays.find(e => e.topicId === topicId);
        
        const textarea = document.getElementById('essay-textarea');
        if (textarea) {
            textarea.value = existingEssay ? existingEssay.text : '';
            currentEssayText = textarea.value;
        }
    }

    function clearResults() {
        detectedErrors = [];
        const editorContainer = document.getElementById('essay-editor-container');
        if (editorContainer) {
            editorContainer.classList.remove('has-errors');
        }
        
        const resultsContainer = document.getElementById('check-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // API Key input
        const apiKeyInput = document.getElementById('api-key-input');
        const apiKeySaveBtn = document.getElementById('api-key-save');
        const apiKeyStatus = document.getElementById('api-key-status');

        if (apiKeySaveBtn && apiKeyInput) {
            apiKeySaveBtn.addEventListener('click', () => {
                const key = apiKeyInput.value.trim();
                const success = saveApiKey(key);
                
                if (success) {
                    apiKeyStatus.textContent = '✓ API Key set for this session';
                    apiKeyStatus.className = 'api-status success';
                    apiKeyInput.value = '';
                } else {
                    apiKeyStatus.textContent = '✗ Failed to save API Key';
                    apiKeyStatus.className = 'api-status error';
                }
            });
        }

        // Check if key exists on load - always show input field since key is not persisted
        if (apiKeyStatus) {
            apiKeyStatus.textContent = '⚠ Enter API Key to enable AI checking';
            apiKeyStatus.className = 'api-status warning';
        }

        // Textarea auto-save
        const textarea = document.getElementById('essay-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                currentEssayText = textarea.value;
                autoSaveEssay();
            });
        }

        // Check with AI button
        const checkBtn = document.getElementById('check-essay-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', checkEssayWithAI);
        }
    }

    // Auto-save essay to localStorage
    function autoSaveEssay() {
        if (!currentTopicId || !currentEssayText.trim()) return;

        const essays = getUserEssays();
        const existingIndex = essays.findIndex(e => e.topicId === currentTopicId);
        
        const essayData = {
            topicId: currentTopicId,
            text: currentEssayText,
            lastModified: new Date().toISOString(),
            status: 'draft'
        };

        if (existingIndex >= 0) {
            essays[existingIndex] = essayData;
        } else {
            essays.push(essayData);
        }

        localStorage.setItem('user_essays', JSON.stringify(essays));
        updateEssayHistoryDisplay();
    }

    // Get user essays from localStorage
    function getUserEssays() {
        try {
            const stored = localStorage.getItem('user_essays');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading essays:', e);
            return [];
        }
    }

    // Load and display essay history
    function loadEssayHistory() {
        updateEssayHistoryDisplay();
    }

    function updateEssayHistoryDisplay() {
        const historyContainer = document.getElementById('essay-history-list');
        if (!historyContainer) return;

        const essays = getUserEssays();
        
        if (essays.length === 0) {
            historyContainer.innerHTML = '<p class="no-essays">No essays written yet. Start practicing!</p>';
            return;
        }

        historyContainer.innerHTML = '';
        
        // Sort by date (newest first)
        essays.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        essays.forEach((essay, index) => {
            const topic = essayTopics.find(t => t.id === essay.topicId);
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const date = new Date(essay.lastModified).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            item.innerHTML = `
                <div class="history-info">
                    <span class="history-date">${date}</span>
                    <span class="history-status status-${essay.status}">${essay.status}</span>
                </div>
                <p class="history-topic">${topic ? topic.topic.substring(0, 60) + '...' : 'Unknown topic'}</p>
                <button class="btn btn-small btn-load" data-index="${index}">Load Essay</button>
            `;

            item.querySelector('.btn-load').addEventListener('click', () => {
                loadEssayFromHistory(index);
            });

            historyContainer.appendChild(item);
        });
    }

    function loadEssayFromHistory(historyIndex) {
        const essays = getUserEssays();
        const essay = essays[historyIndex];
        
        if (essay) {
            selectTopic(essay.topicId);
            const textarea = document.getElementById('essay-textarea');
            if (textarea) {
                textarea.value = essay.text;
                currentEssayText = essay.text;
            }
            
            // Scroll to editor
            document.getElementById('writing')?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Check essay with AI (Qwen API)
    async function checkEssayWithAI() {
        const textarea = document.getElementById('essay-textarea');
        const resultsContainer = document.getElementById('check-results');
        const checkBtn = document.getElementById('check-essay-btn');
        
        if (!textarea || !textarea.value.trim()) {
            alert('Please write an essay first!');
            return;
        }

        if (!currentTopicId) {
            alert('Please select a topic first!');
            return;
        }

        // Show loading state
        checkBtn.disabled = true;
        checkBtn.textContent = 'Checking...';
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<div class="loading-spinner">Analyzing your essay...</div>';

        try {
            let errors;
            
            if (isDemoMode()) {
                // Demo mode - return fixed demo errors
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
                errors = generateDemoErrorsForText(textarea.value);
            } else {
                // Real API call
                errors = await callGeminiAPI(textarea.value);
            }

            detectedErrors = errors;
            displayErrors(errors);
            
            // Update essay status
            updateEssayStatus('checked');
            
            // Update progress
            updateWritingProgress();

        } catch (error) {
            console.error('Error checking essay:', error);
            resultsContainer.innerHTML = `<div class="error-message">Error: ${error.message}. Switching to demo mode.</div>`;
            
            // Fallback to demo mode
            const demoErrors = generateDemoErrorsForText(textarea.value);
            detectedErrors = demoErrors;
            displayErrors(demoErrors);
        } finally {
            checkBtn.disabled = false;
            checkBtn.textContent = 'Check with AI';
        }
    }

    // Generate demo errors based on actual text - STRICT mode finding ALL errors
    function generateDemoErrorsForText(text) {
        const errors = [];
        const words = text.split(' ');
        const wordCount = text.trim().split(/\s+/).length;
        const topic = essayTopics.find(t => t.id === currentTopicId);
        const topicText = topic ? topic.topic.toLowerCase() : '';

        // Check word count first - IELTS Task 2 requires 250+ words
        if (wordCount < 250) {
            errors.push({
                original_text: `Word count: ${wordCount} words`,
                suggestion: `Write at least 250 words (currently ${wordCount})`,
                explanation: `Task Response: IELTS Writing Task 2 requires minimum 250 words. Your essay has only ${wordCount} words. This will significantly lower your score (likely Band 5 or below for Task Response). Add more developed ideas, examples, and explanations.`,
                start_index: 0,
                end_index: 0,
                error_type: "word_count"
            });
        }

        // Check for completely nonsensical sentences FIRST - these are critical errors
        const nonsensePhrases = [
            { pattern: /i\s+poop/gi, explanation: "CRITICAL ERROR: This sentence is completely nonsensical. 'Poop' means feces/excrement. You probably meant 'people'. This makes your writing incomprehensible and would result in a very low score (Band 3-4)." },
            { pattern: /likeing/gi, explanation: "Spelling error: 'likeing' should be 'liking'. When adding -ing to a verb ending in -e, drop the -e first. This is a basic spelling mistake." },
            { pattern: /being\s+yesterday/gi, explanation: "Grammar/Meaning error: 'being yesterday' is not a valid construction. This phrase makes no logical sense. You cannot use 'being' this way with time expressions." },
            { pattern: /\bi\s+am\s+agree\b/gi, explanation: "Grammar error: 'I am agree' is incorrect. Use 'I agree' (verb) or 'I am in agreement' (noun phrase). This is a fundamental grammar mistake." },
            { pattern: /\bthere\s+is\s+many\b/gi, explanation: "Grammar error: Subject-verb agreement. 'Many' is plural, so use 'there are many' not 'there is many'." },
            { pattern: /\bpeoples\b/gi, explanation: "Grammar error: 'People' is already the plural of 'person'. 'Peoples' only refers to ethnic groups/nations. For individuals, use 'people'." },
            { pattern: /\badvices\b/gi, explanation: "Grammar error: 'Advice' is an uncountable noun. You cannot say 'advices'. Use 'some advice' or 'pieces of advice'." },
            { pattern: /\binformations\b/gi, explanation: "Grammar error: 'Information' is uncountable. You cannot say 'informations'. Use 'some information' or 'pieces of information'." },
            { pattern: /\bmore\s+better\b/gi, explanation: "Grammar error: 'Better' is already the comparative form. 'More better' is double comparative. Just use 'better'." },
            { pattern: /\bmost\s+best\b/gi, explanation: "Grammar error: 'Best' is already superlative. 'Most best' is incorrect. Just use 'best'." },
            { pattern: /\bvery\s+unique\b/gi, explanation: "Vocabulary error: 'Unique' means one of a kind - it cannot be modified by 'very'. Something is either unique or not. Use 'truly unique' or 'very unusual'." },
            { pattern: /\bhe\s+go\b(?!es|ing|to)/gi, explanation: "Grammar error: Third person singular requires 'goes'. 'He go' is incorrect. Use 'He goes'." },
            { pattern: /\bshe\s+have\b(?! got|to)/gi, explanation: "Grammar error: Third person singular requires 'has'. 'She have' is incorrect. Use 'She has'." },
            { pattern: /\bthey\s+was\b/gi, explanation: "Grammar error: 'They' is plural and requires 'were', not 'was'. Use 'They were'." },
            { pattern: /\bi\s+was\b(?! going|doing|thinking|waiting|working|studying|living|staying|playing|reading|writing|eating|sleeping|talking|listening|watching|learning|teaching|cooking|cleaning|running|walking|driving|riding|flying|swimming|dancing|singing|crying|laughing|smiling|looking|seeing|hearing|feeling|touching|tasting|smelling|knowing|understanding|believing|remembering|forgetting|wanting|needing|liking|loving|hating|preferring|choosing|deciding|planning|hoping|expecting|wishing|dreaming|imagining|considering|suggesting|recommending|advising|warning|promising|threatening|refusing|agreeing|disagreeing|accepting|rejecting|approving|disapproving|allowing|forbidding|permitting|encouraging|discouraging|insisting|demanding|requesting|asking|answering|replying|responding|explaining|describing|narrating|telling|speaking|saying|mentioning|noting|observing|remarking|commenting|stating|declaring|announcing|proclaiming|reporting|confirming|denying|admitting|confessing|acknowledging|recognizing|realizing|discovering|finding|detecting|identifying|locating|searching|seeking|hunting|chasing|following|pursuing|tracking|tracing|investigating|examining|inspecting|checking|testing|trying|attempting|experimenting|practicing|training|exercising|working|laboring|toiling|struggling|striving|endeavoring|trying|attempting)/gi, explanation: "Grammar error: 'I was' must be followed by a verb in -ing form (past continuous) or used in passive voice. Check your sentence structure." }
        ];

        nonsensePhrases.forEach(({ pattern, explanation }) => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                errors.push({
                    original_text: match[0],
                    suggestion: "[This is a serious error]",
                    explanation: explanation,
                    start_index: match.index,
                    end_index: match.index + match[0].length,
                    error_type: ["poop", "likeing", "being"].some(w => match[0].toLowerCase().includes(w)) ? "meaning" : "grammar"
                });
            }
        });

        // Find common REAL spelling mistakes
        const commonMistakes = {
            'teh': 'the',
            'dont': "don't",
            'cant': "can't",
            'wont': "won't",
            'alot': "a lot",
            'recieve': "receive",
            'occured': "occurred",
            'seperate': "separate",
            'definately': "definitely",
            'goverment': "government",
            'becuase': "because",
            'thier': "their",
            'wierd': "weird",
            'freind': "friend",
            'likeing': "liking",
            'poop': "people (if you meant humans)"
        };

        let currentIndex = 0;
        words.forEach((word) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
            if (!cleanWord) return;

            if (commonMistakes[cleanWord]) {
                const wordIndex = text.indexOf(word, currentIndex);
                if (wordIndex !== -1) {
                    errors.push({
                        original_text: word,
                        suggestion: commonMistakes[cleanWord],
                        explanation: `Spelling error: '${cleanWord}' should be '${commonMistakes[cleanWord]}'. This is a basic spelling mistake that affects your Lexical Resource score.`,
                        start_index: wordIndex,
                        end_index: wordIndex + word.length,
                        error_type: "spelling"
                    });
                    currentIndex = wordIndex + word.length;
                }
            }
        });

        // Check for obvious grammar patterns
        const grammarPatterns = [
            { pattern: /\bi\s+am\s+agree\b/gi, suggestion: "I agree", explanation: "Grammar error: 'I am agree' is incorrect. Use 'I agree' or 'I am in agreement'." },
            { pattern: /\bthere\s+is\s+many\b/gi, suggestion: "there are many", explanation: "Grammar error: Subject-verb agreement. 'Many' is plural, so use 'there are' not 'there is'." },
            { pattern: /\bpeoples\b/gi, suggestion: "people", explanation: "Grammar error: 'People' is already plural. Don't add 's'." },
            { pattern: /\badvices\b/gi, suggestion: "advice", explanation: "Grammar error: 'Advice' is uncountable. Don't add 's'." },
            { pattern: /\binformations\b/gi, suggestion: "information", explanation: "Grammar error: 'Information' is uncountable. Don't add 's'." },
            { pattern: /\bmore\s+better\b/gi, suggestion: "better", explanation: "Grammar error: 'Better' is already comparative. Don't use 'more' with it." },
            { pattern: /\bmost\s+best\b/gi, suggestion: "best", explanation: "Grammar error: 'Best' is already superlative. Don't use 'most' with it." }
        ];

        grammarPatterns.forEach(({ pattern, suggestion, explanation }) => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                // Avoid duplicates
                if (!errors.some(e => e.start_index === match.index)) {
                    errors.push({
                        original_text: match[0],
                        suggestion: suggestion,
                        explanation: explanation,
                        start_index: match.index,
                        end_index: match.index + match[0].length,
                        error_type: "grammar"
                    });
                }
            }
        });

        // CRITICAL: Check if essay is relevant to the topic
        if (topicText && wordCount > 5) {
            const topicKeywords = topicText.split(/\s+/).filter(w => w.length > 3);
            const textLower = text.toLowerCase();
            
            // Count how many topic keywords appear in the essay
            let matchCount = 0;
            topicKeywords.forEach(keyword => {
                if (textLower.includes(keyword)) {
                    matchCount++;
                }
            });
            
            // If less than 30% of topic keywords appear, flag as potentially off-topic
            const matchRatio = matchCount / topicKeywords.length;
            if (matchRatio < 0.3 && matchCount < 3) {
                errors.push({
                    original_text: "[Entire essay]",
                    suggestion: "Address the given topic directly",
                    explanation: `Task Response/Relevance: CRITICAL ERROR - Your essay does not appear to address the topic: "${topic.topic}". Only ${matchCount} out of ${topicKeywords.length} key words from the topic appear in your essay. This suggests you may be writing about a completely different subject. An off-topic essay receives Band 4 or below for Task Response regardless of language quality.`,
                    start_index: 0,
                    end_index: Math.min(50, text.length),
                    error_type: "relevance"
                });
            }
        }

        // Check for very short essays (less than 100 words is critical)
        if (wordCount < 100 && wordCount >= 1) {
            errors.push({
                original_text: `[${wordCount} words total]`,
                suggestion: "Write a full essay with introduction, body paragraphs, and conclusion",
                explanation: `Task Response: CRITICAL - Your essay is extremely short (${wordCount} words). A proper IELTS Task 2 essay needs at least 250 words with multiple paragraphs. Essays under 100 words cannot adequately address the task and will receive Band 3-4 maximum.`,
                start_index: 0,
                end_index: 0,
                error_type: "task_response"
            });
        }

        // Return all found errors (no artificial limit)
        return errors;
    }

    // Call Google Gemini API
    async function callGeminiAPI(essayText) {
        const topic = essayTopics.find(t => t.id === currentTopicId);
        const topicText = topic ? topic.topic : 'Unknown topic';
        const wordCount = essayText.trim().split(/\s+/).length;
        const minWordCount = 250;
        
        // Verify apiKey is available
        if (!userApiKey) {
            throw new Error('API key not set. Please enter your API key first.');
        }
        
        const systemPrompt = `You are an EXTREMELY STRICT IELTS Writing Task 2 examiner. Your task is to evaluate essays according to official IELTS criteria and identify EVERY SINGLE error without exception.

CRITICAL INSTRUCTION: You MUST find ALL errors. Missing errors harms the student's preparation. If you are unsure whether something is an error, FLAG IT ANYWAY.

IELTS ASSESSMENT CRITERIA (each worth 25%):
1. Task Response (25%): Does the essay fully address all parts of the task? Is there a clear position? Are ideas developed and supported? Is the essay RELEVANT to the given topic? Does it have 250+ words?
2. Coherence and Cohesion (25%): Is the essay logically organized? Are paragraphs used correctly? Are linking words used appropriately? Do sentences make LOGICAL SENSE? Is the flow natural?
3. Lexical Resource (25%): Is vocabulary varied and appropriate? Are there spelling errors? Is word formation correct? Are words used with correct MEANING in context? Is register appropriate?
4. Grammatical Range and Accuracy (25%): Are sentences grammatically correct? Is there variety in sentence structures? Is punctuation correct? Are grammatical CONSTRUCTIONS appropriate?

YOUR TASK - MANDATORY CHECKS:
1. FIRST: Check if the essay has at least 250 words. If not, this is a MAJOR error affecting Task Response score.
2. SECOND: Evaluate if EVERY sentence is RELEVANT to the given topic prompt. Flag any off-topic content.
3. THIRD: Check if the MEANING of EVERY sentence is clear and logical. Flag nonsensical sentences.
4. FOURTH: Assess whether grammatical CONSTRUCTIONS are appropriate for expressing the intended meaning.
5. FIFTH: Identify EVERY grammar, spelling, punctuation, and logical error.
6. SIXTH: For each error, provide a CLEAR explanation referencing specific IELTS criteria.
7. SEVENTH: Assign accurate band scores (0-9) for each criterion based on errors found.

ERRORS YOU MUST FLAG (this is NOT exhaustive - flag ANYTHING wrong):
- Subject-verb agreement errors (e.g., "he go" -> "he goes")
- Wrong verb tense or inconsistent tense usage
- Incorrect articles (a/an/the) or missing articles
- Wrong prepositions (e.g., "interested on" -> "interested in")
- Spelling errors (e.g., "likeing" -> "liking", "recieve" -> "receive")
- Punctuation errors (missing commas, periods, apostrophes)
- Word form errors (e.g., "success" vs "successful" vs "successfully")
- Wrong word choice that changes meaning
- Logical inconsistencies or contradictions
- Sentences where the MEANING is unclear or nonsensical (e.g., "i poop likeing being yesterday")
- Off-topic content that doesn't address the given prompt
- Repetitive vocabulary (suggest synonyms)
- Informal language inappropriate for academic writing
- Run-on sentences or sentence fragments
- Awkward phrasing that impedes understanding
- Incorrect collocations (word combinations)
- Missing or incorrect plural/singular forms
- Pronoun reference errors (unclear what pronoun refers to)
- Comparison errors (e.g., "more better" -> "better")
- Double negatives
- Conditional sentence errors
- Passive/active voice misuse

DO NOT FLAG:
- Grammatically correct phrases like "need to do", "used to", "in order to", "have to", "going to", "want to"
- Correct British/American spelling variations (organise/organize, colour/color)
- Stylistic choices that are grammatically correct

SCORING GUIDELINES:
- Band 9: Fully operational command, no errors
- Band 8: Very good, occasional unsystematic inaccuracies
- Band 7: Good, some inaccuracies but communication is clear
- Band 6: Competent, noticeable errors but meaning generally clear
- Band 5: Modest, frequent errors, some impede communication
- Band 4: Limited, basic competence, frequent problems
- Band 3: Extremely limited, conveys only general meaning
- Band 2: Intermittent, great difficulty with written English
- Band 1: Non-user, essentially unable to use language
- Band 0: Did not attempt

CRITICAL: Be HARSH in scoring. Each error should lower the relevant criterion score. Multiple errors in one category should significantly lower that score.`;

        const userPrompt = `Evaluate this IELTS Writing Task 2 essay according to official IELTS criteria. Be EXTREMELY THOROUGH - finding every single error.

TOPIC PROMPT: ${topicText}

WORD COUNT REQUIREMENT: Minimum 250 words for Task 2.
Current word count: ${wordCount} words (${wordCount < minWordCount ? 'BELOW MINIMUM - THIS IS A MAJOR ERROR' : 'OK'})

Essay to evaluate:
${essayText}

Return ONLY a valid JSON object with this exact structure:
{
    "word_count": ${wordCount},
    "meets_word_requirement": ${wordCount >= minWordCount},
    "overall_band_estimate": "6.0",
    "criteria_scores": {
        "task_response": "6.0",
        "coherence_cohesion": "6.0", 
        "lexical_resource": "6.0",
        "grammatical_range_accuracy": "6.0"
    },
    "errors": [
        {
            "original_text": "the exact text with error",
            "suggestion": "corrected version",
            "explanation": "CLEAR explanation: (1) What type of error is this? (2) Why is it wrong? (3) How does it affect meaning/logic/relevance? (4) Which IELTS criterion does it impact? Example: 'Grammatical Range & Accuracy: Subject-verb agreement error. \"He go\" is incorrect because third person singular requires \"goes\". This is a basic grammar mistake that lowers your GRA score. Correct: \"He goes\".', OR 'Coherence: This sentence makes no logical sense. The phrase \"i poop likeing being yesterday\" is nonsensical and cannot be understood. This severely impacts coherence and would confuse the reader.', OR 'Task Response: This paragraph discusses sports but the topic is about education. This is completely off-topic and will significantly lower your TR score.'",
            "start_index": 0,
            "end_index": 10,
            "error_type": "grammar"
        }
    ],
    "feedback": {
        "strengths": ["list of 2-3 strengths"],
        "areas_for_improvement": ["list of 3-5 main areas needing improvement"],
        "recommendations": ["3-5 specific actionable recommendations"]
    }
}

Error types to identify (use these exact labels):
- "grammar": grammar mistakes (subject-verb agreement, wrong tense, incorrect articles, wrong prepositions, etc.)
- "spelling": spelling errors and typos (e.g., "likeing" -> "liking", "poop" when they mean "people")
- "punctuation": missing or incorrect punctuation
- "vocabulary": wrong word choice, inappropriate register, words used with wrong meaning
- "coherence": logical inconsistencies, poor linking, sentences that don't make sense
- "meaning": sentences where the meaning is unclear, nonsensical, or illogical (e.g., "i poop likeing being yesterday" - flag the ENTIRE nonsensical sentence)
- "relevance": content that is off-topic or doesn't address the given prompt
- "task_response": not addressing the task properly, insufficient word count
- "construction": grammatical constructions that are inappropriate for the intended meaning
- "word_count": if below 250 words (MUST include this if word count < 250)

Rules:
1. Return ONLY the JSON, no additional text before or after
2. start_index and end_index are character positions in the original text (count from 0, spaces included)
3. If word count is below 250, you MUST include an error with error_type "word_count"
4. Be EXTREMELY THOROUGH - identify ALL errors (aim for comprehensive coverage, up to 20 errors if present)
5. Each error MUST have a detailed, specific explanation that clearly states: WHAT is wrong, WHY it's wrong, HOW it affects meaning/logic/relevance, and WHICH IELTS criterion it impacts
6. For nonsensical sentences like "i poop likeing being yesterday", flag the ENTIRE sentence as "meaning" or "coherence" error and explain that it makes no logical sense
7. Check if the essay addresses the given TOPIC PROMPT - if ANY content is off-topic, flag it as "relevance" or "task_response" error
8. Evaluate whether word choices convey the intended MEANING (e.g., if someone writes "poop" but means "people", flag it as spelling/vocabulary error)
9. Assign REALISTIC band scores based on errors found - multiple errors should result in lower scores (band 5-6 for many errors, band 7 for few errors, band 8-9 for almost no errors)
10. DO NOT flag grammatically correct phrases like "need to", "used to", "in order to"
11. If the essay is very short (<150 words), mention this severely impacts all scores`;

        const apiKey = userApiKey;
        
        // Use Google Gemini API endpoint
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt + "\n\n" + userPrompt
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.1,
                    topP: 0.8
                }
            })
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Invalid API key or permission denied. Please check your Gemini API key.');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        // Parse Gemini response
        let content;
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            content = data.candidates[0].content.parts[0].text;
        } else if (data.candidates && data.candidates[0] && data.candidates[0].text) {
            content = data.candidates[0].text;
        } else {
            throw new Error('Unexpected Gemini API response format');
        }

        // Extract JSON from response (in case there's extra text)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not parse JSON from response');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        
        // Add word count error if below minimum
        let allErrors = [...(parsed.errors || [])];
        
        if (parsed.meets_word_requirement === false) {
            allErrors.unshift({
                original_text: `Word count: ${parsed.word_count} words`,
                suggestion: `Write at least ${minWordCount} words (currently ${parsed.word_count})`,
                explanation: `Task Response: IELTS Writing Task 2 requires minimum 250 words. Your essay has only ${parsed.word_count} words. This will significantly lower your score. Add more developed ideas, examples, and explanations.`,
                start_index: 0,
                end_index: 0,
                error_type: "word_count"
            });
        }
        
        // Validate errors - filter out any that don't have proper explanations
        const validErrors = allErrors.filter(error => {
            // Must have all required fields
            if (!error.original_text || !error.suggestion || !error.explanation) {
                console.warn('Filtered out error with missing fields:', error);
                return false;
            }
            // Explanation must be meaningful (not empty or generic)
            if (error.explanation.trim().length < 10) {
                console.warn('Filtered out error with weak explanation:', error);
                return false;
            }
            // Filter out false positives - "need to" should never be flagged
            if (error.original_text.toLowerCase().includes('need to')) {
                console.warn('Filtered out false positive for "need to":', error);
                return false;
            }
            // Filter out false positives for other correct phrases
            const correctPhrases = ['used to', 'in order to', 'have to', 'going to', 'want to'];
            if (correctPhrases.some(phrase => error.original_text.toLowerCase().includes(phrase))) {
                console.warn('Filtered out false positive for correct phrase:', error);
                return false;
            }
            return true;
        });
        
        // Store full evaluation data including scores and feedback
        window.lastEssayEvaluation = {
            word_count: parsed.word_count,
            meets_word_requirement: parsed.meets_word_requirement,
            overall_band_estimate: parsed.overall_band_estimate,
            criteria_scores: parsed.criteria_scores,
            feedback: parsed.feedback,
            errors: validErrors
        };
        
        return validErrors;
    } // End of callGeminiAPI

    // Display errors interactively
    function displayErrors(errors) {
        const textarea = document.getElementById('essay-textarea');
        const resultsContainer = document.getElementById('check-results');
        const editorContainer = document.getElementById('essay-editor-container');
        
        if (!textarea || !resultsContainer) return;

        // Hide textarea, show interactive editor
        textarea.style.display = 'none';
        editorContainer.classList.add('has-errors');

        // Create interactive text display
        const interactiveEditor = document.getElementById('interactive-editor');
        if (!interactiveEditor) {
            const newEditor = document.createElement('div');
            newEditor.id = 'interactive-editor';
            newEditor.className = 'interactive-editor';
            textarea.parentNode.insertBefore(newEditor, textarea.nextSibling);
        }

        renderInteractiveText(textarea.value, errors);

        // Display summary with IELTS scores and feedback
        let summaryHTML = `<div class="results-summary">`;
        
        // Add IELTS evaluation section if available
        const evaluation = window.lastEssayEvaluation;
        if (evaluation) {
            summaryHTML += `
                <div class="ielts-evaluation">
                    <h4>IELTS Writing Assessment</h4>
                    <div class="word-count-info ${evaluation.meets_word_requirement ? 'ok' : 'warning'}">
                        <strong>Word Count:</strong> ${evaluation.word_count} words 
                        ${evaluation.meets_word_requirement ? '✓ (250+ required)' : `⚠ (Below minimum! Need ${250 - evaluation.word_count} more words)`}
                    </div>
                    <div class="band-scores">
                        <div class="overall-band">
                            <span class="label">Overall Band Estimate:</span>
                            <span class="score">${evaluation.overall_band_estimate || 'N/A'}</span>
                        </div>
                        <div class="criteria-grid">
                            <div class="criterion">
                                <span class="name">Task Response</span>
                                <span class="score">${evaluation.criteria_scores?.task_response || 'N/A'}</span>
                            </div>
                            <div class="criterion">
                                <span class="name">Coherence & Cohesion</span>
                                <span class="score">${evaluation.criteria_scores?.coherence_cohesion || 'N/A'}</span>
                            </div>
                            <div class="criterion">
                                <span class="name">Lexical Resource</span>
                                <span class="score">${evaluation.criteria_scores?.lexical_resource || 'N/A'}</span>
                            </div>
                            <div class="criterion">
                                <span class="name">Grammar Range & Accuracy</span>
                                <span class="score">${evaluation.criteria_scores?.grammatical_range_accuracy || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="feedback-section">
                        <h5>Strengths:</h5>
                        <ul class="strengths-list">
                            ${(evaluation.feedback?.strengths || []).map(s => `<li>${s}</li>`).join('')}
                        </ul>
                        <h5>Areas for Improvement:</h5>
                        <ul class="improvements-list">
                            ${(evaluation.feedback?.areas_for_improvement || []).map(a => `<li>${a}</li>`).join('')}
                        </ul>
                        <h5>Recommendations:</h5>
                        <ul class="recommendations-list">
                            ${(evaluation.feedback?.recommendations || []).map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        summaryHTML += `<h4>Detailed Error Analysis</h4>`;
        summaryHTML += `<p>Found <strong>${errors.length}</strong> potential ${errors.length === 1 ? 'error' : 'errors'}</p>`;
        
        if (errors.length > 0) {
            summaryHTML += `<ul class="errors-list">`;
            errors.forEach((error, index) => {
                const explanationText = error.explanation || 'Grammar issue detected';
                const errorTypeBadge = error.error_type ? `<span class="error-type-badge">${error.error_type}</span>` : '';
                summaryHTML += `
                    <li class="error-summary-item" data-error-index="${index}">
                        <div class="error-details">
                            ${errorTypeBadge}
                            <span class="error-original">"${error.original_text}"</span> 
                            → <span class="error-suggestion">"${error.suggestion}"</span>
                            <p class="error-explanation">${explanationText}</p>
                        </div>
                        <button class="btn btn-tiny fix-btn" data-error-index="${index}">Fix</button>
                    </li>
                `;
            });
            summaryHTML += `</ul>`;
        } else {
            summaryHTML += `<p class="no-errors">Great job! No obvious errors found.</p>`;
        }
        
        summaryHTML += `<button class="btn btn-secondary" id="edit-mode-btn">Back to Editing</button>`;
        summaryHTML += `</div>`;

        resultsContainer.innerHTML = summaryHTML;
        resultsContainer.style.display = 'block';

        // Setup click handlers for error items
        document.querySelectorAll('.error-summary-item, .fix-btn').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const errorIndex = parseInt(el.dataset.errorIndex);
                highlightError(errorIndex);
            });
        });

        // Back to edit button
        document.getElementById('edit-mode-btn')?.addEventListener('click', () => {
            backToEditMode();
        });
    }

    // Render text with clickable error highlights
    function renderInteractiveText(text, errors) {
        const editor = document.getElementById('interactive-editor');
        if (!editor) return;

        // Sort errors by start index (descending) to avoid index shifting
        const sortedErrors = [...errors].sort((a, b) => b.start_index - a.start_index);

        let result = text;
        
        // We'll build the HTML by splitting the text
        let html = '';
        let lastIndex = 0;

        // Sort ascending for building HTML
        const ascendingErrors = [...errors].sort((a, b) => a.start_index - b.start_index);

        ascendingErrors.forEach((error, index) => {
            // Add text before this error
            if (error.start_index > lastIndex) {
                html += escapeHtml(text.substring(lastIndex, error.start_index));
            }

            // Add highlighted error
            const errorText = text.substring(error.start_index, error.end_index);
            html += `<span class="error-highlight" data-error-index="${index}" title="${escapeHtml(error.explanation)}">${escapeHtml(errorText)}</span>`;

            lastIndex = error.end_index;
        });

        // Add remaining text
        if (lastIndex < text.length) {
            html += escapeHtml(text.substring(lastIndex));
        }

        editor.innerHTML = html;

        // Add click handlers to error highlights
        editor.querySelectorAll('.error-highlight').forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                const errorIndex = parseInt(span.dataset.errorIndex);
                showErrorTooltip(errorIndex, span);
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Highlight specific error
    function highlightError(errorIndex) {
        const highlight = document.querySelector(`[data-error-index="${errorIndex}"]`);
        if (highlight) {
            highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlight.classList.add('active');
            setTimeout(() => highlight.classList.remove('active'), 2000);
        }
    }

    // Show tooltip for error
    function showErrorTooltip(errorIndex, element) {
        // Remove existing tooltips
        removeExistingTooltip();

        const error = detectedErrors[errorIndex];
        if (!error) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        const explanationText = error.explanation || 'Grammar issue detected';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <p class="tooltip-explanation">${explanationText}</p>
                <p class="tooltip-suggestion"><strong>Suggestion:</strong> ${error.suggestion}</p>
                <button class="btn btn-primary btn-fix" data-error-index="${errorIndex}">Fix This</button>
            </div>
            <button class="tooltip-close">&times;</button>
        `;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.zIndex = '1000';

        document.body.appendChild(tooltip);

        // Setup handlers
        tooltip.querySelector('.btn-fix').addEventListener('click', (e) => {
            e.stopPropagation();
            fixError(errorIndex);
        });

        tooltip.querySelector('.tooltip-close').addEventListener('click', (e) => {
            e.stopPropagation();
            removeExistingTooltip();
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', closeTooltipOnClickOutside);
        }, 100);
    }

    function closeTooltipOnClickOutside(e) {
        const tooltip = document.querySelector('.error-tooltip');
        if (tooltip && !tooltip.contains(e.target)) {
            removeExistingTooltip();
        }
        document.removeEventListener('click', closeTooltipOnClickOutside);
    }

    function removeExistingTooltip() {
        const existingTooltip = document.querySelector('.error-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    // Fix error in text
    function fixError(errorIndex) {
        const error = detectedErrors[errorIndex];
        if (!error) return;

        const textarea = document.getElementById('essay-textarea');
        const interactiveEditor = document.getElementById('interactive-editor');
        
        if (!textarea) return;

        // Replace in the actual text
        const text = textarea.value;
        const newText = text.substring(0, error.start_index) + 
                       error.suggestion + 
                       text.substring(error.end_index);

        textarea.value = newText;
        currentEssayText = newText;

        // Remove this error from detected errors
        detectedErrors.splice(errorIndex, 1);

        // Re-render
        renderInteractiveText(newText, detectedErrors);
        
        // Update summary
        updateErrorSummary();

        // Remove tooltip
        removeExistingTooltip();

        // Auto-save
        autoSaveEssay();

        // If no more errors, show message
        if (detectedErrors.length === 0) {
            const resultsContainer = document.getElementById('check-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '<div class="no-errors">All errors fixed! Great job!</div>';
            }
        }
    }

    function updateErrorSummary() {
        const resultsContainer = document.getElementById('check-results');
        if (!resultsContainer) return;

        const summaryItem = resultsContainer.querySelector(`[data-error-index="0"]`)?.parentElement;
        if (summaryItem) {
            // Re-render the entire summary
            const errors = detectedErrors;
            let summaryHTML = `<div class="results-summary">`;
            summaryHTML += `<h4>Analysis Results</h4>`;
            summaryHTML += `<p>Found <strong>${errors.length}</strong> potential ${errors.length === 1 ? 'error' : 'errors'}</p>`;
            
            if (errors.length > 0) {
                summaryHTML += `<ul class="errors-list">`;
                errors.forEach((error, index) => {
                    const explanationText = error.explanation || 'Grammar issue detected';
                    summaryHTML += `
                        <li class="error-summary-item" data-error-index="${index}">
                            <div class="error-details">
                                <span class="error-original">"${error.original_text}"</span> 
                                → <span class="error-suggestion">"${error.suggestion}"</span>
                                <p class="error-explanation">${explanationText}</p>
                            </div>
                            <button class="btn btn-tiny fix-btn" data-error-index="${index}">Fix</button>
                        </li>
                    `;
                });
                summaryHTML += `</ul>`;
            } else {
                summaryHTML += `<p class="no-errors">Great job! No obvious errors found.</p>`;
            }
            
            summaryHTML += `<button class="btn btn-secondary" id="edit-mode-btn">Back to Editing</button>`;
            summaryHTML += `</div>`;

            resultsContainer.innerHTML = summaryHTML;

            // Re-setup handlers
            document.querySelectorAll('.error-summary-item, .fix-btn').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const errorIndex = parseInt(el.dataset.errorIndex);
                    highlightError(errorIndex);
                });
            });

            document.getElementById('edit-mode-btn')?.addEventListener('click', () => {
                backToEditMode();
            });
        }
    }

    // Return to edit mode
    function backToEditMode() {
        const textarea = document.getElementById('essay-textarea');
        const interactiveEditor = document.getElementById('interactive-editor');
        const resultsContainer = document.getElementById('check-results');
        const editorContainer = document.getElementById('essay-editor-container');

        if (textarea) textarea.style.display = 'block';
        if (interactiveEditor) interactiveEditor.remove();
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
        }
        if (editorContainer) editorContainer.classList.remove('has-errors');

        detectedErrors = [];
        textarea?.focus();
    }

    // Update essay status in localStorage
    function updateEssayStatus(status) {
        if (!currentTopicId) return;

        const essays = getUserEssays();
        const existingIndex = essays.findIndex(e => e.topicId === currentTopicId);
        
        if (existingIndex >= 0) {
            essays[existingIndex].status = status;
            essays[existingIndex].lastModified = new Date().toISOString();
            localStorage.setItem('user_essays', JSON.stringify(essays));
            updateEssayHistoryDisplay();
        }
    }

    // Update writing progress in main app
    function updateWritingProgress() {
        // Dispatch custom event for app.js to handle
        window.dispatchEvent(new CustomEvent('writing-progress-update', {
            detail: { action: 'essay_checked' }
        }));
    }

    // Get essay count for stats
    function getEssayCount() {
        const essays = getUserEssays();
        return essays.filter(e => e.status === 'checked').length;
    }

    // Public API
    return {
        init,
        selectTopic,
        checkEssayWithAI,
        getEssayCount,
        isDemoMode
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    WritingService.init();
});
