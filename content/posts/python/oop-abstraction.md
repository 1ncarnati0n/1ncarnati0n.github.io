---
title: "객체지향 2 : 추상화"
tags: []
date: 2024-01-01
---
**파이썬 객체지향 프로그래밍의 추상화(Abstraction)**

### 1. 추상화(Abstraction)란?

**추상화**<sup>Abstraction</sup>는 복잡한 시스템에서 불필요하거나 세부적인 구현 내용을 숨기고,
==외부에서 꼭 필요한 기능(인터페이스)만을 노출==하는 기법입니다. 
사용자는 내부 동작 방식을 몰라도 주어진 인터페이스를 통해 원하는 작업을 수행할 수 있습니다.

추상화의 핵심은 "무엇을 할 것인가"를 정의하고 "어떻게 할 것인가"의 세부 구현은 감추는 것입니다. 파이썬에서는 추상 클래스와 추상 메서드를 통해 이 개념을 구현합니다.

**목적 및 효과**
- **복잡성 감소**  <br>:복잡한 내부 구현을 감추어 코드의 사용과 이해를 쉽게 함.
- **일관된 인터페이스 제공** <br>:여러 객체가 동일한 메서드(인터페이스)를 제공하도록 강제하여, 객체간의 상호작용을 단순화.
- **유지보수성 향상** <br>:내부 구현이 변경되더라도 외부 인터페이스는 동일하게 유지되므로, 코드를 수정하거나 확장할 때 영향을 최소화.

<br>

### 2. 파이썬의 추상 클래스와 추상 메서드

파이썬에서는 `abc` 모듈(Abstract Base Classes)을 사용하여 추상화를 구현합니다. 이 모듈은 추상 클래스와 추상 메서드를 정의할 수 있게 해줍니다.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    """도형을 나타내는 추상 클래스"""
    
    @abstractmethod
    def calculate_area(self):
        """도형의 면적을 계산합니다."""
        pass
    
    @abstractmethod
    def calculate_perimeter(self):
        """도형의 둘레를 계산합니다."""
        pass
    
    def describe(self):
        """도형에 대한 설명을 반환합니다."""
        return f"이 도형의 면적은 {self.calculate_area()}, \
        둘레는 {self.calculate_perimeter()}입니다."
```
이 추상 클래스에서:
- `Shape`는 `ABC`를 상속받아 추상 클래스가 됩니다.
- `@abstractmethod` 데코레이터로 표시된 메서드는 반드시 자식 클래스에서 구현해야 합니다.
- `describe` 메서드는 추상 메서드가 아니므로 자식 클래스에서 구현하지 않아도 됩니다.


### 3. 추상 클래스 구현하기

추상 클래스를 상속받은 구체적인 클래스는 모든 추상 메서드를 구현해야 합니다:
```python
class Rectangle(Shape):
    """직사각형 클래스"""
    
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def calculate_area(self):
        """직사각형의 면적을 계산합니다."""
        return self.width * self.height
    
    def calculate_perimeter(self):
        """직사각형의 둘레를 계산합니다."""
        return 2 * (self.width + self.height)

class Circle(Shape):
    """원 클래스"""
    
    def __init__(self, radius):
        self.radius = radius
    
    def calculate_area(self):
        """원의 면적을 계산합니다."""
        import math
        return math.pi * self.radius ** 2
    
    def calculate_perimeter(self):
        """원의 둘레를 계산합니다."""
        import math
        return 2 * math.pi * self.radius
```
이제 이 클래스들을 사용할 수 있습니다:
```python
# 추상 클래스는 직접 인스턴스화할 수 없습니다
# shape = Shape()  # TypeError 발생

# 구현 클래스는 인스턴스화 가능합니다
rectangle = Rectangle(5, 4)
circle = Circle(3)

