numbers: set[int] = {1, 2, 3}
empty_set: set[str] = set()
# `empty_set = {}` creates a dictionary, not a set!


# BASIC OPERATIONS
# - add items
numbers.add(5)
numbers.update(range(13, 25))
print(numbers)

# - remove items
numbers.remove(17)  # throws error if the element does not exist
numbers.discard(17)  # does not throw error if the element does not exist
popped_element: int = numbers.pop()  # removes the first element
# The first element is selected my memory address, not order, as sets are unordered
print(numbers)

# - check membership
is_in: bool = 1 in numbers
print("is_in:", is_in)

# - get size
length: int = numbers.__len__()
bytes: int = numbers.__sizeof__()
print("size:", length, bytes)

# - mathematical operations
a: set[int] = {1, 2, 3, 4, 5}
b: set[int] = {4, 5, 6, 7}
print("sets:", a, b)

union = a.union(b)  # `a | b`
print("union:", union)

intersection = a.intersection(b)  # a & b
print("intersection:", intersection)

difference = a.difference(b)  # a - b
print("difference:", difference)

symmetric_difference = a.symmetric_difference(b)  # a ^ b
print("symmetric_difference:", symmetric_difference)
