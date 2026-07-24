from typing import Any, Callable


# Decorators are used to inject functionality in existing functions without modifying them.abs

def decor(orig_func: Callable[..., int]) -> Callable[..., Any]:
    def d_func(x: int, y: int) -> int:
        print(f"---> add({x}, {y})")
        return orig_func(x, y)
    return d_func

@decor
def add(x: int, y: int) -> int:
    return x + y

if __name__ == "__main__":
    res = add(5, 3)
    print(res)
