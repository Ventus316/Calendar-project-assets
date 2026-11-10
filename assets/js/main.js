// ==========================================
//  初始化與變數設定
// ==========================================

// 進度、起始日與 getDaysPassed() 在 progress.js（日曆頁和選集頁共用）
let currentViewingIndex = -1; 
let lastViewedIndex = -1;

// 開發者模式
let isDevMode = false;
let devClickCount = 0;
let devClickTimer = null;

// DOM 元素選取
const calendar = document.getElementById('calendar-container');
const videoOverlay = document.getElementById('video-overlay');
const detailView = document.getElementById('detail-view');
const detailScaler = document.getElementById('detail-scaler'); 
const transitionVideo = document.getElementById('transition-video');
const skipBtn = document.getElementById('skip-btn');
const detailOverlay = document.getElementById('detail-overlay');
const producerInfo = document.querySelector('.producer-info'); 
const debugPanel = document.getElementById('debug-panel');
const debugInput = document.getElementById('debug-date-input');

// 卡片內容元素
const detailTitle = document.getElementById('display-title');
const detailQuote = document.getElementById('display-quote');
const detailHint = document.getElementById('display-hint');

// 互動區選取
const interactionArea = document.getElementById('interaction-area');
const easterEggBtn1 = document.getElementById('easter-egg-btn');
const easterEggBtn2 = document.getElementById('easter-egg-btn-2');
const easterEggImg1 = document.getElementById('easter-egg-img');
const easterEggImg2 = document.getElementById('easter-egg-img-2');

// 狀態管理
// 0: 初始狀態
// 1: 階段一 (播完 Video 1，顯示 Title)
// 2: 階段二 (播完 Video 2，完整顯示全內容 - 圖片狀態)
// 3: 階段三 (點擊背景後 - 文字狀態)
let currentStep = 0; 

// 計時器
let playTimer = null;
let skipDisplayTimer = null;
let skipOpacityTimer = null;

// 月份名稱
const MONTH_NAMES = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

if(debugInput) debugInput.value = formatLocalDate(startDate);


// ==========================================
//  輔助函式
// ==========================================
function safeGetVideoPath(epIndex, videoNum) {
    if (typeof getVideoPath === 'function') return getVideoPath(epIndex, videoNum);
    return "./assets/videos/transition-past.mp4";
}

function safeGetEasterEggPath(epIndex, imgNum) {
    if (typeof getEasterEggPath === 'function') return getEasterEggPath(epIndex, imgNum);
    return "./assets/images/ep01-egg-1.webp";
}

// ==========================================
//  開發者模式
// ==========================================
if (producerInfo) {
    producerInfo.style.cursor = "pointer"; 
    producerInfo.addEventListener('click', function() {
        devClickCount++;
        if (devClickTimer) clearTimeout(devClickTimer);
        devClickTimer = setTimeout(() => { devClickCount = 0; }, 1000);

        if (devClickCount >= 5) {
            toggleDevMode();
            devClickCount = 0;
        }
    });
}

// ==========================================
//  頁內提示訊息 (取代 alert)
// ==========================================
let toastTimer = null;
function showToast(message, duration = 2600) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), duration);
}

function toggleDevMode() {
    isDevMode = !isDevMode;
    if (isDevMode) {
        showToast("🔧 開發者模式已開啟");
        producerInfo.style.color = "#ff4444"; 
        if(debugPanel) debugPanel.classList.add('active');
    } else {
        showToast("🔒 開發者模式已關閉");
        producerInfo.style.color = ""; 
        if(debugPanel) debugPanel.classList.remove('active');
    }
    renderCalendar(); 
}

function setDebugDate() {
    const newVal = debugInput.value;
    if(!newVal) return;
    startDate = parseLocalDate(newVal);
    localStorage.setItem('loveCalendarStartDate', newVal);
    showToast(`起始日已更新為 ${newVal}，日曆已重新排列`);
    renderCalendar(); 
}


