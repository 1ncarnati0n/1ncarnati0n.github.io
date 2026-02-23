---
title: "Day 9-10: Structs & Methods 정리"
date: 2024-01-01
tags: []
draft: false
---

# Day 9-10: Structs & Methods 정리

> **핵심 한줄**: Rust는 데이터(struct)와 동작(impl)을 분리하며, 메서드 시그니처만으로 읽기/수정/소비 의도가 드러난다.

---

## 🔑 핵심 개념

### 1. Python `class` vs Rust `struct` + `impl`

```python
# Python: 데이터 + 동작이 한 묶음
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def greet(self):
        return f"Hi, I'm {self.name}!"
```

```rust
// Rust: 데이터와 동작이 분리
struct User {
    name: String,
    age: u32,
}

impl User {
    fn greet(&self) -> String {
        format!("Hi, I'm {}!", self.name)
    }
}
```

### 2. `.` vs `::` — 인스턴스 vs 타입

| 문법 | 왼쪽에 오는 것 | 예시 |
|------|---------------|------|
| `.` | 인스턴스(값) | `user.greet()` |
| `::` | 타입/모듈 이름 | `User::new()`, `String::from()` |

구분 기준: **`self`가 있으면 method(`.`)**, **없으면 associated function(`::`)** 

```rust
impl User {
    fn new(name: String) -> Self { ... }    // self 없음 → User::new()
    fn greet(&self) -> String { ... }       // self 있음 → user.greet()
}
```

### 3. 메서드의 self 패턴 — 최소 권한 원칙

| 시그니처 | 의미 | 언제 쓰나 | Python 대응 |
|---------|------|----------|-------------|
| `&self` | 불변 빌림 (읽기) | 데이터를 읽기만 할 때 | `self` (항상 mutable) |
| `&mut self` | 가변 빌림 (수정) | 필드를 변경할 때 | `self` (구분 없음) |
| `self` | 소유권 가져감 | struct를 소비/변환할 때 | 없음 |

> Python은 `self`가 항상 하나지만, Rust는 **메서드 시그니처만 봐도 의도가 드러난다.**

---

## 📦 Struct의 3가지 종류

### Classic Struct — 이름 있는 필드
```rust
struct User {
    name: String,
    age: u32,
}
```

### Tuple Struct — 이름 없는 필드, 인덱스로 접근
```rust
struct Color(u8, u8, u8);
let red = Color(255, 0, 0);
println!("{}", red.0);  // 255
```
- **구조가 같아도 타입 이름이 다르면 다른 타입** (newtype 패턴의 기초)
- `Color(255, 0, 0)`과 `Pixel(255, 0, 0)`은 호환 불가

### Unit-like Struct — 필드 없음
```rust
struct Marker;
```
- 타입 자체만 의미가 있을 때 사용 (trait과 결합 시 활용)

---

## 🔄 Struct Update Syntax + 부분 이동

```rust
let user2 = User {
    email: String::from("new@example.com"),
    ..user1  // 나머지 필드를 user1에서 가져옴
};
```

**주의 — 부분 이동(partial move):**
- `age: u32` → Copy 타입 → `user1.age` 여전히 사용 가능 ✅
- `name: String` → 힙 타입 → 소유권 이동 → `user1.name` 사용 불가 ❌

---

## 🏷️ Derive 매크로

```rust
#[derive(Debug, Clone, PartialEq)]
struct Point { x: f64, y: f64 }
```

| Rust derive | Python 대응 | 기능 |
|-------------|-------------|------|
| `Debug` | `__repr__` | `{:?}` 디버그 출력 |
| `Clone` | `copy.deepcopy()` | `.clone()` 명시적 깊은 복사 |
| `PartialEq` | `__eq__` | `==` 비교 |

---

## ⚠️ 주의사항 (실습에서 배운 것)

### Copy 타입에 `.clone()` 불필요
```rust
// ❌ f64는 Copy 타입 — clone 불필요
let width = size.clone();

// ✅ 그냥 대입하면 자동 비트 복사
let width = size;
```

### 로컬 변수 참조 반환 불가 (dangling reference)
```rust
// ❌ max는 함수 끝나면 사라짐
fn highest(&self) -> Option<&f64> {
    let mut max = self.scores[0];
    Some(&max)  // dangling reference!
}

// ✅ 값을 반환 (f64는 Copy니까 비용 없음)
fn highest(&self) -> Option<f64> {
    let mut max = self.scores[0];
    Some(max)
}
```

### `println!` vs `format!`
```rust
println!("hello {}", name);   // 화면 출력, 반환값 ()
format!("hello {}", name);    // String 반환, 출력 안 함
```

### `if/else`에서 불필요한 bool 감싸기
```rust
// ❌ 불필요한 감싸기 (clippy가 잡아줌)
if a > b { true } else { false }

// ✅ 비교 연산 자체가 bool
a > b
```

---

## 💡 설계 팁: `self`를 소비하는 메서드

`self`(소유권 가져감)를 쓰는 메서드가 있을 때 해결 전략 3가지:

| 방법 | 장점 | 단점 |
|------|------|------|
| `&self` + `clone()` | 호출 후 struct 계속 사용 가능 | 복사 비용 |
| **호출 순서 변경** | 복사 비용 없음, 설계 의도 유지 | 코드 배치 제약 |
| 미리 `clone()` | 유연함 | 복사 비용 |

> `into_name(self)` 같은 소비 메서드는 **"이 struct의 역할이 끝났다"**는 의도적 설계. 호출 순서 변경이 보통 가장 Rust다운 해결법.

---

## 📝 종합 실습 코드: 학생 성적 관리 시스템

```rust
#[derive(Debug, Clone, PartialEq)]
struct Student {
    name: String,
    scores: Vec<f64>,
}

impl Student {
    fn new(name: String) -> Self {
        Student {
            name,
            scores: Vec::new(),
        }
    }

    fn add_score(&mut self, value: f64) {
        self.scores.push(value)
    }

    fn average(&self) -> f64 {
        if self.scores.is_empty() {
            0.0
        } else {
            self.scores.iter().sum::<f64>() / self.scores.len() as f64
        }
    }

    fn highest(&self) -> Option<f64> {
        if self.scores.is_empty() {
            return None;
        }
        let mut max = self.scores[0];
        for &score in &self.scores {
            if score > max {
                max = score;
            }
        }
        Some(max)
    }

    fn summary(&self) -> String {
        format!("{}: 평균 {:0.1}점", self.name, self.average())
    }
}
```

---

## 🔗 참고 자료
- [The Rust Book: Chapter 5 — Structs](https://doc.rust-lang.org/book/ch05-00-structs.html)
- [Rust by Example: Structs](https://doc.rust-lang.org/rust-by-example/custom_types/structs.html)
- [Rustlings: structs](https://github.com/rust-lang/rustlings)
