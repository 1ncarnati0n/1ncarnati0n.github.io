---
title: "객체지향 1 : 캡슐화"
tags: []
date: 2024-01-01
---
**파이썬 객체지향 프로그래밍의 캡슐화(Encapsulation)**

### 1. 캡슐화(Encapsulation)란?

**캡슐화** <sup>Encapsulation</sup> 는 객체지향 프로그래밍의 중요한 4대 기둥 개념 중 하나로, 
데이터(속성)와 그 데이터를 조작하는 메서드를 하나의 단위로 묶고, *객체의 내부 상태를 외부로부터 보호하는 메커니즘*이다. 이를 통해 코드의 **안정성**과 **유지보수성**을 높일 수 있다.

<br>

### 2. 캡슐화의 기본 개념

캡슐화는 두 가지 주요 측면을 갖습니다:

1. **데이터 은닉(Data Hiding)**: 객체의 내부 상태를 외부로부터 숨겨 직접적인 접근을 제한. <br>: ==접근제어자== <sup>Access Modifiers</sup> 를 사용하여 속성과 메서드의 접근 범위를 조절할 수 있음.
2. **인터페이스 제공**: 객체의 상태를 변경하거나 조회할 수 있는 정의된 메서드를 제공. <br>: ==Getter & Setter 메서드==를 사용하여 속성에 안전하게 접근하고 수정할 수 있음.

<br>

### 3. 파이썬에서 접근 제어

다른 객체지향 언어들과 달리, 파이썬은 엄격한 ==접근 제어자(private, protected, public)==를 제공하지 않느다. 대신 ==네이밍 컨벤션==을 통해 접근 수준을 나타낸다:

1. **공개 Public 속성**: 이름 앞에 아무 표시가 없음 (예: `attribute`)
2. **보호 Protected 속성**: 이름 앞에 언더스코어 하나 (예: `_attribute`)
3. **비공개 Private 속성**: 이름 앞에 언더스코어 두 개 (예: `__attribute`)

| 접근 제어자    | 기호      | 설명                            |
| --------- | ------- | ----------------------------- |
| public    | `변수명`   | 외부에서 자유롭게 접근 가능               |
| protected | `_변수명`  | 암묵적 약속: 하위 클래스에서만 접근 가능(강제 X) |
| private   | `__변수명` | 클래스 내부에서만 접근 가능(네임 맹글링)       |

이것은 단지 컨벤션일 뿐 엄격한 제한은 아니다. 파이썬 개발자들은 이 규칙을 존중하지만, 기술적으로는 모든 속성에 접근이 가능.

<br>

### 4. 캡슐화 예제 코드

```python
class Building:
    def __init__(self, name, floors, area):
        self.name = name           # 공개 속성
        self._floors = floors      # 보호 속성
        self.__area = area         # 비공개 속성
    
    # Getter 메서드 - 비공개 속성에 접근하는 방법
    def get_area(self):
        return self.__area
    
    # Setter 메서드 - 비공개 속성을 변경하는 방법
    def set_area(self, area):
        if area > 0:  # 유효성 검사
            self.__area = area
        else:
            print("건물 면적은 양수여야 합니다.")
    
    # 보호 속성을 사용하는 메서드
    def describe(self):
        return f"{self.name}은(는) {self._floors}층이고 \
        면적은 {self.__area}m²입니다."

```

- `name`은 공개 속성으로, 어디서나 직접 접근 가능.
- `_floors`는 보호 속성, 직접 접근은 가능하나 클래스 내부나 파생 클래스에서만 사용하도록 권장.
- `__area`는 비공개 속성, 클래스 외부에서 직접 접근할 수 없으며 내부적으로 이름이 변경됨
  (네임 맹글링).


### 5. 네임 맹글링
**Name Mangling** 파이썬에서 `__attribute`와 같은 이름을 가진 비공개 속성은 실제로 `_Classname__attribute`로 내부적으로 이름이 변경됨:

```python
building = Building("타워", 20, 5000)
# print(building.__area)  # 오류 발생: AttributeError
print(building._Building__area)  # 5000 - 이름 맹글링으로 접근 가능
```

<br>

### 6. 프로퍼티 사용하기

파이썬에서는 ==`@property` 데코레이터==를 사용하여 ==캡슐화==를 더 우아하게 구현할 수 있습니다:

```python
class Building:
    def __init__(self, name, floors, area):
        self.name = name
        self._floors = floors
        self.__area = area
    
    @property
    def area(self):
        """건물 면적을 반환합니다."""
        return self.__area
    
    @area.setter
    def area(self, value):
        """건물 면적을 설정합니다. 유효성 검사 포함."""
        if value > 0:
            self.__area = value
        else:
            raise ValueError("건물 면적은 양수여야 합니다.")
    
    @property
    def floors(self):
        """건물의 층 수를 반환합니다."""
        return self._floors
    
    @floors.setter
    def floors(self, value):
        """건물의 층 수를 설정합니다."""
        if value > 0:
            self._floors = value
        else:
            raise ValueError("층 수는 양수여야 합니다.")
```
- 이제 속성처럼 접근하면서도 메서드의 기능을 사용할 수 있다:
```python
building = Building("오피스타워", 15, 3500)
print(building.area)  # 3500 - 프로퍼티를 통한 접근
building.area = 4000  # 프로퍼티 setter 사용
# building.area = -1000  # ValueError 발생
```

