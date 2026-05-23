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
        
        // Deterministic pool based on type
        const pool = {
            'unlock': [t('memArchFootnote'), t('memCivAnnotation')],
            'recovery': [t('memRecovery', dayNum), t('memRitualMemory')],
            'relic_return': [t('memRelicNote'), t('memAtmospheric', dayNum)],
            'ascension': [t('memCivAnnotation'), t('memGovResidue')],
            'anniversary': [t('memAtmospheric', dayNum), t('memRitualMemory')],
            'public_share': [t('memFedArchive'), t('memCivAnnotation')],
            'gift_receipt': [t('memFedArchive'), t('memRelicNote')]
        };

        const choices = pool[card.type] || [t('memAtmospheric', dayNum)];
        // Seeded selection
        const seed = card.card_key.length + new Date(card.created_at).getTime();
        return choices[seed % choices.length];
    }

    function renderEchoPostcards() {
        const host = window.MeowOS ? window.MeowOS.getLayer('memory') : document.getElementById('family-content');
        if (!host) return;

        const cards = window.MeowStore.getEchoCards();
        if (cards.length === 0) return;

        let container = document.getElementById('echo-postcards-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'echo-postcards-section';
            container.className = 'echo-postcards-container animate-fade-in';
            const echoes = document.getElementById('museum-echoes-section');
            if (echoes) echoes.after(container);
            else host.append(container);
        }

        container.innerHTML = `
            <div class="echo-postcards-header">
                <h3 class="echo-postcards-h3">${t('echoCardTitle')}</h3>
                <p class="echo-postcards-sub">${t('echoCardSubtitle')}</p>
            </div>
            <div class="echo-cards-grid">
                ${cards.slice().reverse().map((c, i) => {
                    const backText = getFlipSideMemory(c);
                    const isAncient = (Date.now() - new Date(c.created_at).getTime()) > 7 * 86400000;
                    const id = `ep-${c.card_key.replace(/[^a-z0-9]/gi, '-')}`;
                    
                    return `
                    <div class="echo-postcard ${isAncient ? 'ancient' : ''}" id="${id}">
                        <div class="ep-inner">
                            <!-- FRONT -->
                            <div class="ep-front">
                                <div class="ep-stamp">${c.icon || '✉️'}</div>
                                <div style="flex:1; text-align:left;">
                                    <span class="ep-type">${t('echoTypePostcard')}</span>
                                    <div class="ep-title">${c.title}</div>
                                    <div class="ep-label-tag">${i === 0 ? 'Recently Remembered' : ''}</div>
                                </div>
                                <div class="ep-date">${new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                <button class="micro-share-icon mini" data-side="front" data-text="I earned an Echo Postcard: ${c.title}. ${c.lore}">📤</button>
                            </div>
                            <!-- BACK -->
                            <div class="ep-back">
                                <span class="ep-type">${t('memRecoveredTitle')}</span>
                                <div class="ep-fragment-text">"${backText}"</div>
                                <div class="ep-archive-num">#${id.slice(-6).toUpperCase()}</div>
                                <button class="micro-share-icon mini" data-side="back" data-text="Recovered Archive Fragment: ${backText}">📤</button>
                            </div>
                        </div>
                    </div>
                `;}).join('')}
            </div>
        `;

        container.querySelectorAll('.echo-postcard').forEach(card => {
            card.onclick = () => {
                card.classList.toggle('flipped');
                if (card.classList.contains('flipped') && window.MeowTrack) {
                    window.MeowTrack('echo_card_flipped', { card_id: card.id, lang: getLang() });
                }
            };
        });

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const side = btn.getAttribute('data-side');
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'relic_echoes',
                        content_type: `postcard_${side}`,
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
                if (window.MeowTrack) {
                    window.MeowTrack(side === 'back' ? 'memory_fragment_shared' : 'echo_card_shared', { 
                        text: btn.getAttribute('data-text'), 
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
        const { card_key, type, title, lore, icon } = e.detail;
        if (!card_key || !title) return;

        if (window.MeowStore.saveEchoCard({ card_key, type, title, lore, icon })) {
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
