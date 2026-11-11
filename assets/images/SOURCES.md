# 圖片來源

選集頁的劇照都來自網路公開的劇照，著作權屬於原劇製作方，本專案為非商業同人作品（見 README）。
每張圖都記下出處。「已確認集數」的圖是用下方方法確認的；「集數未確定」的圖只是先把每集需要圖片的位置放滿，不代表出自該集。

## 確認集數的方法

1. 電視猫分集頁（`tvmao.com/drama/YWdlYW8o/episode/…`）每集附兩張小劇照（600×297），但每 3～4 集共用同一組，只有第 2、3、5、6、9 集的圖是該集獨有。
2. 優酷官方 YouTube 各集預告（片名標有集數）。
3. 把上面兩者的畫面，用特徵點比對（SIFT＋RANSAC）對到豆瓣劇照，對得上的豆瓣大圖才算確定集數。

## 已確認集數

| 檔案 | 集數 | 欄位 | 原圖 | 尺寸 | 確認方式 | 修改 |
| --- | --- | --- | --- | --- | --- | --- |
| `ep07-cover.webp` | 7 | cover | [豆瓣 2918443337](https://movie.douban.com/photos/photo/2918443337/) | 1920×1080 | 出現在第 7 集單集預告 [HGSAg-eidMg](https://www.youtube.com/watch?v=HGSAg-eidMg) 36.5 秒 | 轉 WebP |
| `ep09-cover.webp` | 9 | cover | [豆瓣 2919542670](https://movie.douban.com/photos/photo/2919542670/) | 1910×1074 | 對到電視猫第 9 集獨有劇照 | 轉 WebP |
| `ep09-egg-1.webp` | 9 | easterEggImg | [豆瓣 2919783964](https://movie.douban.com/photos/photo/2919783964/) | 1920×1080 | 對到電視猫第 9 集獨有劇照 | 轉 WebP |

`ep01-egg-1.webp`、`ep01-egg-2.webp` 是專案原有素材。

## 集數未確定（先放滿用）

從豆瓣劇照中挑高清橫幅、正面鏡頭睜眼的圖，依豆瓣編號順序依序填進各集空位，集數沒有依據，之後認出集數可以再對調。

| 檔案 | 放在第幾集 | 欄位 | 原圖 | 尺寸 | 修改 |
| --- | --- | --- | --- | --- | --- |
| `ep01-cover.webp` | 1 | cover | [豆瓣 2910088692](https://movie.douban.com/photos/photo/2910088692/) | 1918×1080 | 轉 WebP |
| `ep02-cover.webp` | 2 | cover | [豆瓣 2910088699](https://movie.douban.com/photos/photo/2910088699/) | 1920×1080 | 轉 WebP |
| `ep02-egg-1.webp` | 2 | easterEggImg | [豆瓣 2918346798](https://movie.douban.com/photos/photo/2918346798/) | 1620×1080 | 轉 WebP |
| `ep02-egg-2.webp` | 2 | easterEggImg2 | [豆瓣 2918346799](https://movie.douban.com/photos/photo/2918346799/) | 1620×1080 | 轉 WebP |
| `ep03-cover.webp` | 3 | cover | [豆瓣 2918346823](https://movie.douban.com/photos/photo/2918346823/) | 1620×1080 | 轉 WebP |
| `ep03-egg-1.webp` | 3 | easterEggImg | [豆瓣 2918346824](https://movie.douban.com/photos/photo/2918346824/) | 1620×1080 | 轉 WebP |
| `ep03-egg-2.webp` | 3 | easterEggImg2 | [豆瓣 2918346829](https://movie.douban.com/photos/photo/2918346829/) | 1620×1080 | 轉 WebP |
| `ep04-cover.webp` | 4 | cover | [豆瓣 2918346850](https://movie.douban.com/photos/photo/2918346850/) | 1619×1080 | 轉 WebP |
| `ep04-egg-1.webp` | 4 | easterEggImg | [豆瓣 2918346955](https://movie.douban.com/photos/photo/2918346955/) | 1620×1080 | 轉 WebP |
| `ep04-egg-2.webp` | 4 | easterEggImg2 | [豆瓣 2918346956](https://movie.douban.com/photos/photo/2918346956/) | 1619×1080 | 轉 WebP |
| `ep05-cover.webp` | 5 | cover | [豆瓣 2918346957](https://movie.douban.com/photos/photo/2918346957/) | 1620×1080 | 轉 WebP |
| `ep05-egg-1.webp` | 5 | easterEggImg | [豆瓣 2918443109](https://movie.douban.com/photos/photo/2918443109/) | 1614×1080 | 轉 WebP |
| `ep05-egg-2.webp` | 5 | easterEggImg2 | [豆瓣 2918443110](https://movie.douban.com/photos/photo/2918443110/) | 1614×1080 | 轉 WebP |
| `ep06-cover.webp` | 6 | cover | [豆瓣 2918443114](https://movie.douban.com/photos/photo/2918443114/) | 1614×1080 | 轉 WebP |
| `ep06-egg-1.webp` | 6 | easterEggImg | [豆瓣 2918443193](https://movie.douban.com/photos/photo/2918443193/) | 1620×1080 | 轉 WebP |
| `ep06-egg-2.webp` | 6 | easterEggImg2 | [豆瓣 2918443300](https://movie.douban.com/photos/photo/2918443300/) | 1620×1080 | 轉 WebP |
| `ep07-egg-1.webp` | 7 | easterEggImg | [豆瓣 2918443314](https://movie.douban.com/photos/photo/2918443314/) | 1620×1080 | 轉 WebP |
| `ep07-egg-2.webp` | 7 | easterEggImg2 | [豆瓣 2918443315](https://movie.douban.com/photos/photo/2918443315/) | 1619×1080 | 轉 WebP |
| `ep08-cover.webp` | 8 | cover | [豆瓣 2918443320](https://movie.douban.com/photos/photo/2918443320/) | 1619×1080 | 轉 WebP |
| `ep08-egg-1.webp` | 8 | easterEggImg | [豆瓣 2918484099](https://movie.douban.com/photos/photo/2918484099/) | 1620×1080 | 轉 WebP |
| `ep08-egg-2.webp` | 8 | easterEggImg2 | [豆瓣 2918484100](https://movie.douban.com/photos/photo/2918484100/) | 1620×1080 | 轉 WebP |
| `ep09-egg-2.webp` | 9 | easterEggImg2 | [豆瓣 2918484346](https://movie.douban.com/photos/photo/2918484346/) | 1620×1080 | 轉 WebP |
| `ep10-cover.webp` | 10 | cover | [豆瓣 2918484348](https://movie.douban.com/photos/photo/2918484348/) | 1619×1080 | 轉 WebP |
| `ep10-egg-1.webp` | 10 | easterEggImg | [豆瓣 2918484477](https://movie.douban.com/photos/photo/2918484477/) | 1620×1080 | 轉 WebP |
| `ep10-egg-2.webp` | 10 | easterEggImg2 | [豆瓣 2918484479](https://movie.douban.com/photos/photo/2918484479/) | 1620×1080 | 轉 WebP |
| `ep11-cover.webp` | 11 | cover | [豆瓣 2918519641](https://movie.douban.com/photos/photo/2918519641/) | 1619×1080 | 轉 WebP |
| `ep11-egg-1.webp` | 11 | easterEggImg | [豆瓣 2918520957](https://movie.douban.com/photos/photo/2918520957/) | 1620×1080 | 轉 WebP |
| `ep11-egg-2.webp` | 11 | easterEggImg2 | [豆瓣 2918520982](https://movie.douban.com/photos/photo/2918520982/) | 1620×1080 | 轉 WebP |
| `ep12-cover.webp` | 12 | cover | [豆瓣 2918526825](https://movie.douban.com/photos/photo/2918526825/) | 1620×1080 | 轉 WebP |
| `ep12-egg-1.webp` | 12 | easterEggImg | [豆瓣 2918526830](https://movie.douban.com/photos/photo/2918526830/) | 1620×1080 | 轉 WebP |
| `ep12-egg-2.webp` | 12 | easterEggImg2 | [豆瓣 2918526835](https://movie.douban.com/photos/photo/2918526835/) | 1620×1080 | 轉 WebP |
| `ep13-cover.webp` | 13 | cover | [豆瓣 2918526836](https://movie.douban.com/photos/photo/2918526836/) | 1620×1080 | 轉 WebP |
| `ep13-egg-1.webp` | 13 | easterEggImg | [豆瓣 2918526839](https://movie.douban.com/photos/photo/2918526839/) | 1619×1080 | 轉 WebP |
| `ep13-egg-2.webp` | 13 | easterEggImg2 | [豆瓣 2918532682](https://movie.douban.com/photos/photo/2918532682/) | 1619×1080 | 轉 WebP |
| `ep14-cover.webp` | 14 | cover | [豆瓣 2918554282](https://movie.douban.com/photos/photo/2918554282/) | 1619×1080 | 轉 WebP |
| `ep14-egg-1.webp` | 14 | easterEggImg | [豆瓣 2918554393](https://movie.douban.com/photos/photo/2918554393/) | 1620×1080 | 轉 WebP |
| `ep14-egg-2.webp` | 14 | easterEggImg2 | [豆瓣 2918554394](https://movie.douban.com/photos/photo/2918554394/) | 1620×1080 | 轉 WebP |
| `ep15-cover.webp` | 15 | cover | [豆瓣 2918563044](https://movie.douban.com/photos/photo/2918563044/) | 1620×1080 | 轉 WebP |
| `ep15-egg-1.webp` | 15 | easterEggImg | [豆瓣 2918563555](https://movie.douban.com/photos/photo/2918563555/) | 1620×1080 | 轉 WebP |
| `ep15-egg-2.webp` | 15 | easterEggImg2 | [豆瓣 2918563690](https://movie.douban.com/photos/photo/2918563690/) | 1620×1080 | 轉 WebP |
| `ep16-cover.webp` | 16 | cover | [豆瓣 2918563692](https://movie.douban.com/photos/photo/2918563692/) | 1620×1080 | 轉 WebP |
| `ep16-egg-1.webp` | 16 | easterEggImg | [豆瓣 2918563704](https://movie.douban.com/photos/photo/2918563704/) | 1620×1080 | 轉 WebP |
| `ep16-egg-2.webp` | 16 | easterEggImg2 | [豆瓣 2918563732](https://movie.douban.com/photos/photo/2918563732/) | 1620×1080 | 轉 WebP |
| `ep17-cover.webp` | 17 | cover | [豆瓣 2918563737](https://movie.douban.com/photos/photo/2918563737/) | 1620×1080 | 轉 WebP |
| `ep17-egg-1.webp` | 17 | easterEggImg | [豆瓣 2918566933](https://movie.douban.com/photos/photo/2918566933/) | 1619×1080 | 轉 WebP |
| `ep17-egg-2.webp` | 17 | easterEggImg2 | [豆瓣 2918566934](https://movie.douban.com/photos/photo/2918566934/) | 1619×1080 | 轉 WebP |
| `ep18-cover.webp` | 18 | cover | [豆瓣 2918587285](https://movie.douban.com/photos/photo/2918587285/) | 1620×1080 | 轉 WebP |
| `ep18-egg-1.webp` | 18 | easterEggImg | [豆瓣 2918618624](https://movie.douban.com/photos/photo/2918618624/) | 1620×1080 | 轉 WebP |
| `ep18-egg-2.webp` | 18 | easterEggImg2 | [豆瓣 2918618625](https://movie.douban.com/photos/photo/2918618625/) | 1620×1080 | 轉 WebP |
| `ep19-cover.webp` | 19 | cover | [豆瓣 2918618627](https://movie.douban.com/photos/photo/2918618627/) | 1619×1080 | 轉 WebP |
| `ep19-egg-1.webp` | 19 | easterEggImg | [豆瓣 2918618628](https://movie.douban.com/photos/photo/2918618628/) | 1619×1080 | 轉 WebP |
| `ep19-egg-2.webp` | 19 | easterEggImg2 | [豆瓣 2918618629](https://movie.douban.com/photos/photo/2918618629/) | 1620×1080 | 轉 WebP |
| `ep20-cover.webp` | 20 | cover | [豆瓣 2918618769](https://movie.douban.com/photos/photo/2918618769/) | 1620×1080 | 轉 WebP |
| `ep20-egg-1.webp` | 20 | easterEggImg | [豆瓣 2918618803](https://movie.douban.com/photos/photo/2918618803/) | 1619×1080 | 轉 WebP |
| `ep20-egg-2.webp` | 20 | easterEggImg2 | [豆瓣 2918618804](https://movie.douban.com/photos/photo/2918618804/) | 1619×1080 | 轉 WebP |
| `ep21-cover.webp` | 21 | cover | [豆瓣 2918618805](https://movie.douban.com/photos/photo/2918618805/) | 1620×1080 | 轉 WebP |
| `ep21-egg-1.webp` | 21 | easterEggImg | [豆瓣 2918618862](https://movie.douban.com/photos/photo/2918618862/) | 1620×1080 | 轉 WebP |
| `ep21-egg-2.webp` | 21 | easterEggImg2 | [豆瓣 2918618863](https://movie.douban.com/photos/photo/2918618863/) | 1620×1080 | 轉 WebP |
| `ep22-cover.webp` | 22 | cover | [豆瓣 2918618867](https://movie.douban.com/photos/photo/2918618867/) | 1620×1080 | 轉 WebP |
| `ep22-egg-1.webp` | 22 | easterEggImg | [豆瓣 2918633925](https://movie.douban.com/photos/photo/2918633925/) | 1620×1080 | 轉 WebP |
| `ep22-egg-2.webp` | 22 | easterEggImg2 | [豆瓣 2918633927](https://movie.douban.com/photos/photo/2918633927/) | 1620×1080 | 轉 WebP |
| `ep23-cover.webp` | 23 | cover | [豆瓣 2918633934](https://movie.douban.com/photos/photo/2918633934/) | 1620×1080 | 轉 WebP |
| `ep23-egg-1.webp` | 23 | easterEggImg | [豆瓣 2918633956](https://movie.douban.com/photos/photo/2918633956/) | 1619×1080 | 轉 WebP |
| `ep23-egg-2.webp` | 23 | easterEggImg2 | [豆瓣 2918633957](https://movie.douban.com/photos/photo/2918633957/) | 1619×1080 | 轉 WebP |
| `ep24-cover.webp` | 24 | cover | [豆瓣 2918633960](https://movie.douban.com/photos/photo/2918633960/) | 1619×1080 | 轉 WebP |
| `ep24-egg-1.webp` | 24 | easterEggImg | [豆瓣 2918634088](https://movie.douban.com/photos/photo/2918634088/) | 1620×1080 | 轉 WebP |
| `ep24-egg-2.webp` | 24 | easterEggImg2 | [豆瓣 2918653078](https://movie.douban.com/photos/photo/2918653078/) | 1620×1080 | 轉 WebP |
| `ep25-cover.webp` | 25 | cover | [豆瓣 2918653079](https://movie.douban.com/photos/photo/2918653079/) | 1620×1080 | 轉 WebP |
| `ep25-egg-1.webp` | 25 | easterEggImg | [豆瓣 2918653080](https://movie.douban.com/photos/photo/2918653080/) | 1619×1080 | 轉 WebP |
| `ep25-egg-2.webp` | 25 | easterEggImg2 | [豆瓣 2918653123](https://movie.douban.com/photos/photo/2918653123/) | 1620×1080 | 轉 WebP |
| `ep26-cover.webp` | 26 | cover | [豆瓣 2918662339](https://movie.douban.com/photos/photo/2918662339/) | 1619×1080 | 轉 WebP |
| `ep26-egg-1.webp` | 26 | easterEggImg | [豆瓣 2918662362](https://movie.douban.com/photos/photo/2918662362/) | 1620×1080 | 轉 WebP |
| `ep26-egg-2.webp` | 26 | easterEggImg2 | [豆瓣 2918662375](https://movie.douban.com/photos/photo/2918662375/) | 1620×1080 | 轉 WebP |
| `ep27-cover.webp` | 27 | cover | [豆瓣 2918662379](https://movie.douban.com/photos/photo/2918662379/) | 1619×1080 | 轉 WebP |
| `ep27-egg-1.webp` | 27 | easterEggImg | [豆瓣 2918662413](https://movie.douban.com/photos/photo/2918662413/) | 1620×1080 | 轉 WebP |
| `ep27-egg-2.webp` | 27 | easterEggImg2 | [豆瓣 2918662416](https://movie.douban.com/photos/photo/2918662416/) | 1620×1080 | 轉 WebP |
| `ep28-cover.webp` | 28 | cover | [豆瓣 2918662417](https://movie.douban.com/photos/photo/2918662417/) | 1620×1080 | 轉 WebP |
| `ep28-egg-1.webp` | 28 | easterEggImg | [豆瓣 2918662429](https://movie.douban.com/photos/photo/2918662429/) | 1620×1080 | 轉 WebP |
| `ep28-egg-2.webp` | 28 | easterEggImg2 | [豆瓣 2918662433](https://movie.douban.com/photos/photo/2918662433/) | 1620×1080 | 轉 WebP |
| `ep29-cover.webp` | 29 | cover | [豆瓣 2918662458](https://movie.douban.com/photos/photo/2918662458/) | 1619×1080 | 轉 WebP |
| `ep29-egg-1.webp` | 29 | easterEggImg | [豆瓣 2918662465](https://movie.douban.com/photos/photo/2918662465/) | 1619×1080 | 轉 WebP |
| `ep29-egg-2.webp` | 29 | easterEggImg2 | [豆瓣 2918662469](https://movie.douban.com/photos/photo/2918662469/) | 1619×1080 | 轉 WebP |
| `ep30-cover.webp` | 30 | cover | [豆瓣 2918662476](https://movie.douban.com/photos/photo/2918662476/) | 1620×1080 | 轉 WebP |
| `ep30-egg-1.webp` | 30 | easterEggImg | [豆瓣 2918662484](https://movie.douban.com/photos/photo/2918662484/) | 1620×1080 | 轉 WebP |
| `ep30-egg-2.webp` | 30 | easterEggImg2 | [豆瓣 2918739770](https://movie.douban.com/photos/photo/2918739770/) | 1619×1080 | 轉 WebP |
| `ep31-cover.webp` | 31 | cover | [豆瓣 2918739773](https://movie.douban.com/photos/photo/2918739773/) | 1689×1080 | 轉 WebP |
| `ep31-egg-1.webp` | 31 | easterEggImg | [豆瓣 2918739774](https://movie.douban.com/photos/photo/2918739774/) | 1620×1080 | 轉 WebP |
| `ep31-egg-2.webp` | 31 | easterEggImg2 | [豆瓣 2918740014](https://movie.douban.com/photos/photo/2918740014/) | 1620×1080 | 轉 WebP |
| `ep32-cover.webp` | 32 | cover | [豆瓣 2918740015](https://movie.douban.com/photos/photo/2918740015/) | 1620×1080 | 轉 WebP |
| `ep32-egg-1.webp` | 32 | easterEggImg | [豆瓣 2918740016](https://movie.douban.com/photos/photo/2918740016/) | 1620×1080 | 轉 WebP |
| `ep32-egg-2.webp` | 32 | easterEggImg2 | [豆瓣 2918740139](https://movie.douban.com/photos/photo/2918740139/) | 1620×1080 | 轉 WebP |

## 只知道集數範圍（未使用）

| 原圖 | 範圍 | 依據 |
| --- | --- | --- |
| [豆瓣 2919783949](https://movie.douban.com/photos/photo/2919783949/)、[2919783950](https://movie.douban.com/photos/photo/2919783950/) | 7–9 | 第 7–9 集合併預告 [xbuzSLGv0Tw](https://www.youtube.com/watch?v=xbuzSLGv0Tw) 90.5 秒 |
| [豆瓣 2918708115](https://movie.douban.com/photos/photo/2918708115/) | 12–13 | 第 12–13 集預告 [w4cwoN625j4](https://www.youtube.com/watch?v=w4cwoN625j4) 28.5 秒（手機截圖，畫質差） |
| [豆瓣 2918900680](https://movie.douban.com/photos/photo/2918900680/) | 16–17 | 第 16–17 集預告 [02GYqVg3T_0](https://www.youtube.com/watch?v=02GYqVg3T_0) 50.5 秒（直式） |
| [豆瓣 2918313697](https://movie.douban.com/photos/photo/2918313697/) | 5 | 對到電視猫第 5 集獨有劇照（直式拼圖，不適合當背景） |

## 未確定集數

全部 215 張豆瓣橫幅高清劇照（含上面已用的 91 張）的清單和總覽圖，放在倉庫外的 `劇照-未確定集數/清單.md`。
