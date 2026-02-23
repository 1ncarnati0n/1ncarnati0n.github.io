---
title: "Day 3-5: Ownership - 핵심 요약"
date: 2024-01-01
tags: []
draft: false
---


# Day 3-5: Ownership - 핵심 요약

## ✅ 학습 완료 항목
- [ ] "왜 Rust는 ownership이 필요한가?" 설명 가능
- [ ] Move 후 왜 사용할 수 없는지 이해
- [ ] 어떤 타입이 Copy인지 판단 가능
- [ ] Python의 reference counting과 차이점 설명 가능
- [ ] Stack vs Heap 메모리 모델 이해
- [ ] String의 내부 구조 이해
- [ ] 함수와 소유권 이동 패턴 이해

---

## 🎯 Ownership이란?

**Rust의 가장 독특하고 중요한 특징**

Rust는 **Garbage Collector 없이** 메모리 안전성을 보장합니다.  
그 비밀이 바로 **Ownership System**입니다.

### Ownership의 3가지 규칙

```rust
// 규칙 1: 각 값은 소유자(owner)가 있다
let s = String::from("hello");  // s가 "hello"의 소유자

// 규칙 2: 한 번에 하나의 소유자만 가능
let s1 = String::from("hello");
let s2 = s1;  // 소유권이 s2로 이동, s1은 무효화

// 규칙 3: 소유자가 scope를 벗어나면 값이 drop됨
{
    let s = String::from("hello");
}  // ← 여기서 s가 drop되고 메모리 해제
```

---

## 📊 Stack vs Heap 메모리 모델

### Stack (스택)
**특징:**
- 고정된 크기의 데이터 저장
- LIFO (Last In, First Out) - 마지막에 들어간 게 먼저 나옴
- 빠른 할당/해제
- 함수 호출 시 자동 관리

**저장되는 타입:**
```rust
let x: i32 = 5;        // 4바이트, 고정
let y: bool = true;    // 1바이트, 고정
let z: char = 'A';     // 4바이트, 고정
let t: (i32, i32) = (1, 2);  // 8바이트, 고정
```

**동작 방식:**
```rust
fn example() {
    let a = 1;  // Stack에 push
    let b = 2;  // Stack에 push
    let c = 3;  // Stack에 push
}  // c, b, a 순서로 pop (역순)
```

### Heap (힙)
**특징:**
- 가변 크기의 데이터 저장
- 자유로운 할당/해제
- Stack보다 느림
- 런타임에 크기가 결정되는 데이터

**저장되는 타입:**
```rust
let s: String = String::from("hello");  // 길이 가변
let v: Vec<i32> = vec![1, 2, 3];       // 크기 가변
let h: HashMap<K, V> = HashMap::new(); // 크기 가변
```

**동작 방식:**
- Heap에 메모리 할당 요청
- 운영체제가 적절한 공간 찾아서 할당
- Pointer를 반환 (Stack에 저장됨)

---

## 🔍 Copy vs Move: 핵심 차이

### Copy Trait (복사)

**어떤 타입들?**
- 모든 정수 타입: `i8`, `i16`, `i32`, `i64`, `i128`, `isize`, `u8`, `u16`, `u32`, `u64`, `u128`, `usize`
- 부동소수점: `f32`, `f64`
- 불리언: `bool`
- 문자: `char`
- 튜플 (Copy 타입만 포함하는 경우): `(i32, i32)`, `(bool, char)`

**동작:**
```rust
let x = 5;
let y = x;  // x가 복사됨

println!("x: {}, y: {}", x, y);  // ✅ 둘 다 사용 가능!
```

**왜 복사가 가능한가?**
- Stack에만 있는 데이터
- 크기가 작고 고정적
- 복사 비용이 저렴 (몇 바이트)
- Deep copy = Shallow copy (차이 없음)

### Move Semantics (이동)

**어떤 타입들?**
- `String`
- `Vec<T>`
- `HashMap<K, V>`
- 기타 Heap 데이터를 포함하는 타입

**동작:**
```rust
let s1 = String::from("hello");
let s2 = s1;  // s1의 소유권이 s2로 이동

println!("{}", s1);  // ❌ 컴파일 에러! s1은 무효화됨
println!("{}", s2);  // ✅ s2만 사용 가능
```

**왜 이동만 가능한가?**
- Heap에 있는 데이터
- 크기가 크고 가변적
- 전체 복사 비용이 비쌈
- Double free 문제 방지

---

## 🧩 String의 내부 구조

String이 메모리에서 어떻게 저장되는지 이해하는 것이 핵심입니다.

### String의 구성