print(rectangle.describe()) # "이 도형의 면적은 20, 둘레는 18입니다."
print(circle.describe())    # "이 도형의 면적은 28.27.., 둘레는 18.85..입니다."
```

<br>

### 4. 추상화의 핵심 이점

1. **명확한 인터페이스 정의**: 추상 클래스는 구현 클래스가 따라야 할 계약(contract)을 정의합니다.
2. **코드 재사용성**: 공통 메서드를 추상 클래스에 구현할 수 있습니다.
3. **확장성**: 새로운 구현 클래스를 쉽게 추가할 수 있습니다.
4. **세부 구현 은닉**: 사용자는 구현 세부사항을 알 필요 없이 인터페이스만 알면 됩니다.

<br>

### 5. 컴퓨테이셔널 디자인, 추상화 예제

Rhino/Grasshopper 환경에서 유용한 패턴 생성 시스템 예 :
```python
from abc import ABC, abstractmethod
import math
import random  # 예제 목적으로 사용

class Pattern(ABC):
    """패턴 생성을 위한 추상 기본 클래스"""
    
    def __init__(self, base_geometry):
        """
        패턴의 기본 생성자
        
        매개변수:
            base_geometry: 패턴이 적용될 기본 지오메트리
        """
        self.base_geometry = base_geometry
        self.elements = []
    
    @abstractmethod
    def generate(self, density):
        """
        패턴을 생성합니다.
        
        매개변수:
            density: 패턴의 밀도
        """
        pass
    
    @abstractmethod
    def apply_transformation(self, transformation_matrix):
        """
        패턴에 변환을 적용합니다.
        
        매개변수:
            transformation_matrix: 적용할 변환 행렬
        """
        pass
    
    def export_to_rhino(self):
        """패턴 요소를 Rhino에 내보냅니다."""
        if not self.elements:
            raise ValueError("패턴이 먼저 생성되어야 합니다. generate() 메서드를 호출하세요.")
        
        # 여기서는 간단히 출력만 하지만, 실제로는 Rhino API를 호출할 것입니다
        print(f"{len(self.elements)}개의 패턴 요소를 Rhino로 내보냅니다.")
        return self.elements
    
    def __str__(self):
        """패턴에 대한 문자열 표현을 반환합니다."""
        return f"{self.__class__.__name__} 패턴 ({len(self.elements)}개 요소)"


class VoronoiPattern(Pattern):
    """보로노이 다이어그램 패턴 생성기"""
    
    def __init__(self, base_geometry, relaxation_factor=0.5):
        super().__init__(base_geometry)
        self.relaxation_factor = relaxation_factor
    
    def generate(self, density):
        """
        주어진 밀도로 보로노이 패턴을 생성합니다.
        
        실제 구현에서는 보로노이 알고리즘을 사용하여 패턴을 생성합니다.
        """
        print(f"밀도 {density}로 보로노이 패턴을 생성합니다.")
        # 예제를 위한 간단한 구현
        self.elements = [f"Voronoi_Cell_{i}" for i in range(int(density * 10))]
        
        # 릴랙세이션 적용
        if self.relaxation_factor > 0:
            print(f"릴랙세이션 인자 {self.relaxation_factor}를 적용합니다.")
        
        return self.elements
    
    def apply_transformation(self, transformation_matrix):
        """보로노이 셀에 변환을 적용합니다."""
        if not self.elements:
            raise ValueError("패턴이 먼저 생성되어야 합니다.")
        
        print(f"변환 행렬 {transformation_matrix}를 보로노이 패턴에 적용합니다.")
        # 실제 구현에서는 각 셀에 변환을 적용할 것입니다
        
        return self.elements


