// AI Service for Writing Check using Qwen API
// IMPORTANT: Replace ENCODED_API_KEY below with your encoded key

class AICheckService {
    constructor() {
        // Placeholder for encoded API key - replace with your encoded key
        this.encodedApiKey = 'ENCODED_API_KEY_HERE'; 
        this.apiKey = null;
        this.apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
    }

    // Simple Base64 decode function (you can use a more secure method)
    decodeKey(encodedKey) {
        try {
            // Basic base64 decoding - for production, use a more secure method
            return atob(encodedKey);
        } catch (error) {
            console.error('Error decoding API key:', error);
            return null;
        }
    }

    // Set and decode the API key
    setApiKey(encodedKey) {
        this.encodedApiKey = encodedKey;
        this.apiKey = this.decodeKey(encodedKey);
        return this.apiKey !== null;
    }

    // Check if API key is set
    hasApiKey() {
        return this.apiKey !== null && this.apiKey.length > 0;
    }

    // Send text to Qwen AI for checking
    async checkEssay(text, topic) {
        if (!this.hasApiKey()) {
            throw new Error('API key not set. Please configure your API key first.');
        }

        const prompt = `You are an English writing teacher specializing in IELTS exam preparation. 
Analyze the following essay written in response to this topic: "${topic}"

Essay text:
${text}

Your task:
1. Identify grammar, spelling, and punctuation errors
2. Identify awkward phrasing or unnatural expressions
3. Suggest improvements for vocabulary and sentence structure
4. Do NOT rewrite the entire essay, only point out specific issues

Return your response in this EXACT JSON format (no additional text):
{
    "errors": [
        {
            "original": "the exact incorrect phrase from the text",
            "position": {"start": 0, "end": 10},
            "type": "grammar|spelling|vocabulary|style",
            "suggestion": "corrected version",
            "explanation": "brief explanation of why it's wrong"
        }
    ],
    "overallFeedback": "general comments about the essay",
    "score": {"band": 6.5, "breakdown": {"grammar": 6, "vocabulary": 7, "coherence": 6.5, "taskResponse": 7}}
}

If there are no errors, return an empty errors array. Be precise with positions.`;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'qwen-turbo',
                    input: {
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a helpful English writing assistant that returns only valid JSON.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ]
                    },
                    parameters: {
                        result_format: 'message',
                        temperature: 0.3,
                        max_tokens: 2000
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            // Parse the AI response
            const aiContent = data.output?.choices?.[0]?.message?.content || '';
            
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI');
            }

            const result = JSON.parse(jsonMatch[0]);
            return this.processErrors(result, text);
            
        } catch (error) {
            console.error('AI Check Error:', error);
            throw error;
        }
    }

    // Process errors and map them to text positions
    processErrors(result, text) {
        const processedErrors = [];
        
        if (result.errors && Array.isArray(result.errors)) {
            result.errors.forEach(error => {
                // If position is not provided, try to find it in the text
                if (!error.position) {
                    const startIndex = text.indexOf(error.original);
                    if (startIndex !== -1) {
                        error.position = {
                            start: startIndex,
                            end: startIndex + error.original.length
                        };
                    }
                }
                
                if (error.position && error.position.start !== undefined) {
                    processedErrors.push({
                        id: Date.now() + Math.random(),
                        original: error.original,
                        suggestion: error.suggestion,
                        explanation: error.explanation,
                        type: error.type,
                        position: error.position,
                        fixed: false
                    });
                }
            });
        }

        return {
            errors: processedErrors,
            overallFeedback: result.overallFeedback || 'Good effort! Keep practicing.',
            score: result.score || null
        };
    }

    // Demo mode for testing without API key
    getDemoCheck(text, topic) {
        // Simulate AI response for demonstration
        const demoErrors = [];
        
        // Simple regex-based checks for demo purposes
        const commonMistakes = [
            { pattern: /\bi\b/g, replacement: 'I', type: 'grammar', explanation: 'The pronoun "I" should always be capitalized.' },
            { pattern: /\bdont\b/gi, replacement: "don't", type: 'spelling', explanation: 'Missing apostrophe in contraction.' },
            { pattern: /\bcant\b/gi, replacement: "can't", type: 'spelling', explanation: 'Missing apostrophe in contraction.' },
            { pattern: /\bwont\b/gi, replacement: "won't", type: 'spelling', explanation: 'Missing apostrophe in contraction.' },
            { pattern: /\bteh\b/gi, replacement: 'the', type: 'spelling', explanation: 'Common typo.' },
            { pattern: /\brecieve\b/gi, replacement: 'receive', type: 'spelling', explanation: 'Correct spelling is "receive" (i before e except after c).' },
            { pattern: /\btheir\s+is\b/gi, replacement: 'there is', type: 'grammar', explanation: '"Their" is possessive, "there" indicates location/existence.' },
            { pattern: /\byour\s+welcome\b/gi, replacement: "you're welcome", type: 'grammar', explanation: 'Should be "you\'re" (you are), not possessive "your".' },
            { pattern: /\bits\s+a\b/gi, replacement: "it's a", type: 'grammar', explanation: 'Should be "it\'s" (it is), not possessive "its".' },
            { pattern: /\beffect\b/gi, replacement: 'affect', type: 'vocabulary', explanation: 'Consider if you mean "affect" (verb) instead of "effect" (noun).' }
        ];

        commonMistakes.forEach(mistake => {
            let match;
            const regex = new RegExp(mistake.pattern.source, mistake.pattern.flags);
            while ((match = regex.exec(text)) !== null) {
                demoErrors.push({
                    id: Date.now() + Math.random(),
                    original: match[0],
                    suggestion: mistake.replacement,
                    explanation: mistake.explanation,
                    type: mistake.type,
                    position: {
                        start: match.index,
                        end: match.index + match[0].length
                    },
                    fixed: false
                });
            }
        });

        return Promise.resolve({
            errors: demoErrors,
            overallFeedback: 'This is a demo check. In real mode, AI will provide detailed feedback. Good effort on your essay!',
            score: demoErrors.length === 0 ? { band: 8.0, breakdown: { grammar: 8, vocabulary: 8, coherence: 8, taskResponse: 8 } } : 
                   { band: 6.0, breakdown: { grammar: 6, vocabulary: 6, coherence: 6, taskResponse: 6 } }
        });
    }
}

// Export singleton instance
const aiService = new AICheckService();
