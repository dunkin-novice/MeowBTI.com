// MeowBTI personality page renderer.
// Handles two distinct views:
// 1. Quiz Result View (/result.html): Personalized, personalized, shareable.
// 2. Meaning View (/personality-types/CODE.html): Evergreen, SEO-canonical.
//
// Archetype data lives in /data/archetypes.js and must be loaded before this script.

(function () {
    if (!window.MeowArchetypes) {
        console.error('MeowArchetypes not loaded — include data/archetypes.js before personality-page.js');
        return;
    }

    // ─── i18n ────────────────────────────────────────────────
    if (!window.MeowI18n) {
        console.error('MeowI18n not loaded — include data/i18n.js before personality-page.js');
        return;
    }
    const { getLang, t, withLang } = window.MeowI18n;

    const isResultPage = window.location.pathname.includes('result.html') || window.location.pathname.includes('human-result.html');
    const isHumanPage = window.location.pathname.includes('/human-types/') || window.location.pathname.includes('human-result.html');

    // Per-archetype field swap with EN fallback (data lives on archetype objects).
    function field(p, key) {
        const lang = getLang();
        const subject = getSubject();
        const isHuman = subject === 'human';

        if (lang === 'th') {
            const thKey = key + 'Th';
            if (isHuman) {
                const humanThKey = key + 'HumanTh';
                if (p[humanThKey] != null) return p[humanThKey];
            }
            if (p[thKey] != null) return p[thKey];
        }
        
        if (isHuman) {
            const humanKey = key + 'Human';
            if (p[humanKey] != null) return p[humanKey];
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

    function getCode() {
        const params = new URLSearchParams(window.location.search);
        const typeParam = params.get('type');
        if (typeParam) return typeParam.toUpperCase();

        const path = window.location.pathname;
        const fname = path.split('/').pop() || '';
        const code = fname.replace('.html', '').toUpperCase();
        if (code === 'RESULT') return '';
        return code;
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
        const root = isResultPage ? '' : '../';
        return `${root}${window.MeowArchetypes.imagePath(p.code)}`;
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

    function tradingCard(p, displayName = '') {
        const stamp = Math.floor(100000 + Math.random() * 899999);
        const archetypeName = field(p, 'name');
        const cardHeading = displayName || archetypeName;
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
                <img class="tc-image" src="${imagePath(p)}" alt="${escapeHtml(`${archetypeName} cat illustration`)}" loading="eager" decoding="async">
                <div class="tc-rays" aria-hidden="true">
                    ${Array.from({length:12}).map((_,i) =>
                        `<span style="transform:rotate(${i*30}deg) translateY(-130px);background:${p.color}"></span>`
                    ).join('')}
                </div>
            </div>
            <div class="tc-meta">
                <h1 class="tc-name">${escapeHtml(cardHeading)}</h1>
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
        const subject = getSubject();
        const isHuman = subject === 'human';
        const root = isHuman ? 'human-types/' : (isResultPage ? 'personality-types/' : '');
        
        return `
            <a class="rival-tile" href="${withLang(root + r.code + '.html')}" style="background:${r.color}">
                <div class="rival-tile-meta">
                    <span class="rival-label">${escapeHtml(t('vsRival'))}</span>
                    <h3 class="rival-name">${escapeHtml(field(r, 'name'))}</h3>
                    <span class="rival-code">${r.code} <span aria-hidden="true">→</span></span>
                </div>
                <span class="rival-emoji" aria-hidden="true">${r.emoji}</span>
            </a>`;
    }

    function renderDailyFeed(p) {
        const subject = getSubject();
        const isHuman = subject === 'human';
        const daily = isHuman ? (p.dailyObservationsHuman || p.dailyObservations) : p.dailyObservations;
        
        if (!daily || daily.length === 0) return '';

        // Deterministic seed: date + code
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const seed = dateStr + p.code;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        const idx = Math.abs(hash) % daily.length;
        const entry = daily[idx];
        const lang = getLang();
        const text = entry[lang] || entry.en;

        const displayName = getDisplayName();
        const archetypeName = field(p, 'name');
        const vTitle = displayName ? t('dailyVibeIs', displayName, archetypeName) : t('dailyTitle');

        window.MeowTrack && window.MeowTrack(isHuman ? 'human_daily_view' : 'daily_feed_view', {
            archetype_code: p.code,
            language: lang,
            page_context: isResultPage ? 'result' : 'meaning',
            has_name: !!displayName
        });

        return `
            <section class="module-section daily-feed-section">
                <div class="daily-header">
                    <h3 class="module-h">${escapeHtml(vTitle)}</h3>
                    <span class="daily-badge">${escapeHtml(t('dailyUpdated'))}</span>
                </div>
                <div class="daily-card-v1">
                    <p class="daily-obs">“${escapeHtml(text)}”</p>
                    <div class="daily-footer">
                        <button class="card-share-btn" data-share-type="daily" data-share-title="${escapeHtml(t('dailyTitle'))}" data-share-value="${escapeHtml(text)}" title="${escapeHtml(t('dailyShareBtn'))}">
                            <span>📤</span> ${escapeHtml(t('dailyShareBtn'))}
                        </button>
                    </div>
                </div>
            </section>`;
    }

    function renderHumanGrowthLoop(p) {
        const subject = getSubject();
        if (subject !== 'human') return '';

        const hcc = p.humanCatCompatibility;
        const hhc = p.humanHumanCompatibility;
        if (!hcc || !hhc) return '';

        const catRels = [
            { key: 'bestMatch', label: t('hCompCatBest'), data: hcc.bestMatch },
            { key: 'worstMatch', label: t('hCompCatWorst'), data: hcc.worstMatch },
            { key: 'chaosPair', label: t('hCompCatChaos'), data: hcc.chaosPair },
            { key: 'emotionalSupport', label: t('hCompCatSupport'), data: hcc.emotionalSupport }
        ];

        const humanRels = [
            { key: 'thrivesTogether', label: t('hCompHumanBest'), data: hhc.thrivesTogether },
            { key: 'mutualEnablers', label: t('hCompHumanEnabler'), data: hhc.mutualEnablers },
            { key: 'exhaustingDuo', label: t('hCompHumanExhaust'), data: hhc.exhaustingDuo },
            { key: 'bannedFromDiscord', label: t('hCompHumanBanned'), data: hhc.bannedFromDiscord }
        ];

        const renderSet = (rels, title, rootPath) => {
            const cards = rels.map(r => {
                const target = window.MeowArchetypes.get(r.data.type);
                const blurb = field(r.data, 'blurb');
                return `
                    <div class="comp-card" data-comp-type="${r.key}">
                        <div class="comp-label-row">
                            <span class="comp-label">${escapeHtml(r.label)}</span>
                            <button class="card-share-btn mini" data-share-type="pair" data-share-title="${escapeHtml(r.label)}" data-share-target="${target.code}" data-share-blurb="${escapeHtml(blurb)}" title="${escapeHtml(t('sharePairBtn'))}">📥</button>
                        </div>
                        <a href="${withLang(rootPath + target.code + '.html')}" class="comp-target">
                            <span class="comp-emoji" aria-hidden="true">${target.emoji}</span>
                            <div class="comp-target-info">
                                <span class="comp-target-name">${escapeHtml(field(target, 'name'))}</span>
                                <span class="comp-target-code">${target.code}</span>
                            </div>
                        </a>
                        <p class="comp-blurb">${escapeHtml(blurb)}</p>
                    </div>`;
            }).join('');

            return `
                <div class="growth-loop-module">
                    <h3 class="module-h">${escapeHtml(title)}</h3>
                    <div class="comp-grid">
                        ${cards}
                    </div>
                </div>
            `;
        };

        window.MeowTrack && window.MeowTrack('human_compatibility_view', { archetype_code: p.code });

        return `
            <div class="human-growth-loop">
                ${renderSet(catRels, t('hCompCatTitle'), isResultPage ? 'personality-types/' : '../personality-types/')}
                ${renderSet(humanRels, t('hCompHumanTitle'), isResultPage ? 'human-types/' : '')}
            </div>
        `;
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

    function renderBehavioralHooks(p) {
        const hooks = field(p, 'behavioralHooks');
        if (!hooks) return '';

        const subject = getSubject();
        const isHuman = subject === 'human';

        const mostLikelyTo = field(hooks, 'mostLikelyTo');
        const emotionalSupportObject = field(hooks, 'emotionalSupportObject');
        const at2AM = field(hooks, 'at2AM');

        if (isResultPage) {
            // Compact version for result page: just "Most likely to" teaser
            return `
                <section class="module-section hooks-section compact">
                    <div class="module-h-row">
                        <h3 class="module-h">${escapeHtml(t('hooksMostLikely'))}</h3>
                        <button class="card-share-btn mini" data-share-type="list" data-share-title="${escapeHtml(t('hooksMostLikely'))}" data-share-items='${JSON.stringify(mostLikelyTo)}' title="${escapeHtml(t('shareCardBtn'))}">📥</button>
                    </div>
                    <ul class="likely-list teaser">
                        ${mostLikelyTo.slice(0, 2).map(item => `<li class="likely-item">${escapeHtml(item)}</li>`).join('')}
                    </ul>
                </section>
            `;
        }

        // Full version for Meaning Page
        const likelyHtml = mostLikelyTo.map(item => `<li class="likely-item">${escapeHtml(item)}</li>`).join('');
        const textsHtml = field(hooks, 'textsLike').map(item => `<div class="chat-bubble">${escapeHtml(item)}</div>`).join('');

        const gridItems = [
            { label: t('hooksSecretWeakness'), value: field(hooks, 'secretWeakness'), icon: '🤫', key: 'secretWeakness' },
            { label: t('hooksWhenStressed'), value: field(hooks, 'whenStressed'), icon: '😤', key: 'whenStressed' },
            { label: t('hooksAt2AM'), value: at2AM, icon: '🌕', key: 'at2AM' },
            { label: t('hooksCorporate'), value: field(hooks, 'corporateSurvivalRate'), icon: '💼', key: 'corporate' },
            { label: isHuman ? t('hHooksSupportObject') : t('hooksSupportObject'), value: emotionalSupportObject, icon: '🧸', key: 'supportObject' }
        ];

        const gridHtml = gridItems.map(item => `
            <div class="hook-card">
                <div class="hook-card-header">
                    <span class="hook-icon">${item.icon}</span>
                    <span class="hook-label">${escapeHtml(item.label)}</span>
                    <button class="card-share-btn mini" data-share-type="hook" data-share-title="${escapeHtml(item.label)}" data-share-value="${escapeHtml(item.value)}" data-share-icon="${item.icon}" title="${escapeHtml(t('shareCardBtn'))}">📥</button>
                </div>
                <p class="hook-value">${escapeHtml(item.value)}</p>
            </div>
        `).join('');

        return `
            <section class="module-section hooks-section">
                <h3 class="module-h">${escapeHtml(t('hooksTitle'))}</h3>
                
                <div class="hooks-top-grid">
                    <div class="hook-block">
                        <div class="hook-sub-h-row">
                            <h4 class="hook-sub-h">${escapeHtml(t('hooksMostLikely'))}</h4>
                            <button class="card-share-btn mini" data-share-type="list" data-share-title="${escapeHtml(t('hooksMostLikely'))}" data-share-items='${JSON.stringify(hooks.mostLikelyTo)}' title="${escapeHtml(t('shareCardBtn'))}">📥</button>
                        </div>
                        <ul class="likely-list">${likelyHtml}</ul>
                    </div>
                    <div class="hook-block">
                        <div class="hook-sub-h-row">
                            <h4 class="hook-sub-h">${escapeHtml(t('hooksTextsLike'))}</h4>
                            <button class="card-share-btn mini" data-share-type="chat" data-share-title="${escapeHtml(t('hooksTextsLike'))}" data-share-items='${JSON.stringify(hooks.textsLike)}' title="${escapeHtml(t('shareChatBtn'))}">📥</button>
                        </div>
                        <div class="chat-container">${textsHtml}</div>
                    </div>
                </div>

                <div class="hooks-grid">
                    ${gridHtml}
                </div>
            </section>`;
    }

    function renderCompatibilityGraph(p) {
        const comp = p.compatibility;
        if (!comp) return '';
        
        const subject = getSubject();
        const isHuman = subject === 'human';

        const rels = [
            { key: 'bestMatch', label: isHuman ? t('hCompBestMatch') : t('compBestMatch'), data: comp.bestMatch },
            { key: 'chaosPair', label: isHuman ? t('hCompChaosPair') : t('compChaosPair'), data: comp.chaosPair },
            { key: 'secretTwin', label: isHuman ? t('hCompSecretTwin') : t('compSecretTwin'), data: comp.secretTwin },
            { key: 'worstRoommate', label: isHuman ? t('hCompWorstRoommate') : t('compWorstRoommate'), data: comp.worstRoommate }
        ];

        const root = isHuman ? 'human-types/' : (isResultPage ? 'personality-types/' : '');
        
        // On Result page, show only top 2 to keep it compact
        const displayRels = isResultPage ? rels.slice(0, 2) : rels;

        const cards = displayRels.map(r => {
            const target = window.MeowArchetypes.get(r.data.type);
            const blurb = field(r.data, 'blurb');
            return `
                <div class="comp-card" data-comp-type="${r.key}">
                    <div class="comp-label-row">
                        <span class="comp-label">${escapeHtml(r.label)}</span>
                        <button class="card-share-btn mini" data-share-type="pair" data-share-title="${escapeHtml(r.label)}" data-share-target="${target.code}" data-share-blurb="${escapeHtml(blurb)}" title="${escapeHtml(t('sharePairBtn'))}">📥</button>
                    </div>
                    <a href="${withLang(root + target.code + '.html')}" class="comp-target">
                        <span class="comp-emoji" aria-hidden="true">${target.emoji}</span>
                        <div class="comp-target-info">
                            <span class="comp-target-name">${escapeHtml(field(target, 'name'))}</span>
                            <span class="comp-target-code">${target.code}</span>
                        </div>
                    </a>
                    <p class="comp-blurb">${escapeHtml(blurb)}</p>
                </div>`;
        }).join('');

        const footerCta = isResultPage ? `
            <div class="comp-footer">
                <a href="${withLang(root + p.code + '.html')}" class="comp-cta">${escapeHtml(t('compViewFull'))}</a>
            </div>
        ` : '';

        return `
            <section class="module-section compatibility-section">
                <h3 class="module-h">${escapeHtml(t('compTitle'))}</h3>
                <p class="module-intro">${escapeHtml(t('compIntro'))}</p>
                <div class="comp-grid ${isResultPage ? 'compact' : ''}">
                    ${cards}
                </div>
                ${footerCta}
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

    function sharePanel(isHuman = false) {
        return `
            <section class="share-panel" id="share-panel">
                <img class="share-thumb" id="share-thumb" alt="">
                <h3>${escapeHtml(isHuman ? t('shareHumanVerdict') : t('shareVerdict'))}</h3>
                <p>${escapeHtml(isHuman ? t('shareHumanPromptText') : t('sharePromptText'))}</p>
                <div class="share-actions">
                    <label class="share-upload" for="share-photo">
                        <span aria-hidden="true">📸</span>
                        <span id="share-upload-label">${escapeHtml(isHuman ? t('addHumanPhoto') : t('addPhoto'))}</span>
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

    function saveFamilyPanel(p, isHuman) {
        const title = isHuman ? t('addMyselfToFamily') : t('saveToFamily');
        const label = isHuman ? t('yourNameOptional') : t('catNameOptional');
        return `
            <section class="save-family-panel">
                <h3>${escapeHtml(title)}</h3>
                <div class="save-family-input-group">
                    <label for="family-member-name">${escapeHtml(label)}</label>
                    <input type="text" id="family-member-name" placeholder="${isHuman ? t('placeholderHumanName') : t('placeholderCatName')}" maxlength="30">
                </div>
                <button class="big-btn accent" id="btn-save-family" type="button">${escapeHtml(title)}</button>
            </section>
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

    function getSubject() {
        if (isHumanPage) return 'human';
        return new URLSearchParams(window.location.search).get('subject') || 'cat';
    }

    function getDisplayName() {
        const params = new URLSearchParams(window.location.search);
        let name = params.get('name');
        if (name) return name;

        // Try input field if on result page
        const nameInput = document.getElementById('family-member-name');
        if (nameInput && nameInput.value.trim()) {
            return nameInput.value.trim();
        }

        return '';
    }

    function renderOwnerModules(p) {
        const modules = [
            { label: t('ownerWorkplace'), text: field(p, 'ownerWorkplace') },
            { label: t('ownerGroupChat'), text: field(p, 'ownerGroupChat') },
            { label: t('ownerDamage'), text: field(p, 'ownerEmotionalDamage') },
            { label: t('ownerComm'), text: field(p, 'ownerCommunication') },
            { label: t('ownerCatAttract'), text: field(p, 'ownerCatAttract') },
            { label: t('ownerBossCompat'), text: field(p, 'ownerBossCompat') },
            { label: t('ownerRoommate'), text: field(p, 'ownerRoommateWarning') },
            { label: t('ownerSurvival'), text: field(p, 'ownerSurvivalStrategy') }
        ];

        const grid = modules.map(m => `
            <div class="owner-module-card">
                <span class="om-label">${escapeHtml(m.label)}</span>
                <p class="om-text">${escapeHtml(m.text || '')}</p>
            </div>
        `).join('');

        return `
            <section class="module-section">
                <h3 class="module-h">${escapeHtml(t('resultOwnerTitle'))}</h3>
                <div class="owner-modules-grid">${grid}</div>
            </section>`;
    }

    function renderCompatibilityMatrix(p) {
        // Dynamic compatibility based on archetype fields
        const compatData = [
            { type: t('compatWithCat'), level: '85%', survival: 'High', desc: field(p, 'compatCatDesc') },
            { type: t('compatWithBoss'), level: '40%', survival: 'Medium', desc: field(p, 'compatBossDesc') },
            { type: t('compatWithRoomie'), level: '95%', survival: 'Very High', desc: field(p, 'compatRoomieDesc') }
        ];

        const cards = compatData.map(c => `
            <div class="compat-card">
                <span class="compat-type">${escapeHtml(c.type)}</span>
                <div class="compat-stats">
                    <div class="compat-stat">
                        <span>${escapeHtml(t('compatChaos'))}</span>
                        <strong>${c.level}</strong>
                    </div>
                    <div class="compat-stat">
                        <span>${escapeHtml(t('compatSurvival'))}</span>
                        <strong>${c.survival}</strong>
                    </div>
                </div>
                <p class="compat-desc">${escapeHtml(c.desc || '')}</p>
            </div>
        `).join('');

        return `
            <section class="module-section">
                <h3 class="module-h">${escapeHtml(t('compatTitle'))}</h3>
                <div class="compat-grid">${cards}</div>
            </section>`;
    }

    function render() {
        const host = document.getElementById('personality-content');
        if (!host) return;

        const code = getCode();
        const subject = getSubject();
        const isHuman = subject === 'human';
        const quizPage = isHuman ? 'human-quiz.html' : 'quiz.html';

        if (isResultPage && !code) {
            host.innerHTML = `
                <div style="text-align:center; padding: 100px 20px;">
                    <h2 style="font-family:'Fraunces', serif; font-size: 48px; margin-bottom: 24px;">${escapeHtml(t('resultTitle'))}</h2>
                    <p style="font-family:'Space Grotesk', sans-serif; opacity: 0.8; margin-bottom: 32px;">${escapeHtml(t('heroSubtitle'))}</p>
                    <a href="${withLang(quizPage)}" class="big-btn accent">${escapeHtml(t('heroCta'))}</a>
                </div>
            `;
            return;
        }
        const p = window.MeowArchetypes.byCode[code];
        if (!p) {
            host.innerHTML = `
                <div style="text-align:center; padding: 100px 20px;">
                    <h2 style="font-family:'Fraunces', serif; font-size: 48px; margin-bottom: 24px;">${escapeHtml(t('resultTitle'))}</h2>
                    <p style="font-family:'Space Grotesk', sans-serif; opacity: 0.8; margin-bottom: 32px;">${escapeHtml(t('heroSubtitle'))}</p>
                    <a href="${withLang(quizPage)}" class="big-btn accent">${escapeHtml(t('heroCta'))}</a>
                </div>
            `;
            return;
        }
        const tally = parseTally() || evenTally();
        const accent = '#FF5B3B';
        const name = field(p, 'name');
        const tagline = field(p, 'tagline');
        const displayName = getDisplayName();

        document.title = displayName ? `${displayName} (${p.code}) — MeowBTI` : `${name} (${p.code}) — MeowBTI`;
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
            subject: subject,
            view_type: isResultPage ? 'result' : 'meaning'
        });

        if (isHuman) {
            if (isResultPage) {
                window.MeowTrack && window.MeowTrack('human_result_view', { archetype_code: p.code, language: getLang() });
            } else {
                window.MeowTrack && window.MeowTrack('human_meaning_view', { archetype_code: p.code, language: getLang() });
            }
        }

        const revealText = displayName ? (isHuman ? t('shareNameIs', displayName, name) : t('shareNameIs', displayName, name)) : (isHuman ? t('resultOwnerSub') : t('revealLine'));

        // Root path for internal links
        const root = isHuman ? 'human-types/' : (isResultPage ? 'personality-types/' : '');
        const quizRoot = isResultPage ? '' : '../';

        const allTypesPage = isHumanPage ? 'human-types.html' : 'personality-types.html';

        host.innerHTML = `
            ${isResultPage ? confetti(p, accent) : ''}
            <div class="reveal-line">${escapeHtml(revealText)}</div>
            ${tradingCard(p, displayName)}

            ${isResultPage ? saveFamilyPanel(p, isHuman) : ''}

            <div class="result-actions">
                ${isResultPage ? `
                    <button class="big-btn" id="btn-copy" type="button">${escapeHtml(isHuman ? t('shareOwnerBtn') : t('copyLink'))}</button>
                    <a href="${withLang(root + p.code + '.html')}" class="big-btn ghost">${escapeHtml(t('readFullProfile'))}</a>
                ` : `
                    <a href="${withLang(quizRoot + quizPage)}" class="big-btn accent">${escapeHtml(t('meaningTakeQuiz'))}</a>
                    <button class="big-btn ghost" id="btn-copy" type="button">${escapeHtml(t('copyLink'))}</button>
                `}
                <a href="${withLang(quizRoot + allTypesPage)}" class="big-btn ghost">${escapeHtml(t('all16'))}</a>
            </div>

            ${isResultPage ? sharePanel(isHuman) : ''}

            ${renderDailyFeed(p)}

            ${(isResultPage && isHuman) ? renderOwnerModules(p) : ''}
            ${(isResultPage && isHuman) ? renderCompatibilityMatrix(p) : ''}

            <section class="result-grid">
                <div class="rg-block">
                    <h3 class="rg-h">${escapeHtml(t('famouslySays'))}</h3>
                    <p class="rg-quote">"${escapeHtml(field(p, 'famouslySays'))}"</p>
                </div>
                ${isResultPage ? `
                <div class="rg-block">
                    <h3 class="rg-h">${escapeHtml(t('spectrum'))}</h3>
                    <div class="spectrum">${spectrumRows(tally, p.color)}</div>
                </div>
                ` : ''}
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

            ${(!isHuman) ? renderDuringEvents(p) : ''}
            ${renderBehavioralHooks(p)}
            ${renderHumanGrowthLoop(p)}
            ${renderCompatibilityGraph(p)}

            ${rivalTile(p)}

            ${longFormSection(p)}

            <section class="result-affiliate">
                <h3 class="result-affiliate-h">${escapeHtml(isHuman ? t('picksForHuman') : t('picksFor', name))}</h3>
                <div class="product-grid">
                    <a href="${withLang(quizRoot + 'index.html#affiliate-products')}" rel="sponsored noopener" class="product-card" style="--product-bg:${p.bg}">
                        <span class="product-emoji" aria-hidden="true">🛏️</span>
                        <h3>${t('productTitleSpot')}</h3>
                        <p class="product-blurb">${isHuman ? t('productBlurbDissociating') : t('productBlurbIgnoring')}</p>
                        <span class="product-cta">${t('productCta')}</span>
                    </a>
                    <a href="${withLang(quizRoot + 'index.html#affiliate-products')}" rel="sponsored noopener" class="product-card" style="--product-bg:#FFEFC2">
                        <span class="product-emoji" aria-hidden="true">☕</span>
                        <h3>${t('productTitleFuel')}</h3>
                        <p class="product-blurb">${t('productBlurbProblem')}</p>
                        <span class="product-cta">${t('productCta')}</span>
                    </a>
                </div>
            </section>

            <section class="result-cta">
                <h2 class="cta-h">${escapeHtml(isHuman ? t('ctaHuman') : t('ctaH'))}</h2>
                <div class="cta-actions">
                    <a href="${withLang(quizRoot + quizPage)}" class="big-btn" style="background:${p.color};color:#fff">${escapeHtml(isHuman ? t('humanResultCta') : (isResultPage ? t('analyzeAnother') : t('heroCta')))}</a>
                    <a href="${withLang(quizRoot + allTypesPage)}" class="big-btn ghost">${escapeHtml(isHuman ? t('browseHumanAll') : t('browseAll'))}</a>
                </div>
            </section>
        `;

        if (isResultPage) {
            const saveBtn = document.getElementById('btn-save-family');
            const nameInput = document.getElementById('family-member-name');
            if (saveBtn && nameInput && window.MeowStore) {
                saveBtn.addEventListener('click', () => {
                    const nameValue = nameInput.value.trim();
                    const defaultName = isHuman ? t('defaultHumanName') : t('defaultCatName');
                    const profile = {
                        id: window.MeowStore.generateProfileId(),
                        name: nameValue || defaultName,
                        subject: subject,
                        code: p.code,
                        tally: new URLSearchParams(window.location.search).get('t') || '',
                        archetypeName: name,
                        savedAt: new Date().toISOString(),
                        source: 'result-page'
                    };
                    
                    const success = window.MeowStore.saveFamilyProfile(profile);
                    if (success || true) {
                        saveBtn.textContent = t('savedToFamily');
                        saveBtn.classList.add('saved');
                        nameInput.disabled = true;
                        
                        if (isHuman) {
                            window.MeowTrack && window.MeowTrack('human_profile_save', { archetype_code: p.code, language: getLang() });
                        }
                        
                        // Update UI and share context without full reload
                        const newName = nameValue || defaultName;
                        const cardNameEl = document.querySelector('.tc-name');
                        if (cardNameEl) cardNameEl.textContent = newName;
                        
                        const revealEl = document.querySelector('.reveal-line');
                        if (revealEl) revealEl.textContent = isHuman ? t('shareNameIs', newName, name) : t('shareNameIs', newName, name);
                        
                        // Note: The card-share-btn's getDisplayName() call will now pick up the input value or saved state.
                    }
                });
            }
            bindShare(p);
        }

        const copyBtn = document.getElementById('btn-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyLink(p);
                window.MeowTrack && window.MeowTrack(isHuman ? 'share_owner_result' : 'copy_link', { code: p.code });
                const old = copyBtn.textContent;
                copyBtn.textContent = t('copied');
                setTimeout(() => { copyBtn.textContent = old; }, 1600);
            });
        }

        document.querySelectorAll('.compat-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.querySelector('.compat-type').textContent;
                window.MeowTrack && window.MeowTrack('compatibility_checked', {
                    from_code: p.code,
                    compat_type: type
                });
            });
        });

        document.querySelectorAll('.rel-card').forEach(card => {
            card.addEventListener('click', () => {
                window.MeowTrack && window.MeowTrack('relationship_clicked', {
                    from_code: p.code,
                    target_code: card.dataset.targetCode,
                    rel_type: card.dataset.relType
                });
            });
        });

        // ─── Share Card Binders ─────────────────────────────────
        document.querySelectorAll('.card-share-btn').forEach(btn => {
            const cardTitle = btn.dataset.shareTitle || '';
            btn.setAttribute('aria-label', `${t('shareCardBtn')}: ${cardTitle}`);
            
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!window.MeowShare || !window.MeowShare.buildCard) return;

                const originalText = btn.textContent;
                btn.textContent = '⏳';
                btn.disabled = true;
                
                // Track click event
                window.MeowTrack && window.MeowTrack(isResultPage ? 'result_share_card_click' : 'meaning_share_card_click', {
                    card_type: btn.dataset.shareType,
                    archetype_code: p.code
                });

                if (btn.dataset.shareType === 'daily') {
                    window.MeowTrack && window.MeowTrack('daily_feed_share_click', {
                        archetype_code: p.code,
                        language: getLang(),
                        page_context: isResultPage ? 'result' : 'meaning',
                        has_name: !!getDisplayName()
                    });
                }

                const shareData = {
                    type: btn.dataset.shareType,
                    title: btn.dataset.shareTitle,
                    value: btn.dataset.shareValue,
                    icon: btn.dataset.shareIcon,
                    items: btn.dataset.shareItems ? JSON.parse(btn.dataset.shareItems) : null,
                    targetCode: btn.dataset.shareTarget,
                    blurb: btn.dataset.shareBlurb,
                    displayName: getDisplayName(),
                    pageContext: isResultPage ? 'result' : 'meaning'
                };

                try {
                    const blob = await window.MeowShare.buildCard(p, shareData);
                    const result = await window.MeowShare.shareCard(p, blob, shareData);
                    
                    if (result === 'shared') {
                        btn.textContent = '✅';
                    } else if (result === 'downloaded') {
                        btn.textContent = '💾';
                    } else if (result === 'fallback') {
                        btn.textContent = '🖼️';
                    }
                } catch (err) {
                    console.error('Share failed:', err);
                    btn.textContent = '❌';
                } finally {
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }, 2000);
                }
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
