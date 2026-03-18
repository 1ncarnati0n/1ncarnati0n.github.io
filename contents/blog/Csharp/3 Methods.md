
<br>

### Optional Parameters

C#에서는 메서드에 선택적 매개변수를 지정할 수 있습니다. 매개변수가 선택적이라면 해당 매개변수의 선언에 기본 인수가 지정됩니다. 선택적 매개변수를 갖는 메서드는 해당 매개변수에 대한 인수를 전달하거나 전달하지 않고 호출할 수 있습니다. 선택적 매개변수에 대한 인수를 전달하지 않고 메서드를 호출하면 해당 매개변수는 기본값으로 초기화됩니다.

선택적 매개변수를 정의하려면 매개변수 선언 뒤에 등호를 사용하고 그 뒤에 기본값을 지정하면 됩니다.


```csharp
// y and z are optional parameters.
static int AddSomeNumbers(int x, int y = 3, int z = 2)
{
	return x + y + z;
}

// Any of the following are valid method calls.
AddSomeNumbers(1); // Returns 6.
AddSomeNumbers(1, 1); // Returns 4.
AddSomeNumbers(3, 3, 3); // Returns 9.
```


<br>


### Variables Inside Methods


메서드 내부에서 선언된 매개변수와 변수는 메서드의 본문 외부에서 사용할 수 없습니다. 이를 시도하면 프로그램을 컴파일하는 동안 오류가 발생합니다!


```csharp
static void DeclareAndPrintVars(int x)
{
	int y = 3;
	// Using x and y inside the method is fine.
	Console.WriteLine(x + y);
}
static void Main()
{
	DeclareAndPrintVars(5);
	// x and y only exist inside the body of DeclareAndPrintVars, 
	// so we cannot use them here.
	Console.WriteLine(x * y);
}
```



<br>


### Return Keyword


C#에서는 return 문을 사용하여 메서드에서 값을 호출자에게 반환할 수 있습니다.

return이 호출되면 현재 메서드가 종료되고 제어가 메서드가 원래 호출된 위치로 반환됩니다. 메서드에서 반환되는 값은 메서드 선언에서 지정된 반환 유형과 일치해야 합니다.


```csharp
static int ReturnAValue(int x)
{
  // We return the result of computing x * 10 back to the caller.
  // Notice how we are returning an int, which matches the method's return type.
  return x * 10;
}

static void Main()
{
  // We can use the returned value any way we want, such as storing it in a variable.
  int num = ReturnAValue(5);
  // Prints 50 to the console.
  Console.WriteLine(num);
}
```



<br>


### Expression-Bodied Methods

  
C#에서는 *expression-bodied methods* 를 사용하여 특별한 간결한 구문을 사용하여 짧은 메서드를 작성할 수 있습니다. 메서드 본문이 단일 문장 또는 표현식으로 구성되어 있을 때만 메서드를 표현 본문 형식으로 작성할 수 있습니다. 본문이 단일 표현식인 경우 해당 표현식이 메서드의 반환 값으로 사용됩니다.

일반적인 구문은 `returnType funcName(args...) => expression;`입니다. 중괄호 대신 "fat arrow" 표기법인 `=>`가 사용됩니다. 또한 표현식이 암시적으로 반환되기 때문에 `return` 키워드가 필요하지 않습니다.


```csharp
static int Add(int x, int y)
{
	return x + y;
}

static void PrintUpper(string str)
{
	Console.WriteLine(str.ToUpper());
}

// The same methods written in expression-body form.
static int Add(int x, int y) => x + y;

static void PrintUpper(string str) => Console.WriteLine(str.ToUpper());
```


<br>


### Lambda Expressions

람다 표현식(lambda expression)은 다른 값이나 표현식처럼 처리되는 코드 블록입니다. 메서드에 전달되거나 변수에 저장되며, 메서드 내부에서 생성될 수 있습니다.

