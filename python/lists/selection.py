from random import choice, choices, sample

names: list[str] = ['Bob', 'Rob', 'Cob', 'Sofia', 'Maria', 'Anna']

print('Winner:', choice(names))
print('Top 3:', sample(names, k=3))
print('Random names:', choices(names, k=5))
