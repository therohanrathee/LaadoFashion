from PIL import Image

try:
    img = Image.open('public/icon-512x512.png')
    
    # Save as ICO with multiple sizes for better compatibility
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    img.save('src/app/favicon.ico', format='ICO', sizes=icon_sizes)
    print("Successfully replaced src/app/favicon.ico")
except Exception as e:
    print("Error:", e)
