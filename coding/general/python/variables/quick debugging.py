from typing import List


name: str = "ttetrafon"
age: int = 42

print(f"{name=}, {age=}")
print(f"{len(name)=}")
print(f"{1 + 1 =}")


settings: dict[str, str] = {
  'sep': ', ',
  'end': '!\n'
}
names: List[str] = ['Bob', 'James', 'Sandra', 'Luigi']
print(*names, sep=', ', end='.\n')
print(*names, **settings) # type: ignore
