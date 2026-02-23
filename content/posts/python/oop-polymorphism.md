---
title: "객체지향 4 : 다형성"
tags: []
date: 2024-01-01
---
**파이썬 객체지향 프로그래밍의 다형성** <sup>Polymorphism</sup>

다형성<sup>Polymorphism</sup> 은 객체지향 프로그래밍의 4대 기둥 중 하나로, "==여러 형태를 가질 수 있는 능력=="을 의미합니다. 이는 동일한 인터페이스(메서드나 연산자)가 여러 다른 타입의 객체에 대해 다양한 구현을 가질 수 있게 해주는 개념입니다. 

다형성을 통해 코드는 더 유연해지고, 확장성이 높아지며, 재사용성이 증가합니다.

<br>

### 1. 파이썬에서의 다형성 개념

파이썬은 동적 타입 언어로, 다른 정적 타입 언어들과 비교하여 자연스럽게 다형성을 지원합니다. 파이썬의 다형성은 주로 다음 방식으로 구현됩니다:

1. **덕 타이핑** <sup>Duck Typing</sup>: "오리처럼 걷고, 오리처럼 꽥꽥거리면, 그것은 오리일 것이다"라는 개념.
2. **메서드 오버라이딩** <sup>Method Overriding</sup>: 자식 클래스에서 부모 클래스의 메서드를 재정의.
3. **메서드 오버로딩** <sup>Method Overloading</sup>: 동일한 이름의 메서드가 다른 매개변수를 처리.
4. **연산자 오버로딩** <sup>Operator Overloading</sup>: 연산자의 동작을 클래스에 맞게 재정의.

각각의 방식을 자세히 살펴보겠습니다.

<br>

### 2. 덕 타이핑

파이썬은 정적 타입 검사를 하지 않으므로, 객체의 실제 타입보다는 "무엇을 할 수 있는지"에 더 중점을 둡니다. 이를 "**덕 타이핑**" <sup>Duck Typing</sup> 이라고 합니다.

기본예제:
```python
def calculate_area(shape):
    return shape.area()

class Circle:
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2

class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

# 두 가지 다른 클래스 인스턴스에 대해 동일한 함수 사용
circle = Circle(5)
rectangle = Rectangle(4, 6)

print(f"원의 면적: {calculate_area(circle):.2f}")      # 원의 면적: 78.54
print(f"직사각형의 면적: {calculate_area(rectangle)}")  # 직사각형의 면적: 24
```
이 예제에서 `calculate_area` 함수는 전달된 객체의 실제 타입을 검사하지 않고, 단지 `area()` 메서드가 있는지만 확인합니다. 이것이 덕 타이핑의 핵심입니다.


컴퓨테이셔널 디자인에서 덕 타이핑 예제:
```python
def generate_mesh(geometry):
    """지오메트리에서 메시를 생성합니다."""
    points = geometry.get_points()
    connectivity = geometry.get_connectivity()
    print(f"{len(points)}개의 점과 {len(connectivity)}개의 연결성으로 메시 생성")
    return {"points": points, "connectivity": connectivity}

class ParametricSurface:
    def __init__(self, u_count=10, v_count=10):
        self.u_count = u_count
        self.v_count = v_count
    
    def get_points(self):
        """곡면의 점들을 생성합니다."""
        points = []
        for i in range(self.u_count):
            for j in range(self.v_count):
                # 간단한 예: 평면에 점 배치
                points.append([i, j, 0])
        return points
    
    def get_connectivity(self):
        """점 연결성을 정의합니다."""
        connectivity = []
        for i in range(self.u_count - 1):
            for j in range(self.v_count - 1):
                idx = i * self.v_count + j
                # 각 그리드 셀에 대한 사각형 연결성
                connectivity.append([idx, idx + 1, idx + self.v_count + 1, idx + self.v_count])
        return connectivity

class VoxelGrid:
    def __init__(self, size=10, density=0.5):
        self.size = size
        self.density = density
        self.voxels = self._generate_voxels()
    
    def _generate_voxels(self):
        """복셀을 생성합니다 (간단한 예시)."""
        import random
        voxels = []
        for x in range(self.size):
            for y in range(self.size):
                for z in range(self.size):
                    if random.random() < self.density:
                        voxels.append([x, y, z])
        return voxels
    
    def get_points(self):
        """복셀의 꼭지점을 반환합니다."""
        points = []
        for voxel in self.voxels:
            x, y, z = voxel
            # 각 복셀의 8개 꼭지점 추가
            corners = [
                [x, y, z], [x+1, y, z], [x+1, y+1, z], [x, y+1, z],
                [x, y, z+1], [x+1, y, z+1], [x+1, y+1, z+1], [x, y+1, z+1]
            ]
            points.extend(corners)
        return points
    
    def get_connectivity(self):
        """복셀의 면을 정의합니다."""
        connectivity = []
        for i in range(0, len(self.voxels) * 8, 8):
            # 각 복셀의 6개 면에 대한 연결성
            # 아래 면
            connectivity.append([i, i+1, i+2, i+3])
            # 위 면
            connectivity.append([i+4, i+5, i+6, i+7])
            # 4개 측면
            connectivity.append([i, i+1, i+5, i+4])
            connectivity.append([i+1, i+2, i+6, i+5])
            connectivity.append([i+2, i+3, i+7, i+6])
            connectivity.append([i+3, i+0, i+4, i+7])
        return connectivity

# 두 가지 다른 지오메트리 타입으로 메시 생성
surface = ParametricSurface(5, 5)
voxels = VoxelGrid(3, 0.3)

surface_mesh = generate_mesh(surface)
voxel_mesh = generate_mesh(voxels)
```
이 예제에서 `generate_mesh` 함수는 전달된 지오메트리 객체가 `get_points()`와 `get_connectivity()` 메서드를 가지고 있기만 하면 작동합니다. 객체의 실제 클래스가 무엇인지는 상관하지 않으며, 이것이 파이썬의 덕 타이핑이 제공하는 유연성입니다.

