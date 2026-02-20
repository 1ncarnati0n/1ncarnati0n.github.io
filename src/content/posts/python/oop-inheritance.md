---
title: "객체지향 3 : 상속"
tags: []
date: 2024-01-01
---
**파이썬 객체지향 프로그래밍 상속**<sup>Inheritance</sup>

상속은 객체지향 프로그래밍의 4대기둥 중 하나로, 기존 클래스의 속성과 메서드를 새로운 클래스가 재사용할 수 있게 하는 메커니즘입니다. 상속을 통해 코드 재사용성을 높이고, 계층적인 관계를 만들며, 공통된 특성을 효율적으로 관리할 수 있습니다.

### 1. 상속의 기본 개념

상속에서는 기존 클래스(부모 클래스 또는 기본 클래스)의 특성을 새로운 클래스(자식 클래스 또는 파생 클래스)가 물려받습니다. 자식 클래스는 부모 클래스의 모든 속성과 메서드를 상속받으며, 추가적인 속성과 메서드를 정의하거나 부모의 메서드를 재정의할 수 있습니다.

**기본 상속 구문**
```python
class 부모클래스:
    # 부모 클래스 코드

class 자식클래스(부모클래스):
    # 자식 클래스 코드
```

**간단한 상속 예제**
```python
class GeometricObject:
    """기하학적 객체의 기본 클래스"""
    
    def __init__(self, color="white", filled=True):
        self.color = color
        self.filled = filled
    
    def get_color(self):
        return self.color
    
    def set_color(self, color):
        self.color = color
    
    def is_filled(self):
        return self.filled
    
    def set_filled(self, filled):
        self.filled = filled
    
    def __str__(self):
        return f"색상: {self.color}, \
        채우기: {'예' if self.filled else '아니오'}"


class Circle(GeometricObject):
    """GeometricObject를 상속받는 원 클래스"""
    
    def __init__(self, radius=1.0, color="white", filled=True):
        # 부모 클래스의 생성자 호출
        super().__init__(color, filled)
        self.radius = radius
    
    def get_radius(self):
        return self.radius
    
    def set_radius(self, radius):
        self.radius = radius
    
    def get_area(self):
        import math
        return math.pi * self.radius ** 2
    
    def get_perimeter(self):
        import math
        return 2 * math.pi * self.radius
    
    def __str__(self):
        return f"반지름: {self.radius}, {super().__str__()}"


# 클래스 사용 예
circle = Circle(5.0, "빨간색", False)
print(circle)   # 반지름: 5.0, 색상: 빨간색, 채우기: 아니오
print(f"면적: {circle.get_area():.2f}")       # 면적: 78.54
print(f"둘레: {circle.get_perimeter():.2f}")  # 둘레: 31.42
```

이 예제에서 `Circle` 클래스는 `GeometricObject` 클래스를 상속받았습니다. 
따라서 `Circle`은 부모 클래스의 모든 메서드(`get_color`, `set_color` 등)를 사용할 수 있으며, 
고유한 메서드(`get_radius`, `get_area` 등)도 정의합니다.

<br>

### 2. 상속의 종류

**단일 상속**<sup>Single Inheritance</sup>
한 클래스가 하나의 부모 클래스만 상속받는 형태입니다.
```python
class Parent:
    def method_parent(self):
        print("부모 클래스 메서드")

class Child(Parent):
    def method_child(self):
        print("자식 클래스 메서드")

# 사용 예
child = Child()
child.method_parent()  # 부모 클래스 메서드
child.method_child()   # 자식 클래스 메서드
```


**다중 상속**<sup>Multiple Inheritance</sup>
파이썬은 한 클래스가 여러 부모 클래스를 상속받을 수 있는 다중 상속을 지원합니다.
```python
class Material:
    def __init__(self, material_type="일반"):
        self.material_type = material_type
    
    def get_material_info(self):
        return f"재질: {self.material_type}"

class GeometricObject:
    def __init__(self, color="white"):
        self.color = color
    
    def get_color(self):
        return self.color

class Sculpture(Material, GeometricObject):
    def __init__(self, name, material_type="돌", color="회색"):
        # 여러 부모 클래스의 생성자 명시적 호출
        Material.__init__(self, material_type)
        GeometricObject.__init__(self, color)
        self.name = name
    
    def get_info(self):
        return f"조각품: {self.name}, {self.get_material_info()}, 색상: {self.get_color()}"

# 사용 예
sculpture = Sculpture("사상가")
print(sculpture.get_info())  # 조각품: 사상가, 재질: 돌, 색상: 회색

```
다중 상속은 강력하지만, 다이아몬드 문제와 같은 복잡성을 초래할 수 있으므로 신중하게 사용해야 합니다.


**다단계 상속**<sup>Multilevel Inheritance</sup>
자식 클래스가 또 다른 클래스의 부모 클래스가 되는 상속 체인입니다.
```python
class Grandparent:
    def method_grandparent(self):
        print("조부모 클래스 메서드")

class Parent(Grandparent):
    def method_parent(self):
        print("부모 클래스 메서드")

class Child(Parent):
    def method_child(self):
        print("자식 클래스 메서드")

# 사용 예
child = Child()
child.method_grandparent()  # 조부모 클래스 메서드
child.method_parent()       # 부모 클래스 메서드
child.method_child()        # 자식 클래스 메서드
```

