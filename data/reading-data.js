// Reading comprehension passages for B1-B2 level
const readingData = {
    intermediate: [
        {
            title: "The Rise of Remote Work",
            text: `The concept of remote work has transformed dramatically over the past decade. What was once considered a rare perk offered by progressive companies has now become a mainstream working arrangement embraced by organizations worldwide.

The technology revolution has been the primary driver of this shift. High-speed internet, cloud computing, and sophisticated collaboration tools like Zoom, Slack, and Microsoft Teams have made it possible for employees to work effectively from virtually anywhere. The COVID-19 pandemic accelerated this trend, forcing companies to adopt remote work policies almost overnight.

Benefits of remote work are numerous. Employees report better work-life balance, reduced commuting stress, and increased productivity. Companies save on office space costs and can tap into a global talent pool without geographical restrictions. A recent study found that 74% of employees say remote work makes them less likely to leave their current employer.

However, challenges exist. Some workers struggle with isolation and difficulty separating work from personal life. Managers face challenges in maintaining team cohesion and company culture. Cybersecurity concerns have also increased as employees access company systems from home networks.

Experts predict that hybrid models combining remote and office work will become the norm. This flexible approach allows companies to reap the benefits of remote work while maintaining face-to-face interaction and collaboration.`,
            questions: [
                {
                    question: "What was the main factor that made remote work possible?",
                    options: ["The COVID-19 pandemic", "Technology advancement", "Employee demands", "Cost reduction"],
                    correct: 1
                },
                {
                    question: "According to the text, what percentage of employees say remote work makes them less likely to quit?",
                    options: ["50%", "64%", "74%", "84%"],
                    correct: 2
                },
                {
                    question: "Which of the following is NOT mentioned as a benefit of remote work?",
                    options: ["Better work-life balance", "Reduced commuting stress", "Higher salaries", "Increased productivity"],
                    correct: 2
                },
                {
                    question: "What do experts predict will become the standard working model?",
                    options: ["Fully remote work", "Office-only work", "Hybrid models", "Four-day work week"],
                    correct: 2
                }
            ]
        },
        {
            title: "Understanding Climate Change",
            text: `Climate change represents one of the most pressing challenges facing humanity in the 21st century. While Earth's climate has naturally fluctuated throughout history, scientific evidence overwhelmingly shows that human activities are accelerating warming at an unprecedented rate.

The primary cause is the greenhouse effect. When we burn fossil fuels like coal, oil, and gas, we release carbon dioxide and other greenhouse gases into the atmosphere. These gases trap heat from the sun, causing global temperatures to rise. Deforestation compounds the problem, as trees that would normally absorb CO2 are removed.

The consequences are already visible. Global average temperatures have risen by approximately 1.1°C since pre-industrial times. We're witnessing more frequent extreme weather events: hurricanes, droughts, floods, and wildfires. Polar ice caps are melting, causing sea levels to rise and threatening coastal communities worldwide.

Scientists warn that limiting warming to 1.5°C above pre-industrial levels is crucial to avoid catastrophic impacts. This requires dramatic reductions in greenhouse gas emissions. Many countries have committed to achieving net-zero emissions by 2050 through renewable energy adoption, electric vehicles, and sustainable practices.

Individual actions matter too. Reducing energy consumption, choosing sustainable transportation, eating less meat, and supporting environmentally responsible businesses can collectively make a significant difference.`,
            questions: [
                {
                    question: "What is identified as the primary cause of climate change?",
                    options: ["Natural climate cycles", "The greenhouse effect from human activities", "Volcanic eruptions", "Solar radiation changes"],
                    correct: 1
                },
                {
                    question: "How much have global temperatures risen since pre-industrial times?",
                    options: ["0.5°C", "1.1°C", "1.5°C", "2.0°C"],
                    correct: 1
                },
                {
                    question: "What target have many countries set for achieving net-zero emissions?",
                    options: ["2030", "2040", "2050", "2060"],
                    correct: 2
                },
                {
                    question: "Which individual action is NOT mentioned in the text?",
                    options: ["Reducing energy consumption", "Using sustainable transportation", "Recycling plastic", "Eating less meat"],
                    correct: 2
                }
            ]
        },
        {
            title: "The Power of Habits",
            text: `Habits shape our daily lives more than we realize. Research suggests that approximately 40% of our daily actions are performed out of habit rather than conscious decision. Understanding how habits work can help us build positive routines and break negative ones.

Charles Duhigg, author of 'The Power of Habit', describes the habit loop consisting of three elements: cue, routine, and reward. The cue triggers the behavior, the routine is the behavior itself, and the reward reinforces the pattern. For example, feeling stressed (cue) might lead to snacking (routine), which provides temporary comfort (reward).

Neuroscience reveals that habits form in the basal ganglia, a part of the brain that becomes active when behaviors become automatic. This explains why habits are so difficult to change – they're literally wired into our neural pathways. However, the brain's plasticity means we can rewire these patterns with consistent effort.

Building good habits requires strategy. Start small – attempting too much too soon often leads to failure. Link new habits to existing ones through 'habit stacking'. Make cues obvious and rewards immediate. Most importantly, focus on consistency over perfection; missing one day doesn't mean failure.

Breaking bad habits involves identifying and modifying the routine while keeping the same cue and reward. If you snack when stressed, try replacing snacking with a short walk. The cue (stress) and reward (relief) remain, but the routine changes to something healthier.`,
            questions: [
                {
                    question: "According to research, what percentage of daily actions are habitual?",
                    options: ["25%", "40%", "55%", "60%"],
                    correct: 1
                },
                {
                    question: "What are the three elements of the habit loop?",
                    options: ["Thought, action, result", "Trigger, behavior, outcome", "Cue, routine, reward", "Signal, habit, benefit"],
                    correct: 2
                },
                {
                    question: "Where in the brain do habits primarily form?",
                    options: ["Frontal cortex", "Basal ganglia", "Hippocampus", "Amygdala"],
                    correct: 1
                },
                {
                    question: "What strategy is recommended for building good habits?",
                    options: ["Start with big changes", "Focus on perfection", "Link to existing habits", "Avoid rewards"],
                    correct: 2
                }
            ]
        }
    ],
    advanced: [
        {
            title: "Artificial Intelligence: Opportunities and Ethics",
            text: `Artificial intelligence has evolved from science fiction fantasy to everyday reality. From virtual assistants on our smartphones to algorithms recommending content on streaming platforms, AI permeates modern life. As the technology advances at breakneck speed, society faces both extraordinary opportunities and profound ethical questions.

Machine learning, a subset of AI, enables computers to learn from data without explicit programming. Deep learning networks with multiple layers can recognize patterns, make predictions, and even create original content. Recent breakthroughs in natural language processing have produced AI systems capable of human-like conversation and writing.

The potential benefits are immense. In healthcare, AI assists in diagnosing diseases earlier and more accurately than human doctors alone. In education, adaptive learning platforms personalize instruction to individual student needs. Environmental applications include optimizing energy grids and predicting climate patterns. Economic analyses suggest AI could add trillions to global GDP.

Yet concerns persist. Automation threatens to displace millions of workers, particularly in routine-based occupations. Algorithmic bias can perpetuate discrimination if training data reflects historical prejudices. Privacy advocates worry about surveillance capabilities and data collection. The concentration of AI development in few tech giants raises questions about power and control.

Perhaps most contentious is the prospect of artificial general intelligence – AI matching or exceeding human cognitive abilities across all domains. Experts disagree on timeline and feasibility, but many agree that robust governance frameworks must be established before such capabilities emerge. The challenge lies in harnessing AI's potential while safeguarding human values and dignity.`,
            questions: [
                {
                    question: "What does machine learning enable computers to do?",
                    options: ["Replace human workers completely", "Learn from data without explicit programming", "Create independent consciousness", "Control all digital systems"],
                    correct: 1
                },
                {
                    question: "Which sector is NOT mentioned as benefiting from AI?",
                    options: ["Healthcare", "Education", "Environmental protection", "Legal services"],
                    correct: 3
                },
                {
                    question: "What is identified as a major concern about AI development?",
                    options: ["Too slow progress", "Algorithmic bias and discrimination", "Lack of investment", "Insufficient computing power"],
                    correct: 1
                },
                {
                    question: "What does 'artificial general intelligence' refer to?",
                    options: ["AI specialized in one task", "AI matching human cognitive abilities across all domains", "Basic computer automation", "Simple chatbot technology"],
                    correct: 1
                }
            ]
        },
        {
            title: "The Future of Urban Living",
            text: `By 2050, nearly 70% of the world's population will reside in urban areas, according to United Nations projections. This unprecedented urbanization presents both formidable challenges and innovative opportunities for creating sustainable, livable cities.

Traditional urban models centered around automobile infrastructure are proving unsustainable. Traffic congestion costs economies billions annually while contributing significantly to air pollution and carbon emissions. Sprawling suburbs consume agricultural land and increase dependency on private vehicles.

Smart city initiatives leverage technology to improve urban efficiency. Sensors monitor traffic flow, optimizing signal timing and reducing congestion. Intelligent energy grids balance supply and demand, integrating renewable sources. Digital platforms enable residents to access services, report issues, and participate in governance.

Vertical architecture offers another solution. Skyscrapers incorporating residential, commercial, and recreational spaces reduce commute times and land use. Singapore's 'garden city' approach integrates vegetation into buildings, improving air quality and mental wellbeing. Vertical farms within buildings could enhance food security.

Green transportation revolutionizes urban mobility. Electric buses and trains eliminate local emissions. Bike-sharing programs and pedestrian-friendly infrastructure encourage active transportation. Some cities experiment with autonomous vehicle networks and urban air mobility solutions.

Social considerations remain paramount. Affordable housing shortages threaten to exclude essential workers and young families from city centers. Gentrification displaces long-term residents. Successful urban futures require inclusive planning that prioritizes community needs alongside technological innovation and environmental sustainability.`,
            questions: [
                {
                    question: "What percentage of the world's population is projected to live in cities by 2050?",
                    options: ["50%", "60%", "70%", "80%"],
                    correct: 2
                },
                {
                    question: "What is a major problem with traditional car-centered urban design?",
                    options: ["Too expensive to build", "Traffic congestion and pollution", "Not enough parking", "Slow construction"],
                    correct: 1
                },
                {
                    question: "Which city is mentioned for its 'garden city' approach?",
                    options: ["Tokyo", "Singapore", "Copenhagen", "Amsterdam"],
                    correct: 1
                },
                {
                    question: "What social issue is highlighted as a concern for future cities?",
                    options: ["Lack of technology", "Affordable housing shortages", "Too many parks", "Excessive public transport"],
                    correct: 1
                }
            ]
        }
    ]
};
