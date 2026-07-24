import json
import pandas as pd


with open('./data.json') as file:
  data = json.load(file).get("events_map")
  print(data)

df = pd.DataFrame.from_records(data)
print(df)
