from functools import total_ordering
from typing import Self

@total_ordering
class Person:
  def __init__(self, name: str, age: int) -> None:
    self.name = name
    self.age = age

  def work(self) -> None:
    print(f'{self.name} is working...')

  def eat(self) -> None:
    print(f'{self.name} cannot eat right now, too much work to do!')

  def sleep(self) -> None:
    print(f'{self.name} is now sleeping, but dreams of working...')

  def __eq__(self, other: Self) -> bool:
    # compares the values of the properties to determine equality
    return self.__dict__ == other.__dict__

  def __lt__(self, other: Self) -> bool:
    return (self.name.lower(), self.age) < (other.name.lower(), other.age)

  # The rest of the comparison operations will be implemented automatically through the @total_ordering decorator
  # To work, it requires that __eq__ and one other comparison (__lt__, __le__, __gt__, __ge__) are defined in the class, so it can derive the logic for the rest of them.
  # (*) The total_ordering operator has a heavy impact on speed, so it may cause a bottleneck. In that case, it's better to implement all required comparisons individually.
  # (**) The total_ordering operator does not override already defined comparisons within the class or its superclasses, even if the original implementation is abstract.


def main() -> None:
  mario: Person = Person('Mario', 35)
  luigi: Person = Person('Luigi', 40)
  print('mario == luigi:', mario == luigi)
  print('mario < luigi:', mario < luigi)
  print('mario > luigi:', mario > luigi)

  bob: Person = Person('Bob', 21)
  mpampis: Person = Person('Bob', 21)
  print('bob == mpampis:', bob == mpampis)
  print('bob <= mpampis:', bob <= mpampis)


if __name__ == '__main__':
  main()
