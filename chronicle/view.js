/**
 * Public Chronicle Viewer v1
 * Reconstructs and renders public share cards from URL payloads.
 */
(function() {
    const mount = document.getElementById('card-mount');
    if (!mount) return;

    const sanitize = (window.MeowSanitize) || ((s) => s);
    const { t, getLang } = window.MeowI18n || { t: (k) => k, getLang: () => 'en' };

    function getPayload() {
        const urlParams = new URLSearchParams(window.location.search);
        const p = urlParams.get('p');
        if (!p) return null;
        try {
            return JSON.parse(decodeURIComponent(escape(atob(p))));
        } catch (e) {
            console.error("Failed to parse chronicle payload", e);
            return null;
        }
    }

    function updateMeta(card) {
        const title = `MeowBTI | ${card.title}`;
        const desc = card.desc || t('chronicleSharedBy');
        document.title = title;
        
        // Update OG tags
        const meta = {
            'og:title': title,
            'og:description': desc
        };
        for (const [prop, val] of Object.entries(meta)) {
            let el = document.querySelector(`meta[property="${prop}"]`);
            if (el) el.setAttribute('content', val);
        }
    }

    function render(card) {
        if (!card) {
            mount.innerHTML = `<div class="cinematic-card dark" style="justify-content:center; text-align:center;">
                <h2 class="card-title">Chronicle Lost</h2>
                <p class="card-content">The record could not be retrieved from the void.</p>
            </div>`;
            return;
        }

        updateMeta(card);

        // Sanitize strings
        const title = sanitize(card.title);
        const desc = sanitize(card.desc || '');
        const footer = sanitize(card.footer || '');
        const doctrine = sanitize(card.doctrine || '');
        const infrastructure = sanitize(card.infrastructure || '');
        const survival = sanitize(card.survival || '');
        const status = sanitize(card.status || '');
        const aura = sanitize(card.aura || '');
        const history = sanitize(card.history || '');

        mount.innerHTML = `
            <div class="card-blur-bg" style="background: radial-gradient(circle, ${card.dark ? '#9B59B6' : '#FF5B3B'} 0%, transparent 70%);"></div>
            <div class="cinematic-card ${card.dark ? 'dark' : ''} animate-fade-in" style="width:100%; height:100%; box-sizing:border-box;">
                <h2 class="card-title">${title}</h2>
                <div class="card-content">
                    ${card.type === 'civ' ? `
                        <div class="poster-metadata">
                            <div class="pm-item">
                                <span class="pm-label">${t('civDoctrine')}</span>
                                <span class="pm-val">${doctrine}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('civInfrastructure')}</span>
                                <span class="pm-val">${infrastructure}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('civSurvivalKey')}</span>
                                <span class="pm-val">${survival}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${card.type === 'relic' ? `
                        <div style="font-size:5rem; margin-bottom:24px; text-align:center;">${card.icon}</div>
                        <div class="poster-metadata">
                            <div class="pm-item">
                                <span class="pm-label">${t('posStatus')}</span>
                                <span class="pm-val">${status}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('posAura')}</span>
                                <span class="pm-val">${aura}</span>
                            </div>
                            <div class="pm-item">
                                <span class="pm-label">${t('posHistory')}</span>
                                <span class="pm-val">${history}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${card.type === 'relationship' ? `
                        <div class="poster-metadata">
                            <div class="pm-item">
                                <span class="pm-label">Multiplayer Status</span>
                                <span class="pm-val">Synchronized</span>
                            </div>
                        </div>
                    ` : ''}
                    ${card.type === 'treaty' ? `
                        <div class="poster-metadata">
                            <div class="pm-item">
                                <span class="pm-label">Diplomatic Status</span>
                                <span class="pm-val">Ratified & Bound</span>
                            </div>
                        </div>
                    ` : ''}
                    ${desc ? `<p>${desc}</p>` : ''}
                </div>
                <div class="card-footer" style="border-top: 1px dashed ${card.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}">
                    <p style="font-family:var(--font-mono); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; opacity:0.6;">
                        ${footer || t('chronicleSharedBy')}
                    </p>
                </div>
            </div>
        `;

        if (window.MeowTrack) {
            window.MeowTrack('chronicle_public_view', {
                type: card.type,
                lang: getLang()
            });
            window.MeowTrack('public_share_open', {
                type: card.type,
                lang: getLang()
            });
        }
    }

    const payload = getPayload();
    render(payload);

    // Analytics for CTA
    document.querySelector('.public-cta-box a').addEventListener('click', () => {
        if (window.MeowTrack) {
            window.MeowTrack('share_conversion_cta', {
                source: 'public_chronicle',
                lang: getLang()
            });
        }
    });

})();
