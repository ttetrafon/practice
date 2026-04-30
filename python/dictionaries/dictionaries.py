myself: dict[str, str | int] = {
    "name": "Nakis",
    "age": 29,
    "occupation": "student"
}

# .get(key, default) -> returns `None` if the key does not exist and no default is given
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

# To access data groups in a dictionary:
# - dict.keys()
# - dict.values()
# - dict.items()

# Can use the above with `for ... in ...` to loop through the keys/values/items of a dictionary.

# To remove items form a dictionary:
# - del dict[key]: removes a key from the dictionary
# - dict.pop(key): removes the key and returns the value
# - dict.clear(): removes all keys from the dictionary

# `|`: combines dictionaries together
# `|=` (`dict.update()`): updates the first dictionary with the second's values
a: dict[str, int] = {'a': 1, 'b': 5, 'c': 7}
b: dict[str, int] = {'c': 3, 'd': 2}
c = b | a
print(c)
a |= b
print(a)
