import traceback

def raiser():
    raise Exception("user raised exception")

with open("out.log", "w") as log:
    try:
        raiser()
    except Exception as exc:
        print(exc)
        log.write(str(exc) + "\n")
        log.write(traceback.format_exc())
        log.write("\n")
