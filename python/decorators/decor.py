# Decorators are used to inject functionality in existing functions without modifying them.abs

def decor(orig_func):
    def d_func(x, y):
        print(f"---> add({x}, {y})")
        return orig_func(x, y)
    return d_func

@decor
def add(x, y):
    return x + y

if __name__ == "__main__":
    res = add(5, 3)
    print(res)
