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
