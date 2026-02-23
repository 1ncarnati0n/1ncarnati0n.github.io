---
title: "1. About Python"
date: 2024-01-01
tags: []
draft: false
---

### Intro
1989년 12월, 네덜란드의 컴퓨터과학자 귀도 반 로섬 Guido Van Rossum은 여러 프로그래밍 언어들의 한계로 인해 괴로워 하다 크리스마스 프로젝트로 새로운 언어를 직접 만들어 탄생하게 되었다.

1. 읽기 쉬워야 한다. 중괄호로 묶기보다는 깔끔하게 '인덴트'로 처리한 공백으로 둘러쌌다. 
2. 사용자가 원하는 모듈 패키지를 만들 수 있어야 했으며 다른 프로그램에서 사용할 수 있게 했다. 

나중에 이 방식은 계속 발전해 `easy_install`을 거쳐 `pip`를 통해 패키지 인덱스를 제공하는 형태로 완성됐으며 다른 수많은 언어에 까지 영향을 끼쳤다.


최근 딥러닝의 물결과 함께 사실상 인공지능을 주도하는 표준 언어로 주목받고 있다.

 파이썬은 한쪽에서는 입문용으로 초등학생들이 배우고, 한쪽에서는 컴퓨터과학 박사들이 세계 최고 수준의 학회에 제출할 논문을 작성하는데 사용한다. 그야말로 현존하는 어떠한 언어도 이뤄내지 못했던 일들을 파이썬이 해내고 있다.

<br>

### 인덴트
파이썬의 대표적인 특징이기도 한 인덴트Indent는 공식 가이드인 PEP8에 따라 공백 4칸을 원칙으로 한다.

``` python
foo = long_functton_name(var_one, var_two, var_three, var_four)

def long_function_name(var_one, var_two, var_three, var_four):
    print(var_one)

foo = long_function_name(var_one, var_two, var_three, var_four)

```

<br>

### 네이밍 컨벤션
파이썬의 변수명 네이밍컨벤션 Naming Convention은 자바와 달리 각 단어를 밑줄`_` 로 구분하여 표기하는 스네이크 케이스 Snake Case를 따른다 이는 함수명도 마찬가지다. 

``` python
first_name = "이름"
last_name = '성'
```
<br>

### 타입 힌트
파이썬은 대표적인 동적타이핑 언어임에도, 
타입을 지정할 수 있는 **'타입힌트 type Hint 가 PEP484문서에 추가됨.**

``` python
a: str = '1'
b: int = 1

def fn(a):
def fn(a: int) -> bool:
```

<br>

### 리스트 컴프리헨션
파이썬은 map, filter 와 같은 함수형Functional 기능을 지원하며 다음과 같은 *'람다 표현식 Lambda Expression'* 도 지원한다.

```python 
list(map(lambda x: x + 10, [1, 2, 3]))
-------------------
>>> [11, 12, 13]
```

JAVA는 2014년에 출시된 8버전에 이르러서야 람다표현식을 지원한데 반해, 파이썬은 이미 1.0 버전, 1994년부터 람다를 지원했을 만큼 오래됐다. 그러나 사실 파이썬의 훨씬 더 유용한 기능은 **리스트컴프리헨션** **List Comprehension**이다. **리스트컴프리헨션**이란 기존 리스트를 기반으로 새로운 리스트를 만들어내는 구문이다.

다음은 홀수인 경우 2를 곱해 출력하라는 리스트 컴프리헨션이다.
```python
[n * 2 for n in range(1, 10 + 1) if n % 2 == 1]
-------------------
>>> [2, 6, 10, 14, 18]
```
만약, 리스트컴프리헨션을 사용하지 않는다면
```python
a = []
for n in range(1, 10 + 1):
	if n % 2 == 1:
		a.append(n * 2)
return a
-------------------
>>> [2, 6, 10, 14, 18]
```

python 버전 2.7 이후에는 다음과 같이 리스트 외에도 딕셔너리 등이 가능하도록 추가됐다.
``` python
a = {}
for key, value in original.items():
	a[key] = value
```
이는 다음과 같이 처리할 수 있다.
```python
a = {key: value for key, value in original.items()}
```

<br>

### 제너레이터
루프의 반복iteration 동작을 제어할 수 있는 루틴 형태를 말한다.
```python 
def get_natural_number():
	n = 0
	while True
		n += 1
		yield n
```
이 경우 함수의 리턴 값은 다음과 같이 제너레이터가 된다.
```bash
>>> get_natural_number()
<generator object get_natural_number at 0xl0d3139d0>
```
만약 다음 값을 생성하려면 `next()`로 추출하면 된다. 

