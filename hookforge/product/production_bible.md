# HookForge Production Bible v2.0 — 공식 소스 기반
> **구성 원칙 (캡틴 지시 2026-07-27)**: 자체 발명 규칙이 아니라 ①툴 제조사 공식 가이드 ②플랫폼 공식 크리에이티브 규칙 ③검증된 전문가 기법을 체계화하고, ④우리 실측 캘리브레이션을 그 위에 얹는다.
> **출처 태그**: `[GG]`=Google 공식 나노바나나 가이드 · `[BD]`=ByteDance Seedance 2.0 생태계 가이드(WeShop/AtlasCloud 검증 룰) · `[TT]`=TikTok Creative Codes · `[CP]`=캡틴 Seedance 프레임워크 · `[HF]`=HookForge 실측 (우리만의 자산)
> 개정은 캡틴 승인으로만. 전체 출처 링크는 부록.

---

# PART 1 — Seedance 2.0 영상 생성 규칙

## 1.1 프롬프트 공식 `[BD]`
```
[Subject/Character] + [Specific Action] + [Environment] + [Visual Style] + [Camera Movement] + [Lighting/Mood]
```
- 구체성이 품질의 제1 결정요인: "a person" ❌ → "a woman in a red silk dress" ✅
- 액션은 반드시 명시 — 움직임 미정의 = 정적이거나 예측불가 결과

## 1.2 샷리스트 문법 `[CP]`
- 모든 문장은 **카메라가 찍을 수 있는 것**만. 감정 설명·스토리·서브텍스트 금지
- ❌ "She felt confident" → ✅ "steady eye contact with the lens, small honest smile"
- 메타 지시("CRITICAL RULE:" 등) 금지 — 프롬프트는 장면 기술이지 모델에게 보내는 편지가 아님

## 1.3 멀티샷 표기 `[BD]` ★v1 교정
- 공식 문법: **`Shot 1: ... Shot 2: ... Shot 3: ...`** 번호 표기
- **타임스탬프 강제 금지** — "Segment 1 (0-5s)" 같은 정밀 타이밍 강제는 생성을 깨뜨릴 수 있음 (공식 경고). 순서만 지정하고 타이밍은 모델에 위임
- 12s에 샷 2~3개가 안정권

## 1.4 물리·텍스처 기술 `[BD]`
- 물리는 메커니즘으로: "car turns" ❌ → "the tires smoke as the car drifts 90 degrees" ✅
- 모델이 사랑하는 리얼리즘 트리거: **skin pores, fabric weave, liquid, condensation droplets** — 매 영상 1개 이상 포함
- 스타일 앵커는 실존 레퍼런스로: "TikTok native style", "shot on a front phone camera" 등

## 1.5 네이티브 오디오 스크립팅 `[BD]`
- 대사는 따옴표 안에: `says: "Day one with this serum."`
- 오디오 형용사가 오디오 엔진을 조종: soft / muffled / echoing / crisp / quiet room tone
- 구체 SFX 지정 가능: "the soft click of the dropper cap"
- 표준 마감 문구: `Natural conversational American English at normal speaking volume, quiet room tone.`

## 1.6 레퍼런스 시스템 `[BD]` `[HF]`
- Seedance 2.0은 이미지 최대 9 + 비디오 3 + 오디오 3 레퍼런스 지원, @태그로 호출
- **Higgsfield 경유(우리 환경)**: `medias:[{value:<job_id>, role:"image_references"}]` — 프롬프트에선 "the amber glass serum bottle from the reference image"로 지칭 (검증 완료)

## 1.7 긍정문 원칙 `[GG]` `[CP]` ★두 공식 소스 일치
- **빼고 싶은 것은 프롬프트에 아예 쓰지 않는다.** 쓰는 순간 모델이 그린다
- Google 공식 안티패턴: "no cars" ❌ → "empty street" ✅
- 실전 사고사례 `[HF]`: "no golden-hour switch, no filter" 명기 → A편(27d27fd1) 배경 조명 붕괴(ΔL +14). v2.0부터 금칙어 자체를 미기재
- 예외: **대사 안의** "zero filter"는 말하는 내용이므로 허용

