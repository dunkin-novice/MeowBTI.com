/**
 * MeowBTI Household Federation System v1
 * Manages cross-household alliances, diplomacy, and shared mythology.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;
    const sanitize = window.MeowSanitize || ((s) => s);

    const GIGT_DEFINITIONS = {
        treaty_blanket: { name: t('giftTreatyBlanket'), icon: '🛌', plaque: t('lpLowEnergyAuth'), alliance: 'allBlanketAccord', bonus: t('bonusBlanket') },
        dip_charger: { name: t('giftDipCharger'), icon: '🔌', plaque: t('lpLowEnergyAuth'), alliance: 'allBlanketAccord' },
        soup_infra: { name: t('giftSoupInfra'), icon: '🍲', plaque: t('lpBrothSurvival'), alliance: 'allSoupPact', bonus: t('bonusSoup') },
        beacon: { name: t('giftBeacon'), icon: '🚨', plaque: t('lpCalmOptimism') },
        embassy_couch: { name: t('giftEmbassyCouch'), icon: '🛋️', plaque: t('lpParallelEx'), alliance: 'allParallelSync', bonus: t('bonusParallel') },
        support_spoon: { name: t('giftSupportSpoon'), icon: '🥄', plaque: t('lpCalmOptimism') },
        iced_coffee: { name: t('giftIcedCoffee'), icon: '☕', plaque: t('lpLowEnergyAuth') },
        accord_seal: { name: t('giftAccordSeal'), icon: '📜', plaque: t('lpLowEnergyAuth'), alliance: 'allBlanketAccord' }
    };

    function determineChemistry(local, member) {
        if (!local.doctrine || !member.doctrine) return { key: 'chemNeutral', val: 50 };
        const seed = (local.id || 'loc') + (member.id || 'mem');
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        const score = Math.abs(hash) % 101;
        let status = 'chemNeutral';
        if (score > 75) status = 'chemResonant';
        else if (score < 25) status = 'chemUnstable';
        return { key: status, val: score };
    }

    function getLocalCivilizationSnapshot(giftKey = null) {
        const history = window.MeowDaily.getHistory() || [];
        const profiles = window.MeowStore.getFamily();
        const cabinet = window.MeowStore.getThoughtCabinet ? window.MeowStore.getThoughtCabinet() : {};
        const activeArc = window.MeowStore.getActiveArc ? window.MeowStore.getActiveArc() : null;

        const internalized = Object.entries(cabinet).filter(([id, d]) => d.status === 'INTERNALIZED');
        const doctrine = internalized.length > 0 ? internalized[0][0] : null;

        // Calculate prestige for export
        const relics = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics().length : 0;
        const prestige = (history.length * 2) + (relics * 10);

        return {
            id: 'house_' + Math.random().toString(36).substr(2, 9),
            name: profiles.length > 0 ? sanitize(profiles[0].name) + "'s Household" : "Unknown Civilization",
            profilesCount: profiles.length,
            doctrine,
            prestige,
            activeArcKey: activeArc ? activeArc.key : null,
            recentClimate: history.length > 0 ? history[0].answers.stress : 'calm',
            giftKey,
            timestamp: Date.now()
        };
    }

    function generateShareCode(giftKey = null) {
        const snapshot = getLocalCivilizationSnapshot(giftKey);
        const json = JSON.stringify(snapshot);
        return btoa(json);
    }

    function importCivilization(code) {
        if (!code) return null;
        try {
            const json = atob(code);
            const data = JSON.parse(json);
            if (data.id && data.profilesCount !== undefined) {
                // Sanitize imported data
                data.name = sanitize(data.name);
                
                window.MeowStore.saveFederationMember(data);
                
                if (data.giftKey && GIGT_DEFINITIONS[data.giftKey]) {
                    const gift = {
                        key: data.giftKey,
                        origin: data.name,
                        alliance: getAllianceType(getLocalCivilizationSnapshot(), data).title
                    };
                    window.MeowStore.saveDiplomaticGift(gift);
                    
                    // Echo Card Hook for Gift Receipt
                    window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                        card_key: 'gift_receipt_' + data.id + '_' + data.timestamp,
                        type: 'gift_receipt',
                        title: gift.origin,
                        lore: t('echoLoreWitness'),
                        icon: '🎁'
                    }}));

                    showGiftCeremony(data.giftKey, data.name);
                    window.MeowTrack && window.MeowTrack('diplomatic_gift_received', { gift_type: data.giftKey, lang: getLang() });
                }

                return data;
            }
        } catch (e) {
            console.error("MeowFederation: Failed to import civilization - possibly malformed or old code.", e);
        }
        return null;
    }

    function showGiftCeremony(giftKey, originName) {
        const def = GIGT_DEFINITIONS[giftKey];
        const cleanName = sanitize(originName);
        let overlay = document.getElementById('gift-ceremony-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'gift-ceremony-overlay';
            overlay.className = 'gift-ceremony-overlay';
            document.body.append(overlay);
        }
        overlay.classList.add('active');

        overlay.innerHTML = `
            <div class="ceremony-scroll animate-fade-in">
                <div class="ceremony-stamp">${def.icon}</div>
                <h2 class="card-title" style="font-size:1.5rem; color:var(--ink);">${t('fedGiftArrived')}</h2>
                <div class="card-content" style="color:var(--ink);">
                    <p style="font-weight:800; font-size:1.5rem; margin-bottom:12px;">${def.name}</p>
                    <p class="gift-origin">From: ${cleanName}</p>
                    <div class="gift-plaque" style="margin-top:24px;">
                        ${def.plaque}
                    </div>
                </div>
                <div class="card-footer" style="margin-top:24px;">
                    <button class="big-btn accent" onclick="document.getElementById('gift-ceremony-overlay').classList.remove('active')">Accept Offering</button>
                </div>
            </div>
        `;
        window.MeowTrack && window.MeowTrack('gift_arrival_viewed', { gift_type: giftKey, lang: getLang() });
    }

    function renderGiftArchive() {
        const gifts = window.MeowStore.getDiplomaticGifts ? window.MeowStore.getDiplomaticGifts() : [];
        if (gifts.length === 0) return '';

        return `
            <div class="gift-archive-container animate-fade-in">
                <span class="sticker-wall-title">${t('fedGiftArchive')}</span>
                <div class="gift-grid">
                    ${gifts.map(gift => {
                        const def = GIGT_DEFINITIONS[gift.key];
                        if (!def) return '';
                        
                        return `
                            <div class="gift-card">
                                <div class="gift-icon">${def.icon}</div>
                                <span class="gift-origin">Origin: ${gift.origin}</span>
                                <div class="gift-name" style="color:var(--ink);">${def.name}</div>
                                <div class="gift-plaque" style="color:var(--ink);">${def.plaque}</div>
                                ${def.bonus ? `<div class="dip-line" style="color:#9B59B6; font-size:0.8rem; margin-top:8px;">✨ ${def.bonus}</div>` : ''}
                                <button class="micro-share-icon mini" data-type="gift" data-text="Diplomatic Gift Arrived: ${def.name}. From ${gift.origin}.">📤</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function checkMilestones(federation, local) {
        if (!window.MeowStore.unlockSticker) return;

        // 1. Embassy Opened
        if (federation.length > 0) {
            if (window.MeowStore.unlockSticker('stk_embassy_open')) {
                window.MeowTrack && window.MeowTrack('federation_sticker_unlocked', { sticker_type: 'stk_embassy_open', lang: getLang() });
            }
        }

        // 2. Mega-Alliance Detection (3+ households)
        const soupCount = federation.filter(m => m.doctrine === 'thSoupLabor' || (local.doctrine === 'thSoupLabor' && m.id === local.id)).length + (local.doctrine === 'thSoupLabor' ? 1 : 0);
        if (soupCount >= 3) {
            if (window.MeowStore.unlockSticker('mega_soup')) {
                window.MeowTrack && window.MeowTrack('mega_alliance_detected', { alliance_type: 'mega_soup', lang: getLang() });
            }
        }

        const heavyCount = federation.filter(m => m.recentClimate === 'heavy').length + (local.recentClimate === 'heavy' ? 1 : 0);
        if (heavyCount >= 3) {
            if (window.MeowStore.unlockSticker('mega_blanket')) {
                window.MeowTrack && window.MeowTrack('mega_alliance_detected', { alliance_type: 'mega_blanket', lang: getLang() });
            }
        }

        const parallelCount = federation.filter(m => m.doctrine === 'thParallelIntimacy').length + (local.doctrine === 'thParallelIntimacy' ? 1 : 0);
        if (parallelCount >= 3) {
            if (window.MeowStore.unlockSticker('mega_silent')) {
                window.MeowTrack && window.MeowTrack('mega_alliance_detected', { alliance_type: 'mega_silent', lang: getLang() });
            }
        }
    }

    function renderStickerWall() {
        const unlocked = window.MeowStore.getUnlockedStickers ? window.MeowStore.getUnlockedStickers() : {};
        if (Object.keys(unlocked).length === 0) return '';

        const stickers = [
            { id: 'stk_embassy_open', icon: '🏛️', label: t('stkEmbassyOpen'), desc: "Established diplomatic infrastructure." },
            { id: 'mega_soup', icon: '🍲', label: t('megaSoup'), desc: t('stkSoupDesc') },
            { id: 'mega_blanket', icon: '🛌', label: t('megaBlanket'), desc: t('stkBlanketDesc') },
            { id: 'mega_silent', icon: '🔇', label: t('megaSilent'), desc: t('stkSilentDesc') }
        ];

        return `
            <div class="sticker-wall-container animate-fade-in">
                <span class="sticker-wall-title">${t('fedStickerWall')}</span>
                <div class="sticker-grid">
                    ${stickers.map(stk => {
                        if (!unlocked[stk.id]) return '';
                        return `
                            <div class="sticker-item" title="${stk.desc}">
                                <div class="sticker-icon">${stk.icon}</div>
                                <span class="sticker-label">${stk.label}</span>
                                <button class="micro-share-icon mini" data-type="sticker" data-text="Federation Sticker Earned: ${stk.label}. ${stk.desc}">📤</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderFederationUI() {
        const host = window.MeowOS ? window.MeowOS.getLayer('identity') : document.getElementById('family-content');
        if (!host) return;
        if (window.MeowOS && !window.MeowOS.isUnlocked('federation')) {
            window.MeowOS.renderLock(host, 'federation', 'unlockHintFed');
            return;
        }

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-federation-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-federation-section';
            container.className = 'federation-container animate-fade-in';
            host.append(container);
        }

        const federation = window.MeowStore.getFederation();
        const local = getLocalCivilizationSnapshot();

        checkMilestones(federation, local);

        container.innerHTML = `
            <div class="chronicle-header">
                <h2 class="chronicle-h2">${t('fedTitle')}</h2>
                <p class="wm-intro">${t('fedIntro')}</p>
            </div>

            <div class="fed-action-grid">
                <div class="gift-selector">
                    <label>${t('fedAttachGift')}</label>
                    <select id="fed-gift-select">
                        <option value="">None</option>
                        ${Object.entries(GIGT_DEFINITIONS).map(([k, d]) => `<option value="${k}">${d.icon} ${d.name}</option>`).join('')}
                    </select>
                </div>
                <div style="display:flex; gap:12px; align-self:flex-end; flex-wrap:wrap;">
                    <button class="big-btn accent" id="btn-fed-export">
                        🔗 ${t('fedExportCode')}
                    </button>
                    <button class="big-btn ghost" id="btn-fed-identity">
                        👤 ${t('fedShareIdentity')}
                    </button>
                    <button class="big-btn ghost" id="btn-fed-import">
                        📥 ${t('fedImportCode')}
                    </button>
                </div>
            </div>

            ${renderGiftArchive()}

            ${federation.length > 0 ? `
                <div class="fed-embassy-section">
                    <div class="embassy-header">
                        <h3 class="embassy-title">${t('fedEmbassy')}</h3>
                    </div>

                    ${(function() {
                        const unlocked = window.MeowStore.getUnlockedStickers ? window.MeowStore.getUnlockedStickers() : {};
                        const megaKeys = ['mega_soup', 'mega_blanket', 'mega_silent'];
                        const latestMega = megaKeys.reverse().find(k => unlocked[k]);
                        if (!latestMega) return '';
                        
                        let title, desc;
                        if (latestMega === 'mega_soup') { title = t('megaSoup'); desc = t('stkSoupDesc'); }
                        else if (latestMega === 'mega_blanket') { title = t('megaBlanket'); desc = t('stkBlanketDesc'); }
                        else { title = t('megaSilent'); desc = t('stkSilentDesc'); }

                        return `
                            <div class="mega-alliance-alert animate-fade-in">
                                <div class="mega-alliance-title">🌟 ${title}</div>
                                <div class="mega-alliance-desc">${desc}</div>
                            </div>
                        `;
                    })()}

                    ${renderStickerWall()}
                    
                    <div class="alliance-grid" style="margin-top:32px;">
                        ${federation.map(member => {
                            const alliance = getAllianceType(local, member);
                            const sharedEvent = getSharedEvent(local, member);
                            const fedRelic = getFederationRelic(local, member);
                            const chem = determineChemistry(local, member);

                            return `
                                <div class="alliance-card">
                                    <div class="alliance-seal">${alliance.icon}</div>
                                    <div class="alliance-name">${member.name}</div>
                                    <div class="alliance-status">${alliance.title}</div>
                                    <div class="pm-label">Prestige: ${member.prestige || 0} ${member.prestige > 100 ? '(Elder Civilization)' : ''}</div>
                                    
                                    <div class="fed-diplomacy-meta" style="margin:16px 0; padding:12px; background:rgba(255,255,255,0.03); border-radius:8px;">
                                        <div style="display:flex; justify-content:space-between; font-size:0.6rem; margin-bottom:8px;">
                                            <span class="chem-label" style="opacity:0.5; text-transform:uppercase;">${t('dipChemistry')}</span>
                                            <span class="chem-status ${chem.key}" style="font-weight:900;">${t(chem.key)}</span>
                                        </div>
                                        <div class="chem-bar-outer" style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                                            <div class="chem-bar-inner ${chem.key}" style="width: ${chem.val}%; height:100%; background:var(--ink); transition: width 1s;"></div>
                                        </div>
                                        <p style="font-size:0.65rem; opacity:0.5; margin-top:8px;">${t('dipCompatibility')}: ${chem.val}%</p>
                                    </div>

                                    ${sharedEvent ? `
                                        <div class="dip-line" style="color:#FFB000;">
                                            🌟 ${t('dipSharedMyth')}: ${sharedEvent.title}
                                        </div>
                                    ` : ''}

                                    ${fedRelic ? `
                                        <div class="dip-line" style="color:#9B59B6;">
                                            🏺 ${t('repRelicPoster')}: ${fedRelic.name}
                                        </div>
                                    ` : ''}

                                    <div class="dip-line">${getDiplomacyText(local, member)}</div>
                                    
                                    <div class="diplomatic-report">
                                        <div class="pm-label">${t('repCivSummary')}</div>
                                        <div class="dip-line">${getCivilizationComparison(local, member)}</div>
                                    </div>
                                    
                                    <button class="micro-share-icon mini" data-type="alliance" data-text="Alliance Formed: ${alliance.title} with ${member.name}. Chemistry: ${t(chem.key)}.">📤</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        if (federation.length > 0 && window.MeowTrack) {
            window.MeowTrack('diplomacy_report_viewed', { alliance_count: federation.length, lang: getLang() });
        }

        if (window.MeowStore.getDiplomaticGifts && window.MeowStore.getDiplomaticGifts().length > 0) {
            window.MeowTrack && window.MeowTrack('gift_archive_opened', { gift_count: window.MeowStore.getDiplomaticGifts().length, lang: getLang() });
        }

        container.querySelector('#btn-fed-export').onclick = () => {
            const giftKey = container.querySelector('#fed-gift-select').value;
            const code = generateShareCode(giftKey);
            const url = new URL(window.location.href);
            url.searchParams.set('fed', code);
            
            if (navigator.share) {
                navigator.share({
                    title: 'MeowBTI Civilization Code',
                    text: 'Establish diplomacy with my household civilization!',
                    url: url.toString()
                });
            } else {
                navigator.clipboard.writeText(url.toString()).then(() => alert("Federation link copied to clipboard!"));
            }
            window.MeowTrack && window.MeowTrack('federation_created', { profile_count: profiles.length, lang: getLang() });
            if (giftKey) window.MeowTrack && window.MeowTrack('diplomatic_gift_attached', { gift_type: giftKey, lang: getLang() });
        };

        container.querySelector('#btn-fed-identity').onclick = () => {
            const history = window.MeowDaily.getHistory() || [];
            const season = window.MeowSeasons ? window.MeowSeasons.detectSeason(history) : { title: "Undiscovered Civilization" };
            const aura = window.MeowMuseum ? window.MeowMuseum.getAura(history) : null;
            const reputation = window.MeowMuseum ? window.MeowMuseum.getReputation(history, 'civ') : "Historically Significant";
            const forged = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics() : [];
            const topRelic = forged.length > 0 ? forged[0] : { name: "Ancient Memory", icon: "🗿" };
            
            const cabinet = window.MeowStore.getThoughtCabinet ? window.MeowStore.getThoughtCabinet() : {};
            const internalized = Object.entries(cabinet).filter(([id, d]) => d.status === 'INTERNALIZED');
            const doctrine = internalized.length > 0 ? t(internalized[0][0]) : "Undeclared Philosophy";

            const civDecisions = window.MeowStore.getCivDecisions ? window.MeowStore.getCivDecisions() : { policies: [], alignment: 'neutral' };

            const civClass = window.MeowCivilization ? window.MeowCivilization.detectClass(history, profiles) : { id: 'stability' };

            const payload = {
                seasonTitle: season.title,
                seasonKey: season.key,
                civClass: civClass.id,
                reputation: reputation + (aura ? ` with ${aura.title}` : ''),
                era: window.MeowSeasons ? window.MeowSeasons.detectArc(history) : "Early History",
                doctrine: doctrine,
                doctrineKey: internalized.length > 0 ? internalized[0][0] : 'none',
                motto: t('motto' + civClass.id.charAt(0).toUpperCase() + civClass.id.slice(1)),
                relicName: topRelic.customName || topRelic.name,
                relicIcon: topRelic.icon,
                philosophy: t('cultSocialDesc'), // Anthropological placeholder
                infrastructure: history.filter(h => h.answers.energy === 'low').length > history.length * 0.5 ? "Blanket-Based" : "Highly Flammable",
                federation: federation.length > 0 ? `Member of ${federation.length} Alliances` : "Independent Civilization",
                embargoes: window.MeowGovernanceState && window.MeowGovernanceState.embargoesActive ? "Multiple" : null,
                archScore: history.length > 30 ? (history.length * 1.5).toFixed(0) : "N/A",
                archStatus: history.length > 50 ? "Ancient Discovery" : (history.length > 10 ? "Modern Ruins Found" : "Undiscovered History"),
                alignment: t(civDecisions.alignment) || 'Neutral',
                policies: civDecisions.policies.map(p => t(p))
            };

            const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
            const url = `${window.location.origin}/civilization/view.html?p=${encoded}`;

            if (navigator.share) {
                navigator.share({
                    title: `${payload.seasonTitle} | MeowBTI`,
                    text: `Explore our Emotional Civilization: ${payload.doctrine}.`,
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url).then(() => alert("Identity profile link copied!"));
            }

            // Echo Card Hook for Public Profile
            window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
                card_key: 'public_profile_' + payload.seasonKey + '_' + Date.now(),
                type: 'public_share',
                title: payload.seasonTitle,
                lore: t('echoLoreWitness'),
                icon: '👤'
            }}));

            window.MeowTrack && window.MeowTrack('civilization_profile_export', {
                season: payload.seasonKey,
                doctrine: payload.doctrineKey,
                lang: getLang()
            });
        };

        container.querySelector('#btn-fed-import').onclick = () => {
            const code = prompt("Enter Civilization Code (Base64 string or full URL):");
            if (code) {
                let actualCode = code;
                if (code.includes('fed=')) {
                    actualCode = new URL(code).searchParams.get('fed');
                }
                const imported = importCivilization(actualCode);
                if (imported) {
                    alert("Diplomacy established with " + imported.name);
                    renderFederationUI();
                    window.MeowTrack && window.MeowTrack('civilization_imported', { lang: getLang() });
                    
                    const local = getLocalCivilizationSnapshot();
                    const alliance = getAllianceType(local, imported);
                    window.MeowTrack && window.MeowTrack('alliance_formed', { alliance_type: alliance.title, lang: getLang() });
                    window.MeowTrack && window.MeowTrack('treaty_badge_earned', { treaty_type: alliance.title, lang: getLang() });
                } else {
                    alert("Invalid civilization code.");
                }
            }
        };

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_federation',
                        content_type: btn.getAttribute('data-type'),
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                    if (btn.getAttribute('data-type') === 'gift') {
                        window.MeowTrack && window.MeowTrack('gift_share_attempt', { gift_text: btn.getAttribute('data-text'), lang: getLang() });
                    }
                }
            };
        });

        // Analytics
        if (window.MeowTrack) {
            window.MeowTrack('embassy_opened', { federation_size: federation.length, lang: getLang() });
            
            const unlocked = window.MeowStore.getUnlockedStickers ? window.MeowStore.getUnlockedStickers() : {};
            if (Object.keys(unlocked).length > 0) {
                window.MeowTrack('embassy_sticker_wall_viewed', { sticker_count: Object.keys(unlocked).length, lang: getLang() });
            }

            federation.forEach(member => {
                const event = getSharedEvent(local, member);
                if (event) window.MeowTrack('cross_household_event', { event_type: event.title, lang: getLang() });
                
                const relic = getFederationRelic(local, member);
                if (relic) window.MeowTrack('federation_relic_generated', { relic_type: relic.name, lang: getLang() });
            });
        }
    }

    function getSharedEvent(local, foreign) {
        if (local.recentClimate === 'unstable' && foreign.recentClimate === 'unstable') {
            return { title: t('evGreatSilence') };
        }
        if (local.recentClimate === 'heavy' && foreign.recentClimate === 'heavy') {
            return { title: t('evWeekendCollapse') };
        }
        return null;
    }

    function getFederationRelic(local, foreign) {
        if (local.recentClimate === 'heavy' && foreign.recentClimate === 'heavy') {
            return { name: t('relTreatyBlanket') };
        }
        if (local.doctrine === 'thSoupLabor' && foreign.doctrine === 'thSoupLabor') {
            return { name: t('relSharedSoup') };
        }
        return { name: t('relDiplomaticCharger') };
    }

    function getAllianceType(local, foreign) {
        if (local.recentClimate === 'heavy' && foreign.recentClimate === 'heavy') {
            return { title: t('allBlanketAccord'), icon: '🛌' };
        }
        if (local.doctrine === 'thSoupLabor' || foreign.doctrine === 'thSoupLabor') {
            return { title: t('allSoupPact'), icon: '🍲' };
        }
        return { title: t('allParallelSync'), icon: '🤝' };
    }

    function getDiplomacyText(local, foreign) {
        if (local.doctrine && foreign.doctrine && local.doctrine !== foreign.doctrine) {
            return t('dipIdealConflict') + ": " + t(local.doctrine) + " vs " + t(foreign.doctrine);
        }
        if (local.activeArcKey && local.activeArcKey === foreign.activeArcKey) {
            return t('dipSharedMyth') + ": Synchronized " + local.activeArcKey + " Possession.";
        }
        return "Diplomatic trade routes active. Vibes remain stable.";
    }

    function getCivilizationComparison(local, foreign) {
        let lines = [];
        if (local.doctrine === foreign.doctrine) lines.push("Shared Philosophical Doctrine: " + t(local.doctrine));
        if (local.recentClimate === foreign.recentClimate) lines.push("Synchronized Emotional Weather: " + local.recentClimate);
        else lines.push(t('dipCulturalTension') + ": " + local.recentClimate + " vs " + foreign.recentClimate);
        
        if (local.profilesCount > foreign.profilesCount) lines.push("Higher Population Density detected in local civilization.");
        
        return lines.join('<br>');
    }

    // Check for auto-import from URL
    const urlParams = new URLSearchParams(window.location.search);
    const fedCode = urlParams.get('fed');
    if (fedCode) {
        importCivilization(fedCode);
        // Clean URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('fed');
        window.history.replaceState({}, '', newUrl);
    }

    window.MeowFederation = {
        getLocalCivilizationSnapshot,
        getAllianceType,
        getCivilizationComparison
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFederationUI);
    } else {
        renderFederationUI();
    }

    window.addEventListener('meow:daily:updated', renderFederationUI);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderFederationUI();
    });
})();