<br>

### 3. 메서드 오버라이딩

메서드 오버라이딩 <sup>Method Overriding</sup> 은 자식 클래스가 부모 클래스에서 이미 정의된 메서드를 재정의하는 것을 말합니다. 이를 통해 부모 클래스와 동일한 인터페이스를 유지하면서 다른 동작을 구현할 수 있습니다.

기본 예제:
```python
class Animal:
    def speak(self):
        return "동물이 소리를 냅니다"

class Dog(Animal):
    def speak(self):
        return "멍멍!"

class Cat(Animal):
    def speak(self):
        return "야옹!"

# 다형성 예시
animals = [Animal(), Dog(), Cat()]

for animal in animals:
    print(animal.speak())
# 출력:
# 동물이 소리를 냅니다
# 멍멍!
# 야옹!
```

컴퓨테이셔널 디자인에서의 메서드 오버라이딩 예제:
```python
class BuildingElement:
    def __init__(self, name, level=0):
        self.name = name
        self.level = level
    
    def generate_geometry(self):
        """기본 지오메트리 생성 메서드"""
        return f"{self.name} 지오메트리 생성 (레벨 {self.level})"
    
    def export_data(self):
        """BIM 데이터 내보내기"""
        return {
            "name": self.name,
            "level": self.level,
            "type": self.__class__.__name__
        }

class Wall(BuildingElement):
    def __init__(self, name, level=0, length=5.0, height=3.0, thickness=0.2):
        super().__init__(name, level)
        self.length = length
        self.height = height
        self.thickness = thickness
    
    def generate_geometry(self):
        """벽 지오메트리 생성 (오버라이드)"""
        wall_volume = self.length * self.height * self.thickness
        return f"{self.name} 벽 생성: 길이 {self.length}m, 높이 {self.height}m, 두께 {self.thickness}m, 부피 {wall_volume}m³"
    
    def export_data(self):
        """벽 데이터 내보내기 (오버라이드 및 확장)"""
        data = super().export_data()  # 부모 메서드 호출
        data.update({
            "length": self.length,
            "height": self.height,
            "thickness": self.thickness
        })
        return data

class Column(BuildingElement):
    def __init__(self, name, level=0, height=3.0, radius=0.2):
        super().__init__(name, level)
        self.height = height
        self.radius = radius
    
    def generate_geometry(self):
        """기둥 지오메트리 생성 (오버라이드)"""
        import math
        column_volume = math.pi * self.radius ** 2 * self.height
        return f"{self.name} 원형 기둥 생성: 높이 {self.height}m, 반경 {self.radius}m, 부피 {column_volume:.2f}m³"
    
    def export_data(self):
        """기둥 데이터 내보내기 (오버라이드 및 확장)"""
        data = super().export_data()
        data.update({
            "height": self.height,
            "radius": self.radius
        })
        return data

class Floor(BuildingElement):
    def __init__(self, name, level=0, length=10.0, width=8.0, thickness=0.3):
        super().__init__(name, level)
        self.length = length
        self.width = width
        self.thickness = thickness
    
    def generate_geometry(self):
        """바닥 지오메트리 생성 (오버라이드)"""
        floor_volume = self.length * self.width * self.thickness
        return f"{self.name} 바닥 생성: 길이 {self.length}m, 너비 {self.width}m, 두께 {self.thickness}m, 부피 {floor_volume}m³"
    
    def export_data(self):
        """바닥 데이터 내보내기 (오버라이드 및 확장)"""
        data = super().export_data()
        data.update({
            "length": self.length,
            "width": self.width,
            "thickness": self.thickness
        })
        return data

# 다양한 건축 요소를 생성하고 다형적으로 처리
building_elements = [
    Wall("외벽-1", 1, 8.0, 3.0, 0.3),
    Column("기둥-A1", 1, 3.0, 0.25),
    Floor("1층 바닥", 1, 12.0, 10.0, 0.2)
]

# 모든 요소에 대해 동일한 메서드 호출 (다형성)
for element in building_elements:
    print(element.generate_geometry())
    print(f"데이터: {element.export_data()}")
    print()
```
이 예제에서 `BuildingElement` 클래스는 기본 메서드를 정의하고, 각 자식 클래스(`Wall`, `Column`, `Floor`)는 자신의 특성에 맞게 이러한 메서드를 오버라이드합니다. 이렇게 함으로써 모든 건축 요소를 일관된 방식으로 처리하면서도 각각의 특별한 동작을 구현할 수 있습니다.

<br>

### 4. 메서드 오버로딩

