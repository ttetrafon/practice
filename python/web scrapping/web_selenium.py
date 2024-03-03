from selenium import webdriver
from selenium.webdriver.common.by import By

# If not present, webdrivers need to be installed manually and added to path
# - Firefox: https://github.com/mozilla/geckodriver/releases
# - Chrome: https://sites.google.com/a/chromium.org/chromedriver/downloads

driver = webdriver.Firefox()
driver.implicitly_wait(1)
driver.get('https://inventwithpython.com')

try:
    # get info on the page
    print('title: ', driver.title)

    # find elements
    img = driver.find_element(by=By.CLASS_NAME, value='cover-thumb')
    print('Found <%s> element with that class name!' % (img.tag_name))

    # click on an element
    link = driver.find_element(by=By.LINK_TEXT, value='Read Online for Free')
    link.click()

except Exception as exc:
    print('There was a problem: %s' % (exc))

# driver.quit()