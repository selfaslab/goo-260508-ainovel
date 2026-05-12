# AI Graphic Novel Engine (MVP)

설정(장르·분위기·캐릭터 등)을 바탕으로 AI가 **Scene 단위 그래픽 노블 스토리**를 만들고, Scene마다 **텍스트 수정**과 **이미지 생성**을 할 수 있는 웹앱입니다.  
데이터는 브라우저 **LocalStorage**에 자동 저장됩니다.

## 필요 환경

- Node.js 18 이상 권장  
- npm

## 설치

```bash
npm install
```

## 환경 변수 (API 키) — 보안

**이 저장소에는 API 키가 포함되어 있지 않습니다.** 각자 [OpenAI](https://platform.openai.com/api-keys)에서 발급한 키만 사용하세요.

1. **`.env.example`** 을 복사해 **`.env.local`** 을 만듭니다.  
2. **`.env.local`** 에만 `OPENAI_API_KEY=` 뒤에 **본인 키**를 넣습니다.  
3. **`.env.local`·실제 키 문자열은 Git에 커밋하지 마세요.** (이미 `.gitignore` 처리)  
4. `VITE_` 접두사 env에 키를 넣지 마세요. (브라우저에 노출됨)  
5. 배포는 Vercel 등 **호스트 비밀 환경 변수**에만 키를 등록합니다.

자세한 보안 안내는 [SECURITY.md](./SECURITY.md)를 참고하세요.

```bash
copy .env.example .env.local
# macOS/Linux: cp .env.example .env.local
```

## 실행 방법

| 목적 | 명령 |
|------|------|
| **로컬 개발 (권장)** | **`npm run dev`** → `http://localhost:5173` — Vite가 **같은 포트에서 `/api/*` 를 처리**합니다 (`.env.local` 의 키 필요). |
| Vercel CLI로 통합 실행 | **`npm run dev:vercel`** 또는 `npx vercel dev` — 터미널에 안내된 주소로 접속 (포트가 5173이 아닐 수 있음). |

## 자주 묻는 오류: `요청 실패 (404)`

- **Scene 수정 API**에서 특정 번호의 Scene이 없으면 **404**와 함께 `해당 Scene을 찾을 수 없습니다.` 가 올 수 있습니다. (앱 라우트 문제가 아니라 **데이터** 문제입니다.)
- **잘못된 `/api/...` 경로**이면 404입니다.
- **입력이 비었다고 404가 나지는 않습니다.** 형식 오류는 보통 **400**, OpenAI 오류는 **500**에 가깝습니다.
- **`npm run preview`** 는 정적 프리뷰라 **로컬 `/api` 미들웨어가 없습니다.** API까지 보려면 Vercel에 배포하거나 `vercel dev` 를 사용하세요.

## 빌드

```bash
npm run build
npm run preview
```

## Vercel 배포 시

- Vercel 프로젝트 **Settings → Environment Variables** 에 **`OPENAI_API_KEY`** 를 등록합니다.  
- 저장소에 **`.env.local`** 이나 실제 키가 들어간 파일을 올리지 마세요 (`.gitignore` 에 포함됨).

## 라이선스 / 기여

GitHub 공개용으로 쓰기 좋게 구성했습니다. 저장소 정책에 맞게 라이선스만 추가해 주시면 됩니다.
