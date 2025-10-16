document.addEventListener('DOMContentLoaded', () => {
    // --- PERSONALITY DATA ---
    // All the descriptions for the 16 cat types live here.
    const personalityData = {
        'CHBR': {
            name: 'The Grand General',
            quote: 'Everything in this house is a resource, and I am the manager. Your compliance is expected.',
            description: 'This is the rare, powerful cat who operates with the cold efficiency of a corporate executive. The Grand General is **Commanding** because they seek external engagement, **Hunter** because they rely on observable facts, **Bossy** because they prioritize logic over emotion, and **Regal** because they demand structure and closure. They aren\'t trying to be mean; they\'re just running a tight ship.',
            traits: [
                { title: 'How They Show Love ❤️', text: 'Love is shown through **compliance and proximity**. They will stare intensely at you from a high perch or walk across your keyboard mid-use, signifying that you are the central, albeit distracting, object in their structured universe.' },
                { title: 'How They Ask for Attention 👀', text: 'With **loud, sustained, direct meows** and demanding eye contact. If that fails, they will use strategic territorial obstruction (blocking doorways or jumping onto a forbidden counter). They don\'t ask; they demand compliance with their schedule.' },
                { title: 'Territory (The Fiefdom) 🏰', text: 'They maintain a highly **disciplined perimeter**. Non-human invaders are observed with chilling stillness until they retreat. New humans are immediately sized up, and the General will block entryways until they\'ve been cleared for passage.' },
                { title: 'Energy Throughout the Day ⚡', text: 'High and consistent. They see idleness as non-productive. Naps are strategic, not leisurely.' },
                { title: 'Play Style 🧶', text: 'Play is **training**. The goal is the efficient "kill" of the toy. They prefer toys that provide a clear victory, like a feather wand that can be definitively captured and "dispatched."' },
                { title: 'Reaction to Change 📦', text: 'Hostile. A new piece of furniture is an unauthorized invasion of their territory. It will be investigated, circled, and treated with suspicion for several business days.' },
                { title: 'Relationship with Other Cats  взаимодействовать', text: 'Hierarchical. Other cats are subordinates or rivals. The General establishes dominance early and enforces it with unblinking stares and the occasional tactical bap.' }
            ]
        },
        // Add data for the other 15 types here in the same format...
        'SHBR': {
            name: 'The Silent Strategist',
            quote: 'I have observed all variables. The optimal course of action is clear.',
            description: 'The Silent Strategist is the master observer, a quiet force who understands the household\'s inner workings better than anyone. They are **Solitary**, **Hunter**, **Bossy**, and **Regal**, combining a need for privacy with a brutally logical and structured approach to life.',
            traits: [
                 { title: 'How They Show Love ❤️', text: 'Love is demonstrated through **silent companionship and problem-solving**. They will "fix" your loneliness by simply materializing in the same room as you, sitting quietly from a distance. They may also bring you "gifts" they have logically determined you cannot acquire yourself, like a strategically killed bug.'},
                 { title: 'How They Ask for Attention 👀', text: 'They don\'t. They position themselves in a high-traffic area and wait for you to notice their needs. Their stare is not a request; it is a notification that a system requirement (e.g., food) has not been met.'},
                 { title: 'Territory (The Fiefdom) 🏰', text: 'Their territory is a series of **optimized, efficient zones**: a sleeping zone, an observation zone, a sunbeam zone. Each has a purpose, and they dislike seeing them used improperly by others.'},
                 { title: 'Energy Throughout the Day ⚡', text: 'Energy is conserved and expended with purpose. They move with deliberation, saving bursts of energy for critical tasks like chasing a red dot or investigating a strange noise.'},
                 { title: 'Play Style 🧶', text: 'Play is a **tactical simulation**. They will watch a toy for a long time, calculating the perfect moment to strike for maximum efficiency. They prefer puzzle toys or laser pointers that challenge their intellect.'},
                 { title: 'Reaction to Change 📦', text: 'Change is a new variable that must be analyzed. They will observe from a safe distance, process the new information, and then integrate it into their internal map of the world. They adapt, but only after a thorough risk assessment.'},
                 { title: 'Relationship with Other Cats  взаимодействовать', text: 'Other cats are **unpredictable variables**. The Strategist prefers to observe them from afar, learning their patterns to avoid unnecessary conflict. They are not aggressive, merely aloof and calculating.'}
            ]
        },
        // Add placeholders for the rest to avoid errors
        'CHNR': { name: 'The Affectionate Warden', quote: 'Your emotional state is my responsibility. Please hold still for your mandatory cuddle.', description: '...', traits: [] },
        'SHNR': { name: 'The Gentle Defender', quote: 'I will protect this family with my quiet, unwavering love... and also my claws, if necessary.', description: '...', traits: [] },
        'CDBR': { name: 'The Visionary Supervisor', quote: 'I see the potential in that empty box. It could be a fort, a boat, or my next nap spot.', description: '...', traits: [] },
        'SDBR': { name: 'The Observant Theorist', quote: 'Why does the red dot move? What is its purpose? I must ponder this.', description: '...', traits: [] },
        'CDNR': { name: 'The Charismatic Counselor', quote: 'You seem sad. Have you considered purring? It helps me.', description: '...', traits: [] },
        'SDNR': { name: 'The Empathetic Muse', quote: 'I feel your feelings. Let us nap together until they are better.', description: '...', traits: [] },
        'CHBC': { name: 'The Street CEO', quote: 'The world is a hustle. Now, about that can of tuna...', description: '...', traits: [] },
        'SHBC': { name: 'The Master Tinkerer', quote: 'I can get that cabinet open. I just need time, and for you to stop watching me.', description: '...', traits: [] },
        'CHNC': { name: "The Party Starter", quote: "Are you not entertained? Let's knock something over!", description: "...", traits: [] },
        'SHNC': { name: 'The Emotional Artist', quote: 'My medium is interpretive dance at 3 AM. And also hairballs on the rug.', description: '...', traits: [] },
        'CDBC': { name: 'The Wild Debater', quote: 'Actually, the rule should be that I CAN jump on the counter. Let me present my argument.', description: '...', traits: [] },
        'SDBC': { name: 'The Free Spirit', quote: 'A rule is just a suggestion I haven\'t ignored yet.', description: '...', traits: [] },
        'CDNC': { name: 'The Joyful Performer', quote: 'Watch this! Now watch this again! Are you watching?', description: '...', traits: [] },
        'SDNC': { name: 'The Peaceful Dreamer', quote: 'The sun is warm, the blanket is soft... what more is there?', description: '...', traits: [] },
    };

    // --- LOGIC TO DISPLAY THE DATA ---
    const contentContainer = document.getElementById('personality-content');
    if (contentContainer) {
        // Get the current file name (e.g., "CHBR.html") from the URL
        const path = window.location.pathname;
        const pageName = path.split("/").pop();
        const typeCode = pageName.replace('.html', ''); // "CHBR"

        const data = personalityData[typeCode];

        if (data) {
            // Update the page title
            document.title = `${data.name} (${typeCode}) - MeowBTI`;

            // Populate the elements
            document.getElementById('type-code-title').textContent = `${typeCode}: ${data.name}`;
            document.getElementById('type-quote').textContent = `"${data.quote}"`;
            document.getElementById('type-description').innerHTML = data.description; // Use innerHTML to parse **bold** tags

            const traitsContainer = document.getElementById('type-traits');
            traitsContainer.innerHTML = ''; // Clear loading state

            data.traits.forEach(trait => {
                const traitEl = document.createElement('div');
                traitEl.className = 'trait-item';
                // Replace **word** with <strong>word</strong> for bolding
                const formattedText = trait.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                traitEl.innerHTML = `
                    <h3>${trait.title}</h3>
                    <p>${formattedText}</p>
                `;
                traitsContainer.appendChild(traitEl);
            });
        } else {
            document.getElementById('type-code-title').textContent = 'Personality Type Not Found';
            document.getElementById('type-description').textContent = 'Could not find the data for this personality type. Please check the code and try again.';
        }
    }
});
