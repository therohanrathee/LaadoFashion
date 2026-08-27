from PIL import Image
import numpy as np

img = Image.open('public/images/home/mobile_hero_tailor_v4.jpg').convert('RGB')
img_np = np.array(img)
h, w, _ = img_np.shape

# The image has a hard line at y=481 where the tailor image starts.
# Let's fade it from y=300 to y=650 so it seamlessly transitions into the black background.

gradient = np.ones((h, w, 1), dtype=np.float32)
fade_start = 300
fade_end = 750

for y in range(h):
    if y < fade_start:
        gradient[y, :, 0] = 0.0
    elif y > fade_end:
        gradient[y, :, 0] = 1.0
    else:
        t = (y - fade_start) / (fade_end - fade_start)
        smooth_t = 3*(t**2) - 2*(t**3)
        gradient[y, :, 0] = smooth_t

# Use exactly the top left pixel color to blend seamlessly
bg_color = img_np[0, 0, :]
black_bg = np.zeros_like(img_np)
black_bg[:, :] = bg_color

blended = img_np * gradient + black_bg * (1 - gradient)
blended = blended.astype(np.uint8)

result = Image.fromarray(blended)
result.save('public/images/home/mobile_hero_tailor_v5.jpg', quality=95)
print("Saved mobile_hero_tailor_v5.jpg correctly")
