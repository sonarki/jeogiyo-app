# FinCalc Hub — 무료 금융 계산기 수익형 사이트

영상에서 소개한 비즈니스 모델(**검색량 높은 유틸리티 → 무료 오가닉 트래픽 → 애드센스 광고 수익**)을 그대로 구현한, 바로 배포 가능한 정적 웹사이트입니다.

## 왜 "금융 계산기" 니치인가 (수익 근거)

| 항목 | 근거 |
|---|---|
| **최고 CPC 니치** | 애드센스에서 **금융·대출·보험**이 CPC 최상위($5~$50+/클릭). 일반 콘텐츠보다 광고 단가가 수배~수십 배 높음 |
| **초대형 에버그린 검색량** | "loan calculator", "mortgage calculator", "percentage calculator" 등은 매달 수백만~수천만 검색되는 영구 수요 키워드 |
| **콘텐츠 부담 없음** | 글을 쓸 필요 없이 **계산기 도구 자체가 콘텐츠** — time.is 모델과 동일 |
| **페이지뷰 배수** | 여러 계산기를 한 사이트에 묶어 내부링크로 순환 → 방문당 페이지뷰↑ → 광고 노출↑ (영상의 핵심 수익 공식) |

> 전략: **고 CPC 페이지(대출·모기지)로 수익**을 내고, **초고volume 페이지(퍼센트 계산기)로 트래픽을 끌어와** 내부링크로 고수익 페이지에 연결합니다.

## 사이트 구성

```
index.html                        # 허브 홈 (모든 계산기 링크)
loan-calculator.html              # 대출 계산기 (+상환 스케줄)   ← 고수익
mortgage-calculator.html          # 모기지 계산기 (세금·보험·PMI) ← 고수익
auto-loan-calculator.html         # 자동차 대출 (취득세·중고차 보상) ← 고수익
compound-interest-calculator.html # 복리 계산기 (+연도별 성장표)
percentage-calculator.html        # 퍼센트 계산기 ← 트래픽 유입용
about.html / privacy.html / contact.html  # 애드센스 승인 필수 페이지
assets/style.css, assets/app.js   # 공용 디자인·헤더·푸터
sitemap.xml, robots.txt, ads.txt  # SEO·애드센스 인프라
```

전부 **순수 HTML/CSS/JS(외부 라이브러리 0개)** 라서 빠르고, SEO에 유리하며, 어떤 정적 호스팅에도 올라갑니다.

## 배포 방법 (택 1)

### A. GitHub Pages — 무료, 가장 빠름
1. 이 브랜치를 `main`에 머지 (또는 Pages 소스로 이 브랜치 지정)
2. GitHub 저장소 → **Settings → Pages → Source: `main` / root** 선택
3. 몇 분 뒤 `https://<user>.github.io/jeogiyo-app/` 로 공개됨
4. 커스텀 도메인은 Settings → Pages → Custom domain 에 입력

### B. Hostinger / Netlify / Vercel / Cloudflare Pages
- 저장소를 연결하고 빌드 명령 없이(정적) 루트 폴더를 배포하면 끝

## ⚙️ 배포 전 꼭 바꿔야 할 값 (찾기·바꾸기)

전체 파일에서 아래 플레이스홀더를 실제 값으로 치환하세요.

| 플레이스홀더 | 바꿀 값 | 위치 |
|---|---|---|
| `YOURDOMAIN.com` | 실제 도메인 | 모든 html의 canonical/OG, sitemap.xml, robots.txt, ads.txt |
| `ca-pub-XXXXXXXXXXXXXXXX` | 애드센스 게시자 ID | 모든 html `<head>`, `assets/app.js` |
| `pub-XXXXXXXXXXXXXXXX` | 위 ID의 숫자부분 | ads.txt |
| `hello@YOURDOMAIN.com` | 실제 이메일 | contact.html |

리눅스/맥 한 줄 치환 예시 (도메인):
```bash
grep -rl 'YOURDOMAIN.com' . | xargs sed -i 's/YOURDOMAIN\.com/example.com/g'
```

## 💰 애드센스 연결 (영상 절차 그대로)

1. **도메인 구매** → 사이트 배포 (위 참고). 좋은 도메인 = 검색어와 유사할수록 유리
2. [adsense.google.com](https://adsense.google.com) 가입 → 사이트 URL 등록 → 지급 정보 입력
3. 애드센스가 주는 코드의 `ca-pub-XXXX` 를 확인 → **이 프로젝트의 모든 `<head>` 스크립트와 `assets/app.js`, `ads.txt` 의 플레이스홀더를 실제 ID로 치환**
   - 이미 모든 페이지 `<head>` 에 애드센스 로더 스크립트가 들어있고, 본문에 광고 자리(`.ad-slot`)가 배치되어 있습니다
4. **Auto Ads** 를 켜면 구글이 자동으로 광고를 최적 배치 (영상과 동일)
5. 애드센스에서 **사이트 인증 → 검토 요청**. 승인은 보통 며칠 소요

> ⚠️ 승인 팁: 애드센스는 **개인정보처리방침·소개·연락처 페이지**와 **실질적인 콘텐츠**를 요구합니다. 이 사이트에는 이미 `privacy.html`, `about.html`, `contact.html`, 각 계산기의 설명·FAQ가 포함되어 승인 조건을 충족하도록 구성했습니다.

## 🔍 검색 노출(SEO) 세팅

1. [Google Search Console](https://search.google.com/search-console) 에 도메인 등록·소유 확인
2. **Sitemaps** 메뉴에서 `https://<도메인>/sitemap.xml` 제출
3. 각 페이지에 이미 적용된 것: 고유 `title`·`meta description`, canonical, Open Graph, **FAQ 구조화 데이터(JSON-LD)** → 구글 리치결과 노출에 유리
4. 이후 계산기를 추가할수록(예: 신용카드 상환, 예금, 세금 계산기) 롱테일 트래픽이 누적됩니다

## 로컬 미리보기

```bash
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

## 다음 확장 아이디어 (트래픽·수익 확대)

- credit-card-payoff, savings-goal, retirement, salary(연봉→시급), tip, BMI, sales-tax 계산기 추가
- 각 페이지는 이 프로젝트의 기존 파일을 복제해 계산 로직과 SEO 메타만 교체하면 됩니다 (헤더/푸터는 `app.js`가 자동 생성)

---

**면책:** 본 사이트는 일반 정보·추정치를 제공하며 금융/세무/법률 자문이 아닙니다. 수익은 트래픽·니치·지역·CPC에 따라 달라지며 어떤 수익도 보장되지 않습니다.