<br>

### 3. 메서드 오버라이딩 
**Method Overriding**
자식 클래스에서 부모 클래스의 메서드를 같은 이름으로 재정의하는 것을 메서드 오버라이딩이라고 합니다.
```python
class Shape:
    def __init__(self, name):
        self.name = name
    
    def area(self):
        """면적을 계산합니다."""
        return 0
    
    def describe(self):
        return f"이것은 {self.name}입니다."

class Rectangle(Shape):
    def __init__(self, width, height):
        super().__init__("직사각형")
        self.width = width
        self.height = height
    
    # 부모 클래스의 area 메서드 오버라이딩
    def area(self):
        return self.width * self.height
    
    # 부모 클래스의 describe 메서드 오버라이딩
    def describe(self):
        # super()를 사용하여 부모 클래스의 메서드를 호출
        parent_description = super().describe()
        return f"{parent_description} 너비는 {self.width}, 높이는 {self.height}입니다."

# 사용 예
rect = Rectangle(5, 4)
print(rect.area())      # 20
print(rect.describe())  # 이것은 직사각형입니다. 너비는 5, 높이는 4입니다.

```

**super() 함수**
`super()` 함수는 부모 클래스의 메서드를 호출할 때 사용합니다. 이는 메서드 오버라이딩을 할 때 부모 클래스의 기능을 확장하는 데 유용합니다.


<br>

### 4. 메서드 해결 순서 
**Method Resolution Order, MRO**
파이썬은 다중 상속에서 메서드를 찾을 때 메서드 해결 순서(MRO)를 사용합니다. MRO는 C3 선형화 알고리즘을 기반으로 하며, 클래스의 `__mro__` 속성이나 `mro()` 메서드를 통해 확인할 수 있습니다.
```python
class A:
    def method(self):
        return "A의 메서드"

class B(A):
    def method(self):
        return "B의 메서드"

class C(A):
    def method(self):
        return "C의 메서드"

class D(B, C):
    pass

# 사용 예
d = D()
print(d.method()) # B의 메서드
print(D.__mro__)  # (<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)
```
MRO는 왼쪽에서 오른쪽으로 클래스 계층을 탐색하므로, `D` 클래스의 인스턴스에서 `method()`를 호출하면 `B`의 메서드가 실행됩니다.

<br>

### 5. 추상 기본 클래스와 상속

추상 기본 클래스(Abstract Base Class, ABC)는 직접 인스턴스화할 수 없고, 다른 클래스가 구현해야 하는 메서드를 정의하는 템플릿입니다.
```python
from abc import ABC, abstractmethod

class StructuralElement(ABC):
    """구조 요소의 추상 기본 클래스"""
    
    def __init__(self, material, safety_factor):
        self.material = material
        self.safety_factor = safety_factor
    
    @abstractmethod
    def calculate_capacity(self):
        """하중 지지 능력을 계산합니다."""
        pass
    
    @abstractmethod
    def get_weight(self):
        """요소의 무게를 계산합니다."""
        pass
    
    def get_safety_margin(self, applied_load):
        """안전 여유를 계산합니다."""
        capacity = self.calculate_capacity()
        return capacity / applied_load

class Beam(StructuralElement):
    """보 구조 요소"""
    
    def __init__(self, material, safety_factor, length, section_modulus):
        super().__init__(material, safety_factor)
        self.length = length
        self.section_modulus = section_modulus
    
    def calculate_capacity(self):
        # 간단한 예: 재료의 강도 * 단면 계수 / 안전 계수
        material_strengths = {
            "steel": 250,  # MPa
            "concrete": 30,
            "wood": 10
        }
        strength = material_strengths.get(self.material.lower(), 0)
        return strength * self.section_modulus / self.safety_factor
    
    def get_weight(self):  # 간단한 예: 재료의 밀도 * 부피
        densities = {
            "steel": 7850,  # kg/m^3
            "concrete": 2400,
            "wood": 500
        }
        density = densities.get(self.material.lower(), 0)
        # 체적은 단면 계수 * 길이로 단순화 (실제로는 더 복잡)
        return density * self.section_modulus * self.length * 0.001 # 단위보정

class Column(StructuralElement):
    """기둥 구조 요소"""
    def __init__(self, material, safety_factor, height, cross_section_area):
        super().__init__(material, safety_factor)
        self.height = height
        self.cross_section_area = cross_section_area
    
    def calculate_capacity(self):
        # 간단한 예: 재료의 강도 * 단면적 / 안전 계수 * 높이 보정
        material_strengths = {
            "steel": 250,  # MPa
            "concrete": 30,
            "wood": 10
        }
        strength = material_strengths.get(self.material.lower(), 0)
        height_factor = max(0.5, 2 - self.height / 10)  # 높이가 높을수록 용량 감소
        return strength * self.cross_section_area * height_factor / self.safety_factor
    
    def get_weight(self):  # 간단한 예: 재료의 밀도 * 부피
        densities = {
            "steel": 7850,  # kg/m^3
            "concrete": 2400,
            "wood": 500
        }
        density = densities.get(self.material.lower(), 0)
        return density * self.cross_section_area * self.height * 0.001  # 단위 보정

# 사용 예
# structural_element = StructuralElement("steel", 1.5)  # 오류: 추상 클래스는 인스턴스화할 수 없음

beam = Beam("steel", 1.5, 5.0, 0.0015)
column = Column("concrete", 2.0, 3.0, 0.09)

print(f"보의 용량: {beam.calculate_capacity():.2f} kN")
print(f"보의 무게: {beam.get_weight():.2f} kg")
print(f"보의 안전 여유(10kN 하중): {beam.get_safety_margin(10):.2f}")

print(f"기둥의 용량: {column.calculate_capacity():.2f} kN")
print(f"기둥의 무게: {column.get_weight():.2f} kg")
print(f"기둥의 안전 여유(100kN 하중): {column.get_safety_margin(100):.2f}")
```
이 예제에서 `StructuralElement`는 추상 기본 클래스로, `calculate_capacity`와 `get_weight`를 구현할 책임을 자식 클래스에 위임합니다. `Beam`과 `Column` 클래스는 이 추상 메서드들을 구체적으로 구현합니다.

