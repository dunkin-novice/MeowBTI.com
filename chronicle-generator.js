/**
 * MeowBTI Household Chronicle Export System v1
 * Generates cinematic recaps and collectible mythology reports.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;
    const sanitize = window.MeowSanitize || ((s) => s);

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    function generateChronicle() {
        const history = getHistory();
        const profiles = window.MeowStore.getFamily();
        const forged = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
        const cabinet = window.MeowStore.getThoughtCabinet ? window.MeowStore.getThoughtCabinet() : {};

        const data = {
            id: 'chronicle_' + Date.now(),
            profiles: profiles.length,
            daysCovered: [...new Set(history.map(h => h.date))].length,
            cards: []
        };

        // 1. Civilization Report
        const stressAvg = history.reduce((acc, h) => acc + (h.answers.stress === 'overloaded' ? 2 : 0), 0) / (history.length || 1);
        const lowEnergyCount = history.filter(h => h.answers.energy === 'low').length;
        
        const internalized = Object.entries(cabinet).filter(([id, d]) => d.status === 'INTERNALIZED');
        const doctrine = internalized.length > 0 ? t(internalized[0][0]) : "Undeclared Philosophy";

        data.cards.push({
            type: 'civ',
            title: t('repCivSummary'),
            doctrine: doctrine,
            infrastructure: lowEnergyCount > history.length * 0.4 ? "Blanket-Based" : "Highly Flammable",
            survival: "Soup, Silence, and Iced Coffee",
            dark: true
        });

        // 2. Relationship Mythology
        if (profiles.length >= 2) {
            const duoA = sanitize(profiles[0].name);
            const duoB = sanitize(profiles[1].name);
            data.cards.push({
                type: 'relationship',
                title: "Duo Mythology",
                desc: `${duoA} emotionally documents chaos. ${duoB} accidentally creates it. Together, they have survived multiple overstimulation cycles.`,
                footer: "Strategic Alliance: Legally Binding"
            });
        }

        // 3. Relic Poster
        if (forged.length > 0) {
            const topRelic = forged[forged.length - 1];
            data.cards.push({
                type: 'relic',
                title: sanitize(topRelic.customName || topRelic.name),
                icon: topRelic.icon,
                status: "Civilizational Infrastructure",
                aura: "Recovery Radiation",
                history: `Critical during the last ${history.length} cycles.`
            });
        }

        // 4. Seasonal Recap (Last 7 days)
        const recent = history.slice(0, 14);
        const loudDays = recent.filter(h => h.answers.stress === 'overloaded').length;
        
        data.cards.push({
            type: 'season',
            title: t('repSeasonRecap'),
            desc: loudDays > 5 ? "Your household spent recent days emotionally flammable." : "A period of quiet rebuilding and horizontal existence.",
            footer: t('finCanon')
        });

        // 5. Federation Treaty
        const federation = window.MeowStore.getFederation ? window.MeowStore.getFederation() : [];
        if (federation.length > 0) {
            const topAlliance = federation[0];
            data.cards.push({
                type: 'treaty',
                title: t('stkTreatyRatified'),
                desc: `A diplomatic bond has been established with ${sanitize(topAlliance.name)}. This alliance represents a shared commitment to emotional stability.`,
                footer: "Federation Status: Ratified"
            });
        }

        // 6. Governance Archive
        const civDecisions = window.MeowStore.getCivDecisions ? window.MeowStore.getCivDecisions() : null;
        if (civDecisions && (civDecisions.policies.length > 0 || civDecisions.alignment !== 'neutral')) {
            data.cards.push({
                type: 'governance',
                title: t('decArchive'),
                desc: `The civilization has formalized its identity. It currently aligns as ${t(civDecisions.alignment) || 'Neutral'}, heavily influenced by policies like ${civDecisions.policies.length > 0 ? t(civDecisions.policies[0]) : 'Standard Operating Procedures'}.`,
                footer: "Political Record: Preserved"
            });
        }

        // 7. Finale
        data.cards.push({
            type: 'finale',
            title: t('repFinale'),
            desc: t('finNoRecovery'),
            dark: true
        });

        window.MeowStore.saveChronicle(data);
        return data;
    }

    function showCard(card) {
        let overlay = document.getElementById('chronicle-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'chronicle-overlay';
            overlay.className = 'chronicle-card-overlay';
            document.body.append(overlay);
        }
        overlay.classList.add('active');

        if (window.MeowTrack) {
            if (card.type === 'relic') window.MeowTrack('relic_poster_view', { relic_type: card.title, lang: getLang() });
            if (card.type === 'treaty') window.MeowTrack('treaty_poster_view', { treaty_type: card.title, lang: getLang() });
        }

        overlay.innerHTML = `
            <div class="cinematic-card ${card.dark ? 'dark' : ''} animate-fade-in">
                <h2 class="card-title">${card.title}</h2>
                <div class="card-content">
                    ${card.type === 'civ' ? `
                        <div class="poster-metadata">
                            <div class="pm-item">
                                <span class="pm-label">${t('civDoctrine')}</span>
                                <span class="pm-val">${card.doctrine}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('civInfrastructure')}</span>
                                <span class="pm-val">${card.infrastructure}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('civSurvivalKey')}</span>
                                <span class="pm-val">${card.survival}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${card.type === 'relic' ? `
                        <div style="font-size:5rem; margin-bottom:24px;">${card.icon}</div>
                        <div class="poster-metadata">
                            <div class="pm-item">
                                <span class="pm-label">${t('posStatus')}</span>
                                <span class="pm-val">${card.status}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('posAura')}</span>
                                <span class="pm-val">${card.aura}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('posHistory')}</span>
                                <span class="pm-val">${card.history}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${card.desc ? `<p>${card.desc}</p>` : ''}
                </div>
                <div class="card-footer">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <button class="big-btn ghost" id="btn-chronicle-share" style="padding:10px; font-size:0.8rem;">📤 ${t('chronicleExport')}</button>
                        <button class="big-btn accent" id="btn-chronicle-public" style="padding:10px; font-size:0.8rem;">🔗 ${t('chroniclePublicLink')}</button>
                    </div>
                    <button class="big-btn ghost" id="btn-chronicle-next" style="margin-top:12px; width:100%;">Next →</button>
                </div>
            </div>
            <button class="big-btn ghost" id="btn-chronicle-close" style="position:absolute; top:20px; right:20px; color:#fff; border-color:rgba(255,255,255,0.2);">✕</button>
        `;

        overlay.querySelector('#btn-chronicle-close').onclick = () => overlay.classList.remove('active');
        
        overlay.querySelector('#btn-chronicle-share').onclick = () => {
            if (window.MeowAnalytics) {
                window.MeowAnalytics.microShare({
                    framework: 'household_chronicle',
                    content_type: card.type,
                    text: `Household Chronicle: ${card.title}. ${card.desc || ''}`,
                    route: '/'
                });
                window.MeowTrack && window.MeowTrack('civilization_report_shared', { 
                    content_type: card.type, 
                    lang: getLang() 
                });
            }
        };

        overlay.querySelector('#btn-chronicle-public').onclick = () => {
            const payload = btoa(unescape(encodeURIComponent(JSON.stringify(card))));
            const url = `${window.location.origin}/chronicle/view.html?p=${payload}`;
            
            if (navigator.share) {
                navigator.share({
                    title: `MeowBTI | ${card.title}`,
                    text: card.desc || t('chronicleSharedBy'),
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url).then(() => alert("Public link copied to clipboard!"));
            }

            // Echo Card Hook for Public Export
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'public_share_' + card.type + '_' + Date.now(),
                type: 'public_share',
                title: card.title,
                lore: t('echoLoreWitness'),
                icon: '📤'
            }}));

            if (window.MeowTrack) {
                window.MeowTrack('chronicle_export', {
                    type: card.type,
                    lang: getLang()
                });
            }
        };
    }

    function renderChronicleUI() {
        const host = window.MeowOS ? window.MeowOS.getLayer('archive') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-chronicle-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-chronicle-section';
            container.className = 'chronicle-container animate-fade-in';
            host.append(container);
        }

        const chronicles = window.MeowStore.getChronicles();

        container.innerHTML = `
            <div class="chronicle-header">
                <h2 class="chronicle-h2">${t('chronicleTitle')}</h2>
                <p class="wm-intro">${t('chronicleIntro')}</p>
            </div>

            <div class="chronicle-action-row">
                <button class="big-btn accent" id="btn-generate-chronicle">
                    ✨ ${t('chronicleExport')}
                </button>
            </div>

            ${chronicles.length > 0 ? `
                <div class="lore-archive-section">
                    <h3 class="museum-category-title">${t('chronicleArchive')}</h3>
                    <div class="chronicle-archive-grid">
                        ${chronicles.map((c, i) => `
                            <div class="archive-thumb" data-index="${i}">
                                📜
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        container.querySelector('#btn-generate-chronicle').onclick = () => {
            const data = generateChronicle();
            let current = 0;
            const next = () => {
                if (current < data.cards.length) {
                    showCard(data.cards[current]);
                    if (data.cards[current].type === 'season') {
                        window.MeowTrack && window.MeowTrack('season_report_viewed', { season_type: 'custom', lang: getLang() });
                    }
                    if (data.cards[current].type === 'relic') {
                        window.MeowTrack && window.MeowTrack('relic_poster_exported', { relic_type: data.cards[current].title, lang: getLang() });
                    }
                    if (data.cards[current].type === 'finale') {
                        window.MeowTrack && window.MeowTrack('finale_screen_triggered', { lang: getLang() });
                    }
                    document.getElementById('btn-chronicle-next').onclick = () => {
                        current++;
                        next();
                    };
                } else {
                    document.getElementById('chronicle-overlay').classList.remove('active');
                    renderChronicleUI();
                }
            };
            next();
            window.MeowTrack && window.MeowTrack('chronicle_generated', { 
                profile_count: profiles.length, 
                lore_depth: data.cards.length,
                lang: getLang() 
            });
        };

        container.querySelectorAll('.archive-thumb').forEach(thumb => {
            thumb.onclick = () => {
                const idx = thumb.getAttribute('data-index');
                const data = chronicles[idx];
                let current = 0;
                const next = () => {
                    if (current < data.cards.length) {
                        showCard(data.cards[current]);
                        document.getElementById('btn-chronicle-next').onclick = () => {
                            current++;
                            next();
                        };
                    } else {
                        document.getElementById('chronicle-overlay').classList.remove('active');
                    }
                };
                next();
                window.MeowTrack && window.MeowTrack('chronicle_archive_opened', { lang: getLang() });
            };
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderChronicleUI);
    } else {
        renderChronicleUI();
    }

    window.addEventListener('meow:daily:updated', renderChronicleUI);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderChronicleUI();
    });
})();
