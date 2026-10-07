# Java Object-Oriented Programming (OOP) Active Recall Questionnaire

A comprehensive active recall questionnaire consisting of **150 structured certification questions** covering core Java OOP principles, inheritance, polymorphism, constructor chaining, operator precedence, string and StringBuilder manipulation, collections, loops, and exception handling.

---

## Part 1: Inheritance, Abstract Classes & Overloading
*Abstract classes, Beetle exoskeleton hierarchy, TurtleFrog references, and method overloading rules. (Questions 1–10)*

### Question 1
**Prompt:** Consider the following Java code:



What is the result when this code is compiled?

```java
interface HasExoskeleton {
abstract int getNumberOfSections();
}
abstract class Insect implements HasExoskeleton {
abstract int getNumberOfLegs():
}
public class Beetle extends Insect  {
int getNumberOfLegs()  {
return 6;
}
}
```

**Choices:**
- **A:** It compiles and runs without an issue.
- **B:** There is a compile error at line 02.
- **C:** There is a compile error at line 04.
- **D:** There is a compile error at line 07.
- **E:** It compiles but throws an exception.

**Answer:** D (There is a compile error at line 07.)

**Explanation:** Beetle is a concrete class and does not implement getNumberOfSections() inherited from HasExoskeleton.

---

### Question 2
**Prompt:** In Java, an abstract class implements an interface but does not provide an implementation for every inherited abstract method. What may the abstract class do?

**Choices:**
- **A:** Remain abstract and defer the implementation.
- **B:** Become final and defer the implementation.
- **C:** Change the interface into a concrete class.
- **D:** Override only methods with return values.
- **E:** Declare every inherited method private.

**Answer:** A (Remain abstract and defer the implementation.)

**Explanation:** An abstract class is permitted to defer the implementation of interface methods to its subclasses.

---

### Question 3
**Prompt:** In the code involving HasExoskeleton, Insect, and Beetle, which method must Beetle implement before it can be a concrete class?

**Choices:**
- **A:** getNumberOfLegs() only
- **B:** getNumberOfSections() only
- **C:** Both inherited methods
- **D:** Neither inherited method
- **E:** The interface constructor

**Answer:** C (Both inherited methods (or B: getNumberOfSections() only))

**Explanation:** A concrete class must implement all inherited abstract methods; in this specific code, getNumberOfSections() is the missing implementation.

---

### Question 4
**Prompt:** Consider these Java declarations:



Which declaration can replace the blank and allow the code to compile?

```java
public interface CanHop {}
public class Frog implements CanHop  {
}
public class HornedFrog extends Frog  {
}
public class TurtleFrog extends Frog  {
}
public class Test  {
public static void main(String[] args) {
____ frog = new TurtleFrog():
}
}
```

**Choices:**
- **A:** Frog
- **B:** HornedFrog
- **C:** String
- **D:** Long

**Answer:** A (Frog)

**Explanation:** TurtleFrog extends Frog, so Frog is a valid superclass reference type.

---

### Question 5
**Prompt:** Using the declarations Frog implements CanHop and TurtleFrog extends Frog which relationship makes a variable of type CanHop able to reference a TurtleFrog object?

**Choices:**
- **A:** TurtleFrog inherits the CanHop type through Frog.
- **B:** CanHop inherits all classes from TurtleFrog.
- **C:** Frog objects cannot implement interfaces.
- **D:** TurtleFrog must extend CanHop directly.

**Answer:** A (TurtleFrog inherits the CanHop type through Frog.)

**Explanation:** A subclass inherits all interface implementations from its superclasses.

---

### Question 6
**Prompt:** For the statement Frog frog = new TurtleFrog(). what is the declared type of the variable frog?

**Choices:**
- **A:** The superclass type Frog
- **B:** The subclass type TurtleFrog
- **C:** The interface type CanHop
- **D:** The reference type Object

**Answer:** A (The superclass type Frog)

**Explanation:** The declared type (reference type) of variable frog is Frog.

---

### Question 7
**Prompt:** // method body continues Does printName(int) override printName(double)?

```java
class Arthropod {
public void printName(double input) {
System.out.print("Arthropod"):
}
}
public class Spider extends Arthropod  {
public void printName(int input)  {
}
}
```

**Choices:**
- **A:** Yes, because both methods share the same name.
- **B:** Yes, because int converts to double automatically.
- **C:** No, because their parameter types differ.
- **D:** No, because subclasses cannot declare methods.
- **E:** No, because printName must return a value.

**Answer:** C (No, because their parameter types differ.)

**Explanation:** Overriding requires the exact same parameter types; different parameters result in method overloading.

---

### Question 8
**Prompt:** The superclass declares printName(double), while Spider declares printName(int). What Java feature do these two declarations demonstrate?

**Choices:**
- **A:** Method overloading across an inheritance hierarchy
- **B:** Constructor chaining between two classes
- **C:** Field hiding between related classes
- **D:** Interface implementation by a subclass
- **E:** Exception handling with overloaded catches

**Answer:** A (Method overloading across an inheritance hierarchy)

**Explanation:** Defining methods with the same name but different parameter types across superclass and subclass is method overloading.

---

### Question 9
**Prompt:** Suppose the incomplete Spider method prints "Spider". If a Spider object receives a call printName(4), which method is selected based on the visible signatures?

**Choices:**
- **A:** The Spider method with an int parameter
- **B:** The Arthropod method with a double parameter
- **C:** Both methods execute in superclass order
- **D:** Neither method can accept the argument
- **E:** The constructor method executes instead

**Answer:** A (The Spider method with an int parameter)

**Explanation:** The argument 4 is an int, matching the Spider method signature printName(int) exactly.

---

### Question 10
**Prompt:** A programmer wants the Beetle class in the first code sample to compile as a concrete class while preserving its inheritance structure. Which change is sufficient?

**Choices:**
- **A:** Implement getNumberOfSections() in Beetle.
- **B:** Remove getNumberOfLegs() from Insect.
- **C:** Change Insect from abstract to final.
- **D:** Remove the HasExoskeleton interface.
- **E:** Change Beetle into an interface.

**Answer:** A (Implement getNumberOfSections() in Beetle.)

**Explanation:** Beetle already implements getNumberOfLegs(); implementing getNumberOfSections() completes all abstract methods.

---

## Part 2: Abstract Classes vs. Interfaces Foundations
*Contracts, instantiation rules, extends vs implements keywords, and concrete subclass duties. (Questions 11–20)*

### Question 11
**Prompt:** Which feature is common to both abstract classes and interfaces in Java?

**Choices:**
- **A:** They can contain public static final variables
- **B:** They must contain only abstract methods
- **C:** They cannot contain any static methods
- **D:** They must be instantiated directly

**Answer:** A (They can contain public static final variables)

**Explanation:** Both abstract classes and interfaces can declare constants (public static final fields).

---

### Question 12
**Prompt:** Which keyword is used when one interface inherits from another interface?

**Choices:**
- **A:** extends
- **B:** implements
- **C:** inherits
- **D:** super

**Answer:** A (extends)

**Explanation:** An interface inherits from another interface using the extends keyword.

---

### Question 13
**Prompt:** Why can neither an abstract class nor an interface be instantiated directly?

**Choices:**
- **A:** They may contain unimplemented methods
- **B:** They are always declared final
- **C:** They cannot contain variables
- **D:** They must inherit from an interface

**Answer:** A (They may contain unimplemented methods)

**Explanation:** Abstract classes and interfaces can contain abstract methods without bodies, so they cannot be instantiated directly.

---

### Question 14
**Prompt:** A concrete subclass extends an abstract class that declares three abstract methods. What must the concrete subclass do to compile?

```java
A concrete subclass extends an abstract class that declares three abstract methods. What must the concrete subclass do to
```

**Choices:**
- **A:** Implement all three inherited abstract methods
- **B:** Declare all three methods as static
- **C:** Convert the superclass into an interface
- **D:** Instantiate the abstract superclass first

**Answer:** A (Implement all three inherited abstract methods)

**Explanation:** A concrete subclass must provide implementations for every inherited abstract method.

---

### Question 15
**Prompt:** Which statement correctly distinguishes a concrete subclass from an abstract subclass?

**Choices:**
- **A:** concrete subclass provides implementations for inherited abstract methods
- **B:** concrete subclass cannot override inherited methods
- **C:** concrete subclass must always be declared final
- **D:** concrete subclass cannot implement an interface

**Answer:** A (A concrete subclass provides implementations for inherited abstract methods)

**Explanation:** Concrete subclasses cannot leave any inherited abstract methods unimplemented.

---

### Question 16
**Prompt:** Which type can replace the blank in '____ frog = new TurtleFrog();' so the assignment compiles?

```java
public interface CanHop {}
public class Frog implements CanHop {}
public class HornedFrog extends Frog {}
public class TurtleFrog extends Frog {}

public class Test {
    public static void main(String[] args) {
        ____ frog = new TurtleFrog();
    }
}
```

**Choices:**
- **A:** Frog
- **B:** HornedFrog
- **C:** CanHop
- **D:** String

**Answer:** A or C (Frog or CanHop)

**Explanation:** Both Frog and CanHop are valid supertypes of TurtleFrog and allow the assignment to compile.

---

### Question 17
**Prompt:** Using the declarations 'Frog implements CanHop' and 'TurtleFrog extends Frog', which statement best explains why 'CanHop frog = new TurtleFrog();' compiles?

```java
public interface CanHop {}
public class Frog implements CanHop {}
public class TurtleFrog extends Frog {}

CanHop frog = new TurtleFrog();
```

