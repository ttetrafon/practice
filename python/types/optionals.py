from typing import Optional

# An Optional allows for a None value in place of the specified type.
user_selected: Optional[str] = None


def greet(name: Optional[str]) -> str:
    if name is None:
        return "Hello, guest!"
    else:
        return f"Hello, {name}!"


greet(user_selected)