class GridPattern(Pattern):
    """규칙적인 그리드 패턴 생성기"""
    
    def __init__(self, base_geometry, is_rectangular=True):
        super().__init__(base_geometry)
        self.is_rectangular = is_rectangular
    
    def generate(self, density):
        """
        주어진 밀도로 그리드 패턴을 생성합니다.
        
        밀도가 그리드 셀의 수를 결정합니다.
        """
        grid_type = "직교" if self.is_rectangular else "삼각형"
        print(f"밀도 {density}로 {grid_type} 그리드 패턴을 생성합니다.")
        
        # 예제를 위한 간단한 구현
        cells_count = int(density * 20)
        self.elements = [f"Grid_Cell_{i}" for i in range(cells_count)]
        
        return self.elements
    
    def apply_transformation(self, transformation_matrix):
        """그리드 셀에 변환을 적용합니다."""
        if not self.elements:
            raise ValueError("패턴이 먼저 생성되어야 합니다.")
        
        print(f"변환 행렬 {transformation_matrix}를 그리드 패턴에 적용합니다.")
        # 실제 구현에서는 각 셀에 변환을 적용할 것입니다
        
        return self.elements
    
    def subdivide_cells(self, subdivision_factor):
        """그리드 셀을 세분화합니다 (그리드 패턴에만 있는 특수 메서드)."""
        if not self.elements:
            raise ValueError("패턴이 먼저 생성되어야 합니다.")
        
        print(f"그리드 셀을 인자 {subdivision_factor}로 세분화합니다.")
        # 실제 구현에서는 각 셀을 세분화할 것입니다
        
        new_elements = []
        for cell in self.elements:
            for i in range(int(subdivision_factor)):
                new_elements.append(f"{cell}_Sub_{i}")
        
        self.elements = new_elements
        return self.elements


class FacadeDesigner:
    """파사드 디자인 시스템"""
    
    def __init__(self, building_geometry):
        """
        파사드 디자이너 초기화
        
        매개변수:
            building_geometry: 건물 지오메트리
        """
        self.building_geometry = building_geometry
        self.pattern = None
    
    def set_pattern(self, pattern):
        """
        파사드에 사용할 패턴을 설정합니다.
        
        매개변수:
            pattern: Pattern 추상 클래스의 인스턴스
        """
        if not isinstance(pattern, Pattern):
            raise TypeError("패턴은 Pattern 클래스의 인스턴스여야 합니다.")
        
        self.pattern = pattern
    
    def design_facade(self, density=0.5, transformation=None):
        """
        설정된 패턴으로 파사드를 디자인합니다.
        
        매개변수:
            density: 패턴 밀도
            transformation: 선택적 변환 행렬
        """
        if self.pattern is None:
            raise ValueError("먼저 set_pattern()을 사용하여 패턴을 설정하세요.")
        
        # 패턴 생성
        elements = self.pattern.generate(density)
        
        # 변환 적용 (있는 경우)
        if transformation:
            elements = self.pattern.apply_transformation(transformation)
        
        print(f"파사드 디자인 완료: {self.pattern}")
        return elements
```
이제 이 시스템을 사용해 보는 Main 코드라인:
```python
# 가상의 건물 지오메트리 (실제로는 Rhino/Grasshopper 객체가 될 것입니다)
building_geometry = "Building_Surface"

# 파사드 디자이너 초기화
designer = FacadeDesigner(building_geometry)

# 보로노이 패턴 생성 및 적용
voronoi_pattern = VoronoiPattern(building_geometry, relaxation_factor=0.7)
designer.set_pattern(voronoi_pattern)
voronoi_facade = designer.design_facade(density=0.8, transformation=[1, 0, 0, 1])

print("\n다른 패턴으로 변경\n")

# 그리드 패턴으로 변경
grid_pattern = GridPattern(building_geometry, is_rectangular=False)
designer.set_pattern(grid_pattern)
grid_facade = designer.design_facade(density=0.6)

# 그리드 패턴의 특수 메서드 사용
grid_pattern.subdivide_cells(2.5)
```
실행 결과:
```
밀도 0.8로 보로노이 패턴을 생성합니다.
릴랙세이션 인자 0.7를 적용합니다.
변환 행렬 [1, 0, 0, 1]를 보로노이 패턴에 적용합니다.
파사드 디자인 완료: VoronoiPattern 패턴 (8개 요소)

다른 패턴으로 변경

밀도 0.6로 삼각형 그리드 패턴을 생성합니다.
파사드 디자인 완료: GridPattern 패턴 (12개 요소)
그리드 셀을 인자 2.5로 세분화합니다.
```

<br>

### 6. 추상화 응용: 강화학습에 적용

강화학습에 적용하는 환경시스템을 구축을 가정, 파라메트릭 디자인에 강화학습을 적용하는 예제:
```python
from abc import ABC, abstractmethod
import random