<br>

### 6. 컴퓨테이셔널 디자인에서의 상속 응용

컴퓨테이셔널 디자인 분야에서 상속을 활용하는 복잡한 예제를 살펴보겠습니다. 이 예제는 파라메트릭 건축 요소를 모델링하는 시스템입니다.
```python
from abc import ABC, abstractmethod
import math

class ParametricElement(ABC):
    """파라메트릭 건축 요소의 기본 클래스"""
    
    def __init__(self, position=(0, 0, 0), rotation=(0, 0, 0), scale=1.0):
        self.position = position
        self.rotation = rotation
        self.scale = scale
        self.geometry = None  # 지오메트리를 저장할 속성
    
    @abstractmethod
    def generate(self):
        """요소의 지오메트리를 생성합니다."""
        pass
    
    def move(self, delta):
        """요소를 이동합니다."""
        x, y, z = self.position
        dx, dy, dz = delta
        self.position = (x + dx, y + dy, z + dz)
        print(f"요소를 ({dx}, {dy}, {dz}) 만큼 이동했습니다.")
        # 지오메트리가 생성된 경우 업데이트
        if self.geometry:
            print("지오메트리를 새 위치로 업데이트합니다.")
    
    def rotate(self, angles):
        """요소를 회전합니다."""
        rx, ry, rz = self.rotation
        drx, dry, drz = angles
        self.rotation = (rx + drx, ry + dry, rz + drz)
        print(f"요소를 ({drx}, {dry}, {drz}) 각도만큼 회전했습니다.")
        # 지오메트리가 생성된 경우 업데이트
        if self.geometry:
            print("지오메트리를 새 회전으로 업데이트합니다.")
    
    def scale_by(self, factor):
        """요소의 크기를 조정합니다."""
        self.scale *= factor
        print(f"요소의 크기를 {factor}배로 조정했습니다.")
        # 지오메트리가 생성된 경우 업데이트
        if self.geometry:
            print("지오메트리를 새 크기로 업데이트합니다.")
    
    def get_transformation_matrix(self):
        """변환 행렬을 계산합니다 (간소화된 버전)."""
        print(f"위치: {self.position}, 회전: {self.rotation}, 크기: {self.scale}의 변환 행렬 계산")
        return "변환 행렬"  # 실제로는 4x4 행렬 반환
    
    def export(self, format_type="obj"):
        """요소를 파일로 내보냅니다."""
        if not self.geometry:
            self.generate()
        print(f"요소를 {format_type} 형식으로 내보냅니다.")
        return f"{self.__class__.__name__}.{format_type}"


class ParametricFacade(ParametricElement):
    """파라메트릭 건물 파사드"""
    
    def __init__(self, width, height, panel_size=1.0, pattern="grid", 
                 position=(0, 0, 0), rotation=(0, 0, 0), scale=1.0):
        super().__init__(position, rotation, scale)
        self.width = width
        self.height = height
        self.panel_size = panel_size
        self.pattern = pattern
        self.panels = []
    
    def generate(self):
        """파사드 지오메트리를 생성합니다."""
        print(f"너비 {self.width}m, 높이 {self.height}m의 {self.pattern} 패턴 파사드를 생성합니다.")
        
        # 패널 개수 계산
        x_count = math.ceil(self.width / self.panel_size)
        y_count = math.ceil(self.height / self.panel_size)
        
        # 패널 생성 (간소화된 버전)
        self.panels = []
        for x in range(x_count):
            for y in range(y_count):
                panel_pos = (x * self.panel_size, y * self.panel_size, 0)
                panel = f"Panel_{x}_{y}"  # 실제로는 패널 객체가 됨
                self.panels.append(panel)
        
        self.geometry = f"Facade_{self.pattern}_{len(self.panels)}_panels"
        return self.geometry
    
    def change_pattern(self, new_pattern):
        """파사드 패턴을 변경합니다."""
        self.pattern = new_pattern
        print(f"파사드 패턴을 '{new_pattern}'으로 변경했습니다.")
        # 패턴이 변경되면 지오메트리를 재생성해야 함
        self.geometry = None
    
    def get_panel_count(self):
        """전체 패널 수를 반환합니다."""
        if not self.panels:
            self.generate()
        return len(self.panels)


class CurtainWall(ParametricFacade):
    """커튼월 파사드"""
    
    def __init__(self, width, height, mullion_spacing=1.5, transom_spacing=1.0, 
                 glass_thickness=0.01, frame_depth=0.1, position=(0, 0, 0), 
                 rotation=(0, 0, 0), scale=1.0):
        # 부모 클래스 초기화 (패널 크기를 mullion_spacing으로 설정)
        super().__init__(width, height, mullion_spacing, "curtain_wall", 
                         position, rotation, scale)
        
        self.mullion_spacing = mullion_spacing
        self.transom_spacing = transom_spacing
        self.glass_thickness = glass_thickness
        self.frame_depth = frame_depth
        self.mullions = []
        self.transoms = []
        self.glass_panels = []
    
    def generate(self):
        """커튼월 지오메트리를 생성합니다."""
        print(f"너비 {self.width}m, 높이 {self.height}m의 커튼월을 생성합니다.")
        print(f"멀리언 간격: {self.mullion_spacing}m, 트랜섬 간격: {self.transom_spacing}m")
        
        # 멀리언 개수 계산 및 생성
        mullion_count = math.ceil(self.width / self.mullion_spacing) + 1
        self.mullions = [f"Mullion_{i}" for i in range(mullion_count)]
        
        # 트랜섬 개수 계산 및 생성
        transom_count = math.ceil(self.height / self.transom_spacing) + 1
        self.transoms = [f"Transom_{i}" for i in range(transom_count)]
        
        # 유리 패널 생성
        self.glass_panels = []
        for x in range(mullion_count - 1):
            for y in range(transom_count - 1):
                panel = f"Glass_{x}_{y}"
                self.glass_panels.append(panel)
        
        # 전체 패널 목록에 모든 요소 추가
        self.panels = self.mullions + self.transoms + self.glass_panels
        
        self.geometry = f"CurtainWall_{len(self.glass_panels)}_panels"
        return self.geometry
    
    def change_glass_type(self, glass_type, thickness=None):
        """유리 유형 및 두께를 변경합니다."""
        print(f"유리 유형을 '{glass_type}'으로 변경했습니다.")
        
        if thickness:
            self.glass_thickness = thickness
            print(f"유리 두께를 {thickness}m로 변경했습니다.")
        
        # 유리가 변경되면 지오메트리 업데이트가 필요할 수 있음
        if self.geometry:
            print("유리 패널 지오메트리를 업데이트합니다.")
    
    def get_material_quantities(self):
        """자재 수량을 계산합니다."""
        if not self.geometry:
            self.generate()
        
        # 프레임 길이 계산
        mullion_length = len(self.mullions) * self.height
        transom_length = len(self.transoms) * self.width
        
        # 유리 면적 계산
        glass_area = len(self.glass_panels) * self.mullion_spacing * self.transom_spacing
        
        return {
            "frame_length": mullion_length + transom_length,
            "glass_area": glass_area,
            "glass_volume": glass_area * self.glass_thickness
        }


class KineticFacade(ParametricFacade):
    """움직이는 키네틱 파사드"""
    
    def __init__(self, width, height, panel_size=0.5, motion_type="rotate", 
                 sensor_type="light", position=(0, 0, 0), rotation=(0, 0, 0), scale=1.0):
        super().__init__(width, height, panel_size, "kinetic", position, rotation, scale)
        self.motion_type = motion_type  # 'rotate', 'slide', 'fold'
        self.sensor_type = sensor_type  # 'light', 'temperature', 'motion'
        self.current_state = 0.0  # 0.0(닫힘) ~ 1.0(열림)
        self.actuators = []
    
    def generate(self):
        """키네틱 파사드 지오메트리를 생성합니다."""
        print(f"너비 {self.width}m, 높이 {self.height}m의 {self.motion_type} 키네틱 파사드를 생성합니다.")
        
        # 패널 및 액추에이터 생성
        super().generate()  # 부모 클래스의 패널 생성 메서드 호출
        
        # 각 패널에 액추에이터 추가
        self.actuators = [f"Actuator_{i}" for i in range(len(self.panels))]
        
        self.geometry = f"KineticFacade_{self.motion_type}_{len(self.panels)}_panels"
        return self.geometry
    
    def animate(self, target_state, duration=5.0):
        """파사드 상태를 애니메이션으로 변경합니다."""
        print(f"파사드를 {self.current_state:.1f}에서 {target_state:.1f}로 {duration}초 동안 애니메이션합니다.")
        self.current_state = target_state
    
    def respond_to_sensor(self, sensor_value):
        """센서 입력에 반응합니다."""
        # 간단한 반응 로직
        if self.sensor_type == "light":
            # 빛이 강할수록 더 많이 닫힘 (차양 기능)
            target_state = 1.0 - min(1.0, sensor_value / 1000)
        elif self.sensor_type == "temperature":
            # 온도가 높을수록 더 많이 닫힘 (단열 기능)
            target_state = 1.0 - min(1.0, max(0.0, (sensor_value - 18) / 12))
        else:  # motion
            # 움직임이 감지되면 열림
            target_state = 1.0 if sensor_value > 0.5 else 0.0
        
        print(f"{self.sensor_type} 센서 값 {sensor_value}에 반응하여 상태를 {target_state:.2f}로 변경합니다.")
        self.animate(target_state)
        
        return target_state


# 사용 예
print("=== 기본 파라메트릭 파사드 ===")
facade = ParametricFacade(20.0, 15.0, panel_size=1.2, pattern="hexagonal")
facade.generate()
facade.move((0, 0, 10))
facade.change_pattern("triangular")
facade.generate()
print(f"패널 수: {facade.get_panel_count()}")

print("\n=== 커튼월 ===")
curtain_wall = CurtainWall(30.0, 25.0, mullion_spacing=1.8, transom_spacing=1.2)
curtain_wall.generate()
curtain_wall.change_glass_type("low-e", 0.012)
quantities = curtain_wall.get_material_quantities()
print(f"프레임 총 길이: {quantities['frame_length']:.2f}m")
print(f"유리 총 면적: {quantities['glass_area']:.2f}m²")

print("\n=== 키네틱 파사드 ===")
kinetic = KineticFacade(15.0, 10.0, panel_size=0.6, motion_type="fold", sensor_type="temperature")
kinetic.generate()
kinetic.respond_to_sensor(25)  # 25도 온도에 반응
kinetic.animate(0.5, 3.0)  # 3초 동안 반열림 상태로 애니메이션
```

