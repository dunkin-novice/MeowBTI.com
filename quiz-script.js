// MeowBTI quiz — 20 questions, swipe-card UI, vanilla JS.
// Redirects to personality-types/<CODE>.html?t=<tally> on finish.
//
// Axes: C/S, H/D, B/N, R/F (R/F internally so the 4th axis "Casual"
// doesn't collide with "Commanding"). The result page reads ?t to
// render the spectrum bars accurately.

const QUESTIONS = [
    {
        q: "It's 7am. You walk into the kitchen. Your cat:",
        axis: "CS",
        options: [
            { emoji: "📣", text: "MEOWS. AT YOU. LIKE A FOGHORN.", letter: "C" },
            { emoji: "👁️", text: "Stares from the windowsill. Says nothing.", letter: "S" },
            { emoji: "🐾", text: "Trots over and escorts you to the bowl.", letter: "C" },
            { emoji: "🫥", text: "Appears only after breakfast is definitely real.", letter: "S" },
        ],
    },
    {
        q: "A new cardboard box appears.",
        axis: "HD",
        options: [
            { emoji: "📦", text: "Boots & Cats Mode: inspects, sits, owns.", letter: "H" },
            { emoji: "🤔", text: "Gives it the long stare. Considers its meaning.", letter: "D" },
            { emoji: "🧪", text: "Tests every flap with scientific violence.", letter: "H" },
            { emoji: "🌌", text: "Studies it like a portal to another realm.", letter: "D" },
        ],
    },
    {
        q: "Dinner is 4 minutes late. They:",
        axis: "BN",
        options: [
            { emoji: "🚨", text: "Demand it. Loudly. With body slams.", letter: "B" },
            { emoji: "🥺", text: "Soulful eyes. A single tragic meow.", letter: "N" },
            { emoji: "📢", text: "Makes a formal complaint to management.", letter: "B" },
            { emoji: "💞", text: "Melts beside the bowl and hopes you notice.", letter: "N" },
        ],
    },
    {
        q: "Where do they sleep?",
        axis: "RF",
        options: [
            { emoji: "📍", text: "The Spot. Same one. Always. Do not touch it.", letter: "R" },
            { emoji: "🌀", text: "Wherever they collapse. New spot daily.", letter: "F" },
            { emoji: "🛏️", text: "A throne-like arrangement they clearly selected.", letter: "R" },
            { emoji: "📦", text: "Laundry basket today. Sink tomorrow. Who knows.", letter: "F" },
        ],
    },
    {
        q: "A guest arrives. Your cat:",
        axis: "CS",
        options: [
            { emoji: "🤝", text: "Greets them. Inspects shoes. Demands attention.", letter: "C" },
            { emoji: "👻", text: "Becomes a rumor. May not exist.", letter: "S" },
            { emoji: "🗣️", text: "Announces the visit to the entire household.", letter: "C" },
            { emoji: "🕳️", text: "Finds a hiding spot you did not know existed.", letter: "S" },
        ],
    },
    {
        q: "You drop a hair tie. They:",
        axis: "HD",
        options: [
            { emoji: "🎯", text: "Pounce. It is prey. Game on.", letter: "H" },
            { emoji: "🧐", text: "Watch it suspiciously. What does it want?", letter: "D" },
            { emoji: "⚡", text: "Bats it under the fridge within 3 seconds.", letter: "H" },
            { emoji: "🧘", text: "Waits, observes, then maybe acts later.", letter: "D" },
        ],
    },
    {
        q: "You're sad on the couch. They:",
        axis: "BN",
        options: [
            { emoji: "😼", text: "Stand on your face. Problem solved.", letter: "B" },
            { emoji: "💞", text: "Curl up nearby. Quiet support.", letter: "N" },
            { emoji: "🧱", text: "Blocks your phone until you pet them.", letter: "B" },
            { emoji: "🫶", text: "Slow-blinks like a tiny therapist.", letter: "N" },
        ],
    },
    {
        q: "You move the couch. They:",
        axis: "RF",
        options: [
            { emoji: "📋", text: "Investigate every angle. File a formal complaint.", letter: "R" },
            { emoji: "🤷", text: "Do not care. New couch. Same nap.", letter: "F" },
            { emoji: "🚧", text: "Inspects the perimeter until order is restored.", letter: "R" },
            { emoji: "🪩", text: "Treats the chaos as fresh enrichment.", letter: "F" },
        ],
    },
    {
        q: "When you call their name, they:",
        axis: "CS",
        options: [
            { emoji: "🏃", text: "Arrive like they were already in the meeting.", letter: "C" },
            { emoji: "🙄", text: "Flick one ear and continue their private life.", letter: "S" },
            { emoji: "📣", text: "Answer back with a full sentence.", letter: "C" },
            { emoji: "🫥", text: "Wait until you stop looking, then appear.", letter: "S" },
        ],
    },
    {
        q: "A strange noise happens outside.",
        axis: "HD",
        options: [
            { emoji: "🪟", text: "Runs to the window for live reporting.", letter: "H" },
            { emoji: "💭", text: "Freezes and calculates the emotional implications.", letter: "D" },
            { emoji: "🕵️", text: "Tracks the source with detective energy.", letter: "H" },
            { emoji: "🌫️", text: "Listens from a safe distance and imagines everything.", letter: "D" },
        ],
    },
    {
        q: "Another cat touches their toy.",
        axis: "BN",
        options: [
            { emoji: "⚔️", text: "Absolutely not. Boundaries are enforced.", letter: "B" },
            { emoji: "🥲", text: "Looks wounded but lets it happen.", letter: "N" },
            { emoji: "👑", text: "Takes it back with royal confidence.", letter: "B" },
            { emoji: "🧸", text: "Finds another toy and avoids drama.", letter: "N" },
        ],
    },
    {
        q: "Their daily schedule is best described as:",
        axis: "RF",
        options: [
            { emoji: "🕰️", text: "Meal, patrol, nap, patrol. Very official.", letter: "R" },
            { emoji: "🎲", text: "Improvised jazz, but with fur.", letter: "F" },
            { emoji: "📆", text: "Predictable enough to set your watch by.", letter: "R" },
            { emoji: "🌊", text: "A loose vibe that changes with the sunbeam.", letter: "F" },
        ],
    },
    {
        q: "They want attention while you're working.",
        axis: "CS",
        options: [
            { emoji: "⌨️", text: "Walks across the keyboard with confidence.", letter: "C" },
            { emoji: "🪑", text: "Sits nearby and silently increases pressure.", letter: "S" },
            { emoji: "📢", text: "Yells until the calendar is cleared.", letter: "C" },
            { emoji: "👀", text: "Watches from the doorway like a small manager.", letter: "S" },
        ],
    },
    {
        q: "A puzzle feeder appears.",
        axis: "HD",
        options: [
            { emoji: "🔧", text: "Attacks the mechanism until treats surrender.", letter: "H" },
            { emoji: "🧠", text: "Studies the system before touching anything.", letter: "D" },
            { emoji: "🐾", text: "Paws, flips, solves, leaves.", letter: "H" },
            { emoji: "📚", text: "Looks like they are writing a thesis on it.", letter: "D" },
        ],
    },
    {
        q: "When they love you, it looks like:",
        axis: "BN",
        options: [
            { emoji: "🧍", text: "Full-body supervision. Everywhere. Always.", letter: "B" },
            { emoji: "🫧", text: "Soft presence, gentle purrs, no demands.", letter: "N" },
            { emoji: "🐟", text: "Bringing you a toy and expecting applause.", letter: "B" },
            { emoji: "🌙", text: "Choosing to nap near you when they could leave.", letter: "N" },
        ],
    },
    {
        q: "A door is closed.",
        axis: "RF",
        options: [
            { emoji: "🚪", text: "Closed doors are policy violations.", letter: "R" },
            { emoji: "🍃", text: "Fine. Another door, another destiny.", letter: "F" },
            { emoji: "📑", text: "They inspect why this door broke the routine.", letter: "R" },
            { emoji: "🛋️", text: "They nap somewhere else and forget the issue.", letter: "F" },
        ],
    },
    {
        q: "At the vet, your cat is most likely to:",
        axis: "CS",
        options: [
            { emoji: "📢", text: "Announce their legal objections to everyone.", letter: "C" },
            { emoji: "🧊", text: "Go silent and become very, very small.", letter: "S" },
            { emoji: "🧑‍⚖️", text: "Make intense eye contact with the staff.", letter: "C" },
            { emoji: "🫥", text: "Hide in the carrier like a folded secret.", letter: "S" },
        ],
    },
    {
        q: "A bug enters the room.",
        axis: "HD",
        options: [
            { emoji: "🎯", text: "Immediate hunt mode. No hesitation.", letter: "H" },
            { emoji: "🔮", text: "Watches its path like it has prophecy value.", letter: "D" },
            { emoji: "💥", text: "Launches into action and misses elegantly.", letter: "H" },
            { emoji: "🪐", text: "Keeps distance and contemplates the visitor.", letter: "D" },
        ],
    },
    {
        q: "If they could run the house, they would:",
        axis: "BN",
        options: [
            { emoji: "📜", text: "Issue rules and enforce consequences.", letter: "B" },
            { emoji: "🕯️", text: "Create a peaceful emotional support commune.", letter: "N" },
            { emoji: "💼", text: "Negotiate treat distribution aggressively.", letter: "B" },
            { emoji: "🧺", text: "Make every room softer and calmer.", letter: "N" },
        ],
    },
    {
        q: "Their relationship with routine is:",
        axis: "RF",
        options: [
            { emoji: "📍", text: "Sacred. The timeline must be respected.", letter: "R" },
            { emoji: "🌪️", text: "Optional. The vibes decide.", letter: "F" },
            { emoji: "🏛️", text: "They prefer rules, rituals, and known spots.", letter: "R" },
            { emoji: "🎈", text: "They follow curiosity, not calendars.", letter: "F" },
        ],
    },
];