```rust
let s = String::from("hello");
```

**메모리 레이아웃:**
```
Stack (s):              Heap:
┌───────────┐           ┌─────┐
│ ptr   ────┼──────────>│  h  │
│ len   = 5 │           │  e  │
│ cap   = 5 │           │  l  │
└───────────┘           │  l  │
                        │  o  │
                        └─────┘
```

**구성 요소:**
- `ptr` (pointer): Heap의 데이터를 가리키는 포인터
- `len` (length): 현재 사용 중인 바이트 수
- `cap` (capacity): 할당된 총 바이트 수

### 이동(Move)이 일어날 때

```rust
let s1 = String::from("hello");
let s2 = s1;
```

**이동 전:**
```
Stack:                  Heap:
s1: ptr ─────────────> "hello"
    len = 5
    cap = 5
```

**이동 후:**
```
Stack:                  Heap:
s1: ❌ 무효화           "hello"
s2: ptr ─────────────> (s2만 소유)
    len = 5
    cap = 5
```

**중요한 점:**
1. Stack의 메타데이터(ptr, len, cap)만 복사됨 (12바이트 정도)
2. Heap의 실제 데이터("hello")는 복사 안 됨
3. s1은 무효화되어 더 이상 사용 불가
4. s2만 소유권을 가짐

---

## ⚠️ Double Free 문제와 Rust의 해결책

### 문제 상황

만약 Rust가 소유권 이동을 하지 않는다면?

```rust
// 만약 이렇게 된다면? (실제로는 안 됨)
let s1 = String::from("hello");
let s2 = s1;  // 둘 다 같은 Heap 가리킴

// 함수 끝날 때:
// 1. s2가 drop → Heap의 "hello" 해제
// 2. s1이 drop → 이미 해제된 "hello" 다시 해제 시도!
//    → Double Free! 메모리 오류!
```

**Double Free의 위험:**
- 메모리 손상
- 보안 취약점
- 예측 불가능한 동작

### Rust의 해결책: Ownership 이동

```rust
let s1 = String::from("hello");
let s2 = s1;  // 소유권 이동 + s1 무효화

// 함수 끝날 때:
// s2만 drop → 안전하게 메모리 해제
// s1은 이미 무효화되어서 drop 시도 안 함
```

**장점:**
- 컴파일 시점에 안전성 보장
- 런타임 오버헤드 없음
- Garbage Collector 불필요

---

## 🔄 함수와 소유권 이동

### 함수 호출 시 소유권 이동

```rust
fn main() {
    let s = String::from("hello");  // s가 소유권 가짐
    
    takes_ownership(s);  // s의 소유권이 함수로 이동
    
    // println!("{}", s);  // ❌ 에러! s는 더 이상 유효하지 않음
}

fn takes_ownership(some_string: String) {  // some_string이 소유권 받음
    println!("{}", some_string);
}  // some_string이 drop됨, 메모리 해제
```

**소유권 흐름:**
1. `main`의 `s`가 소유권 가짐
2. 함수 호출 시 소유권이 `some_string`으로 이동
3. `main`의 `s`는 무효화
4. 함수 끝나면 `some_string`이 drop
5. `main`으로 돌아와도 `s`는 사용 불가

### 함수에서 소유권 반환

```rust
fn main() {
    let s1 = gives_ownership();  // 함수가 소유권 반환
    
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2);  // s2 이동 후 s3로 반환
    
    // s1, s3 사용 가능
    // s2는 사용 불가
}

fn gives_ownership() -> String {
    let some_string = String::from("yours");
    some_string  // 반환하면서 소유권도 이동
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string  // 받은 소유권을 다시 반환
}
```

### 문제점: 매번 소유권을 주고받기 번거로움!

```rust
fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)  // 소유권을 돌려주기 위해 튜플 반환
}

fn main() {
    let s1 = String::from("hello");
    let (s2, len) = calculate_length(s1);  // 복잡함!
}
```

**이 문제의 해결책 → References & Borrowing!** (다음 챕터)

---

## 🆚 Python vs Rust: 메모리 관리 비교

### Python의 방식
```python
s1 = "hello"
s2 = s1  # 둘 다 같은 객체를 참조

print(s1)  # ✅ 가능
print(s2)  # ✅ 가능

# Reference counting으로 메모리 관리
# s1, s2 둘 다 참조하므로 count = 2
# 둘 다 scope 벗어나야 메모리 해제
```

**특징:**
- Reference counting + Garbage Collector
- 런타임 오버헤드 있음
- 편리하지만 느릴 수 있음
- 메모리 해제 타이밍 예측 어려움

