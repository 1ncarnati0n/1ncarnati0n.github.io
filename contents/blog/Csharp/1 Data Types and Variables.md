
<br>

### `.ToUpper()` in "C#"

C#에서 `.ToUpper()`는 문자열의 모든 문자를 대문자로 변환하는 문자열 메서드입니다. 문자에 대문자로 대응하는 문자가 없는 경우 변경되지 않은 상태로 유지됩니다. 예를 들어 특수 기호는 변경되지 않습니다.

```csharp
string str2 = "This is C# Program xsdd_$#%";

// string converted to Upper case 
string upperstr2 = str2.ToUpper();

//upperstr2 contains "THIS IS C# PROGRAM XSDD_$#%"
```


<br>

### `IndexOf()` in "C#"

C#에서 `IndexOf()` 메서드는 문자열에서 지정된 문자의 인덱스 위치를 찾는 데 사용되는 문자열 메서드입니다. 문자를 찾을 수 없는 경우 이 메서드는 -1을 반환합니다.

```csharp
string str = "Divyesh"; 

// Finding the index of character  
// which is present in string and 
// this will show the value 5 
int index1 = str.IndexOf('s');

Console.WriteLine("The Index Value of character 's' is " + index1); 
//The Index Value of character 's' is 5
```

<br>

### Bracket Notation

문자열에는 문자가 포함됩니다. 이러한 문자 값에 액세스할 수 있는 한 가지 방법은 **대괄호 표기법** 입니다. 이러한 문자를 별도의 변수에 저장할 수도 있습니다.

문자열의 *대괄호*를 사용하여 원하는 문자의 인덱스 위치를 *대괄호* 사이에 넣으면 특정 문자에 액세스할 수 있습니다. 예를 들어 첫 번째 문자를 가져오려면 `variable[0]` 을 지정하면 됩니다. 마지막 문자를 얻으려면 문자열의 길이에서 1을 빼면 됩니다.

```csharp
// Get values from this string.
string value = "Dot Net Perls";

//variable first contains letter D 
char first = value[0];

//Second contains letter o
char second = value[1];

//last contains letter s
char last = value[value.Length - 1];
```


<br>

### Escape Character Sequences in "C#"

C#에서 이스케이프 시퀀스는 백슬래시 `\` 로 시작하여 문자 또는 숫자로 이어지는 문자의 조합을 의미합니다. 프로그램이 문자열의 일부로 특정 문자를 읽도록 하는 데 사용됩니다. 
예를 들어 콘솔에 출력하려는 문자열 내에 따옴표를 포함할 때 사용할 수 있습니다. 이스케이프 시퀀스는 특정 문자를 사용하여 다른 작업을 수행할 수 있습니다. `\n` 은 새 줄을 만드는 데 사용됩니다.

<br>

### Substring() in "C#"

C#에서 `Substring()`은 원래 데이터를 그대로 유지하면서 문자열의 일부를 검색하는 데 사용되는 문자열 메서드입니다. 검색한 부분 문자열은 변수에 저장하여 프로그램의 다른 곳에서 사용할 수 있습니다.

```csharp
string myString = "Divyesh";
string test1 = myString.Substring(2);
```

<br>

### String Concatenation in "C#"

연결은 한 문자열을 다른 문자열의 끝에 추가하는 프로세스입니다. C#에서 두 문자열을 추가하는 가장 간단한 방법은 `+` 연산자를 사용하는 것입니다.

```csharp
// Declare strings
string firstName = "Divyesh";
string lastName = "Goardnan";

// Concatenate two string variables
string name = firstName + " " + lastName;

Console.WriteLine(name);
//Ths code will output Divyesh Goardnan
```


<br>

### `.ToLower()` in "C#"

C#에서 `.ToLower()`는 모든 문자를 소문자로 변환하는 문자열 메서드입니다. 문자에 해당하는 소문자가 없는 경우 변경되지 않은 상태로 유지됩니다. 예를 들어 특수 기호는 변경되지 않습니다.

```csharp
string mixedCase = "This is a MIXED case string.";

// Call ToLower instance method, which returns a new copy.
string lower = mixedCase.ToLower();

//variable lower contains "this is a mixed case string."
```


<br>

### String Length in "C#"

문자열 클래스에는 문자열의 문자 수를 반환하는 `Length` 속성이 있습니다.

```csharp
string a = "One example";
Console.WriteLine("LENGTH: " + a.Length);
// This code outputs 11
```


<br>

### 문열 보간
**String Interpolation in "C#"**

