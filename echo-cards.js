/**
 * MeowBTI Emotional Relic Echo Cards v1
 * Manages the creation and rendering of collectible postcards.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

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
            // Insert after museum echo section if exists
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
                ${cards.slice().reverse().map(c => `
                    <div class="echo-postcard" title="${c.lore}">
                        <div class="ep-stamp">${c.icon || '✉️'}</div>
                        <div style="flex:1;">
                            <span class="ep-type">${t('echoTypePostcard')}</span>
                            <div class="ep-title">${c.title}</div>
                        </div>
                        <div class="ep-date">${new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                        <button class="micro-share-icon mini" data-type="echo_card" data-text="I earned an Echo Postcard: ${c.title}. ${c.lore}">📤</button>
                    </div>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'relic_echoes',
                        content_type: 'postcard',
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
                window.MeowTrack && window.MeowTrack('echo_card_shared', { text: btn.getAttribute('data-text'), lang: getLang() });
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
