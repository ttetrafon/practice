def k(a,b,c):
	res = a ^ b
	try:
		res = res + c
	except OverflowError:
		res = 255
	finally:
		return res

print(k(2, 3, 5))
