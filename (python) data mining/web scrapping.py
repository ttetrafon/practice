import requests # controls web requests
import re
from bs4 import BeautifulSoup # analyzes web documents
from sys import exit
from wbm import *

print(">----------------------------------------------<")
urlBase = "https://thetrove.net/Assets/3D/3D%20models%20(figures%20mostly)/28mm_River_Terrain/files/"
targetDir = "C:\\Users\\Nakis\\Desktop\\"

re_stl = re.compile(".stl")

website = simple_request(urlBase)
# print(website)
if website is None:
	sys.exit()

soup = parse_html(website)
# print(soup.prettify())

stls = set()
folders = set()
for tr in soup.select("tr"):
	# print(tr)
	for a in tr.select("a"):
		# print(a)
		# print(a.text)
		mo = re_stl.search(a.text)
		if mo is None:
			folders.add(a.text)
		else:
			stls.add(a.text)
	# print(tr.get("window.location.href"))
	print("....................................................")

print(folders)
print(stls)