특히, 람다 표현식은 이름이 없는 익명 메서드를 생성하여 메서드 인수로 전달해야 하는 메서드에 유용합니다. 람다 표현식의 간결한 구문은 일회성 메서드 인수로 사용될 때 일반 메서드를 선언하는 것보다 우아합니다.


```csharp
int[] numbers = { 3, 10, 4, 6, 8 };
static bool isTen(int n) {
	return n == 10;
}

// `Array.Exists` calls the method passed in for every value in `numbers` and returns true if any call returns true.
Array.Exists(numbers, isTen);

Array.Exists(numbers, (int n) => {
	return n == 10;
});

// Typical syntax
// (input-parameters) => { <statements> }
```


<br>


### Shorter Lambda Expressions

람다 표현식의 간결한 구문을 줄이는 여러 가지 방법이 있습니다.

1. 매개변수의 유형은 유추될 수 있는 경우 제거할 수 있습니다.
2. 매개변수가 하나만 있는 경우 괄호를 제거할 수 있습니다.

부가적으로, 람다에 대해서도 표현 본문 형식에 대한 일반적인 규칙이 적용됩니다.


```csharp
int[] numbers = { 7, 7, 7, 4, 7 };

Array.Find(numbers, (int n) => { return n != 7; });

// The type specifier on `n` can be inferred based on the array being passed in and the method body.
Array.Find(numbers, (n) => { return n != 7; });

// The parentheses can be removed since there is only one parameter.
Array.Find(numbers, n => { return n != 7; });

// Finally, we can apply the rules for expression-bodied methods.
Array.Find(numbers, n => n != 7);
```



<br>


### Void Return Type


C#에서 값이 반환되지 않는 메서드는 void 반환 유형을 갖습니다. void는 int나 string과 같은 실제 데이터 유형이 아니며, 출력 또는 값이 없음을 나타냅니다.

```csharp
// This method has no return value
static void DoesNotReturn()
{
	Console.WriteLine("Hi, I don't return like a bad library borrower.");
}

// This method returns an int
static int ReturnsAnInt()
{
	return 2 + 3;
}
```


<br>


### Method Declaration

C#에서 메서드 선언은 메서드 본문을 제외한 메서드에 관한 모든 내용을 포함합니다. 메서드 선언에는 다음이 포함됩니다:

- 메서드 이름 - the method name
- 매개변수 유형 - parameter types
- 매개변수 순서 - parameter order
- 매개변수 이름 - parameter names
- 반환 유형 - return type
- 선택적인 수정자 - optional modifiers

자주 보게 되는 메서드 선언 중 하나는 `Main` 메서드의 선언입니다 (`Main` 선언에는 하나 이상의 유효한 형태가 있음을 유의하세요): `static void Main(string[] args)`


<br>


### Out Parameters

`return` 문은 하나의 값만 반환할 수 있습니다. 여러 값이 필요한 경우에는 `out` 매개변수를 사용할 수 있습니다.

`out` 매개변수는 메서드 헤더에 `out`로 접두사를 붙입니다. 호출될 때, 각 `out` 매개변수에 대한 인수는 `out`으로 접두사가 붙은 변수여야 합니다.

`out` 매개변수는 전달된 변수들의 별칭이 됩니다. 따라서 매개변수에 값을 할당할 수 있고, 메서드가 종료된 후에도 전달된 변수들에 값이 유지됩니다.

```csharp
// f1, f2, and f3 are out parameters, so they must be prefixed with `out`.
static void GetFavoriteFoods(out string f1, out string f2, out string f3)
{
	// Notice how we are assigning values to the parameters instead of using `return`.
	f1 = "Sushi";
	f2 = "Pizza";
	f3 = "Hamburgers";
}

static void Main()
{
	string food1;
	string food2;
	string food3;
	// Variables passed to out parameters must also be prefixed with `out`.
	GetFavoriteFoods(out food1, out food2, out food3);
	// After the method call, food1 = "Sushi", food2 = "Pizza", and food3 = "Hamburgers".
	Console.WriteLine($"My top 3 favorite foods are {food1}, {food2}, and {food3}");
}
```