## 1.8 카메라·조명·모션 어휘집 `[CP]` `[BD]`
- 카메라: static locked-off / subtle organic handheld micro-motion / slow push-in / lateral tracking / POV / over-the-shoulder
- 조명: soft diffused window light / three-point softbox / Rembrandt / rim light / overcast soft light
- 모션 강도: "slow and deliberate" / "natural pacing" / "rapid action"
- UGC 표준 `[HF]`: **subtle organic handheld micro-motion** + 단일 soft neutral daylight

# PART 2 — Nano Banana Pro 이미지 생성 규칙 (제품 레퍼런스·브랜드 자산용)

## 2.1 텍스트→이미지 공식 `[GG]`
```
[Subject] + [Action] + [Location/context] + [Composition] + [Style]
```
- 강한 동사로 시작, 구체 디테일 (subject/lighting/composition)

## 2.2 레퍼런스 합성 공식 `[GG]`
```
[Reference images] + [Relationship instruction] + [New scenario]
```
- 최대 14장 레퍼런스 믹스 가능 — 캐릭터/브랜드 일관성 유지 용도

## 2.3 편집(시맨틱 마스킹) `[GG]`
- 텍스트로 마스크 정의, **유지할 부분을 명시적으로 기술** ("keep everything else exactly the same")

## 2.4 텍스트 렌더링 `[GG]`
- 원하는 문구는 따옴표로: `render the text 'GLOWRA' in a thin, minimalist sans-serif font`
- 폰트 스타일/색/굵기 지정: "bold, white, sans-serif font"

## 2.5 제품 촬영 표준 `[GG]`
- 조명 명시: `"three-point softbox setup"` (제품 균일광 공식 권장)
- 재질 구체화: "jacket" ❌ → "navy blue tweed" ✅ / 우리 제품은 §4.4 카테고리표의 재질 문구 사용
- 커머셜 룩: "high-end glossy commercial beauty shot"

## 2.6 안티패턴 `[GG]`
- 부정문 금지 / 모호어("nice") 금지 / 스타일 미지정 금지

# PART 3 — 플랫폼 크리에이티브 규칙 (광고가 살아남는 조건)

## 3.1 TikTok Creative Codes `[TT]`
- **훅은 첫 3초** — 리텐션 결정의 71%가 첫 3초에서 발생. 첫 대사=훅
- **네이티브 제작 스타일** — 스마트폰 UGC가 폴리시드 브랜드 영상 대비 +22% 성과
- **사운드온 설계** + 사운드오프 대비 자막(캡션 번인)
- 길이 스윗스팟 9~15초 (우리 표준 12s 적합)
- 명확한 CTA 1개

## 3.2 훅 4유형 `[TT]` — 카테고리별 배정은 §4.4
1. **Bold claim**: "This replaced my entire routine."
2. **Question**: "Ever wonder why your skincare isn't working?"
3. **Demonstration**: 즉각적 before/after 제시 (우리 L2 다이얼 전용)
4. **Relatability POV**: "POV: 3pm and you're already exhausted."

# PART 4 — HookForge 하우스 표준 (실측 캘리브레이션 — 우리만의 자산)

## 4.1 고정 세팅값 `[HF]` (Higgsfield 실검증)
| 항목 | 값 |
|---|---|
| model / mode | seedance_2_0 / std |
| resolution / duration / ratio | 1080p / 12s / 9:16 |
| audio | ON (네이티브 대사) |
| 비용 | 108cr/편 · 발사 전 get_cost 프리플라이트 필수 |
| declined_preset_id | 24bae836-2c4a-48e0-89b6-49fcc0b21612 |
| 제품 이미지 | nano_banana_pro ~2cr → job_id를 image_references로 재사용 |

