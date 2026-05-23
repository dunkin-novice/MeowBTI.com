/**
 * MeowBTI Temporal Engine v1
 * Manages daily atmospheric drift, weekly cycles, return rewards, and absence/decay.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function getSeed() {
        const d = new Date();
        return `${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
    }

    // Deterministic random based on daily seed + string
    function seededRandom(str) {
        let hash = 0;
        const seed = getSeed() + str;
        for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        return Math.abs(hash) / 2147483647;
    }

    function checkReturnReward() {
        const lastVisit = localStorage.getItem('meowbti.last_visit');
        const now = Date.now();
        localStorage.setItem('meowbti.last_visit', now.toString());

        if (!lastVisit) return null;

        const diffDays = Math.floor((now - parseInt(lastVisit, 10)) / 86400000);
        if (diffDays >= 30) return { label: t('tempReturnTitle'), text: t('ret30Days'), days: diffDays };
        if (diffDays >= 7) return { label: t('tempReturnTitle'), text: t('ret7Days'), days: diffDays };
        if (diffDays >= 3) return { label: t('tempReturnTitle'), text: t('ret3Days'), days: diffDays };
        if (diffDays >= 1) return { label: t('tempReturnTitle'), text: t('ret1Day'), days: diffDays };
        
        return null;
    }

    function getDailyDrift() {
        const drifts = ['driftQuieter', 'driftUnstable', 'driftCalmRelics'];
        const idx = Math.floor(seededRandom('drift') * drifts.length);
        return t(drifts[idx]);
    }

    function getWeeklyCycle() {
        const day = new Date().getDay(); // 0-6
        if (day === 0 || day === 6) return { title: t('cycleRecovery'), icon: '🛋️' };
        if (day === 3 || day === 4) return { title: t('cycleLoud'), icon: '📢' };
        return { title: t('cycleSilence'), icon: '🧘' };
    }

    function applyVisualShifts() {
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 6) {
            document.body.classList.add('time-night');
        } else {
            document.body.classList.remove('time-night');
        }
    }

    function renderTemporalSystems() {
        const host = window.MeowOS ? window.MeowOS.getLayer('daily') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('temporal-retention-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'temporal-retention-section';
            // Insert after world events or ecosystem feed
            const eco = document.getElementById('ecosystem-feed-section');
            if (eco) eco.after(container);
            else host.prepend(container);
        }

        const reward = checkReturnReward();
        const history = getHistory();

        // Echo Card Hook for Return
        if (reward && reward.days >= 3) {
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'return_anniv_' + Date.now(),
                type: 'anniversary',
                title: t('tempReturnTitle'),
                lore: reward.text,
                icon: '📬'
            }}));
        }

        // Echo Card Hook for 30 Day Survival
        if (history.length >= 30) {
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'anniv_30_days',
                type: 'anniversary',
                title: '30 Days of Survival',
                lore: t('echoLoreAnniv'),
                icon: '🕰️'
            }}));
        }

        const drift = getDailyDrift();
        const cycle = getWeeklyCycle();

        container.innerHTML = `
            ${reward ? `
                <div class="return-reward-card animate-fade-in">
                    <span class="return-reward-label">${reward.label}</span>
                    <div class="return-reward-text">${reward.text}</div>
                    <button class="micro-share-icon mini" data-type="return" data-text="I returned to my civilization. ${reward.text}">📤</button>
                </div>
            ` : ''}

            <div class="temporal-drift-badge animate-fade-in">
                <span>🕒</span>
                <span>${cycle.title}</span>
                <span style="opacity:0.3; margin:0 4px;">|</span>
                <span>${drift}</span>
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'temporal_systems',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        if (reward && window.MeowTrack) {
            window.MeowTrack('return_after_absence', { days_absent: reward.days, lang: getLang() });
        }
    }

    applyVisualShifts();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderTemporalSystems);
    } else {
        renderTemporalSystems();
    }

    window.addEventListener('meow:daily:updated', renderTemporalSystems);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderTemporalSystems();
    });

})();
