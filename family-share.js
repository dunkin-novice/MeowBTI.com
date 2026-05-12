/**
 * MeowBTI Household Poster Generator
 * Renders a vertical 1080x1920 poster for the entire saved family.
 */
(function() {
    const W = 1080;
    const H = 1920;
    const POSTER = {
        ink: '#1F1410',
        cream: '#FFF4EC',
        paper: '#FFFFFF',
        accent: '#FF5B3B',
        shadow: 'rgba(0,0,0,0.15)',
    };

    function getT() {
        return (window.MeowI18n && window.MeowI18n.t) || ((k) => k);
    }

    const TITLES = [
        "titleDictators", "titleUnstable", "titleSyndicate", 
        "titleChaos", "titleJudgment", "titleScreamers", "titleOneBrain"
    ];

    const FOOTERS = [
        "footPeace", "footNormal", "footVibes", "footProblem", "footLove"
    ];

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image: ' + src));
            img.src = src;
        });
    }

    async function generatePoster(profiles) {
        const t = getT();
        
        // Hook: Generation started
        window.dispatchEvent(new CustomEvent('family_poster_generated', { detail: { count: profiles.length } }));

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // 1. Background
        ctx.fillStyle = POSTER.cream;
        ctx.fillRect(0, 0, W, H);

        // Grain/Pattern
        ctx.fillStyle = 'rgba(0,0,0,0.03)';
        for (let x = 0; x < W; x += 30) {
            for (let y = 0; y < H; y += 30) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 2. Header
        const titleKey = TITLES[Math.floor(Math.random() * TITLES.length)];
        const title = t(titleKey);
        ctx.fillStyle = POSTER.ink;
        ctx.textAlign = 'center';
        ctx.font = '900 80px "Fraunces", serif';
        ctx.fillText(title, W / 2, 160);

        ctx.font = '600 36px "Space Grotesk", sans-serif';
        ctx.globalAlpha = 0.6;
        ctx.fillText(t('posterHouseholdVerdict'), W / 2, 220);
        ctx.globalAlpha = 1.0;

        // 3. Profiles Grid
        const gridTop = 300;
        const cardW = 400;
        const cardH = 500;
        const gap = 60;
        const cols = profiles.length > 4 ? 3 : 2;
        const startX = (W - (cols * cardW + (cols - 1) * gap)) / 2;

        for (let i = 0; i < Math.min(profiles.length, 9); i++) {
            const p = profiles[i];
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cardW + gap);
            const y = gridTop + row * (cardH + gap);

            // Card Shadow
            ctx.fillStyle = POSTER.shadow;
            ctx.beginPath();
            ctx.roundRect(x + 10, y + 10, cardW, cardH, 30);
            ctx.fill();

            // Card Body
            ctx.fillStyle = POSTER.paper;
            ctx.strokeStyle = POSTER.ink;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(x, y, cardW, cardH, 30);
            ctx.fill();
            ctx.stroke();

            // Archetype Image
            const archetype = window.MeowArchetypes ? window.MeowArchetypes.get(p.code) : null;
            if (archetype) {
                try {
                    const imgPath = `assets/personalities/${archetype.code.toLowerCase()}-${archetype.slug}.webp`;
                    const img = await loadImage(imgPath);
                    const imgSize = 280;
                    ctx.drawImage(img, x + (cardW - imgSize) / 2, y + 40, imgSize, imgSize);
                } catch (e) {
                    console.warn(e);
                }
            }

            // Text
            ctx.fillStyle = POSTER.ink;
            ctx.font = '800 42px "Fraunces", serif';
            ctx.fillText(p.name, x + cardW / 2, y + 380);
            
            ctx.font = '600 24px "Space Grotesk", sans-serif';
            ctx.globalAlpha = 0.7;
            ctx.fillText(p.archetypeName, x + cardW / 2, y + 420);
            
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = POSTER.accent;
            ctx.font = '900 28px "Space Grotesk", sans-serif';
            ctx.fillText(p.code, x + cardW / 2, y + 460);
        }

        // 4. Stats / Dynamics
        const stats = window.MeowCompatibility ? window.MeowCompatibility.getStats(profiles) : null;
        if (stats) {
            const statsY = H - 380;
            ctx.fillStyle = POSTER.ink;
            ctx.font = '900 48px "Fraunces", serif';
            ctx.fillText(`${t('statsChaos')}: ${stats.chaosLevel}%`, W / 2, statsY);
            
            ctx.font = '600 32px "Space Grotesk", sans-serif';
            ctx.globalAlpha = 0.6;
            ctx.fillText(`${t('statsDominant')}: ${stats.dominantAxis}`, W / 2, statsY + 50);
            ctx.globalAlpha = 1.0;
        }

        // 5. Footer
        const footerKey = FOOTERS[Math.floor(Math.random() * FOOTERS.length)];
        const footer = t(footerKey);
        ctx.fillStyle = POSTER.ink;
        ctx.font = 'italic 700 42px "Fraunces", serif';
        ctx.fillText(`"${footer}"`, W / 2, H - 200);

        ctx.font = '800 32px "Space Grotesk", sans-serif';
        ctx.fillText('meowbti.com', W / 2, H - 100);

        // Download
        try {
            // Hook: Share attempt
            window.dispatchEvent(new CustomEvent('family_poster_share_attempt', { detail: { method: 'download' } }));
            
            const link = document.createElement('a');
            link.download = `meowbti-household-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Hook: Success
            window.dispatchEvent(new CustomEvent('family_poster_download', { detail: { success: true } }));
        } catch (e) {
            console.error('MeowPoster: Failed to export', e);
        }
    }

    window.MeowFamilyShare = {
        generatePoster
    };
})();
