import re

obj = {
  "RunnerName": ["Over 5.5 Goals", "Win", "Lose"]
}
print("before:", obj)

# replace(r'^Over \d{1,2}\.\d{1} (Goals|Corners)$', 'Over', regex=True)

regex = re.compile(r'^Over \d{1,2}\.\d{1} (Goals|Corners)$')
obj["RunnerName"] = list(map(lambda x: re.sub(regex, "Over", x), obj["RunnerName"]))
print("after", obj)
