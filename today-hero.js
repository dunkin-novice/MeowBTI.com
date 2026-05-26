/**
 * MeowBTI Today Hero v1
 * Consolidates daily weather, primary ritual, and civilization greeting into a cinematic home screen.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    function renderHero() {
        const host = window.MeowOS ? window.MeowOS.getLayer('hero') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length === 0) return;

        let container = document.getElementById('today-hero-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'today-hero-section';
            container.className = 'today-hero-container animate-fade-in';
            host.append(container);
        }

        const history = window.MeowDaily.getHistory() || [];
        const climate = window.MeowClimate ? window.MeowClimate.getCollectiveClimate(profiles, history) : { key: 'calm', emoji: '☀️', title: 'Calm' };
        const momentum = window.MeowClimate ? window.MeowClimate.getMomentum(history) : { key: 'stabilizing' };
        const civClass = window.MeowCivilization ? window.MeowCivilization.detectClass(history, profiles) : { title: 'Civilization' };
        const ritual = window.MeowRituals ? window.MeowRituals.getRitualRecommendation(climate.key, momentum.key, history) : { title: 'Survival' };

        const greeting = t('idGreeting').replace('{{class}}', civClass.title);
        
        container.innerHTML = `
            <div class="hero-atmosphere hero-bg-${climate.key}"></div>
            <div class="hero-content">
                <div class="hero-greeting">${greeting}</div>
                <div class="hero-weather-main">
                    <span class="hero-weather-emoji">${climate.emoji}</span>
                    <h1 class="hero-weather-title">${climate.title}</h1>
                </div>
                <p class="hero-emotional-summary">${climate.desc}</p>
                
                <div class="hero-ritual-cta">
                    <a href="#household-rituals-section" class="hero-cta-btn" id="btn-hero-ritual">
                        <span class="cta-label">${t('ritualTitle')}</span>
                        <span class="cta-val">${ritual.title}</span>
                        <span class="cta-arrow">→</span>
                    </a>
                </div>
            </div>
        `;

        container.querySelector('#btn-hero-ritual').onclick = () => {
            window.MeowTrack && window.MeowTrack('primary_ritual_click', { ritual_key: ritual.key });
        };

        if (window.MeowTrack) {
            window.MeowTrack('home_hero_view', { climate: climate.key, lang: getLang() });
        }
    }

    window.MeowHero = {
        render: renderHero
    };

    window.addEventListener('meow:daily:updated', renderHero);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderHero();
    });

    if (document.readyState !== 'loading') renderHero();
    else document.addEventListener('DOMContentLoaded', renderHero);

})();
