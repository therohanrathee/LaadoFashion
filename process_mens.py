import os
import glob
from PIL import Image

input_dir = "images/men's collection"
output_dir = "public/images/catalog/men"

os.makedirs(output_dir, exist_ok=True)

files = glob.glob(f"{input_dir}/*")

for file in files:
    if not os.path.isfile(file):
        continue
    
    filename = os.path.basename(file)
    name, ext = os.path.splitext(filename)
    
    # Normalize the name for URL usage
    url_name = name.lower().replace(' ', '-').replace(':', '-')
    out_path = os.path.join(output_dir, f"{url_name}.webp")
    
    try:
        # Convert and compress
        with Image.open(file) as img:
            # Convert to RGB if necessary (e.g. RGBA for PNGs)
            if img.mode in ('RGBA', 'P', 'CMYK'):
                img = img.convert('RGB')
                
            # Resize if too large to save bandwidth, max 1200px width/height
            img.thumbnail((1200, 1600), Image.Resampling.LANCZOS)
            
            # Save as webp with high optimization
            img.save(out_path, 'webp', quality=85, optimize=True)
            
        print(f"Processed: {filename} -> {url_name}.webp")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Done processing images!")
