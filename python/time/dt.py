from datetime import datetime

time = datetime.now()
print(time)

dt = time.strftime("%d/%m/%Y %H:%M:%S")
print(dt)
print(type(dt))

