################################
###   Web Scrapping Module   ###
################################
import requests # controls the web requests
from bs4 import BeautifulSoup # analyzes web documents

def log_event(event):
	print(event)
	return

def is_good_respnose(resp):
	"""
	Returns True if the contents of the request seems to be html.
	"""
	content_type = resp.headers['Content-Type'].lower()
	log_event("content_type: " + content_type)
	return (resp.status_code == 200
		and content_type is not None
		and content_type.find('html') > -1)

def simple_request(url):
	"""
	Returns the contents of the 'url' if they are valid html/xml, or None if not.
	"""
	resp = requests.get(url, headers = {"Connection": "close"})
	# '"Connection": "close"' is used to terminate the TCP connection that the requests module keeps open after the call.
	if is_good_respnose(resp):
		log_event("Data extracted from " + url)
		return resp.content
	else:
		log_event("Error in the content of the URL.")
		return None

def parse_html(content):
	"""
	Takes the contents of a website and returns a beautiful soup object.
	"""
	return BeautifulSoup(content, "html.parser")

def get_li(soup):
	return soup.select("li")

def get_li_text(soup):
	listElements = set()
	for li in soup.select("li"):
		listElements.add(li.text)
	return listElements

def get_a(soup):
	# Gets a beautiful soup object and returns a list with all its hyperlink (a) elements.
	return soup.select("a")

def get_a_url(soup):
	# Gets a beautiful soup object and returns a list with all urls contained in its hyperlinks.
	urls = set()
	for a in soup.select("a"):
		if len(a) > 0:
			urls.add(a.get("href"))
	return urls
