---
title: "2. Enum, Interface"
date: 2024-01-01
tags: []
draft: false
---

## **Enum**

중괄호 안에서 각 항목을 쉼표로 구분해서 적어주면 됩니다. 이때 기본값은 0부터 시작하는 정수라는 점에 주의하세요.

```tsx
enum Size {
  S,
  M,
  L,
  XL,
}
console.log(Size.S); // 0
console.log(Size.M); // 1
console.log(Size.L); // 2
```

숫자 0은 실수하기 쉽기 때문에 Enum을 사용할 땐 되도록이면 값을 정해놓고 쓰는 게 좋습니다. 이퀄이랑 쉼표를 쓰면 값을 정할 수 있습니다.

```tsx
enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}
```


<br>

## **Interface**

interface를 사용하는 방법은 `interface`를 쓴 다음, 객체 타입처럼 만들면 됩니다.

```tsx
enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

interface Product {
  id: string;
  name: string;
  price: number;
  membersOnly?: boolean;
}
```

Interface를 상속하고 싶으면 Interface 이름 뒤에 `extends`를 적은 다음 부모 Interface 이름을 적어주면 됩니다.

```tsx
interface ClothingProduct extends Product {
  sizes: Size[];
}

const product1: ClothingProduct = {
  id: 'c001',
  name: '코드잇 블랙 후드 집업',
  price: 129000,
  membersOnly: true,
  sizes: [Size.M, Size.L],
};

const product2: Product = {
  id: 'd001',
```