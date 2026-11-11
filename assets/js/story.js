// ==========================================
//  選集頁 story.html：橫向滑動選集
// ==========================================
// 解鎖規則、進度、起始日都在 progress.js，和日曆頁共用。
//
// 舊原型（prototypes/）停不穩的原因和這裡的對應做法：
//   1. 每幀改 margin，版面一直動     → 卡片外框大小固定，縮放只用內層 transform
//   2. 每幀對 32 張卡「量位置、改樣式」→ 只讀一次 scrollLeft，用序號算出距離再一次寫入
//   3. 手動滑完沒有對齊               → CSS scroll-snap 交給瀏覽器對齊
//
// 點開某一集之後的轉場、當集卡片、彩蛋圖在 episode.js（和日曆頁共用），
// 素材怎麼選（有影片播影片，沒有就用當集圖片）也寫在那裡。

const rail = document.getElementById('rail');
const heroMeta = document.getElementById('hero-meta');
const heroTitle = document.getElementById('hero-title');
const heroState = document.getElementById('hero-state');
const progressBar = document.getElementById('rail-progress-bar');
const backdrops = [document.getElementById('backdrop-a'), document.getElementById('backdrop-b')];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================
//  素材與狀態
// ==========================================
let isDevMode = false;

function statusOf(i) {
    // 開發者模式：每一集都能打開（和日曆頁一樣，目前進度那集顯示為今天）
    if (isDevMode) return i === unlockedIndex ? 'today' : 'read';
    if (i < unlockedIndex) return 'read';
    if (i === unlockedIndex && i <= getDaysPassed()) return 'today';
    return 'locked';
}

function lockedReason(i) {
    const daysPassed = getDaysPassed();
    if (i > daysPassed) {
        const wait = i - daysPassed;
        return wait === 1 ? '明天解鎖' : `還要再等 ${wait} 天`;
    }
    return `先看完 ${episodes[unlockedIndex].ep}`;
}

// ==========================================
//  選集列
// ==========================================
const cards = [];
let step = 0;            // 相鄰兩張卡中心的距離（px），只在初始化和視窗大小改變時量
let centerIndex = -1;

function buildRail() {
    episodes.forEach((ep, i) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'card';
        card.dataset.idx = i;
        card.innerHTML = '<div class="card-face"></div>';
        card.addEventListener('click', () => onCardClick(i));
        // 用 Tab 移到某張卡時把它捲到中央
        card.addEventListener('focus', () => {
            if (card.matches(':focus-visible') && i !== centerIndex) goTo(i);
        });
        rail.appendChild(card);
        cards.push(card);
    });
    renderCards();
}

function renderCards() {
    cards.forEach((card, i) => {
        const ep = episodes[i];
        const status = statusOf(i);
        const m = mediaOf(i);
        const date = dateOf(i);
        card.classList.remove('read', 'today', 'locked');
        card.classList.add(status);

        const showCover = status !== 'locked' && m.cover;
        const badge = status === 'read' ? '已看過' : status === 'today' ? '今天' : '🔒';
        card.querySelector('.card-face').innerHTML = `
            ${showCover
                ? `<img src="${m.cover}" alt="" loading="lazy" decoding="async">`
                : `<div class="card-placeholder">${pad(i + 1)}</div>`}
            <span class="card-badge">${badge}</span>
            <div class="card-label">
                <span class="card-ep">${ep.ep}</span>
                <span class="card-date">${fmtDate(date)}</span>
            </div>`;

        const stateText = status === 'read' ? '已看過' : status === 'today' ? '今天可以打開' : '尚未解鎖';
        const titleText = status === 'locked' ? '' : `《${ep.title}》，`;
        card.setAttribute('aria-label', `${ep.ep}，${titleText}${date.getMonth() + 1} 月 ${date.getDate()} 日，${stateText}`);
    });
    centerIndex = -1;    // 讓 hero 重新整理
    updateFrame();
}

function measure() {
    if (cards.length < 2) return;
    // 用 getBoundingClientRect 拿小數，offsetLeft 會四捨五入，越後面的卡誤差越大
    step = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
}

// 一幀只讀一次 scrollLeft，其他全部用序號算
let framePending = false;
function updateFrame() {
    framePending = false;
    if (!step) return;
    const c = rail.scrollLeft / step;
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.setProperty('--dist', Math.min(Math.abs(i - c), 2).toFixed(3));
    }
    progressBar.style.transform = `scaleX(${Math.min(Math.max(c / (cards.length - 1), 0), 1)})`;

    const nearest = Math.min(Math.max(Math.round(c), 0), cards.length - 1);
    if (nearest !== centerIndex) {
        if (centerIndex >= 0) cards[centerIndex].classList.remove('is-center');
        centerIndex = nearest;
        cards[centerIndex].classList.add('is-center');
        updateHero(centerIndex);
    }
}

