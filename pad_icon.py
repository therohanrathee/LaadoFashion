from PIL import Image

files = ['public/apple-icon.png', 'public/apple-touch-icon.png', 'public/icon-192x192.png', 'public/icon-512x512.png']
for filename in files:
    try:
        img = Image.open(filename).convert("RGBA")
        bg_color = img.getpixel((0, 0))
        
        old_size = img.size
        # scale down by 25%
        new_size = (int(old_size[0] * 0.75), int(old_size[1] * 0.75))
        
        resized = img.resize(new_size, Image.Resampling.LANCZOS)
        new_img = Image.new("RGBA", old_size, bg_color)
        
        offset = ((old_size[0] - new_size[0]) // 2, (old_size[1] - new_size[1]) // 2)
        new_img.paste(resized, offset, resized)
        
        new_img.save(filename)
        print(f"Processed {filename}")
    except Exception as e:
        print(f"Error on {filename}: {e}")
