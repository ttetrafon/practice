# Asynchronous Generator
import random
import time

async def get_random():
    """Return random numbers, and sleep for value returned in seconds"""
    for _ in range(0,5):
        value = random.randint(1,4)
        yield value
        time.sleep(value)

async for i in get_random():
    print(f"get_random is sleeping for {i} seconds")

print("Finished")
