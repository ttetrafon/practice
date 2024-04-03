import multiprocessing as mp
from multiprocessing import process
import time

start = time.perf_counter()

def fun(num = 0) -> None:
    print("fun(" + str(num) + ")")
    time.sleep(num + 1)


if __name__ == '__main__':
    cores = mp.cpu_count()
    mult = 2

    processes = []
    for i in range(mult * cores):
        # create and start the processes
        p = mp.Process(target=fun, args=[i])
        p.start()
        processes.append(p)

    for proc in processes:
        # join waits for a process to complete before continuing with the code
        proc.join()

    finish = time.perf_counter()

    print(f'Total time: {round(finish - start, 2)} seconds')
