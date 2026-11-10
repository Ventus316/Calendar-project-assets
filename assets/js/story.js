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
// 素材：當集有影片就播影片（目前只有第一集），沒有就用當集圖片。
//   cover          → 卡片封面、點開時的轉場圖
//   easterEggImg/2 → 彩蛋縮圖；有 video3/4 就播影片，沒有就全螢幕看圖

const rail = document.getElementById('rail');
const heroMeta = document.getElementById('hero-meta');
const heroTitle = document.getElementById('hero-title');
const heroState = document.getElementById('hero-state');
const progressBar = document.getElementById('rail-progress-bar');
const backdrops = [document.getElementById('backdrop-a'), document.getElementById('backdrop-b')];

const intro = document.getElementById('intro');
const introVideo = document.getElementById('intro-video');
const introImage = document.getElementById('intro-image');
const introSkip = document.getElementById('intro-skip');

const detail = document.getElementById('detail');
const detailCard = document.getElementById('detail-card');
const detailBg = document.getElementById('detail-bg');
const detailDate = document.getElementById('detail-date');
const detailTitle = document.getElementById('detail-title');
const detailQuote = document.getElementById('detail-quote');
const detailBottom = document.getElementById('detail-bottom');
const detailHint = document.getElementById('detail-hint');
const detailNext = document.getElementById('detail-next');
const eggsBox = document.getElementById('eggs');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMAGE_INTRO_MS = 3200;

// ==========================================
//  素材與狀態
// ==========================================
let isDevMode = false;

const has = (v) => typeof v === 'string' && v.trim() !== '';

// 只看當集自己的欄位，不用 data.js 的兜底影片（那支是第一集的）
function mediaOf(i) {
    const ep = episodes[i];
    const eggs = [];
    [[ep.easterEggImg, ep.video3], [ep.easterEggImg2, ep.video4]].forEach(([img, video]) => {
        if (has(img)) eggs.push({ img, video: has(video) ? video : '' });
    });
    let introMedia = null;
    if (has(ep.video1)) introMedia = { type: 'video', src: ep.video1 };
    else if (has(ep.cover)) introMedia = { type: 'image', src: ep.cover };
    return {
        cover: has(ep.cover) ? ep.cover : '',
        intro: introMedia,
        mid: has(ep.video2) ? { type: 'video', src: ep.video2 } : null,
        eggs
    };
}

function statusOf(i) {
    // 開發者模式：每一集都能打開（和日曆頁一樣，目前進度那集顯示為今天）
    if (isDevMode) return i === unlockedIndex ? 'today' : 'read';
    if (i < unlockedIndex) return 'read';
    if (i === unlockedIndex && i <= getDaysPassed()) return 'today';
    return 'locked';
}

function dateOf(i) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
}