파이썬은 전통적인 방식의 **메서드 오버로딩**<sup>Method Overloading</sup> (동일한 이름의 함수에 다른 매개변수 사용)을 직접 지원하지 않습니다. 대신, 파이썬에서는 기본 매개변수, 가변 인자(\*args), 키워드 가변 인자(\*\*kwargs)를 사용하여 유사한 기능을 구현합니다.

**기본 매개변수를 사용한 예제**
```python
class Calculator:
    def add(self, a, b=0, c=0, d=0):
        return a + b + c + d

calc = Calculator()
print(calc.add(5))          # 5
print(calc.add(5, 3))       # 8
print(calc.add(5, 3, 2))    # 10
print(calc.add(5, 3, 2, 1)) # 11
```

**가변 인자를 사용한 예제**
```python
class AdvancedCalculator:
    def add(self, *args):
        """임의의 개수의 인자를 받아 모두 더합니다."""
        return sum(args)
    
    def operate(self, operation, *args):
        """지정된 연산을 임의의 개수의 인자에 적용합니다."""
        if operation == "add":
            return sum(args)
        elif operation == "multiply":
            result = 1
            for arg in args:
                result *= arg
            return result
        else:
            raise ValueError(f"지원하지 않는 연산: {operation}")

calc = AdvancedCalculator()
print(calc.add(1, 2))                    # 3
print(calc.add(1, 2, 3, 4, 5))           # 15
print(calc.operate("add", 1, 2, 3))      # 6
print(calc.operate("multiply", 2, 3, 4)) # 24
```

컴퓨테이셔널 디자인에서의 메서드 오버로딩 예제:
```python
class ParametricModeler:
    def create_box(self, *args, **kwargs):
        """박스 생성 - 여러 형태의 입력 지원
        
        사용 방법:
        - create_box(size): 모든 차원이 동일한 정육면체
        - create_box(width, depth, height): 직육면체
        - create_box(center=[x,y,z], width=w, depth=d, height=h): 위치가 지정된 직육면체
        """
        # 기본 매개변수
        center = kwargs.get('center', [0, 0, 0])
        
        if len(args) == 1:
            # 정육면체 생성
            size = args[0]
            width = depth = height = size
        elif len(args) == 3:
            # 직육면체 생성
            width, depth, height = args
        else:
            # 키워드 인자로 치수 지정
            width = kwargs.get('width', 1.0)
            depth = kwargs.get('depth', 1.0)
            height = kwargs.get('height', 1.0)
        
        # 박스 생성 로직
        dimensions = f"너비 {width}, 깊이 {depth}, 높이 {height}"
        return f"좌표 {center}에 {dimensions}인 박스 생성"
    
    def extrude(self, profile, *args, **kwargs):
        """프로파일 돌출 - 여러 형태의 입력 지원
        
        사용 방법:
        - extrude(profile, height): 단순 돌출
        - extrude(profile, height, direction): 방향 지정 돌출
        - extrude(profile, height, taper=angle): 테이퍼 적용 돌출
        """
        if len(args) >= 1:
            height = args[0]
        else:
            height = kwargs.get('height', 1.0)
        
        # 추가 매개변수
        direction = args[1] if len(args) >= 2 else kwargs.get('direction', [0, 0, 1])
        taper = kwargs.get('taper', 0)
        
        # 돌출 로직
        extrusion_desc = f"프로파일 '{profile}'을(를) 높이 {height}로 돌출"
        if taper != 0:
            extrusion_desc += f", 테이퍼 각도 {taper}도 적용"
        
        return extrusion_desc

# 사용 예시
modeler = ParametricModeler()

# 다양한 방식으로 박스 생성
box1 = modeler.create_box(2.0)
box2 = modeler.create_box(5.0, 3.0, 2.0)
box3 = modeler.create_box(center=[10, 10, 0], width=4.0, height=3.0, depth=2.0)

print(box1)  # 좌표 [0, 0, 0]에 너비 2.0, 깊이 2.0, 높이 2.0인 박스 생성
print(box2)  # 좌표 [0, 0, 0]에 너비 5.0, 깊이 3.0, 높이 2.0인 박스 생성
print(box3)  # 좌표 [10, 10, 0]에 너비 4.0, 깊이 2.0, 높이 3.0인 박스 생성

# 다양한 방식으로 돌출
extrusion1 = modeler.extrude("원", 5.0)
extrusion2 = modeler.extrude("사각형", 3.0, [0, 1, 0])
extrusion3 = modeler.extrude("다각형", height=2.0, taper=15)

print(extrusion1)  # 프로파일 '원'을(를) 높이 5.0로 돌출
print(extrusion2)  # 프로파일 '사각형'을(를) 높이 3.0로 돌출
print(extrusion3)  # 프로파일 '다각형'을(를) 높이 2.0로 돌출, 테이퍼 각도 15도 적용
```
이 예제에서는 `ParametricModeler` 클래스가 다양한 방식으로 호출될 수 있는 메서드들을 제공합니다. 가변 인자와 키워드 인자를 조합하여 동일한 메서드가 다양한 매개변수 조합을 처리할 수 있게 합니다.

<br>

### 5. 연산자 오버로딩
**Operator Overloading**
파이썬에서는 특별 메서드(매직 메서드 또는 던더 메서드)를 정의하여 클래스의 인스턴스에 대한 연산자 동작을 사용자 정의할 수 있습니다.

