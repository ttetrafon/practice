from datetime import datetime
from concurrent.futures import ThreadPoolExecutor as PoolExecutor
# from concurrent.futures import ProcessPoolExecutor as PoolExecutor

final = []
number = 100000
target = range(number)

def add_to_list(elem):
	final.append(elem)

start = datetime.now()
# for i in range(number):
# 	add_to_list(i)
with PoolExecutor(max_workers=4) as executor:
	executor.map(add_to_list, target)
end = datetime.now()

print(str(number) + " elements in " + str(end - start))
