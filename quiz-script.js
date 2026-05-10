// MeowBTI quiz — binary YES/NO swipe deck.
// Supports Short (12 q) and Deep (60 q) modes.
//
// Interaction: drag past threshold OR flick OR tap YES/NO buttons OR press
// Y/N or arrow keys. Card tilts during drag, tints green/red, shows YES/NO
// stamp past 40% threshold, flies off on commit. Stack peek shows next 2
// cards behind active.

let STATEMENTS = [];
let TOTAL = 0;
let idx = 0;
let answers = []; // each entry: true (yes) | false (no)
let locked = true; // locked until quiz starts
let currentMode = 'short';

const stackEl = document.getElementById('card-stack');
const countEl = document.getElementById('quiz-count');
const progressEl = document.getElementById('quiz-progress');
const modeSelectEl = document.getElementById('quiz-mode-select');

const STORAGE_KEY = 'meow-bti-quiz-state';

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

// ─── state management ────────────────────────────────────────
function saveState() {
    if (idx === 0) return;
    const state = {
        mode: currentMode,
        idx: idx,
        answers: answers,
        timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearState() {
    localStorage.removeItem(STORAGE_KEY);
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
        const state = JSON.parse(saved);
        // Expire after 24 hours
        if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
            clearState();
            return null;
        }
        return state;
    } catch (e) {
        return null;
    }
}

// ─── quiz lifecycle ──────────────────────────────────────────
function startQuiz(mode, resumeData = null) {
    currentMode = mode || 'short';
    STATEMENTS = window.MeowQuestions[currentMode] || window.MeowQuestions.short;
    TOTAL = STATEMENTS.length;
    
    if (resumeData) {
        idx = resumeData.idx;
        answers = resumeData.answers;
    } else {
        idx = 0;
        answers = [];
    }

    locked = false;
    modeSelectEl.style.display = 'none';
    stackEl.style.display = 'block';
    
    window.MeowTrack && window.MeowTrack('quiz_start', { 
        lang: getLang(), 
        mode: currentMode, 
        length: TOTAL,
        resumed: !!resumeData
    });

    renderProgress();
    renderStack();
}

function checkResume() {
    const saved = loadState();
    if (saved) {
        // Show resume prompt
        const resumeBox = document.createElement('div');
        resumeBox.className = 'resume-box';
        resumeBox.innerHTML = `
            <span>${tStr('quizResume', 'Resume quiz?')} (${saved.idx}/${saved.mode === 'deep' ? 60 : 12})</span>
            <div class="resume-actions">
                <button class="restart-btn" onclick="this.parentElement.parentElement.remove()">${tStr('quizRestart', 'restart')}</button>
                <button class="resume-btn" id="resume-confirm-btn">${tStr('quizStampYes', 'YES')}</button>
            </div>
        `;
        modeSelectEl.prepend(resumeBox);
        document.getElementById('resume-confirm-btn').onclick = () => {
            startQuiz(saved.mode, saved);
        };
    }
}

// ─── progress + count ────────────────────────────────────────
function renderProgress() {
    progressEl.innerHTML = '';
    
    // For Deep mode, we might want to skip some pips if space is tight
    // but the CSS handles flex-wrap. For 60, let's use a progress bar
    // if on mobile, or just smaller pips.
    const isDeep = TOTAL > 20;
    
    if (isDeep) {
        progressEl.classList.add('is-deep');
        // If 60 questions, maybe just show a filled bar?
        // Let's stick to pips but style them differently in CSS if needed.
    }

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
    for (let d = 2; d >= 0; d--) {
        const card = buildCardEl(idx + d, d);
        if (card) stackEl.appendChild(card);
    }
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
    document.getElementById('btn-no').onclick = () => commit(false);
    document.getElementById('btn-yes').onclick = () => commit(true);
}

// ─── drag interaction ────────────────────────────────────────
const COMMIT_DISTANCE = 100;
const STAMP_THRESHOLD = 40;
const FLICK_VELOCITY  = 0.6;

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
        const dy = (e.clientY - startY) * 0.4;
        const rot = Math.max(-15, Math.min(15, dx / 14));
        card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;

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
        const tint  = card.querySelector(yes ? '.swipe-tint-yes' : '.swipe-tint-no');
        const stamp = card.querySelector(yes ? '.swipe-stamp-yes' : '.swipe-stamp-no');
        if (tint)  tint.style.opacity = 1;
        if (stamp) stamp.style.opacity = 1;
    }
    try { if (navigator.vibrate) navigator.vibrate(15); } catch (_) {}

    const st = STATEMENTS[idx];
    window.MeowTrack && window.MeowTrack('quiz_question_answered', {
        question_index: idx + 1,
        mode: currentMode,
        statement: st.s,
        choice: yes ? 'yes' : 'no',
        scored_letter: yes ? st.yes : st.no,
        lang: getLang(),
    });

    setTimeout(() => {
        answers.push(yes);
        idx++;
        saveState();
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
        (tally.R >= tally.F ? 'R' : 'C');
    return { code, tally };
}

function finish() {
    const { code, tally } = classify(answers);
    const t = ['C','S','H','D','B','N','R','F'].map(k => `${k}${tally[k]}`).join('');
    clearState();
    window.MeowTrack && window.MeowTrack('quiz_complete', { code, mode: currentMode, lang: getLang() });
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
window.startQuiz = startQuiz; // Expose to global for HTML buttons

if (stackEl) {
    bindKeyboard();
    checkResume();
    
    // Check URL for direct mode
    const urlMode = new URLSearchParams(window.location.search).get('mode');
    if (urlMode === 'short' || urlMode === 'deep') {
        startQuiz(urlMode);
    }
}
