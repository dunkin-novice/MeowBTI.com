/**
 * MeowBTI Emotional Memory System v1
 * Analyzes multi-day history to detect eras, turning points, and recurring patterns.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function getEra(history) {
        if (history.length < 5) return { key: 'stable', title: t('eraStable') };

        const recent = history.slice(0, 15);
        const stressCount = recent.filter(h => h.answers.stress === 'overloaded').length;
        const lowEnergyCount = recent.filter(h => h.answers.energy === 'low').length;
        const socialHidingCount = recent.filter(h => h.answers.social === 'hiding').length;

        if (socialHidingCount > recent.length * 0.6) return { key: 'isolation', title: t('eraIsolation') };
        if (stressCount > recent.length * 0.5) return { key: 'loud', title: t('eraLoud') };
        if (lowEnergyCount > recent.length * 0.5) return { key: 'tired', title: t('eraTired') };
        
        return { key: 'stable', title: t('eraStable') };
    }

    function getMoments(history) {
        const moments = [];
        const days = [...new Set(history.map(h => h.date))].sort().reverse().slice(0, 7);

        days.forEach(date => {
            const dayCheckins = history.filter(h => h.date === date);
            const stressLevel = dayCheckins.filter(c => c.answers.stress === 'overloaded').length / dayCheckins.length;
            
            if (stressLevel > 0.6) {
                moments.push({
                    date,
                    title: t('memLoudestDay'),
                    desc: t('climateLoudDesc')
                });
            } else if (stressLevel === 0 && dayCheckins.length > 1) {
                moments.push({
                    date,
                    title: t('memCollectivePeace'),
                    desc: t('climateCalmDesc')
                });
            }
        });

        return moments;
    }

    function getMemoryCards(history) {
        const cards = [];
        const recent = history.slice(0, 20);
        
        // 1. Recharge check
        const lowEnergy = recent.filter(h => h.answers.energy === 'low').length;
        if (lowEnergy > recent.length * 0.7) {
            cards.push({ label: t('memoryEras'), text: t('memNoRecharge') });
        }

        // 2. Side quest check (proxy for chaotic energy spikes)
        const chaosEnergy = recent.filter(h => h.answers.energy === 'high' && h.answers.stress === 'unstable').length;
        if (chaosEnergy > recent.length * 0.3) {
            cards.push({ label: t('memoryTitle'), text: t('memSideQuestSpike') });
        }

        // Default if empty
        if (cards.length === 0) {
            cards.push({ label: t('memoryTitle'), text: t('climateCalmDesc') });
        }

        return cards;
    }

    function getPattern(history) {
        if (history.length < 10) return null;
        
        const recent = history.slice(0, 14);
        const overloadDays = recent.filter(h => h.answers.stress === 'overloaded');
        
        // Midweek spike check (Tue, Wed, Thu)
        const midweekOverload = overloadDays.filter(h => {
            const day = new Date(h.date).getDay();
            return day >= 2 && day <= 4;
        }).length;

        if (midweekOverload > overloadDays.length * 0.7 && overloadDays.length > 2) {
            return { label: t('memoryTimeline'), text: t('memSideQuestSpike') };
        }
        return null;
    }

    function getTurningPoints(history) {
        if (history.length < 3) return [];
        const points = [];
        
        const today = history.filter(h => h.date === new Date().toISOString().split('T')[0]);
        const yesterday = history.filter(h => h.date === new Date(Date.now() - 86400000).toISOString().split('T')[0]);

        const getStressAvg = (list) => list.length === 0 ? 0 : list.reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 2 : 0), 0) / list.length;
        
        if (getStressAvg(today) < 0.5 && getStressAvg(yesterday) > 1.5) {
            points.push({ title: t('tpStabilized'), emoji: '🌈' });
        }
        if (getStressAvg(today) > 1.5 && getStressAvg(yesterday) < 0.5) {
            points.push({ title: t('tpChaosSurge'), emoji: '🌋' });
        }

        return points;
    }

    function renderMemory() {
        const host = document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('emotional-memory-system');
        if (!container) {
            container = document.createElement('div');
            container.id = 'emotional-memory-system';
            container.className = 'memory-system-container animate-fade-in';
            host.append(container);
        }

        const history = getHistory();
        const era = getEra(history);
        const moments = getMoments(history);
        const cards = getMemoryCards(history);
        const turningPoints = getTurningPoints(history);
        const pattern = getPattern(history);

        if (pattern) cards.push(pattern);

        container.innerHTML = `
            <div class="memory-header">
                <span class="era-badge">${era.title}</span>
                <h2 class="memory-h2">${t('memoryTitle')}</h2>
            </div>

            <div class="timeline-scroll">
                ${turningPoints.map(tp => `
                    <div class="timeline-moment" style="border-style:dashed; background:var(--bg);">
                        <span class="moment-date">TODAY</span>
                        <div class="moment-title">${tp.emoji} ${tp.title}</div>
                        <p class="moment-desc">${t('memoryTimeline')}</p>
                    </div>
                `).join('')}
                ${moments.map(m => `
                    <div class="timeline-moment">
                        <span class="moment-date">${new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <div class="moment-title">${m.title}</div>
                        <p class="moment-desc">${m.desc}</p>
                    </div>
                `).join('')}
            </div>

            <div class="memory-cards-grid">
                ${cards.map(c => `
                    <div class="memory-card">
                        <button class="micro-share-icon mini" data-type="memory" data-text="${c.text}">📤</button>
                        <span class="memory-card-label">${c.label}</span>
                        <p class="memory-card-text">${c.text}</p>
                    </div>
                `).join('')}
            </div>
        `;

        if (turningPoints.length > 0 && window.MeowTrack) {
            window.MeowTrack('turning_point_detected', { 
                type: turningPoints[0].title,
                lang: getLang()
            });
        }

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'emotional_memory',
                        content_type: 'memory_card',
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        window.MeowTrack && window.MeowTrack('timeline_view', {
            era_type: era.key,
            profile_count: profiles.length,
            lang: getLang()
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMemory);
    } else {
        renderMemory();
    }

    window.addEventListener('meow:daily:updated', renderMemory);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderMemory();
    });
})();