기본 예제:
```python
class Vector:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
    
    # 벡터 덧셈 연산자(+) 오버로딩
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y, self.z + other.z)
    
    # 벡터 뺄셈 연산자(-) 오버로딩
    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y, self.z - other.z)
    
    # 벡터 스칼라 곱셈 연산자(*) 오버로딩
    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar, self.z * scalar)
    
    # 오른쪽 스칼라 곱셈 연산자 오버로딩
    def __rmul__(self, scalar):
        return self.__mul__(scalar)
    
    # 문자열 표현 오버로딩
    def __str__(self):
        return f"Vector({self.x}, {self.y}, {self.z})"
    
    # 길이(norm) 계산을 위한 오버로딩
    def __abs__(self):
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5

# 벡터 연산 예시
v1 = Vector(1, 2, 3)
v2 = Vector(4, 5, 6)

v3 = v1 + v2
v4 = v1 - v2
v5 = v1 * 2
v6 = 3 * v2

print(v3)  # Vector(5, 7, 9)
print(v4)  # Vector(-3, -3, -3)
print(v5)  # Vector(2, 4, 6)
print(v6)  # Vector(12, 15, 18)
print(abs(v1))  # 3.741657386773941 (벡터의 크기)
```

컴퓨테이셔널 디자인에서의 연산자 오버로딩 예제:
```python
class GeometryTransform:
    def __init__(self, matrix=None):
        """4x4 변환 행렬을 사용하는 지오메트리 변환 클래스"""
        if matrix is None:
            # 기본값으로 항등 행렬 사용
            self.matrix = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]
        else:
            self.matrix = matrix
    
    def __mul__(self, other):
        """행렬 곱셈을 통한 변환 합성"""
        if isinstance(other, GeometryTransform):
            # 두 변환 행렬의 곱셈 (간소화된 구현)
            result = [[0 for _ in range(4)] for _ in range(4)]
            for i in range(4):
                for j in range(4):
                    for k in range(4):
                        result[i][j] += self.matrix[i][k] * other.matrix[k][j]
            return GeometryTransform(result)
        else:
            # 다른 타입과의 곱셈은 지원하지 않음
            return NotImplemented
    
    def __str__(self):
        """행렬 문자열 표현"""
        return "\n".join([" ".join([f"{x:.2f}" for x in row]) for row in self.matrix])
    
    @classmethod
    def translate(cls, x, y, z):
        """평행 이동 변환 생성"""
        return cls([
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ])
    
    @classmethod
    def scale(cls, x, y, z):
        """스케일 변환 생성"""
        return cls([
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1]
        ])
    
    @classmethod
    def rotate_z(cls, angle_degrees):
        """Z축 회전 변환 생성"""
        import math
        angle_rad = math.radians(angle_degrees)
        cos_val = math.cos(angle_rad)
        sin_val = math.sin(angle_rad)
        return cls([
            [cos_val, -sin_val, 0, 0],
            [sin_val, cos_val, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])

class Mesh:
    def __init__(self, name, vertices=None):
        self.name = name
        self.vertices = vertices or []
    
    def __add__(self, other):
        """두 메시 결합 (병합)"""
        if not isinstance(other, Mesh):
            return NotImplemented
        
        result = Mesh(f"{self.name}+{other.name}")
        result.vertices = self.vertices + other.vertices
        return result
    
    def __mul__(self, transform):
        """변환 행렬 적용"""
        if not isinstance(transform, GeometryTransform):
            return NotImplemented
        
        result = Mesh(self.name)
        # 간소화된 예시: 실제로는 각 정점에 변환 행렬 적용
        result.vertices = [f"transformed_{v}" for v in self.vertices]
        return result
    
    def __str__(self):
        return f"Mesh '{self.name}' with {len(self.vertices)} vertices"

# 변환 예시
translate = GeometryTransform.translate(10, 5, 0)
scale = GeometryTransform.scale(2, 2, 2)
rotate = GeometryTransform.rotate_z(45)

# 변환 합성
transform1 = translate * rotate  # 먼저 회전 후 이동
transform2 = rotate * scale      # 먼저 스케일링 후 회전

print("변환 1 (회전 후 이동):")
print(transform1)
print("\n변환 2 (스케일링 후 회전):")
print(transform2)

# 메시 연산 예시
box = Mesh("Box", ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"])
sphere = Mesh("Sphere", ["v9", "v10", "v11", "v12"])

combined_mesh = box + sphere  # 메시 병합
transformed_mesh = box * transform1  # 메시에 변환 적용

print("\n메시 연산 결과:")
print(combined_mesh)
print(transformed_mesh)
```

이 예제에서는 3D 변환과 메시 조작에 연산자 오버로딩을 사용합니다. `GeometryTransform` 클래스는 `*` 연산자를 오버로드하여 변환 합성을 구현하고, `Mesh` 클래스는 `+` 연산자로 메시 병합, `*` 연산자로 변환 적용을 구현합니다.

<br>
### 6. 추상 기본 클래스를 통한 다형성

파이썬에서는 `abc` 모듈의 `ABC`(Abstract Base Class)와 `abstractmethod` 데코레이터를 사용하여 인터페이스를 정의하고 다형성을 강화할 수 있습니다.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass
    
    def describe(self):
        return f"이 도형의 면적은 {self.area()}, 둘레는 {self.perimeter()}입니다."

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

# 추상 클래스 직접 인스턴스화 시도
try:
    shape = Shape()  # TypeError 발생
except TypeError as e:
    print(f"오류: {e}")

