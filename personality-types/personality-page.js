// MeowBTI personality page renderer.
// Reads code from filename + tally from ?t querystring (set by quiz),
// then builds the trading-card result UI inside #personality-content.
//
// Archetype data lives in /data/archetypes.js and must be loaded before this script.

(function () {
    if (!window.MeowArchetypes) {
        console.error('MeowArchetypes not loaded — include data/archetypes.js before personality-page.js');
        return;
    }

    // ─── i18n ────────────────────────────────────────────────
    // All chrome strings live in /data/i18n.js (window.MeowI18n). This file
    // only owns the result-page-specific helpers: archetype `field()` swap.
    if (!window.MeowI18n) {
        console.error('MeowI18n not loaded — include data/i18n.js before personality-page.js');
        return;
    }
    const { getLang, t, withLang } = window.MeowI18n;

    // Per-archetype field swap with EN fallback (data lives on archetype objects).
    function field(p, key) {
        const lang = getLang();
        if (lang === 'th') {
            const thKey = key + 'Th';
            if (p[thKey] != null) return p[thKey];
        }
        return p[key];
    }

    function parseTally() {
        // Format: "C5S3H4D4B5N3R6F2"
        const t = new URLSearchParams(window.location.search).get('t');
        if (!t) return null;
        const tally = { C:0, S:0, H:0, D:0, B:0, N:0, R:0, F:0 };
        const re = /([CSHDBNRF])(\d+)/g;
        let m;
        while ((m = re.exec(t)) !== null) {
            tally[m[1]] = parseInt(m[2], 10) || 0;
        }
        return tally;
    }

    function evenTally() {
        return { C:5, S:5, H:5, D:5, B:5, N:5, R:5, F:5 };
    }

    function getCodeFromUrl() {
        const path = window.location.pathname;
        const fname = path.split('/').pop() || '';
        return fname.replace('.html', '').toUpperCase();
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function imagePath(p) {
        return `../${window.MeowArchetypes.imagePath(p.code)}`;
    }

    function spectrumRows(tally, color) {
        const axes = [
            { left:t('solitary'),  right:t('commanding'), leftKey:"S", rightKey:"C" },
            { left:t('dreamer'),   right:t('hunter'),     leftKey:"D", rightKey:"H" },
            { left:t('nurturing'), right:t('bossy'),      leftKey:"N", rightKey:"B" },
            { left:t('casual'),    right:t('regal'),      leftKey:"F", rightKey:"R" },
        ];
        return axes.map(a => {
            const l = tally[a.leftKey] || 0;
            const r = tally[a.rightKey] || 0;
            const sum = l + r || 1;
            const rightPct = Math.round((r / sum) * 100);
            return `
                <div class="spec-row">
                    <span class="spec-label left">${a.left}</span>
                    <div class="spec-bar">
                        <div class="spec-fill" style="width:${rightPct}%;background:${color}"></div>
                        <div class="spec-marker" style="left:calc(${rightPct}% - 8px);background:#1F1410"></div>
                    </div>
                    <span class="spec-label right">${a.right}</span>
                </div>`;
        }).join('');
    }

    function tradingCard(p) {
        const stamp = Math.floor(100000 + Math.random() * 899999);
        const name = field(p, 'name');
        const tagline = field(p, 'tagline');
        const vibes = field(p, 'vibes');
        return `
        <article class="trading-card" style="background:${p.color}">
            <div class="tc-noise" aria-hidden="true"></div>
            <div class="tc-top">
                <div class="tc-code">${p.code}</div>
                <div class="tc-stamp">
                    <span>${escapeHtml(t('certAuthentic'))}</span>
                    <span>№${stamp}</span>
                </div>
            </div>
            <div class="tc-portrait" style="background:${p.bg}">
                <img class="tc-image" src="${imagePath(p)}" alt="${escapeHtml(`${name} cat illustration`)}" loading="eager" decoding="async">
                <div class="tc-rays" aria-hidden="true">
                    ${Array.from({length:12}).map((_,i) =>
                        `<span style="transform:rotate(${i*30}deg) translateY(-130px);background:${p.color}"></span>`
                    ).join('')}
                </div>
            </div>
            <div class="tc-meta">
                <h1 class="tc-name">${escapeHtml(name)}</h1>
                <p class="tc-tag">"${escapeHtml(tagline)}"</p>
            </div>
            <div class="tc-vibes">
                ${vibes.map(v => `<span class="tc-vibe">${escapeHtml(v)}</span>`).join('')}
            </div>
            <div class="tc-foot">
                <span>meowbti.com</span>
                <span>${escapeHtml(t('oneOfSixteen'))}</span>
            </div>
        </article>`;
    }

    function confetti(p, accent) {
        const colors = [accent, p.color, '#FFB000', '#3DA17A', '#7A5BFF'];
        return `<div class="result-confetti" aria-hidden="true">${
            Array.from({length:18}).map((_,i) =>
                `<span class="confetti-dot" style="left:${(i*53)%100}%;top:${(i*37)%60}%;background:${colors[i%5]};transform:rotate(${(i*47)%360}deg);animation-delay:${i*0.08}s"></span>`
            ).join('')
        }</div>`;
    }

    function rivalTile(p) {
        const r = window.MeowArchetypes.get(p.rival);
        return `
            <a class="rival-tile" href="${withLang(r.code + '.html')}" style="background:${r.color}">
                <div class="rival-tile-meta">
                    <span class="rival-label">${escapeHtml(t('vsRival'))}</span>
                    <h3 class="rival-name">${escapeHtml(field(r, 'name'))}</h3>
                    <span class="rival-code">${r.code} <span aria-hidden="true">→</span></span>
                </div>
                <span class="rival-emoji" aria-hidden="true">${r.emoji}</span>
            </a>`;
    }

    function renderDuringEvents(p) {
        const events = field(p, 'duringEvents');
        if (!events) return '';
        const items = Object.keys(events).map(key => {
            const labelKey = 'event' + key.charAt(0).toUpperCase() + key.slice(1);
            const label = t(labelKey);
            return `
                <div class="during-card">
                    <span class="during-event">${escapeHtml(label)}</span>
                    <p class="during-desc">${escapeHtml(events[key])}</p>
                </div>`;
        }).join('');
        return `
            <section class="module-section">
                <h3 class="module-h">${escapeHtml(t('duringTitle'))}</h3>
                <div class="during-grid">${items}</div>
            </section>`;
    }

    function renderMostLikelyTo(p) {
        const list = field(p, 'mostLikelyTo');
        if (!list) return '';
        return `
            <section class="module-section">
                <h3 class="module-h">${escapeHtml(t('mostLikelyTitle'))}</h3>
                <ul class="likely-list">
                    ${list.map(item => `<li class="likely-item">${escapeHtml(item)}</li>`).join('')}
                </ul>
                <p class="social-bait">${escapeHtml(t('socialBaitFriend'))}</p>
            </section>`;
    }

    function renderSocialCircle(p) {
        const rels = p.relationships;
        if (!rels) return '';
        const keys = [
            { key: 'bestFriend', label: t('relBestFriend') },
            { key: 'chaosDuo', label: t('relChaosDuo') },
            { key: 'soulmate', label: t('relSoulmate') },
            { key: 'nightmare', label: t('relNightmare') }
        ];
        const cards = keys.map(k => {
            const targetCode = rels[k.key];
            const target = window.MeowArchetypes.get(targetCode);
            return `
                <a href="${withLang(target.code + '.html')}" class="rel-card" data-rel-type="${k.key}" data-target-code="${target.code}">
                    <span class="rel-type">${escapeHtml(k.label)}</span>
                    <div class="rel-main">
                        <span class="rel-emoji" aria-hidden="true">${target.emoji}</span>
                        <div class="rel-info">
                            <div class="rel-name">${escapeHtml(field(target, 'name'))}</div>
                            <div class="rel-code">${target.code}</div>
                        </div>
                    </div>
                </a>`;
        }).join('');
        return `
            <section class="module-section">
                <h3 class="module-h">${escapeHtml(t('relTitle'))}</h3>
                <div class="social-circle">${cards}</div>
                <p class="social-bait">${escapeHtml(t('socialBaitGroup'))}</p>
            </section>`;
    }

    function longFormSection(p) {
        const description = field(p, 'description');
        const traits = field(p, 'traits');
        if (!description || !traits) return '';
        const traitsHtml = traits.map(([title, body]) =>
            `<div class="trait-item"><h3>${escapeHtml(title)}</h3><p>${body}</p></div>`
        ).join('');
        return `
            <h2 class="breakdown-title">${escapeHtml(t('fullBreakdown'))}</h2>
            <p class="type-description">${description}</p>
            <h2 class="breakdown-title">${escapeHtml(t('keyTraits'))}</h2>
            <div class="traits-container">${traitsHtml}</div>
        `;
    }

    function copyLink(p) {
        const txt = window.MeowArchetypes.shareCaption(p.code);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(txt).catch(() => {});
        }
    }

    function sharePanel() {
        return `
            <section class="share-panel" id="share-panel">
                <img class="share-thumb" id="share-thumb" alt="">
                <h3>${escapeHtml(t('shareVerdict'))}</h3>
                <p>${escapeHtml(t('sharePromptText'))}</p>
                <div class="share-actions">
                    <label class="share-upload" for="share-photo">
                        <span aria-hidden="true">📸</span>
                        <span id="share-upload-label">${escapeHtml(t('addPhoto'))}</span>
                        <input type="file" id="share-photo" accept="image/*">
                    </label>
                    <button class="big-btn" id="btn-share" type="button">${escapeHtml(t('sharePoster'))}</button>
                </div>
                <div class="share-status" id="share-status" aria-live="polite"></div>
            </section>

            <div class="share-modal" id="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
                <div class="share-modal-card">
                    <h3 id="share-modal-title">${escapeHtml(t('posterTitle'))}</h3>
                    <img class="share-preview" id="share-preview" alt="MeowBTI share poster">
                    <div class="share-modal-actions">
                        <button class="big-btn" id="btn-share-now" type="button">${escapeHtml(t('shareSave'))}</button>
                        <button class="big-btn ghost" id="btn-copy-modal" type="button">${escapeHtml(t('copyCaption'))}</button>
                    </div>
                    <button class="share-modal-close" id="btn-close-modal" type="button">${escapeHtml(t('close'))}</button>
                </div>
            </div>
        `;
    }

    function bindShare(p) {
        const fileInput = document.getElementById('share-photo');
        const uploadLabel = document.getElementById('share-upload-label');
        const thumb = document.getElementById('share-thumb');
        const shareBtn = document.getElementById('btn-share');
        const statusEl = document.getElementById('share-status');
        const modal = document.getElementById('share-modal');
        const preview = document.getElementById('share-preview');
        const shareNow = document.getElementById('btn-share-now');
        const copyModal = document.getElementById('btn-copy-modal');
        const closeModal = document.getElementById('btn-close-modal');

        if (!fileInput || !shareBtn || !window.MeowShare) return;

        let chosenFile = null;
        let lastBlob = null;

        fileInput.addEventListener('change', () => {
            const f = fileInput.files && fileInput.files[0];
            if (!f) return;
            chosenFile = f;
            uploadLabel.textContent = t('changePhoto');
            const url = URL.createObjectURL(f);
            thumb.src = url;
            thumb.classList.add('has-image');
            statusEl.textContent = '';
        });

        const illustrationUrl = imagePath(p);

        async function build() {
            window.MeowTrack && window.MeowTrack('share_clicked', {
                code: p.code, has_user_photo: !!chosenFile,
            });
            statusEl.textContent = t('buildingPoster');
            shareBtn.disabled = true;
            try {
                lastBlob = await window.MeowShare.buildPoster(p, illustrationUrl, chosenFile);
                preview.src = URL.createObjectURL(lastBlob);
                modal.classList.add('open');
                statusEl.textContent = '';
            } catch (e) {
                console.error(e);
                statusEl.textContent = t('somethingWrong');
            } finally {
                shareBtn.disabled = false;
            }
        }

        shareBtn.addEventListener('click', build);

        shareNow.addEventListener('click', async () => {
            if (!lastBlob) return;
            const result = await window.MeowShare.sharePoster(p, lastBlob);
            window.MeowTrack && window.MeowTrack('share_completed', {
                code: p.code, method: result,
            });
            if (result === 'downloaded') {
                statusEl.textContent = t('savedToDownloads');
            } else if (result === 'shared') {
                statusEl.textContent = t('sharedThanks');
            }
            if (result !== 'cancelled') modal.classList.remove('open');
        });

        copyModal.addEventListener('click', () => {
            copyLink(p);
            copyModal.textContent = t('copied');
            setTimeout(() => { copyModal.textContent = t('copyCaption'); }, 1600);
        });

        closeModal.addEventListener('click', () => modal.classList.remove('open'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('open');
        });
    }

    function render() {
        const host = document.getElementById('personality-content');
        if (!host) return;

        const code = getCodeFromUrl();
        const p = window.MeowArchetypes.get(code);
        const tally = parseTally() || evenTally();
        const accent = '#FF5B3B';
        const name = field(p, 'name');
        const tagline = field(p, 'tagline');

        document.title = `${name} (${p.code}) — MeowBTI`;
        // Update meta description for SEO
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `${p.code} — ${name}. ${tagline} MeowBTI`);
        document.documentElement.lang = getLang();
        document.body.style.background = p.bg;

        window.MeowTrack && window.MeowTrack('archetype_viewed', {
            code: p.code, name: p.name, lang: getLang(),
            from_quiz: parseTally() ? true : false,
        });

        host.innerHTML = `
            ${confetti(p, accent)}
            <div class="reveal-line">${escapeHtml(t('revealLine'))}</div>
            ${tradingCard(p)}

            <div class="result-actions">
                <button class="big-btn" id="btn-copy" type="button">${escapeHtml(t('copyLink'))}</button>
                <a href="${withLang('../quiz.html')}" class="big-btn ghost">${escapeHtml(t('retake'))}</a>
                <a href="${withLang('../personality-types.html')}" class="big-btn ghost">${escapeHtml(t('all16'))}</a>
            </div>

            ${sharePanel()}

            <section class="result-grid">
                <div class="rg-block">
                    <h3 class="rg-h">${escapeHtml(t('famouslySays'))}</h3>
                    <p class="rg-quote">"${escapeHtml(field(p, 'famouslySays'))}"</p>
                </div>
                <div class="rg-block">
                    <h3 class="rg-h">${escapeHtml(t('spectrum'))}</h3>
                    <div class="spectrum">${spectrumRows(tally, p.color)}</div>
                </div>
                <div class="rg-block">
                    <h3 class="rg-h">${escapeHtml(t('kindredSpirits'))}</h3>
                    <ul class="kindred">
                        ${field(p, 'kindredSpirits').map(k => `<li>${escapeHtml(k)}</li>`).join('')}
                    </ul>
                </div>
                <div class="rg-block flags">
                    <div>
                        <h3 class="rg-h">${escapeHtml(t('redFlag'))}</h3>
                        <p>${escapeHtml(field(p, 'redFlags'))}</p>
                    </div>
                    <div>
                        <h3 class="rg-h">${escapeHtml(t('greenFlag'))}</h3>
                        <p>${escapeHtml(field(p, 'greenFlags'))}</p>
                    </div>
                </div>
            </section>

            ${renderDuringEvents(p)}
            ${renderMostLikelyTo(p)}
            ${renderSocialCircle(p)}

            ${rivalTile(p)}

            ${longFormSection(p)}

            <section class="result-affiliate">
                <h3 class="result-affiliate-h">${escapeHtml(t('picksFor', name))}</h3>
                <div class="product-grid">
                    <a href="${withLang('../index.html#affiliate-products')}" rel="sponsored noopener" class="product-card" style="--product-bg:${p.bg}">
                        <span class="product-emoji" aria-hidden="true">🛏️</span>
                        <h3>The Spot™ — premium nap zone</h3>
                        <p class="product-blurb">A bed they will pretend to ignore for 3 days, then never leave.</p>
                        <span class="product-cta">See picks →</span>
                    </a>
                    <a href="${withLang('../index.html#affiliate-products')}" rel="sponsored noopener" class="product-card" style="--product-bg:#FFEFC2">
                        <span class="product-emoji" aria-hidden="true">🪶</span>
                        <h3>Wand of personal relevance</h3>
                        <p class="product-blurb">Engineered for the "I have to murder this" personality types.</p>
                        <span class="product-cta">See picks →</span>
                    </a>
                </div>
            </section>

            <section class="result-cta">
                <h2 class="cta-h">${escapeHtml(t('ctaH'))}</h2>
                <div class="cta-actions">
                    <a href="${withLang('../quiz.html')}" class="big-btn" style="background:${p.color};color:#fff">${escapeHtml(t('analyzeAnother'))}</a>
                    <a href="${withLang('../personality-types.html')}" class="big-btn ghost">${escapeHtml(t('browseAll'))}</a>
                </div>
            </section>
        `;

        const copyBtn = document.getElementById('btn-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyLink(p);
                window.MeowTrack && window.MeowTrack('copy_link', { code: p.code });
                const old = copyBtn.textContent;
                copyBtn.textContent = t('copied');
                setTimeout(() => { copyBtn.textContent = old; }, 1600);
            });
        }

        document.querySelectorAll('.rel-card').forEach(card => {
            card.addEventListener('click', () => {
                window.MeowTrack && window.MeowTrack('relationship_clicked', {
                    from_code: p.code,
                    target_code: card.dataset.targetCode,
                    rel_type: card.dataset.relType
                });
            });
        });

        bindShare(p);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
