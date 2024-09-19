import re

CRLF: str = "\r\n"
data: str = ""

def send_message(msg: str):
  print(f"sending message: '{msg}'")

# d: str = "This is a message with no end"
# d: str = "This is a full message\r\n"
# d: str = "This is a full message\r\nThis is a second, incomplete, message"
# d: str = "This is a full message\r\nThis is a second, full, message\r\n"
d: str = "This is a ful message\r\nThis is a second, full, message\r\nThis is a third, incomplete, message"

d_len = len(d)
print(f"initial message: '{d}' [len={d_len}]")

indices: list[int] = [m.start() for m in re.finditer(CRLF, d)]
l_indices: int = len(indices)
print(f"CRLF indices: {indices} [len={l_indices}]")

if l_indices > 0:
  start: int = 0
  for i in range(l_indices):
    index = indices[i]
    msg = d[start:index]
    send_message(msg)
    start = index + 2
    if (i == l_indices - 1) and start < d_len:
      data += d[start:]
else:
  data += d

print(f"data: '{data}'")