### Rust의 방식
```rust
let s1 = String::from("hello");
let s2 = s1;  // 소유권 이동, s1 무효화

// println!("{}", s1);  // ❌ 불가능
println!("{}", s2);     // ✅ 가능

// 컴파일 시점에 소유권 검사
// s2가 scope 벗어나면 즉시 메모리 해제
```

**특징:**
- Ownership system
- 컴파일 시점에 안전성 보장
- 런타임 오버헤드 없음
- 메모리 해제 타이밍 정확히 예측 가능
- 조금 불편하지만 안전하고 빠름

---

## 💡 핵심 통찰

### 1. Ownership = 컴파일 타임 메모리 관리

Rust는 프로그램 실행 전에 메모리 안전성을 보장합니다:
- GC 없이 메모리 안전성 ✅
- 런타임 오버헤드 없음 ✅
- 예측 가능한 성능 ✅

### 2. Trade-off: 안전성 vs 편의성

```
Python/JavaScript: 편의성 ↑, 런타임 비용 ↑
Rust: 학습 곡선 ↑, 컴파일 타임 검증 ↑, 런타임 성능 ↑
```

### 3. Stack vs Heap 이해가 핵심

```rust
// Stack: 고정 크기 → Copy
let x = 5;
let y = x;  // 빠른 복사

// Heap: 가변 크기 → Move
let s1 = String::from("hello");
let s2 = s1;  // 소유권 이동
```

### 4. 타입 시스템이 메모리 안전성 강제

컴파일러가 다음을 방지:
- Use after free
- Double free
- Dangling pointers
- Data races (다음 챕터에서 더 자세히)

---

## 🎯 실전 패턴

### 패턴 1: Clone으로 명시적 복사

```rust
let s1 = String::from("hello");
let s2 = s1.clone();  // 명시적으로 Heap 데이터 복사

println!("s1: {}, s2: {}", s1, s2);  // ✅ 둘 다 사용 가능
```

**주의:** 비용이 비쌈! 꼭 필요할 때만 사용

### 패턴 2: Copy 타입 활용

```rust
fn calculate(x: i32) -> i32 {
    x * 2
}

let num = 5;
let result = calculate(num);
println!("num: {}, result: {}", num, result);  // ✅ 둘 다 사용 가능
```

**이유:** i32는 Copy trait 구현

### 패턴 3: 소유권 반환 (임시 방법)

```rust
fn process(s: String) -> String {
    // 처리...
    s  // 소유권 다시 반환
}

let s1 = String::from("hello");
let s2 = process(s1);  // 소유권 받아서 다시 돌려받음
```

**문제:** 번거로움 → References로 해결! (다음 챕터)

---

## ❓ 발견한 문제

### 현재 상황의 불편함

```rust
fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)  // 값도 반환하고 소유권도 돌려줘야 함
}

fn main() {
    let s = String::from("hello");
    let (s, len) = calculate_length(s);  // 복잡함!
}
```

**문제점:**
- 함수에 값을 넘기면 소유권이 이동
- 다시 사용하려면 소유권을 반환받아야 함
- 매번 이렇게 하기엔 너무 번거로움

**필요한 것:**
> "소유권은 그대로 두고, 값만 빌려주는" 방법

**이것이 바로 References & Borrowing!** (다음 챕터의 주제)

---

## 📚 개념 정리표

| 개념 | 설명 | 예시 |
|------|------|------|
| **Owner** | 값의 소유자 | `let s = String::from("hello");` s가 owner |
| **Move** | 소유권 이동 | `let s2 = s1;` s1 → s2 |
| **Drop** | 메모리 해제 | scope 끝날 때 자동 |
| **Copy** | 값 복사 | `let y = x;` (x가 i32일 때) |
| **Clone** | 명시적 복사 | `let s2 = s1.clone();` |
| **Stack** | 고정 크기 메모리 | i32, bool, char 등 |
| **Heap** | 가변 크기 메모리 | String, Vec 등 |

---

## 🚀 다음 단계: References & Borrowing

**Day 6-8에서 배울 내용:**

```rust
// 소유권은 그대로, 참조만 전달!
fn calculate_length(s: &String) -> usize {  // &String = 참조
    s.len()
}

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);  // 빌려주기
    
    println!("{} has length {}", s, len);  // ✅ s 여전히 사용 가능!
}
```

**배울 것:**
- References (`&T`)
- Mutable references (`&mut T`)
- Borrowing rules
- Borrow checker
- Dangling references 방지

**기대 효과:**
소유권 시스템을 편하게 사용할 수 있게 됩니다!
