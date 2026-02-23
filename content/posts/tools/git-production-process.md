---
title: "로컬에 모든 브랜치 가져오기"
date: 2024-01-01
tags: []
draft: false
---


> [!quote]  brench 단계별 git 관리 프로세스
> **dev**  >>  **staging**  >>  **main** <sup>( Production ) </sup>

<br> 

### 초기 설정
```bash
# 로컬에 모든 브랜치 가져오기
git fetch --all

# 브랜치 확인
git branch -a
```

### 1. 새 기능 개발 시작
```bash
# dev 브랜치로 이동하여 최신 상태로 업데이트
git checkout dev
git pull origin dev

# feature 브랜치 생성 (naming: feature/기능명)
git checkout -b feature/gantt-chart-integration

# 작업 진행...
```

### 2. Dev 환경으로 배포
```bash
# 개발 완료 후 커밋
git add .
git commit -m "feat: Add gantt chart integration"

# dev 브랜치로 돌아가기
git checkout dev
git pull origin dev  # 최신 상태 확인

# feature 브랜치 merge (--no-ff로 merge 커밋 생성)
git merge --no-ff feature/gantt-chart-integration

# 충돌 발생 시 해결 후
git add .
git commit -m "Merge feature/gantt-chart-integration into dev"

# dev 브랜치에 push
git push origin dev

# Dev 환경 배포 확인 후 테스트
```

### 3. Staging 환경으로 승격
```bash
# dev에서 테스트 완료 후 staging으로 이동
git checkout staging
git pull origin staging  # 최신 상태 확인

# dev 브랜치를 staging으로 merge
git merge --no-ff dev

# 충돌 해결 (필요 시)
git add .
git commit -m "Merge dev into staging"

# staging에 push
git push origin staging

# Staging 환경에서 최종 QA 테스트 진행
```

### 4. Production 배포
```bash
# staging 테스트 완료 후 main으로 이동
git checkout main
git pull origin main  # 최신 상태 확인

# staging을 main으로 merge
git merge --no-ff staging

# main에 push
git push origin main

# Tag 생성 (버전 관리)
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 5. 정리 작업
```bash
# feature 브랜치 삭제 (선택사항)
git branch -d feature/gantt-chart-integration  # 로컬 삭제
git push origin --delete feature/gantt-chart-integration  # 원격 삭제
```

### 6. 긴급 수정 (Hotfix)
```bash
# main에서 hotfix 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 수정 작업...
git add .
git commit -m "hotfix: Fix critical bug"

# main에 적용
git checkout main
git merge --no-ff hotfix/critical-bug-fix
git push origin main
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin v1.0.1

# staging에도 반영
git checkout staging
git merge --no-ff main
git push origin staging

# dev에도 반영
git checkout dev
git merge --no-ff staging
git push origin dev

# hotfix 브랜치 삭제
git branch -d hotfix/critical-bug-fix
git push origin --delete hotfix/critical-bug-fix
```

### 7. 여러 기능을 동시에 개발할 때
```bash
# 개발자 A: feature-A 작업
git checkout dev
git checkout -b feature/user-authentication
# 작업...
git push origin feature/user-authentication

# 개발자 B: feature-B 작업
git checkout dev
git checkout -b feature/dashboard
# 작업...
git push origin feature/dashboard

# feature-A가 먼저 완료되면
git checkout dev
git merge --no-ff feature/user-authentication
git push origin dev
# dev 환경 테스트 후 staging으로 승격

# feature-B가 나중에 완료되면
git checkout dev
git pull origin dev  # feature-A 변경사항 포함
git merge --no-ff feature/dashboard
git push origin dev
```

### 8. Pull Request 사용 시 (GitHub/GitLab)
```bash
# feature 브랜치 push
git push origin feature/gantt-chart-integration

# GitHub/GitLab에서:
# 1. Pull Request 생성: feature/gantt-chart-integration → dev
# 2. 코드 리뷰
# 3. Approve 후 Merge

# PR merge 후 로컬 업데이트
git checkout dev
git pull origin dev
```

### Appendix: 유용한 명령어
```bash
# 현재 브랜치 상태 확인
git status

# 브랜치 간 차이 확인
git diff dev..staging

# 커밋 히스토리 확인
git log --oneline --graph --all

# 특정 파일만 staging에 추가
git add src/components/GanttChart.tsx

# 마지막 커밋 메시지 수정
git commit --amend

# 실수로 잘못된 브랜치에서 작업했을 때
git stash  # 변경사항 임시 저장
git checkout 올바른브랜치
git stash pop  # 변경사항 복원
```

### Appendix: 권장 Commit Message 컨벤션
```bash
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무, 패키지 매니저 설정 등

# 예시
git commit -m "feat: Add Gantt chart drag and drop functionality"
git commit -m "fix: Resolve date calculation error in WBS"
git commit -m "refactor: Optimize project data fetching logic"
```

이 프로세스를 따르면 각 환경에서 충분한 테스트를 거쳐 안전하게 프로덕션에 배포할 수 있습니다.