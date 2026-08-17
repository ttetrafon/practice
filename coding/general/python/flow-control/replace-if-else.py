from collections.abc import Callable

def lowercase(text: str) -> str:
  return text.lower()

def tittle_case(text: str) -> str:
  return ' '.join(word.capitalize() for word in text.split())

def quote(text: str) -> str:
  return f'"{text}"'

def shout(text: str) -> str:
  return text.upper()

# def execute (commands: list[str], text: str) -> str:
#   for command in commands:
#     if command == 'lower':
#       text = lowercase(text)
#     elif command == 'title':
#       text = tittle_case(text)
#     elif command == 'quote':
#       text = quote(text)
#     else:
#       print(f'Unknown command: {command}')
#   return text

executors: dict[str, Callable[[str], str]] = {
  'lower': lowercase,
  'title': tittle_case,
  'quote': quote,
  'shout': shout,
}

def execute(commands: list[str], text: str) -> str:
  for command in commands:
    if command_func := executors.get(command):
      text = command_func(text)
    else:
      print(f'Unknown command: {command}')
  return text

cmds: list[str] = ['lower', 'fix', 'title', 'quote', 'shout']
text: str = 'Νίψον ανομήματα μη μόναν όψιν'
print(execute(cmds, text))