function requestFrame() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateFrame);
}

function goTo(i, smooth = true) {
    i = Math.min(Math.max(i, 0), cards.length - 1);
    rail.scrollTo({ left: i * step, behavior: smooth && !reducedMotion ? 'smooth' : 'auto' });
}

function onCardClick(i) {
    // 點旁邊的卡：先滑到中央；點中央那張：打開
    // 直接用現在的捲動位置判斷，不等下一幀更新 centerIndex
    if (i !== Math.round(rail.scrollLeft / step)) { goTo(i); return; }
    openEpisode(i);
}

rail.addEventListener('scroll', requestFrame, { passive: true });

window.addEventListener('resize', () => {
    const keep = centerIndex;
    measure();
    goTo(keep, false);
    requestFrame();
});

// 滑鼠滾輪（上下滾）一格換一集
let wheelAcc = 0;
let wheelLock = false;
rail.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   // 觸控板左右滑交給瀏覽器
    e.preventDefault();
    if (wheelLock) return;
    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) < 40) return;
    goTo(centerIndex + Math.sign(wheelAcc));
    wheelAcc = 0;
    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 320);
}, { passive: false });

// 鍵盤：← → 換集、Home / End 到頭尾
rail.addEventListener('keydown', (e) => {
    let target = null;
    if (e.key === 'ArrowRight') target = centerIndex + 1;
    else if (e.key === 'ArrowLeft') target = centerIndex - 1;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = cards.length - 1;
    if (target === null) return;
    e.preventDefault();
    target = Math.min(Math.max(target, 0), cards.length - 1);
    goTo(target);
    cards[target].focus({ preventScroll: true });
});

// ==========================================
//  選集條閒置淡出
// ==========================================
// 不操作 3 秒後選集條變淡，背景劇照的主角才不會被擋住。
// 滑動、滾輪、按鍵、觸控，或滑鼠移到選集條上時浮回來；滑鼠停在選集條上或鍵盤焦點在卡片上就不淡出。
const railWrap = document.querySelector('.rail-wrap');
const RAIL_IDLE_MS = 3000;
let railIdleTimer = null;

function wakeRail() {
    railWrap.classList.remove('idle');
    clearTimeout(railIdleTimer);
    railIdleTimer = setTimeout(() => {
        const hovering = railWrap.matches(':hover');
        const keyboardFocus = railWrap.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
        if (hovering || keyboardFocus) wakeRail();
        else railWrap.classList.add('idle');
    }, RAIL_IDLE_MS);
}

['pointermove', 'pointerdown', 'focusin'].forEach(type => railWrap.addEventListener(type, wakeRail));
rail.addEventListener('scroll', wakeRail, { passive: true });
['wheel', 'keydown', 'touchstart'].forEach(type =>
    document.addEventListener(type, wakeRail, { passive: true }));

// ==========================================
//  上方資訊與背景
// ==========================================
let backdropTimer = null;
let backdropFront = 0;
let backdropSrc = '';

function updateHero(i) {
    const ep = episodes[i];
    const status = statusOf(i);
    heroMeta.textContent = `${ep.ep}　·　${fmtDate(dateOf(i))}　·　第 ${i + 1} 天`;
    heroTitle.textContent = status === 'locked' ? '尚未解鎖' : ep.title;
    heroState.classList.toggle('today', status === 'today');
    heroState.textContent =
        status === 'read' ? '已看過　·　點中央的卡片重看' :
        status === 'today' ? '今天可以打開　·　點中央的卡片開始' :
        lockedReason(i);

    // 快速滑過時不要每一張都載大圖，停 150ms 才換背景
    clearTimeout(backdropTimer);
    backdropTimer = setTimeout(() => {
        const m = mediaOf(i);
        setBackdrop(status !== 'locked' ? m.cover : '');
    }, 150);
}

function setBackdrop(src) {
    if (src === backdropSrc) return;
    backdropSrc = src;
    const front = backdrops[backdropFront];
    const back = backdrops[1 - backdropFront];
    if (!src) {
        front.classList.remove('visible');
        back.classList.remove('visible');
        return;
    }
    back.style.backgroundImage = `url("${src}")`;
    back.classList.add('visible');
    front.classList.remove('visible');
    backdropFront = 1 - backdropFront;
}

