packet_header_size = 12
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]

out = []
out.extend([data[i] for i in range(0, packet_header_size)])
out.extend([0 for i in range(packet_header_size, len(data))])

print(data)
print(out)


# ----------------------------------------------------------------
numbers: list[int] = list(range(1, 11))
text: str = "Hello World!"

# A slice object can be used in place of slice notation.
reverse: slice = slice(None, None, -1)
first_five: slice = slice(0, 5)

print(numbers[reverse])
print(text[reverse])
print(numbers[first_five])
