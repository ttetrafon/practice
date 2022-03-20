# Python generators are used in cases where you need to be able to consume some data in a loop,
# but the size of the data set is potentially large enough to crash your program if you load it
# into memory. Generators allow the set of things to be iterated to be unbounded.

# Data sets like a year’s worth of access log entries from a high traffic website or the luminosity
# of stars visible through a light telescope are good candidates for a generator.

# Create a generator function.
def counter(start = 0, end = 10, step = 1):
    assert step > 0 and end >= start
    i = start
    while i <= end:
        yield i
        i = i + step

print("For loop:")
for i in counter(1, 4):
    print(i)

print("List comprehension:")
print([x for x in counter(1, 4)])


# Get a generator and return its iterator.
print("\nIterator:")
my_generator = counter(1,4)
iterator = my_generator.__iter__()
print(iterator)

while(True):
    try:
        value = next(iterator)  # Same as iterator.__next__()
        print(value)
    except StopIteration:
        print("No more elements")
        break


# Create a generator directly.
demo_list = [i for i in range(1, 6, 1)]
print("\nDemo list: ", demo_list)

demo_generator = (i for i in range(1, 6, 1))
print("Demo generator: ", demo_generator)

for x in demo_generator:
    print(x)

words = "Is there any place in this town where we could find a shrubbery ?"
print("\n" + words)
gen = (word for word in words.split(" ") if len(word) > 4)
print(type(gen))
for word in gen:
    print(word)


# Generator Class
class Ranger:
    def __init__(self, start = 1, end = 6, step = 1):
        self.start = start
        self.end = end
        self.step = step or 1 # Prevent zero
        self.direction = 1 if step > 0 else 0

    def __iter__(self):
        if self.direction:
            return self.pos_counter()
        else:
            return self.neg_counter()

    def pos_counter(self):
        assert self.step > 0 and self.end >= self.start
        i = self.start
        while i < self.end:
            yield i
            i = i + self.step

    def neg_counter(self):
        assert self.step < 0 and self.end <= self.start
        i = self.start
        while i > self.end:
            yield i
            i = i + self.step

print("\nClass:")
r = Ranger()
l1 = [x for x in r]
print(l1)

r2 = Ranger(-5, -10, -1)
l2 = [x for x in r2]
print(l2)


# Generator Subsequent Calls
print("\nWe can iterate a range twice:")
demo_range = range(1, 6, 1)
print([x for x in demo_range])
print([x for x in demo_range])

print("\nSame with a list:")
demo_list = [x for x in demo_range]
print([x for x in demo_list])
print([x for x in demo_list])

print("\nNOT SO with a generator:")
# Note the parentheses here to construct a generator
demo_generator = (x for x in demo_range)
print([x for x in demo_generator])
print([x for x in demo_generator])

# wrapping a generator in a class that implements the __iter__ function solves this problem.
print("\nIn a class with __iter__:")
class FiveNumbers:
    def __iter__(self):
        gen_exp = (i for i in range(1,6))
        return gen_exp

numbers = FiveNumbers()
print([x for x in numbers])
print([x for x in numbers])

