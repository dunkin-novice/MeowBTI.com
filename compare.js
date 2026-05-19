/**
 * MeowBTI Deep Comparison Tool v1
 * Allows manual input of types to see relationship dynamics.
 */
(function() {
    if (!window.MeowI18n || !window.MeowArchetypes || !window.MeowCompatibility) return;

    const { t, getLang, withLang } = window.MeowI18n;
    
    const state = {
        a: { framework: 'cat', type: null },
        b: { framework: 'cat', type: null }
    };

    function init() {
        setupSelector('a');
        setupSelector('b');
        
        // Check URL params for initial state (e.g. ?a=INTJ&af=mbti&b=ENFP&bf=mbti)
        const params = new URLSearchParams(window.location.search);
        if (params.get('a')) {
            state.a.type = params.get('a').toUpperCase();
            state.a.framework = params.get('af') || 'cat';
        }
        if (params.get('b')) {
            state.b.type = params.get('b').toUpperCase();
            state.b.framework = params.get('bf') || 'cat';
        }

        renderSelector('a');
        renderSelector('b');
        if (state.a.type && state.b.type) calculate();
        
        window.MeowTrack && window.MeowTrack('comparison_view', { lang: getLang() });
        window.MeowTrack && window.MeowTrack('comparison_start', { lang: getLang() });
    }

    function setupSelector(id) {
        const fwSelect = document.getElementById(`framework-${id}`);
        fwSelect.onchange = (e) => {
            state[id].framework = e.target.value;
            state[id].type = null; // reset type on framework change
            renderSelector(id);
            calculate();
        };
    }

    function renderSelector(id) {
        const container = document.getElementById(`types-${id}`);
        const fw = state[id].framework;
        const lang = getLang();

        let options = [];
        if (fw === 'cat') {
            options = window.MeowArchetypes.all.map(a => ({
                code: a.code,
                name: lang === 'th' ? a.nameTh : a.name
            }));
        } else if (fw === 'mbti') {
            const mapping = window.MeowMBTIContent.MAPPING;
            options = Object.keys(mapping).map(code => ({
                code: code,
                name: lang === 'th' ? mapping[code].nameTh : mapping[code].name
            }));
        } else if (fw === 'enneagram') {
            const types = window.MeowEnneaContent.TYPES;
            options = Object.keys(types).map(num => ({
                code: num,
                name: lang === 'th' ? types[num].nameTh : types[num].name
            }));
        }

        container.innerHTML = `
            <select class="type-select" id="select-type-${id}">
                <option value="" disabled ${!state[id].type ? 'selected' : ''}>${t('compareChoose')}</option>
                ${options.map(o => `
                    <option value="${o.code}" ${state[id].type === o.code ? 'selected' : ''}>${o.code} - ${o.name}</option>
                `).join('')}
            </select>
        `;

        document.getElementById(`select-type-${id}`).onchange = (e) => {
            state[id].type = e.target.value;
            updateDisplay(id);
            calculate();
        };

        updateDisplay(id);
    }

    function updateDisplay(id) {
        const display = document.getElementById(`display-${id}`);
        const { framework, type } = state[id];
        
        if (!type) {
            display.innerHTML = `<div class="empty-placeholder">${t(`compareEmpty${id.toUpperCase()}`)}</div>`;
            return;
        }

        let archetypeName = '';
        let code = '';
        let emoji = '😼';
        let bg = '#fff';

        if (framework === 'cat') {
            const a = window.MeowArchetypes.get(type);
            archetypeName = getLang() === 'th' ? a.nameTh : a.name;
            code = a.code;
            emoji = a.emoji;
            bg = a.bg;
        } else if (framework === 'mbti') {
            const m = window.MeowMBTIContent.MAPPING[type];
            const a = window.MeowArchetypes.get(m.meow);
            archetypeName = getLang() === 'th' ? m.nameTh : m.name;
            code = type;
            emoji = a.emoji;
            bg = a.bg;
        } else if (framework === 'enneagram') {
            const e = window.MeowEnneaContent.TYPES[type];
            const a = window.MeowArchetypes.get(e.bridge.code);
            archetypeName = getLang() === 'th' ? e.nameTh : e.name;
            code = `Type ${type}`;
            emoji = a.emoji;
            bg = a.bg;
        }

        display.innerHTML = `
            <div class="identity-badge" style="background:${bg}">
                <div class="ib-emoji">${emoji}</div>
                <div class="ib-info">
                    <div class="ib-code">${code}</div>
                    <div class="ib-name">${archetypeName}</div>
                </div>
            </div>
        `;
    }

    function getMeowCode(fw, type) {
        if (fw === 'cat') return type;
        if (fw === 'mbti') return window.MeowMBTIContent.MAPPING[type].meow;
        if (fw === 'enneagram') return window.MeowEnneaContent.TYPES[type].bridge.code;
        return null;
    }

    function getDuoObs(key, index) {
        const obs = [
            t('duoObsSideQuest'),
            t('duoObsArgument'),
            t('duoObsEscape'),
            t('warnNoLogic'),
            t('warnHighTension'),
            t('warnProductive'),
            t('obsScream'),
            t('obsMainChar')
        ];
        
        // Simple deterministic selection based on key and index
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) - hash) + key.charCodeAt(i);
        }
        const idx = Math.abs(hash + index) % obs.length;
        return obs[idx];
    }

    function calculate() {
        const resContainer = document.getElementById('compare-result');
        if (!state.a.type || !state.b.type) {
            resContainer.style.display = 'none';
            return;
        }

        const codeA = getMeowCode(state.a.framework, state.a.type);
        const codeB = getMeowCode(state.b.framework, state.b.type);

        const archA = window.MeowArchetypes.get(codeA);
        const archB = window.MeowArchetypes.get(codeB);

        const dynamic = window.MeowCompatibility.getDuoDynamic(archA, archB);
        const comp = window.MeowCompatibility.compare(archA, archB);

        resContainer.style.display = 'block';
        resContainer.innerHTML = `
            <div class="relationship-spotlight animate-fade-in">
                <div class="rs-header">
                    <span class="dh-badge">${t('compareResultH')}</span>
                    <h2 class="rs-title">${dynamic.title}</h2>
                    <p class="rs-desc">${dynamic.desc}</p>
                </div>
                
                <div class="rs-stats" style="margin-top:40px;">
                    <div class="rs-stat">
                        <span class="rs-stat-label">${t('statsChaos')}</span>
                        <div class="chaos-meter-v2">
                            <div class="cm-fill" style="width:${dynamic.chaosLevel}%"></div>
                        </div>
                        <span class="rs-stat-value">${dynamic.chaosLevel}%</span>
                    </div>
                    <div class="rs-stat">
                        <span class="rs-stat-label">${t('compatSurvival')}</span>
                        <span class="rs-stat-value">${comp.score}%</span>
                    </div>
                </div>

                <div class="rs-modules-grid">
                    <div class="rs-module-card">
                        <h4 class="rs-stat-label">${t('chemTitle')}</h4>
                        <div class="rs-module-val">${dynamic.modules.chemistry}</div>
                    </div>
                    <div class="rs-module-card">
                        <h4 class="rs-stat-label">${t('drainTitle')}</h4>
                        <div class="rs-module-val">${dynamic.modules.drain}</div>
                    </div>
                    <div class="rs-module-card">
                        <h4 class="rs-stat-label">${t('confTitle')}</h4>
                        <div class="rs-module-val">${dynamic.modules.conflict}</div>
                    </div>
                    <div class="rs-module-card">
                        <h4 class="rs-stat-label">${t('recTitle')}</h4>
                        <div class="rs-module-val">${dynamic.modules.recovery}</div>
                    </div>
                </div>

                <div class="duo-observations" style="margin-top:48px; border-top: 1px solid var(--line-soft); padding-top: 32px; text-align: left;">
                    <h3 class="module-h" style="margin-bottom:24px;">Duo Observations</h3>
                    <div style="display:grid; gap:12px;">
                        <div class="obs-row" style="display:flex; gap:12px; align-items:flex-start;">
                            <span style="font-size:1.5rem;">🎯</span>
                            <p style="margin:0; font-size:1rem; opacity:0.8;">${getDuoObs(dynamic.key, 0)}</p>
                        </div>
                        <div class="obs-row" style="display:flex; gap:12px; align-items:flex-start;">
                            <span style="font-size:1.5rem;">⚠️</span>
                            <p style="margin:0; font-size:1rem; opacity:0.8;">${getDuoObs(dynamic.key, 1)}</p>
                        </div>
                    </div>
                </div>

                <div class="compare-actions" style="margin-top:40px;">
                    <button class="big-btn accent" id="btn-share-comparison">
                        <span>📤</span> ${t('compareShareDuo')}
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btn-share-comparison').onclick = () => {
            const shareText = `${state.a.type} + ${state.b.type}: ${dynamic.title}. ${dynamic.desc}`;
            if (window.MeowAnalytics) {
                window.MeowAnalytics.microShare({
                    framework: 'comparison',
                    content_type: 'duo_dynamic',
                    text: shareText
                });
                window.MeowTrack && window.MeowTrack('comparison_share_attempt', {
                    type_a: state.a.type,
                    type_b: state.b.type,
                    framework_a: state.a.framework,
                    framework_b: state.b.framework,
                    dynamic_key: dynamic.key,
                    lang: getLang()
                });
            }
        };

        window.MeowTrack && window.MeowTrack('comparison_complete', {
            type_a: state.a.type,
            type_b: state.b.type,
            framework_a: state.a.framework,
            framework_b: state.b.framework,
            dynamic_key: dynamic.key,
            lang: getLang()
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