이 예제는 건축 컴퓨테이셔널 디자인에서 상속을 활용하는 방법을 보여줍니다:

1. `ParametricElement`는 모든 파라메트릭 요소의 기본 추상 클래스로, 위치, 회전, 크기 등 공통 속성과 메서드를 정의합니다.
2. `ParametricFacade`는 이를 상속받아 기본적인 패널 기반 파사드를 구현합니다.
3. `CurtainWall`과 `KineticFacade`는 `ParametricFacade`를 상속받아 각각의 특화된 기능을 추가합니다.

이 계층 구조를 통해 코드 재사용성을 높이고, 특화된 파사드 유형을 쉽게 추가할 수 있습니다.

<br>

### 7. 강화학습과 상속

강화학습에서 상속을 활용하는 예제:
```python
from abc import ABC, abstractmethod
import random
import numpy as np

class RLAgent(ABC):
    """강화학습 에이전트의 기본 추상 클래스"""
    
    def __init__(self, state_size, action_size, name="Agent"):
        self.state_size = state_size
        self.action_size = action_size
        self.name = name
        self.training = True
    
    @abstractmethod
    def get_action(self, state):
        """현재 상태에서 취할 행동을 결정합니다."""
        pass
    
    @abstractmethod
    def train(self, state, action, reward, next_state, done):
        """경험을 통해 에이전트를 학습시킵니다."""
        pass
    
    def save_model(self, path):
        """모델을 저장합니다."""
        print(f"{self.name} 모델을 {path}에 저장합니다.")
    
    def load_model(self, path):
        """모델을 불러옵니다."""
        print(f"{self.name} 모델을 {path}에서 불러옵니다.")
    
    def set_training(self, training):
        """훈련 모드를 설정합니다."""
        self.training = training
        mode = "훈련" if training else "평가"
        print(f"{self.name}을(를) {mode} 모드로 설정합니다.")


class RandomAgent(RLAgent):
    """무작위 행동을 선택하는 기본 에이전트"""
    
    def __init__(self, state_size, action_size, name="RandomAgent"):
        super().__init__(state_size, action_size, name)
    
    def get_action(self, state):
        """무작위 행동을 선택합니다."""
        return random.randint(0, self.action_size - 1)
    
    def train(self, state, action, reward, next_state, done):
        """무작위 에이전트는 학습하지 않습니다."""
        pass  # 아무것도 하지 않음


class QTableAgent(RLAgent):
    """Q-테이블을 사용하는 강화학습 에이전트"""
    
    def __init__(self, state_size, action_size, 
    learning_rate=0.1, discount_factor=0.9, 
    exploration_rate=1.0, exploration_decay=0.995, name="QTableAgent"):
        super().__init__(state_size, action_size, name)
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.exploration_rate = exploration_rate
        self.exploration_decay = exploration_decay
        
        # Q-테이블 초기화 (상태 인덱스를 사용한다고 가정)
        self.q_table = np.zeros((state_size, action_size))
    
    def get_action(self, state):
        """현재 상태에서 엡실론-그리디 정책에 따라 행동을 선택합니다."""
        if self.training and random.random() < self.exploration_rate:
            # 탐색: 무작위 행동
            return random.randint(0, self.action_size - 1)
        else:
            # 활용: 최적 행동
            return np.argmax(self.q_table[state])
    
    def train(self, state, action, reward, next_state, done):
        """Q-learning을 사용하여 에이전트를 학습시킵니다."""
        if not self.training:
            return
        
        # Q-값 업데이트
        current_q = self.q_table[state, action]
        
        if done:
            target_q = reward
        else:
            target_q = reward + self.discount_factor * np.max(self.q_table[next_state])
        
        self.q_table[state, action] += self.learning_rate * (target_q - current_q)
        
        # 탐색률 감소
        self.exploration_rate *= self.exploration_decay
    
    def save_model(self, path):
        """Q-테이블을 저장합니다."""
        print(f"Q-테이블을 {path}에 저장합니다.")
        # 실제 구현: np.save(path, self.q_table)
    
    def load_model(self, path):
        """Q-테이블을 불러옵니다."""
        print(f"Q-테이블을 {path}에서 불러옵니다.")
        # 실제 구현: self.q_table = np.load(path)


class DeepQAgent(RLAgent):
    """심층 Q-네트워크(DQN)를 사용하는 강화학습 에이전트"""
    
    def __init__(self, state_size, action_size, learning_rate=0.001, discount_factor=0.99,
                 exploration_rate=1.0, exploration_decay=0.995, memory_size=10000,
                 batch_size=32, name="DeepQAgent"):
        super().__init__(state_size, action_size, name)
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.exploration_rate = exploration_rate
        self.exploration_decay = exploration_decay
        self.memory_size = memory_size
        self.batch_size = batch_size
        
        self.memory = []  # 경험 리플레이 메모리
        self.model = self._build_model()  # Q-네트워크 모델
        self.target_model = self._build_model()  # 타겟 네트워크
        self.update_target_model()
    
    def _build_model(self):
        """Q-네트워크 모델을 구축합니다."""
        print("심층 Q-네트워크 모델을 구축합니다.")
        # 실제 구현에서는 여기에 딥러닝 모델 정의
        return "DQN 모델"
    
    def update_target_model(self):
        """타겟 모델을 현재 모델로 업데이트합니다."""
        print("타겟 모델을 업데이트합니다.")
        # 실제 구현: self.target_model.set_weights(self.model.get_weights())
    
    def remember(self, state, action, reward, next_state, done):
        """경험을 메모리에 저장합니다."""
        if len(self.memory) >= self.memory_size:
            self.memory.pop(0)  # 가장 오래된 경험 제거
        
        self.memory.append((state, action, reward, next_state, done))
    
    def get_action(self, state):
        """현재 상태에서 엡실론-그리디 정책에 따라 행동을 선택합니다."""
        if self.training and random.random() < self.exploration_rate:
            # 탐색: 무작위 행동
            return random.randint(0, self.action_size - 1)
        else:
            # 활용: 최적 행동
            # 실제 구현: state = np.array([state]) 및 모델 예측
            print(f"상태 {state}에 대해 모델 예측을 수행합니다.")
            return random.randint(0, self.action_size - 1)  # 예시용 무작위 반환
    
    def train(self, state, action, reward, next_state, done):
        """경험 리플레이를 사용하여 에이전트를 학습시킵니다."""
        if not self.training:
            return
        
        # 경험 저장
        self.remember(state, action, reward, next_state, done)
        
        # 배치 크기보다 작은 경우 학습하지 않음
        if len(self.memory) < self.batch_size:
            return
        
        # 미니배치 샘플링 및 학습
        print(f"메모리에서 {self.batch_size}개의 샘플로 학습합니다.")
        
        # 탐색률 감소
        self.exploration_rate *= self.exploration_decay
        
        # 주기적으로 타겟 모델 업데이트
        if random.random() < 0.1:  # 10% 확률로 업데이트
            self.update_target_model()


# 사용 예
print("=== 강화학습 에이전트 비교 ===")

# 간단한 문제 설정 (예: 5개 상태, 3개 행동)
state_size, action_size = 5, 3

# 무작위 에이전트
random_agent = RandomAgent(state_size, action_size)
print(f"무작위 행동: {random_agent.get_action(0)}")

# Q-테이블 에이전트
q_agent = QTableAgent(state_size, action_size)
q_agent.get_action(0)  # 초기에는 탐색(무작위 행동)
q_agent.train(0, 1, 1.0, 2, False)  # 상태 0에서 행동 1을 취해 보상 1.0을 받고 상태 2로 이동
print(f"Q-테이블:\n{q_agent.q_table}")
q_agent.save_model("q_agent.npy")

# 심층 Q-네트워크 에이전트
dq_agent = DeepQAgent(state_size, action_size)
dq_agent.get_action(0)
dq_agent.train(0, 1, 1.0, 2, False)
dq_agent.set_training(False)  # 평가 모드로 전환
dq_agent.save_model("dq_agent.h5")
```
강화학습 에이전트를 계층화하여 구현:

