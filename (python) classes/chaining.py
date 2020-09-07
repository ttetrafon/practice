class Number:
	number = 0

	def __init__(self, number):
		self.number = number

	def add(self, add):
		self.number += add
		return self

	def subtract(self, minus):
		self.number -= minus
		return self

five = Number(5)
print(five.number)

print(five.add(10).subtract(2).number)
