# python < 3.15

from typing import Any

_MISSING = object()

def search(value: Any = _MISSING) -> None:
  if value == _MISSING:
    print('No value provided...')
  elif value is None:
    print('Skipping search...')
  else:
    print(f'Searching for "{value}"')

def inspect_type(obj: Any = _MISSING) -> None:
  if obj == _MISSING:
    print('Please insert a value!')
  else:
    print(type(obj)) # type: ignore

inspect_type(20)
inspect_type(None)
inspect_type()


# python >= 3.15

# MISSING = sentinel('MISSING')

# def read_value(default = MISSING): ...
# def foo(value: int | MISSING = MISSING): ...
