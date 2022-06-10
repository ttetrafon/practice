import time

def Valid_Time(input):
  try:
    time.strptime(input, '%H:%M:%S')
    return True
  except ValueError:
    return False


Time_start = "32:15:11"
# Time_start = "12:15:11"

print(Valid_Time(Time_start))
