import json, hashlib

obj = {
  "Event": "Buffaloes vs Roes",
  "Market": "THis is a market",
  "RunnerName": ["Over 5.5 Goals", "Win", "Lose"]
}


print(str(obj))
h = int(hashlib.sha256((str(obj)).encode('utf-8')).hexdigest(), 16)
print(h)