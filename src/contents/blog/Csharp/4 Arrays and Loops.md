
<br>

### C# Arrays

C#에서 배열은 동일한 유형의 값 또는 객체를 가진 고정 길이의 순서가 있는 컬렉션을 나타내는 구조입니다.

배열은 대량의 데이터를 조직화하고 조작하는 데 편리합니다. 예를 들어, 100 개의 정수 변수를 만드는 대신, 모든 정수를 저장하는 배열 하나를 만들 수 있습니다!


```csharp
// `numbers` array that stores integers
int[] numbers = { 3, 14, 59 };

// 'characters' array that stores strings
string[] characters = new string[] { "Huey", "Dewey", "Louie" };
```


<br>


### Declaring Arrays

C# 배열 변수는 비 배열 변수 `non-array variable`와 유사하게 선언되지만, 유형 지정자 뒤에 대괄호(`[]`)를 추가하여 배열로 표시됩니다.

새로운 배열을 변수에 할당할 때는 `new` 키워드와 대괄호 안에 배열의 길이가 필요합니다. 중괄호(`{}`)를 사용하여 값으로 배열을 초기화할 수도 있습니다. 이 경우 배열의 길이를 명시할 필요가 없습니다.

```csharp
// Declare an array of length 8 without setting the values.
string[] stringArray = new string[8];

// Declare array and set its values to 3, 4, 5.
int[] intArray = new int[] { 3, 4, 5 };
```


<br>


### Declare and Initialize array

C#에서 배열을 선언하고 동시에 초기화하는 한 가지 방법은 중괄호(`{}`)로 둘러싸인 값들의 쉼표로 구분된 목록을 새로 선언된 배열에 할당하는 것입니다. 이 구문을 사용하면 할당된 변수의 오른쪽에 유형 서명과 `new` 키워드를 생략할 수 있습니다. 이것은 배열을 선언하는 동안에만 가능합니다.

```csharp
// `numbers` and `animals` are both declared and initialized with values.
int[] numbers = { 1, 3, -10, 5, 8 };
string[] animals = { "shark", "bear", "dog", "raccoon" };
```


<br>

### Array Element Access


C#에서 배열의 요소는 첫 번째 요소에 대해 0부터 차례로 레이블이 지정됩니다. 예를 들어, 배열의 3번째 요소는 2로 색인화되고, 배열의 6번째 요소는 5로 색인화됩니다.

특정 요소는 색인을 대괄호로 둘러싸고 대괄호 안에 색인을 넣어서 접근할 수 있습니다. 한 번 접근하면 해당 요소를 표현식에서 사용하거나 일반 변수처럼 수정할 수 있습니다.

```csharp
// Initialize an array with 6 values.
int[] numbers = { 3, 14, 59, 26, 53, 0 };

// Assign the last element, the 6th number in the array (currently 0), to 58.
numbers[5] = 58;

// Store the first element, 3, in the variable `first`.
int first = numbers[0];
```


<br>


### C# Array Length

C# 배열의 Length 속성은 특정 배열의 요소 수를 가져오는 데 사용할 수 있습니다.


```csharp
int[] someArray = { 3, 4, 1, 6 };
Console.WriteLine(someArray.Length); // Prints 4

string[] otherArray = { "foo", "bar", "baz" };
Console.WriteLine(otherArray.Length); // Prints 3
```



<br>

### C# For Loops

C#의 for 루프는 세 가지 표현식을 기반으로 지정된 횟수만큼의 명령을 실행합니다. 이 세 가지 표현식은 세미콜론으로 구분되며, 순서대로 다음과 같습니다:

1. 초기화 *Initialization* : 이것은 루프가 시작될 때 정확히 한 번 실행되며, 일반적으로 루프의 반복자 변수를 초기화하는 데 사용됩니다.
2. 중단 조건 *Stopping condition* : 이 부울 표현식은 각 반복 전에 확인되어 루프가 실행되어야 하는지 여부를 확인합니다.
3. 반복문 *Iteration statement* : 이것은 각 반복 후에 실행되며, 일반적으로 반복자 변수를 업데이트하는 데 사용됩니다.


```csharp
/* This loop initializes i to 1, 
stops looping once i is greater than 10, 
and increases i by 1 after each loop.*/
for (int i = 1; i <= 10; i++) {
  Console.WriteLine(i); 
}

Console.WriteLine("Ready or not, here I come!");
```


