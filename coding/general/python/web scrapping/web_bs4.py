import requests, bs4

res = requests.get('https://nostarch.com')
res.raise_for_status()

noStarchSoup = bs4.BeautifulSoup(res.text, 'html.parser')
# Instead of the bs4 'html.parser', we can use the faster alternative lxml (`pin install lxml`).
print(type(noStarchSoup))


print("-----------------------------------------")
exampleFile = open("example.html")
exampleSoup = bs4.BeautifulSoup(exampleFile.read(), 'html.parser')

# Elements in the page can be found with .select("selector"), which understands CSS selectors.
elems = exampleSoup.select('#author')
print(type(elems))
print(len(elems))
print(type(elems[0]))
print(str(elems[0]))
print(elems[0].getText())
print(elems[0].attrs)

pElems = exampleSoup.select('p')
print(str(pElems[0]))
print(pElems[0].getText())
print(str(pElems[1]))
print(pElems[1].getText())
print(str(pElems[2]))
print(pElems[2].getText())

spanElem = exampleSoup.select('span')[0]
print(str(spanElem))
print(spanElem.get('id'))
print(spanElem.get('some_nonexistent_addr') == None)
print(spanElem.attrs)
