const grammarData = [
    // B1 Level - Tenses
    {
        id: 1,
        level: "B1",
        topic: "tenses",
        question: "By the time we arrive at the cinema, the movie _______.",
        options: ["will start", "will have started", "starts", "started"],
        correct: 1,
        explanation: "Future Perfect (will have + past participle) is used for actions that will be completed before a specific time in the future."
    },
    {
        id: 2,
        level: "B1",
        topic: "tenses",
        question: "She _______ in London for five years before she moved to Paris.",
        options: ["has lived", "had been living", "lived", "was living"],
        correct: 1,
        explanation: "Past Perfect Continuous (had been + verb-ing) emphasizes the duration of an action before another past action."
    },
    {
        id: 3,
        level: "B1",
        topic: "tenses",
        question: "I _______ this book since morning. I need to finish it soon.",
        options: ["read", "have been reading", "am reading", "had read"],
        correct: 1,
        explanation: "Present Perfect Continuous (have/has been + verb-ing) shows an action that started in the past and continues to the present."
    },
    {
        id: 4,
        level: "B1",
        topic: "tenses",
        question: "When I _______ home, my family was already having dinner.",
        options: ["got", "get", "had got", "have got"],
        correct: 0,
        explanation: "Past Simple is used for completed actions in the past. The sequence is clear from context."
    },
    {
        id: 5,
        level: "B1",
        topic: "tenses",
        question: "He _______ to the gym three times a week.",
        options: ["goes", "is going", "has gone", "gone"],
        correct: 0,
        explanation: "Present Simple is used for habits and regular activities."
    },
    
    // B1 Level - Conditionals
    {
        id: 6,
        level: "B1",
        topic: "conditionals",
        question: "If I _______ you were coming, I would have baked a cake.",
        options: ["knew", "know", "had known", "have known"],
        correct: 2,
        explanation: "Third Conditional: If + Past Perfect, would have + past participle. Used for hypothetical situations in the past."
    },
    {
        id: 7,
        level: "B1",
        topic: "conditionals",
        question: "If she _______ harder, she would pass the exam.",
        options: ["studied", "studies", "had studied", "study"],
        correct: 0,
        explanation: "Second Conditional: If + Past Simple, would + base verb. Used for hypothetical situations in the present or future."
    },
    {
        id: 8,
        level: "B1",
        topic: "conditionals",
        question: "Unless you _______ now, you'll miss the train.",
        options: ["leave", "don't leave", "left", "leaving"],
        correct: 0,
        explanation: "'Unless' means 'if not'. First Conditional: Unless + Present Simple, will + base verb for real future possibilities."
    },
    {
        id: 9,
        level: "B1",
        topic: "conditionals",
        question: "If it _______ tomorrow, we'll stay at home.",
        options: ["rains", "will rain", "rained", "would rain"],
        correct: 0,
        explanation: "First Conditional: If + Present Simple, will + base verb. Used for real possibilities in the future."
    },
    
    // B1 Level - Passive Voice
    {
        id: 10,
        level: "B1",
        topic: "passive",
        question: "The new bridge _______ by the end of next year.",
        options: ["will complete", "will be completed", "is completed", "has been completed"],
        correct: 1,
        explanation: "Future Passive: will be + past participle. The subject receives the action in the future."
    },
    {
        id: 11,
        level: "B1",
        topic: "passive",
        question: "This house _______ in 1890.",
        options: ["built", "was built", "has been built", "is built"],
        correct: 1,
        explanation: "Past Simple Passive: was/were + past participle. Used for completed actions in the past."
    },
    {
        id: 12,
        level: "B1",
        topic: "passive",
        question: "The documents _______ by the manager right now.",
        options: ["are being signed", "sign", "are signing", "have been signed"],
        correct: 0,
        explanation: "Present Continuous Passive: am/is/are being + past participle. Action happening at the moment."
    },
    
    // B1 Level - Articles
    {
        id: 13,
        level: "B1",
        topic: "articles",
        question: "_______ Amazon is _______ longest river in South America.",
        options: ["The / the", "— / the", "The / —", "— / —"],
        correct: 1,
        explanation: "No article before proper nouns like river names. 'The' is used with superlatives (the longest)."
    },
    {
        id: 14,
        level: "B1",
        topic: "articles",
        question: "I need to buy _______ bread and _______ apples.",
        options: ["a / some", "some / some", "the / the", "— / —"],
        correct: 3,
        explanation: "No article with uncountable nouns (bread) and plural countable nouns (apples) when speaking generally."
    },
    {
        id: 15,
        level: "B1",
        topic: "articles",
        question: "She works as _______ engineer at _______ university.",
        options: ["an / a", "a / an", "the / the", "an / an"],
        correct: 0,
        explanation: "'An' before vowel sounds (engineer). 'A' before consonant sounds (university - starts with 'y' sound)."
    },
    
    // B1 Level - Prepositions
    {
        id: 16,
        level: "B1",
        topic: "prepositions",
        question: "I'm not very good _______ remembering names.",
        options: ["in", "at", "on", "with"],
        correct: 1,
        explanation: "'Good at' is the correct collocation for expressing skill or ability."
    },
    {
        id: 17,
        level: "B1",
        topic: "prepositions",
        question: "We arrived _______ the airport just in time.",
        options: ["to", "at", "in", "on"],
        correct: 1,
        explanation: "'Arrive at' is used for specific places. 'Arrive in' is used for cities and countries."
    },
    {
        id: 18,
        level: "B1",
        topic: "prepositions",
        question: "She's been working here _______ 2019.",
        options: ["since", "for", "from", "during"],
        correct: 0,
        explanation: "'Since' is used with a specific point in time. 'For' is used with a period of time."
    },
    
    // B2 Level - Tenses (more complex)
    {
        id: 19,
        level: "B2",
        topic: "tenses",
        question: "Hardly _______ the house when it started to rain.",
        options: ["I had left", "had I left", "I left", "did I leave"],
        correct: 1,
        explanation: "Inversion after 'hardly': Hardly + had + subject + past participle. Formal structure for emphasis."
    },
    {
        id: 20,
        level: "B2",
        topic: "tenses",
        question: "By next month, I _______ here for ten years.",
        options: ["will work", "will have been working", "work", "am working"],
        correct: 1,
        explanation: "Future Perfect Continuous emphasizes the duration of an action up to a specific future time."
    },
    {
        id: 21,
        level: "B2",
        topic: "tenses",
        question: "It's high time you _______ making a decision.",
        options: ["start", "started", "have started", "will start"],
        correct: 1,
        explanation: "'It's high time' is followed by Past Simple to express that something should be done now or soon."
    },
    
    // B2 Level - Conditionals (mixed & advanced)
    {
        id: 22,
        level: "B2",
        topic: "conditionals",
        question: "If I _______ about the traffic, I would have left earlier.",
        options: ["knew", "had known", "know", "have known"],
        correct: 1,
        explanation: "Mixed Conditional: Past condition (had known) with past result (would have left)."
    },
    {
        id: 23,
        level: "B2",
        topic: "conditionals",
        question: "_______ you change your mind, please let me know.",
        options: ["Should", "Would", "Will", "Had"],
        correct: 0,
        explanation: "'Should' can replace 'if' in conditional sentences for formal contexts: Should you... = If you should..."
    },
    {
        id: 24,
        level: "B2",
        topic: "conditionals",
        question: "I wish I _______ so much money on that car.",
        options: ["didn't spend", "hadn't spent", "haven't spent", "wouldn't spend"],
        correct: 1,
        explanation: "'I wish' + Past Perfect expresses regret about a past action."
    },
    
    // B2 Level - Passive Voice (advanced)
    {
        id: 25,
        level: "B2",
        topic: "passive",
        question: "The project _______ by the time the deadline arrives.",
        options: ["will finish", "will have been finished", "has finished", "is finished"],
        correct: 1,
        explanation: "Future Perfect Passive: will have been + past participle. Action completed before a future time."
    },
    {
        id: 26,
        level: "B2",
        topic: "passive",
        question: "He is said _______ very wealthy.",
        options: ["to be", "being", "be", "been"],
        correct: 0,
        explanation: "Passive with reporting verbs: is said + to-infinitive. Alternative to 'People say he is...'"
    },
    {
        id: 27,
        level: "B2",
        topic: "passive",
        question: "The matter _______ at the next meeting.",
        options: ["will discuss", "will be discussed", "is discussing", "has discussed"],
        correct: 1,
        explanation: "Future Passive for planned events. The subject receives the action."
    },
    
    // B2 Level - Modals
    {
        id: 28,
        level: "B2",
        topic: "modals",
        question: "You _______ seen her at the party – she was abroad last week!",
        options: ["can't have", "mustn't have", "shouldn't have", "needn't have"],
        correct: 0,
        explanation: "'Can't have + past participle' expresses impossibility about the past."
    },
    {
        id: 29,
        level: "B2",
        topic: "modals",
        question: "She _______ be tired after such a long journey.",
        options: ["must", "can", "should", "may"],
        correct: 0,
        explanation: "'Must' expresses logical certainty or strong probability about the present."
    },
    {
        id: 30,
        level: "B2",
        topic: "modals",
        question: "I _______ have cooked so much food – nobody was hungry!",
        options: ["needn't", "mustn't", "can't", "shouldn't"],
        correct: 0,
        explanation: "'Needn't have + past participle' means the action was unnecessary but was done anyway."
    },
    
    // B2 Level - Articles & Determiners (advanced)
    {
        id: 31,
        level: "B2",
        topic: "articles",
        question: "_______ rich should pay more taxes to help _______ poor.",
        options: ["The / the", "A / the", "The / —", "— / the"],
        correct: 0,
        explanation: "'The' + adjective refers to a group of people (the rich = rich people, the poor = poor people)."
    },
    {
        id: 32,
        level: "B2",
        topic: "articles",
        question: "He was sent to _______ prison for stealing _______ car.",
        options: ["the / a", "— / a", "a / the", "the / the"],
        correct: 1,
        explanation: "No article with 'prison' when referring to its purpose. 'A car' = any car, indefinite."
    },
    
    // B2 Level - Prepositions & Phrasal Verbs
    {
        id: 33,
        level: "B2",
        topic: "prepositions",
        question: "I can't put _______ this noise any longer!",
        options: ["up with", "off", "away with", "down to"],
        correct: 0,
        explanation: "'Put up with' is a phrasal verb meaning 'tolerate' or 'endure'."
    },
    {
        id: 34,
        level: "B2",
        topic: "prepositions",
        question: "She takes _______ her mother – they're both very artistic.",
        options: ["after", "off", "over", "up"],
        correct: 0,
        explanation: "'Take after' means to resemble a family member in appearance or character."
    },
    {
        id: 35,
        level: "B2",
        topic: "prepositions",
        question: "The success of the project depends _______ everyone's cooperation.",
        options: ["on", "in", "at", "of"],
        correct: 0,
        explanation: "'Depend on' is the correct preposition collocation."
    }
];
