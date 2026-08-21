# ReadOnly can be used to make a constant.
# This only concerns type-checking though, the value can be actually updated during runtime...

from typing import ReadOnly
import uuid

class Member:
  id: ReadOnly[uuid.UUID] = uuid.uuid4()
  name: str

  def __init__(self, name: str) -> None:
    self.name = name
