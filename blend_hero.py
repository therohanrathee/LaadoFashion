from PIL import Image
import numpy as np

img = Image.open('public/images/home/mobile_hero_tailor_v4.jpg').convert('RGB')
img_np = np.array(img)

diffs = np.sum(np.abs(np.diff(img_np, axis=0)), axis=(1,2))
edge_y = np.argmax(diffs)
print(f"Detected hard edge at y={edge_y}")

h, w, _ = img_np.shape

gradient = np.ones((h, w, 1), dtype=np.float32)
fade_start = edge_y - 20
fade_end = edge_y + 400

for y in range(h):
    if y < fade_start:
        gradient[y, :, 0] = 0.0
    elif y > fade_end:
        gradient[y, :, 0] = 1.0
    else:
        t = (y - fade_start) / (fade_end - fade_start)
        smooth_t = 3*(t**2) - 2*(t**3)
        gradient[y, :, 0] = smooth_t

black_bg = np.zeros_like(img_np)
# Use a very dark color from the image to blend into, not pure black
bg_color = np.array([5, 8, 8], dtype=np.uint8)
black_bg[:, :] = bg_color

blended = img_np * gradient + black_bg * (1 - gradient)
blended = blended.astype(np.uint8)

result = Image.fromarray(blended)
result.save('public/images/home/mobile_hero_tailor_v5.jpg', quality=95)
print("Saved mobile_hero_tailor_v5.jpg")

