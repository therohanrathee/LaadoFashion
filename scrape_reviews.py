import urllib.request

url = "https://magicpin.in/Gurgaon/Ashok-Vihar/Fashion/Laado-Fashion-And-Boutique/store/9d5a9d/reviews/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    with open('magicpin.html', 'w') as f:
        f.write(html)
    print("Success")
except Exception as e:
    print("Error:", e)
