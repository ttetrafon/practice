from functools import cache

# Find the best total between the houses, as long as no two consecutive houses are accessed
houses: list[int] = [2, 7, 9, 3, 1, 8, 7, 3, 1, 5, 7]

@cache
def best(i: int) -> int:
  if i < 0:
    return 0
  if i == 0:
    return houses[0]
  return max(best(i - 1), best(i - 2) + houses[i])

print(houses)
print(best(len(houses) - 1))