const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${pad(d.getMonth() + 1)} / ${pad(d.getDate())}`;

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
//  轉場：影片或圖片
// ==========================================
let introDone = null;
let introTimers = [];

function playIntro(media, done) {
    if (!media) { done(); return; }
    introDone = done;
    introTimers.forEach(clearTimeout);
    introTimers = [];
    intro.classList.remove('is-video', 'is-image', 'show-skip');
    intro.setAttribute('aria-hidden', 'false');

    if (media.type === 'video') {
        const abs = new URL(media.src, location.href).href;
        if (introVideo.src === abs) introVideo.currentTime = 0;   // 已預載就沿用
        else introVideo.src = media.src;
        intro.classList.add('is-video', 'active');
        introVideo.onended = finishIntro;
        introVideo.play().catch(() => {});
        introTimers.push(setTimeout(() => intro.classList.add('show-skip'), 5000));
    } else {
        introImage.src = media.src;
        intro.style.setProperty('--intro-ms', `${IMAGE_INTRO_MS}ms`);
        const start = () => {
            // 重新觸發推近動畫
            intro.classList.remove('active');
            void introImage.offsetWidth;
            intro.classList.add('is-image', 'active');
            introTimers.push(setTimeout(() => intro.classList.add('show-skip'), 800));
            introTimers.push(setTimeout(finishIntro, reducedMotion ? 1200 : IMAGE_INTRO_MS));
        };
        introImage.decode().then(start, start);
    }
    introSkip.focus({ preventScroll: true });
}

function finishIntro() {
    if (!introDone) return;
    introTimers.forEach(clearTimeout);
    introTimers = [];
    introVideo.onended = null;
    introVideo.pause();
    intro.classList.remove('active', 'show-skip');
    intro.setAttribute('aria-hidden', 'true');
    const done = introDone;
    introDone = null;
    done();
}

introSkip.addEventListener('click', (e) => { e.stopPropagation(); finishIntro(); });
// 圖片轉場點畫面任何地方都能跳過；影片要等 SKIP 出現
intro.addEventListener('click', () => {
    if (intro.classList.contains('is-image') && intro.classList.contains('show-skip')) finishIntro();
});

// ==========================================
//  當集內容（和日曆頁同樣的三階段）
// ==========================================
// 1：日期＋標題 → 2：語錄＋彩蛋 → 3：See you tomorrow＋明日預告 → 關閉
let viewing = -1;
let detailStep = 0;

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

    viewing = i;
    const ep = episodes[i];
    const m = mediaOf(i);

    detailDate.textContent = fmtDate(dateOf(i));
    detailTitle.textContent = ep.title;
    detailQuote.innerHTML = ep.quote;
    detailHint.textContent = ep.nextHint;
    detailBg.style.backgroundImage = m.cover ? `url("${m.cover}")` : 'none';

    eggsBox.innerHTML = '';
    m.eggs.forEach((egg, n) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'egg';
        btn.setAttribute('aria-label', egg.video ? `播放彩蛋影片 ${n + 1}` : `查看彩蛋圖片 ${n + 1}`);
        btn.innerHTML = `<img src="${egg.img}" alt="">`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (egg.video) playIntro({ type: 'video', src: egg.video }, () => detailCard.focus({ preventScroll: true }));
            else openLightbox(egg.img, btn);
        });
        eggsBox.appendChild(btn);
    });

    setStep(0);
    playIntro(m.intro, () => {
        detail.hidden = false;
        setStep(1);
        detailCard.focus({ preventScroll: true });
    });
}

function setStep(n) {
    detailStep = n;
    const hasEggs = eggsBox.children.length > 0;
    detailTitle.classList.toggle('shown', n >= 1);
    detailQuote.classList.toggle('shown', n >= 2);
    detailBottom.classList.toggle('shown', n >= 2);
    detailBottom.classList.toggle('show-hint', n >= 3);
    detailNext.textContent = n >= 3 ? '點一下回到選集' : '點一下繼續';
    // 沒有彩蛋的集數，語錄和明日預告一起出現
    if (n === 2 && !hasEggs) setStep(3);
}

function advance() {
    if (detailStep === 1) {
        const mid = mediaOf(viewing).mid;
        if (mid) playIntro(mid, () => { setStep(2); detailCard.focus({ preventScroll: true }); });
        else setStep(2);
    } else if (detailStep === 2) {
        setStep(3);
    } else if (detailStep === 3) {
        closeEpisode();
    }
}

detail.addEventListener('click', (e) => {
    if (e.target.closest('.egg')) return;
    advance();
});

function closeEpisode() {
    detail.hidden = true;
    setStep(0);
    let justFinished = false;
    if (viewing === unlockedIndex) {
        unlockedIndex++;
        localStorage.setItem('loveCalendarProgress', unlockedIndex);
        justFinished = unlockedIndex === episodes.length;
    }
    const back = viewing;
    viewing = -1;
    renderCards();
    if (justFinished) showFinale();
    else cards[back].focus({ preventScroll: true });
}

// ==========================================
//  彩蛋圖全螢幕
// ==========================================
let lightboxReturn = null;

function openLightbox(src, from) {
    lightboxImg.src = src;
    lightbox.hidden = false;
    lightboxReturn = from;
    lightbox.tabIndex = -1;
    lightbox.focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    if (lightboxReturn) lightboxReturn.focus();
}

lightbox.addEventListener('click', closeLightbox);

// ==========================================
//  鍵盤（打開卡片之後）
// ==========================================
detailCard.tabIndex = -1;
const isActivateKey = (e) => e.key === 'Enter' || e.key === ' ';

document.addEventListener('keydown', (e) => {
    if (!lightbox.hidden) {
        if (e.key === 'Escape' || isActivateKey(e)) { e.preventDefault(); closeLightbox(); }
        return;
    }
    if (intro.classList.contains('active')) {
        if (e.key === 'Escape' && intro.classList.contains('show-skip')) finishIntro();
        else if (isActivateKey(e)) e.preventDefault();
        return;
    }
    if (detail.hidden) return;
    if (e.target.closest && e.target.closest('.egg')) return;
    if (isActivateKey(e) || e.key === 'ArrowRight') {
        e.preventDefault();
        advance();
    }
});

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
    if (intro.classList.contains('active') || !detail.hidden || !lightbox.hidden) return;
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), RIPPLE_LIFETIME_MS);
});

// ==========================================
//  預載：只預載起始那一集的轉場
// ==========================================
function preloadIntro(i) {
    const media = mediaOf(i).intro;
    if (!media) return;
    if (media.type === 'video') {
        introVideo.preload = 'auto';
        introVideo.src = media.src;
        introVideo.load();
    } else {
        const img = new Image();
        img.src = media.src;
    }
}

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
preloadIntro(first);
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
    if (intro.classList.contains('active') || !detail.hidden) return;
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
