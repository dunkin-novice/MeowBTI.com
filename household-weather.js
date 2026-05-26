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

    function getMomentum(history) {
        if (history.length < 2) return { key: 'stabilizing', title: t('momStabilizing') };
        
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const todayCheckins = history.filter(h => h.date === todayStr);
        const yesterdayCheckins = history.filter(h => h.date === yesterdayStr);

        const getStressScore = (list) => {
            if (list.length === 0) return 0;
            return list.reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 2 : (c.answers.stress === 'unstable' ? 1 : 0)), 0) / list.length;
        };

        const todayScore = getStressScore(todayCheckins);
        const yesterdayScore = getStressScore(yesterdayCheckins);

        if (todayScore > yesterdayScore + 0.5) return { key: 'escalating', title: t('momEscalating') };
        if (todayScore < yesterdayScore - 0.5) return { key: 'recovering', title: t('momRecovering') };
        if (todayScore > 1.5) return { key: 'fragile', title: t('momFragile') };
        
        return { key: 'stabilizing', title: t('momStabilizing') };
    }

    function renderForecast(profiles, history) {
        const momentum = getMomentum(history);
        const climate = getCollectiveClimate(profiles, history);
        
        let tmrKey = 'Calm';
        if (momentum.key === 'escalating') tmrKey = 'Loud';
        else if (climate.key === 'heavy' || momentum.key === 'recovering') tmrKey = 'Calm';
        else if (climate.key === 'unstable') tmrKey = 'Chaos';
        else if (profiles.some(p => {
            const c = window.MeowDaily.getTodayCheckin(p.id);
            return c && c.answers.stress === 'overloaded';
        })) tmrKey = 'Loud';

        let tmrTitle = t(`tmr${tmrKey}Title`);
        let tmrDesc = t(`tmr${tmrKey}Desc`);

        if (window.MeowActiveArc) {
            const arc = window.MeowActiveArc;
            if (arc.key === 'blanket') {
                tmrTitle = "Horizontal Stability";
                tmrDesc = "The atmosphere has become spiritually horizontal. High probability of nesting.";
            } else if (arc.key === 'loud') {
                tmrTitle = "Chaotic Resonance";
                tmrDesc = "Everything feels slightly flammable. Standard domestic logic is failing.";
            } else if (arc.key === 'parallel') {
                tmrTitle = "Deep Silence";
                tmrDesc = "Synchronized recovery fields are stable. No verbal interaction required.";
            }
            if (window.MeowTrack) {
                window.MeowTrack('worldview_override_triggered', { arc_key: arc.key, module: 'weather_map', lang: getLang() });
            }
        }

        const omen = window.MeowMuseum ? window.MeowMuseum.getApparition('forecast') : null;
        if (omen && window.MeowTrack) {
            window.MeowTrack('forecast_omen', { relic_key: omen.relic.id, lang: getLang() });
        }

        return `
            <div class="forecast-container animate-fade-in">
                <div class="fc-header">
                    <h3 class="fc-title">${t('forecastTitle')}</h3>
                    <div class="fc-momentum">
                        <span class="rs-stat-label" style="margin-right:8px;">${t('forecastMomentum')}</span>
                        <span class="fc-momentum-chip ${momentum.key}">${momentum.title}</span>
                    </div>
                </div>

                <div class="fc-tmr-card">
                    <span class="fc-tmr-label">${t('forecastTomorrow')}</span>
                    <h4 class="fc-tmr-title">${tmrTitle}</h4>
                    <p class="fc-tmr-desc">${tmrDesc}</p>
                </div>

                ${omen ? `
                    <div class="apparition-card animate-fade-in">
                        <span class="apparition-header">Relic Omen</span>
                        <div class="apparition-text">${omen.text}</div>
                        <button class="micro-share-icon mini" data-type="apparition" data-text="Omen: ${omen.text}">📤</button>
                    </div>
                ` : ''}

                <div class="fc-alerts-grid">
                    ${getPressureAlerts(profiles, history).map(alert => `
                        <div class="fc-alert-item">
                            <span>🚨</span>
                            <span>${alert}</span>
                            <button class="micro-share-icon mini" data-type="forecast_alert" data-text="Household Alert: ${alert}">📤</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function getPressureAlerts(profiles, history) {
        const alerts = [];
        const checkins = profiles.map(p => window.MeowDaily.getTodayCheckin(p.id)).filter(c => c);
        
        // 1. Stress Absorber
        const overloaded = checkins.filter(c => c.answers.stress === 'overloaded');
        const calm = checkins.filter(c => c.answers.stress === 'calm');
        if (overloaded.length === 1 && calm.length > 2) {
            alerts.push(t('alertAbsorbing'));
        }

        // 2. Leaderless
        if (checkins.length > 0 && !checkins.some(c => c.answers.stress === 'calm' && c.answers.energy === 'high')) {
            alerts.push(t('alertLeaderless'));
        }

        // 3. Coordination warning
        if (overloaded.length > profiles.length / 2) {
            alerts.push(t('weatherDuoBurnout'));
        }

        if (alerts.length === 0) {
            alerts.push("Atmospheric stability maintained. No immediate threats detected.");
        }

        return alerts.slice(0, 2);
    }

    function renderMap() {
        const host = window.MeowOS ? window.MeowOS.getLayer('snapshot') : document.getElementById('family-content');
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
        const possession = window.MeowMuseum ? window.MeowMuseum.getApparition('possession') : null;

        // Timeline data...
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

        // Recovery & Stabilizer...
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
            ${possession ? `
                <div class="apparition-card animate-fade-in" style="margin-bottom:24px; border-style:double; border-width:3px;">
                    <span class="apparition-header">Spiritual Possession Detected</span>
                    <div class="apparition-text" style="font-size:1.1rem; font-weight:800;">${possession.text}</div>
                    <button class="micro-share-icon mini" data-type="possession" data-text="Possession: ${possession.text}">📤</button>
                </div>
            ` : ''}

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

            ${renderForecast(profiles, history)}

            <div class="wm-grid" style="margin-top:32px;">
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
                ${(function() {
                    const omen = window.MeowMuseum ? window.MeowMuseum.getApparition('relationship') : null;
                    if (!omen) return '';
                    return `
                        <div class="apparition-card animate-fade-in" style="margin-top:0;">
                            <span class="apparition-header">Relic Omen</span>
                            <div class="apparition-text">${omen.text}</div>
                            <button class="micro-share-icon mini" data-type="apparition" data-text="Relationship Omen: ${omen.text}">📤</button>
                        </div>
                    `;
                })()}
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
        if (window.MeowTrack) {
            window.MeowTrack('household_weather_view', {
                profile_count: profiles.length,
                climate_type: climate.key,
                volatility_level: overloaded.length,
                lang: getLang()
            });

            if (possession) window.MeowTrack('possession_event', { relic_key: possession.relic.id, lang: getLang() });
            
            const relOmen = window.MeowMuseum ? window.MeowMuseum.getApparition('relationship') : null;
            if (relOmen) window.MeowTrack('relationship_omen', { relic_key: relOmen.relic.id, lang: getLang() });
        }
    }

    window.MeowClimate = {
        getCollectiveClimate,
        getMomentum,
        getSocialDistribution,
        getPressureAlerts
    };

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
