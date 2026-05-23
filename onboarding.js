/**
 * MeowBTI First Week Civilization Journey v1
 * Manages the guided emotional progression and unlock rituals.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function renderJourneyPath() {
        const host = document.getElementById('family-content');
        if (!host) return;

        const history = window.MeowDaily.getHistory() || [];
        const dayCount = history.length;
        
        // Don't show if civilization is fully aged (Day 30+)
        if (dayCount >= 30) {
            const existing = document.getElementById('civilization-journey-section');
            if (existing) existing.remove();
            return;
        }

        let container = document.getElementById('civilization-journey-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'civilization-journey-section';
            container.className = 'journey-container animate-fade-in';
            // Insert at the top of the dashboard, below header
            const header = host.querySelector('.family-header');
            if (header) header.after(container);
            else host.prepend(container);
        }

        const stages = [
            { day: 1, key: 'journeyStage1', unlocked: dayCount >= 1 },
            { day: 3, key: 'journeyStage2', unlocked: dayCount >= 3 },
            { day: 5, key: 'journeyStage3', unlocked: dayCount >= 5 },
            { day: 7, key: 'journeyStage4', unlocked: dayCount >= 7 },
            { day: 14, key: 'journeyStage5', unlocked: dayCount >= 14 },
            { day: 30, key: 'journeyStage6', unlocked: dayCount >= 30 }
        ];

        const nextStage = stages.find(s => !s.unlocked) || stages[stages.length - 1];
        const progress = Math.min(100, (dayCount / 30) * 100);

        container.innerHTML = `
            <div class="journey-header">
                <span class="journey-label">${t('pathTitle')}</span>
                <span class="journey-day">${t('pathDay').replace('{{day}}', dayCount)}</span>
            </div>
            
            <div class="journey-progress-bar">
                <div class="journey-fill" style="width: ${progress}%"></div>
            </div>

            <div class="journey-stages">
                ${stages.map(s => `
                    <div class="journey-stage ${s.unlocked ? 'unlocked' : ''} ${s === nextStage ? 'next' : ''}">
                        <div class="stage-dot"></div>
                        <div class="stage-info">
                            <div class="stage-title">${t(s.key)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="journey-hint">
                ${dayCount < 3 ? t('unlockHintRelic') : 
                  (dayCount < 7 ? t('unlockHintCiv') : 
                  (dayCount < 14 ? t('unlockHintArch') : t('unlockHintBlackBox')))}
            </div>
        `;

        if (window.MeowTrack) {
            window.MeowTrack('journey_path_viewed', { day: dayCount, lang: getLang() });
        }
    }

    // Trigger awakening ceremonies
    function checkAwakening() {
        const history = window.MeowDaily.getHistory() || [];
        const dayCount = history.length;
        const lastAck = localStorage.getItem('meow-journey-ack') || 0;

        if (dayCount >= 7 && lastAck < 7) {
            showCeremony(t('journeyStage4'), t('unlockHintCiv'), '🌟');
            localStorage.setItem('meow-journey-ack', 7);
        } else if (dayCount >= 3 && lastAck < 3) {
            showCeremony(t('journeyStage2'), t('unlockHintRelic'), '🏺');
            localStorage.setItem('meow-journey-ack', 3);
        }
    }

    function showCeremony(title, desc, icon) {
        const overlay = document.createElement('div');
        overlay.className = 'ceremony-overlay active';
        overlay.innerHTML = `
            <div class="ceremony-card animate-pop-in">
                <div class="ceremony-icon">${icon}</div>
                <h2 class="ceremony-title">${title}</h2>
                <p class="ceremony-desc">${desc}</p>
                <button class="big-btn accent" onclick="this.closest('.ceremony-overlay').remove()">Witness Awakening</button>
            </div>
        `;
        document.body.append(overlay);
        window.MeowTrack && window.MeowTrack('awakening_ceremony_viewed', { title });
    }

    window.MeowJourney = {
        render: renderJourneyPath,
        check: checkAwakening
    };

    window.addEventListener('meow:daily:updated', () => {
        renderJourneyPath();
        checkAwakening();
    });

    if (document.readyState !== 'loading') {
        renderJourneyPath();
        checkAwakening();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            renderJourneyPath();
            checkAwakening();
        });
    }

})();
