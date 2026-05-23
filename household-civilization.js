/**
 * MeowBTI Household Civilization Class System v1
 * Deterministically assigns a civilization class based on long-term emotional data.
 */
(function() {
    if (!window.MeowI18n || !window.MeowStore || !window.MeowDaily) return;

    const { t, getLang } = window.MeowI18n;

    function getHistory() {
        return window.MeowDaily.getHistory() || [];
    }

    const CLASSES = {
        recovery: { id: 'recovery', title: t('clsRecovery'), icon: '🕊️', proverb: t('provRecovery') },
        loud: { id: 'loud', title: t('clsLoud'), icon: '📢', proverb: t('provLoud') },
        parallel: { id: 'parallel', title: t('clsParallel'), icon: '🧘', proverb: t('provParallel') },
        chaos: { id: 'chaos', title: t('clsChaos'), icon: '🌪️', proverb: t('provChaos') },
        blanket: { id: 'blanket', title: t('clsBlanket'), icon: '🛌', proverb: t('provBlanket') },
        soup: { id: 'soup', title: t('clsSoup'), icon: '🍲', proverb: t('provSoup') },
        survivalist: { id: 'survivalist', title: t('clsSurvivalist'), icon: '🛡️', proverb: t('provSurvivalist') },
        stability: { id: 'stability', title: t('clsStability'), icon: '⚖️', proverb: t('provStability') }
    };

    function detectClass(history, profiles) {
        if (history.length < 5) return CLASSES.stability; // Default

        const recent = history.slice(0, 30);
        const stressAvg = recent.reduce((acc, h) => acc + (h.answers.stress === 'overloaded' ? 2 : (h.answers.stress === 'unstable' ? 1 : 0)), 0) / recent.length;
        const lowEnergyCount = recent.filter(h => h.answers.energy === 'low').length;
        const parallelPlayCount = recent.filter(h => h.answers.social === 'hiding').length;

        // Check for specific internalized thoughts (proxies)
        const cabinet = window.MeowStore.getThoughtCabinet ? window.MeowStore.getThoughtCabinet() : {};
        const isSoupInternalized = cabinet.thSoupLabor?.status === 'INTERNALIZED';
        const isBlanketInternalized = cabinet.thBlanketGov?.status === 'INTERNALIZED';

        if (isSoupInternalized) return CLASSES.soup;
        if (isBlanketInternalized) return CLASSES.blanket;
        if (parallelPlayCount > recent.length * 0.5) return CLASSES.parallel;
        if (stressAvg > 1.2) return CLASSES.loud;
        if (lowEnergyCount > recent.length * 0.6) return CLASSES.recovery;
        if (stressAvg > 0.8 && recent.filter(h => h.answers.energy === 'high').length > recent.length * 0.4) return CLASSES.chaos;
        
        // Survivalist check: Loud Saga survivor milestones
        const stickers = window.MeowStore.getUnlockedStickers ? window.MeowStore.getUnlockedStickers() : {};
        if (stickers.stk_loud_survivor) return CLASSES.survivalist;

        return CLASSES.stability;
    }

    const RANKS = [
        { id: 'emerging', title: t('rnkEmerging'), threshold: 0 },
        { id: 'settlement', title: t('rnkSettlement'), threshold: 10 },
        { id: 'municipality', title: t('rnkMunicipality'), threshold: 30 },
        { id: 'republic', title: t('rnkRepublic'), threshold: 60 },
        { id: 'mythic', title: t('rnkMythic'), threshold: 100 },
        { id: 'empire', title: t('rnkEmpire'), threshold: 200 },
        { id: 'legendary', title: t('rnkLegendary'), threshold: 500 },
        { id: 'canonized', title: t('rnkCanonized'), threshold: 1000 }
    ];

    function calculatePrestige(history, profiles) {
        const relics = window.MeowStore.getForgedRelics ? window.MeowStore.getForgedRelics().length : 0;
        const chronicles = window.MeowStore.getChronicles ? window.MeowStore.getChronicles().length : 0;
        const federation = window.MeowStore.getFederation ? window.MeowStore.getFederation().length : 0;
        const stickers = window.MeowStore.getUnlockedStickers ? Object.keys(window.MeowStore.getUnlockedStickers()).length : 0;
        
        // Prestige formula
        return (history.length * 2) + (relics * 10) + (chronicles * 15) + (federation * 10) + (stickers * 5);
    }

    function getRank(prestige) {
        let current = RANKS[0];
        for (let r of RANKS) {
            if (prestige >= r.threshold) current = r;
            else break;
        }
        return current;
    }

    function renderCivRank(history, profiles) {
        const prestige = calculatePrestige(history, profiles);
        const currentRank = getRank(prestige);
        const nextRank = RANKS[RANKS.indexOf(currentRank) + 1] || null;
        
        const progress = nextRank ? ((prestige - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100 : 100;
        const isHighTier = RANKS.indexOf(currentRank) >= 4;

        let container = document.getElementById('household-civ-rank');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-civ-rank';
            container.className = 'rank-banner-container animate-fade-in';
            const alignment = document.getElementById('household-civ-alignment');
            if (alignment) alignment.before(container);
        }

        if (isHighTier) container.classList.add('rank-tier-high');
        else container.classList.remove('rank-tier-high');

        container.innerHTML = `
            <div class="rank-info">
                <span class="rank-tier-label">${t('rankTitle')} • TIER ${RANKS.indexOf(currentRank) + 1}</span>
                <h3 class="rank-name">${currentRank.title}</h3>
                <div class="rank-progress-outer">
                    <div class="rank-progress-inner" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="legacy-score-badge">
                <div class="legacy-val">${prestige}</div>
                <div class="legacy-label">${t('rankLegacy')}</div>
            </div>
        `;

        // Check for new Rank Ascension (local session only for v1 ceremony)
        const lastRankId = localStorage.getItem('meowbti.last_rank');
        if (lastRankId && lastRankId !== currentRank.id) {
            showAscensionCeremony(currentRank);
        }
        localStorage.setItem('meowbti.last_rank', currentRank.id);

        if (window.MeowTrack) {
            window.MeowTrack('civilization_rank_view', { rank_id: currentRank.id, prestige, lang: getLang() });
        }
    }

    function showAscensionCeremony(rank) {
        let overlay = document.getElementById('ascension-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ascension-overlay';
            overlay.className = 'ascension-ceremony-overlay';
            document.body.append(overlay);
        }
        overlay.classList.add('active');
        overlay.innerHTML = `
            <div class="animate-fade-in">
                <span style="font-size:4rem; display:block; margin-bottom:16px;">✨</span>
                <span class="rank-tier-label" style="color:#FFB000;">${t('rankAscension')}</span>
                <h1 class="ascension-title">${rank.title}</h1>
                <p class="codex-p" style="color:rgba(255,255,255,0.7); max-width:400px; margin:0 auto 32px;">${t('ascensionLore')}</p>
                <button class="big-btn accent" onclick="document.getElementById('ascension-overlay').classList.remove('active')">Accept Legacy</button>
            </div>
        `;

        // Echo Card Hook for Ascension
        window.dispatchEvent(new CustomEvent('meow:echo:create', { detail: {
            card_key: 'ascension_' + rank.id,
            type: 'ascension',
            title: rank.title,
            lore: t('echoLoreAscension'),
            icon: '👑'
        }}));

        window.MeowTrack && window.MeowTrack('ascension_event', { rank_id: rank.id, lang: getLang() });
    }

    function renderCivAlignment() {
        const host = window.MeowOS ? window.MeowOS.getLayer('civ') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        const history = getHistory();
        renderCivRank(history, profiles);

        let container = document.getElementById('household-civ-alignment');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-civ-alignment';
            container.className = 'civ-alignment-container animate-fade-in';
            // Insert after federation or at the end
            const fed = document.getElementById('household-federation-section');
            if (fed) fed.after(container);
            else host.append(container);
        }

        const history = getHistory();
        const civClass = detectClass(history, profiles);

        container.innerHTML = `
            <span class="civ-crest">${civClass.icon}</span>
            <h2 class="civ-class-name">${civClass.title}</h2>
            <p class="civ-proverb">“${civClass.proverb}”</p>

            <div class="civ-traits-grid">
                <div class="civ-trait-card">
                    <h4>${t('classStrengths')}</h4>
                    <ul class="civ-trait-list">
                        ${getStrengths(civClass.id).map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="civ-trait-card">
                    <h4>${t('classFailures')}</h4>
                    <ul class="civ-trait-list">
                        ${getFailures(civClass.id).map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="civ-faction-links">
                <a href="/civilizations/${civClass.id}-civilization.html" class="big-btn ghost mini">
                    📖 View Faction Doctrine
                </a>
                <button class="micro-share-icon mini" data-type="civ_class" data-text="Our household has been recognized as ${civClass.title}. “${civClass.proverb}”">📤</button>
            </div>
        `;

        container.querySelector('.micro-share-icon').onclick = () => {
            if (window.MeowAnalytics) {
                window.MeowAnalytics.microShare({
                    framework: 'civilization_class',
                    content_type: 'alignment',
                    text: container.querySelector('.micro-share-icon').getAttribute('data-text'),
                    route: '/'
                });
            }
        };

        // Analytics
        window.MeowTrack && window.MeowTrack('civilization_class_detected', {
            class_id: civClass.id,
            history_depth: history.length,
            lang: getLang()
        });
    }

    function getStrengths(id) {
        const data = {
            recovery: ["High emotional resilience", "Coordinated rest protocols", "Bunker-ready"],
            loud: ["Direct communication", "High survival energy", "Unfiltered honesty"],
            parallel: ["Minimal social drain", "Extreme autonomy", "Atmospheric trust"],
            chaos: ["Improvisational recovery", "Adaptive logic", "Side-quest optimized"],
            blanket: ["Superior comfort logistics", "Horizontal stability", "Soft boundary mastery"],
            soup: ["Efficient nutrient delivery", "Non-verbal caretaking", "Ramen-fueled persistence"],
            survivalist: ["Era-hardened", "Emotional scar mastery", "Crisis-tolerant"],
            stability: ["Predictable atmosphere", "Low friction daily", "Sustainable peace"]
        };
        return data[id] || [];
    }

    function getFailures(id) {
        const data = {
            recovery: ["Prolonged inactivity", "Decision-making paralysis", "Fear of sunlight"],
            loud: ["Emotional burnout", "Aggressive sarcasm", "Permanent overstimulation"],
            parallel: ["Total social ghosting", "Emotional isolation", "Misread silences"],
            chaos: ["Structural collapse", "Lost original quest", "Burnout through movement"],
            blanket: ["Universal avoidance", "Furniture dependence", "Leg atrophy"],
            soup: ["Executive function failure", "Excessive sodium levels", "Chopstick fatigue"],
            survivalist: ["Hyper-vigilance", "Cynical outlook", "Relic-based obsession"],
            stability: ["Stagnation", "Conflict avoidance", "Boredom-induced chaos"]
        };
        return data[id] || [];
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCivAlignment);
    } else {
        renderCivAlignment();
    }

    window.addEventListener('meow:daily:updated', renderCivAlignment);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderCivAlignment();
    });
})();
