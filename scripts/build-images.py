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
PRATA = ROOT / 'src/assets/fonts/prata-cyrillic.woff2'
ONEST = ROOT / 'src/assets/fonts/onest-cyrillic.woff2'

# Город для подписи OG-картинки: должен совпадать с SITE.cityIn в src/content/site.js.
CITY_IN = 'в Челябинске'

PAPER = (245, 245, 247)
INK = (32, 33, 38)
MUTED = (101, 105, 115)
SILVER = (167, 171, 180)
GRAPHITE = (54, 57, 64)

# Исходники: фото первого экрана и фото для OG-картинки (на OG лицо должно быть крупным).
HERO_SRC = SRC / 'hero-pinstripe.webp'  # белый костюм в полоску, 2026-11-10
# Имена выходных файлов. При замене фото — новое имя: браузеры и мессенджеры кешируют картинки по адресу,
# и под старым именем посетители ещё неделю видели бы прежнее фото. Обновить и HERO в src/content/site.js.
HERO_NAME = 'hero-pinstripe'
OG_NAME = 'og-pinstripe.jpg'
OG_SRC = SRC / 'hero-pinstripe.webp'

IMG.mkdir(parents=True, exist_ok=True)


def hero():
    im = Image.open(HERO_SRC).convert('RGB')  # convert снимает EXIF/ICC
    for w in (480, 800, 1120):
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(IMG / f'{HERO_NAME}-{w}.avif', 'AVIF', quality=42, speed=4)
        r.save(IMG / f'{HERO_NAME}-{w}.webp', 'WEBP', quality=74, method=6)
        print('hero', w, h)
    return im


def og(photo):
    W, H = 1200, 630
    canvas = Image.new('RGB', (W, H), PAPER)
    # мягкий вертикальный серебристый градиент фона
    grad = Image.linear_gradient('L').resize((W, H))
    canvas = Image.composite(Image.new('RGB', (W, H), (232, 233, 237)), canvas, grad)
    pw = 470
    scale = pw / photo.width
    ph = round(photo.height * scale)
    p = photo.resize((pw, ph), Image.LANCZOS)
    top = round(ph * 0.12)
    canvas.paste(p.crop((0, top, pw, top + H)), (W - pw, 0))
    d = ImageDraw.Draw(canvas)
    d.text((70, 196), 'Татьяна', font=ImageFont.truetype(str(PRATA), 96), fill=INK)
    d.text((70, 302), 'Браун', font=ImageFont.truetype(str(PRATA), 96), fill=INK)
    d.line((72, 452, 132, 452), fill=SILVER, width=2)
    d.text((152, 434), 'Ведущая мероприятий', font=ImageFont.truetype(str(ONEST), 32), fill=GRAPHITE)
    d.text((152, 474), CITY_IN, font=ImageFont.truetype(str(ONEST), 32), fill=MUTED)
    canvas.save(IMG / OG_NAME, 'JPEG', quality=86, optimize=True, progressive=True)
    print('og', canvas.size)


def icons():
    def mono(size):
        im = Image.new('RGB', (size, size), GRAPHITE)
        d = ImageDraw.Draw(im)
        f = ImageFont.truetype(str(PRATA), round(size * 0.62))
        box = d.textbbox((0, 0), 'Б', font=f)
        x = (size - (box[2] - box[0])) / 2 - box[0]
        y = (size - (box[3] - box[1])) / 2 - box[1]
        d.text((x, y), 'Б', font=f, fill=(222, 224, 229))
        return im
    mono(180).save(PUB / 'apple-touch-icon.png', optimize=True)
    mono(512).save(PUB / 'icon-512.png', optimize=True)
    mono(64).save(PUB / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print('icons')


if __name__ == '__main__':
    hero()
    og(Image.open(OG_SRC).convert('RGB'))
    icons()
