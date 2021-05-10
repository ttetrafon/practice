log = open("test.log", "a")

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
log.write("test data:\n")
log.writelines(["".join(str(data))])
log.write("\n")

log.close()