**Choices:**
- **A:** TurtleFrog inherits Frog's implementation of CanHop
- **B:** CanHop is a superclass of TurtleFrog
- **C:** Interfaces can be instantiated through any constructor
- **D:** TurtleFrog automatically becomes a String

**Answer:** A (TurtleFrog inherits Frog's implementation of CanHop)

**Explanation:** Through inheritance from Frog, TurtleFrog is also an instance of CanHop.

---

### Question 18
**Prompt:** A class implements an interface containing 'public abstract void makeSound();. What must a concrete implementing class provide?

**Choices:**
- **A:** public method named makeSound with no return value
- **B:** private method named makeSound returning String
- **C:** static method named makeSound returning boolean
- **D:** constructor named makeSound with no parameters

**Answer:** A (A public method named makeSound with no return value)

**Explanation:** Implementing methods cannot reduce visibility (must be public) and must match the void return type.

---

### Question 19
**Prompt:** A programmer wants to create a subclass that inherits an abstract method but does not implement it yet. Which declaration is appropriate?

**Choices:**
- **A:** Declare the subclass abstract
- **B:** Declare the subclass final
- **C:** Declare the subclass static
- **D:** Declare the subclass private

**Answer:** A (Declare the subclass abstract)

**Explanation:** If a subclass does not implement an inherited abstract method, it must be declared abstract.

---

### Question 20
**Prompt:** Suppose a concrete subclass inherits one abstract method from a superclass and also inherits one abstract method from an interface. What is required for successful compilation?

**Choices:**
- **A:** The subclass must implement both abstract methods
- **B:** The subclass must implement only the superclass method
- **C:** The subclass must implement only the interface method
- **D:** The subclass must declare itself as an interface

**Answer:** A (The subclass must implement both abstract methods)

**Explanation:** A concrete class must implement all inherited abstract methods from both superclasses and interfaces.

---

## Part 3: Interface Inheritance & Default Methods
*Interface extension chains, default method resolution, Owl isBlind() dispatch, and overloading. (Questions 21–30)*

### Question 21
**Prompt:** What does the declaration public interface CanBark extends HasVocalCords indicate about CanBark?

**Choices:**
- **A:** It inherits the method declarations from HasVocalCords
- **B:** It inherits only private methods from HasVocalCords
- **C:** It prevents classes from implementing HasVocalCords
- **D:** It must be declared as an abstract class instead

**Answer:** A (It inherits the method declarations from HasVocalCords)

**Explanation:** A child interface inherits all method signatures from its parent interface.

---

### Question 22
**Prompt:** Given the following declarations:



Which methods must a concrete class implementing CanBark provide?

```java
interface HasVocalCords {
    void makeSound();
}
interface CanBark extends HasVocalCords {
    void bark();
}
```

**Choices:**
- **A:** Only bark()
- **B:** Only makeSound()
- **C:** Both makeSound() and bark()
- **D:** Neither method because interfaces provide implementations

**Answer:** C (Both makeSound() and bark())

**Explanation:** A concrete class implementing CanBark must fulfill all methods from CanBark and HasVocalCords.

---

### Question 23
**Prompt:** Which pair of modifiers is implicitly applied to an ordinary abstract method declared in a Java interface?

**Choices:**
- **A:** public and abstract
- **B:** protected and static
- **C:** private and default
- **D:** public and static

**Answer:** A (public and abstract)

**Explanation:** Ordinary methods in Java interfaces are implicitly public and abstract.

---

### Question 24
**Prompt:** What value is printed by this program?

```java
interface Nocturnal {
    default boolean isBlind() {
        return true;
    }
}
public class Owl implements Nocturnal {
    public boolean isBlind() {
        return false;
    }
    public static void main(String[] args) {
        Nocturnal nocturnal = (Nocturnal) new Owl();
        System.out.print(nocturnal.isBlind());
    }
}
```

**Choices:**
- **A:** true
- **B:** false
- **C:** Compile error at the default method
- **D:** Compile error at the cast

**Answer:** B (false)

**Explanation:** Polymorphism ensures that the overridden method in Owl executes at runtime.

---

### Question 25
**Prompt:** What is printed by this program?

```java
class Arthropod {
    public void printName(double input) {
        System.out.print("Arthropod");
    }
}
class Spider extends Arthropod {
    public void printName(int input) {
        System.out.print("Spider");
    }
    public static void main(String[] args) {
        Spider spider = new Spider();
        spider.printName(4.0);
        spider.printName(9);
    }
}
```

**Choices:**
- **A:** SpiderArthropod
- **B:** ArthropodSpider
- **C:** ArthropodArthropod
- **C:** SpiderSpider

**Answer:** B (ArthropodSpider)

**Explanation:** spider.printName(4.0) calls printName(double) in Arthropod; spider.printName(9) calls printName(int) in Spider.

---

### Question 26
**Prompt:** In the Spider program, why does spider.printName(4.0) call the method declared in Arthropod rather than the method declared in Spider?

**Choices:**
- **A:** The double argument matches Arthropod's parameter exactly
- **B:** The subclass method always runs before superclass methods
- **C:** Java converts every double argument into an int
- **D:** The Spider method is hidden because it is public

**Answer:** A (The double argument matches Arthropod's parameter exactly)

**Explanation:** 4.0 is a double literal, matching printName(double).

---

### Question 27
**Prompt:** Suppose the statement 'spider.printName(9);' in the Spider program is changed to 'spider.printName(9.0);'. What will be printed by the two calls, in order? spider.printName(4.0); spider.printName(9.0);

```java
spider.printName(4.0);
spider.printName(9.0);
```

**Choices:**
- **A:** ArthropodSpider
- **B:** SpiderArthropod
- **C:** ArthropodArthropod
- **D:** SpiderSpider

**Answer:** C (ArthropodArthropod)

**Explanation:** Both 4.0 and 9.0 are doubles, so both calls invoke printName(double) in Arthropod.

---

### Question 28
**Prompt:** A concrete class implements CanBark, where CanBark extends HasVocalCords. Neither interface supplies a default implementation. What is the most likely result if the class defines bark() but not makeSound()?

**Choices:**
- **A:** The class fails to compile because makeSound() is unimplemented
- **B:** The class compiles and inherits makeSound() automatically
- **C:** The class runs but throws an error only when barking
- **D:** The interface hierarchy is ignored by the compiler

**Answer:** A (The class fails to compile because makeSound() is unimplemented)

**Explanation:** A concrete class must implement all inherited abstract methods in the interface hierarchy.

---

### Question 29
**Prompt:** Consider the following declarations:
A class implementing that interface declares:



Which implementation is selected when an object of the class invokes isBlind()?

```java
interface Nocturnal {
    default boolean isBlind() {
        return true;
    }
}
public boolean isBlind() {
    return false;
}
```

**Choices:**
- **A:** The class implementation returning false
- **B:** The interface implementation returning true
- **C:** Neither implementation; the method becomes abstract
- **D:** Both implementations execute and combine their results

**Answer:** A (The class implementation returning false)

**Explanation:** A class method implementation always overrides an interface default method.

---

### Question 30
**Prompt:** A variable has static type Arthropod and refers to a Spider object. The variable is used to call printName(4.0), where Arthropod defines printName(double) and Spider defines only printName(int). Which method is selected?

**Choices:**
- **A:** Arthropod's printName(double) method
- **B:** Spider's printName(int) method
- **C:** Both methods execute in sequence
- **D:** The call produces a compile-time error

**Answer:** A (Arthropod's printName(double) method)

**Explanation:** Spider only overloads printName(int); the reference type Arthropod calls printName(double).

---

## Part 4: Interface Modifiers, Final Methods & Object State
*Implicit public/static/final modifiers, Reptile layEggs() final constraint, and Orca polymorphism. (Questions 31–40)*

### Question 31
**Prompt:** What modifiers are implicitly applied to every variable declared in a Java interface?

**Choices:**
- **A:** public, static, and final
- **B:** protected, static, and final
- **C:** private, static, and final
- **D:** public, abstract, and final

**Answer:** A (public, static, and final)

**Explanation:** All variables declared in an interface are implicitly constants: public, static, and final.

---

### Question 32
**Prompt:** Which statement correctly describes a concrete subclass in Java?

**Choices:**
- **A:** It must implement inherited abstract methods
- **B:** It must declare every inherited method final
- **C:** It must contain at least one abstract method
- **D:** It must implement every interface default method

**Answer:** A (It must implement inherited abstract methods)

**Explanation:** A concrete subclass cannot contain any unimplemented abstract methods.

---

### Question 33
**Prompt:** Why can an abstract class not be instantiated directly?

**Choices:**
- **A:** It may contain methods without implementations
- **B:** Its required to contain only static methods
- **C:** It cannot declare constructors for subclasses
- **D:** Its automatically treated as an interface

**Answer:** A (It may contain methods without implementations)

**Explanation:** Abstract classes represent incomplete types and cannot be instantiated directly.

---

### Question 34
**Prompt:** Which statement about methods in Java interfaces is correct?

**Choices:**
- **A:** An interface may contain default and static methods
- **B:** Every interface method must remain abstract
- **C:** An interface may contain protected instance methods
- **D:** Every interface method must be declared final

**Answer:** A (An interface may contain default and static methods)

**Explanation:** Since Java 8, interfaces can define default and static methods with concrete bodies.

---

### Question 35
**Prompt:** Consider this Java code:



What happens when this code is compiled?

```java
class Reptile {
public final void layEggs() {
System.out.print( Reptile Laying Eggs');
}
}
class Lizard extends Reptile {
public void layEggs() {
System.out.print("Lizard Laying Eggs'):
}
}
```

**Choices:**
- **A:** It produces the reptile message
- **B:** It produces the lizard message
- **C:** It reports an error in the overnde
- **D:** It reports an error when creating Lizard

**Answer:** C (It reports an error in the override)

**Explanation:** A final method in a superclass cannot be overridden by a subclass.

---

### Question 36
**Prompt:** Suppose the method layEggs() in Reptile were not declared final. For the following statements, what would be printed?

```java
Reptile reptile = new Lizard();
reptile.layEggs();
```

**Choices:**
- **A:** Reptile Laying Eggs
- **B:** Lizard Laying Eggs
- **C:** No message is printed
- **D:** The code cannot compile

**Answer:** B (Lizard Laying Eggs)

**Explanation:** When layEggs() is not final, Lizard overrides it and polymorphism calls Lizard's method.

---

### Question 37
**Prompt:** What is printed by this Java program?

```java
abstract class Whale {
    public abstract void dive();
}
class Orca extends Whale {
    public void dive() {
        System.out.print("Orca diving");
    }
}
// in main:
Whale whale = new Orca();
whale.dive();
```

**Choices:**
- **A:** Whale diving
- **B:** Orca diving
- **C:** No output is produced
- **D:** compile error is produced

**Answer:** B (Orca diving)

**Explanation:** whale refers to an Orca instance; calling whale.dive() executes Orca's dive() method.

---

### Question 38
**Prompt:** A developer needs a parent type that can provide shared instance state and implemented behavior while also requiring subclasses to implement selected methods. Which design best fits this requirement?

**Choices:**
- **A:** An abstract class with fields and abstract methods
- **B:** An interface containing only constant variables
- **C:** A concrete class containing only abstract methods
- **D:** A static utility class containing default methods

**Answer:** A (An abstract class with fields and abstract methods)

**Explanation:** Only classes can maintain instance fields (shared instance state) while enforcing abstract methods.

---

### Question 39
**Prompt:** A class implements an interface that provides a default implementation for a method. What must the class do?

**Choices:**
- **A:** It must always override the default method
- **B:** It may use the default implementation without overriding
- **C:** It must declare the method as private and final
- **D:** It must convert the interface into an abstract class

**Answer:** B (It may use the default implementation without overriding)

**Explanation:** A class implementing an interface inherits its default methods automatically.

---

### Question 40
**Prompt:** Which statement accurately compares Java abstract classes and interfaces?

**Choices:**
- **A:** Both can be instantiated directly by subclasses
- **B:** Both can declare public static final variables
- **C:** Both inherit implementation from java.lang Object
- **D:** Both require every method to be abstract

**Answer:** B (Both can declare public static final variables)

**Explanation:** Both abstract classes and interfaces can define public static final constant fields.

---

## Part 5: Class Extension, Constructors & Overloading
*Platypus super() constructor chaining, superclass constructor rules, and ClownFish gill overloading. (Questions 41–50)*

### Question 41
**Prompt:** Which statement about a concrete subclass is correct?

**Choices:**
- **A:** It may be declared abstract or final
- **B:** It must always be declared abstract
- **C:** It cannot be declared final
- **D:** It must implement another interface

**Answer:** A (It may be declared abstract or final)

**Explanation:** A concrete subclass can be declared final to prevent further extension.

---

### Question 42
**Prompt:** What must a concrete subclass do when it inherits an abstract method from a superclass or interface?

**Choices:**
- **A:** Override the method with an implementation
- **B:** Declare the method as private
- **C:** Remove the method from the parent type
- **D:** Convert the method into a constructor

**Answer:** A (Override the method with an implementation)

**Explanation:** A concrete class must provide a concrete implementation for any inherited abstract method.

---

### Question 43
**Prompt:** Which declaration correctly shows one interface extending another interface?

**Choices:**
- **A:** interface CanBark extends HasVocalCords { }
- **B:** interface CanBark implements HasVocalCords { }
- **C:** class CanBark extends HasVocalCords { }
- **D:** interface HasVocalCords extends CanBark { }

**Answer:** A (interface CanBark extends HasVocalCords { })

**Explanation:** An interface inherits another interface using the extends keyword.

---

### Question 44
**Prompt:** What methods must a concrete class that implements CanBark provide?

```java
interface HasVocalCords {
    void makeSound();
}
interface CanBark extends HasVocalCords {
    void bark();
}
```

**Choices:**
- **A:** Implement both makeSound() and bark()
- **B:** Implement only makeSound()
- **C:** Implement only bark()
- **D:** Implement neither inherited method

**Answer:** A (Implement both makeSound() and bark())

**Explanation:** A concrete class implementing CanBark must implement all methods from CanBark and HasVocalCords.

---

### Question 45
**Prompt:** An abstract class implements HasVocalCords, which declares void makeSound(). What is true if the abstract class does not implement that method?

**Choices:**
- **A:** The abstract class may leave it unimplemented
- **B:** The interface declaration becomes invalid
- **C:** The class must become final
- **D:** The method is automatically made static

**Answer:** A (The abstract class may leave it unimplemented)

**Explanation:** An abstract class can defer implementing interface methods to its subclasses.

---

### Question 46
**Prompt:** What happens when an interface extends another interface in Java?

**Choices:**
- **A:** The child interface inherits the parent interface's method requirements
- **B:** The parent interface becomes a concrete class
- **C:** The child interface must use implements instead
- **D:** The parent interface loses all declared methods

**Answer:** A (The child interface inherits the parent interface's method requirements)

**Explanation:** The sub-interface inherits all method contracts from the parent interface.

---

### Question 47
**Prompt:** Why does this code fail to compile?

```java
class Mammal {
    public Mammal(int age) {
        System.out.print("Mammal");
    }
}
public class Platypus extends Mammal {
    public Platypus() {
        System.out.print("Platypus");
    }
}
```

**Choices:**
- **A:** The constructor implicitly calls unavailable Mammal()
- **B:** The subclass cannot contain a no-argument constructor
- **C:** The print statement must appear after construction
- **D:** subclass cannot extend a class with parameters

**Answer:** A (The constructor implicitly calls unavailable Mammal())

**Explanation:** Platypus implicitly calls super(), but Mammal has no no-argument constructor.

---

### Question 48
**Prompt:** How can the Platypus constructor be corrected so that it can invoke the available superclass constructor?

**Choices:**
- **A:** Use super(0); before the print statement
- **B:** Use this(0); after the print statement
- **C:** Add final before the constructor
- **D:** Replace extends with implements

**Answer:** A (Use super(0); before the print statement)

**Explanation:** Explicitly calling super(0); invokes the available Mammal(int age) constructor.

---

### Question 49
**Prompt:** Assume the Mammal class has a valid no-argument constructor. When new Platypus() is executed and the superclass constructor prints "Mammal" while the subclass constructor prints Platypus', what is printed?

**Choices:**
- **A:** MammalPlatypus
- **B:** PlatypusMammal
- **C:** Mammal only
- **D:** Platypus only

**Answer:** A (MammalPlatypus)

**Explanation:** The superclass constructor executes first, followed by the subclass constructor.

---

### Question 50
**Prompt:** Which statement best describes the relationship between the two methods?

```java
interface Aquatic {
    default int getNumberOfGills(int input) {
        return 2;
    }
}
class ClownFish implements Aquatic {
    public int getNumberOfGills() {
        return 4;
    }
}
```

**Choices:**
- **A:** They are overloaded because their parameter lists differ
- **B:** The class method overrides the default method
- **C:** The class fails because interfaces cannot have defaults
- **D:** The class method replaces the default method despite different parameters

**Answer:** A (They are overloaded because their parameter lists differ)

**Explanation:** getNumberOfGills(int) and getNumberOfGills() have different parameter lists, so they are overloaded.

---

## Part 6: Interface Access Rules, Visibility & Polymorphism
*Implicit interface modifiers, default returns, Owl casting semantics, and access privilege weakening. (Questions 51–60)*

### Question 51
**Prompt:** For an abstract method declared in a Java interface, which access modifier is implicitly applied?

**Choices:**
- **A:** public
- **B:** protected
- **C:** private
- **D:** package-private

**Answer:** A (public)

**Explanation:** Abstract methods in interfaces are implicitly public.

---

### Question 52
**Prompt:** What does the default keyword provide for a method in a Java interface?

**Choices:**
- **A:** method implementation
- **B:** private constructor
- **C:** static field
- **D:** An abstract class

**Answer:** A (A method implementation)

**Explanation:** The default keyword allows an interface method to supply a concrete body.

---

### Question 53
**Prompt:** Given the interface:



What value does the default method return?

```java
interface Nocturnal {
    default boolean isBlind() {
        return true;
    }
}
```

**Choices:**
- **A:** true
- **B:** false
- **C:** 0
- **D:** null

**Answer:** A (true)

**Explanation:** The default method explicitly returns true.

---

### Question 54
**Prompt:** A class named Owl implements Nocturnal and overrides isBlind() to return false. If a Nocturnal reference refers to an Owl object, what does nocturnal.isBlind() return?

**Choices:**
- **A:** false
- **B:** true
- **C:** null
- **D:** compile-time error

**Answer:** A (false)

**Explanation:** Polymorphism calls the overridden method in Owl, which returns false.

---

### Question 55
**Prompt:** Why does the call nocturnalisBlind() use Owl's implementation rather than the interface default implementation?

**Choices:**
- **A:** The object overrides the method
- **B:** The reference hides the method
- **C:** The cast changes the method
- **D:** The interface is abstract

**Answer:** A (The object overrides the method)

**Explanation:** The runtime object Owl overrides the default interface method.

---

### Question 56
**Prompt:** What is the result of assigning a newly created Owl object to a Nocturnal reference?

**Choices:**
- **A:** The assignment is valid
- **B:** The assignment needs inheritance
- **C:** The assignment causes an error
- **D:** The assignment creates two objects

**Answer:** A (The assignment is valid)

**Explanation:** Owl implements Nocturnal, so assigning an Owl instance to a Nocturnal reference is a valid upcast.

---

### Question 57
**Prompt:** In Nocturnal nocturnal = (Nocturnal) new Owl();, what is the main effect of the explicit cast?

**Choices:**
- **A:** It treats the object as Nocturnal
- **B:** It converts the object to text
- **C:** It invokes the default method
- **D:** It changes the object's class

**Answer:** A (It treats the object as Nocturnal)

**Explanation:** The cast treats the object through the Nocturnal reference type.

---

### Question 58
**Prompt:** If Owl did not override isBlind(), what would new Owl().isBlind() return when the inherited interface default method is used?

**Choices:**
- **A:** true
- **B:** false
- **C:** 8
- **D:** compile-time error

**Answer:** A (true)

**Explanation:** If not overridden, the inherited default method in Nocturnal returns true.

---

### Question 59
**Prompt:** The method getNumberOfGills(int input) always returns the string "8". What does getNumberOfGills(-1) return?

**Choices:**
- **A:** "8"
- **B:** -1
- **C:** 8
- **D:** A null value

**Answer:** A ("8")

**Explanation:** The method always returns the string "8" regardless of input.

---

### Question 60
**Prompt:** Suppose Owl declares boolean isBlind() without the public modifier while implementing the interface method. What is the most likely result?

**Choices:**
- **A:** compile-time error
- **B:** The method becomes protected
- **C:** The interface method is ignored
- **D:** The default method is called

**Answer:** A (compile-time error)

**Explanation:** Interface methods are public; omitting public in the implementing class assigns weaker package-private access.

---

## Part 7: Variable Scopes, Imports & Loop Execution
*Block vs class variables, java.lang defaults, loop counts, break/continue flow, and declaration scope. (Questions 61–70)*

### Question 61
**Prompt:** Which type of variable has a scope limited to a method or block of code?

**Choices:**
- **A:** Interface variables
- **B:** Block variables
- **C:** Class variables
- **D:** Instance variables

**Answer:** B (Block variables)

**Explanation:** Local/block variables are scoped exclusively to the block or method where they are declared.

---

### Question 62
**Prompt:** Which type of variable is available throughout the class and can be accessed for the duration of the program?

**Choices:**
- **A:** Interface variables
- **B:** Block variables
- **C:** Class variables
- **D:** Instance variables

**Answer:** C (Class variables)

**Explanation:** Static (class) variables exist throughout the program's lifetime across all instances.

---

### Question 63
**Prompt:** Which statement about Java import statements Is true?

**Choices:**
- **A:** Unused imports prevent compilation.
- **B:** Unused imports may be removed safely.
- **C:** Duplicate imports prevent compilation.
- **D:** Missing imported classes still compile.

**Answer:** B (Unused imports may be removed safely)

**Explanation:** Unused imports do not affect compilation or execution and can be safely removed.

---

### Question 64
**Prompt:** Which package is imported into every Java class by default?

**Choices:**
- **A:** java.util
- **B:** java.system
- **C:** java.lang
- **D:** java.io

**Answer:** C (java.lang)

**Explanation:** The java.lang package is imported automatically into every Java class.

---

### Question 65
**Prompt:** Which loop iterates a different number of times from the other three?

**Choices:**
- **A:** for (int i = 0; i < 5; i++)
- **B:** for (int i = 1; i <= 5; i++)
- **C:** int k = 0; do {} while (k++ < 5);
- **D:** int k = 0; while (k++ < 5) {}

**Answer:** C (int k=0; do {} while (k++ < 5);)

**Explanation:** The do-while loop executes 6 times (checking k from 0 to 5), while the other loops execute 5 times.

---

### Question 66
**Prompt:** What is the output of this Java code?

```java
for (int x = 0; x < 5; x++) {
    System.out.print(1);
    if (x < 2) continue;
    else break;
}
```

**Choices:**
- **A:** 111
- **B:** 1
- **C:** 11
- **D:** 1111
- **E:** The code produces no output

**Answer:** A (111)

**Explanation:** Prints '1' for x = 0 (continue), x = 1 (continue), and x = 2 (break).

---

### Question 67
**Prompt:** Which declaration is a reference variable rather than a primitive variable in Java?

**Choices:**
- **A:** inti
- **B:** longl;
- **C:** String[] strings;
- **D:** double d;

**Answer:** C (String[] strings;)

**Explanation:** Arrays in Java are reference types; the other options are primitive types.

---

### Question 68
**Prompt:** What kind of member is declared by static int ii; inside a Java class?

**Choices:**
- **A:** An instance field
- **B:** class field
- **C:** Alocal variable
- **D:** A method parameter

**Answer:** B (A class field)

**Explanation:** static int ii; declares a static variable (class field).

---

### Question 69
**Prompt:** How many times does this loop body execute?

```java
for(inti=0;i<5;i++) {}
```

**Choices:**
- **A:** Four times
- **B:** Five times
- **C:** Six times
- **D:** Zero times

**Answer:** B (Five times)

**Explanation:** The loop runs for i = 0, 1, 2, 3, 4 (5 iterations).

---

### Question 70
**Prompt:** Which statement can be inserted inside the body of this loop so that it compiles?

```java
for (int i = 0; i < 5; i++) {
    [statement]
}
```

**Choices:**
- **A:** static int j = i;
- **B:** int j = i;
- **C:** static int j = ii;
- **D:** int i = 0;

**Answer:** B (int j = i;)

**Explanation:** Declaring local variable int j = i; is valid; static is illegal inside methods, and int i = 0; duplicates i.

---

## Part 8: Operators, Precedence, Control Flow & Arrays
*Static fields, pre-increment ++y, integer division, array indexing, and string literal concatenation. (Questions 71–80)*

### Question 71
**Prompt:** Which declaration can be placed directly inside the class body, outside the main method and loop?

**Choices:**
- **A:** static int j = ii;
- **B:** static int j = i;
- **C:** int j = i;
- **D:** int j = 0; inside main

**Answer:** A (static int j = ii;)

**Explanation:** Can initialize with the static class field ii; local variable i from main is out of scope.

---

### Question 72
**Prompt:** Why does static int j = i; fail when placed directly inside the class body if i is declared in the loop inside main?

**Choices:**
- **A:** The loop variable has local scope
- **B:** The class field must be a String
- **C:** The loop variable is automatically final
- **D:** The class cannot contain integer fields

**Answer:** A (The loop variable has local scope)

**Explanation:** The variable i declared inside main has local scope and cannot be referenced in the class body.

---

### Question 73
**Prompt:** Consider the following Java statements:



What is the value of y immediately after the second statement executes?

```java
int y = 4;
int x = 10 + ++y / 5;
```

**Choices:**
- **A:** 4
- **B:** 5
- **C:** 10
- **D:** Nn

**Answer:** B (5)

**Explanation:** The pre-increment ++y increments y from 4 to 5 before evaluation.

---

### Question 74
**Prompt:** What does this Java program print?

```java
int y = 4;
int x = 10 + ++y / 5;
System.out.println(x % y);
```

**Choices:**
- **A:** 0
- **B:** 1
- **C:** 4
- **D:** 2

**Answer:** B (1)

**Explanation:** x = 10 + (5 / 5) = 11; then 11 % 5 = 1.

---

### Question 75
**Prompt:** Which evaluation sequence correctly describes this code?

```java
int y = 4;
int x = 10 + ++y / 5;
```

**Choices:**
- **A:** y becomes 5, then 5 / 5 equals 1, so x becomes 11
- **B:** y remains 4, then 4 / 5 equals 0, so x becomes 10
- **C:** y becomes 5, then 10 / 5 equals 2, so x becomes 12
- **D:** y becomes 4, then 10 / 4 equals 2, so x becomes 12

**Answer:** A (y becomes 5, then 5 / 5 equals 1, so x becomes 11)

**Explanation:** Traces the exact evaluation order of pre-increment and division.

---

### Question 76
**Prompt:** Which change makes the loop execute six times instead of five times?

```java
for(inti=0;i<5;i++){}
```

**Choices:**
- **A:** Change i < 5 to i < 6
- **B:** Change i = 0 to i = 1
- **C:** Change i++ to i += 2
- **D:** Change i < 5 to i > 5

**Answer:** A (Change i < 5 to i < 6)

**Explanation:** Changing the condition to i < 6 makes the loop run 6 times (0 through 5).

---

### Question 77
**Prompt:** Which statement is true about primitive data types in Java?

**Choices:**
- **A:** They can be assigned the value null
- **B:** String is one of the primitive types
- **C:** Their type names begin with lowercase letters
- **D:** Programmers can define new primitive types

**Answer:** C (Their type names begin with lowercase letters)

**Explanation:** All primitive types in Java (int, double, boolean, etc.) are lowercase keywords.

---

### Question 78
**Prompt:** What is the first valid index of the array int[] nums = {3, 5, 7, 9}; in Java?

**Choices:**
- **A:** Index 0, containing 3
- **B:** Index 1, containing 5
- **C:** Index 2, containing 7
- **D:** Index 3, containing 9

**Answer:** A (Index 0, containing 3)

**Explanation:** Java arrays are zero-indexed, so the first element is at index 0.

---

### Question 79
**Prompt:** What is printed, assuming index is available after the loop?

```java
int[] nums = {3, 5, 7, 9};
int sum = 0;
for (int index = 1; index < nums.length; index++) {
    System.out.print(nums[index]);
}
System.out.print(sum / index);
```

**Choices:**
- **A:** 35790
- **B:** 3570
- **C:** 5790
- **D:** 570

**Answer:** C (5790)

**Explanation:** The loop prints elements at indices 1, 2, 3 ('579'), and sum / index evaluates to 0 / 4 = 0 ('5790').

---

### Question 80
**Prompt:** In the loop for (int index = 1; index < nums.length; index++), which array element is skipped first when nums is {3, 5, 7, 9}?

**Choices:**
- **A:** The element containing 3
- **B:** The element containing 5
- **C:** The element containing 7
- **D:** The element containing 9

**Answer:** A (The element containing 3)

**Explanation:** The loop starts at index 1, skipping index 0 (which contains 3).

---

## Part 9: Advanced Evaluation Order, Switch & Overloading
*Prefix increment promotion, switch statement cases, valid method identifiers, and varargs rules. (Questions 81–90)*

### Question 81
**Prompt:** Why does sum / index evaluate to 0 in the array code when sum remains initialized to 0?

**Choices:**
- **A:** Because integer division truncates every result
- **B:** Because dividing zero by a positive integer gives zero
- **C:** Because the array contains no zero values
- **D:** Because the loop changes zero into a whole number

**Answer:** B (Because dividing zero by a positive integer gives zero)

**Explanation:** sum is 0, and 0 divided by any positive integer is 0.

---

### Question 82
**Prompt:** What is the result of this Java code?

```java
int x = 9;
long y = x * (long) (++x);
System.out.println(y);
```

**Choices:**
- **A:** The program prints -1
- **B:** The program prints 9
- **C:** The program prints 81
- **D:** The program prints 90

**Answer:** D (90)

**Explanation:** Java evaluates operands left-to-right: left x is 9, then ++x increments x to 10; 9 * 10 = 90.

---

### Question 83
**Prompt:** In the expression x * (long) (++x), what does the prefix increment operator do before multiplication?

```java
int x = 9;
long y = x * (long) (++x);
```

**Choices:**
- **A:** It changes x from 9 to 10.
- **B:** It changes x from 10 to 9.
- **C:** It multiplies x by itself first.
- **D:** It converts x into a floating-point value.

**Answer:** A (It changes x from 9 to 10.)

**Explanation:** The prefix increment operator (++x) increments the value of x from 9 to 10 immediately before evaluating the operand and performing the multiplication (9 * 10L = 90L).

---

### Question 84
**Prompt:** Given the following Java classes, what is printed when the program runs?

```java
class Whale {
    public void dive() { }
}
class Orca extends Whale {
    public void dive() {
        System.out.print("Orca diving");
    }
}
// in main:
Whale whale = new Orca();
whale.dive();
```

**Choices:**
- **A:** The program prints "Whale diving"
- **B:** The program prints "Orca diving"
- **C:** The program produces no output
- **D:** The program fails with a runtime exception

**Answer:** B (The program prints "Orca diving")

**Explanation:** Polymorphism ensures dynamic method dispatch: at runtime, Java executes the overridden dive() method belonging to the actual object instance (Orca), printing "Orca diving".

---

### Question 85
**Prompt:** A Java switch statement can contain how many case statements and default statements?

**Choices:**
- **A:** At most one case and at least one default
- **B:** Any number of cases and at most one default
- **C:** At least one case and any number of defaults
- **D:** At least one case and at most one default

**Answer:** B (Any number of cases and at most one default)

**Explanation:** In Java switch statements, you may declare 0 or more (any number of) case labels, but at most one optional default label is permitted.

---

### Question 86
**Prompt:** Which statements are true about overloaded methods in Java?
I. Overloaded methods must have the same name.
II. Overloaded methods must have the same return type.
III. Overloaded methods must have a different list of parameters.

**Choices:**
- **A:** I only
- **B:** II only
- **C:** III only
- **D:** I and III
- **E:** II and III

**Answer:** D (I and III)

**Explanation:** Overloaded methods must share the same method name (Statement I) and must have different parameter lists by type, number, or order (Statement III). They are not required to have the same return type.

---

### Question 87
**Prompt:** What happens when this Java code is compiled and run?

```java
public class Chicken {
    public static void main(String[] args) {
        layEggs(1, 2);
        layEggs(3);
    }
    static void layEggs(int... eggs) {
        System.out.print("many " + eggs[0] + " ");
    }
    static void layEggs(int eggs) {
        System.out.print("one " + eggs + " ");
    }
}
```

**Choices:**
- **A:** It prints many 1 one 3
- **B:** It prints many 1 many 3
- **C:** It prints many 2 one 3
- **D:** The code fails to compile

**Answer:** A (It prints many 1 one 3)

**Explanation:** Exact parameter match takes precedence over varargs. layEggs(1, 2) matches layEggs(int... eggs) printing 'many 1 ', while layEggs(3) matches the exact layEggs(int eggs) overload printing 'one 3 '.

---

### Question 88
**Prompt:** Which of the following is a valid Java method name?

**Choices:**
- **A:** go_$Outside$20()
- **B:** have-Fun()
- **C:** new()
- **D:** 9EnjoyTheWeather()
- **E:** class()

**Answer:** A (go_$Outside$20())

**Explanation:** Java identifiers can contain letters, digits, underscores (_), and dollar signs ($), but cannot start with a digit (9), contain hyphens (-), or be reserved keywords (new, class).

---

### Question 89
**Prompt:** Which declaration correctly uses Java's varargs syntax for a parameter named x of type int?

**Choices:**
- **A:** ...int x
- **B:** int... x
- **C:** int...x()
- **D:** int x...
- **E:** varargs int x

**Answer:** B (int... x)

**Explanation:** Java varargs syntax places three dots (...) immediately after the type name (e.g. int... x) as the final parameter in a method signature.

---

### Question 90
**Prompt:** Java uses which mechanism to send data into a method?

**Choices:**
- **A:** Pass-by-value
- **B:** Pass-by-reference
- **C:** Both pass-by-value and pass-by-reference
- **D:** Pass-by-null

**Answer:** A (Pass-by-value)

**Explanation:** Java is strictly pass-by-value in all cases: primitive values are copied directly, and object reference values (pointers to objects) are passed by value.

---

## Part 10: Variable Scopes (Block, Method, Instance, Class & Interface)
*Scope lifetimes, pass-by-value semantics, method-local vs instance variables, and constant access. (Questions 91–100)*

### Question 91
**Prompt:** Which type of Java variable has a scope limited to a method?

**Choices:**
- **A:** Interface variable
- **B:** Block / Local variable
- **C:** Class variable
- **D:** Instance variable

**Answer:** B (Block / Local variable)

**Explanation:** Local variables declared within a method or block exist only within that method/block execution and cannot be accessed outside.

---

### Question 92
**Prompt:** Which type of Java variable is considered to remain in scope for the entire program execution?

**Choices:**
- **A:** Interface variable
- **B:** Block variable
- **C:** Class variable (static)
- **D:** Instance variable

**Answer:** C (Class variable (static))

**Explanation:** Class variables (static fields) are loaded when the class is initialized and remain in scope for the entire lifecycle of the Java Virtual Machine program.

---

### Question 93
**Prompt:** What is the main purpose of defining a variable's scope in Java?

**Choices:**
- **A:** To limit variable access and prevent unauthorized modification
- **B:** To increase variable size in memory
- **C:** To determine variable syntax color
- **D:** To prevent program execution

**Answer:** A (To limit variable access and prevent unauthorized modification)

**Explanation:** Scope restricts where a variable identifier can be read or modified, preventing unwanted side-effects and promoting encapsulation and clean memory management.

---

### Question 94
**Prompt:** A variable is declared inside a small block within a method. Which scope category best describes it?

**Choices:**
- **A:** Interface variable
- **B:** Block variable
- **C:** Class variable
- **D:** Instance variable

**Answer:** B (Block variable)

**Explanation:** A variable declared inside curly braces { ... } (such as an if statement or loop block) has block scope and exists only within those braces.

---

### Question 95
**Prompt:** A programmer needs a variable that can be accessed throughout the class rather than only inside one method. Which category should be considered?

**Choices:**
- **A:** Interface variable
- **B:** Block variable
- **C:** Class variable (or Instance variable)
- **D:** Local constant

**Answer:** C (Class variable (or Instance variable))

**Explanation:** Class fields and instance fields are declared at the class level outside any method, allowing them to be accessed across all methods in the class.

---

### Question 96
**Prompt:** Which statement best distinguishes a block variable from an interface variable?

**Choices:**
- **A:** Block scope is narrower than interface variable scope
- **B:** Block scope is global throughout the package
- **C:** Interface scope is narrower than block scope
- **D:** Interface scope is method-only

**Answer:** A (Block scope is narrower than interface variable scope)

**Explanation:** Block variables are strictly confined to their local enclosing braces, whereas interface variables (public static final) have public global visibility.

---

### Question 97
**Prompt:** A Java variable must be available beyond the method where it is declared. Which choice is least suitable for that requirement?

**Choices:**
- **A:** Interface variable
- **B:** Class variable
- **C:** Instance variable
- **D:** Block variable

**Answer:** D (Block variable)

**Explanation:** Block variables are destroyed when the block exits and cannot be accessed outside the declaring method.

---

### Question 98
**Prompt:** A developer wants a value available throughout a program and chooses between a block variable and an interface variable. Which choice better meets the requirement?

**Choices:**
- **A:** The block variable
- **B:** The interface variable
- **C:** Both variables equally
- **D:** Neither variable applies

**Answer:** B (The interface variable)

**Explanation:** Interface variables are implicitly public, static, and final, making them globally accessible constants throughout the entire program.

---

### Question 99
**Prompt:** A variable can be used inside its declaring method but not outside that method. Which conclusion is most reasonable?

**Choices:**
- **A:** It is a local / block-scoped variable
- **B:** It is interface-scoped
- **C:** It is class-scoped
- **D:** It is instance-scoped

**Answer:** A (It is a local / block-scoped variable)

**Explanation:** Local method variables are visible only within the body of the method in which they are declared.

---

### Question 100
**Prompt:** A programmer replaces an interface variable with a block variable while trying to preserve access throughout the program. What is the most likely result?

**Choices:**
- **A:** Access becomes more limited and causes compile errors outside the block
- **B:** Access becomes completely unrestricted
- **C:** Access remains exactly unchanged
- **D:** Access automatically becomes class-wide

**Answer:** A (Access becomes more limited and causes compile errors outside the block)

**Explanation:** Block variables restrict access strictly to their enclosing block, losing the global availability provided by public interface constants.

---

## Part 11: StringBuilder, String Immutability & Package Imports
*StringBuilder character indexing, String equality vs references, wildcard imports, and java.lang defaults. (Questions 101–110)*

### Question 101
**Prompt:** What is printed by this Java code?

```java
StringBuilder numbers = new StringBuilder("0123456789");
numbers.delete(2, 8);
numbers.append("-").insert(2, "+");
System.out.println(numbers);
```

**Choices:**
- **A:** 01+89-
- **B:** 012+9-
- **C:** 012+-9
- **D:** 0123456789

**Answer:** A (01+89-)

**Explanation:** 1. delete(2, 8) removes indices 2 through 7 ("234567"), leaving "0189". 2. append("-") results in "0189-". 3. insert(2, "+") places "+" at index 2, resulting in "01+89-".

---

### Question 102
**Prompt:** Which output lines are produced by this Java code?

```java
String s = new String("Hello");
String t = new String(s);
if ("Hello".equals(t)) System.out.println("one");
if (t == s) System.out.println("two");
if (t.equals(s)) System.out.println("three");
if (t == "Hello") System.out.println("four");
if (s == "Hello") System.out.println("five");
```

**Choices:**
- **A:** one only
- **B:** three only
- **C:** one and three
- **D:** two and four
- **E:** All five lines

**Answer:** C (one and three)

**Explanation:** new String(...) creates separate heap objects. == compares reference identity (so t == s, t == "Hello", and s == "Hello" are all false). .equals() compares character content, so "Hello".equals(t) ("one") and t.equals(s) ("three") are true.

---

### Question 103
**Prompt:** What happens when this Java code is compiled?

```java
String numbers = "246A8";
int total = 0;
total += Integer.valueOf(numbers.substring(1, 3));
total += numbers.length();
char ch = numbers.charAt(3);
System.out.println(total + " " + ch);
```

**Choices:**
- **A:** It prints 51 A
- **B:** It prints 46 A
- **C:** It prints 5 8
- **D:** It throws an exception
- **E:** The code does not compile

**Answer:** A (It prints 51 A)

**Explanation:** substring(1, 3) gives "46". Integer.valueOf("46") is 46. Adding length (5) makes total = 51. charAt(3) returns 'A'. Output is "51 A".

---

### Question 104
**Prompt:** Which statement about Java import statements is true?

**Choices:**
- **A:** Unused imports prevent compilation
- **B:** Unused imports may be safely removed without affecting functionality
- **C:** Duplicate imports prevent compilation
- **D:** Missing classes can still be imported

**Answer:** B (Unused imports may be safely removed without affecting functionality)

**Explanation:** Import statements tell the compiler where to locate type names; unused imports do not cause compilation errors or runtime overhead, and can be removed safely.

---

### Question 105
**Prompt:** Which package is imported into every Java class by default without an explicit import statement?

**Choices:**
- **A:** java.util
- **B:** java.system
- **C:** java.lang
- **D:** java.io

**Answer:** C (java.lang)

**Explanation:** The java.lang package (containing String, System, Math, Object, Exception, etc.) is automatically imported by default into every Java source file.

---

### Question 106
**Prompt:** Which loop executes a different number of times from the other three?

```java
// Loop A:
for (int i = 0; i < 5; i++) { }
// Loop B:
for (int i = 1; i <= 5; i++) { }
// Loop C:
int k = 0; do { } while (k++ < 5);
// Loop D:
int k = 0; while (k++ < 5) { }
```

**Choices:**
- **A:** for (int i = 0; i < 5; i++)
- **B:** for (int i = 1; i <= 5; i++)
- **C:** int k = 0; do {} while (k++ < 5);
- **D:** int k = 0; while (k++ < 5) {}

**Answer:** C (int k = 0; do {} while (k++ < 5);)

**Explanation:** A, B, and D execute their loop bodies exactly 5 times. The do-while loop (C) executes 6 times because the post-increment test allows an extra iteration.

---

### Question 107
**Prompt:** For the string String numbers = "246A8"; what values are returned by numbers.substring(1, 3) and numbers.charAt(3), respectively?

```java
String numbers = "246A8";
numbers.substring(1, 3);
numbers.charAt(3);
```

**Choices:**
- **A:** "24" and '6'
- **B:** "46" and 'A'
- **C:** "46" and '8'
- **D:** "6A" and 'A'

**Answer:** B ("46" and 'A')

**Explanation:** substring(1, 3) extracts characters at index 1 and 2 ('4' and '6') producing "46". charAt(3) returns the character at index 3, which is 'A'.

---

### Question 108
**Prompt:** What is printed by this Java code?

```java
String s = "246A8";
int value = Integer.valueOf(s.substring(1, 3));
System.out.println(value + s.charAt(3));
```

**Choices:**
- **A:** 46A
- **B:** 111
- **C:** 46 A
- **D:** The code does not compile

**Answer:** B (111)

**Explanation:** s.substring(1, 3) is "46", parsed as int 46. s.charAt(3) is char 'A', which has ASCII value 65. Because int + char is numeric addition (not string concatenation), 46 + 65 evaluates to 111.

---

### Question 109
**Prompt:** A Java class uses ArrayList without writing its fully qualified name, but it has no import statement for ArrayList. Which change is sufficient to allow the class to compile, assuming the class is otherwise correct?

**Choices:**
- **A:** Add import java.util.ArrayList;
- **B:** Add import java.lang.ArrayList;
- **C:** Add import java.io.ArrayList;
- **D:** Add import java.system.ArrayList;

**Answer:** A (Add import java.util.ArrayList;)

**Explanation:** ArrayList is located in the java.util package, so adding 'import java.util.ArrayList;' or 'import java.util.*;' allows the short class name to resolve.

---

### Question 110
**Prompt:** What is printed by this Java code?

```java
String s = "a";
s.concat(s);
s.concat(".");
System.out.println(s);
```

**Choices:**
- **A:** a
- **B:** aa.
- **C:** aa
- **D:** a.

**Answer:** A (a)

**Explanation:** String objects in Java are immutable. Methods like s.concat() return a new String rather than modifying s in place. Since the returned values are not reassigned back to s, s remains "a".

---

## Part 12: String Methods (substring, concat, indexOf) & Array Bounds
*Immutability of concat(), substring slicing, indexOf delimiter parsing, and array length properties. (Questions 111–120)*

### Question 111
**Prompt:** Which statement about Java String objects is not true?

**Choices:**
- **A:** A String can be created without an explicit constructor call.
- **B:** String literals can be reused through the string pool.
- **C:** A String variable can refer to a final object.
- **D:** A String object's contents can be changed after creation.

**Answer:** D (A String object's contents can be changed after creation.)

**Explanation:** String objects in Java are immutable; once instantiated, their internal character sequences cannot be modified.

---

### Question 112
**Prompt:** Given the following code, which expression removes the space from the string?

```java
String g = "Guinea Pig";
int i = g.indexOf(" ");
```

**Choices:**
- **A:** g.substring(0, i) + g.substring(i);
- **B:** g.substring(0, i - 1) + g.substring(i);
- **C:** g.substring(0, i) + g.substring(i + 1);
- **D:** g.substring(0, i - 1) + g.substring(i + 1);

**Answer:** C (g.substring(0, i) + g.substring(i + 1);)

**Explanation:** g.substring(0, i) gets characters before the space ("Guinea"), and g.substring(i + 1) gets characters after the space ("Pig"), omitting the space character at index i.

---

### Question 113
**Prompt:** What value does the expression "a" + 1 produce in Java?

**Choices:**
- **A:** The integer 1
- **B:** The string "a1"
- **C:** The string "1a"
- **D:** A compilation error

**Answer:** B (The string "a1")

**Explanation:** When either operand of the + operator is a String, Java performs String concatenation, converting the integer 1 to "1" and returning "a1".

---

### Question 114
**Prompt:** What is the value of i after this code executes?

```java
String g = "Guinea Pig";
int i = g.indexOf(" ");
```

**Choices:**
- **A:** 4
- **B:** 5
- **C:** 6
- **D:** 7

**Answer:** C (6)

**Explanation:** Zero-based indexing: G(0), u(1), i(2), n(3), e(4), a(5), ' '(6). The space is located at index 6.

---

### Question 115
**Prompt:** What does String.concat() return when it is called on a String object?

**Choices:**
- **A:** The original String after changing its contents
- **B:** A new String containing both sequences
- **C:** The index of the appended sequence
- **D:** A boolean indicating whether joining succeeded

**Answer:** B (A new String containing both sequences)

**Explanation:** concat() creates and returns a brand-new String object representing the concatenation of the original string and the argument string.

---

### Question 116
**Prompt:** What is printed by this code?

```java
String g = "Guinea Pig";
int i = g.indexOf(" ");
String ans = g.substring(0, i) + g.substring(i + 1);
System.out.println(ans);
```

**Choices:**
- **A:** Guinea Pig
- **B:** GuineaPig
- **C:** Guinea  Pig
- **D:** PigGuinea

**Answer:** B (GuineaPig)

**Explanation:** Concatenating "Guinea" (indices 0..5) and "Pig" (indices 7..9) without the space at index 6 prints "GuineaPig".

---

### Question 117
**Prompt:** A programmer writes the following code: String s = "cat"; s.concat("dog"); System.out.println(s); What is printed, and why?

```java
String s = "cat";
s.concat("dog");
System.out.println(s);
```

**Choices:**
- **A:** cat, because concat does not modify the original String
- **B:** catdog, because concat permanently changes the original String
- **C:** dog, because concat replaces the original String
- **D:** Nothing, because concat always causes an exception

**Answer:** A (cat, because concat does not modify the original String)

**Explanation:** Strings are immutable; s.concat("dog") produces a new String "catdog" that is immediately discarded because it was not assigned to a variable.

---

### Question 118
**Prompt:** Which revision correctly stores the result of concatenating "a" and "b"?

```java
// Original:
String s = "a";
s.concat("b");
```

**Choices:**
- **A:** String s = "a"; s = s.concat("b");
- **B:** String s = "a"; s.append("b");
- **C:** String s = "a"; s += concat("b");
- **D:** String s = "a"; concat(s, "b");

**Answer:** A (String s = "a"; s = s.concat("b");)

**Explanation:** Reassigning the returned new String reference back to s (s = s.concat("b"); or s += "b";) correctly saves the concatenated string.

---

### Question 119
**Prompt:** Which expression correctly references the first and last elements of a non-empty Java array named array?

**Choices:**
- **A:** array[0] and array[array.length]
- **B:** array[0] and array[array.length()]
- **C:** array[0] and array[array.length - 1]
- **D:** array[1] and array[array.length - 1]

**Answer:** C (array[0] and array[array.length - 1])

**Explanation:** Java arrays are 0-indexed; the first element is at index 0 and the final element is at index array.length - 1.

---

### Question 120
**Prompt:** Given ArrayList<Integer> l = new ArrayList<>(); which expression returns the number of elements currently stored in l?

**Choices:**
- **A:** l.capacity
- **B:** l.capacity()
- **C:** l.length
- **D:** l.length()
- **E:** l.size()

**Answer:** E (l.size())

**Explanation:** In Java Collections (including ArrayList), the size() method returns the count of elements currently stored.

---

## Part 13: Array Traversal, ArrayList Operations & Loop Semantics
*ArrayList size() vs capacity, for-each traversal order, backward array indexing, and zero-based indexing. (Questions 121–130)*

### Question 121
**Prompt:** Which statement correctly describes the traversal order of a Java for-each loop over an array?

**Choices:**
- **A:** It begins at index 0 and proceeds sequentially to the final index.
- **B:** It begins at the final index and proceeds backward.
- **C:** It begins at a random index.
- **D:** It orders elements from largest to smallest value.

**Answer:** A (It begins at index 0 and proceeds sequentially to the final index.)

**Explanation:** An enhanced for-each loop over an array always iterates forward in index order from index 0 to length - 1.

---

### Question 122
**Prompt:** Which statement correctly compares a Java array's length with an ArrayList's size?

**Choices:**
- **A:** Both use the length field.
- **B:** Both use the size() method.
- **C:** An array uses length; an ArrayList uses size().
- **D:** An array uses size(); an ArrayList uses length().

**Answer:** C (An array uses length; an ArrayList uses size().)

**Explanation:** Arrays possess a public final field named length (no parentheses), while ArrayList instances provide a method named size().

---

### Question 123
**Prompt:** For an array containing five elements, which expression references its last element?

**Choices:**
- **A:** array[5]
- **B:** array[array.length]
- **C:** array[4] (or array[array.length - 1])
- **D:** array[1]

**Answer:** C (array[4] (or array[array.length - 1]))

**Explanation:** For an array of length 5, valid indices are 0, 1, 2, 3, 4. The last element is at index 4.

---

### Question 124
**Prompt:** For an array containing five elements, what happens if code attempts to access array[5]?

```java
int[] array = new int[5];
int last = array[5];
```

**Choices:**
- **A:** It returns the last element.
- **B:** It throws ArrayIndexOutOfBoundsException at runtime.
- **C:** It returns null.
- **D:** It causes a compilation error.

**Answer:** B (It throws ArrayIndexOutOfBoundsException at runtime.)

**Explanation:** The maximum valid index for an array of length 5 is 4; accessing index 5 throws ArrayIndexOutOfBoundsException.

---

### Question 125
**Prompt:** A programmer writes int last = values[values.length - 1];. What condition must hold for this statement to execute successfully?

```java
int last = values[values.length - 1];
```

**Choices:**
- **A:** The array must contain at least one element.
- **B:** The array must contain exactly one element.
- **C:** The array must contain five elements.
- **D:** The array must be an ArrayList.

**Answer:** A (The array must contain at least one element.)

**Explanation:** If values is empty (length 0), values.length - 1 evaluates to -1, which causes ArrayIndexOutOfBoundsException. Hence the array must contain at least 1 element.

---

### Question 126
**Prompt:** A programmer wants to process every element of an array from its final element toward its first element. Which approach is most appropriate?

**Choices:**
- **A:** Use a for-each loop without changing it.
- **B:** Use an indexed loop that decreases the index from length - 1 down to 0.
- **C:** Use array.length as the first index.
- **D:** Use an ArrayList's size() method.

**Answer:** B (Use an indexed loop that decreases the index from length - 1 down to 0.)

**Explanation:** Reverse traversal requires an index loop starting at array.length - 1, continuing while index >= 0, and decrementing index--.

---

### Question 127
**Prompt:** An ArrayList currently contains three elements but has internal capacity for ten. What should its element count be reported as?

**Choices:**
- **A:** Three, obtained with size()
- **B:** Ten, obtained with size()
- **C:** Three, obtained with capacity()
- **D:** Ten, obtained with length()

**Answer:** A (Three, obtained with size())

**Explanation:** The size() method returns the logical count of items currently added (3), regardless of underlying buffer capacity.

---

### Question 128
**Prompt:** A loop must visit each element of an array exactly once in its normal left-to-right order, without modifying the array. Which loop design best fits this requirement?

**Choices:**
- **A:** A for-each loop over the array
- **B:** A loop beginning at index 1
- **C:** A loop beginning at index array.length
- **D:** A loop decreasing from index 0

**Answer:** A (A for-each loop over the array)

**Explanation:** Enhanced for-each loops are specifically designed for clean, read-only forward traversal over arrays and collections.

---

### Question 129
**Prompt:** Which statement correctly describes checked exceptions in Java?

**Choices:**
- **A:** They must be handled with try-catch or declared with throws
- **B:** They may be handled or declared optionally
- **C:** They cannot be handled or declared
- **D:** They are handled only by the compiler

**Answer:** A (They must be handled with try-catch or declared with throws)

**Explanation:** Java enforces the 'handle or declare' rule for all checked exceptions (subclasses of Exception excluding RuntimeException).

---

### Question 130
**Prompt:** Which statement correctly describes runtime exceptions in Java?

**Choices:**
- **A:** They must always be declared in the throws clause
- **B:** They may be handled or declared optionally (unchecked)
- **C:** They cannot be caught by any catch block
- **D:** They are handled only inside finally blocks

**Answer:** B (They may be handled or declared optionally (unchecked))

**Explanation:** Runtime exceptions (subclasses of RuntimeException) are unchecked: the compiler does not require you to catch or declare them.

---

## Part 14: Checked vs Unchecked Exceptions & try-catch Structure
*Checked exception declaration requirements, runtime exceptions, array out of bounds, and catch block ordering. (Questions 131–140)*

### Question 131
**Prompt:** Which statement best distinguishes checked exceptions from runtime exceptions?

**Choices:**
- **A:** Checked exceptions require handling or declaration; runtime exceptions do not
- **B:** Checked exceptions occur only during compilation
- **C:** Runtime exceptions require handling or declaration
- **D:** Runtime exceptions cannot be caught by programs

**Answer:** A (Checked exceptions require handling or declaration; runtime exceptions do not)

**Explanation:** Checked exceptions are subject to compile-time checking requiring try-catch or throws; runtime exceptions are unchecked.

---

### Question 132
**Prompt:** What exception is thrown by this Java code?

```java
int[] nums = {1, 4, 6};
Object p = nums;
int[] two = (int[]) p;
System.out.println(two[two.length]);
```

**Choices:**
- **A:** ClassCastException
- **B:** ArrayIndexOutOfBoundsException
- **C:** IllegalArgumentException
- **D:** NumberFormatException
- **E:** No exception is thrown

**Answer:** B (ArrayIndexOutOfBoundsException)

**Explanation:** The cast (int[]) p succeeds. However, two.length is 3. Accessing two[3] exceeds the valid bounds (0..2), throwing ArrayIndexOutOfBoundsException.

---

### Question 133
**Prompt:** Why does the array access in this code throw an exception?

```java
int[] values = {1, 4, 6};
System.out.println(values[values.length]);
```

**Choices:**
- **A:** The last valid index is one less than the length
- **B:** The array contains fewer than three elements
- **C:** The array cannot be stored in an Object variable
- **D:** The length field returns the first element's value

**Answer:** A (The last valid index is one less than the length)

**Explanation:** Because Java uses 0-based indexing, values[values.length] tries to access an element past the end of the array.

---

### Question 134
**Prompt:** In the following code, what is the value of two.length before the print statement executes?

```java
int[] nums = {1, 4, 6};
Object p = nums;
int[] two = (int[]) p;
System.out.println(two[two.length]);
```

**Choices:**
- **A:** 1
- **B:** 2
- **C:** 3
- **D:** 4

**Answer:** C (3)

**Explanation:** nums was initialized with three elements ({1, 4, 6}), so its length property is 3.

---

### Question 135
**Prompt:** A Java array has length 3. Which index refers to its final element?

**Choices:**
- **A:** Index 0
- **B:** Index 1
- **C:** Index 2
- **D:** Index 3

**Answer:** C (Index 2)

**Explanation:** An array of length 3 contains indices 0, 1, and 2. Index 2 is the final element.

---

### Question 136
**Prompt:** A try statement has separate catch blocks for IllegalArgumentException and IndexOutOfBoundsException. In what order may these two catch blocks appear?

**Choices:**
- **A:** Only IllegalArgumentException first
- **B:** Only IndexOutOfBoundsException first
- **C:** Either order is valid
- **D:** Neither order is permitted

**Answer:** C (Either order is valid)

**Explanation:** IllegalArgumentException and IndexOutOfBoundsException are sibling classes inheriting from RuntimeException; neither is a subclass of the other, so they can appear in either order.

---

### Question 137
**Prompt:** Why can catch blocks for IllegalArgumentException and IndexOutOfBoundsException be declared in either order?

**Choices:**
- **A:** Neither exception is a superclass or subclass of the other
- **B:** Both exceptions are checked exceptions
- **C:** Both exceptions are identical exception types
- **D:** Neither exception can be thrown at runtime

**Answer:** A (Neither exception is a superclass or subclass of the other)

**Explanation:** Catch order matters only when one exception type is a subclass of another (where the subclass must be caught before the superclass).

---

### Question 138
**Prompt:** Consider this Java code:

What happens when this code is compiled?

```java
int a = 3, b = 0;
try {
    System.out.print(3 % 0);
} catch (IOException e) {
    System.out.print(-1);
} catch (ArithmeticException e) {
    System.out.print(0);
} finally {
    System.out.print("done");
}
```

**Choices:**
- **A:** It prints 3done
- **B:** It prints -1done
- **C:** It prints 0done
- **D:** The code does not compile

**Answer:** D (The code does not compile)

**Explanation:** IOException is a checked exception. The compiler detects that the try block has no statements that can possibly throw IOException, so catching IOException results in a compile-time error ('unreachable catch block').

---

### Question 139
**Prompt:** Why does catching IOException in a try block containing only System.out.print(3 % 0) cause a compilation failure?

```java
try {
    System.out.print(3 % 0);
} catch (IOException e) {
    // ...
}
```

**Choices:**
- **A:** The try block cannot throw IOException (unreachable catch block)
- **B:** ArithmeticException must be caught before IOException
- **C:** finally blocks cannot follow IOException
- **D:** IOException is an unchecked exception

**Answer:** A (The try block cannot throw IOException (unreachable catch block))

**Explanation:** Java disallows catch blocks for checked exceptions that cannot be thrown by any statement in the corresponding try block.

---

### Question 140
**Prompt:** Which Java Throwable type is generally recommended not to catch directly in an application?

**Choices:**
- **A:** CheckedException
- **B:** Exception
- **C:** RuntimeException
- **D:** Error
- **E:** IOException

**Answer:** D (Error)

**Explanation:** Error represents severe abnormal conditions (such as OutOfMemoryError or StackOverflowError) from which a normal application cannot reasonably be expected to recover.

---

## Part 15: Exception Hierarchy, Arithmetic Errors, finally Blocks & Type Promotion
*ArithmeticException divide by zero, unreachable IOException catch rules, finally execution, and byte arithmetic promotion. (Questions 141–150)*

### Question 141
**Prompt:** In Java, which exception is normally associated with attempting an arithmetic operation such as division or remainder by zero on integer types?

**Choices:**
- **A:** IOException
- **B:** ArithmeticException
- **C:** NullPointerException
- **D:** IndexOutOfBoundsException
- **E:** ClassCastException

**Answer:** B (ArithmeticException)

**Explanation:** Integer division or modulo by zero in Java throws an ArithmeticException at runtime.

---

### Question 142
**Prompt:** In the code below, assume the IOException catch block has been removed and the expression is changed to 3 % 1: What is printed?

```java
try {
    System.out.print(3 % 1);
} catch (ArithmeticException e) {
    System.out.print(0);
} finally {
    System.out.print("done");
}
```

**Choices:**
- **A:** 0done
- **B:** 1done
- **C:** 3done
- **D:** done1
- **E:** Nothing is printed

**Answer:** A (0done)

**Explanation:** 3 % 1 evaluates to 0, which is printed in the try block. No exception occurs. The finally block executes next, printing "done", resulting in "0done".

---

### Question 143
**Prompt:** In the following corrected Java structure, what is the purpose and guarantee of the finally block?

```java
try {
    // statement that may fail
} catch (ArithmeticException e) {
    // exception handling
} finally {
    System.out.print("done");
}
```

**Choices:**
- **A:** It runs only when no exception occurs
- **B:** It runs only when an arithmetic exception occurs
- **C:** It executes after the try-catch blocks whether an exception was thrown or not
- **D:** It prevents every exception from propagating

**Answer:** C (It executes after the try-catch blocks whether an exception was thrown or not)

**Explanation:** The finally block is guaranteed to execute upon leaving the try-catch structure, regardless of whether an exception was thrown or caught.

---

### Question 144
**Prompt:** Why is the IOException catch clause problematic in a try block that contains only System.out.print(3 % 0)?

**Choices:**
- **A:** IOException is an unchecked exception
- **B:** The try block cannot throw IOException
- **C:** ArithmeticException must be caught first
- **D:** finally blocks cannot follow catch blocks
- **E:** IOException cannot be used in Java

**Answer:** B (The try block cannot throw IOException)

**Explanation:** The Java compiler checks that checked exceptions declared in a catch clause can actually be thrown by the code in the try block.

---

### Question 145
**Prompt:** Suppose the IOException catch clause is removed from the displayed program, while 3 % 0 remains in the try block. Which output is produced?

```java
try {
    System.out.print(3 % 0);
} catch (ArithmeticException e) {
    System.out.print(0);
} finally {
    System.out.print("done");
}
```

**Choices:**
- **A:** 3 followed by done
- **B:** -1 followed by done
- **C:** 0 followed by done (0done)
- **D:** Only done
- **E:** No output at all

**Answer:** C (0 followed by done (0done))

**Explanation:** 3 % 0 throws ArithmeticException, caught by the catch block which prints '0'. The finally block executes next and prints 'done', resulting in '0done'.

---

### Question 146
**Prompt:** A programmer wants the remainder operation to avoid throwing ArithmeticException. Which replacement for 3 % 0 avoids that exception?

**Choices:**
- **A:** 3 % 1
- **B:** 3 / 0
- **C:** 0 / 0
- **D:** 3 % 0

**Answer:** A (3 % 1)

**Explanation:** 3 % 1 computes 3 modulo 1 = 0 without dividing by zero, executing without throwing ArithmeticException.

---

### Question 147
**Prompt:** A Java program catches both IOException and ArithmeticException, but the try block currently performs only a remainder-by-zero operation. What is the best correction if the program is intended to handle the arithmetic failure and still compile?

**Choices:**
- **A:** Remove the IOException catch block
- **B:** Remove the ArithmeticException catch block
- **C:** Move finally before the try block
- **D:** Change ArithmeticException to Error
- **E:** Change the remainder operation to text output

**Answer:** A (Remove the IOException catch block)

**Explanation:** Removing the unreachable checked IOException catch block allows the code to compile and handle ArithmeticException cleanly.

---

### Question 148
**Prompt:** Which statement best describes the relationship between ArithmeticException and the Java exception hierarchy?

**Choices:**
- **A:** It is a checked exception and must always be declared
- **B:** It is an unchecked RuntimeException and can be caught explicitly
- **C:** It is an Error and cannot be caught
- **D:** It is unrelated to arithmetic operations
- **E:** It can be caught only by IOException

**Answer:** B (It is an unchecked RuntimeException and can be caught explicitly)

**Explanation:** ArithmeticException extends RuntimeException; it is unchecked (not required to be declared in throws), but can be caught by a catch block.

---

### Question 149
**Prompt:** What happens when this Java code is compiled and run?

```java
byte a = 40, b = 50;
byte sum = (byte) a + b;
System.out.println(sum);
```

**Choices:**
- **A:** It prints 10.
- **B:** It prints 40.
- **C:** It prints 90.
- **D:** It does not compile.

**Answer:** D (It does not compile.)

**Explanation:** Cast operator (byte) has higher precedence than addition (+). Thus, (byte) a + b casts only 'a' to byte, then evaluates the binary addition as int (int + byte = int). Assigning that int result to byte sum causes a compile error ('incompatible types: possible lossy conversion from int to byte'). Correct: (byte) (a + b).

---

### Question 150
**Prompt:** Why does the statement byte sum = (byte) a + b; fail to compile when both a and b are bytes?

```java
byte a = 40, b = 50;
byte sum = (byte) a + b;
```

**Choices:**
- **A:** The addition promotes the operands to int, resulting in an int sum that cannot be assigned to byte without parenthesized casting.
- **B:** The addition converts both values to double.
- **C:** The cast changes both variables to String.
- **D:** The byte type cannot store the value 90.

**Answer:** A (The addition promotes the operands to int, resulting in an int sum that cannot be assigned to byte without parenthesized casting.)

**Explanation:** Java binary arithmetic operators automatically promote byte and short operands to int. Without enclosing parentheses around the addition (byte)(a + b), the expression evaluates to an int.

---