# 구현 클래스 사용
circle = Circle(5)
rectangle = Rectangle(4, 6)

print(circle.describe())
print(rectangle.describe())
```

컴퓨테이셔널 디자인에서의 추상 클래스 예제:
```python
from abc import ABC, abstractmethod

class OptimizationAlgorithm(ABC):
    """최적화 알고리즘을 위한 추상 기본 클래스"""
    
    def __init__(self, max_iterations=100, tolerance=1e-6):
        self.max_iterations = max_iterations
        self.tolerance = tolerance
        self.iterations = 0
        self.best_solution = None
        self.best_fitness = float('-inf') if self.is_maximization() else float('inf')
    
    @abstractmethod
    def initialize(self, problem_size, bounds):
        """알고리즘 초기화 및 초기 해집단 생성"""
        pass
    
    @abstractmethod
    def update(self, fitness_function):
        """한 세대의 해집단 업데이트"""
        pass
    
    @abstractmethod
    def is_maximization(self):
        """최대화 문제인지 여부 반환"""
        pass
    
    def optimize(self, fitness_function, problem_size, bounds):
        """최적화 실행"""
        self.initialize(problem_size, bounds)
        
        while self.iterations < self.max_iterations:
            self.iterations += 1
            
            # 해집단 업데이트
            current_best, current_fitness = self.update(fitness_function)
            
            # 최적해 업데이트
            if self.is_maximization():
                if current_fitness > self.best_fitness:
                    self.best_solution = current_best
                    self.best_fitness = current_fitness
            else:
                if current_fitness < self.best_fitness:
                    self.best_solution = current_best
                    self.best_fitness = current_fitness
            
            # 수렴 확인
            if self.check_convergence():
                break
            
            print(f"반복 {self.iterations}: 최적 적합도 = {self.best_fitness:.6f}")
        
        return self.best_solution, self.best_fitness
    
    def check_convergence(self):
        """알고리즘 수렴 확인"""
        # 기본 구현: 최대 반복 횟수에 도달하면 종료
        return self.iterations >= self.max_iterations

class GeneticAlgorithm(OptimizationAlgorithm):
    """유전 알고리즘 구현"""
    
    def __init__(self, population_size=50, crossover_rate=0.8, mutation_rate=0.1, max_iterations=100, tolerance=1e-6):
        super().__init__(max_iterations, tolerance)
        self.population_size = population_size
        self.crossover_rate = crossover_rate
        self.mutation_rate = mutation_rate
        self.population = []
    
    def is_maximization(self):
        """GA는 기본적으로 적합도 최대화 문제를 해결"""
        return True
    
    def initialize(self, problem_size, bounds):
        """초기 해집단 생성"""
        import random
        self.population = []
        
        for _ in range(self.population_size):
            individual = []
            for i in range(problem_size):
                lower, upper = bounds[i]
                individual.append(random.uniform(lower, upper))
            self.population.append(individual)
        
        print(f"유전 알고리즘 초기화: {self.population_size}개 개체의 해집단 생성")
    
    def update(self, fitness_function):
        """한 세대 진화"""
        # 1. 평가
        fitnesses = [fitness_function(ind) for ind in self.population]
        
        # 현재 세대의 최적해 찾기
        best_idx = fitnesses.index(max(fitnesses))
        current_best = self.population[best_idx]
        current_fitness = fitnesses[best_idx]
        
        # 2. 선택, 교차, 변이 등 유전 연산자 적용 (간소화된 구현)
        print(f"세대 {self.iterations}: 선택, 교차, 변이 연산 수행")
        
        # 3. 세대 교체 (여기서는 생략)
        
        return current_best, current_fitness

class ParticleSwarmOptimization(OptimizationAlgorithm):
    """입자 군집 최적화 알고리즘 구현"""
    
    def __init__(self, swarm_size=30, inertia=0.7, cognitive=1.5, social=1.5, max_iterations=100, tolerance=1e-6):
        super().__init__(max_iterations, tolerance)
        self.swarm_size = swarm_size
        self.inertia = inertia
        self.cognitive = cognitive
        self.social = social
        self.particles = []
        self.velocities = []
        self.personal_best_positions = []
        self.personal_best_fitnesses = []
        self.global_best_position = None
        self.global_best_fitness = float('-inf')
    
    def is_maximization(self):
        """PSO는 기본적으로 최대화 문제를 해결하도록 구현"""
        return True
    
    def initialize(self, problem_size, bounds):
        """초기 입자 군집 생성"""
        import random
        self.particles = []
        self.velocities = []
        self.personal_best_positions = []
        self.personal_best_fitnesses = []
        
        for _ in range(self.swarm_size):
            # 입자 위치 초기화
            particle = []
            for i in range(problem_size):
                lower, upper = bounds[i]
                particle.append(random.uniform(lower, upper))
            self.particles.append(particle)
            
            # 입자 속도 초기화
            velocity = []
            for i in range(problem_size):
                lower, upper = bounds[i]
                range_width = upper - lower
                velocity.append(random.uniform(-range_width, range_width) * 0.1)
            self.velocities.append(velocity)
            
            # 개인 최적 위치 초기화
            self.personal_best_positions.append(particle[:])
            self.personal_best_fitnesses.append(float('-inf'))
        
        print(f"PSO 초기화: {self.swarm_size}개 입자의 군집 생성")
    
    def update(self, fitness_function):
        """한 반복의 입자 업데이트"""
        import random
        
        # 각 입자 업데이트
        for i in range(self.swarm_size):
            # 적합도 평가
            fitness = fitness_function(self.particles[i])
            
            # 개인 최적 위치 업데이트
            if fitness > self.personal_best_fitnesses[i]:
                self.personal_best_positions[i] = self.particles[i][:]
                self.personal_best_fitnesses[i] = fitness
            
            # 전역 최적 위치 업데이트
            if fitness > self.global_best_fitness:
                self.global_best_position = self.particles[i][:]
                self.global_best_fitness = fitness
        
        # 입자 위치와 속도 업데이트
        for i in range(self.swarm_size):
            for j in range(len(self.particles[i])):
                # 속도 업데이트
                inertia_term = self.inertia * self.velocities[i][j]
                cognitive_term = self.cognitive * random.random() * (self.personal_best_positions[i][j] - self.particles[i][j])
                social_term = self.social * random.random() * (self.global_best_position[j] - self.particles[i][j])
                
                self.velocities[i][j] = inertia_term + cognitive_term + social_term
                
                # 위치 업데이트
                self.particles[i][j] += self.velocities[i][j]
        
        print(f"반복 {self.iterations}: 입자 위치 및 속도 업데이트")
        
        return self.global_best_position, self.global_best_fitness