// ==========================================
//  UI 縮放與渲染
// ==========================================
function scaleDetailView() {
    const containerWidth = detailView.offsetWidth;
    const containerHeight = detailView.offsetHeight;
    const contentWidth = 1200; 
    const contentHeight = 600; 
    let scale = Math.min(containerWidth / contentWidth, containerHeight / contentHeight);
    scale = Math.min(scale, 1);
    detailScaler.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', scaleDetailView);

function setMonthTitle(dateObj) {
    const monthIndex = dateObj.getMonth();
    const fullMonth = MONTH_NAMES[monthIndex];
    const part1 = fullMonth.substring(0, 3);
    const part2 = fullMonth.substring(3);
    const monthContainer = document.querySelector('.month-text');
    if(monthContainer) monthContainer.innerHTML = `<p class="month_red">${part1}</p><p>${part2}</p>`;
}

function renderCalendar() {
    const startDayOfWeek = startDate.getDay(); 
    const totalCellsNeeded = startDayOfWeek + 32;
    if (totalCellsNeeded > 35) calendar.classList.add('rows-6');
    else calendar.classList.remove('rows-6');

    // 【修正】永遠使用起始日期的月份和年份
    setMonthTitle(startDate);
    
    const yearEl = document.querySelector('.year-text');
    if(yearEl) yearEl.innerText = startDate.getFullYear();

    const allDayCells = Array.from(document.querySelectorAll('.container .days'));
    allDayCells.forEach(el => {
        el.style.display = 'none'; 
        el.className = 'days';     
        el.innerText = '';         
        el.removeAttribute('data-idx');
        ['role', 'tabindex', 'aria-label', 'aria-disabled'].forEach(a => el.removeAttribute(a));
        el.onclick = null;
    });

    let cellCursor = 0;
    for (let i = 0; i < startDayOfWeek; i++) {
        if (allDayCells[cellCursor]) {
            allDayCells[cellCursor].style.display = 'flex';
            allDayCells[cellCursor].classList.add('ndays');
            cellCursor++;
        }
    }

    for (let i = 0; i < 32; i++) {
        if (allDayCells[cellCursor]) {
            const cell = allDayCells[cellCursor];
            cell.style.display = 'flex';
            cell.classList.add('date-cell');
            cell.setAttribute('data-idx', i);

            let thisDate = new Date(startDate);
            thisDate.setDate(startDate.getDate() + i);
            let d = thisDate.getDate();
            let dateText = d.toString().padStart(2, '0');
            
            if (d === 1) {
                dateText = `${(thisDate.getMonth() + 1)} / 01`; 
                cell.style.color = "#ffcc80"; 
                cell.style.fontSize = "0.9em"; 
            } else {
                cell.style.fontSize = ""; cell.style.color = "";
            }
            cell.innerText = dateText;

            // 真實日期判斷
            const daysPassed = getDaysPassed();

            if (isDevMode) {
                if (i === unlockedIndex) cell.classList.add('active-day');
                else cell.classList.add('read');
            } else {
                if (i < unlockedIndex) {
                    // 以前看過的 -> 金色 (Read)
                    cell.classList.add('read');
                } else if (i === unlockedIndex && i <= daysPassed) {
                    // 進度到了 且 時間也到了 -> 閃爍 (Active)
                    cell.classList.add('active-day');
                } else {
                    // 進度沒到 或 時間還沒到 -> 鎖頭 (Locked)
                    cell.classList.add('locked');
                }
            }

            // 鍵盤與螢幕閱讀器：日期格可以用 Tab 移動、Enter / 空白鍵打開
            let stateText = '尚未解鎖';
            if (cell.classList.contains('read')) stateText = '已看過';
            else if (cell.classList.contains('active-day')) stateText = '今天可以打開';
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-label', `${thisDate.getMonth() + 1} 月 ${d} 日，第 ${i + 1} 天，${stateText}`);
            if (cell.classList.contains('locked')) cell.setAttribute('aria-disabled', 'true');

            cell.onclick = () => handleClick(i);
            cellCursor++;
        }
    }
}


// ==========================================
//  核心互動邏輯
// ==========================================

function handleClick(index) {
    const daysPassed = getDaysPassed();
    
    // 防止點擊未來日期
    if (!isDevMode && (index > unlockedIndex || index > daysPassed)) {
        if (index > daysPassed) {
            // 日子還沒到
            const wait = index - daysPassed;
            showToast(wait === 1 ? "⏳ 還沒到這一天，明天再來吧" : `⏳ 還要再等 ${wait} 天`);
        } else {
            // 日子到了，但前面還有沒看的
            const next = new Date(startDate);
            next.setDate(startDate.getDate() + unlockedIndex);
            showToast(`先打開 ${next.getMonth() + 1} / ${next.getDate()} 那一格吧`);
        }
        return;
    }

    currentViewingIndex = index;
    currentStep = 0; 
    
    const data = episodes[index];
    let thisDate = new Date(startDate);
    thisDate.setDate(startDate.getDate() + index);
    document.getElementById('display-date').innerText = `${(thisDate.getMonth() + 1).toString().padStart(2, '0')} / ${thisDate.getDate().toString().padStart(2, '0')}`;
    
    detailTitle.innerText = data.title;   
    detailQuote.innerHTML = data.quote;   
    detailHint.innerText = data.nextHint; 

    easterEggImg1.src = safeGetEasterEggPath(index, 1); 
    easterEggImg2.src = safeGetEasterEggPath(index, 2); 
    
    // 重置互動區：確保打開時是圖片
    if(interactionArea) {
        interactionArea.classList.remove('show-hint');
        interactionArea.classList.add('hidden-initially');
        interactionArea.classList.remove('reveal-content');
    }

    [detailTitle, detailQuote].forEach(el => {
        el.classList.add('hidden-initially');
        el.classList.remove('reveal-content');
    });

    playTransition(safeGetVideoPath(index, 1));
}

function playTransition(videoUrl) {
    const resetBtn = document.querySelector('.reset-btn');
    if(resetBtn) resetBtn.style.display = 'none';

    calendar.classList.add('minimized');
    videoOverlay.classList.add('active');
    detailView.classList.remove('active'); 
    if(detailOverlay) detailOverlay.classList.remove('active');
    
    [playTimer, skipDisplayTimer, skipOpacityTimer].forEach(t => clearTimeout(t));
    skipBtn.classList.remove('visible', 'low-opacity');

    // 若這支影片已經預載過，就不重設 src，直接沿用已緩衝的資料從頭播
    const absoluteUrl = new URL(videoUrl, location.href).href;
    if (transitionVideo.src === absoluteUrl) {
        transitionVideo.currentTime = 0;
    } else {
        transitionVideo.src = videoUrl;
    }
    transitionVideo.style.display = 'block';
    transitionVideo.play().catch(e => console.log("播放攔截", e));

    skipDisplayTimer = setTimeout(() => {
        skipBtn.classList.add('visible');
        skipOpacityTimer = setTimeout(() => {
            skipBtn.classList.add('low-opacity');
        }, 5000); 
    }, 5000);

    transitionVideo.onended = finishTransition;
}

function skipVideo() { finishTransition(); }

function finishTransition() {
    [playTimer, skipDisplayTimer, skipOpacityTimer].forEach(t => clearTimeout(t));
    transitionVideo.onended = null;
    transitionVideo.pause();
    transitionVideo.style.display = 'none';

    videoOverlay.classList.remove('active');
    const resetBtn = document.querySelector('.reset-btn');
    if(resetBtn) resetBtn.style.display = 'block';

    scaleDetailView();
    detailView.classList.add('active');
    if(detailOverlay) detailOverlay.classList.add('active');

    // 狀態機推進
    if (currentStep === 0) {
        currentStep = 1;
        detailTitle.classList.add('reveal-content');
    } else {
        currentStep = 2;
        [detailTitle, detailQuote].forEach(el => el.classList.add('reveal-content'));
        
        if(interactionArea) {
            interactionArea.classList.add('reveal-content');
        }
    }
}


// ==========================================
//  事件監聽
// ==========================================

// 1. 詳細頁遮罩點擊 (控制退出流程)
if (detailOverlay) {
    detailOverlay.addEventListener('click', function() {
        if (currentStep === 1) {
            playTransition(safeGetVideoPath(currentViewingIndex, 2));
        }
        else if (currentStep === 2) {
            triggerHintEffect();
            currentStep = 3; 
        }
        else if (currentStep === 3) {
            closeDetail();
        }
    });
}

// 2. 影片遮罩點擊 (修正：阻止冒泡但不執行 skipVideo)
if (videoOverlay) {
    videoOverlay.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

if (skipBtn) {
    skipBtn.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// 3. 觸發特效函式
function triggerHintEffect() {
    if(interactionArea) {
        interactionArea.classList.add('show-hint');
    }
}

// 4. 彩蛋按鈕監聽
if(easterEggBtn1) {
    easterEggBtn1.addEventListener('click', (e) => {
        e.stopPropagation();
        playTransition(safeGetVideoPath(currentViewingIndex, 3));
    });
}

if(easterEggBtn2) {
    easterEggBtn2.addEventListener('click', (e) => {
        e.stopPropagation();
        playTransition(safeGetVideoPath(currentViewingIndex, 4));
    });
}

// 5. 鍵盤操作
const isActivateKey = (e) => e.key === 'Enter' || e.key === ' ';

// 日期格：Enter / 空白鍵等於點擊
calendar.addEventListener('keydown', (e) => {
    if (isActivateKey(e) && e.target.classList.contains('date-cell')) {
        e.preventDefault();
        e.target.click();
    }
});

// 彩蛋圖：可以用 Tab 選到，Enter / 空白鍵播放
[easterEggBtn1, easterEggBtn2].forEach((btn, n) => {
    if (!btn) return;
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-label', `播放彩蛋影片 ${n + 1}`);
    btn.addEventListener('keydown', (e) => {
        if (isActivateKey(e)) {
            e.preventDefault();
            e.stopPropagation();
            btn.click();
        }
    });
});

// 卡片打開時：Enter / 空白鍵 / → 等於點背景（下一步）；影片播放中按 Esc 等於 SKIP
document.addEventListener('keydown', (e) => {
    if (videoOverlay.classList.contains('active')) {
        if (e.key === 'Escape' && skipBtn.classList.contains('visible')) skipVideo();
        return;
    }
    if (!detailView.classList.contains('active')) return;
    if (e.target.closest && e.target.closest('.egg-item, button, input')) return;
    if (isActivateKey(e) || e.key === 'ArrowRight') {
        e.preventDefault();
        detailOverlay.click();
        // 關閉卡片後把焦點放回剛剛看的那一格
        if (!detailView.classList.contains('active')) {
            const cell = calendar.querySelector(`.date-cell[data-idx="${currentViewingIndex}"]`);
            if (cell) cell.focus();
        }
    }
});

function closeDetail() {
    detailView.classList.remove('active');
    if(detailOverlay) detailOverlay.classList.remove('active');
    calendar.classList.remove('minimized');
    
    // 關閉時重置特效，確保下次打開是圖片
    if(interactionArea) {
        interactionArea.classList.remove('reveal-content');
        interactionArea.classList.remove('show-hint');
        interactionArea.classList.add('hidden-initially');
    }

    let justFinished = false;
    if (currentViewingIndex === unlockedIndex) {
        unlockedIndex++;
        localStorage.setItem('loveCalendarProgress', unlockedIndex);
        justFinished = (unlockedIndex === episodes.length);
    }
    renderCalendar();
    if (justFinished) showFinale();
}

// ==========================================
//  完結頁：第 32 天第一次看完時顯示
// ==========================================
const finale = document.getElementById('finale');
const finaleClose = document.getElementById('finale-close');

function showFinale() {
    if (!finale) return;
    const last = new Date(startDate);
    last.setDate(startDate.getDate() + episodes.length - 1);
    const fmt = (dt) => `${String(dt.getMonth() + 1).padStart(2, '0')} / ${String(dt.getDate()).padStart(2, '0')}`;
    document.getElementById('finale-range').textContent = `${fmt(startDate)} — ${fmt(last)}`;
    document.getElementById('finale-hint').textContent = episodes[episodes.length - 1].nextHint;
    finale.hidden = false;
    finaleClose.focus();
}

function hideFinale() {
    finale.hidden = true;
    const lastCell = calendar.querySelector(`.date-cell[data-idx="${episodes.length - 1}"]`);
    if (lastCell) lastCell.focus();
}

if (finale) {
    finaleClose.addEventListener('click', hideFinale);
    finale.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideFinale();
        e.stopPropagation();
    });
}

// 【修正】重置功能 - 提供兩種選擇
function resetProgress() {
    // 建立自定義對話框
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#2b2222';
    modalContent.style.padding = '30px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.border = '2px solid #d4af37';
    modalContent.style.maxWidth = '400px';
    modalContent.style.textAlign = 'center';
    
    modalContent.innerHTML = `
        <h3 style="color: #d4af37; margin-bottom: 20px;">重置選項</h3>
        <p style="color: #f0f0f0; margin-bottom: 25px;">請選擇重置方式：</p>
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <button id="resetProgressOnly" style="
                background: rgba(212, 175, 55, 0.2);
                color: #d4af37;
                border: 1px solid #d4af37;
                padding: 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
            ">只重置進度<br><small>保留起始日期，僅重設解鎖狀態</small></button>
            
            <button id="resetFull" style="
                background: rgba(255, 100, 100, 0.2);
                color: #ff6b6b;
                border: 1px solid #ff6b6b;
                padding: 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
            ">完全重置<br><small>清除所有資料，重新設定起始日期為今天</small></button>
            
            <button id="cancelReset" style="
                background: rgba(100, 100, 100, 0.2);
                color: #aaa;
                border: 1px solid #666;
                padding: 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
                margin-top: 10px;
            ">取消</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 按鈕事件監聽
    document.getElementById('resetProgressOnly').addEventListener('click', function() {
        // 只重置進度
        localStorage.removeItem('loveCalendarProgress');
        document.body.removeChild(modal);
        alert('✅ 進度已重置！起始日期保持不變。');
        location.reload();
    });
    
    document.getElementById('resetFull').addEventListener('click', function() {
        // 完全重置（清除所有資料）
        localStorage.clear();
        document.body.removeChild(modal);
        alert('✅ 已完全重置！起始日期將設定為今天。');
        location.reload();
    });
    
    document.getElementById('cancelReset').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // 點擊背景也可以取消
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// ==========================================
//  影片預載：只預載一支
// ==========================================
// 今天能點的那一格（最新解鎖）優先；今天已經看完，就預載最近看過的那一集。
// 只載第一段影片，因為點開日期一定先播 video1。
function preloadLatestVideo() {
    const daysPassed = getDaysPassed();
    let target = (unlockedIndex <= daysPassed) ? unlockedIndex : unlockedIndex - 1;
    target = Math.min(target, episodes.length - 1);
    if (target < 0) return;

    transitionVideo.preload = 'auto';
    transitionVideo.src = safeGetVideoPath(target, 1);
    transitionVideo.load();
}

renderCalendar();
scaleDetailView();
preloadLatestVideo();

// ==========================================
//  跨過午夜時自動解鎖新的一天
// ==========================================
// 只在日曆畫面時重繪，避免打斷正在看的影片或卡片
function refreshIfIdle() {
    if (videoOverlay.classList.contains('active') || detailView.classList.contains('active')) return;
    renderCalendar();
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

// 分頁切回來時也重繪一次（電腦睡眠時計時器可能不準）
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshIfIdle();
});

// ==========================================
//  水波紋特效 (純淨穩定版 - 不需伺服器)
// ==========================================
const RIPPLE_LIFETIME_MS = 2500;
document.addEventListener('mousedown', function(e) {
    const videoOverlay = document.getElementById('video-overlay');
    const detailView = document.getElementById('detail-view');
    
    // 如果正在看影片或卡片，就不產生水波
    if (videoOverlay && videoOverlay.classList.contains('active')) return;
    if (detailView && detailView.classList.contains('active')) return;

    // 建立水波紋元素
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    
    document.body.appendChild(ripple);

    // 刻意截斷：CSS 動畫長 8 秒，只取前 2.5 秒（擴散最快、最清楚的一段）就移除，
    // 同時也避免大量 backdrop-filter 元素殘留造成卡頓。
    // 要調整呈現時，請同時看 style.css 的 .click-ripple animation 長度。
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, RIPPLE_LIFETIME_MS);
});