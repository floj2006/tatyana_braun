import { describe, expect, it } from 'vitest';
import { buildMessage, clean, formatDate } from './message.js';

describe('formatDate', () => {
  it('переводит ISO-дату в русскую запись', () => {
    expect(formatDate('2027-06-14')).toBe('14 июня 2027 г.');
  });
  it('не принимает несуществующие и кривые даты', () => {
    expect(formatDate('2027-02-30')).toBe('');
    expect(formatDate('14.06.2027')).toBe('');
    expect(formatDate('')).toBe('');
  });
});

describe('buildMessage', () => {
  const base = { on: 'свадьбу', date: '2027-06-14', noDate: false, city: 'Казань', guests: '', comment: '' };

  it('собирает дату, город и формат', () => {
    const m = buildMessage(base);
    expect(m).toContain('Ищу ведущую на свадьбу.');
    expect(m).toContain('Дата: 14 июня 2027 г.');
    expect(m).toContain('Город: Казань');
    expect(m).toContain('Вы свободны в этот день?');
    expect(m).not.toContain('Гостей');
  });

  it('честно пишет, что даты пока нет, и не спрашивает про свободный день', () => {
    const m = buildMessage({ ...base, date: '', noDate: true });
    expect(m).toContain('Дата: пока не выбрана');
    expect(m).not.toContain('свободны в этот день');
  });

  it('добавляет гостей и комментарий, если они есть', () => {
    const m = buildMessage({ ...base, guests: '60', comment: 'Без выкупа' });
    expect(m).toContain('Гостей: примерно 60');
    expect(m).toContain('Без выкупа');
  });

  it('не даёт подделать строки сообщения через переводы строк в полях', () => {
    const m = buildMessage({ ...base, city: 'Казань\nДата: 1 января' });
    expect(m.split('\n').filter((l) => l.startsWith('Дата:'))).toHaveLength(1);
  });

  it('clean убирает управляющие символы и режет длину', () => {
    expect(clean('a\u0000b\nc', 10)).toBe('a b c');
    expect(clean('x'.repeat(900), 80)).toHaveLength(80);
  });
});