class RLEnvironment(ABC):
    """강화학습 환경을 위한 추상 클래스"""
    
    @abstractmethod
    def reset(self):
        """환경을 초기 상태로 재설정합니다."""
        pass
    
    @abstractmethod
    def step(self, action):
        """
        주어진 행동을 수행하고 다음 상태, 보상, 종료 여부를 반환합니다.
        
        args:
            action: 수행할 행동
            
        returns:
            (next_state, reward, done, info): 다음 상태, 보상, 종료 여부, 추가 정보
        """
        pass
    
    @abstractmethod
    def get_state(self):
        """현재 환경 상태를 반환합니다."""
        pass


class DesignOptimizationEnvironment(RLEnvironment):
    """디자인 최적화를 위한 강화학습 환경"""
    
    def __init__(self, design_parameters, constraints, objectives):
        """
        디자인 최적화 환경 초기화
        
        매개변수:
            design_parameters: 디자인 매개변수 및 범위의 딕셔너리
            constraints: 디자인 제약 조건의 목록
            objectives: 최적화 목표 함수의 목록
        """
        self.design_parameters = design_parameters
        self.constraints = constraints
        self.objectives = objectives
        self.current_design = None
        self.step_count = 0
        self.max_steps = 100
    
    def reset(self):
        """환경을 초기 상태로 재설정합니다."""
        # 초기 디자인 매개변수 무작위 설정
        self.current_design = {}
        for param, (min_val, max_val) in self.design_parameters.items():
            self.current_design[param] = random.uniform(min_val, max_val)
        
        self.step_count = 0
        return self.get_state()
    
    def step(self, action):
        """
        디자인 매개변수를 업데이트하고 결과를 평가합니다.
        
        매개변수:
            action: 디자인 매개변수에 적용할 변경 사항
        """
        # 매개변수 업데이트
        for param, change in action.items():
            if param in self.current_design:
                # 변경 적용
                new_value = self.current_design[param] + change
                
                # 매개변수 범위 내에서 유지
                min_val, max_val = self.design_parameters[param]
                self.current_design[param] = max(min_val, min(new_value, max_val))
        
        # 보상 계산
        reward = self._evaluate_design()
        
        # 단계 증가
        self.step_count += 1
        done = self.step_count >= self.max_steps
        
        # 다음 상태, 보상, 종료 여부, 추가 정보 반환
        return self.get_state(), reward, done, {"step": self.step_count}
    
    def get_state(self):
        """현재 디자인 상태를 반환합니다."""
        return self.current_design.copy()
    
    def _evaluate_design(self):
        """
        현재 디자인을 평가합니다.
        
        반환값:
            float: 디자인의 품질을 나타내는 보상
        """
        # 제약 조건 검사
        constraint_violations = 0
        for constraint in self.constraints:
            if not constraint(self.current_design):
                constraint_violations += 1
        
        # 목표 함수 평가
        objective_values = [objective(self.current_design) for objective in self.objectives]
        
        # 제약 조건 위반에 페널티 적용
        total_reward = sum(objective_values) - (constraint_violations * 10)
        
        return total_reward
```
이 강화학습 환경을 컴퓨테이셔널 디자인에 적용:
```python
# 파사드 디자인을 위한 RL 환경 설정
design_params = {
    'panel_width': (0.5, 2.0),
    'panel_height': (0.5, 3.0),
    'panel_depth': (0.05, 0.2),
    'panel_spacing': (0.1, 0.5),
    'pattern_density': (0.2, 0.8)
}

# 제약 조건 정의
def structural_constraint(design):
    """구조적 안정성을 확인합니다."""
    # 단순화된 예제: 패널 깊이가 너비/높이에 비해 너무 작지 않은지 확인
    min_depth_ratio = 0.05
    width_depth_ratio = design['panel_width'] / design['panel_depth']
    height_depth_ratio = design['panel_height'] / design['panel_depth']
    return (width_depth_ratio <= 1/min_depth_ratio and 
            height_depth_ratio <= 1/min_depth_ratio)

