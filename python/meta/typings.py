from typing import Never, NoReturn

# Functions with Never (python <3.3) or NoReturn will not return anything at all.

def throw_func_1(msg: str) -> Never:
  raise Exception(msg)

def throw_func_2(msg: str) -> NoReturn:
  raise Exception(msg)


# Never can also be used to check coverage
# Requires the mypy module (installed globally)

def assert_never(arg: Never) -> NoReturn:
  raise AssertionError('Expected code is unreachable.')

class State(Enum):
  OFF: int = 0
  ON: int = 1
  LIMBO: int = 2


def main() -> None:
  state: State = State.ON

  if state == State.ON:
    print('Turned On!')
  elif state == State.OFF:
    print('Turned Off!')
  else:
    # Here we check that this block should never be reached
    assert_never(state)


if __name__ == '__main__':
  main()
