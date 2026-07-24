import concurrent.futures as fr
import time
import random

start = time.perf_counter()

def fun(num = 1) -> None:
    print("fun(" + str(num + 1) + ")")
    time.sleep(num + 1)
    return f'fun:{num+1} finished'


if __name__ == '__main__':
    with fr.ProcessPoolExecutor() as exec:
        count = 10
        times = list(range(count))
        random.shuffle(times)
        print(times)

        # Use a list to create and get results as soon as they finish.
        # results = [exec.submit(fun, i) for i in times]
        # for f in fr.as_completed(results):
        #     print(f.result())

        # Use executor.map when we want the results in the order they were executed.
        results = exec.map(fun, times)
        for r in results:
            print(r)

        finish = time.perf_counter()
        print(f'Total time: {round(finish - start, 2)} seconds')

    # cores = mp.cpu_count()
    # mult = 2

    # processes = []
    # for i in range(mult * cores):
    #     # create and start the processes
    #     p = mp.Process(target=fun, args=[i])
    #     p.start()
    #     processes.append(p)

    # for proc in processes:
    #     # join waits for a process to complete before continuing with the code
    #     proc.join()


