from datetime import datetime

time = datetime.now()
print(time)

dt = time.strftime("%d/%m/%YT%H:%M:%SZ")
print(dt)
print(type(dt))
