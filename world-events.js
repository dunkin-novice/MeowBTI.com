/**
 * MeowBTI Global Emotional Seasons & World Events v1
 * Deterministically rotates ecosystem-wide events based on time.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    const EVENTS = [
        { id: 'soup', title: t('evtSoupWeek'), proverb: t('evtSoupProv'), status: t('evtTradeRoute') },
        { id: 'blanket', title: t('evtBlanketSeason'), proverb: t('evtBlanketProv'), status: t('evtInfraUnstable') },
        { id: 'parallel', title: t('evtParallelMonth'), proverb: t('evtParallelProv'), status: t('evtSynchronized') },
        { id: 'loud', title: t('evtLoudSurge'), proverb: t('evtLoudProv'), status: t('evtInfraUnstable') },
        { id: 'recharge', title: t('evtGreatRecharge'), proverb: t('evtRechargeProv'), status: t('evtTradeRoute') },
        { id: 'battery', title: t('evtBatteryCrisis'), proverb: t('evtBatteryProv'), status: t('evtInfraUnstable') },
        { id: 'horizontal', title: t('evtHorizontalEra'), proverb: t('evtHorizontalProv'), status: t('evtSynchronized') },
        { id: 'rotting', title: t('evtEmergencyRot'), proverb: t('evtEmergencyProv'), status: t('evtInfraUnstable') }
    ];

    function getActiveEvent() {
        const now = new Date();
        // Deterministic: rotate weekly (ISO week number)
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now - startOfYear) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        
        return EVENTS[weekNum % EVENTS.length];
    }

    function renderWorldEvent() {
        const host = window.MeowOS ? window.MeowOS.getLayer('snapshot') : document.getElementById('family-content');
        if (!host) return;

        let container = document.getElementById('global-world-event');
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-world-event';
            container.className = 'world-event-container animate-fade-in';
            // Insert at the top of the content
            host.prepend(container);
        }

        const active = getActiveEvent();
        
        // Participation estimate based on day of week + random seed
        const participation = 45 + (new Date().getDay() * 5) + (Math.floor(Math.random() * 10));

        container.innerHTML = `
            <span class="event-label">${t('evtTitle')}</span>
            <h2 class="event-name">${active.title}</h2>
            <p class="event-proverb">“${active.proverb}”</p>

            <div class="ecosystem-grid">
                <div class="ecosystem-card">
                    <h4>${t('evtStatus')}</h4>
                    <div class="ecosystem-val">${active.status}</div>
                </div>
                <div class="ecosystem-card">
                    <h4>${t('evtParticipation')}</h4>
                    <div class="ecosystem-val">${participation}% Active</div>
                    <div class="participation-meter">
                        <div class="participation-fill" style="width: ${participation}%"></div>
                    </div>
                </div>
                <div class="ecosystem-card">
                    <h4>${t('evtModifier')}</h4>
                    <div class="ecosystem-val">${t('commTheoryRelevant')}</div>
                </div>
            </div>

            <div style="margin-top:40px;">
                <a href="/events/${active.id}-week.html" class="big-btn ghost mini">
                    📡 View Global Impact
                </a>
                <button class="micro-share-icon mini" data-type="world_event" data-text="The entire MeowBTI ecosystem has entered ${active.title}. “${active.proverb}”">📤</button>
            </div>
        `;

        container.querySelector('.micro-share-icon').onclick = () => {
            if (window.MeowAnalytics) {
                window.MeowAnalytics.microShare({
                    framework: 'world_events',
                    content_type: 'active_event',
                    text: container.querySelector('.micro-share-icon').getAttribute('data-text'),
                    route: '/'
                });
            }
        };

        // Analytics
        window.MeowTrack && window.MeowTrack('world_event_view', {
            event_id: active.id,
            participation_level: participation,
            lang: getLang()
        });
    }

    // Expose global for other scripts
    window.MeowEvents = {
        getActiveEvent
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderWorldEvent);
    } else {
        renderWorldEvent();
    }

    window.addEventListener('meow:daily:updated', renderWorldEvent);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderWorldEvent();
    });
})();
