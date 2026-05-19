/**
 * MeowBTI Household Weather Map v1
 * Analyzes collective emotional trends for a household over 7 days.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getCollectiveClimate(profiles, history) {
        if (profiles.length === 0) return null;

        const now = new Date();
        const dateStrs = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dateStrs.push(d.toISOString().split('T')[0]);
        }

        const recentCheckins = history.filter(h => dateStrs.includes(h.date));
        if (recentCheckins.length === 0) return { key: 'calm', title: t('climateCalmTitle'), desc: t('climateCalmDesc'), emoji: '☀️' };

        // Analyze stress and energy
        let totalStress = 0;
        let totalEnergy = 0;
        recentCheckins.forEach(c => {
            if (c.answers.stress === 'overloaded') totalStress += 2;
            else if (c.answers.stress === 'unstable') totalStress += 1;
            
            if (c.answers.energy === 'high') totalEnergy += 1;
        });

        const stressAvg = totalStress / recentCheckins.length;
        const energyAvg = totalEnergy / recentCheckins.length;

        let key = 'calm';
        let emoji = '☀️';
        if (stressAvg > 1 && energyAvg < 0.3) {
            key = 'heavy';
            emoji = '☁️';
        } else if (stressAvg > 1 && energyAvg > 0.6) {
            key = 'loud';
            emoji = '⚡';
        } else if (stressAvg > 0.5) {
            key = 'unstable';
            emoji = '🌪️';
        }

        return {
            key,
            title: t(`climate${key.charAt(0).toUpperCase() + key.slice(1)}Title`),
            desc: t(`climate${key.charAt(0).toUpperCase() + key.slice(1)}Desc`),
            emoji
        };
    }

    function getSocialDistribution(profiles) {
        const checkins = profiles.map(p => window.MeowDaily.getTodayCheckin(p.id)).filter(c => c);
        if (checkins.length === 0) return t('socialStatusAwaiting');

        const hiding = checkins.filter(c => c.answers.social === 'hiding').length;
        const spotlight = checkins.filter(c => c.answers.social === 'spotlight').length;

        if (hiding > checkins.length / 2) return t('socialStatusHiding');
        if (spotlight > 0 && hiding > 0) return t('socialStatusMismatch');
        if (spotlight > checkins.length / 2) return t('socialStatusSpotlight');
        
        return t('socialStatusBalanced');
    }

    function renderMap() {
        const host = document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        // Check if map already exists
        let container = document.getElementById('household-weather-map');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-weather-map';
            container.className = 'weather-map-container';
            // Insert after family header
            const header = host.querySelector('.family-header');
            if (header) header.after(container);
            else host.prepend(container);
        }

        const history = window.MeowDaily.getHistory();
        const climate = getCollectiveClimate(profiles, history);

        // Timeline data
        const now = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const dailyCheckins = history.filter(h => h.date === ds);
            
            let emoji = '⚪';
            if (dailyCheckins.length > 0) {
                const dayStress = dailyCheckins.filter(c => c.answers.stress === 'overloaded').length;
                if (dayStress > dailyCheckins.length / 2) emoji = '🔴';
                else if (dayStress > 0) emoji = '🟡';
                else emoji = '🟢';
            }
            days.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), emoji });
        }

        // Recovery & Stabilizer
        const overloaded = profiles.filter(p => {
            const c = window.MeowDaily.getTodayCheckin(p.id);
            return c && c.answers.stress === 'overloaded';
        });
        const stable = profiles.filter(p => {
            const c = window.MeowDaily.getTodayCheckin(p.id);
            return c && c.answers.stress === 'calm';
        });

        const stabilizer = stable.length > 0 ? stable[0] : null;

        container.innerHTML = `
            <div class="wm-header">
                <h2 class="wm-title">${t('weatherMapTitle')}</h2>
                <p class="wm-intro">${t('weatherMapIntro')}</p>
            </div>

            <div class="climate-spotlight">
                <div class="cs-orb">${climate.emoji}</div>
                <div class="cs-info">
                    <h3 class="cs-title">${climate.title}</h3>
                    <p class="cs-desc">${climate.desc}</p>
                </div>
            </div>

            <div class="weather-timeline">
                ${days.map(d => `
                    <div class="wt-day">
                        <div class="wt-dot">${d.emoji}</div>
                        <span class="wt-label">${d.label}</span>
                    </div>
                `).join('')}
            </div>

            <div class="wm-grid">
                <div class="wm-stat-card">
                    <span class="wm-stat-label">Recovery State</span>
                    <div class="wm-stat-val">
                        ${overloaded.length > 1 ? t('weatherDuoBurnout') : (overloaded.length === 0 ? 'Optimal recovery rituals active.' : t('weatherRecovery'))}
                    </div>
                    <button class="micro-share-icon mini" data-type="climate" data-text="Household Status: ${climate.title}. ${overloaded.length > 1 ? t('weatherDuoBurnout') : ''}">📤</button>
                </div>
                <div class="wm-stat-card">
                    <span class="wm-stat-label">Stabilizer</span>
                    <div class="wm-stat-val">
                        ${stabilizer ? t('weatherStabilizer', stabilizer.name) : t('weatherLeaderless')}
                    </div>
                </div>
                <div class="wm-stat-card">
                    <span class="wm-stat-label">Social Battery Distribution</span>
                    <div class="wm-stat-val">
                        ${getSocialDistribution(profiles)}
                    </div>
                </div>
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_weather',
                        content_type: 'climate_summary',
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        window.MeowTrack && window.MeowTrack('household_weather_view', {
            profile_count: profiles.length,
            climate_type: climate.key,
            volatility_level: overloaded.length,
            lang: getLang()
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMap);
    } else {
        renderMap();
    }

    window.addEventListener('meow:daily:updated', renderMap);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderMap();
    });
})();
