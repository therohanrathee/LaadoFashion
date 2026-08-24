import os
from PIL import Image

def process_dir(directory):
    for filename in os.listdir(directory):
        if not (filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png')):
            continue
            
        filepath = os.path.join(directory, filename)
        name, ext = os.path.splitext(filename)
        webp_path = os.path.join(directory, f"{name}.webp")
        
        try:
            with Image.open(filepath) as img:
                img.save(webp_path, "WEBP", quality=80, method=6)
            os.remove(filepath)
            print(f"Converted {filename} to WebP -> size reduced to {os.path.getsize(webp_path)//1024} KB")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

process_dir('public/images/catalog/women')
# Also do men if any exist
if os.path.exists('public/images/catalog/men'):
    process_dir('public/images/catalog/men')
