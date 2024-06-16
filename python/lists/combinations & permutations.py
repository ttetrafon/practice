from itertools import permutations, combinations, combinations_with_replacement

l: list[str] = ['A', 'B', 'C', 'D', 'F']


perms: permutations = permutations(l)
# print(tuple(perms))
count: int = 0
for perm in perms:
  count += 1
  print(f"[{count}] {perm}")
print(f'... got {count} permutations\n')


combs: combinations = combinations(l, 2)
# combs: combinations_with_replacement = combinations_with_replacement(l, 2)
count = 0
for comb in combs:
  count += 1
  print(f"[{count}] {comb}")
print(f'... got {count} combinations\n')
