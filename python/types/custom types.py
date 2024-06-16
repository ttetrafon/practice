from typing import NewType, TypeVar

# Regardless of definitions, the following only apply for type checking and not actual code execution.

# -----------------------------------------------
ZipCode = NewType('ZipCode', int)

def print_zip_code(code: ZipCode):
    print("zip-code = " + str(code))

print_zip_code(1234)


# -----------------------------------------------
# A generic type can be used to commit on a specific type between arguments, operations, and so on.
T = TypeVar('T')

def do_something(code_1: T, code_2: T) -> T:
    res: T = code_1 + code_2
    print(res)
    return res

do_something(1234, 5678)
do_something("1234", "5678")
