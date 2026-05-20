/**
 * MeowBTI Household Emotional Relics & Trophy Room v1
 * Generates symbolic collectible objects and mythology from history.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function generateRelics(history, profiles) {
        const relics = [];
        if (history.length < 3) return relics;

        const recent = history.slice(0, 30);
        const stressAvg = recent.reduce((acc, h) => acc + (h.answers.stress === 'overloaded' ? 2 : 0), 0) / recent.length;
        const lowEnergyCount = recent.filter(h => h.answers.energy === 'low').length;

        // 1. Blanket of Reconstruction
        if (lowEnergyCount > recent.length * 0.4) {
            relics.push({ id: 'relBlanket', icon: '🛌', name: t('relBlanket') });
        }

        // 2. Mug of Survival
        if (stressAvg > 0.8) {
            relics.push({ id: 'relMug', icon: '☕', name: t('relMug') });
        }

        // 3. Couch of Parallel Play
        const quietCount = recent.filter(h => h.answers.social === 'hiding').length;
        if (quietCount > recent.length * 0.3) {
            relics.push({ id: 'relCouch', icon: '🛋️', name: t('relCouch') });
        }

        // 4. Beanbag of Rotting
        if (lowEnergyCount > recent.length * 0.6) {
            relics.push({ id: 'relBeanbag', icon: '☁️', name: t('relBeanbag') });
        }

        // 5. Emergency Tuna
        const highEnergyChaos = recent.filter(h => h.answers.energy === 'high' && h.answers.stress === 'unstable').length;
        if (highEnergyChaos > 3) {
            relics.push({ id: 'relTuna', icon: '🐟', name: t('relTuna') });
        }

        // 6. Headphones of Protection
        if (recent.filter(h => h.answers.stress === 'overloaded').length > 5) {
            relics.push({ id: 'relHeadphones', icon: '🎧', name: t('relHeadphones') });
        }

        // 7. DoorDash Receipt
        if (stressAvg > 1.2 && lowEnergyCount > recent.length * 0.5) {
            relics.push({ id: 'relReceipt', icon: '🧾', name: t('relReceipt') });
        }

        // 8. Relationship Relics (Requires 2+ profiles)
        if (profiles.length >= 2) {
            const hasChaos = profiles.some(p => p.code.includes('l'));
            const hasControl = profiles.some(p => p.code.includes('B'));
            if (hasChaos && hasControl) {
                relics.push({ id: 'relSharedDoc', icon: '📄', name: t('relSharedDoc') });
            }
            if (relics.some(r => r.id === 'relBlanket')) {
                relics.push({ id: 'relTreaty', icon: '📜', name: t('relTreaty') });
            }
        }

        return relics.slice(0, 6);
    }

    function generateTrophies(history, profiles) {
        const trophies = [];
        if (history.length < 5) return trophies;

        const days = [...new Set(history.map(h => h.date))].sort().reverse();
        
        // Calm Weekend
        const isCalm = (date) => !history.filter(h => h.date === date).some(c => c.answers.stress === 'overloaded');
        // Simple logic for "last 2 days"
        if (isCalm(days[0]) && isCalm(days[1])) {
            trophies.push({ id: 'troCalmWeekend', icon: '🌅', title: t('troCalmWeekend'), desc: t('climateCalmDesc') });
        }

        // Nervous System Reboot
        const todayStress = history.filter(h => h.date === days[0]).reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 1 : 0), 0);
        const yesterdayStress = history.filter(h => h.date === days[1]).reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 1 : 0), 0);
        if (todayStress === 0 && yesterdayStress > profiles.length / 2) {
            trophies.push({ id: 'troNervousReboot', icon: '🔌', title: t('troNervousReboot'), desc: t('tpStabilized') });
        }

        // Collective Nap Trophy (Everyone had low energy today)
        const todayCheckins = history.filter(h => h.date === days[0]);
        if (todayCheckins.length >= 2 && todayCheckins.every(c => c.answers.energy === 'low')) {
            trophies.push({ id: 'troEveryoneNap', icon: '😴', title: t('troEveryoneNap'), desc: t('seaFunctionalHaunted') });
        }

        return trophies.slice(0, 4);
    }

    function getMyth(history) {
        const myths = [t('mythSnackHealing'), t('mythBlanketIncident'), t('mythChaosAlliance')];
        // Deterministic but feels varied
        const seed = history.length > 0 ? history[0].date : '2026';
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        return myths[Math.abs(hash) % myths.length];
    }

    function renderMuseum() {
        const host = document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-museum-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-museum-section';
            container.className = 'museum-container animate-fade-in';
            host.append(container);
        }

        const history = getHistory();
        const relics = generateRelics(history, profiles);
        const trophies = generateTrophies(history, profiles);
        const myth = getMyth(history);

        if (relics.length === 0 && trophies.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="museum-header">
                <h2 class="museum-h2">${t('museumTitle')}</h2>
                <p class="wm-intro">${t('museumIntro')}</p>
            </div>

            <div class="relic-shelf">
                ${relics.map(r => `
                    <div class="relic-item" onclick="window.MeowAnalytics && window.MeowAnalytics.microShare({framework:'relics', content_type:'artifact', text:'Household Relic Acquired: ${r.name} ${r.icon}', route:'/'})">
                        <div class="relic-visual">${r.icon}</div>
                        <span class="relic-name">${r.name}</span>
                    </div>
                `).join('')}
            </div>

            <div class="trophy-cabinet">
                ${trophies.map(tr => `
                    <div class="trophy-card">
                        <button class="micro-share-icon mini" data-type="trophy" data-text="Trophy Earned: ${tr.title}. ${tr.desc}">📤</button>
                        <div class="trophy-icon">${tr.icon}</div>
                        <div class="trophy-info">
                            <h4 class="trophy-title">${tr.title}</h4>
                            <p class="trophy-desc">${tr.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="myth-scrawl">
                "${myth}"
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_museum',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        window.MeowTrack && window.MeowTrack('museum_view', {
            relic_count: relics.length,
            trophy_count: trophies.length,
            household_density: profiles.length,
            lang: getLang()
        });

        if (window.MeowTrack) {
            relics.forEach(r => window.MeowTrack('relic_unlocked', { relic_type: r.id, lang: getLang() }));
            trophies.forEach(tr => window.MeowTrack('trophy_earned', { trophy_type: tr.id, lang: getLang() }));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMuseum);
    } else {
        renderMuseum();
    }

    window.addEventListener('meow:daily:updated', renderMuseum);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderMuseum();
    });
})();