예를 들어 100개의 값을 생성하고 싶다면 다음과 같이 100번 동안 next()를 수행하면 된다.
```python
g = get_natural_number()

for _ in range(0, 100):
	print(next(g))
```

```
...
...
1
2
3
...
98
99
100
```

```
>>> def generator():
...    yield 1
```

<br>

### range
제너레이터의 방식을 활용하는 대표적인 함수로 `range()`가 있다. 주로 for 문에서 쓰이는 range() 함수의 쓰임은 다음과 같다.
```python
>>> list(range(5))
[0, 1, 2, 3, 4]
>>> range(5)
range(0, 5)
>>> type(range(5))
<class 'range'>
>>> for i in range(5):
...    print(i, end=' ')
...
0 1 2 3 4
```

파이썬2.x 버전까지는 `range()` 함수가 지금과 같은 형태가 아니었다. 
숫자를 미리생성해서 리스트 리턴하는 방식이었고(파이썬3.x의 `list(range(x))` 결과와 동일하다) 제너레이터를 리턴하는 방식은 `xrange()`라고 따로 존재했다. Python 버전3 이후, `range()` 함수가 제너레이터 역할을 하는 `range` 클래스를 리턴하는형태로 변경됐고 `xrange()` 함수는 사라졌다.

만약 생성할 숫자가 100개쯤 된다면 어떻게될까? 메모리에서 적지않은 공간을 차지할 것이고 생성시간도 오래 걸릴 것이다. 그러나 제너레이터를 리턴하듯 range 클래스를 리턴하면 그렇지 않다.

```python
a = [n for n in range(1000000)]
b = range(1000000)
```

```python
>>> len(a)
1000000
>>> len(b)
1000000
>>> len(a) == len(b)
True
```


<br>

### enumerate
`enumerate()`는 ‘열거하다’는 뜻의 함수로, 여러 가지 자료형(list, set, tuple 등)을 ==인덱스== 를 포함한 enumerate 객체로 리턴한다.

```python
>>> a = [1, 2, 3, 2, 45, 2, 5]
>>> enumerate(a) 
<enumerate object at 0xlOlOf83fO>

>>> list(enumerate(a)) 
[(0, 1), (1, 2), (2, 3), (3, 2), (4, 45), (5, 2), (6, 5)]
```

```python
for i, e in enumerate(a):
    print(i, v)
```

<br>

###  나눗셈 연산자 `//`
`//` 연산자가 바로 과거 파이썬 2 이하 버전의 나눗셈 연산자 `/`와 동일한 역할을 한다. 정수형을 나눗셈할 때 동일한 정수형을 결과로 리턴하면서 내림<sup>Floor Division</sup> 연산자의 역할을 한다. ==다시 말해 몫<sup>Quotient</sup>을 구하는 연산자==다.

<br>
### pass
파이썬에서 pass는 널 연산수이 Operation으로 아무것도 하지 않는 기능이다. 이처럼 아무역할을 하지 않는 pass를 지정하면, 앞서 발생한 인덴트 오류 같은 불필요한 오류를 방지할 수 있다. 이렇게 pass는 먼저 목업mockup 인터페이스부터 구현한 다음에 추후 구현을 진행할 수 있게 한다.

<br>

### locals
`locals()`는 로컬 심볼 테이블 딕셔너리를 가져오는 메소드로 업데이트 또한 가능하다. 로컬에 선언된 모든 변 수를 조회할 수 있는 강력한 명령어로 디버깅에 많은 도움이 된다.

`pprint`로 출력하게 되면 보기 좋게 줄바꿈 처리를 해주기 때문에 가독성이 높다.
```python
import pprint
pprint.pprint(locals())
```

```bash
{'nums': [2, 7, 11, 15], 
'pprint': <module 'pprint' from '/usr/lib/python3.8/pprint.py'>, 
'self': <__main__.Solution object at 0x7f0994769d90>, 
'target': 9}
```


<br>

### 리스트 컴프리헨션
파이썬을 대표하는 특징 중 하나이자, 매우 강력한 기능

```python
strls = [strl[i:i + 2].lower() for i in range(len(strl) - 1) if re.findall('[a-z]{2}', strl[i:i + 2].lower())]
```
- 좋지 않은 예제

```python
strls = [
    strl[i:i + 2].lower() for i in range(len(strl) - 1) 
    if re.findall('[a-z]{2}', strl[i:i + 2].lower())
    ]
```

```python
strl = []
for i in range(len(strl) - 1):
    if re.findall('[a-z]{2}', strl[i:i + 2].lower()):
        strls.append(strl[i:i + 2].lower())
```