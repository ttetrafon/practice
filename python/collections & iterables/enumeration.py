names: list[str] = ['Bob', 'Alex', 'Amy', 'Mortimer', 'James', 'Sandra']

for i, value in enumerate(names):
  print(f"{i=}, {value=}")

print("...")

for i, value in enumerate(names, start=2):
  print(f"{i=}, {value=}")
