import re

CRLF: str = "\r\n"
data: str = '{"op":"mcm","id":1,"clk":"AMwLAIUMAKYI","pt":1728329109941,"mc":[{"id":"1.233777316","rc":[{"bdatb":[[0,4.7,176.07]],"id":5333044,"hc":-0.5},{"bdatb":[],"bdatl":[[0,1.28,1816.46]],"id":5408226,"hc":0.5},{"bdatb":[[0,7.34,198.46]],"id":5333044,"hc":-0.'

def send_message(msg: str):
  print(f"sending message: '{msg}'")

# d: str = "This is a message with no end"
# d: str = "This is a full message\r\n"
# d: str = "This is a full message\r\nThis is a second, incomplete, message"
# d: str = "This is a full message\r\nThis is a second, full, message\r\n"
# d: str = "This is a full message\r\nThis is a second, full, message\r\nThis is a third, incomplete, message"
# d: str = "This is a full message\r\nThis is a second, full, message\r\nThis is a third, full message\r\n"
d: str = '75},{"bdatb":[],"bdatl":[[0,1.43,673.54]],"id":5408226,"hc":0.25},{"bdatb":[],"bdatl":[[0,1.16,1255.76]],"id":5408226,"hc":0.75}]},{"id":"1.233777359","rc":[{"bdatb":[[0,4.7,176.07]],"id":5333044}]}]}\r\n{"op":"mcm","id":1,"clk":"ANALAIwMAKsI","pt":1728329109999,"mc":[{"id":"1.234113793","rc":[{"bdatl":[[0,1.05,122.91]],"id":1222347}]}]}\r\n{"op":"mcm","id":1,"clk":"ANULAI8MAKwI","pt":1728329110023,"mc":[{"id":"1.234068224","rc":[{"bdatb":[[0,3.65,163.04]],"id":30246},{"bdatl":[[0,1.38,530.53]],"id":110503}]}]}\r\n{"op":"mcm","id":1,"clk":"ANULAI8MAKwI","pt":1728329110032,"mc":[{"id":"1.234051297","rc":[{"bdatb":[[0,6.2,20.88]],"id":47973}]}]}\r\n{"op":"mcm","id":1,"clk":"ANULAI8MAKwI","pt":1728329110036,"mc":[{"id":"1.233896623","rc":[{"bdatl":[[0,1.25,606.63]],"id":4893595}]},{"id":"1.233896673","rc":[{"bdatb":[[0,5,151.66]],"id":201255,"hc":0.5},{"bdatl":[[0,1.15,1167.11]],"id":4893595,"hc":-0.25},{"bdatl":[[0,1.25,606.63]],"id":4893595,"hc":-0.5},{"bdatb":[],"bdatl":[[0,1.35,674.03]],"id":4893595,"hc":-0.75}]}]}\r\n'

d_len = len(d)
print(f"initial message: '{d}' [len={d_len}]\n-----------------")

indices: list[int] = [m.start() for m in re.finditer(CRLF, d)]
l_indices: int = len(indices)
print(f"CRLF indices: {indices} [len={l_indices}]")

if l_indices > 0:
  start: int = 0
  for i in range(l_indices):
    index = indices[i]
    msg = d[start:index]
    if len(data) > 0:
      msg = data + msg
      data = ''
    send_message(msg)

    start = index + 2
    if (i == l_indices - 1) and start < d_len:
      data += d[start:]
else:
  data += d

print(f"data: '{data}'")
