import os
from PIL import Image

src_dir = "images/women's collection"
dest_dir = "public/images/catalog/women"

os.makedirs(dest_dir, exist_ok=True)

# List of files
for filename in os.listdir(src_dir):
    if filename.startswith('.'): continue
    
    src_path = os.path.join(src_dir, filename)
    name, ext = os.path.splitext(filename)
    
    # standardize name (lowercase, replace spaces with hyphens)
    safe_name = name.lower().replace(' ', '-')
    dest_path = os.path.join(dest_dir, f"{safe_name}.webp")
    
    print(f"Processing {filename} -> {safe_name}.webp")
    try:
        with Image.open(src_path) as img:
            # Convert to RGB if it's RGBA but saving as JPEG, though WebP supports RGBA.
            # But let's just convert it directly.
            img.save(dest_path, 'WEBP', quality=85)
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Done")
