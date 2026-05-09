// MeowBTI quiz — 8 questions, swipe-card UI, vanilla JS.
// Redirects to personality-types/<CODE>.html?t=<tally> on finish.
//
// Axes: C/S, H/D, B/N, R/F (R/F internally so the 4th axis "Casual"
// doesn't collide with "Commanding"). The result page reads ?t to
// render the spectrum bars accurately.

const QUESTIONS = [
    {
        q: "It's 7am. You walk into the kitchen. Your cat:",
        a: "MEOWS. AT YOU. LIKE A FOGHORN.",
        b: "Stares from the windowsill. Says nothing.",
        aEmoji: "📣", bEmoji: "👁️",
        axis: "CS", aLetter: "C", bLetter: "S",
    },
    {
        q: "A new cardboard box appears.",
        a: "Boots & Cats Mode: physically inspects, sits, owns.",
        b: "Gives it the long stare. Considers its meaning.",
        aEmoji: "📦", bEmoji: "🤔",
        axis: "HD", aLetter: "H", bLetter: "D",
    },
    {
        q: "Dinner is 4 minutes late. They:",
        a: "Demand it. Loudly. With body slams.",
        b: "Soulful eyes. A single tragic meow.",
        aEmoji: "🚨", bEmoji: "🥺",
        axis: "BN", aLetter: "B", bLetter: "N",
    },
    {
        q: "Where do they sleep?",
        a: "The Spot™. Same one. Always. Don't touch it.",
        b: "Wherever they collapse. New spot daily.",
        aEmoji: "📍", bEmoji: "🌀",
        axis: "RF", aLetter: "R", bLetter: "F",
    },
    {
        q: "A guest arrives. Your cat:",
        a: "Greets them. Inspects shoes. Demands attention.",
        b: "Becomes a rumor. May not exist.",
        aEmoji: "🤝", bEmoji: "👻",
        axis: "CS", aLetter: "C", bLetter: "S",
    },
    {
        q: "You drop a hair tie. They:",
        a: "Pounce. It's prey. Game on.",
        b: "Watch it suspiciously. What does it want?",
        aEmoji: "🎯", bEmoji: "🧐",
        axis: "HD", aLetter: "H", bLetter: "D",
    },
    {
        q: "You're sad on the couch. They:",
        a: "Stand on your face. Problem solved.",
        b: "Curl up nearby. Quiet support.",
        aEmoji: "😼", bEmoji: "💞",
        axis: "BN", aLetter: "B", bLetter: "N",
    },
    {
        q: "You move the couch. They:",
        a: "Investigate every angle. File a formal complaint.",
        b: "Do not care. New couch. Same nap.",
        aEmoji: "📋", bEmoji: "🤷",
        axis: "RF", aLetter: "R", bLetter: "F",
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
    progressEl.setAttribute('aria-valuenow', String(idx + 1));
    countEl.textContent = `${Math.min(idx + 1, TOTAL)}/${TOTAL}`;
}

function renderCard() {
    if (idx >= TOTAL) return;
    const q = QUESTIONS[idx];

    const card = document.createElement('article');
    card.className = 'qcard-big';
    card.dataset.qIdx = String(idx);
    card.innerHTML = `
        <div class="qcard-tag">Q${idx + 1}</div>
        <h2 class="qcard-q">${escapeHtml(q.q)}</h2>
        <div class="opts">
            <button class="opt opt-a" type="button" data-pick="A">
                <span class="opt-emoji" aria-hidden="true">${q.aEmoji}</span>
                <span class="opt-text">${escapeHtml(q.a)}</span>
            </button>
            <div class="opt-or">or</div>
            <button class="opt opt-b" type="button" data-pick="B">
                <span class="opt-emoji" aria-hidden="true">${q.bEmoji}</span>
                <span class="opt-text">${escapeHtml(q.b)}</span>
            </button>
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
    if (card) card.classList.add(letter === 'A' ? 'exit-right' : 'exit-left');

    setTimeout(() => {
        answers.push(letter);
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
        if (!ans) return;
        const letter = ans === 'A' ? q.aLetter : q.bLetter;
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
