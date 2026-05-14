// MeowBTI Emotional Weather MVP. Static, localStorage-only daily check-in.

(function () {
    const STORAGE_KEY = 'meowbti.dailyCheckins.v1';
    const MAX_ITEMS = 30;
    const VERSION = 1;

    const ORBS = {
        'soft-static': {
            labelKey: 'orbSoftStatic',
            weather: 'soft-rain',
            colors: ['#D8E2FF', '#9B59B6'],
            motion: 'slow',
            texture: 'mist',
            emoji: '☁️'
        },
        'velvet-thunder': {
            labelKey: 'orbVelvetThunder',
            weather: 'static-pressure',
            colors: ['#7A5BFF', '#1F1410'],
            motion: 'shimmer',
            texture: 'velvet',
            emoji: '🌩️'
        },
        'overcaffeinated-moon': {
            labelKey: 'orbOvercaffeinatedMoon',
            weather: 'emotional-humidity',
            colors: ['#FFEFC2', '#7A5BFF'],
            motion: 'jitter',
            texture: 'orbit',
            emoji: '🌙'
        },
        'tiny-storm': {
            labelKey: 'orbTinyStorm',
            weather: 'tiny-thunder',
            colors: ['#3B6FFF', '#FF5B3B'],
            motion: 'ripple',
            texture: 'storm',
            emoji: '⛈️'
        },
        'closed-curtains': {
            labelKey: 'orbClosedCurtains',
            weather: 'foggy-but-safe',
            colors: ['#2E7D7D', '#D2EDE0'],
            motion: 'still',
            texture: 'curtain',
            emoji: '🪟'
        },
        'chosen-people-only': {
            labelKey: 'orbChosenPeopleOnly',
            weather: 'quiet-sunbeam',
            colors: ['#D94E8C', '#FFE3D6'],
            motion: 'glow',
            texture: 'warm',
            emoji: '🫶'
        },
        'clear-window': {
            labelKey: 'orbClearWindow',
            weather: 'clear-ish-skies',
            colors: ['#5BA8D9', '#FFF4EC'],
            motion: 'sweep',
            texture: 'clear',
            emoji: '🫧'
        },
        'sparkle-warning': {
            labelKey: 'orbSparkleWarning',
            weather: 'bright-chaos',
            colors: ['#FFB000', '#FF6B6B'],
            motion: 'sparkle',
            texture: 'bright',
            emoji: '✨'
        }
    };

    const WEATHER_KEYS = {
        'foggy-but-safe': ['weatherFoggySafe', 'weatherLineFoggySafe', 'weatherNeedFoggySafe', 'weatherPermissionFoggySafe'],
        'soft-rain': ['weatherSoftRain', 'weatherLineSoftRain', 'weatherNeedSoftRain', 'weatherPermissionSoftRain'],
        'emotional-humidity': ['weatherEmotionalHumidity', 'weatherLineEmotionalHumidity', 'weatherNeedEmotionalHumidity', 'weatherPermissionEmotionalHumidity'],
        'tiny-thunder': ['weatherTinyThunder', 'weatherLineTinyThunder', 'weatherNeedTinyThunder', 'weatherPermissionTinyThunder'],
        'bright-chaos': ['weatherBrightChaos', 'weatherLineBrightChaos', 'weatherNeedBrightChaos', 'weatherPermissionBrightChaos'],
        'quiet-sunbeam': ['weatherQuietSunbeam', 'weatherLineQuietSunbeam', 'weatherNeedQuietSunbeam', 'weatherPermissionQuietSunbeam'],
        'static-pressure': ['weatherStaticPressure', 'weatherLineStaticPressure', 'weatherNeedStaticPressure', 'weatherPermissionStaticPressure'],
        'clear-ish-skies': ['weatherClearishSkies', 'weatherLineClearishSkies', 'weatherNeedClearishSkies', 'weatherPermissionClearishSkies']
    };

    const QUESTIONS = [
        {
            key: 'energy',
            questionKey: 'moodQEnergy',
            options: [
                ['low', 'moodEnergyLow'],
                ['steady', 'moodEnergySteady'],
                ['wired', 'moodEnergyWired'],
                ['chaotic', 'moodEnergyChaotic']
            ]
        },
        {
            key: 'social',
            questionKey: 'moodQSocial',
            options: [
                ['hidden', 'moodSocialHidden'],
                ['selective', 'moodSocialSelective'],
                ['open', 'moodSocialOpen'],
                ['loud', 'moodSocialLoud']
            ]
        },
        {
            key: 'texture',
            questionKey: 'moodQTexture',
            options: [
                ['soft', 'moodTextureSoft'],
                ['heavy', 'moodTextureHeavy'],
                ['sharp', 'moodTextureSharp'],
                ['floaty', 'moodTextureFloaty']
            ]
        },
        {
            key: 'need',
            questionKey: 'moodQNeed',
            options: [
                ['rest', 'moodNeedRest'],
                ['clarity', 'moodNeedClarity'],
                ['validation', 'moodNeedValidation'],
                ['movement', 'moodNeedMovement']
            ]
        }
    ];

    function i18n() {
        return window.MeowI18n || {
            t: k => k,
            getLang: () => 'en',
            withLang: href => href
        };
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch]));
    }

    function todayKey() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function readStore() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '');
            if (!parsed || parsed.version !== VERSION || !Array.isArray(parsed.items)) {
                return { version: VERSION, items: [] };
            }
            return parsed;
        } catch (_) {
            return { version: VERSION, items: [] };
        }
    }

    function writeStore(store) {
        const items = Array.isArray(store.items) ? store.items.slice(0, MAX_ITEMS) : [];
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items }));
        } catch (_) {}
    }

    function getTodayCheckin() {
        const date = todayKey();
        return readStore().items.find(item => item && item.date === date) || null;
    }

    function saveCheckin(entry) {
        const store = readStore();
        const items = [entry].concat(store.items.filter(item => item && item.date !== entry.date));
        writeStore({ version: VERSION, items });
    }

    function getContext() {
        const params = new URLSearchParams(window.location.search);
        const subject = params.get('subject') === 'human' ? 'human' : '';
        const type = (params.get('type') || '').toUpperCase();
        const archetype = subject === 'human' && window.MeowArchetypes && window.MeowArchetypes.byCode[type]
            ? window.MeowArchetypes.byCode[type]
            : null;
        if (archetype) {
            return { subject: 'human', code: archetype.code, title: archetype.name };
        }
        return null;
    }

    function profileHint(context) {
        const { t } = i18n();
        if (context && context.code) return t('dailyContextLine', context.code);
        return t('dailyNoContextLine');
    }

    function determineOrb(answers, context) {
        const energy = answers.energy;
        const social = answers.social;
        const texture = answers.texture;
        const need = answers.need;
        let orbType = 'clear-window';

        if (energy === 'chaotic' && texture === 'sharp') orbType = 'tiny-storm';
        else if (social === 'hidden' && need === 'rest') orbType = 'closed-curtains';
        else if (energy === 'wired' && texture === 'floaty') orbType = 'overcaffeinated-moon';
        else if (energy === 'chaotic' || (social === 'loud' && need === 'movement')) orbType = 'sparkle-warning';
        else if (texture === 'heavy' && (need === 'validation' || need === 'clarity')) orbType = 'velvet-thunder';
        else if (social === 'selective' && (texture === 'soft' || need === 'validation')) orbType = 'chosen-people-only';
        else if (energy === 'low' || texture === 'soft') orbType = 'soft-static';
        else if (energy === 'steady' && need === 'clarity') orbType = 'clear-window';

        if (orbType === 'clear-window' && context && context.code) {
            if (context.code[0] === 'C' && energy === 'steady') orbType = 'sparkle-warning';
            if (context.code[0] === 'S' && social === 'hidden') orbType = 'closed-curtains';
            if (context.code[1] === 'D' && texture === 'floaty') orbType = 'overcaffeinated-moon';
            if (context.code[2] === 'N' && need === 'validation') orbType = 'chosen-people-only';
        }

        const orb = ORBS[orbType] || ORBS['clear-window'];
        const weatherType = orb.weather;
        return { orbType, weatherType, orb };
    }

    function buildResult(answers, context) {
        const { t } = i18n();
        const mapped = determineOrb(answers, context);
        const weatherKeys = WEATHER_KEYS[mapped.weatherType] || WEATHER_KEYS['clear-ish-skies'];
        return {
            orbType: mapped.orbType,
            weatherType: mapped.weatherType,
            label: t(mapped.orb.labelKey),
            weatherLabel: t(weatherKeys[0]),
            forecast: t(weatherKeys[1]),
            need: t(weatherKeys[2]),
            permission: t(weatherKeys[3]),
            colorA: mapped.orb.colors[0],
            colorB: mapped.orb.colors[1],
            motion: mapped.orb.motion,
            texture: mapped.orb.texture,
            emoji: mapped.orb.emoji
        };
    }

    function makeEntry(answers, context) {
        const date = todayKey();
        return {
            id: `daily_${date}`,
            version: VERSION,
            date,
            lang: i18n().getLang(),
            answers,
            linkedProfile: context ? {
                subject: context.subject,
                code: context.code,
                title: context.title
            } : null,
            result: buildResult(answers, context),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    function orbMarkup(result, sizeClass = '') {
        return `
            <div class="mood-orb ${escapeHtml(sizeClass)} motion-${escapeHtml(result.motion)}"
                 style="--orb-a:${escapeHtml(result.colorA)};--orb-b:${escapeHtml(result.colorB)}"
                 aria-hidden="true">
                <span>${escapeHtml(result.emoji)}</span>
            </div>`;
    }

    function resultMarkup(entry, context) {
        const { t } = i18n();
        const result = entry.result;
        const contextLine = entry.linkedProfile && entry.linkedProfile.code
            ? t('dailyContextLine', entry.linkedProfile.code)
            : profileHint(context);
        return `
            <div class="daily-result-card" data-daily-result>
                <div class="daily-result-top">
                    ${orbMarkup(result, 'large')}
                    <div>
                        <span class="daily-page-kicker">${escapeHtml(result.weatherLabel)}</span>
                        <h2>${escapeHtml(result.label)}</h2>
                        <p>${escapeHtml(contextLine)}</p>
                    </div>
                </div>
                <div class="weather-lines">
                    <p class="weather-forecast">${escapeHtml(result.forecast)}</p>
                    <p><strong>${escapeHtml(t('dailyNeedLabel'))}:</strong> ${escapeHtml(result.need)}</p>
                    <p><strong>${escapeHtml(t('dailyPermissionLabel'))}:</strong> ${escapeHtml(result.permission)}</p>
                </div>
                <div class="daily-result-actions">
                    <button type="button" class="big-btn" id="daily-share">${escapeHtml(t('dailyShareCta'))}</button>
                    <button type="button" class="big-btn ghost" id="daily-copy">${escapeHtml(t('dailyCopyCta'))}</button>
                    <button type="button" class="big-btn ghost" id="daily-retake">${escapeHtml(t('dailyRetakeCta'))}</button>
                </div>
                <p class="daily-privacy-note">${escapeHtml(t('dailySavedOnlyDevice'))} ${escapeHtml(t('dailyPrivacyNote'))}</p>
                <div class="share-status" id="daily-status" aria-live="polite">${escapeHtml(t('dailySaved'))}</div>
            </div>`;
    }

    function renderQuestion(host, state, context) {
        const { t } = i18n();
        const q = QUESTIONS[state.step];
        const progress = `${state.step + 1}/${QUESTIONS.length}`;
        const previewAnswers = Object.assign({
            energy: 'steady',
            social: 'selective',
            texture: 'soft',
            need: 'clarity'
        }, state.answers);
        const preview = buildResult(previewAnswers, context);
        host.innerHTML = `
            <div class="daily-question-card">
                <div class="daily-question-meta">
                    <span>${escapeHtml(progress)}</span>
                    <span>${escapeHtml(profileHint(context))}</span>
                </div>
                ${orbMarkup(preview)}
                <h2>${escapeHtml(t(q.questionKey))}</h2>
                <div class="daily-options">
                    ${q.options.map(([value, key]) => `
                        <button type="button" class="daily-option" data-value="${escapeHtml(value)}">
                            ${escapeHtml(t(key))}
                        </button>
                    `).join('')}
                </div>
                <p class="daily-privacy-note">${escapeHtml(t('dailySavedOnlyDevice'))}</p>
            </div>`;
        host.querySelectorAll('.daily-option').forEach(button => {
            button.addEventListener('click', () => {
                state.answers[q.key] = button.dataset.value;
                if (state.step < QUESTIONS.length - 1) {
                    state.step += 1;
                    renderQuestion(host, state, context);
                } else {
                    const entry = makeEntry(state.answers, context);
                    saveCheckin(entry);
                    renderResult(host, entry, context);
                    window.MeowTrack && window.MeowTrack('daily_checkin_complete', {
                        orb_type: entry.result.orbType,
                        weather_type: entry.result.weatherType,
                        subject: context ? context.subject : 'none'
                    });
                }
            });
        });
    }

    function shareText(entry) {
        const { t, withLang } = i18n();
        return `${t('dailyShareFallback')}: ${entry.result.weatherLabel}.\n${entry.result.forecast}\n${window.location.origin}${withLang('/daily.html')}`;
    }

    function buildShareCanvas(entry) {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext('2d');
        const r = entry.result;
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
        gradient.addColorStop(0, r.colorA);
        gradient.addColorStop(1, r.colorB);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1350);
        ctx.fillStyle = '#FFF4EC';
        ctx.fillRect(70, 70, 940, 1210);
        ctx.strokeStyle = '#1F1410';
        ctx.lineWidth = 8;
        ctx.strokeRect(70, 70, 940, 1210);
        ctx.fillStyle = r.colorA;
        ctx.beginPath();
        ctx.arc(540, 420, 190, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = r.colorB;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(610, 360, 130, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#1F1410';
        ctx.textAlign = 'center';
        ctx.font = '900 52px Georgia, serif';
        ctx.fillText('MeowBTI', 540, 170);
        ctx.font = '900 68px Georgia, serif';
        wrapCanvasText(ctx, r.label, 540, 680, 820, 76);
        ctx.font = '700 40px Arial, sans-serif';
        wrapCanvasText(ctx, r.weatherLabel, 540, 810, 820, 52);
        ctx.font = '500 34px Arial, sans-serif';
        wrapCanvasText(ctx, r.forecast, 540, 940, 820, 48);
        ctx.font = '700 28px Arial, sans-serif';
        ctx.fillText('meowbti.com/daily.html', 540, 1180);
        return canvas;
    }

    function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = String(text).split(/\s+/);
        let line = '';
        words.forEach(word => {
            const test = line ? `${line} ${word}` : word;
            if (ctx.measureText(test).width > maxWidth && line) {
                ctx.fillText(line, x, y);
                y += lineHeight;
                line = word;
            } else {
                line = test;
            }
        });
        if (line) ctx.fillText(line, x, y);
    }

    function renderResult(host, entry, context) {
        const { t } = i18n();
        host.innerHTML = resultMarkup(entry, context);
        const status = host.querySelector('#daily-status');
        const copyBtn = host.querySelector('#daily-copy');
        const retakeBtn = host.querySelector('#daily-retake');
        const shareBtn = host.querySelector('#daily-share');

        copyBtn && copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(shareText(entry));
                if (status) status.textContent = t('dailyCopied');
            } catch (_) {
                if (status) status.textContent = shareText(entry);
            }
        });

        retakeBtn && retakeBtn.addEventListener('click', () => {
            renderQuestion(host, { step: 0, answers: {} }, context);
        });

        shareBtn && shareBtn.addEventListener('click', async () => {
            const text = shareText(entry);
            try {
                const canvas = buildShareCanvas(entry);
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.92));
                const file = blob ? new File([blob], 'meowbti-daily-weather.png', { type: 'image/png' }) : null;
                if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: 'MeowBTI', text });
                    if (status) status.textContent = t('sharedThanks');
                    return;
                }
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'meowbti-daily-weather.png';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(() => URL.revokeObjectURL(url), 4000);
                    if (status) status.textContent = t('savedToDownloads');
                    return;
                }
            } catch (_) {}
            try {
                await navigator.clipboard.writeText(text);
                if (status) status.textContent = t('dailyCopied');
            } catch (_) {
                if (status) status.textContent = text;
            }
        });
    }

    function renderDailyPage() {
        const host = document.getElementById('daily-app');
        if (!host) return;
        const context = getContext();
        const today = getTodayCheckin();
        if (today) {
            renderResult(host, today, context);
            return;
        }
        renderQuestion(host, { step: 0, answers: {} }, context);
    }

    function renderHomeModule() {
        const host = document.getElementById('daily-weather-home');
        if (!host) return;
        const { t, withLang } = i18n();
        const entry = getTodayCheckin();
        if (entry) {
            host.innerHTML = `
                <div class="dwh-main">
                    ${orbMarkup(entry.result, 'mini')}
                    <div>
                        <span class="dh-badge">${escapeHtml(t('homeDailyWeatherSavedH'))}</span>
                        <h2>${escapeHtml(entry.result.label)}</h2>
                        <p>${escapeHtml(entry.result.forecast)}</p>
                    </div>
                </div>
                <a href="${withLang('daily.html')}" class="cta-button accent">${escapeHtml(t('homeDailyWeatherSavedCta'))}</a>`;
        } else {
            host.innerHTML = `
                <div class="dwh-main">
                    ${orbMarkup(buildResult({ energy: 'steady', social: 'open', texture: 'soft', need: 'clarity' }, null), 'mini')}
                    <div>
                        <span class="dh-badge">${escapeHtml(t('dailyKicker'))}</span>
                        <h2>${escapeHtml(t('homeDailyWeatherH'))}</h2>
                        <p>${escapeHtml(t('homeDailyWeatherSub'))}</p>
                    </div>
                </div>
                <div class="daily-cta-group">
                    <a href="${withLang('daily.html')}" class="cta-button accent">${escapeHtml(t('homeDailyWeatherCta'))}</a>
                    <a href="${withLang('human-quiz.html')}" class="cta-button ghost">${escapeHtml(t('quizModeOwner'))}</a>
                </div>`;
        }
    }

    function boot() {
        renderDailyPage();
        renderHomeModule();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
