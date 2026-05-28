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

        // Spread influence (v13) / Allied influence (v14) / Era influence (v15) / Rebirth influence (v16) / Legacy influence (v17)
        const era = window.MeowStore.getActiveEra ? window.MeowStore.getActiveEra() : null;
        const proposed = window.MeowStore.getProposedDoctrines ? window.MeowStore.getProposedDoctrines() : [];
        const pillars = window.MeowStore.getLegacyPillars ? window.MeowStore.getLegacyPillars() : [];
        const seeds = window.MeowStore.getSeedCivilizations ? window.MeowStore.getSeedCivilizations() : [];
        const transfers = window.MeowStore.getLegacyTransfers ? window.MeowStore.getLegacyTransfers() : [];
        let spreadMessage = null;
        
        if (transfers.length > 0) {
            spreadMessage = t('legacyTorchPassed');
            if (window.MeowTrack) window.MeowTrack('inherited_trait_applied', { transfer_count: transfers.length });
        } else if (seeds.length > 0) {
            spreadMessage = t('seedNewGeneration');
            if (window.MeowTrack) window.MeowTrack('new_generation_seen', { seed_count: seeds.length });
        } else if (era) {
            spreadMessage = t('eraGoldenEntered');
            if (window.MeowTrack) window.MeowTrack('golden_era_seen', { era_id: era.id });
        } else if (pillars.length > 0) {
            spreadMessage = t('heroAlliedTradition');
            if (window.MeowTrack) window.MeowTrack('allied_tradition_applied', { pillar_count: pillars.length });
        } else if (proposed.length > 0) {
            const fedCount = (window.MeowStore.getFederation ? window.MeowStore.getFederation().length : 0);
            if (fedCount > 0) {
                spreadMessage = t('fedSpreadSuccess');
                if (window.MeowTrack) window.MeowTrack('doctrine_spread_seen', { doctrine_count: proposed.length });
            }
        }

        const greeting = t('idGreeting').replace('{{class}}', civClass.title);
        
        container.innerHTML = `
            <div class="hero-atmosphere hero-bg-${climate.key}"></div>
            <div class="hero-content">
                <div class="hero-greeting">${greeting}</div>
                ${spreadMessage ? `<div class="hero-spread-badge animate-fade-in">✨ ${spreadMessage}</div>` : ''}
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
                    ${ritual.echo ? `<div class="hero-ritual-echo animate-fade-in">${ritual.echo}</div>` : ''}
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
