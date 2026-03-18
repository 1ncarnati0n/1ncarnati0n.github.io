
<br>

### 조건문 If Statements

C#에서 if 문은 괄호 안에 제공된 부울 표현식이 참`true`인지 거짓`false`인지에 따라 코드 블록을 실행합니다.
표현식이 참`true`이면 중괄호 `{}` 안의 코드 블록이 실행됩니다. 그렇지 않으면 코드 블록은 건너뛰어집니다.

```csharp
if (true) {
// This code is executed.
Console.WriteLine("Hello User!");
}

if (false) {
// This code is skipped.
Console.WriteLine("This won't be seen :(");
}
```


<br>

### Break Keyword

C#에서 `break` 키워드의 용도 중 하나는 `switch / case` 블록을 빠져나와 `switch` 코드 블록 이후에 프로그램 실행을 재개하는 것입니다. C#에서는 `switch` 문 안의 각 `case` 코드 블록을 `break` 키워드(또는 다른 점프 문)로 종료해야 하며, 그렇지 않으면 프로그램이 컴파일되지 않습니다. 특정 `case`에 해당하는 모든 명령이 실행된 후에 `break` 키워드를 호출해야 합니다.

```csharp
string color = "blue";

switch (color) {
  case "red":
    Console.WriteLine("I don't like that color.");
    break;
  case "blue":
    Console.WriteLine("I like that color.");
    break;
  default:
    Console.WriteLine("I feel ambivalent about that color.");
    break;
}

// Regardless of where the break statement is in the above switch statement, 
// breaking will resume the program execution here.
Console.WriteLine("- Steve");
```


<br>

### 비교 연산자 Comparison Operators

비교 연산자(*comparison operator*)는 이름이 암시하듯 두 표현식을 비교하고 비교 결과에 따라 `true` 또는 `false`를 반환합니다. 예를 들어, 두 `int` 값을 비교하면 한 숫자가 다른 숫자보다 큰지, 또는 두 숫자가 같은지를 테스트할 수 있습니다. 마찬가지로, 한 `string`이 다른 `string`과 동일한지 테스트할 수 있습니다.

```csharp
int x = 5;
Console.WriteLine(x < 6); // Prints "True" because 5 is less than 6.
Console.WriteLine(x > 8); // Prints "False" because 5 is not greater than 8.

string foo = "foo";
Console.WriteLine(foo == "bar"); // Prints "False" because "foo" does not equal "bar".
```



<br>

### Switch Statements

`switch` 문은 하나의 표현식을 평가하고, 그 결과를 각 `case`와 일치시키려고 시도하여 어떤 코드 블록을 실행할지 결정하는 제어 흐름 구조입니다. 일반적으로, case에 주어진 값이 평가된 표현식과 같을 때, 즉 두 값 사이에 `==` 연산이 `true`를 반환할 때 코드 블록이 실행됩니다. `switch` 문은 모든 조건이 하나의 값에 대한 동등성을 테스트할 때 `if else` 구조를 대체하는 데 자주 사용됩니다.

```csharp
// The expression to match goes in parentheses.
switch (fruit) {
  case "Banana":
    // If fruit == "Banana", this block will run.
    Console.WriteLine("Peel first.");
    break;
  case "Durian":
    Console.WriteLine("Strong smell.");
    break;
  default:
    // The default block will catch expressions that did not match any above.
    Console.WriteLine("Nothing to say.");
    break;
}

// The switch statement above is equivalent to this:
if (fruit == "Banana") {
  Console.WriteLine("Peel first.");
} else if (fruit == "Durian") {
  Console.WriteLine("Strong smell.");  
} else {
  Console.WriteLine("Nothing to say.");
}
```



<br>

### Boolean Expressions

부울 표현식(boolean expression)은 평가되어 부울 값(boolean value)을 반환하는 모든 표현식을 의미합니다.

```csharp
// These expressions all evaluate to a boolean value.
// Therefore their values can be stored in boolean variables.

bool a = (2 > 1);
bool b = a && true;
bool c = !false || (7 < 8);
```


<br>

### Boolean Type

부울`bool` 데이터 유형은 참`true` 또는 거짓`false` 중 하나일 수 있으며, 모든 논리 문장의 유효성은 참 또는 거짓 중 하나여야 한다는 개념에 기반합니다.

부울은 논리학의 원리를 컴퓨터에 인코딩하여 프로그램에서 논리적 추론을 가능케 합니다. 일반적으로 컴퓨터는 특정 문장의 참과 거짓을 인코딩하고, 이 정보를 기반으로 프로그램의 동작을 완전히 변경할 수 있습니다.


```csharp
bool skyIsBlue = true;
bool penguinsCanFly = false;
Console.WriteLine($"True or false, is the sky blue? {skyIsBlue}.");
/* This simple program illustrates how booleans are declared. 
However, the real power of booleans requires additional programming 
constructs such as conditionals. */
```


<br>


### Logical Operators

논리 연산자는 불리언 표현식을 입력으로 받고 불리언 값을 반환합니다.