1. `RLAgent`는 모든 강화학습 에이전트의 기본 추상 클래스로, 공통 인터페이스를 정의.
2. `RandomAgent`는 가장 단순한 에이전트로, 항상 무작위 행동을 선택.
3. `QTableAgent`는 테이블 기반 Q-학습을 구현.
4. `DeepQAgent`는 신경망을 사용하는 심층 Q-네트워크 알고리즘을 구현.

이러한 상속 구조는 강화학습 알고리즘을 실험하고 비교하는 데 유용합니다.



<br>

### 8. 상속 관련 고급 주제

**믹스인<sup>Mixin</sup> 클래스**
믹스인은 특정 기능을 캡슐화하여 여러 클래스에 "혼합"할 수 있는 클래스입니다. 
파이썬의 다중 상속을 통해 구현됩니다.
```python
class SerializableMixin:
    """객체의 직렬화 기능을 제공하는 믹스인"""
    
    def to_dict(self):
        """객체를 딕셔너리로 변환합니다."""
        result = {}
        for key, value in self.__dict__.items():
            if not key.startswith('_'):  # 비공개 속성 제외
                result[key] = value
        return result
    
    def to_json(self):
        """객체를 JSON 문자열로 변환합니다."""
        import json
        return json.dumps(self.to_dict())
    
    def save_to_file(self, filename):
        """객체를 JSON 파일로 저장합니다."""
        with open(filename, 'w') as f:
            f.write(self.to_json())
        print(f"객체를 {filename}에 저장했습니다.")


class ExportableMixin:
    """객체의 내보내기 기능을 제공하는 믹스인"""
    
    def export_to_csv(self, filename):
        """객체를 CSV 파일로 내보냅니다."""
        print(f"객체를 {filename} CSV 파일로 내보냅니다.")
    
    def export_to_excel(self, filename):
        """객체를 Excel 파일로 내보냅니다."""
        print(f"객체를 {filename} Excel 파일로 내보냅니다.")


class DesignProject(SerializableMixin, ExportableMixin):
    """설계 프로젝트 클래스 (믹스인 사용)"""
    
    def __init__(self, name, client, area):
        self.name = name
        self.client = client
        self.area = area
        self.elements = []
    
    def add_element(self, element):
        """프로젝트에 설계 요소를 추가합니다."""
        self.elements.append(element)
        print(f"요소 '{element}'를 프로젝트에 추가했습니다.")
    
    def get_summary(self):
        """프로젝트 요약을 반환합니다."""
        return f"프로젝트: {self.name}, 클라이언트: {self.client}, 면적: {self.area}m², 요소 수: {len(self.elements)}"


# 사용 예
project = DesignProject("타워 디자인", "ABC 건축주", 5000)
project.add_element("주 타워")
project.add_element("부속 건물")

print(project.get_summary())
print(f"JSON 형식: {project.to_json()}")
project.save_to_file("project.json")
project.export_to_csv("project.csv")
project.export_to_excel("project.xlsx")
```
믹스인을 사용하면 기능을 모듈화하고 여러 클래스에 동일한 기능을 쉽게 추가할 수 있습니다.

