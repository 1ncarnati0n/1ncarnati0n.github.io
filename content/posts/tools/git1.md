---
title: git의 역사
date: 2024-01-01
tags: []
---
깃은 누가 만들었을까? 바로 [리누스 토발즈(Linus Torvalds)](https://ko.wikipedia.org/wiki/%EB%A6%AC%EB%88%84%EC%8A%A4_%ED%86%A0%EB%A5%B4%EB%B0%9C%EC%8A%A4)라는 사람이 만들었다.

리누스 토발즈는 리눅스(Linux)라고 하는 운영 체제를 만든 사람.

리누스 토발즈는 리눅스를 만든 이후에 BitKeeper라고 하는 툴(Tool)로 리눅스의 각 버전들(ver1, ver2, ver3 ...)을 관리하고 있었다.

그런데 리눅스 커뮤니티의 개발자 한 명이 BitKeeper의 내부 동작 원리를 분석하려고 했던 일을 계기로 리눅스 커뮤니티와 BitKeeper 측의 사이가 틀어지게 되었다. 이때문에 리눅스 커뮤니티 측에 대해서 BitKeeper는 유료화되었고, 리누스 토발즈는 BitKeeper를 대신할 다른 버전 관리 시스템을 찾아보기 시작했다. 하지만 자신의 마음에 드는 버전 관리 툴을 찾지 못했고, 그래서 리누스 토발즈는 본인이 직접 버전 관리 프로그램을 만들어버렸다. 이렇게 만들어진 버전 관리 프로그램이 바로 '깃'이다.

깃은 당시에 아래와 같은 목표를 갖고 설계 및 제작되었다.

- 빠른 속도
- 단순한 디자인
- 비선형적 개발 지원(수천 개의 브랜치를 병행할 수 있음)
- 완전 분산형 시스템
- 리눅스와 같은 거대한 프로젝트도 속도 저하의 문제없이 관리할 수 있는 시스템

깃은 버전 관리(Version Control), 협업(Cooperation)에 필요한 여러 요소들이 고려되었기 때문에, 사용성이 굉장히 좋은 프로그램이 될 수 있었다.

그럼 왜 깃(git)이라는 이름이 붙었을까? 리누스 토발즈가 깃을 맨 처음 만들었을 때 남겼던 기록을 보면 힌트를 얻을 수 있는데요. 그 기록은 아래 그림과 같다.

![git](https://bakey-api.codeit.kr/api/files/resource?root=static&seqId=2881&directory=8psmpwcl6-29-1.png&name=8psmpwcl6-29-1.png)

위 그림의 내용을 간단히 번역하면 다음과 같다.

"깃은 당신의 마음에 따라 그 어떤 것으로도 해석될 수 있습니다."

1. [유닉스 커맨드](https://www.codeit.kr/topics/practical-unix-commands)에서 사용되는 명령어 이름을 제외한 랜덤한 알파벳 3글자의 조합
    
2. 멍청하고 단순한(이런 특성을 지닌 아무 단어로 해석되어도 좋다는 의미)
    
3. global information tracker의 약자
    
4. goddamn idiotic truckload of sh*t 이라는 욕설의 약자
    

이렇게 깃이라는 이름은 처음 만들어질 때부터 다양한 의미로 해석될 가능성을 갖고 탄생했다. 뭔가 리누스 토발즈의 독특함이 느껴지는 부분. 이 기록을 직접 살펴볼수 있는 [이 링크](https://github.com/git/git/commit/e83c5163316f89bfbde7d9ab23ca2e25604af290)가 있다.