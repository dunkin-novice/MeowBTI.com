/**
 * MeowBTI Household Rituals & Ceremonies v1
 * Recommends collective activities based on emotional climate.
 */
(function() {
    if (!window.MeowI18n || !window.MeowDaily || !window.MeowStore) return;

    const { t, getLang } = window.MeowI18n;

    function getRitualRecommendation(climate, momentum, history) {
        let key = 'ritParallelPlay';
        
        if (climate === 'heavy' || momentum === 'fragile') {
            key = 'ritSilentRot';
        } else if (climate === 'loud' || momentum === 'escalating') {
            key = 'ritCornerDisappear';
        } else if (climate === 'unstable') {
            key = 'ritSharedFood';
        }
        
        return {
            title: t(key),
            desc: t(key + 'Desc'),
            key: key
        };
    }

    function getRecoveryArchetype(history) {
        if (history.length < 5) return t('archCave');

        const recent = history.slice(0, 10);
        const highEnergy = recent.filter(h => h.answers.energy === 'high').length;
        
        if (highEnergy > recent.length * 0.6) return t('archLoud');
        return t('archSnack'); // Default
    }

    function getCeremonies(climate) {
        const list = [t('cerDetox'), t('cerBlanket')];
        if (climate === 'heavy') list.push(t('cerTuna'));
        if (climate === 'loud') list.push(t('cerQuiet'));
        return list;
    }

    function getRepairAlert(history) {
        if (history.length < 3) return null;
        const today = history.filter(h => h.date === new Date().toISOString().split('T')[0]);
        const stressAvg = today.reduce((acc, c) => acc + (c.answers.stress === 'overloaded' ? 2 : 0), 0) / (today.length || 1);
        
        if (stressAvg > 1) return t('repairInWalls');
        return null;
    }

    function renderRituals() {
        const host = window.MeowOS ? window.MeowOS.getLayer('daily') : document.getElementById('family-content');
        if (!host) return;

        const profiles = window.MeowStore.getFamily();
        if (profiles.length < 2) return;

        let container = document.getElementById('household-rituals-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'household-rituals-section';
            container.className = 'rituals-container animate-fade-in';
            host.append(container);
        }

        const history = window.MeowDaily.getHistory() || [];
        const climate = window.MeowClimate ? window.MeowClimate.getCollectiveClimate(profiles, history) : { key: 'calm' };
        const momentum = window.MeowClimate ? window.MeowClimate.getMomentum(history) : { key: 'stabilizing' };
        
        let ritual = getRitualRecommendation(climate.key, momentum.key, history);
        let archetype = getRecoveryArchetype(history);
        let ceremonies = getCeremonies(climate.key);
        
        if (window.MeowActiveArc) {
            const arc = window.MeowActiveArc;
            if (arc.key === 'blanket') {
                ritual = { title: "Parallel Rotting Ceremony", desc: "No verbal requirements. Total horizontal existence.", key: 'arc_ritual' };
                ceremonies = ["Blanket Deployment", "Silent Nesting", "Light Blackout"];
            } else if (arc.key === 'loud') {
                ritual = { title: "Emergency Soup Protocol", desc: "Minimal interaction. High-frequency recovery.", key: 'arc_ritual' };
                ceremonies = ["Noise Cancellation", "Broth Maintenance", "Crisis Diffusion"];
            } else if (arc.key === 'parallel') {
                ritual = { title: "Silent Coexistence Window", desc: "Deep co-regulation without eye contact.", key: 'arc_ritual' };
                ceremonies = ["Mutual Ghosting", "Vibe Synchronization", "Zero Feedback"];
            }
            
            if (window.MeowTrack) {
                window.MeowTrack('worldview_override_triggered', { arc_key: arc.key, module: 'rituals', lang: getLang() });
            }
        }
        
        const repair = getRepairAlert(history);
        const guidance = window.MeowMuseum ? window.MeowMuseum.getApparition('ritual') : null;
        if (guidance && window.MeowTrack) {
            window.MeowTrack('ritual_manifestation', { relic_key: guidance.relic.id, lang: getLang() });
        }

        container.innerHTML = `
            <div class="wm-header">
                <h2 class="wm-title">${t('ritualTitle')}</h2>
                <p class="wm-intro">${t('ritualIntro')}</p>
            </div>

            <div class="ritual-card">
                <button class="micro-share-icon mini" data-type="ritual" data-text="Recommended Ritual: ${ritual.title}. ${ritual.desc}">📤</button>
                <span class="ritual-badge">${archetype}</span>
                <h3 class="ritual-name">${ritual.title}</h3>
                <p class="ritual-desc">${ritual.desc}</p>
            </div>

            ${guidance ? `
                <div class="apparition-card animate-fade-in">
                    <span class="apparition-header">Relic Guidance</span>
                    <div class="apparition-text">${guidance.text}</div>
                    <button class="micro-share-icon mini" data-type="apparition" data-text="Relic Guidance: ${guidance.text}">📤</button>
                </div>
            ` : ''}

            <div class="ceremony-row">
                ${ceremonies.map(c => `<div class="ceremony-chip" data-text="${c}">📤 ${c}</div>`).join('')}
            </div>

            ${repair ? `
                <div class="repair-alert">
                    <span>💡</span>
                    <span>${repair}</span>
                </div>
            ` : ''}
        `;

        container.querySelectorAll('.micro-share-icon').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_rituals',
                        content_type: btn.getAttribute('data-type') || 'ritual_recommendation',
                        text: btn.getAttribute('data-text'),
                        route: '/'
                    });
                }
            };
        });

        container.querySelectorAll('.ceremony-chip').forEach(btn => {
            btn.onclick = () => {
                if (window.MeowAnalytics) {
                    window.MeowAnalytics.microShare({
                        framework: 'household_rituals',
                        content_type: 'ceremony_mode',
                        text: `Household Recovery Mode: ${btn.getAttribute('data-text')}`,
                        route: '/'
                    });
                }
            };
        });

        // Analytics
        window.MeowTrack && window.MeowTrack('ritual_view', {
            ritual_type: ritual.key,
            household_climate: climate.key,
            momentum_state: momentum.key,
            profile_count: profiles.length,
            lang: getLang()
        });

        if (climate.key !== 'calm' && window.MeowTrack) {
            window.MeowTrack('recovery_mode_detected', {
                ritual_category: archetype,
                household_climate: climate.key,
                lang: getLang()
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderRituals);
    } else {
        renderRituals();
    }

    window.addEventListener('meow:daily:updated', renderRituals);
    window.addEventListener('storage', (e) => {
        if (e.key === 'meow-bti-family' || e.key === 'meowbti.dailyCheckins.v2') renderRituals();
    });
})();
