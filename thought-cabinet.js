/**
 * MeowBTI Household Emotional Thought Cabinet v1
 * Passive emotional philosophies and collective cognition logic.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    const THOUGHT_TEMPLATES = {
        thBlanketGov: { 
            name: t('thBlanketGov'), 
            trigger: (history) => history.filter(h => h.answers.energy === 'low' && h.answers.social === 'hiding').length > 5 
        },
        thAvoidanceArch: { 
            name: t('thAvoidanceArch'), 
            trigger: (history) => history.filter(h => h.answers.social === 'hiding').length > 8 
        },
        thSoupLabor: { 
            name: t('thSoupLabor'), 
            trigger: (history) => history.filter(h => h.answers.stress === 'overloaded').length > 5 
        },
        thParallelIntimacy: { 
            name: t('thParallelIntimacy'), 
            trigger: (history) => history.length > 10 && history.filter(h => h.answers.social === 'seen').length > 5 
        },
        thQuietBuffer: { 
            name: t('thQuietBuffer'), 
            trigger: (history) => history.filter(h => h.answers.energy === 'low').length > 10 
        },
        thFunctionalMeltdown: { 
            name: t('thFunctionalMeltdown'), 
            trigger: (history) => history.filter(h => h.answers.stress === 'overloaded').length > 8 && history.length > 20 
        }
    };

    function analyzeThoughts() {
        const history = getHistory();
        const cabinet = window.MeowStore.getThoughtCabinet();
        let updated = false;

        for (const [id, template] of Object.entries(THOUGHT_TEMPLATES)) {
            if (!cabinet[id]) {
                if (template.trigger(history)) {
                    window.MeowStore.updateThought(id, { 
                        status: 'DISCOVERED', 
                        progress: 0,
                        discoveredAt: new Date().toISOString()
                    });
                    window.MeowTrack && window.MeowTrack('thought_discovered', { thought_key: id, lang: getLang() });
                    updated = true;
                }
            } else if (cabinet[id].status !== 'INTERNALIZED') {
                // Progress if trigger still holds
                if (template.trigger(history)) {
                    const newProgress = Math.min(100, (cabinet[id].progress || 0) + 10);
                    const newStatus = newProgress === 100 ? 'INTERNALIZED' : 'PROCESSING';
                    window.MeowStore.updateThought(id, { 
                        status: newStatus, 
                        progress: newProgress 
                    });
                    if (newStatus === 'INTERNALIZED') {
                        window.MeowTrack && window.MeowTrack('thought_internalized', { thought_key: id, lang: getLang() });
                    }
                    updated = true;
                }
            }
        }

        // Thought Resonance
        if (cabinet.thBlanketGov?.status === 'INTERNALIZED' && cabinet.thQuietBuffer?.status === 'INTERNALIZED') {
            if (window.MeowTrack) window.MeowTrack('thought_resonance', { resonance_type: 'Soft Infrastructure', lang: getLang() });
        }

        // Contradictory Thoughts
        if (cabinet.thFunctionalMeltdown?.status === 'INTERNALIZED' && cabinet.thQuietBuffer?.status === 'INTERNALIZED') {
            if (window.MeowTrack) window.MeowTrack('contradictory_thought_detected', { thought_a: 'thFunctionalMeltdown', thought_b: 'thQuietBuffer', lang: getLang() });
        }

        return updated;
    }

    function renderCabinet() {
        const host = window.MeowOS ? window.MeowOS.getLayer('identity') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('thought-cabinet-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'thought-cabinet-section';
            container.className = 'thought-cabinet-container animate-fade-in';
            host.append(container);
        }

        analyzeThoughts();
        const cabinet = window.MeowStore.getThoughtCabinet();
        const thoughts = Object.entries(cabinet).filter(([id, data]) => data.status !== 'HIDDEN');

        if (thoughts.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        const internalizedCount = thoughts.filter(([id, data]) => data.status === 'INTERNALIZED').length;
        const dominantIdeo = internalizedCount >= 2 ? t('ideoBlanketColl') : null;
        
        let arcCommentary = null;
        if (window.MeowActiveArc) {
            const arc = window.MeowActiveArc;
            if (arc.key === 'blanket') arcCommentary = "Blanket Civilization remains operational.";
            else if (arc.key === 'loud') arcCommentary = "Emotional infrastructure remains theoretical.";
            else if (arc.key === 'parallel') arcCommentary = "Morale remains acceptable despite the silence.";
            
            if (arcCommentary && window.MeowTrack) {
                window.MeowTrack('worldview_override_triggered', { arc_key: arc.key, module: 'thought_cabinet', lang: getLang() });
            }
        }

        container.innerHTML = `
            <div class="thought-header">
                <h2 class="thought-h2">${t('thoughtTitle')}</h2>
                <p class="wm-intro" style="color:rgba(255,255,255,0.5);">${t('thoughtIntro')}</p>
            </div>

            <div class="thought-grid">
                ${thoughts.map(([id, data]) => {
                    const template = THOUGHT_TEMPLATES[id];
                    if (!template) return '';
                    const isInternalized = data.status === 'INTERNALIZED';
                    return `
                        <div class="thought-card ${isInternalized ? 'internalized' : ''}">
                            <span class="thought-status">${t('thought' + data.status.charAt(0) + data.status.slice(1).toLowerCase())}</span>
                            <div class="thought-name">${template.name}</div>
                            <div class="thought-progress-bar">
                                <div class="thought-progress-fill" style="width: ${data.progress}%"></div>
                            </div>
                            <div class="thought-description">
                                ${isInternalized ? 'This philosophy has become part of the household canon.' : 'The collective subconscious is currently processing this concept.'}
                            </div>
                            <button class="micro-share-icon mini" data-type="thought" data-text="Household Thought Internalized: ${template.name}">📤</button>
                        </div>
                    `;
                }).join('')}
            </div>

            ${arcCommentary ? `
                <div class="passive-commentary animate-fade-in" style="border-color:#9B59B6;">
                    "${arcCommentary}"
                </div>
            ` : (dominantIdeo ? `
                <div class="passive-commentary animate-fade-in">
                    "${t('commTheoryRelevant')}"
                </div>
            ` : '')}
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'thought_cabinet',
                        content_type: 'thought_internalized',
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCabinet);
    } else {
        renderCabinet();
    }

    window.addEventListener('meow:daily:updated', renderCabinet);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderCabinet();
    });
})();
