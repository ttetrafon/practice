from multiprocessing import Process


def bubble_sort(array):
    check = True
    while check == True:
        check = False
        for i in range(0, len(array)-1):
            if array[i] > array[i+1]:
                check = True
                temp = array[i]
                array[i] = array[i+1]
                array[i+1] = temp
    print("Array sorted: ", array)


if __name__ == '__main__':
    # Process runs the activity in a separate process.
    p = Process(target=bubble_sort, args=([1, 9, 4, 5, 2, 6, 8, 4],))

    # .start() starts the new process
    p.start()

    # .join() waits for all processes to terminate
    p.join()
