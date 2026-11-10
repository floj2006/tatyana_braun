import { describe, expect, it } from 'vitest';
import { isBusy, priceLabel, whatsappUrl } from './contact.js';
import { formatPath, routeFor, ROUTES } from '../routes.js';
import { FORMATS } from '../content/site.js';

describe('priceLabel', () => {
  it('показывает только подтверждённую положительную цену', () => {
    expect(priceLabel(15000).replace(/\s/g, ' ')).toBe('от 15 000 ₽');
    expect(priceLabel(null)).toBe('');
    expect(priceLabel(0)).toBe('');
  });
});

describe('whatsappUrl', () => {
  it('собирает ссылку с закодированным текстом', () => {
    expect(whatsappUrl('+7 (999) 123-45-67', 'Дата: 1 июня')).toBe('https://wa.me/79991234567?text=%D0%94%D0%B0%D1%82%D0%B0%3A%201%20%D0%B8%D1%8E%D0%BD%D1%8F');
  });
  it('без корректного номера ссылки нет', () => {
    expect(whatsappUrl('', 'x')).toBe('');
    expect(whatsappUrl('12345', 'x')).toBe('');
  });
});

describe('isBusy', () => {
  it('сверяет дату со списком занятых', () => {
    expect(isBusy('2027-06-14', ['2027-06-14'])).toBe(true);
    expect(isBusy('2027-06-15', ['2027-06-14'])).toBe(false);
    expect(isBusy('', ['2027-06-14'])).toBe(false);
  });
});

describe('маршруты', () => {
  it('у каждой страницы формата свой путь, главная — по умолчанию', () => {
    const withPage = FORMATS.filter((f) => f.slug && f.page);
    // главная, страницы форматов и политика конфиденциальности
    expect(ROUTES).toHaveLength(withPage.length + 2);
    expect(routeFor('/privacy').page).toBe('privacy');
    expect(routeFor('/svadba').format).toBe('wedding');
    expect(routeFor('/svadba/').format).toBe('wedding');
    expect(routeFor('/neizvestno/').path).toBe('/');
    expect(formatPath(FORMATS.find((f) => f.id === 'family'))).toBe('');
  });
});