<br>

### 7. **컴퓨테이셔널 디자인 예제**

Rhino/Grasshopper 환경에서 유용한 캡슐화 예제:
```python
class ParametricFacade:
    def __init__(self, base_surface, panel_count, panel_depth):
        self.base_surface = base_surface  # 공개 - 기본 표면
        self._panel_count = panel_count   # 보호 - 패널 개수
        self.__panel_depth = panel_depth  # 비공개 - 패널 깊이
        self.__panels = []                # 비공개 - 생성된 패널 목록
        self.__generate_panels()          # 패널 생성 초기화
    
    @property
    def panel_count(self):
        """패널 개수를 반환합니다."""
        return self._panel_count
    
    @panel_count.setter
    def panel_count(self, count):
        """패널 개수를 설정하고 패널을 재생성합니다."""
        if count > 0:
            self._panel_count = count
            self.__generate_panels()  # 패널 재생성
        else:
            raise ValueError("패널 개수는 양수여야 합니다.")
    
    @property
    def panel_depth(self):
        """패널 깊이를 반환합니다."""
        return self.__panel_depth
    
    @panel_depth.setter
    def panel_depth(self, depth):
        """패널 깊이를 설정하고 패널을 재생성합니다."""
        if 0.1 <= depth <= 2.0:  # 현실적인 범위 제한
            self.__panel_depth = depth
            self.__generate_panels()  # 패널 재생성
        else:
            raise ValueError("패널 깊이는 0.1에서 2.0 사이여야 합니다.")
    
    def __generate_panels(self):
        """패널을 생성하는 비공개 메서드."""
        self.__panels = []
        # 실제 구현에서는 Rhino 지오메트리 생성 코드가 여기에 위치
        # 예: 표면 분할, 패널 돌출 등
        for i in range(self._panel_count):
            # 간단한 예제를 위한 더미 패널 생성
            panel = f"Panel_{i}_depth_{self.__panel_depth}"
            self.__panels.append(panel)
    
    def get_panels(self):
        """생성된 패널의 복사본을 반환합니다."""
        return self.__panels.copy()  # 직접 수정 방지를 위한 복사본 반환
    
    def apply_pattern(self, pattern_func):
        """패널에 패턴을 적용합니다."""
        modified_panels = []
        for panel in self.__panels:
            # 패턴 함수 적용 (실제로는 지오메트리 변환)
            modified = pattern_func(panel)
            modified_panels.append(modified)
        return modified_panels
```
이 예제는 파라메트릭 파사드 디자인을 구현하는 클래스입니다:

1. **데이터 은닉**: `__panel_depth`와 `__panels`는 비공개로 유지되어 외부에서 직접 수정할 수 없습니다.
2. **유효성 검사**: setter 메서드에서 패널 깊이가 현실적인 범위 내에 있는지 확인합니다.
3. **내부 로직 캡슐화**: `__generate_panels()` 메서드는 비공개이며, 패널 생성 로직을 캡슐화합니다.
4. **통제된 접근**: `get_panels()` 메서드는 패널 목록의 복사본을 반환하여 원본 데이터를 보호합니다.

<br>

### 8. **캡슐화의 이점**

1. **데이터 보호**: 객체의 내부 상태가 잘못된 값으로 변경되는 것을 방지합니다.
2. **유지보수성**: 내부 구현을 변경해도 외부 인터페이스는 그대로 유지할 수 있습니다.
3. **추상화**: 사용자는 내부 구현을 알 필요 없이 제공된 인터페이스만 사용하면 됩니다.
4. **코드 안정성**: 객체의 내부 상태를 제어하여 예상치 못한 부작용을 방지합니다.

<br>

### 9. 컴퓨테이셔널 디자인에서 의미

건축 컴퓨테이셔널 디자인에서 캡슐화는 복잡한 지오메트리 생성 프로세스를 관리하거나, 여러 매개변수에 따라 변하는 디자인 시스템을 구축할 때 특히 유용하다. 이를 통해 설계자는 내부 구현 복잡성을 걱정하지 않고 고수준 매개변수에 집중할 수 있습니다.

캡슐화는 특히 Rhino/Grasshopper 환경에서 복잡한 파라메트릭 모델을 구현할 때, 매개변수 변경에 따른 일관된 업데이트와 유효성 검사를 보장하는 데 도움이 된다.

### 10. **정리**

- **public (`변수명`)**: 외부에서 접근 가능
- **protected (`_변수명`)**: 외부에서는 접근하지 않는 것이 좋음(약속)
- **private (`__변수명`)**: 외부에서 직접 접근 불가
- **Getter & Setter**를 사용하여 안전하게 데이터에 접근
- **`@property` 데코레이터**를 사용하면 더 직관적인 코드 작성 가능

