const readingData = [
    // B1 Level - Intermediate
    {
        id: 1,
        title: "The Impact of Technology on Education",
        difficulty: "B1",
        text: `Technology has revolutionized the way we approach education in the 21st century. From online learning platforms to interactive whiteboards, digital tools have transformed traditional classrooms into dynamic learning environments.

One of the most significant advantages of educational technology is accessibility. Students can now access quality education from anywhere in the world through Massive Open Online Courses (MOOCs) and virtual classrooms. This has democratized education, making it available to people who previously lacked access due to geographical or financial constraints.

However, the integration of technology in education also presents challenges. The digital divide remains a significant issue, with students from lower-income families often lacking access to necessary devices and internet connectivity. Additionally, there are concerns about screen time and its impact on students' physical and mental health.

Despite these challenges, the benefits of educational technology cannot be ignored. Personalized learning algorithms can adapt to individual student needs, providing customized content and pacing. Virtual and augmented reality technologies offer immersive learning experiences that were previously impossible.

The future of education lies in finding the right balance between traditional teaching methods and technological innovation. Teachers must be trained to effectively integrate technology into their pedagogy, ensuring that it enhances rather than replaces human interaction in the learning process.`,
        questions: [
            {
                question: "What is one major advantage of educational technology mentioned in the text?",
                options: ["It reduces the need for teachers", "It makes education more accessible", "It eliminates homework", "It decreases screen time"],
                correct: 1
            },
            {
                question: "What challenge does the 'digital divide' refer to?",
                options: ["Teachers not knowing how to use technology", "Students spending too much time online", "Unequal access to technology based on income", "Too many different types of devices"],
                correct: 2
            },
            {
                question: "According to the text, what should be the goal for the future of education?",
                options: ["Completely replace traditional methods", "Use only online learning", "Balance traditional methods with technology", "Eliminate all technology from classrooms"],
                correct: 2
            }
        ]
    },
    {
        id: 2,
        title: "The Evolution of Remote Work",
        difficulty: "B1",
        text: `The concept of remote work has evolved dramatically over the past decade. What was once considered a rare perk offered by progressive companies has become a mainstream working arrangement accelerated by global events.

Remote work offers numerous benefits for both employers and employees. Companies can reduce overhead costs associated with office space and access a global talent pool不受 geographic limitations. Employees enjoy greater flexibility, reduced commuting time, and improved work-life balance.

However, remote work also presents challenges. Maintaining company culture and team cohesion becomes more difficult when employees are dispersed. Communication can suffer without face-to-face interaction, and some workers struggle with isolation and the blurring of boundaries between work and personal life.

Technology plays a crucial role in enabling remote work. Video conferencing tools, project management software, and cloud-based collaboration platforms have made it possible for teams to work together effectively from different locations. The COVID-19 pandemic accelerated the adoption of these technologies and proved that remote work could be viable on a large scale.

Looking forward, many experts predict a hybrid model will become the norm, combining remote and in-office work. This approach aims to capture the benefits of both arrangements while mitigating their respective drawbacks.`,
        questions: [
            {
                question: "What benefit of remote work is mentioned for employers?",
                options: ["Higher employee salaries", "Access to global talent", "More office space needed", "Less technology required"],
                correct: 1
            },
            {
                question: "What is one challenge of remote work mentioned in the text?",
                options: ["Too much face-to-face interaction", "Difficulty maintaining company culture", "Employees having too much free time", "Reduced use of technology"],
                correct: 1
            },
            {
                question: "What working model do experts predict will become common?",
                options: ["Fully remote only", "Office-only work", "Hybrid model", "No fixed working arrangement"],
                correct: 2
            }
        ]
    },
    {
        id: 3,
        title: "Sustainable Urban Development",
        difficulty: "B1",
        text: `As the world's population increasingly concentrates in urban areas, sustainable city development has become a critical priority. By 2050, nearly 70% of the global population is expected to live in cities, putting immense pressure on infrastructure, resources, and the environment.

Green building practices are at the forefront of sustainable urban development. Energy-efficient designs, renewable energy integration, and sustainable materials help reduce the environmental footprint of buildings, which account for a significant portion of global carbon emissions.

Public transportation systems play a vital role in creating sustainable cities. Well-designed transit networks reduce reliance on private vehicles, decrease traffic congestion, and lower air pollution. Many cities are investing in electric buses, light rail systems, and bike-sharing programs to promote eco-friendly mobility.

Urban green spaces provide multiple benefits for city dwellers. Parks and gardens improve air quality, reduce urban heat island effects, and offer recreational opportunities that enhance residents' quality of life. They also support biodiversity within urban environments.

Waste management and circular economy principles are essential components of sustainable cities. Recycling programs, composting initiatives, and waste-to-energy facilities help minimize landfill use and recover valuable resources from waste streams.`,
        questions: [
            {
                question: "What percentage of the global population is expected to live in cities by 2050?",
                options: ["50%", "60%", "70%", "80%"],
                correct: 2
            },
            {
                question: "What is one benefit of urban green spaces mentioned?",
                options: ["They increase property taxes", "They improve air quality", "They reduce public transportation needs", "They eliminate waste problems"],
                correct: 1
            },
            {
                question: "How do public transportation systems contribute to sustainability?",
                options: ["By increasing private vehicle use", "By reducing traffic and pollution", "By eliminating the need for roads", "By increasing fuel consumption"],
                correct: 1
            }
        ]
    },
    
    // B2 Level - Upper-Intermediate/Advanced
    {
        id: 4,
        title: "Climate Change and Global Responses",
        difficulty: "B2",
        text: `Climate change represents one of the most pressing challenges of our time, requiring unprecedented global cooperation and immediate action. The scientific consensus is clear: human activities, particularly the burning of fossil fuels and deforestation, are the primary drivers of rising global temperatures.

The consequences of climate change are already visible worldwide. Extreme weather events, including hurricanes, droughts, and floods, have become more frequent and severe. Rising sea levels threaten coastal communities, while changing precipitation patterns affect agricultural productivity and water security.

International efforts to combat climate change have yielded mixed results. The Paris Agreement of 2015 marked a significant milestone, with nearly 200 countries committing to limit global warming to well below 2 degrees Celsius above pre-industrial levels. However, current national commitments fall short of achieving this target, and some nations have struggled to implement meaningful policies.

Technological innovation offers hope for addressing climate change. Renewable energy sources, such as solar and wind power, have become increasingly cost-competitive with fossil fuels. Electric vehicles are gaining market share, and carbon capture technologies are being developed to remove greenhouse gases from the atmosphere.

Individual actions also play a crucial role. Consumers can reduce their carbon footprint through choices in transportation, diet, and energy consumption. However, systemic change requires government policies, corporate responsibility, and international cooperation to achieve the scale of transformation needed.`,
        questions: [
            {
                question: "What does the text identify as the primary cause of climate change?",
                options: ["Natural climate cycles", "Human activities like burning fossil fuels", "Volcanic eruptions", "Solar radiation changes"],
                correct: 1
            },
            {
                question: "What was the main goal of the Paris Agreement?",
                options: ["Eliminate all fossil fuels by 2020", "Limit global warming to below 2°C", "Stop all deforestation immediately", "Force all countries to use renewable energy"],
                correct: 1
            },
            {
                question: "According to the text, what is needed for effective climate action?",
                options: ["Only individual actions", "Only government policies", "Only technological solutions", "Combination of individual, governmental, and international efforts"],
                correct: 3
            }
        ]
    },
    {
        id: 5,
        title: "Artificial Intelligence in Healthcare",
        difficulty: "B2",
        text: `Artificial intelligence is transforming healthcare delivery in ways that were unimaginable just a few decades ago. From diagnostic imaging to personalized treatment plans, AI applications are enhancing medical practice and improving patient outcomes.

Machine learning algorithms can now analyze medical images with accuracy comparable to, and sometimes exceeding, that of human radiologists. These systems can detect subtle patterns that might escape human observation, leading to earlier diagnosis of conditions such as cancer, cardiovascular disease, and neurological disorders.

AI-powered drug discovery is another promising application. Traditional drug development is a lengthy and expensive process, often taking over a decade and billions of dollars. AI can accelerate this process by predicting molecular behavior, identifying potential drug candidates, and optimizing clinical trial design.

Personalized medicine stands to benefit significantly from AI. By analyzing vast amounts of patient data, including genetic information, lifestyle factors, and medical history, AI systems can help doctors develop tailored treatment plans that maximize effectiveness while minimizing side effects.

Despite these advances, challenges remain. Concerns about data privacy, algorithmic bias, and the need for regulatory frameworks must be addressed. Additionally, AI should complement rather than replace human judgment in medical decision-making, preserving the essential human element in healthcare.`,
        questions: [
            {
                question: "How does AI assist in medical imaging according to the text?",
                options: ["By replacing all radiologists", "By detecting patterns humans might miss", "By eliminating the need for imaging equipment", "By reducing the cost of imaging machines"],
                correct: 1
            },
            {
                question: "What advantage does AI offer in drug discovery?",
                options: ["It eliminates the need for clinical trials", "It can accelerate the development process", "It guarantees successful drug development", "It removes all risks from new drugs"],
                correct: 1
            },
            {
                question: "What concern about AI in healthcare is mentioned?",
                options: ["It's too expensive to implement", "Algorithmic bias and data privacy", "Doctors refuse to use it", "Patients don't trust it"],
                correct: 1
            }
        ]
    },
    {
        id: 6,
        title: "The Future of Work and Automation",
        difficulty: "B2",
        text: `The rapid advancement of automation and artificial intelligence is reshaping the global workforce at an unprecedented pace. While these technologies promise increased efficiency and productivity, they also raise important questions about the future of employment and the skills workers will need.

Automation has already transformed many industries, from manufacturing to customer service. Robots and AI systems can now perform tasks that were once exclusively done by humans, often with greater speed and accuracy. This shift has led to concerns about job displacement, particularly for roles involving routine, repetitive tasks.

However, history suggests that technological revolutions create new jobs even as they eliminate others. The key challenge lies in ensuring that workers can transition to these new roles through appropriate training and education. Skills such as critical thinking, creativity, emotional intelligence, and complex problem-solving are becoming increasingly valuable as they are harder to automate.

Governments and businesses must collaborate to address the social implications of automation. Policies such as universal basic income, reskilling programs, and shorter work weeks are being discussed as potential solutions. The goal is to harness the benefits of automation while protecting workers and maintaining social stability.

The future of work will likely involve greater collaboration between humans and machines rather than complete replacement. Workers who can effectively leverage technology while bringing uniquely human skills to their roles will be best positioned for success in this evolving landscape.`,
        questions: [
            {
                question: "What is the main concern about automation mentioned in the text?",
                options: ["It's too expensive", "Job displacement for routine tasks", "Machines are not accurate enough", "It slows down production"],
                correct: 1
            },
            {
                question: "Which skills are becoming more valuable according to the text?",
                options: ["Routine manual skills", "Data entry skills", "Critical thinking and creativity", "Basic computer skills"],
                correct: 2
            },
            {
                question: "What does the text suggest about the future relationship between humans and machines?",
                options: ["Machines will completely replace humans", "Humans will reject all technology", "Collaboration between humans and machines", "No significant changes expected"],
                correct: 2
            }
        ]
    }
];
