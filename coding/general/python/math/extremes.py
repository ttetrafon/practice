from typing import Any


scores: list[dict[str, Any]] = [
  {'name': 'Bob', 'score': 20},
  {'name': 'Sandra', 'score': 85},
  {'name': 'Alicia', 'score': 50},
]

print(max(scores, key=lambda student: student['score']))
print(min(scores, key=lambda student: student['score']))
