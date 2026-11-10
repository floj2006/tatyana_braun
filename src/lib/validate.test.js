import { describe, expect, it } from 'vitest';
import { todayIso, validate } from './validate.js';

const opts = { formats: ['wedding', 'family'], today: '2026-11-08' };
const ok = { format: 'wedding', date: '2027-06-14', noDate: false, city: 'Казань', guests: '', comment: '' };

describe('validate', () => {
  it('пропускает корректные данные', () => {
    expect(validate(ok, opts)).toEqual({});
  });

  it('требует формат и дату, город по желанию', () => {
    const e = validate({ format: '', date: '', noDate: false, city: '  ', guests: '', comment: '' }, opts);
    expect(Object.keys(e).sort()).toEqual(['date', 'format']);
  });

  it('не пропускает неизвестный формат', () => {
    expect(validate({ ...ok, format: 'party' }, opts).format).toBeTruthy();
  });

  it('не принимает прошедшую дату, но принимает сегодняшнюю', () => {
    expect(validate({ ...ok, date: '2026-11-07' }, opts).date).toBe('Эта дата уже прошла.');
    expect(validate({ ...ok, date: '2026-11-08' }, opts).date).toBeUndefined();
  });

  it('без даты достаточно отметки «даты пока нет»', () => {
    expect(validate({ ...ok, date: '', noDate: true }, opts)).toEqual({});
  });

  it('гости — только положительное число', () => {
    expect(validate({ ...ok, guests: 'сорок' }, opts).guests).toBeTruthy();
    expect(validate({ ...ok, guests: '0' }, opts).guests).toBeTruthy();
    expect(validate({ ...ok, guests: '40' }, opts).guests).toBeUndefined();
  });

  it('ограничивает длину города и комментария', () => {
    expect(validate({ ...ok, city: 'г'.repeat(81) }, opts).city).toBeTruthy();
    expect(validate({ ...ok, comment: 'к'.repeat(501) }, opts).comment).toBeTruthy();
  });

  it('todayIso считает по местному времени', () => {
    expect(todayIso(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});
