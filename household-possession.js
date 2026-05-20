/**
 * MeowBTI Household Emotional Possession Arcs v1
 * Manages rare, multi-day atmospheric takeovers and worldview overrides.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    const ARC_DEFINITIONS = {
        blanket: {
            title: t('arcBlanketTitle'),
            filterClass: 'filter-blanket',
            trigger: (history) => {
                const recent = history.slice(0, 10);
                return recent.filter(h => h.answers.energy === 'low').length > 7;
            },
            days: [t('arcBlanketDay1'), t('arcBlanketDay2'), t('arcBlanketDay3')],
            fallout: t('arcFalloutBlanket')
        },
        loud: {
            title: t('arcLoudTitle'),
            filterClass: 'filter-loud',
            trigger: (history) => {
                const recent = history.slice(0, 10);
                return recent.filter(h => h.answers.stress === 'overloaded').length > 6;
            },
            days: [t('arcLoudDay1'), t('arcLoudDay2'), t('arcLoudDay3')],
            fallout: t('arcFalloutLoud')
        },
        parallel: {
            title: t('arcParallelTitle'),
            filterClass: 'filter-parallel',
            trigger: (history) => {
                const recent = history.slice(0, 10);
                return recent.filter(h => h.answers.social === 'hiding').length > 7;
            },
            days: [t('arcParallelDay1'), t('arcParallelDay2'), t('arcParallelDay3')],
            fallout: t('arcFalloutParallel')
        }
    };

    function processArcEngine() {
        const history = getHistory();
        let active = window.MeowStore.getActiveArc();
        const today = new Date().toISOString().split('T')[0];

        if (active) {
            // Already active, check progression
            if (active.lastProcessedDate !== today) {
                active.day++;
                active.lastProcessedDate = today;
                
                if (active.day > 3) {
                    // Arc complete
                    window.MeowTrack && window.MeowTrack('possession_arc_completed', { arc_key: active.key, lang: getLang() });
                    
                    // Generate Fallout Lore
                    if (window.MeowStore.saveForgedRelic) {
                         const falloutRelic = {
                             id: `fallout_${active.key}_${active.startDate}`,
                             icon: '🕳️',
                             name: `Residue: ${def.title}`,
                             dedicatedTo: def.fallout,
                             isFusion: true, // Marker for lore rendering
                             forgedAt: new Date().toISOString()
                         };
                         window.MeowStore.saveForgedRelic(falloutRelic);
                         window.MeowTrack && window.MeowTrack('arc_fallout_generated', { arc_key: active.key, lang: getLang() });
                    }

                    active = null;
                } else {
                    window.MeowTrack && window.MeowTrack('possession_arc_progressed', { arc_key: active.key, day: active.day, lang: getLang() });
                }
                window.MeowStore.updateActiveArc(active);
            }
        } else {
            // No active arc, check for new trigger
            // 5% chance to even check for triggers (rare)
            if (Math.random() < 0.05 || history.length === 10) { // history.length check for testing
                for (const [key, def] of Object.entries(ARC_DEFINITIONS)) {
                    if (def.trigger(history)) {
                        active = {
                            key,
                            day: 1,
                            startDate: today,
                            lastProcessedDate: today
                        };
                        window.MeowStore.updateActiveArc(active);
                        window.MeowTrack && window.MeowTrack('possession_arc_started', { arc_key: key, lang: getLang() });
                        break;
                    }
                }
            }
        }
        return active;
    }

    function renderPossession() {
        const host = document.getElementById('family-content');
        if (!host) return;

        const active = processArcEngine();
        
        // Remove existing filter
        let filter = document.getElementById('possession-reality-filter');
        if (filter) filter.remove();

        if (!active) return;

        const def = ARC_DEFINITIONS[active.key];
        
        // Add Reality Filter
        filter = document.createElement('div');
        filter.id = 'possession-reality-filter';
        filter.className = `possession-reality-filter active ${def.filterClass}`;
        document.body.append(filter);

        let container = document.getElementById('possession-arc-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'possession-arc-section';
            host.prepend(container);
        }

        container.innerHTML = `
            <div class="possession-banner">
                <span>🪄</span>
                <span>${t('arcPossessionTitle')}: ${def.title}</span>
            </div>
            
            <div class="arc-card animate-fade-in">
                <span class="arc-day-label">PHASE ${active.day} / 3</span>
                <h2 class="arc-name">${def.title}</h2>
                <p class="arc-desc">${def.days[active.day - 1]}</p>
                <button class="micro-share-icon mini" data-type="possession" data-text="Possession Arc Active: ${def.title}. Phase ${active.day}.">📤</button>
            </div>
        `;

        container.querySelector('.micro-share-icon').onclick = () => {
            if (window.MeowAnalytics) {
                window.MeowAnalytics.microShare({
                    framework: 'household_possession',
                    content_type: 'arc_status',
                    text: `Household Possession Arc: ${def.title}. Day ${active.day}.`,
                    route: '/'
                });
            }
        };

        // Worldview Override Trigger for other scripts
        window.MeowActiveArc = {
            key: active.key,
            day: active.day,
            def: def
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderPossession);
    } else {
        renderPossession();
    }

    window.addEventListener('meow:daily:updated', renderPossession);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderPossession();
    });
})();
