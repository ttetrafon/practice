from typing import List, TypeVar

# List (old)
x: List[int] = []

# list (3.9+)
y: list[int] = []
z = list[str]()

# Origin & Args
t = list[int]
print("type: ", type(t))
# print("origin: ", t.__origin__)
# print("origin: ", t.__args__)

# Parameters
T = TypeVar('T')
print("type variable: ", T)
d = dict[str, T]
# print(d.__parameters__)

# Comparing types

