# A decorator with the following setup will run immediately (IIFE [immediately invoked functional expression])

@lambda _: _() # type: ignore
def setup() -> int:
  print("All set up!")
  return 10


print(f"{setup=}")