// ==========================================
//  打開某一集（轉場、當集卡片在 episode.js）
// ==========================================
function openEpisode(i) {
    const status = statusOf(i);
    if (status === 'locked') {
        const daysPassed = getDaysPassed();
        if (i > daysPassed) {
            const wait = i - daysPassed;
            showToast(wait === 1 ? '⏳ 還沒到這一天，明天再來吧' : `⏳ 還要再等 ${wait} 天`);
        } else {
            showToast(`先打開 ${episodes[unlockedIndex].ep}（${fmtDate(dateOf(unlockedIndex))}）吧`);
        }
        return;
    }
    EpisodeView.open(i, (closed, justFinished) => {
        renderCards();
        if (justFinished) showFinale();
        else cards[closed].focus({ preventScroll: true });
    }, '點一下回到選集');
}

// ==========================================
//  提示訊息與完結頁
// ==========================================
let toastTimer = null;
function showToast(message, duration = 2600) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), duration);
}

const finale = document.getElementById('finale');
const finaleClose = document.getElementById('finale-close');

function showFinale() {
    document.getElementById('finale-range').textContent =
        `${fmtDate(startDate)} — ${fmtDate(dateOf(episodes.length - 1))}`;
    document.getElementById('finale-hint').textContent = episodes[episodes.length - 1].nextHint;
    finale.hidden = false;
    finaleClose.focus();
}

function hideFinale() {
    finale.hidden = true;
    cards[episodes.length - 1].focus({ preventScroll: true });
}

finaleClose.addEventListener('click', hideFinale);
finale.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideFinale();
    e.stopPropagation();
});

// ==========================================
//  開發者模式：連點左上角「難哄」5 次
// ==========================================
const brand = document.getElementById('brand');
const debugPanel = document.getElementById('debug-panel');
const debugInput = document.getElementById('debug-date-input');
let devClickCount = 0;
let devClickTimer = null;

debugInput.value = formatLocalDate(startDate);

brand.addEventListener('click', () => {
    devClickCount++;
    clearTimeout(devClickTimer);
    devClickTimer = setTimeout(() => { devClickCount = 0; }, 1000);
    if (devClickCount >= 5) {
        devClickCount = 0;
        toggleDevMode();
    }
});

function toggleDevMode() {
    isDevMode = !isDevMode;
    showToast(isDevMode ? '🔧 開發者模式已開啟' : '🔒 開發者模式已關閉');
    brand.classList.toggle('dev', isDevMode);
    debugPanel.classList.toggle('active', isDevMode);
    renderCards();
}

document.getElementById('debug-apply').addEventListener('click', () => {
    const value = debugInput.value;
    if (!value) return;
    startDate = parseLocalDate(value);
    localStorage.setItem('loveCalendarStartDate', value);
    showToast(`起始日已更新為 ${value}，選集已重新排列`);
    renderCards();
});

// ==========================================
//  水波紋特效（和日曆頁相同）
// ==========================================
// 用 mousedown：手機上手指滑動選集列不會觸發，只有點擊才有水波。
// 刻意截斷：CSS 動畫長 8 秒，只取前 2.5 秒就移除，也避免模糊圖層堆積。
const RIPPLE_LIFETIME_MS = 2500;
document.addEventListener('mousedown', (e) => {
    // 看轉場、當集內容、彩蛋圖時不產生水波
    if (EpisodeView.isOpen()) return;
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), RIPPLE_LIFETIME_MS);
});

// ==========================================
//  啟動
// ==========================================
function startIndex() {
    // 今天能打開的那一集；今天已經看完就停在最近看過的那一集
    const i = unlockedIndex <= getDaysPassed() ? unlockedIndex : unlockedIndex - 1;
    return Math.min(Math.max(i, 0), episodes.length - 1);
}

buildRail();
measure();
const first = startIndex();
goTo(first, false);
updateFrame();
EpisodeView.preload(first);
wakeRail();

// 字型和圖片載完後版面可能還會變，瀏覽器會把捲動位置重設；使用者還沒動過就再對一次
let userMoved = false;
['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach(type =>
    rail.addEventListener(type, () => { userMoved = true; }, { passive: true, once: true }));
window.addEventListener('load', () => {
    if (userMoved) return;
    measure();
    goTo(first, false);
    requestFrame();
});

// 跨過午夜、分頁切回來時重新判斷解鎖狀態（看卡片時不打斷）
function refreshIfIdle() {
    if (EpisodeView.isOpen()) return;
    renderCards();
}

function scheduleMidnightRefresh() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    setTimeout(() => {
        refreshIfIdle();
        scheduleMidnightRefresh();
    }, nextMidnight - now + 1000);
}
scheduleMidnightRefresh();

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshIfIdle();
});
