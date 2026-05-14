// Grammar questions data for B1-B2 level
const grammarData = {
    tenses: [
        {
            question: "By the time we arrived at the cinema, the movie ______ already ______.",
            options: ["has / started", "had / started", "was / starting", "did / start"],
            correct: 1,
            explanation: "We use Past Perfect (had + V3) to show that one action happened before another in the past. The movie started BEFORE we arrived."
        },
        {
            question: "I ______ English for five years by next month.",
            options: ["will study", "will have been studying", "have studied", "am studying"],
            correct: 1,
            explanation: "Future Perfect Continuous (will have been + V-ing) is used for actions that will continue up to a specific point in the future."
        },
        {
            question: "She ______ to the gym every day before she injured her knee.",
            options: ["goes", "was going", "used to go", "has gone"],
            correct: 2,
            explanation: "'Used to' describes past habits or states that are no longer true. She doesn't go to the gym anymore due to her injury."
        },
        {
            question: "While I ______ dinner, the phone rang.",
            options: ["cooked", "was cooking", "had cooked", "have been cooking"],
            correct: 1,
            explanation: "Past Continuous (was/were + V-ing) describes an action in progress when another action interrupted it."
        },
        {
            question: "He ______ in London since 2015.",
            options: ["lives", "is living", "has been living", "had lived"],
            correct: 2,
            explanation: "Present Perfect Continuous (has/have been + V-ing) with 'since' shows an action that started in the past and continues to now."
        }
    ],
    conditionals: [
        {
            question: "If I ______ you, I would apologize immediately.",
            options: ["was", "am", "were", "have been"],
            correct: 2,
            explanation: "Second Conditional uses 'were' for all subjects in the if-clause to talk about hypothetical situations in the present."
        },
        {
            question: "If she ______ harder, she would have passed the exam.",
            options: ["studied", "had studied", "has studied", "studies"],
            correct: 1,
            explanation: "Third Conditional: If + Past Perfect, would have + V3. This talks about an unreal situation in the past."
        },
        {
            question: "Unless you ______ now, you'll miss the train.",
            options: ["leave", "don't leave", "left", "won't leave"],
            correct: 0,
            explanation: "'Unless' means 'if not'. We use Present Simple after 'unless' in First Conditional sentences."
        },
        {
            question: "If I ______ about the meeting, I would have attended.",
            options: ["knew", "had known", "have known", "know"],
            correct: 1,
            explanation: "Third Conditional expresses regret about the past. 'Had known' shows you didn't know about the meeting."
        },
        {
            question: "What would you do if you ______ a million dollars?",
            options: ["win", "won", "have won", "had won"],
            correct: 1,
            explanation: "Second Conditional (If + Past Simple, would + V1) talks about imaginary situations in the present or future."
        }
    ],
    passive: [
        {
            question: "The new bridge ______ by the end of next year.",
            options: ["will complete", "will be completed", "will have completed", "is completing"],
            correct: 1,
            explanation: "Future Passive: will be + V3. The bridge receives the action (it will be completed by someone)."
        },
        {
            question: "This book ______ by millions of people worldwide.",
            options: ["has read", "has been read", "is reading", "reads"],
            correct: 1,
            explanation: "Present Perfect Passive: has/have been + V3. The book is the receiver of the action."
        },
        {
            question: "The documents ______ when the fire started.",
            options: ["were being destroyed", "were destroying", "had been destroyed", "destroyed"],
            correct: 0,
            explanation: "Past Continuous Passive: was/were being + V3. An action was in progress at a specific moment in the past."
        },
        {
            question: "English ______ in many countries around the world.",
            options: ["speaks", "is speaking", "is spoken", "has spoken"],
            correct: 2,
            explanation: "Present Simple Passive: am/is/are + V3. English is spoken BY people (passive voice)."
        },
        {
            question: "The decision ______ by the committee tomorrow.",
            options: ["will make", "will be made", "is making", "makes"],
            correct: 1,
            explanation: "Future Simple Passive: will be + V3. The decision receives the action from the committee."
        }
    ],
    articles: [
        {
            question: "______ Amazon is ______ longest river in South America.",
            options: ["The / the", "— / the", "The / —", "An / the"],
            correct: 1,
            explanation: "Rivers take 'the' (the Amazon), but we use zero article with proper nouns. Superlatives always take 'the' (the longest)."
        },
        {
            question: "I need to buy ______ new laptop. ______ one I have is too old.",
            options: ["a / The", "the / A", "an / The", "— / The"],
            correct: 0,
            explanation: "'A' for first mention of a countable noun. 'The' for second mention or when we know which specific thing."
        },
        {
            question: "She goes to ______ university in ______ city center.",
            options: ["the / the", "a / the", "— / the", "an / —"],
            correct: 2,
            explanation: "Zero article with 'go to university' (as an institution). 'The' with 'city center' as it's a specific place."
        },
        {
            question: "______ rich should help ______ poor.",
            options: ["The / the", "A / the", "— / —", "The / —"],
            correct: 0,
            explanation: "'The' + adjective creates a plural noun meaning a group of people (the rich = rich people, the poor = poor people)."
        },
        {
            question: "He was awarded ______ MBA degree from ______ Harvard University.",
            options: ["an / —", "a / the", "an / the", "the / —"],
            correct: 0,
            explanation: "'An' before vowel sounds (MBA = em-bee-ay). Zero article with university names when 'University' is not part of the name."
        }
    ],
    prepositions: [
        {
            question: "I'm not very good ______ remembering names.",
            options: ["in", "at", "on", "with"],
            correct: 1,
            explanation: "'Good at' is the correct collocation. We use 'at' with skills and abilities."
        },
        {
            question: "The meeting will take place ______ Monday morning.",
            options: ["in", "at", "on", "during"],
            correct: 2,
            explanation: "'On' is used with days and dates. 'On Monday', 'on Monday morning', 'on July 5th'."
        },
        {
            question: "She's been working here ______ 2018.",
            options: ["since", "for", "from", "during"],
            correct: 0,
            explanation: "'Since' + specific point in time. 'For' + duration. 2018 is a starting point, so we use 'since'."
        },
        {
            question: "I'm interested ______ learning more about artificial intelligence.",
            options: ["on", "at", "in", "about"],
            correct: 2,
            explanation: "'Interested in' is the correct preposition. This is a fixed collocation."
        },
        {
            question: "We arrived ______ the airport just in time.",
            options: ["to", "at", "in", "on"],
            correct: 1,
            explanation: "'Arrive at' for specific places like airports, stations, buildings. 'Arrive in' for cities and countries."
        }
    ]
};
