(function() {
    const RESULTS = {
        thriving: {
            name: "Thriving",
            signs: ["Energy feels mostly available", "Recovery time is working", "Pressure feels manageable"],
            patterns: "Your current pattern suggests that effort and recovery are still in a workable rhythm.",
            recovery: "Protect what is already helping. Keep recovery visible before pressure starts to pile up.",
            suggestions: ["Keep one non-negotiable rest ritual", "Notice early warning signs before they become loud", "Avoid filling every open space just because you can"]
        },
        balanced: {
            name: "Balanced",
            signs: ["Some pressure is present", "Recovery helps, but may need protection", "Energy varies by context"],
            patterns: "Your current pattern looks mostly steady, with some signs that pressure could grow if recovery gets squeezed.",
            recovery: "Think of balance as maintenance, not perfection. Small boundaries now can prevent larger strain later.",
            suggestions: ["Choose one load to simplify this week", "Put recovery on the calendar before optional tasks", "Name what drains you versus what restores you"]
        },
        strained: {
            name: "Strained",
            signs: ["Fatigue may be lingering", "Motivation may feel harder to access", "Recovery may not fully reset you"],
            patterns: "Your current pattern suggests that pressure may be outpacing recovery. You may still be functioning, but it could be costing more than usual.",
            recovery: "Focus on reducing load where possible and making recovery more concrete. This is a good moment to ask what can be delayed, delegated, or simplified.",
            suggestions: ["Cut one recurring obligation if possible", "Ask for practical support before you are fully depleted", "Create a low-stimulation recovery block"]
        },
        risk: {
            name: "Burnout Risk",
            signs: ["Exhaustion may feel persistent", "Rest may not feel restorative", "Pressure may feel hard to escape"],
            patterns: "Your current pattern suggests a high strain state. This result is not a diagnosis, but it is a signal to take your recovery needs seriously.",
            recovery: "Prioritize immediate load reduction and support. If distress feels intense, unsafe, or unmanageable, consider reaching out to a qualified professional or trusted support person.",
            suggestions: ["Reduce nonessential commitments quickly", "Tell someone specific what support would help", "Protect sleep, food, movement, and quiet time as basics, not rewards"]
        }
    };

    const QUESTIONS = [
        { text: "I wake up feeling like I have enough energy for the day.", reverse: true },
        { text: "Even small tasks have started to feel heavier than they should.", reverse: false },
        { text: "I can stop working or helping without feeling guilty.", reverse: true },
        { text: "My mind keeps returning to unfinished responsibilities when I try to rest.", reverse: false },
        { text: "I have enough quiet time to recover from pressure.", reverse: true },
        { text: "I feel emotionally flatter or more cynical than usual.", reverse: false },
        { text: "I can focus without pushing through constant mental fog.", reverse: true },
        { text: "I feel like people need more from me than I can comfortably give.", reverse: false },
        { text: "Breaks actually help me feel restored.", reverse: true },
        { text: "I have been more irritable, numb, or checked out lately.", reverse: false },
        { text: "My workload or responsibilities feel realistically paced.", reverse: true },
        { text: "I often keep going after my body or mind asks me to stop.", reverse: false },
        { text: "I have someone or something that helps me decompress.", reverse: true },
        { text: "I feel trapped by routines, roles, or expectations.", reverse: false },
        { text: "I can enjoy simple things without thinking about what I should be doing.", reverse: true },
        { text: "I feel behind even when I am doing a lot.", reverse: false },
        { text: "My boundaries around time and energy are mostly respected.", reverse: true },
        { text: "I need more recovery than I am currently getting.", reverse: false },
        { text: "I still feel connected to why my effort matters.", reverse: true },
        { text: "I feel close to running on empty.", reverse: false }
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
        const host = document.getElementById("burnout-test-container");
        if (!host) return;
        const question = QUESTIONS[currentIdx];
        const progress = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);
        host.innerHTML = `
            <div class="attachment-quiz-card burnout-quiz-card">
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
        const total = QUESTIONS.reduce((sum, question, idx) => {
            const raw = answers[idx] || 3;
            return sum + (question.reverse ? 6 - raw : raw);
        }, 0);
        let type = "thriving";
        if (total > 76) type = "risk";
        else if (total > 58) type = "strained";
        else if (total > 40) type = "balanced";
        return { type, score: total };
    }

    function finish() {
        const { type, score } = scoreQuiz();
        window.MeowTrack && window.MeowTrack("quiz_complete", {
            framework: "burnout_check",
            result_type: type
        });
        const params = new URLSearchParams({ type, score });
        window.location.href = `result.html?${params.toString()}`;
    }

    window.MeowBurnoutCheck = { RESULTS, start: renderQuestion };
    if (document.getElementById("burnout-test-container")) {
        window.MeowTrack && window.MeowTrack("quiz_start", { framework: "burnout_check" });
        renderQuestion();
    }
})();