- `&&` 연산자는 두 개의 불리언 표현식을 받고 둘 다 `true`로 평가될 때에만 `true`를 반환합니다.
- `||` 연산자는 두 개의 불리언 표현식을 받고 둘 중 하나가 `true`로 평가될 때 `true`를 반환합니다.
- `!` 연산자는 하나의 불리언 표현식을 받고 그 반대의 값을 반환합니다.

```csharp
// These variables equal true.
bool a = true && true;
bool b = false || true;
bool c = !false;

// These variables equal false.
bool d = true && false;
bool e = false || false;
bool f = !true;
```


<br>

### 진리표 Truth Tables

진리표 `truth table`는 부울 논리를 시각화하는 방법입니다. 부울 값은 두 가지 가능한 값을 가지므로, 단항 및 이항 부울 연산자에 대한 모든 가능한 입력 및 출력 쌍을 테이블에 간결하게 나열할 수 있습니다.

아래 이미지는 AND, OR 및 NOT 연산자에 대한 진리표를 제공합니다. 각 행에서 마지막 열은 다른 열이 해당 연산자의 입력으로 제공된 경우의 출력을 나타냅니다.

**AND**

| A     | B     | A and B |
| ----- | ----- | ------- |
| false | false | false   |
| false | true  | false   |
| true  | false | false   |
| true  | true  | true    |

<br>


### Else Clause

`else` 다음에 중괄호 `{}`가 따르고 코드 블록이 포함되어 있는 것을 `else` 절이라고 합니다. `else` 절은 항상 `if` 문에 선행되어야 합니다.

중괄호 내의 블록은 동반하는 `if` 조건식의 표현식이 `false`일 때만 실행됩니다. `if` 문 내의 코드가 실행되지 않은 경우에만 실행되는 코드를 작성하는 데 유용합니다.

```csharp
if (true) {
	// This block will run.
	Console.WriteLine("Seen!");
} else {
	// This will not run.
	Console.WriteLine("Not seen!");
}

if (false) {
	// Conversely, this will not run.
	Console.WriteLine("Not seen!");
} else {
	// Instead, this will run.
	Console.WriteLine("Seen!");
}
```


<br>

### If and Else If

여러 `if` 및 `else` 문을 작성할 때 일반적인 패턴은 또 다른 중첩된 `if` 문을 포함하는 `else` 블록을 가지는 것입니다. 이러한 패턴을 C#에서 더 잘 표현하는 방법은 `else if` 문을 사용하는 것입니다. `true`로 평가되는 첫 번째 조건은 해당 코드 블록을 실행합니다. `true`로 평가되는 조건이 없는 경우, 선택적으로 지정된 `else` 블록이 존재하는 경우에만 해당 블록이 실행됩니다.


```csharp
int x = 100, y = 80;

if (x > y)
{
	Console.WriteLine("x is greater than y");
}
else if (x < y)
{
	Console.WriteLine("x is less than y");
}
else
{
Console.WriteLine("x is equal to y");
}
```


<br>

### Conditional Control

조건문 또는 조건 제어 구조는 프로그램이 특정 조건을 충족하는지 여부에 따라 다른 동작을 수행할 수 있도록 합니다.

직관적으로 이것은 사람이 간단한 결정을 내리고 그에 따라 행동하는 방식을 모방합니다. 예를 들어, 밖으로 나갈지 여부를 판단하는 것은 다음과 같을 수 있습니다:

조건: 밖이 비가 오는가? 만약 밖이 비가 오면, 우산을 가져가세요. 그렇지 않으면, 우산을 가져가지 마세요. 우리는 "날씨가 맑으면, 선크림을 바르세요"와 같이 더 정교한 추론을 추가할 수 있습니다.


<br>

### Control Flow

프로그래밍에서 제어 흐름(control flow)은 문장과 명령문이 실행되는 순서를 말합니다. 프로그래머는 조건문과 같은 제어 구조를 사용하여 프로그램의 제어 흐름을 변경할 수 있습니다.

프로그램의 제어 흐름을 변경할 수 있는 능력은 프로그램의 상태에 따라 실행 중인 프로그램의 동작을 조정할 수 있기 때문에 강력합니다. 예를 들어, 사용자가 은행 애플리케이션을 사용하여 $500을 인출하려고 하는 경우를 가정해 보겠습니다. 사용자의 은행 계좌에 $20 또는 $1000이 있는지에 따라 애플리케이션이 다르게 동작하는 것이 바람직합니다!


<br>

### Ternary Operator

C#에서 삼항 연산자 *ternary operator* 는 다음과 같은 특별한 구문입니다: `condition ? expression1 : expression2`.

이는 하나의 부울 조건과 두 개의 표현식을 입력으로 받습니다. `if` 문과는 달리, 삼항 연산자는 표현식 자체입니다. 조건이 참`true`이면 첫 번째 입력 표현식을 평가하고, 거짓`false`이면 두 번째 입력 표현식을 평가합니다.

```csharp
bool isRaining = true;
// This sets umbrellaOrNot to "Umbrella" if isRaining is true,
// and "No Umbrella" if isRaining is false.
string umbrellaOrNot = isRaining ? "Umbrella" : "No Umbrella";

// "Umbrella"
Console.WriteLine(umbrellaOrNot);
```

