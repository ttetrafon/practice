def getNum(str, type):
    return 0 if str == "-" else type(str)

print(getNum("15.45", float))
print(getNum("17", int))