## 4.2 Before/After 다이얼 `[HF]` (캡틴 캘리브레이션 2026-07-27)
| 레벨 | 체감 | 판정 |
|---|---|---|
| L1 (5~10%) | 안 보임 | ❌ 불합격 |
| **L2 (≈20%)** | 한눈에 "좋아졌네" + 여전히 진짜같음 | ✅ **표준** |
| L3 (35%+) | 위조 느낌 | ❌ 금지. 조명·색온도가 바뀌면 자동 L3 |

**L2 표준 문구(긍정문)**: "clearly brighter and noticeably more even — calm uniform tone, redness settled, a healthy hydrated sheen catching the light, fine pores and freckles still visible up close"

**L2 실측 목표** (qc_measure.py): 밝기 +8~15% · 톤 균일도 −20~28% · 홍조 편차 −15~37% · 결 −15~32% · **배경 ΔL≤3 & Δb≤2 (초과=조명 붕괴=즉시 불합격)**

> **측정법 v1.1 (2026-07-27 파일럿 bd9e9715 캘리브레이션)**: 배경 드리프트는 **안정측 상단 코너**(인물 반대편, 프레임 상단 10%×15%)에서 측정한다. 측면 스트립 측정은 인물이 leans closer 할 때 몸에 가려져 가짜 FAIL을 낸다 (파일럿에서 스트립 −24.5 vs 코너 +0.9로 판명). 구도 변화(창문 프레임아웃 등)는 색·그레이드가 안정이면 합격 — 실제 UGC의 day1/day14 클립도 구도가 다르다.

## 4.3 연속성 블록 `[HF]` (before/after형 필수, 긍정문)
```
Both shots share one identical setup: the same soft neutral window light from camera left,
the same white balance, the same camera distance and angle, the same background,
the same neutral color grade.
```
Shot 2 첫 문장에서 재고정: "the identical room, window light, framing and color grade."

## 4.4 카테고리 시스템 `[HF]` (사이트 다양성)
| 카테고리 | 가상 브랜드 | 제품 (재질 문구) | 허용 클레임 | 기본 훅유형 |
|---|---|---|---|---|
| 뷰티 | GLOWRA | frosted amber glass dropper bottle (레퍼런스 6616faa7) | 보습·톤·결 | Demonstration |
| 웰니스 | VITALEAF | amber glass jar of orange gummy vitamins | 루틴·맛·습관 | Relatability POV |
| 테크 | AERIS | matte white wireless earbuds in a pebble-shaped case | 사용감·페어링 | Bold claim |
| F&B | BREWLAB | slim matte black cold brew can, condensation droplets | 맛·리추얼 | Demonstration(첫모금) |
| 홈 | NESTA | compact cordless handheld vacuum, soft grey body | 사용 장면 자체 | Demonstration(새티스파잉) |
| 펫 | PAWSE | kraft pouch of dental chews for dogs | 기호성 | Relatability |
- 의학·치료 효능 단정 전 카테고리 금지. 가상 브랜드로만 데모 제작 (실제품은 고객 의뢰 시에만)

## 4.5 캐스팅 라이브러리 `[HF]` (외형 블록 고정)
| ID | 외형 블록 |
|---|---|
| A 주근깨 옆집 | a relatable American woman in her mid-20s, light freckles, loose messy bun, plain oatmeal sweatshirt |
| B 버즈컷 개성 | a stylish woman in her late 20s, short bleached buzzcut, small silver ear piercings, black tank top |
| C 한국계 미국인 | a Korean-American woman in her mid-20s, black shoulder-length hair tucked behind one ear, small gold huggie earrings, cream ribbed lounge top |
| D 테크가이 | an American man in his early 30s, short dark hair, light stubble, navy crewneck tee |
| E 웰니스맘 | an American woman in her early 40s, shoulder-length brown hair, soft cardigan over a white tee |
| F 피트니스 | an athletic American man in his mid-20s, short curly hair, grey hoodie |
| G 펫맘 | an American woman in her early 30s, dark ponytail, sage green sweatshirt, calm golden retriever beside her |