<br>

**메서드 디스패치**<sup>Method Dispatch</sup>
파이썬의 메서드 디스패치는 호출할 메서드를 결정하는 메커니즘입니다. <br>파이썬에서는 단일 디스패치<sup>Single Dispatch</sup>와 다중 디스패치<sup>Multiple Dispatch</sup> 가 있습니다.

*단일 디스패치 예제*
```python
from functools import singledispatch

@singledispatch
def process_geometry(geometry):
    """기본 지오메트리 처리 메서드"""
    print(f"알 수 없는 지오메트리 유형: {type(geometry).__name__}")

@process_geometry.register(str)
def _(geometry):
    """문자열 지오메트리 처리"""
    print(f"지오메트리 이름: {geometry}")

@process_geometry.register(list)
def _(geometry):
    """목록 지오메트리 처리"""
    print(f"지오메트리 목록 ({len(geometry)}개 항목): {geometry}")

@process_geometry.register(dict)
def _(geometry):
    """딕셔너리 지오메트리 처리"""
    for key, value in geometry.items():
        print(f"{key}: {value}")

# 사용 예
process_geometry("Cube")  # 문자열 버전 호출
process_geometry([1, 2, 3, 4])  # 목록 버전 호출
process_geometry({"type": "Box", "width": 10, "height": 5})  # 딕셔너리 버전 호출
process_geometry(123)  # 기본 버전 호출
```
단일 디스패치를 사용하면 매개변수 유형에 따라 다른 메서드 구현을 호출할 수 있습니다.

