---
title: "Day 1-2: Setup & Basic Syntax - 핵심 요약"
date: 2024-01-01
tags: []
draft: false
---

# Day 1-2: Setup & Basic Syntax - 핵심 요약

## ✅ 학습 완료 항목
- [ ] Cargo로 새 프로젝트 만들고 실행 가능
- [ ] `let` vs `let mut`를 언제 쓰는지 안다
- [ ] Shadowing이 왜 유용한지 설명 가능
- [ ] 함수 정의와 호출 자유롭게 가능
- [ ] 타입 변환 (`as` 키워드) 이해

---

## 🔑 핵심 개념

### 1. Variables & Mutability

**기본은 Immutable**
```rust
let x = 5;
x = 6;  // ❌ 에러! 기본 변수는 불변
```

**Mutable 선언**
```rust
let mut x = 5;
x = 6;  // ✅ OK! mut로 선언하면 값 변경 가능
```

**핵심:** 
- `mut` → 값(value)만 변경 가능, 타입(type)은 고정
- Rust는 기본적으로 모든 변수가 immutable
- Python/TS와의 주요 차이점

---

### 2. Shadowing

**새 변수 생성**
```rust
let x = 5;
let x = x + 1;      // ✅ 새 변수, 값 변경 가능
let x = "hello";    // ✅ 새 변수, 타입도 변경 가능!
```

**mut vs Shadowing**

| 특징 | `mut` | Shadowing |
| ----------- | ----------- | ----------- |
| 값 변경 | ✅ | ✅ |
| 타입 변경 | ❌ | ✅ |
| 실제로 | 같은 변수 수정 | 새 변수 생성 |

**사용 예시:**
```rust
// 데이터 변환 시 shadowing 유용
let spaces = "   ";           // &str
let spaces = spaces.len();    // usize
```

---

### 3. 기본 타입 (Scalar Types)

**정수 (Integers)**
- Signed: `i8`, `i16`, `i32`, `i64`, `i128`, `isize`
- Unsigned: `u8`, `u16`, `u32`, `u64`, `u128`, `usize`
- **기본값: `i32`**

**부동소수점 (Floating Point)**
- `f32`, `f64`
- **기본값: `f64`**

**불리언 & 문자**
- `bool` → `true` 또는 `false`
- `char` → 유니코드 문자 (4바이트)

**메모리 효율성:**
```rust
let small: u8 = 255;        // 0-255, 1바이트
let big: i64 = 9999999;     // 큰 범위, 8바이트
```

**Python과의 차이:**
- Rust: 타입별로 메모리 크기 고정 (시스템 프로그래밍)
- Python: `int`는 무한정 확장 가능 (편리함 우선)

---

### 4. 함수 (Functions)

**기본 문법**
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // expression, 반환값
}
```

**핵심 포인트:**
- 매개변수 타입 **필수**
- 반환 타입: `->` 로 명시
- 생략하면 `-> ()` (unit type, void와 유사)

---

### 5. Expression vs Statement ⭐️

**가장 독특한 특징!**

**Expression (표현식)**
- 값을 **생성**함
- 세미콜론 **없음**
- 마지막 expression = 자동 반환값

```rust
fn calculate(x: i32) -> i32 {
    x * 2 + 10  // ← expression, 반환됨
}
```

**Statement (문장)**
- 값을 생성 안 함
- 세미콜론 **있음**
- 실행만 하고 끝

```rust
fn example() -> i32 {
    let y = 5;      // statement
    let z = y * 2;  // statement
    z               // expression, 이게 반환값
}
```

**비교:**
```rust
// ✅ 이것들은 같음
fn add1(a: i32, b: i32) -> i32 { a + b }
fn add2(a: i32, b: i32) -> i32 { return a + b; }

// ❌ 세미콜론 주의!
fn wrong(a: i32, b: i32) -> i32 { 
    a + b;  // statement가 됨, 값 반환 안 함!
}
```

---

### 6. 타입 변환 (Type Casting)

**`as` 키워드**
```rust
let x: i64 = 100;
let y: f64 = x as f64;  // 명시적 변환
```

**정수 나눗셈 주의!**
```rust
// ❌ 틀린 예: 정수 계산 후 변환
let wrong = (10 / 3) as f64;  // 3.0

// ✅ 올바른 예: 변환 후 계산
let correct = (10 as f64) / 3.0;  // 3.333...
```

**실전 예시:**
```rust
fn celsius_to_fahrenheit(c: i64) -> f64 {
    (c as f64) * 9.0 / 5.0 + 32.0
}
```

---

## 💡 중요한 통찰들

### 1. Rust는 왜 기본을 Immutable로?
- **안정성**: 의도치 않은 변경 방지
- **동시성**: 멀티스레드에서 안전
- **명시성**: `mut`로 변경 의도를 명확히
- **컴파일러 최적화**: 불변 데이터는 최적화하기 쉬움

### 2. 정적 타이핑의 이점
- 컴파일 시점에 타입 에러 발견
- 런타임 오버헤드 없음
- 명시적 타입 변환으로 의도 명확히

### 3. Expression 기반 언어
- 모든 것이 값을 가질 수 있음
- `if`, `match` 등도 expression
- 더 간결하고 함수형 스타일

---

## 🛠️ 실습 프로젝트: 온도 변환기

**완성 코드:**
```rust
fn celsius_to_fahrenheit(c: i64) -> f64 {
    (c as f64) * 9.0 / 5.0 + 32.0
}

fn fahrenheit_to_celsius(f: i64) -> f64 {
    ((f - 32) as f64) * 5.0 / 9.0
}

fn main() {
    println!("37°C = {:.2}°F", celsius_to_fahrenheit(37));
    println!("100°F = {:.2}°C", fahrenheit_to_celsius(100));
}
```

**배운 것:**
- 타입 변환의 중요성
- 정수 나눗셈 vs 부동소수점 나눗셈
- 출력 포맷팅 (`{:.2}`)

---

## 📊 Python/TypeScript와 비교

| 특징     | Rust          | Python      | TypeScript  |
| ------ | ------------- | ----------- | ----------- |
| 변수 기본  | Immutable     | Mutable     | Mutable     |
| 타입 시스템 | 정적, 강타입       | 동적          | 정적 (컴파일 시)  |
| 타입 추론  | ✅             | ✅           | ✅           |
| 타입 변환  | 명시적 (`as`)    | 암묵적         | 암묵적         |
| 반환값    | Expression    | `return` 필요 | `return` 필요 |
| 정수 타입  | 세분화 (i8~i128) | 단일 `int`    | `number`    |

---

## 🎯 다음 단계: Day 3-5 Ownership

**준비할 마음가짐:**
- Ownership은 Rust의 **핵심**이자 **가장 독특한** 개념
- 처음엔 어렵지만, 이해하면 Rust의 강력함을 알게 됨
- Memory safety without garbage collection!

**미리 생각해볼 질문:**
- Python/JavaScript에서 변수를 복사하면 무슨 일이 일어날까?
- 메모리는 언제 해제될까?
- 두 변수가 같은 데이터를 가리킬 때 문제가 생길 수 있을까?