## 4.6 모션 5레이어 `[CP]` (인물샷마다 3개 이상)
face(small honest smile) / head(slight lean toward lens) / eye-gaze(steady eye contact) / hands(taps cheekbone once) / breath(natural shoulder rise)

## 4.7 대사 원칙 `[HF]` `[TT]`
- 8~14단어/줄, 첫 줄이 훅(3초 규칙), 진정성 라인 1개 필수
- 과장어 금지: insane, miracle, unbelievable, life-changing

## 4.8 QC 게이트 `[HF]` — 철칙
1. **템플릿에서만 시작** (PART 5) — 프리스타일 금지
2. **파일럿 1편 → 실측 → 통과 후 확장** — 배치 발사 금지
3. 발사 전 체크: 부정문 0 / 타임스탬프 0 / 금칙어 0 / 클레임 규정 / get_cost
4. 발사 후: `qc_measure.py` 실측 → §4.2 목표 대조 → 미달 시 **다이얼 문구만 조정** (전면 재작성 금지)
5. 실측 수치 없이 "완성" 보고 금지. 캡틴 컨펌 후에만 배포

# PART 5 — 표준 템플릿 (조립식)

## 5.1 UGC Before/After (다이얼형)
```
Vertical 9:16 selfie video, front phone camera held at arm's length, subtle organic handheld micro-motion, TikTok native style.
{캐스팅 블록 §4.5}, {환경 한 줄}.
{연속성 블록 §4.3}
Shot 1: {before 상태 — 관찰가능 묘사 + 텍스처 트리거}. She/He {모션 2개} and says: "{훅 대사}". White caption reads {LABEL1}.
Shot 2: the identical {환경 재고정}. {L2 다이얼 문구 §4.2}. {모션 2개}, and says: "{진정성 대사}". Caption reads {LABEL2}.
Natural conversational American English at normal speaking volume, quiet room tone. 12 seconds.
```

## 5.2 UGC 단일컷 (리뷰/언박싱/POV형)
```
Vertical 9:16 selfie video, front phone camera held at arm's length, subtle organic handheld micro-motion, TikTok native style.
{캐스팅 블록}, {환경 한 줄}, one soft neutral daylight source, consistent white balance throughout.
Shot 1: {훅 액션 + 제품 등장(레퍼런스 지칭) + 텍스처 트리거}. Says: "{훅 대사}".
Shot 2: {사용/데모 장면 — 물리 메커니즘 묘사}. Says: "{경험 대사}".
Shot 3: {반응/마무리 + CTA 한 줄}. Caption reads {LABEL}.
Natural conversational American English, {카테고리 SFX}. 12 seconds.
```

## 5.3 완성 예시 — 뷰티 L2 표준안 v2 (파일럿 대기)
```
Vertical 9:16 selfie video, front phone camera held at arm's length, subtle organic handheld micro-motion, TikTok native style. A relatable American woman in her mid-20s, light freckles, loose messy bun, plain oatmeal sweatshirt, sitting by a bright window in a lived-in bedroom. Both shots share one identical setup: the same soft neutral window light from camera left, the same white balance, the same camera distance and angle, the same background, the same neutral color grade. Shot 1: her skin shows dull, uneven tone on the cheeks with mild redness and rough texture, fine pores visible. She holds the amber glass serum bottle from the reference image beside her cheek, steady eye contact with the lens, and says: "Day one with this serum. Same window, same light, every time." White caption reads DAY 1. Shot 2: the identical room, window light, framing and color grade. Her skin is clearly brighter and noticeably more even — calm uniform tone, redness settled, a healthy hydrated sheen catching the window light, fine pores and freckles still visible up close. She leans slightly closer, taps her cheekbone once, small honest smile, and says: "Two weeks. Same light, zero filter — look at the difference." Caption reads DAY 14. Natural conversational American English at normal speaking volume, quiet room tone. 12 seconds.
```
파라미터: §4.1 고정값 + GLOWRA 레퍼런스(6616faa7) image_references