# 최적화 문제 정의
def tower_design_fitness(params):
    """타워 디자인의 적합도 함수 (예시)"""
    # 매개변수 추출
    height, width, taper = params
    
    # 제약 조건: 높이/너비 비율은 안정성을 위해 10을 초과하지 않아야 함
    stability_ratio = height / width
    if stability_ratio > 10:
        return 0  # 불안정한 디자인
    
    # 목표 함수: 높은 높이, 낮은 재료 사용량, 적절한 테이퍼
    material_usage = height * (width ** 2) * (1 + (1 - taper) / 2)
    aesthetic_score = 10 * taper  # 테이퍼가 클수록 미적으로 더 좋다고 가정
    
    # 전체 적합도
    return height * 0.5 - material_usage * 0.001 + aesthetic_score

# 문제 설정
problem_size = 3  # 높이, 너비, 테이퍼
bounds = [(50, 300), (5, 30), (0.3, 0.8)]  # 각 매개변수의 범위

# 다양한 최적화 알고리즘으로 타워 디자인 최적화
print("=== 유전 알고리즘으로 타워 디자인 최적화 ===")
ga = GeneticAlgorithm(population_size=30, max_iterations=5)
ga_solution, ga_fitness = ga.optimize(tower_design_fitness, problem_size, bounds)

print("\n=== 입자 군집 최적화로 타워 디자인 최적화 ===")
pso = ParticleSwarmOptimization(swarm_size=20, max_iterations=5)
pso_solution, pso_fitness = pso.optimize(tower_design_fitness, problem_size, bounds)

print("\n=== 최적화 결과 비교 ===")
print(f"GA 최적해: 높이={ga_solution[0]:.2f}m, 너비={ga_solution[1]:.2f}m, 테이퍼={ga_solution[2]:.2f}")
print(f"GA 적합도: {ga_fitness:.6f}")
print(f"PSO 최적해: 높이={pso_solution[0]:.2f}m, 너비={pso_solution[1]:.2f}m, 테이퍼={pso_solution[2]:.2f}")
print(f"PSO 적합도: {pso_fitness:.6f}")
```

이 예제에서는 `OptimizationAlgorithm`이라는 추상 기본 클래스를 정의하고, 이를 구현하는 `GeneticAlgorithm`과 `ParticleSwarmOptimization` 클래스를 만들었습니다. 두 알고리즘은 동일한 인터페이스(`optimize` 메서드)를 통해 사용되지만, 내부 구현은 완전히 다릅니다. 이것이 추상 클래스를 통한 다형성의 핵심입니다.

<br>

### 7. 다형성과 강화학습

사용자의 관심사인 강화학습에서의 다형성 적용 예제를 살펴보겠습니다.
```python
from abc import ABC, abstractmethod
import random
import math

class Environment(ABC):
    """강화학습 환경의 추상 기본 클래스"""
    
    @abstractmethod
    def reset(self):
        """환경을 초기 상태로 재설정하고 초기 상태를 반환"""
        pass
    
    @abstractmethod
    def step(self, action):
        """행동을 수행하고 다음 상태, 보상, 종료 여부, 추가 정보 반환"""
        pass
    
    @abstractmethod
    def get_action_space(self):
        """가능한 행동의 범위 반환"""
        pass
    
    @abstractmethod
    def get_state_space(self):
        """상태 공간 정보 반환"""
        pass
    
    def render(self):
        """환경 시각화 (기본은 아무것도 하지 않음)"""
        pass

class Agent(ABC):
    """강화학습 에이전트의 추상 기본 클래스"""
    
    def __init__(self, action_space, state_space):
        self.action_space = action_space
        self.state_space = state_space
    
    @abstractmethod
    def select_action(self, state):
        """현재 상태에서 행동 선택"""
        pass
    
    @abstractmethod
    def learn(self, state, action, reward, next_state, done):
        """경험으로부터 학습"""
        pass
    
    def save(self, path):
        """에이전트 모델 저장"""
        print(f"모델 저장 경로: {path}")
    
    def load(self, path):
        """에이전트 모델 로드"""
        print(f"모델 로드 경로: {path}")

