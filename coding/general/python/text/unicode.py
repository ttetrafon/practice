# Strings in python3 are encoded in unicode.
my_string: str = "Hi \u2119\u01b4\u2602\u210c\xf8\u1f24"
print(type(my_string), my_string)

# Strings can be stored in byte format with the 'b' prefix.
my_bytes = b"Hello World"
print(type(my_bytes), my_bytes)

# Bytes and Unicode strings won't be implicitly changed to one another.
# "Hello" + b"World" # -> throws an error.

# The above affect how files are read (`open(filepath, flag, encoding)`) in python3.
# An 'r' flag means the file contents are treated as unicode.
# An 'rb' flag means the file contents are treated as bytes.
# ! The encoding param should always be used so that file contents are read properly.

