def length(text: str, include_whitespace: bool = True) -> int:
  if include_whitespace:
    return len(text)
  else:
    return len(text.replace(' ', ''))

# Protected members at module level are enforced and cannot be accessed from the outside.
# `from module import *` actually strips protected members
# `import module` allows autocompletion but pylance (or similar) mark them immediately
def _example() -> None:
  text: str = "Potato is potato..."
  print(f'Text: {text}')
  print('... length with whitespace: ' + str(length(text)))
  print('... length without whitespace: ' + str(length(text, False)))

def _main() -> None:
  _example()

if __name__ == '__main__':
  _main()