class DesignEnvironment(Environment):
    """건축 디자인 최적화를 위한 강화학습 환경"""
    
    def __init__(self, design_size=5, max_steps=100):
        self.design_size = design_size  # 디자인 매개변수 수
        self.max_steps = max_steps
        self.current_step = 0
        self.state = None
        self.constraints = []
    
    def add_constraint(self, constraint_func):
        """디자인 제약 조건 추가"""
        self.constraints.append(constraint_func)
    
    def reset(self):
        """환경 재설정"""
        self.current_step = 0
        self.state = [random.uniform(0, 1) for _ in range(self.design_size)]
        return self.state
    
    def step(self, action):
        """디자인 조정 및 평가"""
        # 행동 적용 (디자인 매개변수 조정)
        for i, adjustment in enumerate(action):
            self.state[i] += adjustment
            # 범위 제한
            self.state[i] = max(0, min(1, self.state[i]))
        
        # 제약 조건 검사
        constraint_penalty = 0
        for constraint in self.constraints:
            if not constraint(self.state):
                constraint_penalty += 10
        
        # 보상 계산 (간소화된 예: 특정 목표 값에 가까울수록 높은 보상)
        target = [0.7, 0.5, 0.3, 0.6, 0.4][:self.design_size]
        design_quality = -sum((s - t) ** 2 for s, t in zip(self.state, target))
        
        # 전체 보상
        reward = design_quality - constraint_penalty
        
        # 다음 단계로 이동
        self.current_step += 1
        done = self.current_step >= self.max_steps
        
        return self.state, reward, done, {"step": self.current_step}
    
    def get_action_space(self):
        """행동 공간: 각 디자인 매개변수에 대한 조정 범위"""
        return {"type": "continuous", "size": self.design_size, "range": (-0.1, 0.1)}
    
    def get_state_space(self):
        """상태 공간: 디자인 매개변수 범위"""
        return {"type": "continuous", "size": self.design_size, "range": (0, 1)}
    
    def render(self):
        """현재 디자인 상태 출력"""
        design_params = [f"{p:.2f}" for p in self.state]
        print(f"디자인 상태: {design_params}, 단계: {self.current_step}/{self.max_steps}")

class RandomAgent(Agent):
    """무작위 행동을 선택하는 기본 에이전트"""
    
    def select_action(self, state):
        """무작위 행동 선택"""
        action_type = self.action_space["type"]
        action_size = self.action_space["size"]
        
        if action_type == "discrete":
            return random.randint(0, action_size - 1)
        else:  # 연속 행동 공간
            action_range = self.action_space["range"]
            return [random.uniform(action_range[0], action_range[1]) for _ in range(action_size)]
    
    def learn(self, state, action, reward, next_state, done):
        """학습하지 않음"""
        pass

class QLearningAgent(Agent):
    """Q-Learning 에이전트 (간소화된 구현)"""
    
    def __init__(self, action_space, state_space, learning_rate=0.1, discount_factor=0.9, 
                 exploration_rate=1.0, exploration_decay=0.995):
        super().__init__(action_space, state_space)
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.exploration_rate = exploration_rate
        self.exploration_decay = exploration_decay
        
        # 연속 상태를 이산화할 구간 수
        self.state_bins = 10
        
        # 연속 행동 공간을 이산화할 행동 수
        self.action_set = []
        action_range = action_space["range"]
        for _ in range(3):  # 각 매개변수당 3가지 행동 (감소, 유지, 증가)
            self.action_set.append([action_range[0], 0, action_range[1]])
        
        # Q-테이블 초기화
        self.q_table = {}
    
    def _discretize_state(self, state):
        """연속 상태를 이산화"""
        discretized = []
        for s in state:
            bin_idx = min(int(s * self.state_bins), self.state_bins - 1)
            discretized.append(bin_idx)
        return tuple(discretized)
    
    def select_action(self, state):
        """엡실론-그리디 정책으로 행동 선택"""
        discretized_state = self._discretize_state(state)
        
        # 탐색: 무작위 행동
        if random.random() < self.exploration_rate:
            action_idx = [random.randint(0, 2) for _ in range(len(state))]
            action = [self.action_set[i][idx] for i, idx in enumerate(action_idx)]
            return action
        
        # 활용: 최적 행동
        if discretized_state not in self.q_table:
            # 새로운 상태면 Q-테이블 초기화
            self.q_table[discretized_state] = {}
            action_idx = [random.randint(0, 2) for _ in range(len(state))]
        else:
            # 최대 Q-값을 가진 행동 선택
            q_values = self.q_table[discretized_state]
            if not q_values:  # 빈 딕셔너리면 무작위 행동
                action_idx = [random.randint(0, 2) for _ in range(len(state))]
            else:
                best_action = max(q_values, key=q_values.get)
                action_idx = [int(i) for i in best_action.split(",")]
        
        action = [self.action_set[i][idx] for i, idx in enumerate(action_idx)]
        return action
    
    def learn(self, state, action, reward, next_state, done):
        """Q-Learning 업데이트"""
        # 상태와 행동 이산화
        discrete_state = self._discretize_state(state)
        action_idx = []
        
        for i, a in enumerate(action):
            if abs(a - self.action_set[i][0]) < 1e-6:
                action_idx.append(0)
            elif abs(a - self.action_set[i][1]) < 1e-6:
                action_idx.append(1)
            else:
                action_idx.append(2)
        
        discrete_action = ",".join(map(str, action_idx))
        discrete_next_state = self._discretize_state(next_state)
        
        # Q-테이블 초기화
        if discrete_state not in self.q_table:
            self.q_table[discrete_state] = {}
        if discrete_action not in self.q_table[discrete_state]:
            self.q_table[discrete_state][discrete_action] = 0
        
        # 다음 상태의 최대 Q-값
        next_max_q = 0
        if discrete_next_state in self.q_table and self.q_table[discrete_next_state]:
            next_max_q = max(self.q_table[discrete_next_state].values())
        
        # Q-값 업데이트
        current_q = self.q_table[discrete_state][discrete_action]
        target_q = reward + self.discount_factor * next_max_q * (1 - done)
        self.q_table[discrete_state][discrete_action] += self.learning_rate * (target_q - current_q)
        
        # 탐색률 감소
        self.exploration_rate *= self.exploration_decay

