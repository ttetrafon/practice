from inspect import Traceback
from math import floor
from typing import Any

# Magic/Dunder (Double Underscore) class methods
#
# - Methods tied to specific operations.
# - ...


#----------#
# __init__ #
#----------#

# - initiates an object

class Rect:
  def __init__(self, x: float, y: float) -> None:
    self.x: float = x
    self.y: float = y
    self.area: float = x * y


#---------#
# __str__ #
#---------#

# - returns a string representation of the object
# - used automatically when the object needs to be converted in a string (e.g.: within print())

class Counter:
  def __init__(self) -> None:
    self.value = 0

  def count_up(self) -> None:
    self.value += 1

  def count_down(self) -> None:
    self.value -= 1

  def __str__(self) -> str:
    return f'Counter: value={self.value}'

counter: Counter = Counter()
for i in range(3):
  counter.count_up()
  print(counter)


#----------#
# __repr__ #
#----------#

# - like __str__, but used to include more robust information and details - developer-friendly output

class Car:
  def __init__(self, make: str, model: str, year: int):
    self.make: str = make
    self.model: str = model
    self.year: int = year

  def __str__(self) -> str:
    return f"{self.year} {self.make} {self.model}"

  def __repr__(self) -> str:
    return f"Car(make={self.make}, model={self.model}, year={self.year})"

car: Car = Car("Ford", "Fiesta", 2015)

print(str(car))
print(repr(car))


#-----------#
#   math    #
#-----------#

# Math operations and their generalisation
# - __add__: addition
# - __sub__: subtraction
# - __mul__: multiplication
# - __truediv__: true division
# - __eq__: equality
# - __lt__: less than
# - __le__: less than or equal
# - __gt__: greater than
# - __ge__: greater than or equal

class InventoryItem:
  def __init__(self, name: str, quantity: int) -> None:
    self.name = name
    self.quantity = quantity

  def __repr__(self) -> str:
    return f"Inventory Item(name={self.name}, quantity={self.quantity})"

  def __add__(self, other: InventoryItem) -> InventoryItem:
    if self.name == other.name:
      return InventoryItem(self.name, self.quantity + other.quantity)
    raise ValueError("Cannot add items of different types.")

  def __sub__(self, other: InventoryItem) -> InventoryItem:
    if self.name == other.name:
      return InventoryItem(self.name, max(self.quantity - other.quantity, 0))
    raise ValueError("Cannot subtract items of different types.")

  def __mul__(self, factor: object) -> InventoryItem:
    if not isinstance(factor, (int, float)):
      raise ValueError("Cannot divide by a non-numerical factor")
    return InventoryItem(self.name, floor(self.quantity * factor))

  def __truediv__(self, factor: object) -> InventoryItem:
    if not isinstance(factor, (int, float)):
      raise ValueError("Cannot divide by a non-numerical factor.")
    if factor == 0:
      raise ValueError("Cannot divide with zero.")
    return InventoryItem(self.name, floor(self.quantity / factor))

  def __eq__(self, other: object) -> bool:
    if isinstance(other, InventoryItem):
      return self.name == other.name and self.quantity == other.quantity
    return False

  def __lt__(self, other: object) -> bool:
    if isinstance(other, InventoryItem):
      return self.name == other.name and self.quantity < other.quantity
    return False

  def __gt__(self, other: object) -> bool:
    if isinstance(other, InventoryItem):
      return self.name == other.name and self.quantity > other.quantity
    return False


#---------------#
#   indexing    #
#---------------#

class Node:
  def __init__(self, value: object) -> None:
    self.value: object = value
    self.next: Node | None = None

class LinkedList:
  def __init__(self):
    self.head: Node | None = None
    self.size: int = 0

  def __len__(self) -> int:
    return self.size

  def __getitem__(self, index: int) -> object:
    if index < 0 or index >= self.size:
      raise IndexError("Index out of bounds.")
    if index == 0 or self.head == None:
      return None
    current: Node = self.head
    for _ in range(index):
      if (current.next == None):
        raise Exception("Encountered broken link.")
      current = current.next
    return current.value

  def __setitem__(self, index: int, value: object) -> None:
    if index < 0 or index >= self.size:
      raise IndexError("Index out of bounds.")
    if self.head == None:
      raise Exception("Encountered broken link.")
    current: Node = self.head
    for _ in range(index):
      if (current.next == None):
        raise Exception("Encountered broken link.")
      current = current.next
    current.value = value

  def __delitem__(self, index: int) -> None:
    if index < 0 or index >= self.size:
      raise IndexError("Index out of bounds.")
    if self.head == None:
      raise Exception("Encountered broken link.")
    if index == 0:
      self.head = self.head.next
    else:
      current: Node = self.head
      for _ in range(index):
        if (current.next == None):
          raise Exception("Encountered broken link.")
        current = current.next
      if (current.next == None):
        raise Exception("Encountered broken link.")
      current.next = current.next.next
      self.size -= 1

  def __contains__(self, value: object) -> bool:
    if self.size == 0 or self.head == None:
      return False
    for _ in range(self.size):
      current: Node | None = self.head
      while current:
        if current.value == value:
          return True
        current = current.next
    return False

  def append(self, value: object) -> None:
    pass

  def prepend(self, value: object) -> None:
    pass


#------------------------#
#   context management   #
#------------------------#

# - context management with 'with' uses the following methods:
#   - __init__()
#   - __enter__()
#   - __exit__()

class DatabaseConnection:
  def __init__(self, db_name: str) -> None:
    self.db_name: str = db_name
    self.connected: bool = False

  def __enter__(self) -> DatabaseConnection:
    self.connected = True
    return self

  def __exit__(self, exc_type: Any, exc_value: Any, traceback: Traceback) -> bool:
    self.connected = False
    if (exc_type):
      print(f"An exception occurred: {exc_type}::{exc_value}")
    return True # suppresses any exceptions that occurred

print("... starting context manager!")
with DatabaseConnection("TextDB") as db:
  print(f"DB connected: {db.connected}")

print("... exited context manager!")
print(f"DB connected: {db.connected}")


#---------------#
#   iterators   #
#---------------#

# - iterators implement the following methods:
#   - __iter__()
#   - __next__()

