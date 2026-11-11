// ==========================================
//  資料庫：包含 32 集的所有文案、影片路徑與圖片路徑
// ==========================================
// cover：當集封面（選集頁的卡片封面、轉場圖、當集卡片的淡背景），命名 epNN-cover.webp。
// 日曆頁和選集頁都只用當集自己的欄位（episode.js）：有影片播影片，沒有就用 cover / 彩蛋圖，
// 欄位留空就略過，不套用其他集的素材。
const episodes = [
    { 
        ep: "EP 01", 
        title: "再見，桑延", 
        quote: "再見，溫以凡", 
        nextHint: "那個名字，我在心裡默唸了無數遍", 
        cover: "./assets/images/ep01-cover.webp",
        video1: "./assets/videos/transition-past.mp4", 
        video2: "./assets/videos/transition-future.mp4", 
        video3: "./assets/videos/ep01-egg-1.mp4", 
        video4: "./assets/videos/ep01-egg-2.mp4", 
        easterEggImg: "./assets/images/ep01-egg-1.webp", 
        easterEggImg2: "./assets/images/ep01-egg-2.webp"
    },
    { 
        ep: "EP 02", 
        title: "你的名字", 
        quote: "原來，你還記得我", 
        nextHint: "誰是你心裡那個無法替代的人？", 
        cover: "./assets/images/ep02-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep02-egg-1.webp", easterEggImg2: "./assets/images/ep02-egg-2.webp" 
    },
    { 
        ep: "EP 03", 
        title: "每個人都需要白月光", 
        quote: "你就是我的白月光", 
        nextHint: "別怕流言蜚語，我會擋在你前面", 
        cover: "./assets/images/ep03-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep03-egg-1.webp", easterEggImg2: "./assets/images/ep03-egg-2.webp" 
    },
    { 
        ep: "EP 04", 
        title: "流言", 
        quote: "由我幫你吹散", 
        nextHint: "如果可以，我想離你再近一點", 
        cover: "./assets/images/ep04-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep04-egg-1.webp", easterEggImg2: "./assets/images/ep04-egg-2.webp" 
    },
    { 
        ep: "EP 05", 
        title: "靠近一點", 
        quote: "可以嗎？", 
        nextHint: "想給你一個，關於永遠的承諾", 
        cover: "./assets/images/ep05-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep05-egg-1.webp", easterEggImg2: "./assets/images/ep05-egg-2.webp" 
    },
    { 
        ep: "EP 06", 
        title: "我會一直陪著你", 
        quote: "在你看不到的地方", 
        nextHint: "那些藏在細節裡的喜歡，你發現了嗎？", 
        cover: "./assets/images/ep06-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep06-egg-1.webp", easterEggImg2: "./assets/images/ep06-egg-2.webp" 
    },
    { 
        ep: "EP 07", 
        title: "偷偷藏不住", 
        quote: "喜歡你是藏不住的秘密", 
        nextHint: "下雨了，我想做你唯一的傘", 
        cover: "./assets/images/ep07-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep07-egg-1.webp", easterEggImg2: "./assets/images/ep07-egg-2.webp" 
    },
    { 
        ep: "EP 08", 
        title: "雨中的太陽", 
        quote: "耀眼而溫暖", 
        nextHint: "嘴硬是因為...怕被你看穿我的心跳", 
        cover: "./assets/images/ep08-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep08-egg-1.webp", easterEggImg2: "./assets/images/ep08-egg-2.webp" 
    },
    { 
        ep: "EP 09", 
        title: "口是心非", 
        quote: "但我身體很誠實", 
        nextHint: "那些你忘記的事，我都幫你記著", 
        cover: "./assets/images/ep09-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep09-egg-1.webp", easterEggImg2: "./assets/images/ep09-egg-2.webp" 
    },
    { 
        ep: "EP 10", 
        title: "你忘了", 
        quote: "但我從沒忘記", 
        nextHint: "別怕，天塌下來有我頂著", 
        cover: "./assets/images/ep10-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep10-egg-1.webp", easterEggImg2: "./assets/images/ep10-egg-2.webp" 
    },
    { 
        ep: "EP 11", 
        title: "保護好自己", 
        quote: "因為我會心疼", 
        nextHint: "快樂其實很簡單，只要你在身邊", 
        cover: "./assets/images/ep11-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep11-egg-1.webp", easterEggImg2: "./assets/images/ep11-egg-2.webp" 
    },
    { 
        ep: "EP 12", 
        title: "如何才能快樂？", 
        quote: "有你，就是答案", 
        nextHint: "想和你約好，未來的路一起走", 
        cover: "./assets/images/ep12-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep12-egg-1.webp", easterEggImg2: "./assets/images/ep12-egg-2.webp" 
    },
    { 
        ep: "EP 13", 
        title: "約好了", 
        quote: "就不許反悔", 
        nextHint: "騙得過別人，騙不過自己", 
        cover: "./assets/images/ep13-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep13-egg-1.webp", easterEggImg2: "./assets/images/ep13-egg-2.webp" 
    },
    { 
        ep: "EP 14", 
        title: "放不下", 
        quote: "心裡始終有個位置留給你", 
        nextHint: "愛過的痕跡，時間抹不去", 
        cover: "./assets/images/ep14-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep14-egg-1.webp", easterEggImg2: "./assets/images/ep14-egg-2.webp" 
    },
    { 
        ep: "EP 15", 
        title: "痕跡", 
        quote: "是你來過的證明", 
        nextHint: "許個願吧，關於我和你", 
        cover: "./assets/images/ep15-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep15-egg-1.webp", easterEggImg2: "./assets/images/ep15-egg-2.webp" 
    },
    { 
        ep: "EP 16", 
        title: "生日快樂", 
        quote: "願你得償所願", 
        nextHint: "世界上最遙遠的距離，是心與心的距離", 
        cover: "./assets/images/ep16-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep16-egg-1.webp", easterEggImg2: "./assets/images/ep16-egg-2.webp" 
    },
    { 
        ep: "EP 17", 
        title: "最遙遠的距離", 
        quote: "其實我就在你身後", 
        nextHint: "別動，等我奔向你", 
        cover: "./assets/images/ep17-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep17-egg-1.webp", easterEggImg2: "./assets/images/ep17-egg-2.webp" 
    },
    { 
        ep: "EP 18", 
        title: "在飛奔向你的途中", 
        quote: "風都是甜的", 
        nextHint: "我認輸了，這輩子只栽在你手裡", 
        cover: "./assets/images/ep18-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep18-egg-1.webp", easterEggImg2: "./assets/images/ep18-egg-2.webp" 
    },
    { 
        ep: "EP 19", 
        title: "敗降", 
        quote: "敗降不是敗將，而是敗給你溫霜降", 
        nextHint: "想悄悄住進...你的心裡", 
        cover: "./assets/images/ep19-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep19-egg-1.webp", easterEggImg2: "./assets/images/ep19-egg-2.webp" 
    },
    { 
        ep: "EP 20", 
        title: "想悄悄住進你的靈魂", 
        quote: "接住你所有的脆弱", 
        nextHint: "只要有光的地方，就有希望", 
        cover: "./assets/images/ep20-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep20-egg-1.webp", easterEggImg2: "./assets/images/ep20-egg-2.webp" 
    },
    { 
        ep: "EP 21", 
        title: "希望在哪？", 
        quote: "在你眼裡", 
        nextHint: "機會只有一次，抓緊我", 
        cover: "./assets/images/ep21-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep21-egg-1.webp", easterEggImg2: "./assets/images/ep21-egg-2.webp" 
    },
    { 
        ep: "EP 22", 
        title: "機會是留給你的", 
        quote: "我隨時準備被你抓住", 
        nextHint: "無處可躲的時候，記得回頭看", 
        cover: "./assets/images/ep22-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep22-egg-1.webp", easterEggImg2: "./assets/images/ep22-egg-2.webp" 
    },
    { 
        ep: "EP 23", 
        title: "躲能躲哪兒？", 
        quote: "只能躲進我懷裡", 
        nextHint: "離開，有時候是為了更好的回來", 
        cover: "./assets/images/ep23-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep23-egg-1.webp", easterEggImg2: "./assets/images/ep23-egg-2.webp" 
    },
    { 
        ep: "EP 24", 
        title: "離開的理由", 
        quote: "是不想讓你受傷", 
        nextHint: "無論你在哪，我都能找到你", 
        cover: "./assets/images/ep24-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep24-egg-1.webp", easterEggImg2: "./assets/images/ep24-egg-2.webp" 
    },
    { 
        ep: "EP 25", 
        title: "不管你在哪", 
        quote: "我都會去接你回家", 
        nextHint: "這一次，我們拉鉤", 
        cover: "./assets/images/ep25-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep25-egg-1.webp", easterEggImg2: "./assets/images/ep25-egg-2.webp" 
    },
    { 
        ep: "EP 26", 
        title: "約定", 
        quote: "我不會再失約了", 
        nextHint: "不管是好是壞，我都全盤接受", 
        cover: "./assets/images/ep26-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep26-egg-1.webp", easterEggImg2: "./assets/images/ep26-egg-2.webp" 
    },
    { 
        ep: "EP 27", 
        title: "我接受", 
        quote: "你所有的樣子", 
        nextHint: "如果時光倒流，我還是會選擇你", 
        cover: "./assets/images/ep27-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep27-egg-1.webp", easterEggImg2: "./assets/images/ep27-egg-2.webp" 
    },
    { 
        ep: "EP 28", 
        title: "重生的機會", 
        quote: "只為再次遇見你", 
        nextHint: "愛，就是成為照亮彼此的光", 
        cover: "./assets/images/ep28-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep28-egg-1.webp", easterEggImg2: "./assets/images/ep28-egg-2.webp" 
    },
    { 
        ep: "EP 29", 
        title: "你是我的光", 
        quote: "我親手抓住了你的陰影", 
        nextHint: "讓我成為你可以依靠的肩膀", 
        cover: "./assets/images/ep29-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep29-egg-1.webp", easterEggImg2: "./assets/images/ep29-egg-2.webp" 
    },
    { 
        ep: "EP 30", 
        title: "依靠", 
        quote: "我是你永遠的後盾", 
        nextHint: "想和你，從今天走到永遠", 
        cover: "./assets/images/ep30-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep30-egg-1.webp", easterEggImg2: "./assets/images/ep30-egg-2.webp" 
    },
    { 
        ep: "EP 31", 
        title: "這輩子，總得說一次", 
        quote: "這麼多年，我還是只喜歡你", 
        nextHint: "我想給你，至死方休的熱烈", 
        cover: "./assets/images/ep31-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep31-egg-1.webp", easterEggImg2: "./assets/images/ep31-egg-2.webp" 
    },
    { 
        ep: "EP 32", 
        title: "至死方休", 
        quote: "我渴望有人至死都暴烈地愛我", 
        nextHint: "不只明天，還有未來的每一天", 
        cover: "./assets/images/ep32-cover.webp",
        video1: "", video2: "", video3: "", video4: "", 
        easterEggImg: "./assets/images/ep32-egg-1.webp", easterEggImg2: "./assets/images/ep32-egg-2.webp" 
    }
];
