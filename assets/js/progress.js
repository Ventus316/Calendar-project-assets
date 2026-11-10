// ==========================================
//  進度與起始日（index.html 日曆頁和 story.html 選集頁共用）
// ==========================================
// 兩頁讀寫同一組 localStorage，所以在哪一頁看過都算進度。

// 讀取進度與設定
let unlockedIndex = parseInt(localStorage.getItem('loveCalendarProgress')) || 0;

// ==========================================
//  日期設定 (已修正：加入鎖定邏輯)
// ==========================================
let savedStartDate = localStorage.getItem('loveCalendarStartDate');
let startDate;

// "YYYY-MM-DD" 要用當地時間建立；直接 new Date("2025-12-01") 會被當成 UTC，
// 在 UTC 以西的時區會變成前一天
function parseLocalDate(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return new Date(value);
}

function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

if (savedStartDate) {
    // 1. 如果記憶體有存檔 (代表不是第一次來)，讀取舊的日期
    startDate = parseLocalDate(savedStartDate);
} else {
    // 2. 如果記憶體沒東西 (代表是第一次打開！)，以「今天」作為開始
    startDate = new Date();
    // 【關鍵修改】立刻把它存入 localStorage！鎖定這一天！
    localStorage.setItem('loveCalendarStartDate', formatLocalDate(startDate));
}

// 【新增】計算目前過了幾天
function getDaysPassed() {
    const now = new Date();
    const start = new Date(startDate);
    
    // 歸零時間部分，只比較日期
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = now - start;
    // 用 round 而不是 floor：遇到日光節約時間，一天可能只有 23 小時
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // 確保不會是負數 (例如使用者把電腦時間調到過去)
    return Math.max(0, diffDays); 
}
