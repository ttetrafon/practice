from dateutil import parser

date = "Oct 21 2021"
print(date)
obj = parser.parse(date)
print(str(obj))
