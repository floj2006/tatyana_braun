Prata (Cyreal), Onest (Dmitri Voloshin) и Great Vibes (TypeSETit) — SIL Open Font License 1.1.
Взяты из @fontsource; оставлены только нужные подмножества.

Great Vibes урезан до заглавной кириллицы (инициалы заголовков) и букв слова «Праздник» (декор в блоке
контактов): 45 → 17 КБ. Если понадобятся другие буквы, пересобрать из great-vibes-cyrillic-400-normal.woff2:

    pyftsubset great-vibes-cyrillic-400-normal.woff2 \
      --text="АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯраздник" \
      --flavor=woff2 --layout-features='*' --output-file=great-vibes-cyrillic.woff2
