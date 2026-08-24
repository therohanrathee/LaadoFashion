import os
import urllib.request
import urllib.parse
import time

os.makedirs('public/images/catalog/women', exist_ok=True)
os.makedirs('public/images/catalog/men', exist_ok=True)

images = {
    'public/images/catalog/women/blouse.jpg': 'A traditional Indian women padded blouse placed flat on a pristine white background, studio lighting, soft shadows, apparel photography, no people, highly detailed',
    'public/images/catalog/women/salwar.jpg': 'A traditional Indian women salwar suit hanging elegantly on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/women/anarkali.jpg': 'A beautiful flowing Indian Anarkali dress gown hanging elegantly on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/women/lehenga.jpg': 'A stunning Indian Bridal Lehenga skirt and choli laid flat on a pristine white background, studio lighting with soft shadows, apparel photography, no people',
    'public/images/catalog/women/saree.jpg': 'A beautiful Indian silk saree neatly folded and draped, placed on a pristine white background, studio lighting with soft shadows, apparel photography, no people',
    'public/images/catalog/women/skirt.jpg': 'An elegant women maxi skirt hanging on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/women/trouser.jpg': 'A pair of elegant women formal trousers laid flat on a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/women/dress.jpg': 'An elegant women western evening dress hanging on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/women/blazer.jpg': 'A sharp tailored women blazer jacket hanging elegantly on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',

    'public/images/catalog/men/shirt.jpg': 'A crisp men formal dress shirt neatly folded and pinned on a pristine white background, studio lighting with soft shadows, apparel photography, no people',
    'public/images/catalog/men/trouser.jpg': 'A pair of men tailored formal suit trousers neatly folded on a pristine white background, studio lighting with soft shadows, apparel photography, no people',
    'public/images/catalog/men/suit.jpg': 'A sharp tailored men blazer suit jacket hanging elegantly on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/men/waistcoat.jpg': 'An elegant men tailored waistcoat Nehru jacket hanging on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/men/kurta.jpg': 'A traditional Indian men Kurta tunic hanging elegantly on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people',
    'public/images/catalog/men/sherwani.jpg': 'An ornate Indian men Sherwani wedding jacket with intricate embroidery hanging elegantly on a wooden hanger against a pristine white background, studio lighting, apparel photography, no people'
}

for path, prompt in images.items():
    if os.path.exists(path) and os.path.getsize(path) > 0:
        continue
        
    print(f"Downloading {path}...")
    url = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?width=800&height=1000&nologo=true"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print("Success.")
        time.sleep(1)
    except Exception as e:
        print(f"Failed: {e}")

print("Done downloading images.")