<br>

**추상 속성** <sup>Abstract Properties</sup>

추상 클래스에서는 추상 메서드뿐만 아니라 추상 속성(property)도 정의할 수 있습니다.
```python
from abc import ABC, abstractmethod, abstractproperty

class StructuralComponent(ABC):
    """구조 컴포넌트의 추상 기본 클래스"""
    
    @property
    @abstractmethod
    def volume(self):
        """컴포넌트의 부피를 반환합니다."""
        pass
    
    @property
    @abstractmethod
    def weight(self):
        """컴포넌트의 무게를 반환합니다."""
        pass
    
    @property
    def density(self):
        """컴포넌트의 밀도를 계산합니다."""
        if self.volume == 0:
            return 0
        return self.weight / self.volume


class Beam(StructuralComponent):
    """보 구조 컴포넌트"""
    
    def __init__(self, length, width, height, material_density):
        self.length = length
        self.width = width
        self.height = height
        self.material_density = material_density
    
    @property
    def volume(self):
        return self.length * self.width * self.height
    
    @property
    def weight(self):
        return self.volume * self.material_density


# 사용 예
steel_density = 7850  # kg/m³
beam = Beam(5.0, 0.2, 0.3, steel_density)
print(f"보의 부피: {beam.volume:.2f}m³")
print(f"보의 무게: {beam.weight:.2f}kg")
print(f"보의 밀도: {beam.density:.2f}kg/m³")
```
추상 속성을 사용하면 자식 클래스가 특정 속성을 구현하도록 강제할 수 있습니다.

