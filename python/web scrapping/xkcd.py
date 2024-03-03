import requests, bs4, os, time

url = 'https://xkcd.com'
os.makedirs('xkcd', exist_ok=True)

while not url.endswith('#'):
    # Download the page
    print('Downloading page %s...' % url)
    res = requests.get(url)
    res.raise_for_status()
    soup = bs4.BeautifulSoup(res.text, 'html.parser')

    # Find the URL of the comic image
    comic = soup.select('#comic img')
    if comic == []:
        print("... did not find a comic image")
    else:
        comicUrl = "https:" + comic[0].get("src")
        print('Downloading image %s...' % (comicUrl))

        # Determine the image filename, and break if already downloaded
        filename = comicUrl.split("/")[-1]
        if (os.path.exists(os.path.join('xkcd', filename))):
            print("... found existing image (%s), aborting" % (filename))
            break

        # Download the image
        # TODO: save these in documents/funny/xkcd instead...
        res = requests.get(comicUrl)
        res.raise_for_status()
        imageFile = open(os.path.join('xkcd', os.path.basename(comicUrl)),'wb')

        # Save the image in ./xkcd
        for chunk in res.iter_content(100000):
            imageFile.write(chunk)
        imageFile.close()

    # Get the Prev button's url
    prevLink = soup.select('a[rel="prev"]')[0]
    url = 'https://xkcd.com' + prevLink.get('href')

    # Add a small delay before the next request to avoid DDOSing them
    time.sleep(1)

print("done")