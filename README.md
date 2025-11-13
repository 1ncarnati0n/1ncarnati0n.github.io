# 1ncarnati0n Portfolio

Next.js, React, Tailwind CSS로 구축된 포트폴리오 웹사이트입니다.

## 기술 스택

- **Next.js 16.0.1** - React 프레임워크
- **React 19.2.0** - UI 라이브러리
- **Tailwind CSS 4** - 스타일링
- **TypeScript** - 타입 안정성

## 프로젝트 구조

```
1ncarnati0n.github.io/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 루트 레이아웃
│   │   ├── page.tsx         # 메인 페이지
│   │   └── globals.css      # 전역 스타일
│   ├── components/
│   │   ├── Header.tsx       # 헤더 컴포넌트
│   │   ├── Footer.tsx       # 푸터 컴포넌트
│   │   └── ProjectGallery.tsx # 프로젝트 갤러리 컴포넌트
│   └── types/
│       └── project.ts       # TypeScript 타입 정의
├── public/
│   └── thumbs/              # 프로젝트 이미지
├── mock.json                # 프로젝트 데이터
└── package.json
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 데이터 관리

프로젝트 데이터는 `mock.json` 파일에서 관리됩니다. 새로운 프로젝트를 추가하거나 기존 프로젝트를 수정하려면 `mock.json` 파일을 편집하세요.

### mock.json 구조

```json
{
  "projects": [
    {
      "id": "unique-id",
      "image": "thumbs/image.jpg",
      "title": "프로젝트 제목",
      "width": 500,
      "category": "professional" | "academic",
      "link": "https://optional-link.com" // 선택사항
    }
  ],
  "navigation": {
    "title": "1ncarnati0n",
    "links": [...]
  },
  "footer": {
    "text": "copyright text"
  }
}
```

## 주요 기능

- ✅ 반응형 디자인
- ✅ 이미지 호버 효과
- ✅ 부드러운 스크롤
- ✅ 프로젝트 갤러리
- ✅ 섹션별 분류 (Professional / Academic)

## 배포

GitHub Pages에 배포하려면:

1. `next.config.ts`에 `output: 'export'` 추가
2. `npm run build` 실행
3. `out` 폴더의 내용을 GitHub Pages에 배포