<br>

### 9. 상속의 최적 사용 지침

상속은 강력한 도구이지만 남용하면 코드가 복잡해질 수 있습니다. 다음은 상속을 효과적으로 사용하기 위한 지침입니다:

**"is-a" 관계일 때만 상속 사용하기**

상속은 "is-a"(~이다) 관계를 모델링할 때 적합합니다. 즉, "자식 클래스는 부모 클래스의 일종이다"라고 말할 수 있어야 합니다.
```
좋은 예: Dog is an Animal, Rectangle is a Shape
나쁜 예: Car has an Engine, Library contains Books
```
"has-a"(~을 가지고 있다) 또는 "contains"(~를 포함한다) 관계는 컴포지션(composition)을 사용하는 것이 더 적합합니다.


**컴포지션 vs 상속**
많은 경우 상속보다 컴포지션이 더 유연한 설계를 제공합니다. 컴포지션은 한 객체가 다른 객체를 포함하는 방식입니다.
```python
# 상속 사용
class Vehicle:
    def move(self):
        print("움직입니다.")

class Car(Vehicle):
    def honk(self):
        print("빵빵!")

# 컴포지션 사용
class Engine:
    def start(self):
        print("엔진 시작")
    
    def stop(self):
        print("엔진 정지")

class Car:
    def __init__(self):
        self.engine = Engine()
    
    def start_engine(self):
        self.engine.start()
    
    def stop_engine(self):
        self.engine.stop()
```

상속은 "Car is a Vehicle"이라는 관계를 모델링하는 데 적합하지만, "Car has an Engine"이라는 관계는 컴포지션이 더 적합합니다.

**상속 계층 깊이 제한하기**

상속 계층이 너무 깊어지면 코드가 복잡해지고 이해하기 어려워집니다. 일반적으로 3-4 수준 이상으로 깊어지면 재설계를 고려해야 합니다.



**리스코프 치환 원칙(Liskov Substitution Principle) 준수하기**

리스코프 치환 원칙은 자식 클래스의 객체가 부모 클래스의 객체를 대체할 수 있어야 한다는 원칙입니다. 즉, 부모 클래스를 사용하는 코드는 자식 클래스로 대체해도 문제 없이 작동해야 합니다.

```python
# 좋은 예
class Bird:
    def fly(self):
        pass

class Sparrow(Bird):
    def fly(self):
        print("참새가 날아갑니다.")

# 나쁜 예 (penguin은 날 수 없어 LSP 위반)
class Penguin(Bird):
    def fly(self):
        raise Exception("펭귄은 날 수 없습니다!")
```
이 문제를 해결하려면 더 추상적인 기본 클래스를 만들고 날 수 있는 새와 날 수 없는 새를 구분할 수 있습니다:
```python
class Bird:
    def move(self):
        pass

class FlyingBird(Bird):
    def fly(self):
        pass
    
    def move(self):
        self.fly()

class NonFlyingBird(Bird):
    def walk(self):
        pass
    
    def move(self):
        self.walk()

class Sparrow(FlyingBird):
    def fly(self):
        print("참새가 날아갑니다.")

class Penguin(NonFlyingBird):
    def walk(self):
        print("펭귄이 걷습니다.")
```


### 10. 결론

파이썬에서 상속은 코드 재사용성을 높이고 객체 간의 계층적 관계를 모델링하는 강력한 도구입니다. 기본 상속에서 다중 상속, 추상 클래스, 믹스인까지 다양한 상속 메커니즘을 이해하고 적절히 사용하면 더 유지보수하기 쉽고 확장 가능한 코드를 작성할 수 있습니다.

특히 컴퓨테이셔널 디자인과 같이 복잡한 객체 계층과 다양한 알고리즘을 다루는 분야에서는 상속을 통해 코드를 체계적으로 구성하는 것이 중요합니다. 적절한 추상화 수준을 선택하고, 필요할 때는 상속 대신 컴포지션을 고려하는 등의 최선의 실천 방법을 따른다면 더 견고하고 유연한 디자인 시스템을 구축할 수 있을 것입니다.