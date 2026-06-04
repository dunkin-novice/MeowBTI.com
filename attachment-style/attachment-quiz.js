(function() {
    const TYPES = {
        secure: {
            name: "Secure",
            page: "secure/",
            overview: "You may usually find closeness and independence both workable. When stress appears, you tend to look for repair, clarity, and mutual steadiness rather than proving or withdrawing.",
            strengths: ["Communicates needs with relative directness", "Can accept care without losing a sense of self", "Often sees conflict as something that can be repaired"],
            challenges: ["May underestimate how hard trust feels for others", "Can still avoid difficult topics when overloaded", "May need to practice naming needs before resentment builds"],
            patterns: "In relationships, this pattern often looks like steady warmth, room for individuality, and willingness to talk after tension.",
            growth: "Keep practicing specific requests, active listening, and repair after small misunderstandings. Security is maintained through repeated everyday choices."
        },
        anxious: {
            name: "Anxious",
            page: "anxious/",
            overview: "You may notice a stronger pull toward reassurance, closeness, and signs that the relationship is still safe. Unclear communication can feel especially loud.",
            strengths: ["Deeply notices emotional shifts", "Values closeness, care, and responsiveness", "Often wants to repair tension quickly"],
            challenges: ["May read silence as rejection", "Can over-explain or seek repeated reassurance under stress", "May put another person's mood ahead of your own needs"],
            patterns: "In relationships, this pattern often looks like high sensitivity to distance, quick bids for connection, and relief when communication feels warm and consistent.",
            growth: "Practice slowing the story your mind creates under uncertainty. Ask for reassurance directly, while also building calming routines that do not depend on an immediate reply."
        },
        avoidant: {
            name: "Avoidant",
            page: "avoidant/",
            overview: "You may protect your steadiness through space, self-reliance, and time to think. Too much emotional pressure can make distance feel like the safest move.",
            strengths: ["Respects independence and personal boundaries", "Can stay practical under pressure", "Often gives others room to be themselves"],
            challenges: ["May pull away before explaining what is happening", "Can experience needs as pressure or loss of freedom", "May delay repair because space feels easier than conversation"],
            patterns: "In relationships, this pattern often looks like valuing autonomy, needing time before emotional conversations, and feeling wary of intensity.",
            growth: "Practice naming the need for space without disappearing. A short, clear message can protect independence while keeping the connection intact."
        },
        fearfulAvoidant: {
            name: "Fearful Avoidant",
            page: "fearful-avoidant/",
            overview: "You may want closeness and feel cautious about it at the same time. Connection can feel meaningful, while uncertainty or conflict may trigger both reaching and retreating.",
            strengths: ["Notices complexity in relationships", "Can be deeply loyal when trust feels earned", "Often reflects carefully on emotional safety"],
            challenges: ["May switch between seeking closeness and needing distance", "Can expect disappointment even when care is present", "May find conflict hard to interpret in the moment"],
            patterns: "In relationships, this pattern often looks like mixed signals: wanting reassurance, then needing room when closeness feels overwhelming.",
            growth: "Practice one small steady action at a time: naming what you feel, asking for a pause, or choosing a repair conversation after your body settles."
        }
    };

    const QUESTIONS = [
        { text: "When someone I care about is consistent, it is usually easy for me to relax into the relationship.", weights: { secure: 2, anxious: -1, avoidant: -1 } },
        { text: "If a message goes unanswered, my mind quickly wonders whether something is wrong.", weights: { anxious: 2, secure: -1 } },
        { text: "I need a lot of personal space before I can talk about emotional tension.", weights: { avoidant: 2, fearfulAvoidant: 1 } },
        { text: "I can ask for reassurance without feeling ashamed of needing it.", weights: { secure: 2, anxious: -1, fearfulAvoidant: -1 } },
        { text: "When someone gets closer to me, part of me looks for reasons to step back.", weights: { avoidant: 1, fearfulAvoidant: 2 } },
        { text: "Conflict feels easier when both people can pause and then come back to repair.", weights: { secure: 2 } },
        { text: "I often notice small changes in tone, timing, or attention from people I care about.", weights: { anxious: 2, fearfulAvoidant: 1 } },
        { text: "Depending on someone can feel uncomfortable, even when they have been kind.", weights: { avoidant: 2, fearfulAvoidant: 1, secure: -1 } },
        { text: "I usually believe a relationship can have tension without being in danger.", weights: { secure: 2, anxious: -1, fearfulAvoidant: -1 } },
        { text: "I sometimes keep asking questions because I need to feel certain where I stand.", weights: { anxious: 2 } },
        { text: "When emotions get intense, I prefer to solve things alone first.", weights: { avoidant: 2 } },
        { text: "I can be close to someone while still keeping my own routines and interests.", weights: { secure: 2, avoidant: -1 } },
        { text: "I may test whether someone cares instead of asking directly.", weights: { anxious: 1, fearfulAvoidant: 2 } },
        { text: "Too many emotional demands can make me feel trapped.", weights: { avoidant: 2, fearfulAvoidant: 1 } },
        { text: "It feels natural to repair after a misunderstanding, even if the talk is awkward.", weights: { secure: 2 } },
        { text: "I can feel drawn to someone and suspicious of closeness at the same time.", weights: { fearfulAvoidant: 2 } },
        { text: "Clear plans and warm follow-through help me feel emotionally safe.", weights: { anxious: 1, secure: 1 } },
        { text: "I sometimes minimize my needs so nobody expects too much from me.", weights: { avoidant: 1, fearfulAvoidant: 1 } },
        { text: "When I feel hurt, I can usually say what happened without blaming or shutting down.", weights: { secure: 2, anxious: -1, avoidant: -1 } },
        { text: "I feel uneasy when I cannot tell what someone is feeling about me.", weights: { anxious: 2, fearfulAvoidant: 1 } },
        { text: "If someone wants a serious talk immediately, I may go quiet or detach.", weights: { avoidant: 2, fearfulAvoidant: 1 } },
        { text: "Trust grows for me through repeated actions, not one dramatic promise.", weights: { secure: 1, fearfulAvoidant: 1 } },
        { text: "I sometimes expect closeness to become painful, even when things are going well.", weights: { fearfulAvoidant: 2, anxious: 1 } },
        { text: "I can receive feedback from someone close without assuming the relationship is ending.", weights: { secure: 2, anxious: -1, fearfulAvoidant: -1 } }
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
        const host = document.getElementById("attachment-test-container");
        if (!host) return;
        const question = QUESTIONS[currentIdx];
        const progress = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

        host.innerHTML = `
            <div class="attachment-quiz-card">
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

        host.querySelectorAll("[data-value]").forEach(btn => {
            btn.addEventListener("click", () => answer(Number(btn.dataset.value)));
        });
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
        const scores = { secure: 0, anxious: 0, avoidant: 0, fearfulAvoidant: 0 };
        QUESTIONS.forEach((question, idx) => {
            const centered = (answers[idx] || 3) - 3;
            Object.entries(question.weights).forEach(([type, weight]) => {
                scores[type] += centered * weight;
            });
        });

        const ranked = Object.entries(scores).sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1];
            return ["secure", "anxious", "avoidant", "fearfulAvoidant"].indexOf(a[0]) - ["secure", "anxious", "avoidant", "fearfulAvoidant"].indexOf(b[0]);
        });
        return { type: ranked[0][0], scores };
    }

    function finish() {
        const { type, scores } = scoreQuiz();
        window.MeowTrack && window.MeowTrack("quiz_complete", {
            framework: "attachment_style",
            result_type: type
        });
        const params = new URLSearchParams({
            type,
            s: scores.secure,
            a: scores.anxious,
            v: scores.avoidant,
            f: scores.fearfulAvoidant
        });
        window.location.href = `result.html?${params.toString()}`;
    }

    window.MeowAttachmentQuiz = { TYPES, start: renderQuestion };
    if (document.getElementById("attachment-test-container")) {
        window.MeowTrack && window.MeowTrack("quiz_start", { framework: "attachment_style" });
        renderQuestion();
    }
})();
