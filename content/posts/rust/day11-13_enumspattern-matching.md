---
title: "Day 11-13: Enums & Pattern Matching 정리"
date: 2024-01-01
tags: []
draft: false
---

# Day 11-13: Enums & Pattern Matching 정리

> **핵심 한줄**: Rust enum은 "여러 가능성 중 하나"를 타입으로 표현하고, match는 모든 경우를 빠짐없이 처리하도록 강제한다.

---

## 🔑 핵심 개념

### 1. Enum — 여러 가능성을 하나의 타입으로

Python에서는 상태를 문자열이나 상수로 표현하지만 오타 위험이 있다.
Rust enum은 가능한 값을 **컴파일 타임에 확정**한다.

```rust
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

let light = TrafficLight::Red;  // :: 로 접근 (타입::variant)
```

### 2. Enum Variant의 3가지 형태

struct의 3종류와 대응:

```rust
enum Command {
    Quit,                          // Unit — 데이터 없음
    Echo(String),                  // Tuple — 이름 없는 데이터
    Move { x: i32, y: i32 },      // Struct — 이름 있는 데이터
}
```

### 3. 데이터를 담는 Enum — Python/TS에 없는 핵심 기능

```rust
enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}
```

- 각 variant가 **다른 형태의 데이터**를 가질 수 있다
- 하나의 타입으로 `Vec<Shape>`에 이종 데이터를 담을 수 있다
- Python class 상속이나 TS union type보다 간결하고 안전

---

## 🔍 Pattern Matching

### match — 모든 경우를 처리해야 함 (exhaustiveness)

```rust
match light {
    TrafficLight::Red => println!("멈춤"),
    TrafficLight::Yellow => println!("주의"),
    TrafficLight::Green => println!("출발"),
    // variant를 빠뜨리면 컴파일 에러!
}
```

> variant를 추가하면 처리 안 한 곳을 **컴파일러가 전부 찾아준다.**
> 대규모 코드베이스에서 상태 추가 시 실수를 원천 차단.

### match에서 데이터 꺼내기 (destructuring)

```rust
match shape {
    Shape::Circle(radius) => println!("반지름: {}", radius),
    Shape::Rectangle(w, h) => println!("{}x{}", w, h),
}
```

### 와일드카드, 범위, OR 매칭

```rust
match score {
    90..=100 => "A",         // 범위 (양쪽 포함)
    0 | 1 | 2 => "거의 포기", // OR: 여러 값
    _ => "F",                // 나머지 전부
}
```

### Guard 조건

```rust
match cmd {
    Command::Wait(sec) if *sec < 5 => println!("{}초 대기", sec),
    Command::Wait(_) => println!("너무 오래 기다림"),
}
```

같은 variant를 **여러 arm으로 나눠서** 각각 다른 조건을 붙일 수 있다.

### Tuple & Struct 분해

```rust
// tuple
match (x, y) {
    (0, 0) => println!("원점"),
    (x, 0) => println!("x축 위: {}", x),
    (x, y) => println!("({}, {})", x, y),
}

// struct
match point {
    Point { x: 0, y } => println!("y축 위: y={}", y),
    Point { x, y } => println!("({}, {})", x, y),
}
```

---

## 📦 가장 많이 쓰는 Enum 2가지

### `Option<T>` — "값이 있거나 없거나" (Rust의 null 대체)


```rust
// 표준 라이브러리에 정의
enum Option<T> {
    Some(T),  // 값이 있다
    None,     // 값이 없다
}
```

**왜 null보다 나은가:**
- `None`일 수 있는 값은 **반드시 처리해야** 컴파일됨
- Python처럼 None 체크를 깜빡할 수 없음

값 꺼내는 3가지 방법:


```rust
// 1. match — 가장 명시적
match result {
    Some(v) => println!("{}", v),
    None => println!("없음"),
}


// 2. if let — 한 가지 경우만 관심 있을 때
if let Some(v) = result {
    println!("{}", v);
}

// 3. unwrap_or — 기본값 제공
let v = result.unwrap_or(0.0);
```

