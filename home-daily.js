/**
 * MeowBTI Homepage Daily Loop (v1.1)
 * Handles the "Today's Cat Energy" module on the homepage, supporting multiple cats.
 */
(function() {
    const host = document.getElementById('daily-loop-content');
    if (!host || !window.MeowArchetypes || !window.MeowStore || !window.MeowI18n) return;

    const { t, getLang, withLang } = window.MeowI18n;

    function getDailyHash(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function getHouseholdMood(count, dateStr) {
        const moods = [
            { en: "Today’s household mood: suspiciously quiet.", th: "บรรยากาศในบ้านวันนี้: เงียบผิดปกติจนน่าสงสัย" },
            { en: "Today’s household risk level: sofa may not survive.", th: "ระดับความเสี่ยงในบ้านวันนี้: โซฟาอาจจะไม่รอด" },
            { en: "Shared brain cell status: unavailable.", th: "สถานะเซลล์สมองที่ใช้ร่วมกัน: ไม่สามารถใช้งานได้" },
            { en: "Household status: 100% chance of zoomies tonight.", th: "สถานะในบ้าน: คืนนี้โอกาสเกิดอาการดีดพุ่งพล่าน 100%" },
            { en: "Current vibe: competitive treat eating in progress.", th: "อารมณ์ตอนนี้: กำลังแข่งกันกินขนมแมวเลียอย่างดุเดือด" },
            { en: "Atmosphere: heavy judgment from multiple angles.", th: "บรรยากาศ: โดนจ้องตัดสินจากหลายทิศทาง" }
        ];
        const idx = getDailyHash(dateStr + count) % moods.length;
        return moods[idx][getLang()] || moods[idx].en;
    }

    function renderProfileCard(p, dateStr) {
        const archetype = window.MeowArchetypes.get(p.code);
        if (!archetype || !archetype.dailyObservations) return '';

        const daily = archetype.dailyObservations;
        const entryIdx = getDailyHash(dateStr + archetype.code) % daily.length;
        const entry = daily[entryIdx];
        const lang = getLang();
        const observation = entry[lang] || entry.en;

        const resultPage = p.subject === 'human' ? 'human-result.html' : 'result.html';
        const resultUrl = `${resultPage}?type=${archetype.code}&t=${p.tally || ''}&name=${encodeURIComponent(p.name)}&subject=${p.subject}`;

        return `
            <div class="daily-family-mini-card" style="border-left: 6px solid ${archetype.color}">
                <div class="df-mini-main">
                    <span class="df-mini-emoji">${archetype.emoji}</span>
                    <div class="df-mini-info">
                        <div class="df-mini-name">${escapeHtml(p.name)}</div>
                        <p class="df-mini-obs">“${escapeHtml(observation)}”</p>
                    </div>
                </div>
                <a href="${withLang(resultUrl)}" class="df-mini-link" data-archetype="${archetype.code}">${escapeHtml(t('dailyViewReading'))} →</a>
            </div>
        `;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, ch => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
        }[ch]));
    }

    function render() {
        const family = window.MeowStore.getFamily();
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const lang = getLang();

        if (family && family.length > 1) {
            // MULTIPLE CATS VIEW
            const displayProfiles = family.slice(0, 3);
            const cardsHtml = displayProfiles.map(p => renderProfileCard(p, dateStr)).join('');
            const householdMood = getHouseholdMood(family.length, dateStr);

            host.innerHTML = `
                <div class="daily-family-container">
                    <div class="dh-header">
                        <span class="dh-badge">${escapeHtml(t('dailyFamilyTitle'))}</span>
                        <span class="dh-updated">${escapeHtml(t('dailyUpdated'))}</span>
                    </div>
                    <div class="household-mood-bar">
                        <span class="hm-icon">🏠</span>
                        <span class="hm-text">${escapeHtml(householdMood)}</span>
                    </div>
                    <div class="daily-family-grid">
                        ${cardsHtml}
                    </div>
                    <div class="daily-family-footer">
                        <a href="#family-dashboard" class="daily-view-all">${escapeHtml(t('dailyViewAllFamily'))}</a>
                    </div>
                </div>
            `;

            window.MeowTrack && window.MeowTrack('family_daily_view', {
                profile_count: family.length,
                language: lang,
                page_context: 'homepage'
            });
            window.MeowTrack && window.MeowTrack('family_daily_multiple_detected', { count: family.length });
            window.MeowTrack && window.MeowTrack('household_mood_view', { mood: householdMood });

        } else if (family && family.length === 1) {
            // SINGLE CAT VIEW (Existing behavior)
            const profile = family[0];
            const archetype = window.MeowArchetypes.get(profile.code);
            if (!archetype || !archetype.dailyObservations) return;

            const daily = archetype.dailyObservations;
            const entryIdx = getDailyHash(dateStr + archetype.code) % daily.length;
            const observation = daily[entryIdx][lang] || daily[entryIdx].en;
            const archetypeName = lang === 'th' ? (archetype.nameTh || archetype.name) : archetype.name;
            const resultPage = profile.subject === 'human' ? 'human-result.html' : 'result.html';
            const resultUrl = `${resultPage}?type=${archetype.code}&t=${profile.tally || ''}&name=${encodeURIComponent(profile.name)}&subject=${profile.subject}`;
            const title = t('dailyVibeIs', profile.name, archetypeName);

            host.innerHTML = `
                <div class="daily-home-card" style="border-color: ${archetype.color}">
                    <div class="dh-header">
                        <span class="dh-badge">${escapeHtml(t('dailyTitle'))}</span>
                        <span class="dh-updated">${escapeHtml(t('dailyUpdated'))}</span>
                    </div>
                    <div class="dh-body">
                        <div class="dh-main">
                            <span class="dh-emoji" aria-hidden="true">${archetype.emoji}</span>
                            <div class="dh-info">
                                <h3 class="dh-title">${escapeHtml(title)}</h3>
                                <p class="dh-obs">“${escapeHtml(observation)}”</p>
                            </div>
                        </div>
                    </div>
                    <div class="dh-footer">
                        <a href="${withLang(resultUrl)}" class="big-btn accent daily-cta">${escapeHtml(t('dailySeeFull'))}</a>
                    </div>
                </div>
            `;

            window.MeowTrack && window.MeowTrack('homepage_daily_view', {
                archetype_code: archetype.code,
                language: lang,
                has_saved_profile: true
            });

        } else {
            // NO SAVED PROFILES (Featured fallback)
            const all = window.MeowArchetypes.all;
            const archIdx = getDailyHash(dateStr) % all.length;
            const archetype = all[archIdx];
            if (!archetype || !archetype.dailyObservations) return;

            const daily = archetype.dailyObservations;
            const entryIdx = getDailyHash(dateStr + archetype.code) % daily.length;
            const observation = daily[entryIdx][lang] || daily[entryIdx].en;

            host.innerHTML = `
                <div class="daily-home-card" style="border-color: ${archetype.color}">
                    <div class="dh-header">
                        <span class="dh-badge">${escapeHtml(t('dailyTitle'))}</span>
                        <span class="dh-updated">${escapeHtml(t('dailyUpdated'))}</span>
                    </div>
                    <div class="dh-body">
                        <div class="dh-main">
                            <span class="dh-emoji" aria-hidden="true">${archetype.emoji}</span>
                            <div class="dh-info">
                                <h3 class="dh-title">${escapeHtml(t('dailyFeatured'))}</h3>
                                <p class="dh-obs">“${escapeHtml(observation)}”</p>
                            </div>
                        </div>
                    </div>
                    <div class="dh-footer">
                        <div class="daily-cta-group">
                            <a href="${withLang('quiz.html')}" class="big-btn accent daily-cta">${escapeHtml(t('dailyFindYours'))}</a>
                            <a href="${withLang('personality-types.html')}" class="big-btn ghost daily-cta">${escapeHtml(t('all16'))}</a>
                        </div>
                    </div>
                </div>
            `;

            window.MeowTrack && window.MeowTrack('homepage_daily_view', {
                archetype_code: archetype.code,
                language: lang,
                has_saved_profile: false
            });
        }

        // Bind tracking to CTA clicks
        host.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                const arch = link.dataset.archetype || (family && family.length > 0 ? family[0].code : 'featured');
                window.MeowTrack && window.MeowTrack('family_daily_profile_click', {
                    archetype_code: arch,
                    is_multiple: family && family.length > 1
                });
            });
        });
    }

    render();
})();