const TOTAL = QUESTIONS.length;
let idx = 0;
const answers = [];
let locked = false;

const stackEl = document.getElementById('card-stack');
const countEl = document.getElementById('quiz-count');
const progressEl = document.getElementById('quiz-progress');

function renderProgress() {
    progressEl.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
        const pip = document.createElement('span');
        pip.className = 'pip' + (i < answers.length ? ' done' : '') + (i === idx ? ' active' : '');
        progressEl.appendChild(pip);
    }
    progressEl.setAttribute('aria-valuemax', String(TOTAL));
    progressEl.setAttribute('aria-valuenow', String(idx + 1));
    countEl.textContent = `${Math.min(idx + 1, TOTAL)}/${TOTAL}`;
}

function renderCard() {
    if (idx >= TOTAL) return;
    const q = QUESTIONS[idx];
    const optionsHtml = q.options.map((opt, i) => `
            <button class="opt opt-${i + 1}" type="button" data-pick="${i}">
                <span class="opt-emoji" aria-hidden="true">${opt.emoji}</span>
                <span class="opt-text">${escapeHtml(opt.text)}</span>
            </button>
    `).join('');

    const card = document.createElement('article');
    card.className = 'qcard-big';
    card.dataset.qIdx = String(idx);
    card.innerHTML = `
        <div class="qcard-tag">Q${idx + 1}</div>
        <h2 class="qcard-q">${escapeHtml(q.q)}</h2>
        <div class="opts">
            ${optionsHtml}
        </div>
        <div class="qcard-foot">tap whichever feels more <em>them</em></div>
    `;
    stackEl.innerHTML = '';
    stackEl.appendChild(card);
    card.querySelectorAll('.opt').forEach(btn => {
        btn.addEventListener('click', () => pick(btn.dataset.pick));
    });
}

