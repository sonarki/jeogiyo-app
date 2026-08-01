# HookForge 계정·접속정보 (마스터)

> 프로젝트에 연결된 모든 계정/서비스를 한 장으로 정리한 시트입니다.
> ⚠️ **이 파일에는 비밀번호·토큰(민감정보)이 없습니다.** 실제 접속 secret은 git에 올리지 않고 별도 비공개 파일로 전달됩니다.
> 원칙: **전부 신규 브랜드 계정.** 캡틴 기존 개인 채널과 분리.

---

## 1. 핵심 계정

| 서비스 | 식별자 | 용도 | 상태 |
|---|---|---|---|
| **브랜드 지메일** | `hookforge.aistudio@gmail.com` (2FA ON) | 모든 가입의 베이스 · 콜드메일 발송/수신 · 자동 순찰 감시 | 🟢 가동 |
| **TikTok** | `@hookforge.studio` · https://www.tiktok.com/@hookforge.studio | UGC 데모 게시 채널 | 🟢 데모 2편 게시, Higgsfield 커넥터 연결 |
| **Gumroad** | 판매자 `hookforgestudio` · https://hookforgestudio.gumroad.com | 결제·상품 리스팅 | 🟢 판매중 / ⚠️ 정산정보 미완성 |
| **Higgsfield** | 캡틴 계정 | 영상 생성 + 랜딩사이트 호스팅 | 🟢 가동 (크레딧 잔고 관리 필요) |
| **랜딩 사이트** | https://gethookforge.higgsfield.app | 데모·세일즈 랜딩 | 🟢 라이브 (Higgsfield 호스팅, Cloudflare, 무료) |
| **X (트위터)** | 핸들 예정 `@hookforge` | 리플라이·포스트 (미가동) | 🟡 가입했으나 심사 제한 상태 |
| **GitHub 백업** | `sonarki/jeogiyo-app`(hookforge/ 폴더) · `sonarki/-72`(백업) | 소스·문서 백업 | 🟢 |

## 2. 서비스별 상세

### 브랜드 지메일 — `hookforge.aistudio@gmail.com`
- 2단계 인증 ON.
- SMTP/IMAP 자동화(순찰·발송)에 **앱 비밀번호** 사용 → 값은 별도 비공개 파일. 재발급: myaccount.google.com/apppasswords
- 이 지메일이 아래 TikTok·Gumroad·Higgsfield 가입의 공통 이메일.

### TikTok — `@hookforge.studio`
- 가입 이메일 = 브랜드 지메일.
- Higgsfield 커넥터 연결됨. connector_id: `2b2f4e67-21e1-4b77-b651-8e2e9078f44f`
- 게시물: 데모 2편 (ASMR, 뷰티 L2 — post_id 7667192139062709512). AI표기+프로모션 라벨 적용.

### Gumroad — 판매자 `hookforgestudio`
- 스토어: https://hookforgestudio.gumroad.com
- 계정 이메일 = 브랜드 지메일.
- **판매 상품(현행)**: TEST MATRIX $990 → https://hookforgestudio.gumroad.com/l/bxnwkl
- 나머지 2티어(HOOK PACK/FULL FUNNEL)는 이메일 문의로 클로징 (리스팅 미등록).
- ⚠️ **정산정보(은행/세금) 미완성** → 판매가 나도 지급받으려면 완료 필요: gumroad.com/settings/payments **(캡틴 수동 조치)**
- (참고) 과거 `/l/kylmz`(Hook Bank)는 내려간 상품 — 무시.

### Higgsfield — 캡틴 계정
- 용도: ① 광고 영상 생성(Marketing Studio/Seedance) ② 랜딩사이트 호스팅.
- 랜딩: https://gethookforge.higgsfield.app
- 사이트 저장소: website_id `9c502cc6-ccfc-434e-9c9a-debdc448eab4` · **빌드 루트 = `app/src`** (root `src/`는 빌드 무시).
- 저장소 토큰은 `website_repo_access`로 필요시 재발급(1회용성) → 값 미기록.
- 크레딧: 플로어 2,000cr는 손대지 않음(원가 리듬 = 주문 1건당 크레딧 팩 1개).

## 3. 민감정보(비밀번호·토큰) 보관 정책

| 항목 | 위치 |
|---|---|
| 지메일 **앱 비밀번호**(SMTP/IMAP 자동화용) | **별도 비공개 파일**로 전달 · git 미포함. 재발급 가능 |
| 각 플랫폼 **로그인 비밀번호**(Gmail·TikTok·Gumroad·Higgsfield) | **캡틴 본인만 보유** (에이전트 미보유) |
| Higgsfield 사이트 저장소 토큰 | 필요시 `website_repo_access`로 재발급 (영구 secret 아님) |

> 즉, 이 프로젝트를 완전히 통제하려면 **① 브랜드 지메일 로그인 비밀번호(캡틴 보유)** 하나만 있으면 나머지(TikTok·Gumroad·Higgsfield)는 전부 "지메일로 로그인/복구" 가능합니다. 지메일이 마스터 키입니다.
