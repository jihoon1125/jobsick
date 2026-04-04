# Jobsick

AI 기반 채용공고 분석 서비스.

채용공고 URL 또는 텍스트를 입력하면 이력서와 매칭 분석, 회사 평판, 연봉 적합도를 종합 분석해줍니다.

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local

# 개발 서버 실행
npm run dev
```

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + DB)
- Claude API
- Playwright (크롤링)

## 라이선스

MIT
