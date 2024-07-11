myself: dict[str, str] = {
  "name": "Nakis",
  "age": 29,
  "occupation": "student"
}

# .get(key, default)
print(myself.get("name", "unnamed"))
print(myself.get("age_oops", 50))

# .setdefault(key, default) returns the value if it exists, or sets the value with the default and then returns it if it doesn't exist
scores: dict[str, int] = {
  "Bob": 29,
  "Maria": 82,
  "Nakis": 55
}
print(scores.setdefault("Bob", 0))
print(scores.setdefault("Anna", 0))
print(scores)

# | combines dictionaries together
# |= updates the first dictionary with the second's values
a: dict[str, int] = {'a': 1, 'b': 5}
b: dict[str, int] = {'c': 3, 'd': 2}
c = a | b
print(c)
a |= b
print(a)
