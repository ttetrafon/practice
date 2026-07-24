from datetime import datetime

time = 1582203902063 / 1000
dt = datetime.utcfromtimestamp(time).strftime("%Y-%m-%d")
print(dt)
