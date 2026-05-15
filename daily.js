// MeowBTI Daily Emotional Weather v1.
(function () {
    const STORAGE_KEY = 'meowbti.dailyCheckins.v2';
    const MAX_ITEMS = 30;
    const VERSION = 2;

    const ORBS = {
        'soft-static': { colors: ['#D8E2FF', '#9B59B6'], motion: 'slow', emoji: '☁️' },
        'velvet-thunder': { colors: ['#7A5BFF', '#1F1410'], motion: 'shimmer', emoji: '🌩️' },
        'overcaffeinated-moon': { colors: ['#FFEFC2', '#7A5BFF'], motion: 'jitter', emoji: '🌙' },
        'tiny-storm': { colors: ['#3B6FFF', '#FF5B3B'], motion: 'ripple', emoji: '⛈️' },
        'closed-curtains': { colors: ['#2E7D7D', '#D2EDE0'], motion: 'still', emoji: '🪟' },
        'chosen-people-only': { colors: ['#D94E8C', '#FFE3D6'], motion: 'glow', emoji: '🫶' },
        'clear-window': { colors: ['#5BA8D9', '#FFF4EC'], motion: 'sweep', emoji: '🫧' },
        'sparkle-warning': { colors: ['#FFB000', '#FF6B6B'], motion: 'sparkle', emoji: '✨' }
    };

    const QUESTIONS = [
        {
            key: 'energy',
            questionKey: 'moodQEnergy',
            options: [
                ['low', 'moodEnergyLow'],
                ['medium', 'moodEnergyMed'],
                ['high', 'moodEnergyHigh']
            ]
        },
        {
            key: 'social',
            questionKey: 'moodQSocial',
            options: [
                ['hiding', 'moodSocialHiding'],
                ['selective', 'moodSocialSelective'],
                ['social', 'moodSocialSocial']
            ]
        },
        {
            key: 'stress',
            questionKey: 'moodQStress',
            options: [
                ['calm', 'moodStressCalm'],
                ['scattered', 'moodStressScattered'],
                ['overloaded', 'moodStressOver']
            ]
        }
    ];

    function i18n() {
        return window.MeowI18n || { t: k => k, getLang: () => 'en', withLang: h => h };
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function todayKey() {
        return new Date().toISOString().split('T')[0];
    }

    function getDailyHash(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function readStore() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '');
            if (parsed && parsed.version === VERSION) return parsed;
        } catch (_) {}
        return { version: VERSION, items: [] };
    }

    function saveCheckin(entry) {
        const store = readStore();
        const items = [entry].concat(store.items.filter(i => i.date !== entry.date)).slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items }));
    }

    function getTodayCheckin() {
        const date = todayKey();
        return readStore().items.find(i => i.date === date) || null;
    }

    function getPrimaryProfile() {
        if (!window.MeowStore) return null;
        const family = window.MeowStore.getFamily();
        return family.find(p => p.subject === 'human') || family[0] || null;
    }

    function buildResult(answers, profile) {
        const { getLang } = i18n();
        const lang = getLang();
        const date = todayKey();
        const content = window.MeowDailyContent;
        if (!content) return null;

        const seed = date + answers.energy + answers.social + answers.stress + (profile ? profile.code : '');
        const hash = getDailyHash(seed);

        const label = content.labels[hash % content.labels.length];
        const insight = content.insights[hash % content.insights.length];
        const catEnergy = content.catEnergy[hash % content.catEnergy.length];
        const advice = content.advice[hash % content.advice.length];
        const shareLine = content.shareLines[hash % content.shareLines.length];

        // Orb selection
        let orbType = 'clear-window';
        if (answers.energy === 'high' && answers.stress === 'overloaded') orbType = 'tiny-storm';
        else if (answers.social === 'hiding') orbType = 'closed-curtains';
        else if (answers.energy === 'low') orbType = 'soft-static';
        else if (answers.stress === 'overloaded') orbType = 'velvet-thunder';
        else if (answers.social === 'selective') orbType = 'chosen-people-only';
        else if (answers.energy === 'high') orbType = 'sparkle-warning';

        const orb = ORBS[orbType];

        return {
            orbType,
            emoji: orb.emoji,
            colorA: orb.colors[0],
            colorB: orb.colors[1],
            motion: orb.motion,
            label: label[lang] || label.en,
            insight: insight[lang] || insight.en,
            catEnergy: catEnergy[lang] || catEnergy.en,
            advice: advice[lang] || advice.en,
            shareLine: shareLine[lang] || shareLine.en
        };
    }

    function orbMarkup(result, size = '') {
        return `
            <div class="mood-orb ${size} motion-${result.motion}"
                 style="--orb-a:${result.colorA};--orb-b:${result.colorB}" aria-hidden="true">
                <span>${result.emoji}</span>
            </div>`;
    }

    function renderResult(host, entry) {
        const { t } = i18n();
        const r = entry.result;
        host.innerHTML = `
            <div class="daily-result-card v2">
                <div class="daily-result-top">
                    ${orbMarkup(r, 'large')}
                    <div class="dr-header">
                        <span class="daily-page-kicker">${escapeHtml(t('dailyStatus'))}</span>
                        <h2>${escapeHtml(r.label)}</h2>
                        ${entry.profile ? `<p class="dr-profile-line">${escapeHtml(t('dailyContextLine', entry.profile.code))}</p>` : ''}
                    </div>
                </div>
                
                <div class="dr-content-grid">
                    <div class="dr-block">
                        <h3>${t('dailyInsightH')}</h3>
                        <p>${escapeHtml(r.insight)}</p>
                    </div>
                    <div class="dr-block">
                        <h3>${t('dailyCatLineH')}</h3>
                        <p>${escapeHtml(r.catEnergy)}</p>
                    </div>
                    <div class="dr-block">
                        <h3>${t('dailyAdviceH')}</h3>
                        <p>${escapeHtml(r.advice)}</p>
                    </div>
                </div>

                <div class="daily-result-actions">
                    <button type="button" class="big-btn" id="daily-share">${t('dailyShareCta')}</button>
                    <button type="button" class="big-btn ghost" id="daily-retake">${t('dailyRetakeCta')}</button>
                </div>
                <div id="daily-status" class="share-status"></div>
            </div>
        `;

        host.querySelector('#daily-retake').onclick = () => renderQuestion(host, { step: 0, answers: {} });
        host.querySelector('#daily-share').onclick = async () => {
            const text = `${r.shareLine}\nForecast: ${r.label}\n${window.location.origin}${i18n().withLang('/daily.html')}`;
            const status = host.querySelector('#daily-status');
            try {
                if (navigator.share) {
                    await navigator.share({ title: 'MeowBTI Daily', text });
                } else {
                    await navigator.clipboard.writeText(text);
                    status.textContent = t('dailyCopied');
                }
            } catch (_) {
                status.textContent = t('dailyCopyCta') + ": " + text;
            }
        };
    }

    function renderQuestion(host, state) {
        const { t } = i18n();
        const q = QUESTIONS[state.step];
        const profile = getPrimaryProfile();
        
        host.innerHTML = `
            <div class="daily-question-card v2">
                <div class="daily-question-meta">
                    <span>${state.step + 1} / ${QUESTIONS.length}</span>
                    ${profile ? `<span>${profile.code}</span>` : ''}
                </div>
                <h2>${t(q.questionKey)}</h2>
                <div class="daily-options stack">
                    ${q.options.map(([val, key]) => `
                        <button type="button" class="daily-option" data-value="${val}">${t(key)}</button>
                    `).join('')}
                </div>
            </div>
        `;

        host.querySelectorAll('.daily-option').forEach(btn => {
            btn.onclick = () => {
                state.answers[q.key] = btn.dataset.value;
                if (state.step < QUESTIONS.length - 1) {
                    state.step++;
                    renderQuestion(host, state);
                } else {
                    const res = buildResult(state.answers, profile);
                    const entry = { date: todayKey(), answers: state.answers, result: res, profile };
                    saveCheckin(entry);
                    renderResult(host, entry);
                }
            };
        });
    }

    function init() {
        const pageApp = document.getElementById('daily-app');
        if (pageApp) {
            const today = getTodayCheckin();
            if (today) renderResult(pageApp, today);
            else renderQuestion(pageApp, { step: 0, answers: {} });
        }

        const homeWidget = document.getElementById('daily-weather-home');
        if (homeWidget) {
            const today = getTodayCheckin();
            const { t, withLang } = i18n();
            if (today) {
                homeWidget.innerHTML = `
                    <div class="dwh-main">
                        ${orbMarkup(today.result, 'mini')}
                        <div>
                            <span class="dh-badge">${t('homeDailyWeatherSavedH')}</span>
                            <h2>${today.result.label}</h2>
                        </div>
                    </div>
                    <a href="${withLang('daily.html')}" class="cta-button accent">${t('homeDailyWeatherSavedCta')}</a>
                `;
            } else {
                homeWidget.innerHTML = `
                    <div class="dwh-main">
                        <div class="mood-orb mini motion-slow" style="--orb-a:#5BA8D9;--orb-b:#FFF4EC"><span>🫧</span></div>
                        <div>
                            <span class="dh-badge">${t('dailyKicker')}</span>
                            <h2>${t('homeDailyWeatherH')}</h2>
                        </div>
                    </div>
                    <a href="${withLang('daily.html')}" class="cta-button accent">${t('homeDailyWeatherCta')}</a>
                `;
            }
        }

        const mbtiResultAnchor = document.getElementById('mbti-daily-weather-anchor');
        if (mbtiResultAnchor) {
            renderQuestion(mbtiResultAnchor, { step: 0, answers: {} });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();