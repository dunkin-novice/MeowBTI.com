// MeowBTI share-poster builder.
// Renders a 1080x1920 story poster for the current personality.
// v1: with user-uploaded cat photo (illustration shown as a small badge).
// v2: no photo — illustration is the hero.
// Falls back from Web Share API → download. Pure client-side (static site).

(function () {
    const W = 1080;
    const H = 1920;

    const POSTER = {
        ink: '#1F1410',
        cream: '#FFF4EC',
        paper: '#FFFFFF',
        shadow: 'rgba(0,0,0,0.18)',
    };

    // ── helpers ───────────────────────────────────────────────
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function readFileAsImage(file) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = r.result;
            };
            r.onerror = reject;
            r.readAsDataURL(file);
        });
    }

    function roundRectPath(ctx, x, y, w, h, r) {
        const rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.lineTo(x + w - rr, y);
        ctx.arcTo(x + w, y, x + w, y + rr, rr);
        ctx.lineTo(x + w, y + h - rr);
        ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
        ctx.lineTo(x + rr, y + h);
        ctx.arcTo(x, y + h, x, y + h - rr, rr);
        ctx.lineTo(x, y + rr);
        ctx.arcTo(x, y, x + rr, y, rr);
        ctx.closePath();
    }

    function drawHardShadowRect(ctx, x, y, w, h, r, offset) {
        ctx.fillStyle = POSTER.shadow;
        roundRectPath(ctx, x + offset, y + offset, w, h, r);
        ctx.fill();
    }

    // Fit image into a box (cover), clipped by the box.
    function drawCover(ctx, img, x, y, w, h) {
        const ir = img.width / img.height;
        const br = w / h;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (ir > br) {
            sw = img.height * br;
            sx = (img.width - sw) / 2;
        } else {
            sh = img.width / br;
            sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    }

    // Fit image into a box (contain), keeping aspect.
    function drawContain(ctx, img, x, y, w, h) {
        const ir = img.width / img.height;
        const br = w / h;
        let dw, dh;
        if (ir > br) { dw = w; dh = w / ir; }
        else { dh = h; dw = h * ir; }
        const dx = x + (w - dw) / 2;
        const dy = y + (h - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
    }

    // Multiline text wrap by width. Returns lines (no actual draw).
    function wrapLines(ctx, text, maxWidth) {
        const words = String(text).split(/\s+/);
        const lines = [];
        let line = '';
        for (const w of words) {
            const test = line ? line + ' ' + w : w;
            if (ctx.measureText(test).width > maxWidth && line) {
                lines.push(line);
                line = w;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
        return lines;
    }

    // Pill chip with text. Returns width drawn.
    function drawPill(ctx, x, y, text, opts) {
        const padX = opts.padX || 22;
        const padY = opts.padY || 12;
        ctx.font = opts.font;
        const w = ctx.measureText(text).width + padX * 2;
        const h = opts.h || 44;
        ctx.fillStyle = opts.bg;
        ctx.strokeStyle = opts.border || 'transparent';
        ctx.lineWidth = opts.borderWidth || 0;
        roundRectPath(ctx, x, y, w, h, h / 2);
        ctx.fill();
        if (opts.borderWidth) ctx.stroke();
        ctx.fillStyle = opts.color;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(text, x + padX, y + h / 2 + 1);
        return w;
    }

    // ── poster rendering ──────────────────────────────────────
    async function renderPoster(personality, illustrationUrl, userImage) {
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // Wait for fonts so canvas uses Fraunces / Space Grotesk.
        try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}

        // Background — personality color band, full canvas.
        ctx.fillStyle = personality.color;
        ctx.fillRect(0, 0, W, H);

        // Subtle dot pattern overlay
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#ffffff';
        for (let y = 0; y < H; y += 14) {
            for (let x = (y / 14) % 2 === 0 ? 0 : 7; x < W; x += 14) {
                ctx.beginPath();
                ctx.arc(x, y, 1.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        // ── Top bar: MEOWBTI wordmark + cert stamp ──
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 56px "Fraunces", Georgia, serif';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText('😼  MEOWBTI', 80, 80);

        ctx.font = '600 22px "Space Grotesk", system-ui, sans-serif';
        ctx.textAlign = 'right';
        const stamp = `CERT №${Math.floor(100000 + Math.random() * 899999)}`;
        ctx.fillText(stamp, W - 80, 92);

        // ── Hero zone: white card with thick ink border ──
        const heroX = 80;
        const heroY = 220;
        const heroW = W - 160;
        const heroH = 920;
        const heroR = 48;

        drawHardShadowRect(ctx, heroX, heroY, heroW, heroH, heroR, 14);
        ctx.fillStyle = personality.bg;
        roundRectPath(ctx, heroX, heroY, heroW, heroH, heroR);
        ctx.fill();
        ctx.strokeStyle = POSTER.ink;
        ctx.lineWidth = 8;
        roundRectPath(ctx, heroX, heroY, heroW, heroH, heroR);
        ctx.stroke();

        const illustration = illustrationUrl ? await loadImage(illustrationUrl).catch(() => null) : null;

        if (userImage) {
            // v1 — user photo as the hero, illustration as bottom-right badge.
            ctx.save();
            roundRectPath(ctx, heroX + 16, heroY + 16, heroW - 32, heroH - 32, heroR - 12);
            ctx.clip();
            drawCover(ctx, userImage, heroX + 16, heroY + 16, heroW - 32, heroH - 32);
            ctx.restore();

            if (illustration) {
                // Illustration badge — circle, bottom-right, ink border.
                const bx = heroX + heroW - 220;
                const by = heroY + heroH - 220;
                const bw = 180;
                ctx.save();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(bx + bw / 2, by + bw / 2, bw / 2 + 14, 0, Math.PI * 2);
                ctx.fillStyle = POSTER.shadow;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(bx + bw / 2 + 6, by + bw / 2 + 6, bw / 2 + 8, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.lineWidth = 6;
                ctx.strokeStyle = POSTER.ink;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(bx + bw / 2 + 6, by + bw / 2 + 6, bw / 2 + 8, 0, Math.PI * 2);
                ctx.clip();
                drawContain(ctx, illustration, bx + 6, by + 6, bw, bw);
                ctx.restore();
            }
        } else if (illustration) {
            // v2 — illustration is the hero, contained inside the card.
            drawContain(ctx, illustration, heroX + 60, heroY + 60, heroW - 120, heroH - 120);
        }

        // ── Code (huge) ──
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '900 220px "Fraunces", Georgia, serif';
        ctx.fillText(personality.code, W / 2, heroY + heroH + 30);

        // ── Name ──
        ctx.font = '900 64px "Fraunces", Georgia, serif';
        const nameLines = wrapLines(ctx, personality.name, W - 200);
        let nameY = heroY + heroH + 270;
        for (const line of nameLines) {
            ctx.fillText(line, W / 2, nameY);
            nameY += 76;
        }

        // ── Tagline (italic) ──
        ctx.font = 'italic 500 36px "Fraunces", Georgia, serif';
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        const tagText = `"${personality.tagline}"`;
        const tagLines = wrapLines(ctx, tagText, W - 200);
        let tagY = nameY + 18;
        for (const line of tagLines) {
            ctx.fillText(line, W / 2, tagY);
            tagY += 48;
        }

        // ── Vibe pills (centered row, may wrap to 2 rows) ──
        ctx.font = '700 26px "Space Grotesk", system-ui, sans-serif';
        const pillH = 52;
        const pillGap = 14;
        const pillPadX = 22;
        const pillRows = [[]];
        let rowWidth = 0;
        const maxRowWidth = W - 160;
        for (const v of personality.vibes) {
            const w = ctx.measureText(v).width + pillPadX * 2;
            if (rowWidth + w + pillGap > maxRowWidth && pillRows[pillRows.length - 1].length) {
                pillRows.push([]);
                rowWidth = 0;
            }
            pillRows[pillRows.length - 1].push({ text: v, w });
            rowWidth += w + pillGap;
        }
        let pillY = tagY + 28;
        for (const row of pillRows) {
            const totalW = row.reduce((s, p) => s + p.w, 0) + pillGap * (row.length - 1);
            let px = (W - totalW) / 2;
            for (const p of row) {
                drawPill(ctx, px, pillY, p.text, {
                    bg: 'rgba(0,0,0,0.22)',
                    color: '#ffffff',
                    border: 'rgba(255,255,255,0.25)',
                    borderWidth: 2,
                    h: pillH,
                    padX: pillPadX,
                    font: '700 26px "Space Grotesk", system-ui, sans-serif',
                });
                px += p.w + pillGap;
            }
            pillY += pillH + 12;
        }

        // ── Footer ──
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 30px "Space Grotesk", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('take the test →', 80, H - 90);
        ctx.textAlign = 'right';
        ctx.fillText('meowbti.com', W - 80, H - 90);

        return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
    }

    // ── public API ────────────────────────────────────────────
    async function buildPoster(personality, illustrationUrl, fileOrNull) {
        const userImg = fileOrNull ? await readFileAsImage(fileOrNull) : null;
        return renderPoster(personality, illustrationUrl, userImg);
    }

    async function sharePoster(personality, blob) {
        const filename = `meowbti-${personality.code.toLowerCase()}.png`;
        const file = new File([blob], filename, { type: 'image/png' });
        const shareText = (window.MeowArchetypes && window.MeowArchetypes.shareCaption(personality.code))
            || `My cat is ${personality.code} — ${personality.name}. Take the test → meowbti.com`;

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: `MeowBTI: ${personality.name}`,
                    text: shareText,
                });
                return 'shared';
            } catch (err) {
                if (err && err.name === 'AbortError') return 'cancelled';
            }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        return 'downloaded';
    }

    window.MeowShare = { buildPoster, sharePoster };
})();
