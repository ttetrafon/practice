import re

mobileNumberRegex = re.compile(r'0\d\d-\d\d-\d\d-\d\d\d\d')
mo1 = mobileNumberRegex.search("My number is 075-98-47-1692")
print('Phone number found: ' + mo1.group())


phoneNumberRegex = re.compile(r'(\+\d\d)-(\d\d\d)-(\d\d\d-\d\d\d\d)')
mo2 = phoneNumberRegex.search("My number is +44-415-582-1376")
print('Phone number found: ' + mo2.group())
print(mo2.group(0))
print(mo2.group(1))
print(mo2.group(2))
country, area, phone = mo2.groups()
print("country code: " + country)
print("area code: " + area)
print("phone number: " + phone)
