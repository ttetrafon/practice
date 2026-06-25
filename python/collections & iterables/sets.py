set_a: set[int] = {1, 2, 3, 4, 5}
set_b: set[int] = {4, 5, 6, 7, 8}

# Besides the methods available, a number of operators can be used to manipulate sets.
print(set_a | set_b) # union
print(set_a - set_b) # difference
print(set_a & set_b) # intersection
print(set_a ^ set_b) # symmetric difference (unique elements)
