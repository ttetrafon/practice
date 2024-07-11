from collections import Counter

numbers: list[int] = [1, 5, 7, 9, 17, 5, 17, 17, 823, 1567, 7536187, 15867421, 823, 2]
counter: Counter = Counter(numbers)

print(counter.total())
print(counter.most_common())
print(counter.most_common(n=2))



letters: str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
for i, letter in enumerate(letters):
  print(f'{(i + 1)}: {letter}')
