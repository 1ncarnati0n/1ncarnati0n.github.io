---
title: "3.POST PUT PATCH"
date: 2024-01-01
tags: []
draft: false
---

## POST, PUT, PATCH

POST, PUT, PATCH는 HTTP 리퀘스트에서 HTTP 메소드가 다른 것 이외의 기술적인 차이는 없습니다. 이 3가지를 구분 짓는 기준은 단순한 의미상(시멘틱, Semantic) 구분이며, 아래의 두 HTTP 스펙에 명시되어 있습니다.

해당 문서를 모두 읽어 볼 필요는 없는데요. 내용이 궁금하신 분들이라면 가볍게 살펴보셔도 좋습니다.

- [RFC 9110 - HTTP Semantics](https://datatracker.ietf.org/doc/html/rfc9110)
- [RFC 5789 - PATCH Method for HTTP](https://datatracker.ietf.org/doc/html/rfc5789)

단순 의미상 구분이기에 기술적으로는 POST 리퀘스트로 수정을 구현할 수 있고, PUT 리퀘스트로는 생성을 구현할 수 있다는 의미입니다.

하지만 일반적으로는 API를 디자인하거나 개발할 때 항상 그렇게 하지는 않습니다. 스펙에 명시된 대로, HTTP 메소드마다 정해진 의미대로 사용하는 것을 권장하기 때문이죠. 그렇기에 일반적으로 자원을 생성할 때는 POST, 자원을 수정할 때는 PUT과 PATCH를 사용합니다.

만드는 개발자, 사용하는 개발자 모두가 혼란 없이 정해진 약속과 규칙대로 사용하려면 만들 때 의미에 맞게 잘 지켜서 만들고 사용하는 것이 중요하겠죠?

## PUT vs PATCH

PUT과 PATCH 모두, 의미적으로 자원을 수정할 때 사용할 수 있는 HTTP 메소드입니다. 단, PUT은 자원의 교체(replace), PATCH는 부분 수정(partial update)을 의미한다는 차이가 있습니다. 예시를 통해서 자세히 살펴볼게요.

id가 1인 멤버가 다음과 같은 속성을 가지고 있다고 합시다.

`{     "username": "harry",     "age": 30 }`

이 멤버를 각각 PUT과 PATCH를 사용하여 수정해 보도록 하겠습니다.

### PUT

- 리퀘스트
    
    `PUT /members/1  {     "username": "mike" }`
    
- 리스폰스
    
    `200 OK  {     "username": "mike",     "age": null }`
    

id가 1인 멤버의 자원을 리퀘스트에 포함된 자원으로 **교체(replace)**하였기 때문에, 리퀘스트로 전달되지 않은 자원의 속성은 비어 있는 상태로 수정되며, 자원의 표현 시 `null`로 표시됩니다.

### PATCH

- 리퀘스트
    
    `PATCH /members/1  {     "username": "mike" }`
    
- 리스폰스
    
    `200 OK  {     "username": "mike",     "age": 30 }`
    

id가 1인 멤버의 자원을 리퀘스트에 포함된 자원으로 **부분 수정(partial update)**하였기 때문에, 리퀘스트로 전달된 자원의 속성만 반영됩니다.

이처럼 두 HTTP 메소드 모두 자원을 수정하는 데 사용할 수 있습니다. 하지만 목적이 다르기 때문에 서로 다르게 동작하며, 다르게 동작할 수 있도록 구현에 유의하여야 합니다. 웹 API 디자인 시에는 두 메소드 모두 구현하기도 하고, 상황에 따라 하나만 구현하는 경우도 있습니다.

이번 레슨은 어땠나요?