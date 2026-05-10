// MeowBTI quiz — binary YES/NO swipe deck. 12 statements. Vanilla JS.
//
// Each statement maps to one axis (CS / HD / BN / RF) with explicit yes-side
// and no-side letters. 3 statements per axis × 4 axes = 12. Odd vote count
// per axis → no ties.
//
// Interaction: drag past threshold OR flick OR tap YES/NO buttons OR press
// Y/N or arrow keys. Card tilts during drag, tints green/red, shows YES/NO
// stamp past 40% threshold, flies off on commit. Stack peek shows next 2
// cards behind active.
//
// Redirects to personality-types/<CODE>.html?t=<tally>[&lang=th] on finish.

const STATEMENTS = [
    // ─── CS axis (2 C-yes, 1 S-yes) ──────────────────────────
    { emoji: "🚪", yes: "C", no: "S",
      s:   "Your cat acts like you've returned from war after a 3-minute bathroom trip.",
      sTh: "แมวคุณทำตัวเหมือนคุณกลับจากสงคราม ทั้งที่เพิ่งเข้าห้องน้ำไป 3 นาที" },
    { emoji: "👻", yes: "S", no: "C",
      s:   "Your cat becomes a rumor when guests come over. May or may not exist.",
      sTh: "แมวคุณกลายเป็นตำนานเวลาแขกมาบ้าน มีอยู่จริงหรือเปล่าก็ไม่รู้" },
    { emoji: "⌨️", yes: "C", no: "S",
      s:   "Your cat walks across your keyboard mid-meeting just to remind you they exist.",
      sTh: "แมวคุณเดินผ่านคีย์บอร์ดกลางประชุม แค่อยากเตือนว่ายังอยู่นะ" },

    // ─── HD axis (1 H-yes, 2 D-yes) ──────────────────────────
    { emoji: "🎯", yes: "H", no: "D",
      s:   "Your cat will pursue a hair tie under the fridge for 40 minutes.",
      sTh: "แมวคุณตามยางรัดผมที่กลิ้งเข้าใต้ตู้เย็นได้ 40 นาทีแบบไม่ยอมแพ้" },
    { emoji: "👁️", yes: "D", no: "H",
      s:   "Your cat stares at a wall like it owes them money.",
      sTh: "แมวคุณจ้องกำแพงเหมือนกำแพงติดหนี้อยู่" },
    { emoji: "🪲", yes: "D", no: "H",
      s:   "Your cat watches a passing moth like it has prophecy value.",
      sTh: "แมวคุณมองผีเสื้อกลางคืนบินผ่านเหมือนมันมาบอกอนาคต" },

    // ─── BN axis (2 B-yes, 1 N-yes) ──────────────────────────
    { emoji: "🚧", yes: "B", no: "N",
      s:   "Your cat believes closed doors are personal attacks.",
      sTh: "แมวคุณเชื่อว่าประตูที่ปิดอยู่คือการโจมตีส่วนตัว" },
    { emoji: "💞", yes: "N", no: "B",
      s:   "Your cat slow-blinks at you like a tiny therapist.",
      sTh: "แมวคุณกะพริบตาช้าๆ ใส่คุณเหมือนนักจิตบำบัดตัวจิ๋ว" },
    { emoji: "💼", yes: "B", no: "N",
      s:   "Your cat will body-slam you for treats.",
      sTh: "แมวคุณพร้อมพุ่งชนคุณเพื่อขอขนม" },

    // ─── RF axis (1 R-yes, 2 F-yes) ──────────────────────────
    { emoji: "📍", yes: "R", no: "F",
      s:   "Your cat treats their favorite spot as a sacred site. Do not sit there.",
      sTh: "แมวคุณถือว่าจุดโปรดของตัวเองเป็นพื้นที่ศักดิ์สิทธิ์ ห้ามนั่งเด็ดขาด" },
    { emoji: "🌀", yes: "F", no: "R",
      s:   "Your cat sleeps wherever they collapse — new spot every night.",
      sTh: "แมวคุณนอนตรงไหนก็ได้ที่ล้มลง คืนนี้จุดนึง พรุ่งนี้อีกจุด" },
    { emoji: "🕰️", yes: "F", no: "R",
      s:   "Your cat eats whenever they feel like it. Could be now. Could be in 4 hours.",
      sTh: "แมวคุณกินตอนไหนก็ได้ที่อยากกิน อาจจะเดี๋ยวนี้ หรืออีก 4 ชั่วโมงข้างหน้า" },
];

const TOTAL = STATEMENTS.length;
let idx = 0;
const answers = []; // each entry: true (yes) | false (no)
let locked = false;

const stackEl = document.getElementById('card-stack');
const countEl = document.getElementById('quiz-count');
const progressEl = document.getElementById('quiz-progress');