## 5.4 발사 전 최종 체크리스트
- [ ] §1.1 공식 6요소 순서 준수
- [ ] 샷리스트 문법 (감정·메타 지시 없음)
- [ ] Shot 번호 표기, 타임스탬프 없음
- [ ] 부정문 0개 (대사 제외) / 금칙어 미기재
- [ ] 텍스처 트리거 ≥1 / 모션 레이어 ≥3 / 오디오 형용사 포함
- [ ] 훅이 첫 대사 / 자막 캡션 지정 / 클레임 규정 통과
- [ ] get_cost 프리플라이트 → 발사 → qc_measure 실측 → 보고

# 부록 — 출처
- Google 공식: Ultimate prompting guide for Nano Banana (cloud.google.com/blog) · Nano Banana Pro prompt tips (blog.google)
- Seedance 2.0 생태계: WeShop AI "Master the Prompt Script" · Atlas Cloud "Best Seedance 2.0 Prompts" (공식 문법·@태그·멀티샷·오디오 규칙 상호 검증)
- TikTok: Creative Codes 프레임워크 (훅 3초·네이티브 스타일·사운드온) — Leapwave/MBADV/Stackmatix 정리본 교차 확인
- 캡틴 Seedance 프레임워크: 샷리스트 문법·긍정문 원칙·모션/조명 어휘 (사내 자산)
- HookForge 실측: 2026-07-27 캘리브레이션 6편 (qc_measure.py 데이터, send_log.md 제작 로그)

## 4.9 손 안무 규칙 (2026-07-27 캡틴 불합격 사례 반영)
- **금지**: 튜브 짜기→손가락에 덜기→펴바르기 같은 다단계 정밀 손동작 (손 뒤틀림 아티팩트 최고 위험)
- **표준**: 제품은 세워서 감싸쥐기(label facing lens) / 도포는 뺨에 2~3회 가볍게 탭 / 손 상태를 긍정문으로 고정: "hands stay relaxed and natural, fingers in ordinary resting positions"
- **QC 한계 명시**: 자동 QC(전사·조명·제품색)는 해부학 오류를 못 잡음 → 배포·발송 전 사람 눈 확인 1회 필수 (캡틴 or 향후 프레임 리뷰 수단 확보 시 나)

## 4.10 페이싱 규칙 (2026-07-27 캡틴 피드백: "제품 들고 있는 시간 너무 김 = 밸런스 파괴")
- **제품 정지 홀드는 훅에서 1비트만** ("a quick flash ... for one brief beat") 후 내려놓기
- **매 샷에 동작 동사 필수** — 정적 홀드로 샷을 채우지 않는다 (양치, 도포, 미스트, 사용 장면)
- 전체 페이싱 앵커: "brisk snappy pacing" (오프닝 문장에 삽입)

## 4.11 실제품 라벨 규칙 (2026-07-27 캡틴 검수: 3편 전멸 사유 — 라벨 오타)
- **원인**: 영상 모델은 레퍼런스 이미지의 라벨 텍스트를 "다시 그림" → 작은 글자 필연적 오타 (PURE→PUBE, RESCUE→RECUE 사례)
- **금지**: 라벨이 읽히는 거리·각도의 제품 노출 (클로즈업 절대 금지)
- **표준**: 제품은 ①팔길이 거리 ②라벨 사선/팜쪽 ③1비트 후 프레임아웃 ④fine print softly out of focus
- **클린 라벨 노출은 엔드카드로**: 실제 팩샷 이미지를 ffmpeg로 마지막 1.5s에 합성 (오타 원천 불가, 0cr)
- QC 추가: 완성본 프레임에서 제품 노출 면적 측정 — 라벨 가독 거리면 불합격
