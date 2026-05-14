/**
 * MeowBTI v3 Dashboard Logic
 * Handles rendering the "My Cat Family" section on index.html.
 */
(function() {
    const section = document.getElementById('family-dashboard');
    const grid = document.getElementById('family-grid');

    if (!section || !grid || !window.MeowStore || !window.MeowI18n) return;

    const { t, withLang } = window.MeowI18n;

    function removeProfile(id, name) {
        if (confirm(t('confirmRemove', name))) {
            window.MeowStore.removeFamilyProfile(id);
            render();
        }
    }

    function formatDate(isoString) {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    function getDailyHash(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function render() {
        const profiles = window.MeowStore.getFamily();
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        
        if (profiles.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        grid.innerHTML = '';

        profiles.forEach(p => {
            const card = document.createElement('div');
            card.className = 'family-card-wrapper';
            
            const archetype = window.MeowArchetypes ? window.MeowArchetypes.get(p.code) : null;
            const imgPath = archetype ? `assets/personalities/${archetype.code.toLowerCase()}-${archetype.slug}.webp` : '';
            
            // Get daily energy for card preview
            let dailyPreview = '';
            if (archetype && archetype.dailyObservations) {
                const daily = archetype.dailyObservations;
                const idx = getDailyHash(dateStr + archetype.code) % daily.length;
                const lang = (window.MeowI18n && window.MeowI18n.getLang()) || 'en';
                const obs = daily[idx][lang] || daily[idx].en;
                dailyPreview = `<div class="fc-daily-preview">“${obs}”</div>`;
            }

            // Reconstruct URL with tally precision and name
            const resultPage = p.subject === 'human' ? 'human-result.html' : 'result.html';
            let resultUrl = `${resultPage}?type=${p.code}&subject=${p.subject}&name=${encodeURIComponent(p.name)}`;
            if (p.tally) resultUrl += `&t=${p.tally}`;

            card.innerHTML = `
                <div class="family-card">
                    <button class="family-card-remove" aria-label="Remove from family">✕</button>
                    <a href="${resultUrl}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                        <div class="fc-portrait">
                            ${imgPath ? `<img src="${imgPath}" class="fc-image" alt="${p.archetypeName}">` : ''}
                            <span class="fc-type-tag">${p.subject}</span>
                        </div>
                        <div class="fc-meta">
                            <div class="fc-name">${p.name}</div>
                            <div class="fc-archetype">${p.archetypeName}</div>
                            ${dailyPreview}
                        </div>
                        <div class="fc-footer">
                            <span class="fc-code">${p.code}</span>
                            <span class="fc-date">${formatDate(p.savedAt)}</span>
                        </div>
                    </a>
                </div>
            `;

            card.querySelector('.family-card-remove').onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeProfile(p.id, p.name);
            };

            grid.appendChild(card);
        });

        if (profiles.length >= 2 && window.MeowCompatibility) {
            renderDynamics(profiles);
        }

        // Render Drama Feed if 2+ members
        if (profiles.length >= 2 && window.MeowDramaFeed) {
            window.MeowDramaFeed.render(profiles, 'family-drama-feed');
        } else {
            const feed = document.getElementById('family-drama-feed');
            if (feed) feed.style.display = 'none';
        }
    }

    function renderDynamics(profiles) {
        const existingDynamics = document.getElementById('family-dynamics');
        if (existingDynamics) existingDynamics.remove();

        const dynamics = document.createElement('div');
        dynamics.id = 'family-dynamics';
        dynamics.className = 'family-dynamics';
        
        const stats = window.MeowCompatibility.getStats(profiles);
        const report = window.MeowCompatibility.getFullReport(profiles);

        dynamics.innerHTML = `
            <h3 class="dynamic-h">${t('dynamicsTitle')}</h3>
            
            <div class="pairs-grid">
                ${report.pairs.map(p => {
                    const archA = window.MeowArchetypes.get(p.a.code);
                    const archB = window.MeowArchetypes.get(p.b.code);
                    const imgA = `assets/personalities/${archA.code.toLowerCase()}-${archA.slug}.webp`;
                    const imgB = `assets/personalities/${archB.code.toLowerCase()}-${archB.slug}.webp`;
                    
                    let specialTag = '';
                    if (p.isBest) specialTag = `<span class="pair-tag best">${t('tagBestMatch')}</span>`;
                    if (p.isChaotic) specialTag = `<span class="pair-tag chaos">${t('tagMostChaotic')}</span>`;

                    return `
                        <div class="pair-card">
                            <div class="pair-avatars">
                                <div class="pair-avatar"><img src="${imgA}" alt="${p.a.name}"></div>
                                <div class="pair-avatar"><img src="${imgB}" alt="${p.b.name}"></div>
                            </div>
                            <div class="pair-info">
                                ${specialTag}
                                <span class="pair-vibe">${t(p.vibeKey)}</span>
                                <p class="pair-desc">${p.a.name} + ${p.b.name}: ${p.desc}</p>
                                <div class="pair-score-bar">
                                    <div class="pair-score-fill" style="width:${p.score}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="household-stats">
                <div class="stat-item">
                    <span class="stat-label">${t('statsChaos')}</span>
                    <span class="stat-value">${stats.chaosLevel}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${t('statsDominant')}</span>
                    <span class="stat-value">${stats.dominantAxis}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${t('statsTotal')}</span>
                    <span class="stat-value">${stats.memberCount}</span>
                </div>
                ${report.menace ? `
                    <div class="stat-item menace">
                        <span class="stat-label">${t('tagHouseholdMenace')}</span>
                        <span class="stat-value">${report.menace.name}</span>
                    </div>
                ` : ''}
            </div>

            <div style="text-align:center; margin-top:32px;">
                <button id="btn-family-poster" class="big-btn accent">
                    <span aria-hidden="true">📸</span> ${t('posterDownloadBtn')}
                </button>
            </div>
        `;

        grid.after(dynamics);

        document.getElementById('btn-family-poster').onclick = () => {
            if (window.MeowFamilyShare) {
                window.MeowFamilyShare.generatePoster(profiles);
            }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family') render();
    });
})();
