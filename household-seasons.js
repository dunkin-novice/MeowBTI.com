/**
 * MeowBTI Household Transformation Seasons & Evolution Arcs v1
 * Models long-term emotional evolution and character development of the house.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function detectSeason(history) {
        if (history.length < 10) return { key: 'seaAccidentalHealing', title: t('seaAccidentalHealing') };

        const recent = history.slice(0, 30);
        const stressAvg = recent.reduce((acc, h) => acc + (h.answers.stress === 'overloaded' ? 2 : (h.answers.stress === 'unstable' ? 1 : 0)), 0) / recent.length;
        const lowEnergyCount = recent.filter(h => h.answers.energy === 'low').length;
        const parallelPlayCount = recent.filter(h => h.answers.social === 'hiding').length;

        if (stressAvg > 1.2) return { key: 'seaLoudSaga', title: t('seaLoudSaga') };
        if (lowEnergyCount > recent.length * 0.6) return { key: 'seaFunctionalHaunted', title: t('seaFunctionalHaunted') };
        if (parallelPlayCount > recent.length * 0.5) return { key: 'seaParallelPlay', title: t('seaParallelPlay') };
        if (stressAvg < 0.4) return { key: 'seaQuietRebuilding', title: t('seaQuietRebuilding') };
        
        return { key: 'seaSoftRecovery', title: t('seaSoftRecovery') };
    }

    function detectArc(history) {
        if (history.length < 5) return t('arcStabilizing');

        const today = history.slice(0, 5);
        const previous = history.slice(5, 10);

        const getStress = (list) => list.reduce((acc, h) => acc + (h.answers.stress === 'overloaded' ? 2 : 0), 0);
        
        const todayStress = getStress(today);
        const prevStress = getStress(previous);

        if (todayStress < prevStress - 2) return t('arcSurvivalToRecovery');
        if (todayStress > prevStress + 2) return t('arcVolatilitySoftening'); // Paradoxical wording per instructions
        
        return t('arcStabilizing');
    }

    function detectDrift(history) {
        if (history.length < 15) return null;
        
        const recent = history.slice(0, 7);
        const older = history.slice(7, 21);

        const recentQuiet = recent.filter(h => h.answers.social === 'hiding').length / recent.length;
        const olderQuiet = older.filter(h => h.answers.social === 'hiding').length / older.length;

        if (recentQuiet > olderQuiet + 0.3) return t('driftQuieter');
        
        const recentRecovery = recent.filter(h => h.answers.stress === 'calm').length / recent.length;
        const olderRecovery = older.filter(h => h.answers.stress === 'calm').length / older.length;

        if (recentRecovery > olderRecovery + 0.2) return t('driftImproving');
        
        return t('driftBuffering');
    }

    function renderSeasons() {
        const host = document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-seasons-system');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-seasons-system';
            container.className = 'seasons-container animate-fade-in';
            // Insert after climate map or before lore
            const lore = document.getElementById('household-lore-system');
            if (lore) lore.before(container);
            else host.append(container);
        }

        const history = getHistory();
        const season = detectSeason(history);
        const arc = detectArc(history);
        const drift = detectDrift(history);

        container.innerHTML = `
            <div class="season-card">
                <span class="season-label">${t('seasonTitle')}</span>
                <h2 class="season-name">${season.title}</h2>
                <p class="season-arc">${arc}</p>

                <div class="evolution-modules">
                    <div class="evo-card">
                        <span class="evo-label">Current Evolution</span>
                        <div class="evo-text">${t('idSideways')}</div>
                        <button class="micro-share-icon mini" data-type="season" data-text="Household Identity: ${season.title}. Current Arc: ${arc}">📤</button>
                    </div>
                    ${drift ? `
                        <div class="evo-card">
                            <span class="evo-label">Recent Drift</span>
                            <div class="evo-text">${drift}</div>
                        </div>
                    ` : ''}
                </div>

                ${history.length > 20 && season.key === 'seaQuietRebuilding' ? `
                    <div class="rebirth-moment">
                        <span>🌱</span>
                        <span>The Emotionally Loud Saga officially ended. A new era begins.</span>
                    </div>
                ` : ''}
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_seasons',
                        content_type: 'seasonal_identity',
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        window.MeowTrack && window.MeowTrack('season_detected', {
            season_type: season.key,
            profile_count: profiles.length,
            lang: getLang()
        });
    }

    window.MeowSeasons = {
        detectSeason,
        detectArc
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSeasons);
    } else {
        renderSeasons();
    }

    window.addEventListener('meow:daily:updated', renderSeasons);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderSeasons();
    });
})();
