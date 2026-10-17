"""Build the 1200 × 630 social preview from the invitation's local artwork."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "compartir.jpg"
W, H = 1200, 630
GOLD = (232, 200, 106)
CREAM = (251, 247, 236)


def font(name, size):
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


sky = Image.open(ROOT / "assets" / "fondo-cielo.jpg").convert("RGB")
# Center on the quiet middle of the artwork so the copy stays legible.
sky = sky.resize((W, round(sky.height * W / sky.width)), Image.Resampling.LANCZOS)
top = max(0, (sky.height - H) // 2 - 105)
image = sky.crop((0, top, W, top + H))
image = Image.blend(image, Image.new("RGB", (W, H), (9, 15, 46)), 0.38)
draw = ImageDraw.Draw(image)

# A restrained matte panel keeps the photo and typography distinct at thumbnail size.
draw.rounded_rectangle((38, 38, 1162, 592), radius=24, fill=(14, 22, 59))
draw.rounded_rectangle((38, 38, 1162, 592), radius=24, outline=(76, 83, 113), width=2)

photo = Image.open(ROOT / "assets" / "festejada.jpg").convert("RGB")
photo = ImageOps.fit(photo, (348, 506), method=Image.Resampling.LANCZOS, centering=(0.5, 0.18))
photo_mask = Image.new("L", photo.size)
ImageDraw.Draw(photo_mask).rounded_rectangle((0, 0, 347, 505), radius=13, fill=255)
image.paste(photo, (774, 62), photo_mask)
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((773, 61, 1122, 568), radius=13, outline=CREAM, width=3)

sans = font("arialbd.ttf", 20)
title = font("georgia.ttf", 76)
name = font("georgiai.ttf", 51)
date = font("arial.ttf", 24)

draw.text((88, 88), "INVITACIÓN DE CUMPLEAÑOS", font=sans, fill=GOLD, stroke_width=0)
draw.line((88, 133, 704, 133), fill=(91, 100, 150), width=2)
draw.text((82, 180), "La alegría", font=title, fill=CREAM)
draw.text((82, 267), "de coincidir", font=title, fill=CREAM)

# Small single-line heart, drawn rather than using an emoji glyph.
draw.line((91, 384, 190, 384), fill=GOLD, width=2)
draw.arc((196, 376, 219, 397), 130, 315, fill=GOLD, width=2)
draw.arc((215, 376, 238, 397), 225, 410, fill=GOLD, width=2)
draw.line((201, 389, 217, 405), fill=GOLD, width=2)
draw.line((233, 389, 217, 405), fill=GOLD, width=2)

draw.text((84, 416), "Victoria", font=name, fill=GOLD)
draw.text((88, 514), "07 DE NOVIEMBRE  ·  16:00 H", font=date, fill=CREAM)

image.save(OUTPUT, format="JPEG", quality=90, optimize=True, progressive=True, subsampling=0)
print(f"{OUTPUT}: {W} × {H}, {OUTPUT.stat().st_size} bytes")
