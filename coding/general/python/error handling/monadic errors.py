from dataclasses import dataclass
from typing import Callable, Protocol


class Result[T, E](Protocol):
  def map[U](self, f: Callable[[T], U]) -> "Result[U, E]": ...
  def bind[U](self, f:Callable[[T], "Result[U, E]"]) -> "Result[U, E]": ...
  def unwrap_or[U](self, default: U) -> T | U: ...

@dataclass(slots=True)
class Ok[T, E=str]:
  value: T

  def map[U](self, f: Callable[[T], U]) -> Result[U, E]:
    return Ok(value=f(self.value))

  def bind[U](self, f: Callable[[T], Result[U, E]]) -> Result[U, E]:
    return f(self.value)

  def unwrap_or[U](self, default: U) -> T | U:
    return self.value

@dataclass(slots=True)
class Err[E](Exception):
  error: E

  def map[T, U](self, f: Callable[[T], U])-> Result[U, E]:
    return self # type: ignore

  def bind[T, U](self, f: Callable[[T], Result[U, E]]) -> Result[U, E]:
    return self # type: ignore

  def unwrap_or[U](self, default: U) -> U:
    return default


def parse_int(s: str) -> Result[int, str]:
  try:
    return Ok(int(s))
  except ValueError:
    return Err(f"not an integer: {s!r}")

def ensure_positive(n: int) -> Result[int, str]:
  if n < 0:
    return Err("number must be positive")
  return Ok(n)

def parse_config_line(line: str) -> Result[tuple[str, int], str]:
  # example: 'key: value'
  line = line.strip()

  if ":" not in line:
    return Err("config line must contain ':'")

  key, _, rest = line.partition(":")

  key = key.strip()
  if not key:
    return Err("key must be non-empty")

  try:
    rest = rest.strip()
    value = int(rest)
  except ValueError:
    return Err(f"value must be an integer, got {rest!r}")

  return Ok((key, value))

def validate_port(pair: tuple[str, int]) -> Result[tuple[str, int], str]:
  key, value = pair

  if key != "port":
    return Err(f"unknown key {key!r}")

  if not (1 <= value <= 65535):
    return Err(f"port must be in range (1, 65535), got {value!r}")

  return Ok(pair)


def main() -> None:
  print("parse_int('42'):", parse_int('42'))
  print("parse_int('hello'):", parse_int('hello'))

  r1: Result[int, str] = parse_int("42").map(lambda n: n * 2)
  print("map:", r1)

  r2: Result[int, str] = parse_int("42").bind(ensure_positive)
  print("bind (Ok):", r2)

  r3: Result[int, str] = parse_int("-21").bind(ensure_positive)
  print("bind (error):", r3)

  value: int = parse_int("x").unwrap_or(0)
  print("unwrap_or:", value)

  raw: str = "port: 8080"
  result: Result[tuple[str, int], str] = parse_config_line(raw).bind(validate_port)
  print("Valid line:", result)

  print("Invalid line (1):", parse_config_line("port: not_a_number").bind(validate_port))
  print("Invalid line (2):", parse_config_line("port 8080").bind(validate_port))
  print("Invalid line (3):", parse_config_line("port: 80808080").bind(validate_port))

  final: tuple[str, int] = result.unwrap_or(("port", 80))
  print("final:", final)

if __name__ == '__main__':
  main()
