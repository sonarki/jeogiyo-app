# HookForge Production Bible v1.0
> 목적: 영상 품질에서 운빨 제거. 모든 데모·납품 영상은 이 문서의 고정 세팅 + 조립식 템플릿 + 다이얼로만 제작한다.
> 출처: 캡틴 Seedance 2.0 프레임워크(샷리스트 문법) + UGC 광고 크래프트 + 실측 QC 데이터(2026-07-27 캘리브레이션).
> 개정: 캡틴 승인으로만. 프리스타일 프롬프트 금지.

---

## 0. 철칙 (위반 시 발사 금지)

1. **템플릿에서만 시작** — §7 조립식 블록 외의 즉흥 프롬프트 금지
2. **배치 발사 금지** — 신규 패턴은 파일럿 1편 → 실측 QC(§8) 통과 → 그 다음 변형 확장
3. **부정문 금지** — "no filter, no glow" 류를 쓰는 순간 모델이 그걸 그린다. 원하는 상태만 긍정문으로 기술 (대사 안의 "zero filter"는 예외 — 말하는 내용이므로 허용)
4. **샷리스트 문법** — 카메라가 찍을 수 있는 것만 쓴다. 감정 설명·내러티브·메타 지시("CRITICAL RULE" 등) 금지
5. **가상 브랜드로만 데모 제작** — 실제 브랜드 제품은 고객 의뢰·허락 시에만 (무단 사용 = 남에게 피해)
6. **클레임 규정** — 의학적 효능 단정 금지. §6 카테고리별 허용 표현만
7. **실측 없이 "완성" 보고 금지** — QC 수치 없는 완성 선언은 거짓말로 간주

## 1. 고정 세팅값 (전 영상 공통, 변경은 캡틴 승인)

| 항목 | 값 |
|---|---|
| model | seedance_2_0 |
| resolution / mode | 1080p / std (프리뷰 실험만 480p) |
| duration / ratio | 12s / 9:16 |
| audio | ON (대사 네이티브 생성) |
| 카메라 | front phone camera, arm's length, subtle organic handheld micro-motion |
| 조명 | one soft neutral daylight source, 전 구간 단일 유지 |
| 비용 | 108cr/편 (1080p·12s·std 기준) |
| declined_preset_id | 24bae836-2c4a-48e0-89b6-49fcc0b21612 |

## 2. Before/After 다이얼 (캡틴 캘리브레이션 2026-07-27)

| 레벨 | 체감 개선 | 판정 | 프롬프트 문구 (긍정문만) |
|---|---|---|---|
| L1 subtle | 5~10% | ❌ 불합격 (안 보임) | ~~a touch more even~~ 사용 금지 |
| **L2 clear** | **≈20%** | ✅ **표준** | "clearly brighter and noticeably more even — calm uniform tone, redness settled, a healthy hydrated sheen catching the light, fine pores and freckles still visible up close" |
| L3 dramatic | 35%+ | ❌ 금지 (위조 느낌) | 조명·색온도가 바뀌는 순간 자동 L3 |

**L2 실측 목표치** (§8 스크립트 기준):
- 얼굴 밝기 L: **+8~12%**
- 톤 균일도 Lstd: **−20~28%**
- 홍조 편차 a_std: **−15~25%**
- 결 texture: **−15~25%**
- **배경 ΔL ≤ 3, 배경 색온도 Δb ≤ 2** (이 둘 깨지면 피부가 아니라 조명이 바뀐 것 → 즉시 불합격)

## 3. 연속성 블록 (before/after형 필수 삽입, 긍정문)

```
Both segments share one identical setup: the same soft neutral window light from camera left,
the same white balance, the same camera distance and angle, the same background,
the same neutral color grade.
```
- 금칙어(아예 언급 금지): filter, golden hour, glow effect, transformation, dramatic
- 세그먼트 2 첫 문장은 반드시 "the identical room, window light, framing and color grade"로 재고정

## 4. 캐스팅 라이브러리 (외형 문구 고정 — 복붙用)

| ID | 용도 | 고정 외형 블록 |
|---|---|---|
| A 주근깨 옆집 | 뷰티/웰니스 | a relatable American woman in her mid-20s, light freckles, loose messy bun, plain oatmeal sweatshirt |
| B 버즈컷 개성 | 뷰티/테크 | a stylish woman in her late 20s, short bleached buzzcut, small silver ear piercings, black tank top |
| C 한국계 미국인 | 뷰티/K-수출용 | a Korean-American woman in her mid-20s, black shoulder-length hair tucked behind one ear, small gold huggie earrings, cream ribbed lounge top |
| D 테크가이 | 테크/가젯 | an American man in his early 30s, short dark hair, light stubble, navy crewneck tee, casual home-office backdrop |
| E 웰니스맘 | 영양제/홈 | an American woman in her early 40s, shoulder-length brown hair, soft cardigan over a white tee, warm kitchen backdrop |
| F 피트니스 | F&B/피트니스 | an athletic American man in his mid-20s, short curly hair, grey hoodie, bright kitchen counter backdrop |
| G 펫맘 | 펫 | an American woman in her early 30s, dark ponytail, sage green sweatshirt, living-room sofa with a calm golden retriever beside her |

## 5. 모션 5레이어 (인물샷마다 최소 3개 레이어 지시)

1. **face** — small honest smile / raised eyebrow / relaxed jaw
2. **head** — slight lean toward lens / small head tilt
3. **eye-gaze** — steady eye contact with the lens / quick glance at product then back
4. **hands** — holds bottle beside cheek / taps cheekbone once / presses drop onto fingertips
5. **breath/body** — natural shoulder rise, breath-driven sway