<br>


### C# For Each Loop

C#의 `foreach` 루프는 주어진 컬렉션의 각 요소에 대해 한 번씩 일련의 명령을 실행합니다. 예를 들어, 배열에 200개의 요소가 있으면 `foreach` 루프의 본문은 200번 실행됩니다. 각 반복이 시작될 때마다 현재 처리 중인 요소를 나타내는 변수가 초기화됩니다.

`foreach` 루프는 `foreach` 키워드로 선언됩니다. 다음으로, 괄호 안에 변수 유형과 변수 이름이 오고, 그 뒤에 `in` 키워드와 반복할 컬렉션이 옵니다.


```csharp
string[] states = { 
	"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado" 
};

foreach (string state in states) {
  // The `state` variable takes on the value of an element in `states` and updates every iteration.
  Console.WriteLine(state);
}
// Will print each element of `states` in the order they appear in the array.
```


<br>


### C# While Loop

C#에서 while 루프는 주어진 부울 표현식이 `true`로 평가되거나 루프 본문 내의 한 명령문(예: `break` 지시문)이 루프를 종료할 때까지 지속적으로 일련의 명령문을 실행합니다.

루프 본문이 전혀 실행되지 않을 수 있으므로, while 루프의 첫 번째 반복 전에 부울 조건이 평가됩니다.

while 루프를 선언하는 구문은 단순히 while 키워드 다음에 괄호 안에 부울 조건을 넣으면 됩니다.

```csharp
string guess = "";
Console.WriteLine("What animal am I thinking of?");

// This loop will keep prompting the user, until they type in "dog".
while (guess != "dog") {
Console.WriteLine("Make a guess:");
guess = Console.ReadLine();
}
Console.WriteLine("That's right!");
```


<br>


### C# Do While Loop
  
C#에서 while 루프는 주어진 부울 표현식이 true로 평가되거나 루프 본문 내의 한 명령문(예: break 지시문)이 루프를 종료할 때까지 지속적으로 일련의 명령문을 실행합니다.

루프 본문이 전혀 실행되지 않을 수 있으므로, while 루프의 첫 번째 반복 전에 부울 조건이 평가됩니다.

while 루프를 선언하는 구문은 단순히 while 키워드 다음에 괄호 안에 부울 조건을 넣으면 됩니다.


```csharp
do {
	DoStuff();
} while(boolCondition);

// This do-while is equivalent to the following while loop.

DoStuff();
	while (boolCondition) {
DoStuff();
}
```


<br>


### C# Infinite Loop

무한 루프는 종료 조건이 항상 false이기 때문에 종료되지 않는 루프입니다. 프로그램이 지속적으로 하나의 코드 청크를 실행하는 경우에는 무한 루프가 유용할 수 있습니다. 그러나 의도하지 않은 무한 루프는 프로그램이 루프에 갇혀 더 이상 응답하지 않게 되는 프로그램을 유발할 수 있습니다.

무한 루프에 갇힌 셸 또는 터미널에서 실행 중인 프로그램은 프로세스를 종료함으로써 종료할 수 있습니다.


```csharp
while (true) {
// This will loop forever unless it contains some terminating statement such as `break`.
}
```


<br>


### C# Jump Statements

  
Jump 문은 프로그래머가 프로그램의 제어 흐름을 추가적으로 제어할 수 있도록 하는 도구입니다. 이들은 루프의 맥락에서 루프를 종료하거나 루프의 일부를 건너뛰는 데 매우 일반적으로 사용됩니다.

제어 흐름 키워드에는 `break`, `continue` 및 `return`이 포함됩니다. 아래 코드 조각은 그들의 사용 예시를 제공합니다.

```csharp
while (true) {
	Console.WriteLine("This prints once.");
	// A `break` statement immediately terminates the loop that contains it.
	break;
}

for (int i = 1; i <= 10; i++) {
	// This prints every number from 1 to 10 except for 7.
	if (i == 7) {
	// A `continue` statement skips the rest of the loop and 
	// starts another iteration from the start.
	continue;
	}
	Console.WriteLine(i);
}

static int WeirdReturnOne() {
	while (true) {
		// Since `return` exits the method, the loop is also terminated. 
		// Control returns to the method's caller.
		return 1;
	}
}
```