def fabrication_constraint(design):
    """제작 가능성을 확인합니다."""
    # 단순화된 예제: 패널 크기가 제작 한계 내에 있는지 확인
    return (design['panel_width'] <= 1.8 and 
            design['panel_height'] <= 2.5)

# 목표 함수 정의
def energy_efficiency(design):
    """에너지 효율성을 평가합니다."""
    # 단순화된 예제: 패널 간격과 밀도에 따른 점수
    return 5.0 - (design['panel_spacing'] * 3) + (design['pattern_density'] * 2)

def aesthetic_score(design):
    """미적 품질을 평가합니다."""
    # 단순화된 예제: 특정 비율에 가까울수록 높은 점수
    golden_ratio = 1.618
    width_height_ratio = design['panel_width'] / design['panel_height']
    ratio_diff = abs(width_height_ratio - golden_ratio)
    return 5.0 - (ratio_diff * 2)

# RL 환경 생성
facade_env = DesignOptimizationEnvironment(
    design_parameters=design_params,
    constraints=[structural_constraint, fabrication_constraint],
    objectives=[energy_efficiency, aesthetic_score]
)

# 간단한 강화학습 시뮬레이션
state = facade_env.reset()
print("초기 디자인 상태:", state)

# 몇 가지 무작위 행동 수행
for i in range(5):
    # 무작위 행동 생성 (실제로는 학습된 정책에서 행동 선택)
    action = {param: random.uniform(-0.1, 0.1) for param in state.keys()}
    next_state, reward, done, info = facade_env.step(action)
    
    print(f"\n단계 {info['step']}:")
    print(f"행동: {action}")
    print(f"새 상태: {next_state}")
    print(f"보상: {reward}")
    
    state = next_state
    if done:
        break
```

---
<br>

### 7. 추상화의 중요성

추상화는 복잡한 시스템을 설계할 때 특히 중요합니다. 컴퓨테이셔널 디자인과 같이 여러 매개변수와 알고리즘이 상호작용하는 분야에서는 추상화를 통해:

1. **코드 복잡성 관리**: 복잡한 시스템을 논리적인 계층으로 나누어 관리할 수 있습니다.
2. **확장성**: 새로운 패턴, 알고리즘, 최적화 기법을 기존 시스템에 쉽게 통합할 수 있습니다.
3. **재사용성**: 추상화된 컴포넌트는 다양한 프로젝트에서 재사용할 수 있습니다.
4. **유지보수성**: 구현 세부사항을 변경해도 인터페이스가 동일하면 시스템의 나머지 부분은 영향을 받지 않습니다.
5. **협업**: 팀 구성원들이 인터페이스에 대한 이해만으로도 함께 작업할 수 있습니다.

컴퓨테이셔널 디자인에서는 디자인 요소, 생성 알고리즘, 최적화 기법, 분석 도구 등을 추상화하여 모듈화된 시스템을 구축할 수 있습니다. 이는 복잡한 파라메트릭 모델을 더 쉽게 개발하고 유지관리할 수 있게 해줍니다.


<br>

### 8. 캡슐화(Encapsulation)와의 관계

**캡슐화 개념**
- **캡슐화**는 객체 내부의 데이터를 보호하기 위해 외부에서 직접 접근하지 못하도록 하고, 메서드를 통해 간접적으로 조작하게 만드는 기법.
- 예로, `private` 속성이나 **protected** 메서드를 사용하여 내부 상태를 숨기고 안전하게 다룰 수 있다.


**추상화와 캡슐화의 상호보완적 역할**
- **추상화**는 =="무엇을 할 수 있는가"==에 초점을 맞춰 ==기능의 인터페이스를 정의==합니다.
- **캡슐화**는 =="어떻게 동작하는가"==를 ==숨기며, 내부 데이터를 보호하고 관리==합니다.





