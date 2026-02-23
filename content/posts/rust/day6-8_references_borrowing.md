---
title: "Day 6-8: References & Borrowing 요약"
date: 2024-01-01
tags: []
draft: false
---

# Day 6-8: References & Borrowing 요약

## 🎯 핵심 개념

### 왜 필요한가?
Day 3-5에서 발견한 문제: 함수에 값을 넘기면 소유권이 이동 → 원래 변수 사용 불가
```rust
fn takes_ownership(s: String) { println!("{}", s); }

let s = String::from("hello");
takes_ownership(s);
// println!("{}", s);  // ❌ 소유권 이동됨!
```

**해결책:** 소유권을 넘기지 않고 **빌려주기(Borrowing)**

---

## 📌 두 종류의 참조

### 1. Immutable Reference (`&T`) — 읽기 전용
```rust
fn calculate_length(s: &String) -> usize {
    s.len()  // 읽기만 가능
}

let s = String::from("hello");
let len = calculate_length(&s);  // 빌려줌
println!("{}", s);               // ✅ 여전히 사용 가능
```

### 2. Mutable Reference (`&mut T`) — 수정 가능
```rust
fn change(some_string: &mut String) {
    some_string.push_str(", world");  // 수정 가능
}

let mut s = String::from("hello");  // 원본도 mut이어야 함!
change(&mut s);                      // mutable로 빌려줌
println!("{}", s);                   // "hello, world"
```

### Python과의 차이

| | Python | Rust `&T` | Rust `&mut T` |
|---|---|---|---|
| 읽기 | ✅ | ✅ | ✅ |
| 수정 | ✅ | ❌ | ✅ |

Python은 참조를 통해 마음대로 수정 가능하지만, Rust는 **명시적으로 `&mut`을 써야만** 수정 가능

---

## 📌 Borrowing 핵심 규칙 (2가지)

### 규칙 1: `&mut T`는 동시에 1개만
```rust
let mut s = String::from("hello");
let r1 = &mut s;
let r2 = &mut s;  // ❌ 두 번째 mutable 참조 불가!
println!("{}, {}", r1, r2);
```
**이유:** 두 곳에서 동시에 수정하면 데이터 충돌

### 규칙 2: `&T`와 `&mut T` 동시 사용 불가
```rust
let mut s = String::from("hello");
let r1 = &s;       // 📖 읽기
let r2 = &s;       // 📖 읽기
let r3 = &mut s;   // ❌ 읽는 중에 수정 불가!
println!("{}, {}, {}", r1, r2, r3);
```
**이유:** 읽는 중에 데이터가 변경되면 위험

### 예외: `&T` 여러 개는 OK
```rust
let s = String::from("hello");
let r1 = &s;  // ✅
let r2 = &s;  // ✅
let r3 = &s;  // ✅ 읽기끼리는 안전!
```

### 도서관 비유
- `&T` (읽기) = 여러 명이 동시에 책 읽기 → OK
- `&mut T` (수정) = 한 명만 펜으로 수정 가능 → 동시에 두 명 불가
- `&T` + `&mut T` = 읽는 중에 수정 → 읽던 내용이 바뀔 위험

---

## 📌 NLL (Non-Lexical Lifetimes)

Rust 컴파일러는 참조의 **마지막 사용 시점**을 기준으로 판단:

```rust
let mut s = String::from("hello");

let r1 = &s;                         // ── r1 시작
let r2 = &s;                         // ── r2 시작
println!("{}, {}", r1, r2);          // ── r1, r2 끝 (마지막 사용)

let r3 = &mut s;                     // ✅ r1, r2 이미 끝났으니 OK!
r3.push_str(", world");
println!("{}", r3);
```

**핵심:** 읽기가 끝난 후 수정하는 건 안전 → 컴파일러가 허용

---

## 📌 Dangling Reference 방지

```rust
// ❌ 함수 내부 변수의 참조를 반환 → s가 drop되면 무효!
fn dangle() -> &String {
    let s = String::from("hello");
    &s  // s가 함수 끝에서 사라짐 → 가리킬 대상 없음!
}

// ✅ 소유권 자체를 반환
fn no_dangle() -> String {
    let s = String::from("hello");
    s  // 소유권이 호출자에게 이동
}
```

C/C++에서는 dangling pointer가 런타임 버그로 이어지지만, Rust는 **컴파일 단계에서 차단**

---

## 📌 실전 패턴: 함수에서의 Borrowing

```rust
fn average(scores: &Vec<f64>) -> f64 {       // & → 읽기만
    let sum = scores.iter().sum::<f64>();
    sum / scores.len() as f64
}

fn highest(scores: &Vec<f64>) -> f64 {        // & → 읽기만
    *scores.iter()
        .max_by(|a, b| a.partial_cmp(b).unwrap())
        .unwrap()
}

fn add_score(scores: &mut Vec<f64>, score: f64) {  // &mut → 수정 필요
    scores.push(score);
}

fn main() {
    let mut scores = vec![85.0, 92.0, 78.0, 95.0, 88.0];
    
    println!("평균: {}", average(&scores));       // 읽기
    println!("최고: {}", highest(&scores));       // 읽기
    add_score(&mut scores, 100.0);                // 수정
    println!("추가 후 평균: {}", average(&scores)); // 다시 읽기
    println!("전체 점수: {:?}", scores);           // 소유권 유지됨!
}
```

**원칙:** 수정이 필요한 함수만 `&mut`, 나머지는 `&`로 **최소 권한** 부여

---

## 📊 전체 규칙 요약표

| 규칙 | 내용 | 이유 |
|------|------|------|
| `&T` 여러 개 | ✅ 동시 OK | 읽기끼리는 안전 |
| `&mut T` 1개만 | ❌ 동시에 2개 불가 | 동시 수정 → 충돌 방지 |
| `&T` + `&mut T` | ❌ 동시 불가 | 읽는 중 수정 → 데이터 깨짐 방지 |
| NLL | 마지막 사용 시점 기준 | 불필요한 제약 완화 |
| Dangling 금지 | 사라진 데이터 참조 불가 | 무효 메모리 접근 방지 |

---

## ✅ 마스터 체크리스트

- [x] "한 번에 하나의 mutable reference만" 규칙의 이유 설명
- [x] "mutable과 immutable reference 동시 사용 불가" 이유 설명
- [x] Dangling reference가 왜 위험한지, Rust는 어떻게 방지하는지
- [x] 컴파일 에러 메시지를 보고 borrowing 문제 파악 가능
- [x] Reference가 언제 "drop"되는지 이해 (NLL)

---

## 🔗 참고 자료
- [The Rust Book: Chapter 4.2 - References and Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)
- [Rustlings: references, borrowing 연습문제](https://github.com/rust-lang/rustlings)

---

## 🚀 다음 단계
**Day 9-10: Structs & Methods** — `&self`, `&mut self` 패턴으로 오늘 배운 borrowing을 구조체에 적용
