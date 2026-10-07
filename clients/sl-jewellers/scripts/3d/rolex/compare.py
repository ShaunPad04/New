"""Side-by-side comparison of r_34.png against the Rolex catalogue image.
usage: python compare.py r_34.png out.png [ref]
Both are scaled to the same height; a thin line marks the dial centre row.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

REF = os.environ.get('ROLEX_REF', 'ref.png')   # Rolex's catalogue image of the reference (not in the repo)


def load_ref(path):
    im = Image.open(path).convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    return bg.convert('RGB')


def main():
    a = sys.argv[1:]
    r = Image.open(a[0]).convert('RGB')
    out = a[1]
    ref = load_ref(a[2] if len(a) > 2 else REF)
    H = 1600
    r = r.resize((int(r.size[0] * H / r.size[1]), H), Image.LANCZOS)
    ref = ref.resize((int(ref.size[0] * H / ref.size[1]), H), Image.LANCZOS)
    W = r.size[0] + ref.size[0] + 30
    canvas = Image.new('RGB', (W, H + 60), (30, 30, 30))
    canvas.paste(r, (0, 60))
    canvas.paste(ref, (r.size[0] + 30, 60))
    d = ImageDraw.Draw(canvas)
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26)
    d.text((20, 15), 'procedural model (r_34.png)', fill=(230, 230, 230), font=f)
    d.text((r.size[0] + 50, 15), 'Rolex catalogue m126710grnr-0004', fill=(230, 230, 230), font=f)
    canvas.save(out)


if __name__ == '__main__':
    main()
