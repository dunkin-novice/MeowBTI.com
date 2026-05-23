/**
 * MeowBTI Civilization Decision Engine & Governance Choices v1
 * Manages active emotional policies, crises, referendums, and historical consequences.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    const DECISIONS = [
        {
            id: 'crisis_soup',
            type: 'crisis',
            title: "Soup Infrastructure is collapsing.",
            desc: "The collective reliance on broth has depleted strategic reserves. Executive action is required.",
            trigger: (history, state) => history.filter(h => h.answers.energy === 'low').length > 5 && !state.history.includes('crisis_soup'),
            options: [
                { text: "Enact Emergency Subsidies", hint: "Adds Policy, Costs Stability", policy: 'polSoupSub', trait: 'traitSoupEcon', stability: -10 },
                { text: "Ration Reserves", hint: "Adds Isolationist Alignment", trait: 'traitParallelized', alignment: 'alignIsolationist', stability: 10 },
                { text: "Ignore the Crisis", hint: "Chaos Increases", alignment: 'alignChaotic', stability: -20 }
            ]
        },
        {
            id: 'ref_blanket',
            type: 'referendum',
            title: "Legalize Blanket Governance?",
            desc: "The populace demands formal recognition of horizontal recovery as a protected civil right.",
            trigger: (history, state) => history.filter(h => h.answers.social === 'hiding').length > 5 && !state.history.includes('ref_blanket'),
            options: [
                { text: "Ratify the Horizontal Recovery Act", hint: "Adds Policy", policy: 'polHorizontal', trait: 'traitInfraObsessed', stability: 5 },
                { text: "Reject the Proposal", hint: "Adds Dogmatic Alignment", alignment: 'alignDogmatic', stability: -15 }
            ]
        },
        {
            id: 'crisis_charger',
            type: 'crisis',
            title: "The Charger Crisis.",
            desc: "A critical shortage of emotional support chargers has sparked civil unrest.",
            trigger: (history, state) => history.filter(h => h.answers.stress === 'overloaded').length > 5 && !state.history.includes('crisis_charger'),
            options: [
                { text: "Nationalize Chargers", hint: "Adds Policy", policy: 'polChargerRedist', trait: 'traitMilitarized', stability: -5 },
                { text: "Encourage Shared Suffering", hint: "Adds Compassionate Alignment", alignment: 'alignCompassionate', stability: 15 }
            ]
        }
    ];

    function checkActiveDecision(history, state) {
        // Return the first valid decision that hasn't been resolved yet
        for (let def of DECISIONS) {
            if (def.trigger(history, state)) return def;
        }
        return null;
    }

    function applyDecision(decisionId, option, currentState) {
        const newState = { ...currentState };
        
        newState.history.push(decisionId);
        
        if (option.policy && !newState.policies.includes(option.policy)) {
            newState.policies.push(option.policy);
            window.MeowTrack && window.MeowTrack('policy_enacted', { policy_id: option.policy, lang: getLang() });
        }
        
        if (option.trait && !newState.traits.includes(option.trait)) {
            newState.traits.push(option.trait);
        }
        
        if (option.alignment) {
            newState.alignment = option.alignment;
            window.MeowTrack && window.MeowTrack('alignment_shift', { alignment_type: option.alignment, lang: getLang() });
        }
        
        // Expose stability modifier to be picked up by governance.js via window event or state reading
        // We'll store a temporary modifier
        newState.stabilityModifier = (newState.stabilityModifier || 0) + (option.stability || 0);

        window.MeowStore.updateCivDecisions(newState);

        const eventType = decisionId.startsWith('ref_') ? 'referendum_completed' : 'crisis_response_selected';
        window.MeowTrack && window.MeowTrack(eventType, { decision_id: decisionId, choice: option.text, lang: getLang() });

        renderDecisionEngine();
        
        // Trigger global update to refresh governance/museum
        window.dispatchEvent(new Event('meow:decision:resolved'));
    }

    function renderDecisionEngine() {
        const host = window.MeowOS ? window.MeowOS.getLayer('civ') : document.getElementById('family-content');
        if (!host) return;

        let container = document.getElementById('household-decision-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-decision-section';
            
            // Insert before governance
            const gov = document.getElementById('household-governance-section');
            if (gov) gov.before(container);
            else host.append(container);
        }

        const history = getHistory();
        const state = window.MeowStore.getCivDecisions();
        const activeDecision = checkActiveDecision(history, state);

        if (!activeDecision && state.policies.length === 0 && state.traits.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        let html = '';

        if (activeDecision) {
            const isRef = activeDecision.type === 'referendum';
            html += `
                <div class="decision-container animate-fade-in" style="margin-bottom:32px; ${isRef ? 'border-color:#3DA17A;' : 'border-color:#FF5B3B;'}">
                    <div class="dec-header">
                        <span class="dec-type-label" style="${isRef ? 'color:#3DA17A;' : 'color:#FF5B3B;'}">
                            ${isRef ? t('decReferendum') : t('decCrisis')}
                        </span>
                        <h3 class="dec-title">${activeDecision.title}</h3>
                        <p style="opacity:0.8; font-size:1.1rem; line-height:1.4;">${activeDecision.desc}</p>
                    </div>
                    <div class="dec-options">
                        ${activeDecision.options.map((opt, i) => `
                            <button class="dec-option-btn" data-decision="${activeDecision.id}" data-option="${i}">
                                <span>${opt.text}</span>
                                <span class="dec-consequence-hint">${opt.hint}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            if (window.MeowTrack && isRef) window.MeowTrack('referendum_started', { decision_id: activeDecision.id, lang: getLang() });
        }

        if (state.policies.length > 0 || state.traits.length > 0) {
            html += `
                <div class="governance-archive" style="margin-top:32px; padding:24px; background:rgba(255,255,255,0.02); border-radius:24px; border:1px solid rgba(255,255,255,0.1);">
                    <h3 style="font-family:var(--font-display); margin-bottom:16px;">${t('decArchive')}</h3>
                    
                    <div style="margin-bottom:24px;">
                        <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; opacity:0.5; margin-bottom:8px; display:block;">${t('govAlignment')}</span>
                        <div style="font-size:1.2rem; font-weight:700; color:#D4AF37;">${t(state.alignment) || 'Neutral'}</div>
                    </div>

                    ${state.traits.length > 0 ? `
                        <div style="margin-bottom:24px;">
                            <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; opacity:0.5; margin-bottom:8px; display:block;">${t('decTraits')}</span>
                            <div>
                                ${state.traits.map(tr => `<span class="trait-badge">${t(tr)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${state.policies.length > 0 ? `
                        <div>
                            <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; opacity:0.5; margin-bottom:8px; display:block;">${t('decActivePolicies')}</span>
                            <div class="policy-grid">
                                ${state.policies.map(p => `
                                    <div class="policy-card">
                                        <strong>${t(p)}</strong>
                                        <button class="micro-share-icon mini" style="position:absolute; bottom:8px; right:8px;" data-type="policy" data-text="Active Policy: ${t(p)}">📤</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        container.innerHTML = html;

        // Bind decision buttons
        container.querySelectorAll('.dec-option-btn').forEach(btn => {
            btn.onclick = () => {
                const decId = btn.getAttribute('data-decision');
                const optIdx = parseInt(btn.getAttribute('data-option'), 10);
                const decision = DECISIONS.find(d => d.id === decId);
                if (decision && decision.options[optIdx]) {
                    applyDecision(decId, decision.options[optIdx], state);
                }
            };
        });

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'civilization_decisions',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        if (window.MeowTrack && !activeDecision && (state.policies.length > 0 || state.traits.length > 0)) {
            window.MeowTrack('governance_archive_view', { policy_count: state.policies.length, lang: getLang() });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderDecisionEngine);
    } else {
        renderDecisionEngine();
    }

    window.addEventListener('meow:daily:updated', renderDecisionEngine);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderDecisionEngine();
    });
})();
