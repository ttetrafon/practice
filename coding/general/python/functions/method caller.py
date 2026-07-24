from operator import methodcaller

names: list[str] = ['Bob', 'James', 'Billy', 'Sandra', 'Blake', 'Solomon']

# -> methodcaller can be used instead of a lambda function, as it operates faster over the iterator

starts_with_b: methodcaller = methodcaller('startswith', 'B')
filtered_names: filter = filter(starts_with_b, names)
print('Filtered:', list(filtered_names))

count_a: methodcaller = methodcaller('count', 'a')
sorted_names = sorted(names, key=count_a)
print('Sorted:', sorted_names)