문자열 **보간 Interpolation** 은 형식이 지정된 문자열을 만드는 데 더 읽기 쉽고 편리한 구문을 제공합니다. 문자열 중간에 변수 값과 표현식을 삽입할 수 있으므로 구두점이나 공백에 대해 걱정할 필요가 없습니다.

```csharp
int id = 100

// We can use an expression with a string interpolation.
string multipliedNumber = $"The multiplied ID is {id * 10}.";

Console.WriteLine(multipliedNumber);
// This code would output "The multiplied ID is 1000."
```


<br>

### String New-Line

C# 문자열 안에서 `\n` 문자 조합은 새 줄 문자를 나타냅니다.

예를 들어 `Console.WriteLine()`에 `"Hello\nWorld"`를 전달하면 콘솔에서 `Hello`와 `World`가 별도의 줄에 인쇄됩니다.

```csharp
Console.WriteLine("Hello\nWorld");

// The console output will look like:
// Hello
// World
```


<br>

### Variables and Types

변수는 프로그램에서 나중에 사용하기 위해 컴퓨터의 메모리에 데이터를 저장하는 방법입니다. C#은 타입-안전 언어로, 변수를 선언할 때 데이터 타입을 정의해야 합니다.

변수의 타입을 선언함으로써, 예를 들어 `string`이 필요한 곳에 `int`가 사용되거나 그 반대의 경우처럼 변수가 잘못 사용될 때 프로그램이 실행되는 것을 컴파일러가 막을 수 있습니다.

```csharp
string foo = "Hello";
string bar = "How are you?";
int x = 5;

Console.WriteLine(foo);
// Prints: Hello
```


<br>

### `Console.ReadLine()`

`Console.ReadLine()` 메서드는 사용자 입력을 가져오는 데 사용됩니다. 사용자 입력은 변수에 저장할 수 있습니다. 이 메서드는 사용자에게 키보드의 `ENTER` 키를 누르라는 메시지를 표시하는 데에도 사용할 수 있습니다.

```csharp
Console.WriteLine("Enter your name: ");

string name = Console.ReadLine();
```


<br>

### Comments
Comments - 주석은 실행되지 않는 텍스트 조각입니다. 이 줄은 메모를 남기고 프로그램의 가독성을 높이는 데 사용할 수 있습니다.
 
- 한 줄 주석은 두 개의 슬래시 `//`로 작성됩니다.
- 여러 줄 주석은 `/*`로 시작하여 `*/`로 끝납니다. 이는 큰 블록의 코드를 주석 처리하는 데 유용합니다.

``` csharp
// This is a single line comment

/* This is a multi-line comment
   and continues until the end
   of comment symbol is reached */
```


<br>


### `Console.WriteLine()`

Console.WriteLine() 메서드는 콘솔에 텍스트를 출력하는 데 사용됩니다. 또한 다른 데이터 유형과 변수에 저장된 값도 출력하는 데 사용할 수 있습니다.

```csharp
Console.WriteLine("Hello, world!");

// Prints: Hello, world!
```


<br>


### Arithmetic Operators

산술 연산자는 숫자 값을 수정하는 데 사용됩니다:

- `+` 덧셈 연산자
- `-` 뺄셈 연산자
- `*` 곱셈 연산자 
- `/` 나눗셈 연산자 
- `%` 모듈로 연산자 (나머지를 반환)

```csharp
int result;

result = 10 + 5;  // 15
result = 10 - 5;  // 5
result = 10 * 5;  // 50
result = 10 / 5;  // 2
result = 10 % 5;  // 0
```


<br>

### `Math.Sqrt()`

`Math.Sqrt()`는 지정된 값의 제곱근을 계산하는 데 사용되는 `Math class` 메서드입니다.

```csharp
double x = 81; 

Console.Write(Math.Sqrt(x)); 
// Prints: 9
```


<br>

### Unary Operator

연산자는 결합하여 더 짧은 문장을 만들고 기존 변수를 빠르게 수정할 수 있습니다. 
두 가지 일반적인 예:
- `++` 연산자는 값을 증가 시킵니다. 
- `--` 연산자는 값을 감소 시킵니다.

```csharp
int a = 10;
a++;

Console.WriteLine(a);
// Prints: 11
```


<br>

### `Math.Pow()`

`Math.Pow()`는 숫자를 지정된 거듭제곱으로 올리는 데 사용되는 Math 클래스 메서드입니다. 이 메서드는 double 형식의 숫자를 반환합니다.

```csharp
double pow_ab = Math.Pow(6, 2); 

Console.WriteLine(pow_ab); 
// Prints: 36
```