## 6. 카테고리 시스템 (사이트 다양성 확보)

| 카테고리 | 가상 브랜드 | 제품 | 허용 클레임 | 훅 앵글 |
|---|---|---|---|---|
| 뷰티 | **GLOWRA** | 앰버 세럼 (기존 레퍼런스 6616faa7) | 보습·톤·결 (치료 표현 금지) | before/after L2, 루틴, 텍스처 ASMR |
| 웰니스 | **VITALEAF** | 구미 비타민 보틀 | 루틴·습관·맛 (효능 단정 금지) | "3pm 슬럼프" 공감, 습관 스택 |
| 테크 | **AERIS** | 무선 이어버드 (matte white) | 사용감·페어링·케이스 | 언박싱, 통근 POV, 사이즈 비교 |
| F&B | **BREWLAB** | 캔 콜드브루 | 맛·리추얼 (건강 클레임 금지) | 첫 모금 리액션, 데스크 셋업 |
| 홈 | **NESTA** | 무선 핸디 청소기 | 사용 장면 그 자체 | 새티스파잉 클린, 소파 틈새 |
| 펫 | **PAWSE** | 덴탈 츄 | 기호성 (건강 효능 금지) | 강아지 리액션, "우리 애가 골랐다" |

각 카테고리 제품 이미지는 nano_banana_pro로 1회 생성(~2cr) 후 reference로 재사용.

## 7. 표준 프롬프트 템플릿 (조립식 — 7요소 순서 고정)

```
[1 샷+카메라] Vertical 9:16 selfie video, front phone camera held at arm's length, subtle organic handheld micro-motion.
[2 캐스팅] {§4 외형 블록}, {환경 한 줄}.
[3 연속성/조명] {§3 블록 또는 단일컷이면: one soft neutral daylight source, consistent white balance throughout}.
[4 비트1] Segment 1 (0-5s): {관찰 가능한 상태·행동만}. She/He {§5 모션 2개} and says: "{대사}". White caption reads {LABEL}.
[5 컷] Hard cut.
[6 비트2] Segment 2 (5-12s): the identical {환경 재고정}. {다이얼 문구 §2}. {§5 모션 2개}, and says: "{진정성 대사}". Caption reads {LABEL2}.
[7 오디오/페이싱] Natural conversational American English, quiet room tone. 12 seconds.
```

**대사 원칙**: 8~14단어/줄, 진정성 라인 1개 필수 ("Same light, zero filter — look at the difference." / "Two weeks, that's it."), 과장어(insane, miracle, unbelievable) 금지.

### 완성 예시 — 뷰티 L2 표준안 (파일럿 대기)
```
Vertical 9:16 selfie video, front phone camera held at arm's length, subtle organic handheld micro-motion. A relatable American woman in her mid-20s, light freckles, loose messy bun, plain oatmeal sweatshirt, sitting by a bright window in a lived-in bedroom. Both segments share one identical setup: the same soft neutral window light from camera left, the same white balance, the same camera distance and angle, the same background, the same neutral color grade. Segment 1 (0-5s): her skin shows dull, uneven tone on the cheeks with mild redness and rough texture, fine pores visible. She holds the amber glass serum bottle from the reference image beside her cheek, steady eye contact with the lens, and says: "Day one with this serum. Same window, same light, every time." White caption reads DAY 1. Hard cut. Segment 2 (5-12s): the identical room, window light, framing and color grade. Her skin is clearly brighter and noticeably more even — calm uniform tone, redness settled, a healthy hydrated sheen catching the window light, fine pores and freckles still visible up close. She leans slightly closer, taps her cheekbone once, small honest smile, and says: "Two weeks. Same light, zero filter — look at the difference." Caption reads DAY 14 · same light. Natural conversational American English, quiet room tone. 12 seconds.
```
파라미터: seedance_2_0 · 1080p std · 12s · 9:16 · audio ON · GLOWRA 레퍼런스 포함

## 8. QC 게이트 (발사 전후)

**발사 전 체크**: 템플릿 준수 / 부정문 0개 / 금칙어 0개 / 대사 글자수 / 클레임 규정 / get_cost 프리플라이트
**발사 후 실측**: `hookforge/product/qc_measure.py`를 샌드박스에서 실행 (전/후 프레임 자동 추출 → 피부픽셀 L·Lstd·a_std·tex + 배경 드리프트) → §2 목표치 대조
**판정**: 배경 드리프트 초과 = 불합격(조명 붕괴) / 피부 델타 미달 = 다이얼 문구만 강화 후 재발사 (전면 재작성 금지) / 통과 = 캡틴 최종 컨펌 → 배포

## 9. 사이트 반영 기준 (기획 업그레이드)

- 데모 레일 → **카테고리 라벨 부착** (Beauty / Wellness / Tech / F&B / Home / Pet)
- 섹션 헤드라인: "One pipeline. Any product." — 다양성이 셀링 포인트
- 목표 라인업: 카테고리 6종 × 1편 + 뷰티 before/after 1편 = 7편
- QC 통과작만 게시. 구작 중 미달작은 레일에서 교체

## 10. 예산 계획 (2026-07-27 기준)

- 잔고 4,103cr / 바닥 2,000 불가침 → 가용 ~2,100
- 풀 라인업 신규 6편 = 648cr + 제품 이미지 5장 ≈ 10cr → 실행 후 잔고 ~3,445 (여유 충분)
- 순서: ① 뷰티 L2 파일럿(캡틴 게이트) → ② 웰니스 → ③ 테크 → ④ F&B → ⑤ 홈 → ⑥ 펫 (각 단계 QC 통과 후 다음)
