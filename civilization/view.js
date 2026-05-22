/**
 * Public Civilization Profile Viewer v1
 * Reconstructs and renders public identity profiles from URL payloads.
 */
(function() {
    const mount = document.getElementById('profile-mount');
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
            console.error("Failed to parse civilization payload", e);
            return null;
        }
    }

    function updateMeta(data) {
        const title = `${data.seasonTitle || 'Emotional Civilization'} | MeowBTI`;
        const desc = `${data.doctrine || 'Parallel Play Civilization'}. ${data.reputation || 'Historically Loud Yet Protective'}.`;
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

    function render(data) {
        if (!data) {
            mount.innerHTML = `<div class="profile-hero">
                <h1 class="civ-banner">Civilization Lost</h1>
                <span class="civ-reputation">The records have vanished into the void.</span>
            </div>`;
            return;
        }

        updateMeta(data);

        mount.innerHTML = `
            <section class="profile-hero">
                <h1 class="civ-banner animate-fade-in">${sanitize(data.seasonTitle)}</h1>
                <span class="civ-reputation animate-fade-in">${sanitize(data.reputation)}</span>
            </section>

            <div class="profile-grid">
                <div class="profile-module animate-fade-in" style="animation-delay: 0.1s">
                    <span class="module-label">${t('profEra')}</span>
                    <div class="module-val">${sanitize(data.era)}</div>
                </div>

                <div class="profile-module animate-fade-in" style="animation-delay: 0.2s">
                    <span class="module-label">${t('profDoctrine')}</span>
                    <div class="module-val">${sanitize(data.doctrine)}</div>
                </div>

                <div class="profile-module animate-fade-in" style="animation-delay: 0.3s">
                    <span class="module-label">${t('profRelic')}</span>
                    <div class="module-val">${data.relicIcon} ${sanitize(data.relicName)}</div>
                </div>

                <div class="profile-module animate-fade-in" style="animation-delay: 0.4s">
                    <span class="module-label">${t('profPhilosophy')}</span>
                    <div class="module-val">${sanitize(data.philosophy)}</div>
                </div>

                <div class="profile-module animate-fade-in" style="animation-delay: 0.5s">
                    <span class="module-label">${t('profInfra')}</span>
                    <div class="module-val">${sanitize(data.infrastructure)}</div>
                </div>

                <div class="profile-module animate-fade-in" style="animation-delay: 0.6s">
                    <span class="module-label">${t('profFederation')}</span>
                    <div class="module-val">${sanitize(data.federation)}</div>
                    ${data.embargoes ? `<div class="module-desc" style="color:#ff3b30; font-weight:700;">⚠ ${sanitize(data.embargoes)} Active Embargoes</div>` : ''}
                </div>

                ${data.alignment ? `
                    <div class="profile-module animate-fade-in" style="animation-delay: 0.65s">
                        <span class="module-label">${t('govAlignment')}</span>
                        <div class="module-val" style="color:#D4AF37;">${sanitize(data.alignment)}</div>
                    </div>
                ` : ''}

                ${data.policies && data.policies.length > 0 ? `
                    <div class="profile-module animate-fade-in" style="animation-delay: 0.68s">
                        <span class="module-label">${t('decActivePolicies')}</span>
                        <div class="module-desc" style="opacity:1;">
                            ${data.policies.map(p => `<span class="trait-badge" style="background:var(--paper); color:var(--ink); border-color:var(--ink);">${sanitize(p)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                ${data.archScore ? `
                    <div class="profile-module animate-fade-in" style="animation-delay: 0.7s">
                        <span class="module-label">${t('archScore')}</span>
                        <div class="module-val">${sanitize(data.archScore)}</div>
                        <div class="module-desc">${sanitize(data.archStatus || '')}</div>
                    </div>
                ` : ''}
            </div>
        `;

        if (window.MeowTrack) {
            window.MeowTrack('civilization_profile_view', {
                season: data.seasonKey,
                doctrine: data.doctrineKey,
                lang: getLang()
            });
        }
    }

    const payload = getPayload();
    render(payload);

})();
