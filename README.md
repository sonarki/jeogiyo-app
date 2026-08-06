# ⚡ AIPriceIndex — 자동화 수익 시스템 (스켈레톤 v1)

**하나의 데이터 → 두 개의 수도꼭지.** AI 모델 가격/스펙 DB 하나를 매일 자동 갱신해서:

1. **프로그래매틱 웹** — 구글 검색 유입 → 광고/제휴 수익 (디자인은 템플릿 1개로 영구 해결)
2. **JSON API** — 개발자 대상 월 구독 (Gumroad = 결제/정산, 이미 계정 연결 완료)

런타임 AI 비용 **거의 0** — 사이트/API는 미리 만들어진 정적 데이터만 서빙. AI는 하루 1번 수집에만 (최저가 모델 or 무-AI 파싱).

## 구조

```
data/tools.json          ← 유일한 데이터 소스 (여기만 갱신하면 전부 자동)
scripts/update.mjs       ← 매일 실행: 데이터 수집·검증 (실제 수집기 꽂는 곳)
scripts/build.mjs        ← 정적 사이트 생성기: 템플릿 1개 → 페이지 N개
assets/style.css         ← 디자인 전부. 두 번 다시 안 건드려도 됨
api/tools.js             ← 유료 API 엔드포인트 (무료 100req/일 제한 + 유료 키)
public/                  ← 빌드 결과물 (배포 대상)
.github/workflows/daily-update.yml ← 매일 06:00 UTC 자동 갱신+재빌드+커밋
```

## 로컬 실행

```bash
npm run all      # 데이터 검증 + 사이트 빌드
npm run serve    # 로컬 미리보기
```

## 캡틴이 할 일 (계정 연결 = 이게 전부)

돈이 들어오는 구멍 3개, 각각 계정 하나씩:

| # | 뭐 | 어디서 | 비용 |
|---|---|---|---|
| 1 | 도메인 구입 → `data/tools.json`의 `meta.domain` 교체 | Namecheap/Cloudflare | ~$12/년 |
| 2 | 배포 연결 (이 레포 → 자동 배포) | Vercel 무료 티어 (public/ 서빙 + api/ 함수) | $0 |
| 3 | **Gumroad 구독 상품 등록** ("API Pro" $19/mo, "Generate license keys" 켜기) → 상품 URL을 `api-docs` 페이지의 `GUMROAD_PRODUCT_URL`에, product ID를 배포 env `GUMROAD_PRODUCT_ID`에 | gumroad.com (계정 연결 완료) | $0 (수수료 ~10%) |
| 4 | 제휴 프로그램 가입 (각 AI 벤더/툴) → `tools.json`의 `affiliate_url` 채우기 | 각 벤더 affiliate 페이지 | $0 |

## 다음 개발 단계 (우선순위순)

1. `scripts/update.mjs`에 실제 수집기 구현 (벤더 가격페이지 fetch+parse, AI 불필요한 것부터)
2. 모델 100개+로 확장 → 페이지 수 = SEO 표면적 자동 확장
3. ~~"X vs Y" 비교 페이지 자동 생성~~ → 완료 (`build.mjs`가 카테고리 내 전 조합 생성)
4. ~~API 키 자동 발급~~ → 완료: Gumroad가 구독 시 라이선스 키 자동 발급, `api/tools.js`가 검증
5. 가격 변동 히스토리 축적 → Business 티어 상품화

## 솔직한 기대치

- 1개월차: 트래픽 거의 0 (구글 인덱싱 시작). **정상이야.**
- 2~3개월차: 롱테일 검색 유입 시작, 제휴 첫 수익 가능
- 4~6개월차: 트래픽 복리 구간. API 첫 구독자 목표
- 천만원/월은 페이지 수천 개 + 백링크가 쌓인 뒤의 얘기. **매일 자동 갱신이 그 복리를 만든다 — 그래서 중간에 갈아엎지 않는 게 전략의 전부다.**