function pick(letter) {
    if (locked) return;
    locked = true;
    const card = stackEl.querySelector('.qcard-big');
    const picked = QUESTIONS[idx].options[Number(letter)];
    if (card) card.classList.add(picked && picked.letter === QUESTIONS[idx].axis[0] ? 'exit-right' : 'exit-left');

    setTimeout(() => {
        answers.push(Number(letter));
        idx++;
        if (idx >= TOTAL) {
            finish();
        } else {
            renderProgress();
            renderCard();
            locked = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 240);
}

function classify(answers) {
    const tally = { C:0, S:0, H:0, D:0, B:0, N:0, R:0, F:0 };
    QUESTIONS.forEach((q, i) => {
        const ans = answers[i];
        if (!Number.isInteger(ans)) return;
        const letter = q.options[ans]?.letter;
        if (!letter) return;
        tally[letter] = (tally[letter] || 0) + 1;
    });
    const code =
        (tally.C >= tally.S ? 'C' : 'S') +
        (tally.H >= tally.D ? 'H' : 'D') +
        (tally.B >= tally.N ? 'B' : 'N') +
        (tally.R >= tally.F ? 'R' : 'C');  // 4th axis: R or "C" (Casual) for the URL
    return { code, tally };
}

function finish() {
    const { code, tally } = classify(answers);
    // Encode tally as compact string e.g., C5S3H4D4B5N3R6F2
    const t = ['C','S','H','D','B','N','R','F'].map(k => `${k}${tally[k]}`).join('');
    window.location.href = `personality-types/${code}.html?t=${t}`;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

if (stackEl) {
    renderProgress();
    renderCard();
}
