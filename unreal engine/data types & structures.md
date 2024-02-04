# Data Types

## Main Class Types

- The `UObject` is the base class that includes most of Unreal's main features (garbage collection, networking support, reflection, etc).
- An `AActor` is an object that can be added in a level either from the editor (built) or during runtime (spawned). Includes networking support and can be replicated.
- A `UActorComponent` is the basis for anything attached to an Actor, either directly or as an Actor's nth child.
- A `UStruct` contains plain data and does not extend any other class.
- A `UEnum` represents an abstract enumeration.

### Notation

- All C++ classes are customary defined with a prefix (not required, but a good practice defined by Unreal).
  - ***U*** for generic objects deriving from `UObject`.
  - ***A*** for objects deriving from `Actor`.
  - ***F*** for generic classes and structures.
  - ***T*** for templates.
  - ***I*** for interfaces.
  - ***E*** for enums.
  - ***B*** for *booleans* or *unit8*.

# Data Structures

## Containers

- A container is a type of data structure whose instances can store collections of values or instances.
- A container is defined as part of a variable, besides the variable's type.
- The **containers** and the _related nodes_ are outlined below:

### Nodes

- **Array**: A linear container that can hold a number of similar items.
  - _Add_: Appends an item at the end of the array.
  - _Insert_: Adds an item at the indicated index.
  - _Length_: Returns the current size of the array.
  - _Last Index_: Returns the last index of a non-null item in the array.
  - _Random Array Item_
  - _Is Empty_
  - _In Not Empty_
  - _Make Array_: Creates an array from a number of individual items of the same type.
- **Set**: An unordered list of of unique items.
  - _Add_
  - _Add Items_: Add items from an array to a set.
  - _Contains_: Checks if an item is part of the set.
  - _Length_
  - _To Array_: Casts a set into an array so it can be iterated upon.
  - _Clear_
  - _Remove_: Removes a specific item from a set.
  - _Remove Items_: Removes all items of an array from a set.
  - _Difference_
  - _Intersection_
  - _Make Set_: Creates a set from a number of individual items.
- **Map**: A container that links keys to values. Keys must be unique.
  - _Add_: Adds a key-value pair.
  - _Remove_: Given a key, removes the key-value pair.
  - _Clear_
  - _Length_
  - _Contains_: Checks if a key exists in the map.
  - _Find_: Looks for a specific key and returns the value.
  - _Keys_: Returns all keys in an array.
  - _Values_: Returns all values in an array.
  - _Make Map_: Creates a map from a number of individual keys and values.

### C++

- **Array**: `TArray<Type> myArray = { initialValue1, initialValue2, ... }`
  - Allocation:
    - `.Reserve()`
  - Info:
    - `.Num()`
  - Manipulation:
    - `.Add()`
    - `.Emplace()`
    - `.Remove()`
    - `.RemoveAt()`
- **Set**:
- **Map**: `TMap<KeyType, ValueType> = myMap { { key1, value1 }, { key2, value2 }, ... }`
  - Allocation:
  - Info:
    - `.Num()`
  - Manipulation:
    - `["key"]`
    - `.Add()`

## Enumeration

- An enum is used to define a list of unique constants that can be used to define the value of a variable.
- An enumeration is created as an **Enumeration** blueprint or the **UENUM(BlueprintType)** macro.
- When creating variables, an existing enumeration can be used as its type.

### Nodes

- \*Switch On **Enum\***: Switch operation based on enumerated value.
- _Select_: Switch operation based on an enumerated value that returns a specific string.

### C++

- The **UMETA(DisplayName="...")** can be used to change how a specific enum value is displayed in the blueprints.

```
UENUM(BlueprintType)
enum FruitList {
  Apple UMETA(DisplayName="DoctorBane"),
  Mango,
  Banana
}
```

## Structure

- A structure is a composite data type that can group variables of different types into a single type.
- A structure is created as a **Structure** blueprint or with the **USTRUCT(BlueprintType)**, **GENERATED_USTRUCT_BODY()**, and **UPROPERTY()** macros in C++.
- When creating variables, an existing structure can be used as its type.

### Nodes

- _Make_: Combines individual input values to create a structure.
- _Break_: Separates the elements of a structure into individual items.

### C++

- The name of the structure must always be prefixed by F.

```
USTRUCT(BlueprintType)
struct FBook {
  GENERATED_USTRUCT_BODY()
  UPROPERTY(BlueprintReadOnly)
    FString ISBN;
  UPROPERTY(BlueprintReadOnly)
    FString Name;
  UPROPERTY(BlueprintReadWrite)
    float Rating;
  UPROPERTY(BlueprintReadOnly)
    int NumberOfPages;
}
```

## Data Table

- A data table is an array of structures, much like a spreadsheet.
- A data table is created as a **Data Table** blueprint. A _structure_ must be selected to represent the data held in the table.
- A data table can be imported from a CSV file.
  - _Content Browser -> Import -> CSV file_
  - Choose the data structure.
- When creating variables, an existing data table can be used as its type.

### Nodes

- _Get Data Table Row_
- _Get Data Table Row Names_
- _Get Data Table Column as String_
