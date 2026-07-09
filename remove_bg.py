from rembg import remove
from PIL import Image
import os

images = [
    ('C:/Users/15836/AppData/Local/Temp/ScreenShot_2026-07-06_110358_351.png', 'm7'),
    ('C:/Users/15836/AppData/Local/Temp/ScreenShot_2026-07-06_110450_774.png', 's7'),
    ('C:/Users/15836/AppData/Local/Temp/ScreenShot_2026-07-06_110532_443.png', 's800'),
]

output_dir = 'C:/Users/15836/Documents/孙延煦/编程实践/HarmonyCockpit-backend/frontend/images'
os.makedirs(output_dir, exist_ok=True)

for src, name in images:
    print(f"Processing {name}...")
    try:
        img = Image.open(src)
        print(f"  Original: {img.size}, mode: {img.mode}")
        result = remove(img, alpha_matting=True)
        out_path = f"{output_dir}/car-{name}.png"
        result.save(out_path, 'PNG')
        print(f"  Saved: {out_path}, size: {os.path.getsize(out_path)} bytes")
        result.close()
        img.close()
    except Exception as e:
        print(f"  Error: {e}")

print("Done!")