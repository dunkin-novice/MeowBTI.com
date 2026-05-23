/**
 * MeowBTI Emotional Relic Echo Cards v1
 * Manages the creation and rendering of collectible postcards.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    function getFlipSideMemory(card) {
        const history = window.MeowDaily.getHistory ? window.MeowDaily.getHistory() : [];
        const dayNum = history.length || '??';
        
        // Use card_key and created_at for seed
        const seedStr = (card.card_key || '') + (card.created_at || '');
        let seed = 0;
        for (let i = 0; i < seedStr.length; i++) seed += seedStr.charCodeAt(i);

        // Deterministic pool based on type
        const pool = {
            'unlock': [t('memFlipUnlock1'), t('memFlipUnlock2'), t('memArchFootnote'), t('memCivAnnotation')],
            'recovery': [t('memFlipRecovery1'), t('memFlipRecovery2'), t('memRecovery', dayNum), t('memRitualMemory')],
            'relic_return': [t('memFlipRelic1'), t('memFlipRelic2'), t('memRelicNote'), t('memAtmospheric', dayNum)],
            'ascension': [t('memFlipAscension1'), t('memFlipAscension2'), t('memCivAnnotation'), t('memGovResidue')],
            'anniversary': [t('memFlipAnniversary1'), t('memFlipAnniversary2'), t('memAtmospheric', dayNum), t('memRitualMemory')],
            'public_share': [t('memFlipPublic1'), t('memFlipPublic2'), t('memFedArchive'), t('memCivAnnotation')],
            'gift_receipt': [t('memFlipGift1'), t('memFlipGift2'), t('memFedArchive'), t('memRelicNote')]
        };

        const choices = pool[card.type] || [t('memAtmospheric', dayNum)];
        const fragment = choices[seed % choices.length];

        // Track generation if it's the first time we see this card in this session
        if (!window._recoveredMemoriesTracked) window._recoveredMemoriesTracked = new Set();
        if (!window._recoveredMemoriesTracked.has(card.card_key)) {
            window.MeowTrack && window.MeowTrack('recovered_memory_generated', { card_type: card.type, fragment_length: fragment.length });
            window._recoveredMemoriesTracked.add(card.card_key);
        }

        return fragment;
    }

    function renderEchoPostcards() {
        const host = window.MeowOS ? window.MeowOS.getLayer('memory') : document.getElementById('family-content');
        if (!host) return;

        const cards = window.MeowStore.getEchoCards();
        if (cards.length === 0) return;

        // Calculate Special Labels
        const oldestCard = cards[0];
        const newestCard = cards[cards.length - 1];
        
        // Extract implicit keys if not present
        const processedCards = cards.map(c => ({
            ...c,
            relic_key: c.relic_key || (c.card_key.startsWith('relic_recover_') ? c.card_key.replace('relic_recover_', '') : null),
            rank_key: c.rank_key || (c.card_key.startsWith('ascension_') ? c.card_key.replace('ascension_', '') : null)
        }));

        const relicCounts = {};
        processedCards.forEach(c => {
            if (c.relic_key) relicCounts[c.relic_key] = (relicCounts[c.relic_key] || 0) + 1;
        });
        const mostReferencedRelicKey = Object.keys(relicCounts).sort((a,b) => relicCounts[b] - relicCounts[a])[0];

        let container = document.getElementById('echo-postcards-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'echo-postcards-section';
            container.className = 'echo-postcards-container animate-fade-in';
            const echoes = document.getElementById('museum-echoes-section');
            if (echoes) echoes.after(container);
            else host.append(container);
        }

        const reversedCards = processedCards.slice().reverse();

        container.innerHTML = `
            <div class="echo-postcards-header">
                <h3 class="echo-postcards-h3">${t('echoCardTitle')}</h3>
                <p class="echo-postcards-sub">${t('echoCardSubtitle')}</p>
            </div>
            <div class="echo-cards-grid">
                ${reversedCards.map((c, i) => {
                    const backText = getFlipSideMemory(c);
                    const ageDays = (Date.now() - new Date(c.created_at).getTime()) / 86400000;
                    const isAncient = ageDays > 7;
                    const isAntique = ageDays > 14;
                    const isArchival = ageDays > 30;
                    const id = `ep-${c.card_key.replace(/[^a-z0-9]/gi, '-')}`;
                    
                    let label = '';
                    if (cards.length >= 3) {
                        // Priority: Newest > Oldest > Most Referenced
                        if (c.card_key === newestCard.card_key) label = t('labelRecentlyRemembered');
                        else if (c.card_key === oldestCard.card_key) label = t('labelOldestMemory');
                        else if (c.relic_key && c.relic_key === mostReferencedRelicKey) label = t('labelMostReferencedRelic');
                    } else if (i === 0) {
                        label = t('labelRecentlyRemembered');
                    }
                    
                    const agingClass = isArchival ? 'archival' : (isAntique ? 'antique' : (isAncient ? 'ancient' : ''));
                    
                    return `
                    <div class="echo-postcard ${agingClass}" id="${id}" data-type="${c.type}" data-age="${Math.floor(ageDays)}">
                        <div class="ep-inner">
                            <!-- FRONT -->
                            <div class="ep-front">
                                <div class="ep-stamp">${c.icon || '✉️'}</div>
                                <div style="flex:1; text-align:left;">
                                    <span class="ep-type">${t('echoTypePostcard')}</span>
                                    <div class="ep-title">${c.title}</div>
                                    ${label ? `<div class="ep-label-tag">${label}</div>` : ''}
                                </div>
                                <div class="ep-date">${new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                <div class="ep-share-cluster">
                                    <button class="micro-share-icon mini" data-side="front" title="Share Front" data-text="${t('echoTypePostcard')}: ${c.title}. ${c.lore}">📤</button>
                                    <button class="micro-share-icon mini both" data-side="both" title="Share Both Sides" data-text="${c.title} // ${backText}">📖</button>
                                    <button class="micro-share-icon mini trans" data-type="postcard" data-title="${c.title}" data-lore="${backText}" data-icon="${c.icon || '✉️'}" title="${t('transTitle')}">📡</button>
                                </div>
                            </div>
                            <!-- BACK -->
                            <div class="ep-back">
                                <span class="ep-type">${t('memRecoveredTitle')}</span>
                                <div class="ep-fragment-text">"${backText}"</div>
                                <div class="ep-archive-num">#${id.slice(-6).toUpperCase()}</div>
                                <div class="ep-share-cluster">
                                    <button class="micro-share-icon mini" data-side="back" title="Share Back" data-text="${t('memRecoveredTitle')}: ${backText}">📤</button>
                                    <button class="micro-share-icon mini trans" data-type="postcard_memory" data-title="${c.title}" data-lore="${backText}" data-icon="📜" title="${t('transTitle')}">📡</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;}).join('')}
            </div>
        `;

        container.querySelectorAll('.echo-postcard').forEach(card => {
            card.onclick = () => {
                const wasFlipped = card.classList.contains('flipped');
                card.classList.toggle('flipped');
                const isFlipped = card.classList.contains('flipped');
                
                if (isFlipped && !wasFlipped) {
                    if (window.MeowTrack) {
                        window.MeowTrack('echo_card_flipped', { card_id: card.id, card_type: card.dataset.type, lang: getLang() });
                        window.MeowTrack('memory_fragment_viewed', { card_id: card.id, age: card.dataset.age });
                    }
                    if (card.classList.contains('ancient') || card.classList.contains('antique') || card.classList.contains('archival')) {
                        window.MeowTrack && window.MeowTrack('archival_card_viewed', { card_id: card.id, aging: card.classList.contains('archival') ? 'archival' : (card.classList.contains('antique') ? 'antique' : 'ancient') });
                    }
                }
            };
        });

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                
                if (btn.classList.contains('trans')) {
                    if (window.MeowTransmissions) {
                        window.MeowTransmissions.broadcast({
                            type: btn.getAttribute('data-type'),
                            title: btn.getAttribute('data-title'),
                            lore: btn.getAttribute('data-lore'),
                            icon: btn.getAttribute('data-icon')
                        });
                    }
                    return;
                }

                const side = btn.getAttribute('data-side');
                const shareText = btn.getAttribute('data-text');
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'relic_echoes',
                        content_type: `postcard_${side}`,
                        text: shareText,
                        route: '/'
                    });
                }
                if (window.MeowTrack) {
                    const eventName = side === 'back' ? 'memory_fragment_shared' : (side === 'both' ? 'echo_card_combined_shared' : 'echo_card_shared');
                    window.MeowTrack(eventName, { 
                        text: shareText, 
                        lang: getLang() 
                    });
                }
            };
        });

        if (window.MeowTrack) {
            window.MeowTrack('echo_archive_opened', { card_count: cards.length, lang: getLang() });
        }
    }

    // Event listener for creating cards
    window.addEventListener('meow:echo:create', (e) => {
        const { card_key, type, title, lore, icon, source_event, relic_key, rank_key } = e.detail;
        if (!card_key || !title) return;

        if (window.MeowStore.saveEchoCard({ card_key, type, title, lore, icon, source_event, relic_key, rank_key })) {
            renderEchoPostcards();
            window.MeowTrack && window.MeowTrack('echo_card_created', { card_type: type, source_event: card_key, lang: getLang() });
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderEchoPostcards);
    } else {
        renderEchoPostcards();
    }

    window.addEventListener('meow:daily:updated', renderEchoPostcards);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family') renderEchoPostcards();
    });
})();
