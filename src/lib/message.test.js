import { describe, it, expect } from 'vitest';
import { buildMessage, clean } from './message.js';
import { safeUrl } from '../config/site.js';

describe('buildMessage', () => {
  it('включает только заполненные поля', () => {
    const m = buildMessage({ event: 'свадьбу', date: '14 августа', guests: '', place: '', name: 'Анна' });
    expect(m).toContain('Ищу ведущую на свадьбу.');
    expect(m).toContain('Дата: 14 августа');
    expect(m).not.toContain('Гостей');
    expect(m).toContain('Меня зовут Анна.');
  });
  it('чистит управляющие символы и режет длину', () => {
    expect(clean('a\u0000b\nc', 10)).toBe('a b c');
    expect(clean('x'.repeat(500), 20)).toHaveLength(20);
  });
  it('не даёт вставить переводы строк в поле', () => {
    const m = buildMessage({ event: 'юбилей', date: '1\nДата: подделка', guests: '', place: '', name: '' });
    expect(m.split('\n').filter((l) => l.startsWith('Дата:'))).toHaveLength(1);
  });
});

describe('safeUrl', () => {
  it('пропускает https и разрешённый хост', () => {
    expect(safeUrl('https://vk.ru/brauntv', ['vk.ru'])).toBe('https://vk.ru/brauntv');
  });
  it('отклоняет javascript:, http и чужие хосты', () => {
    expect(safeUrl('javascript:alert(1)', ['vk.ru'])).toBe('');
    expect(safeUrl('http://vk.ru/x', ['vk.ru'])).toBe('');
    expect(safeUrl('https://evil.com/x', ['vk.ru'])).toBe('');
    expect(safeUrl('', ['vk.ru'])).toBe('');
  });
});
