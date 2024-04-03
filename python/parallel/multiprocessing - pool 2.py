from multiprocessing import Pool
import time
import math

N = 5000000
def cube(x):
    return math.sqrt(x)


if __name__ == "__main__":
    # The pool class creates by default 1 Process per CPU core
    with Pool() as pool:
        # .map(function, list) runs the function on all list items over the pooled processes
        result = pool.map(cube, range(10,N))
    print("Program finished!")
