import urllib.request
import re

url = "https://share.google/XxeDtk2r2snj9rhdg"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    print("Redirected URL:", response.geturl())
    # Try to find something that looks like a review or title
    title = re.search(r'<title>(.*?)</title>', html)
    if title: print("Title:", title.group(1))
except Exception as e:
    print("Error:", e)
