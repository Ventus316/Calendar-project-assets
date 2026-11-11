// ==========================================
//  當集內容：轉場 → 當集卡片 → 彩蛋圖
// ==========================================
// 日曆頁 index.html 和選集頁 story.html 共用，兩頁打開某一集的流程、畫面完全一樣。
// 樣式在 assets/css/episode.css；要先載入 data.js、progress.js。
//
// 素材只看當集自己的欄位，不用 data.js 的兜底影片（那支是第一集的）：
//   video1         → 打開時的轉場影片；沒有就用 cover 圖片慢慢推近
//   video2         → 第一次點擊後的轉場影片；沒有就直接顯示語錄
//   cover          → 卡片封面、轉場圖、當集卡片的淡背景
//   easterEggImg/2 → 彩蛋縮圖；有 video3/4 就播影片，沒有就全螢幕看圖
//
// 三階段：1 日期＋標題 → 2 語錄＋彩蛋 → 3 See you tomorrow＋明日預告 → 關閉

const has = (v) => typeof v === 'string' && v.trim() !== '';
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${pad(d.getMonth() + 1)} / ${pad(d.getDate())}`;

function dateOf(i) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
}

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

const EpisodeView = (() => {
    const IMAGE_INTRO_MS = 3200;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isActivateKey = (e) => e.key === 'Enter' || e.key === ' ';

    // ---------- 畫面 ----------
    document.body.insertAdjacentHTML('beforeend', `
        <div id="intro" class="intro" aria-hidden="true">
            <video id="intro-video" playsinline></video>
            <img id="intro-image" alt="">
            <button id="intro-skip" type="button">SKIP ⏭</button>
        </div>
        <div id="detail" class="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" hidden>
            <div class="detail-card" id="detail-card" tabindex="-1">
                <div class="detail-bg" id="detail-bg" aria-hidden="true"></div>
                <p class="detail-date" id="detail-date"></p>
                <h2 class="detail-title step" id="detail-title"></h2>
                <p class="detail-quote step" id="detail-quote"></p>
                <div class="detail-bottom step" id="detail-bottom">
                    <div class="eggs" id="eggs"></div>
                    <div class="hint">
                        <p class="hint-left">See you tomorrow</p>
                        <p class="hint-right" id="detail-hint"></p>
                    </div>
                </div>
                <p class="detail-next" id="detail-next">點一下繼續</p>
            </div>
        </div>
        <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="彩蛋圖片" tabindex="-1" hidden>
            <img id="lightbox-img" alt="">
        </div>`);

    const $ = (id) => document.getElementById(id);
    const intro = $('intro');
    const introVideo = $('intro-video');
    const introImage = $('intro-image');
    const introSkip = $('intro-skip');
    const detail = $('detail');
    const detailCard = $('detail-card');
    const detailBg = $('detail-bg');
    const detailDate = $('detail-date');
    const detailTitle = $('detail-title');
    const detailQuote = $('detail-quote');
    const detailBottom = $('detail-bottom');
    const detailHint = $('detail-hint');
    const detailNext = $('detail-next');
    const eggsBox = $('eggs');
    const lightbox = $('lightbox');
    const lightboxImg = $('lightbox-img');

    // ---------- 轉場：影片或圖片 ----------
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
            // 等圖片解碼好再開始推近；萬一解碼一直沒回應（例如分頁在背景），1.5 秒後照樣開始，不會卡在黑畫面
            const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
            Promise.race([introImage.decode(), timeout]).then(start, start);
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

    // ---------- 當集內容 ----------
    // 長句換行時優先斷在標點後面（「世界上最遙遠的距離，／是心與心的距離」），不把一個詞拆到兩行
    function setPhrases(el, text) {
        el.textContent = '';
        text.split(/(?<=[，、。！？；：,!?…]|\.\.\.)/).forEach(part => {
            const span = document.createElement('span');
            span.className = 'phrase';
            span.textContent = part;
            el.appendChild(span);
        });
    }

    let viewing = -1;
    let detailStep = 0;
    let onClose = null;
    let closeLabel = '點一下關閉';

    // closeCallback(看完的集數, 是否剛看完最後一集)；backLabel：最後一步的提示，例如「點一下回到日曆」
    function open(i, closeCallback, backLabel) {
        viewing = i;
        onClose = closeCallback;
        closeLabel = backLabel || '點一下關閉';
        const ep = episodes[i];
        const m = mediaOf(i);

        detailDate.textContent = fmtDate(dateOf(i));
        setPhrases(detailTitle, ep.title);
        if (/[<&]/.test(ep.quote)) detailQuote.innerHTML = ep.quote;   // 語錄自己寫了 HTML（例如 <br>）就照用
        else setPhrases(detailQuote, ep.quote);
        setPhrases(detailHint, ep.nextHint);
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

        document.body.classList.add('episode-open');
        setStep(0);
        playIntro(m.intro, () => {
            detail.hidden = false;
            detailCard.scrollTop = 0;
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
        detailNext.textContent = n >= 3 ? closeLabel : '點一下繼續';
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
            close();
        }
    }

    detail.addEventListener('click', (e) => {
        if (e.target.closest('.egg')) return;
        advance();
    });

    function close() {
        detail.hidden = true;
        setStep(0);
        document.body.classList.remove('episode-open');
        let justFinished = false;
        if (viewing === unlockedIndex) {
            unlockedIndex++;
            localStorage.setItem('loveCalendarProgress', unlockedIndex);
            justFinished = unlockedIndex === episodes.length;
        }
        const closed = viewing;
        viewing = -1;
        const callback = onClose;
        onClose = null;
        if (callback) callback(closed, justFinished);
    }

    // ---------- 彩蛋圖全螢幕 ----------
    let lightboxReturn = null;

    function openLightbox(src, from) {
        lightboxImg.src = src;
        lightbox.hidden = false;
        lightboxReturn = from;
        lightbox.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        if (lightboxReturn) lightboxReturn.focus();
    }

    lightbox.addEventListener('click', closeLightbox);

    // ---------- 鍵盤 ----------
    // 轉場中 Esc = SKIP；卡片上 Enter / 空白鍵 / → = 點一下；彩蛋圖上 Esc / Enter = 關閉
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

    // ---------- 預載：只預載一集的開場轉場 ----------
    function preload(i) {
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

    // 轉場、當集卡片或彩蛋圖正在畫面上（水波紋、午夜重繪用來判斷要不要讓路）
    const isOpen = () => intro.classList.contains('active') || !detail.hidden || !lightbox.hidden;

    return { open, preload, isOpen };
})();
