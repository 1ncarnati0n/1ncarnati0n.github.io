---
title: "3. VIM 사용법"
date: 2024-01-01
tags: []
draft: false
---

## vim 실행하기

`vim` 커맨드를 사용하면 됩니다.

`vim`

파일 경로를 아규먼트로 주면 해당하는 파일을 열거나, 존재하지 않으면 새로 만들어 줍니다.

`vim path/to/file`

## vim의 4 가지 사용 모드

vim에는 4가지 사용 모드가 있습니다:

- 일반 모드
- 입력 모드
- 비주얼 모드
- 명령 모드

각 모드에서는 아래와 같은 작업을 할 수 있습니다.

![](https://bakey-api.codeit.kr/api/files/resource?root=static&seqId=4911&directory=vim1.png&name=vim1.png)

그리고 아래와 같은 단축키를 이용해서 모드를 전환할 수 있습니다.

![](https://bakey-api.codeit.kr/api/files/resource?root=static&seqId=4911&directory=vim2.png&name=vim2.png)

## 단축키 정리

- 텍스트 입력: 입력 모드(`i`) → 텍스트 입력
- 텍스트 한 줄 복사: 일반 모드 → 복사하고 싶은 줄에 커서 위치 → `yy`
- 텍스트 한 줄 잘라내기: 일반 모드 → 잘라내고 싶은 줄에 커서 위치 → `dd`
- 특정 영역 복사: 비주얼 모드(`V`는 줄 단위, `v`는 글자 단위) → 복사하고 싶은 영역 커서로 설정 → `y`
- 특정 영역 잘라내기: 비주얼 모드(`V`는 줄 단위, `v`는 글자 단위) → 잘라내고 싶은 영역 커서로 설정 → `d`
- 텍스트 붙여넣기: 일반 모드 → 붙여넣고 싶은 위치에 커서 위치 → `p`
- 파일 저장: 명령 모드(:) → `w` + `enter`
- 파일 저장 + vim 종료: 명령 모드(:) → `wq` + `enter`
- vim 종료 (내용 저장되지 않음): 명령 모드(:) → `q!` + `enter`

