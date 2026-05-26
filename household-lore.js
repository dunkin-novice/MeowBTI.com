/**
 * MeowBTI Household Goal Milestones & Emotional Lore System v1
 * Recognizes and persists symbolic household landmarks.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function calculateMilestones(history, profiles) {
        const milestones = [];
        if (history.length === 0) return milestones;

        const now = new Date();
        const days = [...new Set(history.map(h => h.date))].sort().reverse();
        
        // 1. Stable Week (7 consecutive days of 0 'overloaded' and 0 'unstable')
        let stableStreak = 0;
        for (let ds of days.slice(0, 7)) {
            const dayCheckins = history.filter(h => h.date === ds);
            const isStable = !dayCheckins.some(c => c.answers.stress === 'overloaded' || c.answers.stress === 'unstable');
            if (isStable) stableStreak++;
            else break;
        }
        if (stableStreak >= 7) {
            milestones.push({
                id: 'msStableWeek',
                sticker: '🌈',
                title: t('msStableWeek'),
                desc: t('climateCalmDesc')
            });
        }

        // 2. Functional OS (3+ members checked in today, stress average < 1)
        const today = days[0];
        const todayCheckins = history.filter(h => h.date === today);
        if (todayCheckins.length >= 3) {
            const stressSum = todayCheckins.reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 2 : (c.answers.stress === 'unstable' ? 1 : 0)), 0);
            if (stressSum / todayCheckins.length < 1) {
                milestones.push({
                    id: 'msFunctionalOS',
                    sticker: '⚙️',
                    title: t('msFunctionalOS'),
                    desc: "Optimal collective performance maintained."
                });
            }
        }

        // 3. Era Survivor
        const last14 = history.slice(0, 30); // Approximate
        const loudDays = last14.filter(h => h.answers.stress === 'overloaded').length;
        if (loudDays > 10 && !todayCheckins.some(c => c.answers.stress === 'overloaded')) {
             milestones.push({
                id: 'msEraSurvivor',
                sticker: '🛡️',
                title: t('msEraSurvivor'),
                desc: t('eraEndLoud')
            });
        }

        // 4. Recovery Arc
        const streak = days.slice(0, 3).every(ds => !history.filter(h => h.date === ds).some(c => c.answers.stress === 'overloaded'));
        if (streak && loudDays > 5) {
            milestones.push({
                id: 'eraRecoveryArc',
                sticker: '🌊',
                title: t('eraRecoveryArc'),
                desc: t('eraExitedBunker')
            });
        }

        return milestones;
    }

    function getLore(history, profiles) {
        const lore = [];
        if (history.length < 3) return lore;

        // 1. Blanket Burrito
        const recent = history.slice(0, 20);
        const lowEnergySocialHiding = recent.filter(h => h.answers.energy === 'low' && h.answers.social === 'hiding').length;
        if (lowEnergySocialHiding > recent.length * 0.4) {
            lore.push({ id: 'loreBlanketBurrito', sticker: '🌯', text: t('loreBlanketBurrito') });
        }

        // 2. Stabilizer Recognition
        if (window.MeowClimate && window.MeowClimate.getPressureAlerts) {
            const alerts = window.MeowClimate.getPressureAlerts(profiles, history);
            const stable = profiles.filter(p => {
                const c = window.MeowDaily.getTodayCheckin(p.id);
                return c && c.answers.stress === 'calm';
            });
            if (stable.length === 1 && recent.filter(h => h.answers.stress === 'overloaded').length > 5) {
                lore.push({ id: 'achStabilizer', sticker: '⚖️', text: t('achStabilizer', stable[0].name) });
            }
        }

        // 3. Side Quests
        const sideQuestSpikes = recent.filter(h => h.answers.energy === 'high' && h.answers.stress === 'unstable').length;
        if (sideQuestSpikes > 4) {
            lore.push({ id: 'loreSideQuest', sticker: '🏹', text: t('loreSideQuest') });
        }

        // 4. Relationship Lore
        if (profiles.length >= 2) {
            const codeA = profiles[0].code;
            const codeB = profiles[1].code;
            if (codeA[2] === 'B' && codeB[2] === 'l' || codeB[2] === 'B' && codeA[2] === 'l') {
                lore.push({ id: 'achDuoPermanent', sticker: '📊', text: t('achDuoPermanent') });
            }
        }

        return lore.slice(0, 5);
    }

    function renderLore() {
        const host = window.MeowOS ? window.MeowOS.getLayer('archive') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-lore-system');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-lore-system';
            container.className = 'lore-system-container animate-fade-in';
            // Insert before testimonials or at the end
            host.append(container);
        }

        const history = getHistory();
        const milestones = calculateMilestones(history, profiles);
        const lore = getLore(history, profiles);

        if (milestones.length === 0 && lore.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        container.innerHTML = `
            <div class="lore-header">
                <h2 class="memory-h2">${t('loreTitle')}</h2>
                <p class="wm-intro">${t('loreIntro')}</p>
            </div>

            <div class="milestone-cards-grid">
                ${milestones.map(ms => `
                    <div class="milestone-card">
                        <button class="micro-share-icon mini" data-type="milestone" data-text="Milestone: ${ms.title}. ${ms.desc}">📤</button>
                        <span class="milestone-sticker">${ms.sticker}</span>
                        <div class="milestone-title">${ms.title}</div>
                        <p class="milestone-desc">${ms.desc}</p>
                    </div>
                `).join('')}
            </div>

            ${lore.length > 0 ? `
                <div class="lore-archive-section">
                    <div class="lore-archive-grid">
                        ${lore.map(entry => `
                            <div class="lore-entry">
                                <span class="lore-entry-sticker">${entry.sticker}</span>
                                <div class="lore-entry-text">${entry.text}</div>
                                <button class="micro-share-icon mini" data-type="lore" data-text="Lore: ${entry.text}">📤</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_lore',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        if (milestones.length > 0 && window.MeowTrack) {
            window.MeowTrack('milestone_view', {
                milestone_count: milestones.length,
                profile_count: profiles.length,
                lang: getLang()
            });

            milestones.forEach(ms => {
                if (ms.id === 'eraRecoveryArc') window.MeowTrack('era_completed', { era_type: 'loud', lang: getLang() });
                else window.MeowTrack('recovery_milestone', { milestone_type: ms.id, lang: getLang() });
            });
        }
        if (lore.length > 0 && window.MeowTrack) {
            lore.forEach(entry => {
                window.MeowTrack('lore_event_detected', { lore_id: entry.id, lang: getLang() });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderLore);
    } else {
        renderLore();
    }

    window.addEventListener('meow:daily:updated', renderLore);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderLore();
    });
})();
