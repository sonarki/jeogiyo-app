# KitchenConvert — 프로그래매틱 SEO 계량변환 사이트 (관리 최소형 패시브 자산)

"한 번 만들고 관리 없이" 조건에 가장 근접한 실물 자산입니다. **데이터 한 줄 = 페이지 한 개** 구조라, AI로 데이터만 늘리면 수백~수천 페이지로 확장되고, 콘텐츠가 **평생 안 변하는 팩트(계량 밀도)** 라 유지보수가 사실상 0입니다.

## 왜 이 니치인가 (정직한 근거)
- **에버그린 초대형 롱테일:** "how many grams in a cup of flour" 류는 매년 수백만 검색, 영원히 안 사라짐.
- **유지보수 0:** 밀가루 1컵 = 125g은 10년 뒤에도 동일 → 갱신 불필요(당신 조건과 일치).
- **구글 위젯 회피:** 재료별 밀도까지는 구글이 한 답으로 안 줌 → 클릭이 사이트로 옴.
- **정직한 한계:** 요리 니치 RPM은 금융보다 낮음. **큰 수익엔 페이지 규모(수백+)와 시간(12~24개월)** 필요. "즉시 수천만원" 아님. 대신 **진짜 손 안 대는 자산**.

## 구조
```
kitchen/
├─ data/ingredients.json     ← 여기에 재료를 추가하면 페이지가 늘어남 (핵심)
├─ generate.mjs              ← 정적 페이지 생성기 (node generate.mjs)
├─ assets/style.css, convert.js
├─ index.html                ← 허브 (자동생성)
├─ convert/<재료>.html        ← 재료별 변환 페이지 38개 (자동생성)
├─ cups-to-grams.html / tablespoons-to-grams.html / oven-temperature-conversion.html  ← 필러(자동생성)
├─ about / privacy / contact.html   ← 애드센스 승인 필수(자동생성)
└─ sitemap.xml / robots.txt / ads.txt (자동생성)
```
현재 **45개 URL**. 순수 정적 HTML/CSS/JS(외부 라이브러리 0) → 빠르고 어디든 배포 가능, `file://` 더블클릭으로도 작동.

## 페이지 늘리기 (확장 = 돈의 크기)
1. `data/ingredients.json` 에 줄 추가:
   ```json
   { "name": "Icing Sugar", "gpc": 120, "cat": "Sugar", "note": "..." }
   ```
   - `gpc` = 1 US컵의 그램 무게, `cat` = 분류.
2. 재생성:
   ```bash
   cd kitchen && node generate.mjs
   ```
3. 끝. sitemap까지 자동 갱신. **AI에게 "재료 200개 gpc와 note를 JSON으로 만들어줘"** 시키면 하루 만에 200페이지도 가능.

> 같은 엔진으로 **다른 니치**(예: 국가별 콘센트/전압, 신발 사이즈 변환 등)도 데이터만 바꿔 재사용할 수 있습니다.

## 배포 전 치환값 (generate.mjs 상단 + 재생성)
| 값 | 위치 | 바꿀 것 |
|---|---|---|
| `DOMAIN` | generate.mjs | 실제 도메인 (kitchen 폴더를 **웹 루트**로 배포한다고 가정) |
| `ADS` (`ca-pub-XXXX`) | generate.mjs | 애드센스 게시자 ID |
| `hello@YOURDOMAIN.com` | generate.mjs (contact) | 실제 이메일 |

바꾼 뒤 `node generate.mjs` 한 번 다시 실행하면 모든 페이지에 반영됩니다.

## 배포
- **GitHub Pages / Netlify / Cloudflare Pages** 에 **kitchen 폴더 내용을 웹 루트로** 올리면 끝(빌드 불필요, 정적).
- 로컬 확인: `index.html` 더블클릭, 또는 `python3 -m http.server` 후 접속.

## 애드센스 (한 번만)
1. 도메인 배포 → adsense.google.com 가입 → 사이트 등록 → 지급정보 입력.
2. `ADS` 를 실제 ID로 치환 후 재생성(모든 `<head>`에 로더 이미 삽입됨).
3. Auto Ads 켜기 → 검토 요청. About/Privacy/Contact + 실질 콘텐츠가 이미 있어 승인 조건 충족.
4. 승인 후엔 **정말 손 댈 일이 거의 없습니다.** 가끔 데이터(페이지)만 늘리면 트래픽·수익이 누적됩니다.

## 검색 등록 (한 번만)
- Google Search Console에 도메인 등록 → `sitemap.xml` 제출. 이후 자동으로 색인/누적.

---
**면책:** 표준 참고 계량값이며 정밀 실험용이 아닙니다. 수익은 트래픽·니치·규모에 따라 다르고 보장되지 않습니다. 이 모델의 강점은 "빠른 큰돈"이 아니라 **"초기 제작 후 방치 가능한 누적형 자산"** 입니다.