def run_reinforcement_learning(env, agent, episodes=5):
    """강화학습 실행"""
    for episode in range(episodes):
        state = env.reset()
        total_reward = 0
        done = False
        
        print(f"\n에피소드 {episode+1}/{episodes} 시작")
        
        while not done:
            # 행동 선택
            action = agent.select_action(state)
            
            # 환경에서 한 단계 진행
            next_state, reward, done, info = env.step(action)
            
            # 현재 상태 시각화
            env.render()
            
            # 에이전트 학습
            agent.learn(state, action, reward, next_state, done)
            
            # 상태 업데이트
            state = next_state
            total_reward += reward
        
        print(f"에피소드 {episode+1} 종료: 총 보상 = {total_reward:.2f}")

# 디자인 환경 및 다양한 에이전트로 실험
design_env = DesignEnvironment(design_size=3, max_steps=10)

# 제약 조건 추가
design_env.add_constraint(lambda state: state[0] + state[1] <= 1.5)  # 첫 두 매개변수 합은 1.5 이하여야 함

# 행동 및 상태 공간 정보
action_space = design_env.get_action_space()
state_space = design_env.get_state_space()

print("=== 무작위 에이전트 ===")
random_agent = RandomAgent(action_space, state_space)
run_reinforcement_learning(design_env, random_agent, episodes=2)

print("\n=== Q-Learning 에이전트 ===")
q_agent = QLearningAgent(action_space, state_space)
run_reinforcement_learning(design_env, q_agent, episodes=3)
```

이 예제는 강화학습 프레임워크에서 다형성을 활용하는 방법을 보여줍니다. `Environment`와 `Agent`는 추상 기본 클래스로, 다양한 환경과 에이전트 구현이 동일한 인터페이스를 공유하게 합니다. 여기서 다형성을 통해 `run_reinforcement_learning` 함수는 어떤 타입의 환경이나 에이전트와도 작동할 수 있습니다.

<br>

### 8. 다형성의 이점

파이썬에서 다형성을 사용하면 다음과 같은 이점을 얻을 수 있습니다:

1. **코드 재사용성**: 동일한 인터페이스를 사용해 다양한 구현체와 작업할 수 있습니다.
2. **유연성과 확장성**: 기존 코드를 변경하지 않고 새로운 클래스를 추가할 수 있습니다.
3. **느슨한 결합**: 코드 모듈 간의 의존성이 줄어들어 유지보수가 용이해집니다.
4. **추상화 개선**: 구현 세부사항보다 인터페이스에 집중할 수 있습니다.
5. **테스트 용이성**: 모의 객체(Mock)를 사용하여 코드를 더 쉽게 테스트할 수 있습니다.
<br>

### 9. 다형성 사용 시 모범 사례

1. **명확한 인터페이스 정의**: 추상 기본 클래스나 프로토콜을 사용하여 인터페이스를 명확히 정의합니다.
2. **덕 타이핑 활용**: 파이썬의 동적 특성을 활용하되, 예상치 못한 동작을 방지하기 위해 적절한 타입 검사를 수행합니다.
3. **일관된 메서드 시그니처**: 오버라이드된 메서드의 매개변수와 반환 타입을 일관되게 유지합니다.
4. **리스코프 치환 원칙 준수**: 자식 클래스 객체는 부모 클래스 객체를 완전히 대체할 수 있어야 합니다.
5. **적절한 문서화**: 다형성을 사용하는 코드는 각 클래스와 메서드의 동작을 명확히 문서화해야 합니다.

<br>

### 10. 결론

다형성은 객체지향 프로그래밍의 중요한 원칙으로, 파이썬에서는 덕 타이핑, 메서드 오버라이딩, 연산자 오버로딩, 추상 기본 클래스 등 여러 방식으로 구현할 수 있습니다. 컴퓨테이셔널 디자인과 강화학습 같은 분야에서는 다형성을 활용하여 유연하고 확장 가능한 코드를 작성할 수 있습니다.

다형성을 효과적으로 사용하면 복잡한 시스템을 더 모듈화하고 유지보수하기 쉽게 만들 수 있으며, 새로운 기능을 추가할 때 기존 코드를 변경할 필요가 줄어듭니다. 파이썬의 동적 특성은 더욱 자유롭고 표현력 있는 다형성 구현을 가능하게 합니다.