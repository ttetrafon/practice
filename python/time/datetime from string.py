from datetime import datetime

input = "2024-09-22T19:00:00.000Z"
format = "%Y-%m-%dT%H:%M:%S.%fZ"

dt_object = datetime.strptime(input, format)
print(dt_object)
