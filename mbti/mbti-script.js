(function() {
    if (!window.MeowI18n) {
        console.error('MeowI18n not loaded');
        return;
    }
    const { getLang, t, withLang } = window.MeowI18n;

    let currentIdx = 0;
    let answers = []; // true for Agree, false for Disagree

    const QUESTIONS = window.MeowMBTIQuestions;
    if (!QUESTIONS) {
        console.error('MeowMBTIQuestions not loaded');
        return;
    }

    function renderQuestion() {
        if (currentIdx === 0 && answers.length === 0) {
            window.MeowTrack && window.MeowTrack('quiz_start', { framework: 'mbti', lang: getLang() });
        }
        const q = QUESTIONS[currentIdx];
        const lang = getLang();
        const text = q.text[lang] || q.text.en;
        
        const host = document.getElementById('mbti-test-container');
        if (!host) return;

        host.innerHTML = `
            <div class="mbti-card">
                <div class="mbti-progress">
                    <div class="progress-label">${currentIdx + 1} / ${QUESTIONS.length}</div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${((currentIdx + 1) / QUESTIONS.length) * 100}%"></div></div>
                </div>
                <h2 class="mbti-question-text">${text}</h2>
                <div class="mbti-actions">
                    <button class="mbti-btn disagree" onclick="MeowMBTI.answer(false)">${t('mbtiDisagree')}</button>
                    <button class="mbti-btn agree" onclick="MeowMBTI.answer(true)">${t('mbtiAgree')}</button>
                </div>
                <div class="mbti-footer">
                    <button class="mbti-btn-back" onclick="MeowMBTI.back()" ${currentIdx === 0 ? 'disabled' : ''}>← ${t('back')}</button>
                </div>
            </div>
        `;
    }

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
        const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        
        QUESTIONS.forEach((q, i) => {
            const ans = answers[i];
            const isPositive = q.reverse ? !ans : ans; // Agree with reverse means I, S, T, J

            if (q.axis === 'EI') {
                if (isPositive) scores.E++; else scores.I++;
            } else if (q.axis === 'SN') {
                if (isPositive) scores.N++; else scores.S++;
            } else if (q.axis === 'TF') {
                if (isPositive) scores.F++; else scores.T++;
            } else if (q.axis === 'JP') {
                if (isPositive) scores.P++; else scores.J++;
            }
        });

        const mbti = 
            (scores.E >= scores.I ? 'E' : 'I') +
            (scores.S >= scores.N ? 'S' : 'N') +
            (scores.T >= scores.F ? 'T' : 'F') +
            (scores.J >= scores.P ? 'J' : 'P');

        const mapping = {
            'ISTJ': 'SHBR', 'ISFJ': 'SHNR', 'INFJ': 'SDNR', 'INTJ': 'SDBR',
            'ISTP': 'SHBC', 'ISFP': 'SHNC', 'INFP': 'SDNC', 'INTP': 'SDBC',
            'ESTP': 'CHBC', 'ESFP': 'CHNC', 'ENFP': 'CDNC', 'ENTP': 'CDBC',
            'ESTJ': 'CHBR', 'ESFJ': 'CHNR', 'ENFJ': 'CDNR', 'ENTJ': 'CDBR'
        };
        const meowCode = mapping[mbti];

        window.MeowTrack && window.MeowTrack('quiz_complete', {
            framework: 'mbti',
            result_type: mbti,
            meow_cousin: meowCode,
            lang: getLang()
        });

        const tParams = `C${scores.E}S${scores.I}H${scores.S}D${scores.N}B${scores.T}N${scores.F}R${scores.J}F${scores.P}`;
        
        const langSuffix = getLang() !== 'en' ? `&lang=${getLang()}` : '';
        window.location.href = `result.html?type=${mbti}&meow=${meowCode}&t=${tParams}${langSuffix}`;
    }

    window.MeowMBTI = {
        start: function() {
            renderQuestion();
        },
        answer: answer,
        back: back
    };

    if (document.getElementById('mbti-test-container')) {
        MeowMBTI.start();
    }
})();