**⚠️ `unwrap()` 주의:**
```rust
result.unwrap()  // None이면 panic! (프로그램 즉시 종료)
```
Python의 "일단 돌려보자" 습관으로 남발하면 Rust의 안전성을 스스로 버리는 것.

### Result<T, E> — "성공이거나 실패거나"

```rust
// 표준 라이브러리에 정의
enum Result<T, E> {
    Ok(T),   // 성공 + 결과값
    Err(E),  // 실패 + 에러 정보
}
```

```rust
let good: Result<f64, _> = "42.5".parse::<f64>();  // Ok(42.5)
let bad: Result<f64, _> = "hello".parse::<f64>();   // Err(...)

match good {
    Ok(n) => println!("숫자: {}", n),
    Err(e) => println!("에러: {}", e),
}
```

### Option vs Result 비교

| | Option<T> | Result<T, E> |
|---|-----------|-------------|
| 경우 1 | `Some(T)` — 값 있음 | `Ok(T)` — 성공 |
| 경우 2 | `None` — 값 없음 | `Err(E)` — 실패 + 이유 |
| 용도 | "없을 수 있다" | "실패할 수 있고, 이유가 중요" |
| 예시 | 리스트 검색 | 파일 읽기, 파싱 |

> 둘 다 **"이것 아니면 저것"** 이라는 동일한 이진 구조.
> 차이는 실패 쪽에 정보가 있느냐 없느냐뿐.

상호 변환 가능:
- `Option` → `Result`: `.ok_or("에러 메시지")`
- `Result` → `Option`: `.ok()`

---

## 🔧 문자열 파싱 패턴

```rust
let input = "add Kim 95.5";

// 1. 공백 분리
let parts: Vec<&str> = input.split_whitespace().collect();
// ["add", "Kim", "95.5"]

// 2. &str → String 변환
let name: String = parts[1].to_string();

// 3. &str → 숫자 변환 (Result 반환)
let score: Result<f64, _> = parts[2].parse::<f64>();

// 4. 슬라이스 패턴 매칭
match parts.as_slice() {
    ["add", name, score] => println!("추가: {} {}", name, score),
    ["remove", name] => println!("제거: {}", name),
    _ => println!("모름"),
}
```

Python 대응:

| Python | Rust | 설명 |
|--------|------|------|
| `input.split()` | `input.split_whitespace()` | 공백 분리 |
| `parts[1]` | `parts[1]` | 인덱스 접근 |
| 그냥 사용 | `parts[1].to_string()` | 소유권 있는 String 변환 |
| `float("95.5")` | `"95.5".parse::<f64>()` | 숫자 변환 (Result 반환) |

---

## 🔗 Python/TS 비교 종합

| Python/TS | Rust | 차이 |
|-----------|------|------|
| `None` 체크 깜빡 가능 | `Option<T>` — 처리 강제 | 컴파일 타임 안전성 |
| `try/except` | `Result<T, E>` | 에러가 타입에 인코딩 |
| `if/elif/else` | `match` — exhaustiveness | 빠뜨리면 컴파일 에러 |
| TS `union type` (데이터 못 담음) | `enum` (데이터 포함) | 훨씬 강력 |
| Python `Enum` (이름만) | Rust `enum` (ADT) | 데이터 포함 가능 |
| Python `match` (3.10+) | Rust `match` | exhaustiveness 보장 |

---

## 🔗 참고 자료
- [The Rust Book: Chapter 6 — Enums](https://doc.rust-lang.org/book/ch06-00-enums.html)
- [The Rust Book: Chapter 18 — Patterns](https://doc.rust-lang.org/book/ch18-00-patterns.html)
- [Rust by Example: Enums](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html)
- [Rustlings: enums, options](https://github.com/rust-lang/rustlings)
