(function() {
    const TYPES = {
        words: {
            name: "Words of Affirmation",
            page: "./",
            overview: "You may feel especially cared for when appreciation, encouragement, and emotional clarity are spoken or written directly.",
            strengths: ["Names appreciation clearly", "Notices tone and emotional meaning", "Can make others feel seen through language"],
            blindSpots: ["May miss care that is shown quietly", "Can feel hurt by careless wording", "May need reassurance to be stated more often than others expect"],
            preferences: "Warm messages, specific compliments, thoughtful check-ins, and sincere repair words tend to matter.",
            tips: "Ask for specific words instead of expecting someone to guess. Offer examples of what lands well.",
            growth: "Practice receiving care in nonverbal forms too, while still honoring that words help your heart register connection."
        },
        time: {
            name: "Quality Time",
            page: "./",
            overview: "You may feel most connected when someone gives focused presence, shared attention, and unhurried time.",
            strengths: ["Values presence over performance", "Creates room for real conversation", "Often notices when attention is divided"],
            blindSpots: ["May experience busyness as disinterest", "Can feel overlooked when plans change", "May understate how much focused time matters"],
            preferences: "Shared rituals, device-light conversations, walks, meals, and dedicated time can feel especially meaningful.",
            tips: "Make requests concrete: a weekly walk, dinner without phones, or ten focused minutes after work.",
            growth: "Let small moments count. Quality time does not always require a perfect schedule or long uninterrupted day."
        },
        service: {
            name: "Acts of Service",
            page: "./",
            overview: "You may feel loved when care becomes practical help, reliability, and thoughtful action that reduces pressure.",
            strengths: ["Notices real-world needs", "Often shows care through follow-through", "Values reliability and practical support"],
            blindSpots: ["May feel unsupported when help is not offered automatically", "Can over-function instead of asking", "May overlook affectionate words when actions are missing"],
            preferences: "Help with tasks, shared responsibility, thoughtful errands, and practical follow-through tend to feel caring.",
            tips: "Name the kind of help that would matter most. Clear requests make support easier to give.",
            growth: "Remember that rest and receiving are part of care too. You do not need to earn support by doing everything first."
        },
        touch: {
            name: "Physical Touch",
            page: "./",
            overview: "You may feel connected through safe, welcome physical closeness such as hugs, hand-holding, or relaxed proximity.",
            strengths: ["Notices physical comfort and warmth", "Can communicate care through gentle presence", "Often values embodied reassurance"],
            blindSpots: ["May feel rejected when touch is unavailable", "Can forget that touch preferences differ", "May need to clarify consent and context more directly"],
            preferences: "Consensual affection, closeness, comforting touch, and relaxed physical presence may help care feel real.",
            tips: "Talk openly about what kinds of touch feel welcome, when, and in what contexts. Consent and comfort matter every time.",
            growth: "Build more than one channel for reassurance so connection is not limited to physical closeness alone."
        },
        gifts: {
            name: "Receiving Gifts",
            page: "./",
            overview: "You may feel cared for when someone chooses a thoughtful object, note, or gesture that says they remembered you.",
            strengths: ["Notices symbolic meaning", "Often remembers details about others", "Can make care feel tangible and personal"],
            blindSpots: ["May feel forgotten when milestones pass unmarked", "Can be misunderstood as materialistic", "May hesitate to explain the meaning behind gifts"],
            preferences: "Small thoughtful objects, handwritten notes, meaningful souvenirs, and remembered favorites can feel deeply personal.",
            tips: "Explain that thoughtfulness matters more than price. Share the kinds of gestures that feel meaningful.",
            growth: "Let care be visible in everyday attention too. The object matters because of the remembering behind it."
        }
    };

    const QUESTIONS = [
        { text: "A specific compliment can stay with me for a long time.", weights: { words: 2 } },
        { text: "I feel closest when someone gives me their full attention without rushing.", weights: { time: 2 } },
        { text: "Practical help feels like a strong form of care to me.", weights: { service: 2 } },
        { text: "Safe, welcome touch helps me feel reassured.", weights: { touch: 2 } },
        { text: "A thoughtful gift or note can make me feel deeply remembered.", weights: { gifts: 2 } },
        { text: "Hearing 'I appreciate you' matters more to me than people may realize.", weights: { words: 2, gifts: -1 } },
        { text: "A planned block of time together feels more meaningful than a quick check-in.", weights: { time: 2, words: -1 } },
        { text: "When someone handles a task before I ask, I feel supported.", weights: { service: 2 } },
        { text: "A hug or hand on my shoulder can calm me when it is welcome.", weights: { touch: 2 } },
        { text: "I notice when someone remembers my favorite small things.", weights: { gifts: 2 } },
        { text: "During conflict, sincere repair words matter a lot to me.", weights: { words: 2 } },
        { text: "I would rather have uninterrupted time than an elaborate plan.", weights: { time: 2, gifts: -1 } },
        { text: "I read follow-through as care more than intention alone.", weights: { service: 2 } },
        { text: "Physical closeness helps me feel connected after distance.", weights: { touch: 2 } },
        { text: "A small object chosen with care can feel like proof someone knows me.", weights: { gifts: 2 } },
        { text: "Encouraging messages help me keep going when I feel uncertain.", weights: { words: 2 } },
        { text: "Shared routines, like a walk or meal, feel important to connection.", weights: { time: 2 } },
        { text: "I feel loved when someone makes my day easier in a concrete way.", weights: { service: 2 } },
        { text: "I notice whether affection feels warm, present, and physically near.", weights: { touch: 2 } },
        { text: "Remembered dates, symbols, or souvenirs feel meaningful to me.", weights: { gifts: 2 } },
        { text: "I often show care by saying what I admire about someone.", weights: { words: 1 } },
        { text: "I often show care by making time and staying present.", weights: { time: 1 } },
        { text: "I often show care by helping before someone gets overwhelmed.", weights: { service: 1 } },
        { text: "I often show care through warmth, closeness, or gentle affection.", weights: { touch: 1 } },
        { text: "I often show care by choosing something thoughtful or symbolic.", weights: { gifts: 1 } }
    ];

    const ANSWERS = [
        { label: "Strongly disagree", value: 1 },
        { label: "Disagree", value: 2 },
        { label: "Not sure", value: 3 },
        { label: "Agree", value: 4 },
        { label: "Strongly agree", value: 5 }
    ];

    let currentIdx = 0;
    const answers = [];

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch]));
    }

    function renderQuestion() {
        const host = document.getElementById("love-test-container");
        if (!host) return;
        const question = QUESTIONS[currentIdx];
        const progress = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);
        host.innerHTML = `
            <div class="attachment-quiz-card love-quiz-card">
                <div class="mbti-progress">
                    <div class="progress-label">${currentIdx + 1} / ${QUESTIONS.length}</div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
                </div>
                <h2 class="attachment-question-text">${escapeHtml(question.text)}</h2>
                <div class="attachment-answer-grid">
                    ${ANSWERS.map(answer => `
                        <button class="attachment-answer-btn" type="button" data-value="${answer.value}">
                            ${escapeHtml(answer.label)}
                        </button>
                    `).join("")}
                </div>
                <div class="attachment-quiz-footer">
                    <button class="mbti-btn-back" type="button" data-back ${currentIdx === 0 ? "disabled" : ""}>Back</button>
                    <span>This is a self-reflection tool, not a diagnosis.</span>
                </div>
            </div>
        `;
        host.querySelectorAll("[data-value]").forEach(btn => btn.addEventListener("click", () => answer(Number(btn.dataset.value))));
        const backBtn = host.querySelector("[data-back]");
        if (backBtn) backBtn.addEventListener("click", back);
    }

    function answer(value) {
        answers[currentIdx] = value;
        if (currentIdx < QUESTIONS.length - 1) {
            currentIdx += 1;
            renderQuestion();
            return;
        }
        finish();
    }

    function back() {
        if (currentIdx > 0) {
            currentIdx -= 1;
            renderQuestion();
        }
    }

    function scoreQuiz() {
        const scores = { words: 0, time: 0, service: 0, touch: 0, gifts: 0 };
        QUESTIONS.forEach((question, idx) => {
            const centered = (answers[idx] || 3) - 3;
            Object.entries(question.weights).forEach(([type, weight]) => {
                scores[type] += centered * weight;
            });
        });
        const order = ["words", "time", "service", "touch", "gifts"];
        const ranked = Object.entries(scores).sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1];
            return order.indexOf(a[0]) - order.indexOf(b[0]);
        });
        return { type: ranked[0][0], scores };
    }

    function finish() {
        const { type, scores } = scoreQuiz();
        window.MeowTrack && window.MeowTrack("quiz_complete", {
            framework: "love_languages",
            result_type: type
        });
        const params = new URLSearchParams({
            type,
            w: scores.words,
            t: scores.time,
            s: scores.service,
            p: scores.touch,
            g: scores.gifts
        });
        window.location.href = `result.html?${params.toString()}`;
    }

    window.MeowLoveLanguagesQuiz = { TYPES, start: renderQuestion };
    if (document.getElementById("love-test-container")) {
        window.MeowTrack && window.MeowTrack("quiz_start", { framework: "love_languages" });
        renderQuestion();
    }
})();