// ─── i18n helpers ────────────────────────────────────────────
function getLang() {
    return (window.MeowI18n && window.MeowI18n.getLang && window.MeowI18n.getLang()) || 'en';
}
function tStr(key, fallback) {
    return (window.MeowI18n && window.MeowI18n.t(key)) || fallback;
}
function tFn(key, ...args) {
    return (window.MeowI18n && window.MeowI18n.t(key, ...args)) || args.join(' ');
}
function statementText(st) {
    return getLang() === 'th' && st.sTh ? st.sTh : st.s;
}

// ─── progress + count ────────────────────────────────────────
function renderProgress() {
    progressEl.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
        const pip = document.createElement('span');
        pip.className = 'pip' + (i < answers.length ? ' done' : '') + (i === idx ? ' active' : '');
        progressEl.appendChild(pip);
    }
    progressEl.setAttribute('aria-valuemax', String(TOTAL));
    progressEl.setAttribute('aria-valuenow', String(Math.min(idx + 1, TOTAL)));
    countEl.textContent = tFn('quizCount', Math.min(idx + 1, TOTAL), TOTAL);
}

// ─── card rendering ──────────────────────────────────────────
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
}

function buildCardEl(stIdx, depth) {
    // depth: 0 = active, 1 = peek-1, 2 = peek-2
    if (stIdx >= TOTAL) return null;
    const st = STATEMENTS[stIdx];
    const card = document.createElement('article');
    card.className = `qcard-binary depth-${depth}`;
    card.dataset.stIdx = String(stIdx);
    card.innerHTML = `
        <div class="swipe-tint swipe-tint-yes" aria-hidden="true"></div>
        <div class="swipe-tint swipe-tint-no" aria-hidden="true"></div>
        <div class="swipe-stamp swipe-stamp-yes" aria-hidden="true">${escapeHtml(tStr('quizStampYes', 'YES'))}</div>
        <div class="swipe-stamp swipe-stamp-no"  aria-hidden="true">${escapeHtml(tStr('quizStampNo', 'NO'))}</div>
        <div class="qcard-tag">Q${stIdx + 1}</div>
        <div class="qcard-emoji" aria-hidden="true">${st.emoji}</div>
        <p class="qcard-statement">${escapeHtml(statementText(st))}</p>
    `;
    return card;
}

function renderStack() {
    stackEl.innerHTML = '';
    // Render back-to-front so DOM order matches z-index expectation.
    for (let d = 2; d >= 0; d--) {
        const card = buildCardEl(idx + d, d);
        if (card) stackEl.appendChild(card);
    }
    // Bind drag only on the active (front) card.
    const active = stackEl.querySelector('.depth-0');
    if (active) attachDrag(active);
    renderActions();
}

function renderActions() {
    let actions = document.getElementById('swipe-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.className = 'swipe-actions';
        actions.id = 'swipe-actions';
        stackEl.parentNode.appendChild(actions);
    }
    actions.innerHTML = `
        <button class="swipe-btn no" type="button" id="btn-no" aria-label="No">${escapeHtml(tStr('quizSwipeNo', 'NO ✗'))}</button>
        <button class="swipe-btn yes" type="button" id="btn-yes" aria-label="Yes">${escapeHtml(tStr('quizSwipeYes', 'YES ✓'))}</button>
    `;
    document.getElementById('btn-no').addEventListener('click', () => commit(false));
    document.getElementById('btn-yes').addEventListener('click', () => commit(true));
}

// ─── drag interaction ────────────────────────────────────────
const COMMIT_DISTANCE = 100;     // px — past this = commit
const STAMP_THRESHOLD = 40;      // px — start fading in stamp
const FLICK_VELOCITY  = 0.6;     // px/ms — flick triggers commit

