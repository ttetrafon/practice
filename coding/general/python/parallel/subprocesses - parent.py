# https://www.datacamp.com/tutorial/python-subprocess

import subprocess

# subprocess.run() starts a subprocess and waits for it to complete
result = subprocess.run(args=["python", "subprocesses - child (synced).py"], capture_output=True, text=True, check=True)
print(result.stdout)


# subprocess.Popen starts a subprocess and continues without waiting
# - a subprocess can be interacted with through .communicate(), .poll(), .wait(), .terminate(), and .kill()
# - a .PIPE is a unidirectional link that allows the parent and child processes to communicate in real time
processes = []
for i in range(20):
  p = subprocess.Popen(args=["python", "subprocesses - child (async).py", str(i)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
  processes.append(p)

# for p in processes:
#   while p.poll() is None:
#     output, err = p.communicate(timeout=0.1)
#     if output:
#       print(f"Output from '{p.args[0]}': {output.decode()}")
#     if err:
#       print(f"Error from '{p.args[0]}': {err.decode()}")
#   p.wait()
