
<br>

### C# Classes

C#에서 클래스는 사용자 정의 형식을 생성하는 데 사용됩니다. 
클래스는 사용자 정의 형식에 포함되는 정보와 메서드의 종류를 정의합니다.

```csharp
using System;

namespace BasicClasses
{
		class Forest {
		public string name;
		public int trees;
		}
}

// Here we have the Forest class which has two pieces of data, called fields. 
// They are the "name" and "trees" fields.
```


<br>

### C# Constructor

C#에서 클래스의 인스턴스가 생성될 때마다 해당 클래스의 생성자가 호출됩니다. 메서드와 마찬가지로 생성자를 오버로드할 수 있습니다. 생성자는 포함하는 클래스와 동일한 이름을 가져야 합니다. 이는 다른 개수의 인수를 사용하는 추가 생성자를 정의하려는 경우에 유용합니다.

```csharp
// Takes two arguments
public Forest(int area, string country)
{
	this.Area = area;
	this.Country = country;
}

// Takes one argument
public Forest(int area)
{
	this.Area = area;
	this.Country = "Unknown";
}

// Typically, a constructor is used to set initial values and run any code needed to “set up” an instance.

// A constructor looks like a method, but its return type and method name are reduced to the name of the enclosing type.
```


<br>

### C# Parameterless Constructor

C#에서 클래스에 생성자가 지정되어 있지 않으면, 컴파일러가 자동으로 매개변수가 없는 생성자를 생성합니다.

```csharp
public class Freshman
{
	public string FirstName
	{ get; set; }
}

public static void Main (string[] args)
{
	Freshman f = new Freshman();
	// name is null
	string name = f.FirstName;
}

// In this example, no constructor is defined in Freshman, 
// but a parameterless constructor is still available for use in Main().
```


<br>

### C# Access Modifiers

C#에서 클래스의 멤버는 `public` 및 `private`와 같은 접근 제어자로 표시할 수 있습니다. `public` 멤버는 다른 클래스에서 액세스할 수 있습니다. `private` 멤버는 동일한 클래스의 코드에서만 액세스할 수 있습니다.

기본적으로 필드, 속성 및 메서드는 `private`이며, 클래스는 `public`입니다.


```csharp
public class Speech
{
	private string greeting = "Greetings";
	
	private string FormalGreeting()
	{
		return $"{greeting} and salutations";
	}

public string Scream()
	{
		return FormalGreeting().ToUpper();
	}
}

public static void Main (string[] args)
{
	Speech s = new Speech();
	//string sfg = s.FormalGreeting(); // Error!
	//string sg = s.greeting; // Error!
	Console.WriteLine(s.Scream());
}
/* 
In this example, greeting and FormalGreeting() are private. 
They cannot be called from the Main() method, which belongs to a different class. However the code within Scream() can access those members because Scream() is part of the same class.
*/
```


<br>

### C# Field

C#에서 필드는 객체 내에서 데이터 조각을 저장합니다. 이는 변수처럼 작동하며, 유형의 각 인스턴스마다 다른 값을 가질 수 있습니다.

필드는 `public`, `private`, `static`, `readonly`와 같은 여러 수정자를 가질 수 있습니다. 접근 제어자가 제공되지 않으면 필드는 기본적으로 `private`입니다.


```csharp
public class Person
{
   private string firstName;
   private string lastName;
}

// In this example, firstName and lastName are private fields of the Person class.

/* 
For effective encapsulation, a field is typically set to private, then accessed using a property. This ensures that values passed to an instance are validated (assuming the property implements some kind of validation for its field).
*/
```


<br>

### C# this Keyword

C#에서 this 키워드는 클래스의 현재 인스턴스를 참조합니다.

```csharp
// We can use the this keyword to refer to the current class’s members hidden by similar names:
public NationalPark(int area, string state)
{
	this.area = area;
	this.state = state;
}

// The code below requires duplicate code, which can lead to extra work and errors when changes are needed:
public NationalPark(int area, string state)
{
	area = area;
	state = state;
}

public NationalPark(int area)
{
	area = area;
	state = "Unknown";
}

// Use this to have one constructor call another:
public NationalPark(int area) : this (state, "Unknown")
{ }
```


<br>

### C# Members

In C#, 클래스에는 멤버가 포함되어 있습니다. 이 멤버들은 클래스에 저장되는 데이터의 종류와 클래스가 수행할 수 있는 동작을 정의합니다.

```csharp
class Forest
{
	public string name;
	public string Name
	{
		get { return name; }
		set { name = value; }
	}
}

/* 
A member of a class can be a field (like name), 
a property (like Name) or a method (like get()/set()). 
It can also be any of the following: 
*/
// Constants
// Constructors
// Events
// Finalizers
// Indexers
// Operators
// Nested Types
```



<br>

### C# Dot Notation

In C#, a member of a class can be accessed with dot notation.

```csharp
string greeting = "hello";

// Prints 5
Console.WriteLine(greeting.Length);

// Returns 8
Math.Min(8, 920);
```


<br>

### C# Class Instance

In C#, an object is an _instance_ of a class. An object can be created from a class using the `new` keyword.

```csharp
Burger cheeseburger = new Burger();
// If a class is a recipe, then an object is a single meal made from that recipe.

House tudor = new House();
// If a class is a blueprint, then an object is a house made from that blueprint.
```


<br>

### C# Property

In C#, a _property_ is a member of an object that controls how one field may be accessed and/or modified. A property defines two methods: a `get()` method that describes how a field can be accessed, and a `set()` method that describes how a field can be modified.

One use case for properties is to control access to a field. Another is to validate values for a field.


```csharp
public class Freshman
{
	private string firstName;
	
	public string FirstName
	{
		get { return firstName; }
		set { firstName = value; }
	}
}

public static void Main (string[] args) {
	Freshman f = new Freshman();
	f.FirstName = "Louie";
	
	// Prints "Louie"
	Console.WriteLine(f.FirstName);
}

// In this example, FirstName is a property
```


### C# Auto-Implemented Property

In C#, an _auto-implemented_ property reads and writes to a private field, like other properties, but it does not require explicit definitions for the accessor methods nor the field. It is used with the `{ get; set; }` syntax. This helps your code become more concise.

```csharp
public class HotSauce
{
	public string Title
	{ get; set; }
	public string Origin
	{ get; set; }
}

// In this example, Title and Origin are auto-implemented properties. Notice that a definition for each field (like private string title) is no longer necessary. A hidden, private field is created for each property during runtime.
```


### C# Static Constructor

In C#, a _static constructor_ is run once per type, not per instance. It must be parameterless. It is invoked before the type is instantiated or a static member is accessed.

```csharp
class Forest
{
	static Forest()
	{
		Console.WriteLine("Type Initialized");
	}
}

// In this class, either of the following two lines would trigger the static constructor (but it would not be triggered twice if these two lines followed each other in succession):
Forest f = new Forest();
Forest.Define();
```



### C# Static Class

In C#, a _static_ class cannot be instantiated. Its members are accessed by the class name.

This is useful when you want a class that provides a set of tools, but doesn’t need to maintain any internal data.

`Math` is a commonly-used static class


```csharp
//Two examples of static classes calling static methods:

Math.Min(23, 97);
Console.WriteLine("Let's Go!");
```