function attachDrag(card) {
    let pointerId = null;
    let startX = 0, startY = 0;
    let lastX = 0, lastTime = 0;
    let velocity = 0;
    let dragging = false;

    function onDown(e) {
        if (e.target.closest('.swipe-btn')) return;
        if (locked) return;
        dragging = true;
        pointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        lastX = e.clientX;
        lastTime = performance.now();
        card.setPointerCapture(pointerId);
        card.classList.add('dragging');
    }

    function onMove(e) {
        if (!dragging || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = (e.clientY - startY) * 0.4; // dampen vertical
        const rot = Math.max(-15, Math.min(15, dx / 14));
        card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;

        // Tint + stamp opacity from drag distance
        const absX = Math.abs(dx);
        const tintAlpha = Math.min(1, absX / 220);
        const stampAlpha = Math.max(0, Math.min(1, (absX - STAMP_THRESHOLD) / 80));
        const tintYes = card.querySelector('.swipe-tint-yes');
        const tintNo  = card.querySelector('.swipe-tint-no');
        const stampYes = card.querySelector('.swipe-stamp-yes');
        const stampNo  = card.querySelector('.swipe-stamp-no');
        if (dx > 0) {
            tintYes.style.opacity = tintAlpha; tintNo.style.opacity = 0;
            stampYes.style.opacity = stampAlpha; stampNo.style.opacity = 0;
        } else {
            tintNo.style.opacity = tintAlpha;  tintYes.style.opacity = 0;
            stampNo.style.opacity = stampAlpha;  stampYes.style.opacity = 0;
        }

        // Track velocity (rolling over last few ms)
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) velocity = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastTime = now;
    }

    function onUp(e) {
        if (!dragging) return;
        if (pointerId !== null && e.pointerId !== pointerId) return;
        dragging = false;
        try { card.releasePointerCapture(pointerId); } catch (_) {}
        pointerId = null;
        card.classList.remove('dragging');

        const dx = e.clientX - startX;
        const flicked = Math.abs(velocity) >= FLICK_VELOCITY && Math.sign(velocity) === Math.sign(dx);
        const past = Math.abs(dx) >= COMMIT_DISTANCE;
        if (past || flicked) {
            commit(dx > 0);
        } else {
            // Snap back. Resetting transform + clearing tints triggers
            // the CSS transition.
            card.style.transform = '';
            card.querySelectorAll('.swipe-tint, .swipe-stamp').forEach(el => el.style.opacity = '');
        }
    }

    card.addEventListener('pointerdown', onDown);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', onUp);
}

// ─── commit + advance ────────────────────────────────────────
function commit(yes) {
    if (locked || idx >= TOTAL) return;
    locked = true;
    const card = stackEl.querySelector('.depth-0');
    if (card) {
        card.classList.add(yes ? 'exit-right' : 'exit-left');
        // Make sure tint+stamp are visible during the fly-off
        const tint  = card.querySelector(yes ? '.swipe-tint-yes' : '.swipe-tint-no');
        const stamp = card.querySelector(yes ? '.swipe-stamp-yes' : '.swipe-stamp-no');
        if (tint)  tint.style.opacity = 1;
        if (stamp) stamp.style.opacity = 1;
    }
    // Light haptic on mobile
    try { if (navigator.vibrate) navigator.vibrate(15); } catch (_) {}

    const st = STATEMENTS[idx];
    window.MeowTrack && window.MeowTrack('quiz_question_answered', {
        question_index: idx + 1,
        statement: st.s,                 // EN identifier — stable for analytics
        choice: yes ? 'yes' : 'no',
        scored_letter: yes ? st.yes : st.no,
        lang: getLang(),
    });

    setTimeout(() => {
        answers.push(yes);
        idx++;
        if (idx >= TOTAL) {
            finish();
        } else {
            renderProgress();
            renderStack();
            locked = false;
        }
    }, 280);
}

// ─── classification ──────────────────────────────────────────
function classify(answers) {
    const tally = { C:0, S:0, H:0, D:0, B:0, N:0, R:0, F:0 };
    STATEMENTS.forEach((st, i) => {
        const ans = answers[i];
        if (typeof ans !== 'boolean') return;
        const letter = ans ? st.yes : st.no;
        tally[letter] = (tally[letter] || 0) + 1;
    });
    const code =
        (tally.C >= tally.S ? 'C' : 'S') +
        (tally.H >= tally.D ? 'H' : 'D') +
        (tally.B >= tally.N ? 'B' : 'N') +
        (tally.R >= tally.F ? 'R' : 'C');  // 4th: R or "C" (Casual) for the URL
    return { code, tally };
}

function finish() {
    const { code, tally } = classify(answers);
    const t = ['C','S','H','D','B','N','R','F'].map(k => `${k}${tally[k]}`).join('');
    window.MeowTrack && window.MeowTrack('quiz_complete', { code, lang: getLang() });
    const langSuffix = getLang() === 'th' ? '&lang=th' : '';
    window.location.href = `personality-types/${code}.html?t=${t}${langSuffix}`;
}

// ─── keyboard ────────────────────────────────────────────────
function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (locked) return;
        if (e.key === 'ArrowRight' || e.key === 'y' || e.key === 'Y') {
            e.preventDefault();
            commit(true);
        } else if (e.key === 'ArrowLeft' || e.key === 'n' || e.key === 'N') {
            e.preventDefault();
            commit(false);
        }
    });
}

// ─── boot ────────────────────────────────────────────────────
if (stackEl) {
    window.MeowTrack && window.MeowTrack('quiz_start', { lang: getLang(), length: TOTAL });
    renderProgress();
    renderStack();
    bindKeyboard();
}
