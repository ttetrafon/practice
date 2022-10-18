# Data Structures

## Containers
A container is a type of data structure whose instances can store collections of values or instances.

A container is defined as part of a variable, besides the variable's type.

The **containers** and the *related nodes* are outlined below:

* **Array**: A linear container that can hold a number of similar items.
  * *Add*: Appends an item at the end of the array.
  * *Insert*: Adds an item at the indicated index.
  * *Length*: Returns the current size of the array.
  * *Last Index*: Returns the last index of a non-null item in the array.
  * *Random Array Item*
  * *Is Empty*
  * *In Not Empty*
  * *Make Array*: Creates an array from a number of individual items of the same type.
* **Set**: An unordered list of of unique items.
  * *Add*
  * *Add Items*: Add items from an array to a set.
  * *Contains*: Checks if an item is part of the set.
  * *Length*
  * *To Array*: Casts a set into an array so it can be iterated upon.
  * *Clear*
  * *Remove*: Removes a specific item from a set.
  * *Remove Items*: Removes all items of an array from a set.
  * *Difference*
  * *Intersection*
  * *Make Set*: Creates a set from a number of individual items.
* **Map**: A container that links keys to values. Keys must be unique.
  * *Add*: Adds a key-value pair.
  * *Remove*: Given a key, removes the key-value pair.
  * *Clear*
  * *Length*
  * *Contains*: Checks if a key exists in the map.
  * *Find*: Looks for a specific key and returns the value.
  * *Keys*: Returns all keys in an array.
  * *Values*: Returns all values in an array.
  * *Make Map*: Creates a map from a number of individual keys and values.


## Enumeration
An enum is used to define a list of unique constants that can be used to define the value of a variable.

An enumeration is created as an **Enumeration** blueprint.

When creating variables, an existing enumeration can be used as its type.

### Nodes
* *Switch On **Enum***: Switch operation based on enumerated value.


## Structure
A structure is a composite data type that can group variables of different types into a single type.

A structure is created as a **Structure** blueprint.

When creating variables, an existing structure can be used as its type.

### Nodes
* *Make*: Combines individual input values to create a structure.
* *Break*: Separates the elements of a structure into individual items.


## Data Table
A data table is an array of structures, much like a spreadsheet.

A data table is created as a **Data Table** blueprint. A *structure* must be selected to represent the data held in the table.

A data table can be imported from a CSV file.
* *Content Browser -> Import -> CSV file*
* Choose the data structure.

When creating variables, an existing data table can be used as its type.

### Nodes
* *Get Data Table Row*
* *Get Data Table Row Names*
* *Get Data Table Column as String*
