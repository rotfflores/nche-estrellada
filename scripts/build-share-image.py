"""Build the 1200 × 630 painterly social preview from the invitation's sky."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "compartir.jpg"
W, H = 1200, 630
GOLD = (232, 200, 106)
CREAM = (251, 247, 236)


def font(name, size):
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


sky = Image.open(ROOT / "assets" / "fondo-cielo.jpg").convert("RGB")
# Keep the painted golden swirl in view; the invitation already uses this artwork.
sky = sky.resize((W, round(sky.height * W / sky.width)), Image.Resampling.LANCZOS)
image = sky.crop((0, 0, W, H))
# A gradual night tint behind the copy preserves the brushwork and legibility.
tint = Image.new("RGBA", (W, H), (0, 0, 0, 0))
tint_pixels = tint.load()
for x in range(W):
    alpha = int(12 + 160 * max(0, min(1, (x - 360) / 680)))
    for y in range(H):
        tint_pixels[x, y] = (7, 13, 42, alpha)
image = Image.alpha_composite(image.convert("RGBA"), tint).convert("RGB")
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((30, 30, 1170, 600), radius=19, outline=(163, 134, 65), width=2)

sans = font("arialbd.ttf", 19)
title = font("georgia.ttf", 76)
name = font("georgiai.ttf", 52)
date = font("arial.ttf", 24)

draw.text((553, 105), "INVITACIÓN DE CUMPLEAÑOS", font=sans, fill=GOLD)
draw.line((553, 146, 1115, 146), fill=(170, 140, 70), width=2)
draw.text((548, 195), "La alegría", font=title, fill=CREAM)
draw.text((548, 283), "de coincidir", font=title, fill=CREAM)
draw.line((553, 396, 691, 396), fill=GOLD, width=3)
draw.text((548, 415), "Victoria", font=name, fill=GOLD)
draw.text((553, 521), "07 DE NOVIEMBRE  ·  16:00 H", font=date, fill=CREAM)

image.save(OUTPUT, format="JPEG", quality=90, optimize=True, progressive=True, subsampling=0)
print(f"{OUTPUT}: {W} × {H}, {OUTPUT.stat().st_size} bytes")
