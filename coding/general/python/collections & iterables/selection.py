from random import choice, choices, sample

names: list[str] = ['Bob', 'Rob', 'Cob', 'Sofia', 'Maria', 'Anna']

print('Winner:', choice(names))
print('Top 3:', sample(names, k=3))
print('Random names:', choices(names, k=5))


# Reusable slices

def first_n(n: int) -> slice:
  return slice(0, n, None) # [0:n]
reversed: slice = slice(None, None, -1) # [::-1]

names: list[str] = ['Bob', 'Alex', 'Amy', 'Mortimer']
print(f"{names=}")
print(f"{names[first_n(2)]=}")
print(f"{names[reversed]=}")
