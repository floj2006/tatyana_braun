"""Готовит фото с праздников для раздела «Фото и видео».

Запуск: python3 scripts/import-photos.py <папка с исходниками>
Для каждого файла (jpg/jpeg/png/webp/heic не поддерживается) создаёт в public/img/photos/
<имя>-600 и <имя>-1200 в AVIF и WebP, без EXIF и геометки, и печатает заготовку для PHOTOS
в src/content/site.js. alt и caption нужно заполнить вручную: что на фото и формат/месяц праздника.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'img' / 'photos'
WIDTHS = (600, 1200)


def slug(name):
    s = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return s or 'photo'


def main(src_dir):
    OUT.mkdir(parents=True, exist_ok=True)
    entries = []
    files = sorted(p for p in Path(src_dir).iterdir() if p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'})
    for i, path in enumerate(files, 1):
        im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')  # поворот по EXIF, затем EXIF выбрасывается
        name = f'{i:02d}-{slug(path.stem)}'
        made = []
        for w in WIDTHS:
            w = min(w, im.width)
            h = round(im.height * w / im.width)
            r = im.resize((w, h), Image.LANCZOS)
            r.save(OUT / f'{name}-{w}.avif', 'AVIF', quality=45, speed=4)
            r.save(OUT / f'{name}-{w}.webp', 'WEBP', quality=74, method=6)
            made.append((w, h))
        w, h = made[-1]
        entries.append({
            'id': name,
            'base': f'/img/photos/{name}',
            'widths': [m[0] for m in made],
            'width': w,
            'height': h,
            'alt': '',
            'caption': '',
        })
        print(f'готово: {path.name} -> {name} ({w}x{h})', file=sys.stderr)
    print(json.dumps(entries, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('Использование: python3 scripts/import-photos.py <папка>')
    main(sys.argv[1])
