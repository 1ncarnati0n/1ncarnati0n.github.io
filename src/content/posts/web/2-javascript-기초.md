---
title: "2. JavaScript 기초"
date: 2024-01-01
tags: []
draft: false
---

## **자바스크립트 코드 실행하기**

자바스크립트를 실행하려면 HTML 파일(`.html`)과 자바스크립트 파일(`.js`)이 필요합니다. 자바스크립트 파일에는 자바스크립트 코드를 **작성**하고, HTML 파일에서 자바스크립트 코드를 **불러**옵니다.

main.js
```jsx
console.log('Hello World!');
```

index.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>JavaScript 연습</title>
</head>
<body>
  <script src="main.js"></script>
</body>
</html>
```

이번 토픽은 HTML을 배우는 과정은 아니기 때문에 HTML 코드를 깊게 이해하실 필요는 없는데요. 혹시 HTML에 대해 더 알고 싶으시다면 [[HTML／CSS로 웹사이트 만들기]](https://www.codeit.kr/paths/skill/web-publishing)도 한번 들어 보세요!

코드를 실행하려면 브라우저에서 HTML 파일을 열고(윈도우: `Ctrl` + `O`, 맥: `Cmd` + `O`) 개발자 도구의 Console 탭을 확인하면 됩니다.


## **기본 문법**

```jsx
/*
미술관 티켓 가격을 계산해 주는 함수
standard, student는 카테고리에 해당하는 티켓 개수를 뜻합니다.
*/
function ticketPrice(standard, student) {
  let standardPrice = 15000;
  let studentPrice = 8000;

  let totalPrice = standard * standardPrice + student * studentPrice;

  return totalPrice;
}

// 테스트 코드
console.log(ticketPrice(3, 0));
console.log(ticketPrice(2, 2));

```

```

45000
46000

```

| |**문법**|
|---|---|
|**문 구분**|**`;` 사용**|
|**함수, 변수 이름**|**카멜 케이스 사용**|
|**변수 선언**|**`let`**|
|**함수 선언**|**`function { ... }`**|
|**리턴 문**|**`return`**|
|**사칙연산**|**`+`, `-`, `*`, `/` (파이썬과 동일)**|
|**한 줄 코멘트**|**`//`**|
|**여러 줄 코멘트**|**`/* … */`**|

## **기본 자료형**

자바스크립트에는 총 5가지 기본 자료형이 있습니다.

|**자료형**|**설명**|**예시**|
|---|---|---|
|**숫자형**|**정수와 소수**|**`1`, `-2`, `3.832`**|
|**문자열**|**글자**|**`'JavaScript'`, `'*%&^$'`, `''`**|
|**불린형**|**참과 거짓 둘 중 하나의 값을 가짐**|**`true`, `false`**|
|**null**|**값이 없다는 것을 의도적으로 표현**|**`null`**|
|**undefined**|**코드를 실행했는데 (변수에) 값이 없을 경우**|**`undefined`**|

### **연산**

숫자형, 문자열, 불린형은 다양한 연산을 지원하는데요. 자세한 내용은 [기본 자료형 노트](https://www.codeit.kr/learn/5455)를 참고하세요.

### **형 변환**

한 자료형을 다른 자료형으로 변환할 수도 있습니다.

| |**문법**|
|---|---|
|**숫자로 변환**|**`Number()`**|
|**문자열로 변환**|**`String()`**|
|**불린으로 변환**|**`Boolean()`**|

```jsx

let x = '3';
let y = '1';
console.log(x + y); // '31'
console.log(Number(x) + Number(y)); // 4

let z = 20;
let w = 5;
console.log(z + w); // 25
console.log(String(z) + String(w)); // '205'

console.log(Boolean(0)); // false
console.log(Boolean('Hello'); // true

```

불린형으로 변환했을 때 `true`가 되는 값을 truthy하다고 하고, `false`가 되는 값을 falsy 하다고 하는데요. 어떤 값이 truthy 하고 어떤 값이 falsy 한지 이해하고 있는 것도 중요합니다.

|**truthy한 값**|**falsy한 값**|
|---|---|
|**`true`**|**`false`**|
|**`0`을 제외한 모든 숫자 (음수, 소수 포함)**|**`0`**|
|**`''`을 제외한 모든 문자열 (공백으로만 이루어져 있는 문자열 포함)**|**`''`**|
|**-**|**`null`**|
|**-**|**`undefined`**|

### **`null` vs `undefined`**

```jsx
let codeit;
console.log(codeit); // undefined

codeit = null;
console.log(codeit); // null
```

- `null`: 사용자가 값이 없다는 걸 의도적으로 표기할 때 사용
- `undefined`: 사용자가 값이 없다는 걸 표기하기보다, 코드를 실행했는데 값이 없을 경우 사용됨

변수에 `undefined`를 할당해도 오류가 나지는 않는데요.

```jsx

let codeit = undefined;
console.log(codeit); // undefined

```

변수에 아무 값도 할당하지 않으면 어차피 `undefined`가 되기 때문에 이건 불필요한 코드고, 별로 좋지 않은 코딩 스타일입니다. 변수는 값이 없다는 걸 의도적으로 표현하기 위해서는 `undefined` 대신 `null`을 사용해 주세요.