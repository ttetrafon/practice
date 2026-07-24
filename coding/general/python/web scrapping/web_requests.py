import requests

res = requests.get('https://automatetheboringstuff.com/files/rj.txt')
print("response code: ", res.status_code)

if (res.status_code == requests.codes.ok):
    print("text length:", len(res.text))
    print(res.text[:251] + "...")


print("------------------------------------")
resError = requests.get('https://inventwithpython.com/page_that_does_not_exist')
try:
    resError.raise_for_status() # .raise_for_status() throws an error on anything besides a 200
except Exception as exc:
    print('There was a problem: %s' % (exc))

print("------------------------------------")
resDownload = requests.get('https://automatetheboringstuff.com/files/rj.txt')
try:
    resDownload.raise_for_status()
    playFile = open('RomeoAndJuliet.txt', 'wb')
    for chunk in res.iter_content(100000):
        playFile.write(chunk)
    playFile.close()
except Exception as exc:
    print('There was a problem: %s' % (exc))
