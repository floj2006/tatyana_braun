"""Генерирует изображения сайта из исходников в assets-src/.

Запуск: python3 scripts/build-images.py   (нужен Pillow с поддержкой WOFF2)
Результат кладётся в public/img и public/. Файлы уже закоммичены; перезапускать
нужно только при замене исходного фото.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets-src'
IMG = ROOT / 'public' / 'img'
PUB = ROOT / 'public'
PRATA = ROOT / 'node_modules/@fontsource/prata/files/prata-cyrillic-400-normal.woff2'
ONEST = ROOT / 'node_modules/@fontsource-variable/onest/files/onest-cyrillic-wght-normal.woff2'

PAPER = (247, 242, 235)
INK = (30, 25, 21)
MUTED = (81, 70, 61)
ACCENT = (179, 64, 42)

IMG.mkdir(parents=True, exist_ok=True)


def hero():
    im = Image.open(SRC / 'tatyana-hero.webp').convert('RGB')  # convert снимает EXIF/ICC
    for w in (480, 800, 1120):
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(IMG / f'hero-{w}.webp', 'WEBP', quality=78, method=6)
        print('hero', w, h)
    return im


def og(photo):
    W, H = 1200, 630
    canvas = Image.new('RGB', (W, H), PAPER)
    pw = 470
    scale = pw / photo.width
    ph = round(photo.height * scale)
    p = photo.resize((pw, ph), Image.LANCZOS)
    top = round(ph * 0.12)
    canvas.paste(p.crop((0, top, pw, top + H)), (W - pw, 0))
    d = ImageDraw.Draw(canvas)
    d.rectangle((72, 214, 152, 220), fill=ACCENT)
    d.text((70, 250), 'Татьяна', font=ImageFont.truetype(str(PRATA), 92), fill=INK)
    d.text((70, 352), 'Браун', font=ImageFont.truetype(str(PRATA), 92), fill=INK)
    d.text((72, 480), 'Ведущая праздников', font=ImageFont.truetype(str(ONEST), 34), fill=MUTED)
    canvas.save(IMG / 'og.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
    print('og', canvas.size)


def icons():
    def mono(size):
        im = Image.new('RGB', (size, size), ACCENT)
        d = ImageDraw.Draw(im)
        f = ImageFont.truetype(str(PRATA), round(size * 0.62))
        box = d.textbbox((0, 0), 'Б', font=f)
        x = (size - (box[2] - box[0])) / 2 - box[0]
        y = (size - (box[3] - box[1])) / 2 - box[1]
        d.text((x, y), 'Б', font=f, fill=PAPER)
        return im
    mono(180).save(PUB / 'apple-touch-icon.png', optimize=True)
    mono(512).save(PUB / 'icon-512.png', optimize=True)
    mono(64).save(PUB / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print('icons')


if __name__ == '__main__':
    og(hero())
    icons()
