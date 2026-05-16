(function() {
    if (!window.MeowI18n) {
        console.error('MeowI18n not loaded');
        return;
    }
    const { getLang, t, withLang } = window.MeowI18n;

    let currentIdx = 0;
    let scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

    const QUESTIONS = window.MeowEnneaQuestions;
    if (!QUESTIONS) {
        console.error('MeowEnneaQuestions not loaded');
        return;
    }

    function renderQuestion() {
        const q = QUESTIONS[currentIdx];
        const lang = getLang();
        const text = q.text[lang] || q.text.en;
        
        const host = document.getElementById('ennea-test-container');
        if (!host) return;

        host.innerHTML = `
            <div class="ennea-card">
                <div class="ennea-progress">${currentIdx + 1} / ${QUESTIONS.length}</div>
                <h2 class="ennea-question-text">${text}</h2>
                <div class="ennea-actions">
                    <button class="ennea-btn primary" onclick="MeowEnnea.answer(2)">${t('enneaLikeMe')}</button>
                    <button class="ennea-btn" onclick="MeowEnnea.answer(1)">${t('enneaSometimes')}</button>
                    <button class="ennea-btn" onclick="MeowEnnea.answer(0)">${t('enneaNotMe')}</button>
                </div>
                <div class="ennea-footer">
                    <button class="mbti-btn-back" onclick="MeowEnnea.back()" ${currentIdx === 0 ? 'disabled' : ''}>← ${t('back')}</button>
                </div>
            </div>
        `;
    }

    let answers = [];

    function answer(val) {
        answers[currentIdx] = val;
        if (currentIdx < QUESTIONS.length - 1) {
            currentIdx++;
            renderQuestion();
        } else {
            finish();
        }
    }

    function back() {
        if (currentIdx > 0) {
            currentIdx--;
            renderQuestion();
        }
    }

    function finish() {
        // Reset scores
        for (let k in scores) scores[k] = 0;

        // Calculate scores
        QUESTIONS.forEach((q, i) => {
            const val = answers[i] || 0;
            scores[q.type] += val;
        });

        // Determine top types
        const sorted = Object.keys(scores).sort((a, b) => {
            if (scores[b] !== scores[a]) return scores[b] - scores[a];
            return a - b; // Tie-breaker: lower type number has priority (arbitrary but deterministic)
        });

        const topType = sorted[0];
        
        // Build tally string for URL (T1S5T2S3...)
        const tParams = sorted.map(type => `T${type}S${scores[type]}`).join('');
        
        const langSuffix = getLang() !== 'en' ? `&lang=${getLang()}` : '';
        window.location.href = `result.html?type=${topType}&t=${tParams}${langSuffix}`;
    }

    window.MeowEnnea = {
        start: function() {
            renderQuestion();
        },
        answer: answer,
        back: back
    };

    if (document.getElementById('ennea-test-container')) {
        MeowEnnea.start();
    }
})();