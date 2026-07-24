import random

a: int = 0
b: int = random.choice([0, 1])

try:
  print(f"{a=}, {b=}")
  print(f"{a/b=}")
except ZeroDivisionError:
  print("Error: ZeroDivisionError")
else:
  print("Operation finished...")
finally:
  print("Done!")
