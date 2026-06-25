# Strings are iterable
name: str = 'James'
first, *_, last = name
print(first, last)
print(*name, sep='-')

for letter in name:
  print(letter)
