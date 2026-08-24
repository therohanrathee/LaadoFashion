import os
import glob
from rembg import remove
from PIL import Image

def process_image(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        # Load image
        with open(input_path, 'rb') as i:
            input_bytes = i.read()
        
        # Remove background
        output_bytes = remove(input_bytes)
        
        # Convert to PIL Image for processing
        import io
        img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")
        
        # Create a white background image
        white_bg = Image.new("RGBA", img.size, "WHITE")
        # Paste the image on the white background using the alpha channel as mask
        white_bg.paste(img, (0, 0), img)
        
        # Convert to RGB (WebP doesn't strictly need it, but standard for ecom)
        final_img = white_bg.convert("RGB")
        
        # Resize if it's too large to save space (max 800x800 for ecom thumbnails)
        final_img.thumbnail((800, 800), Image.Resampling.LANCZOS)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save as WebP
        final_img.save(output_path, "webp", quality=85)
        print(f"Saved optimized image to {output_path}")
        
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

# Directories
base_input = "images/juttis"
base_output = "public/images/juttis"

for category in ["leather", "plastic"]:
    input_dir = os.path.join(base_input, category)
    output_dir = os.path.join(base_output, category)
    
    for img_path in glob.glob(os.path.join(input_dir, "*.jpeg")) + glob.glob(os.path.join(input_dir, "*.jpg")):
        filename = os.path.basename(img_path)
        name, _ = os.path.splitext(filename)
        output_path = os.path.join(output_dir, f"{name}.webp")
        process_image(img_path, output_path)

print("All images processed successfully!")
