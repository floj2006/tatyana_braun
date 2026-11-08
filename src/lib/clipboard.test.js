import { afterEach, describe, expect, it, vi } from 'vitest';
import { copySync, copyText } from './clipboard.js';

// Минимальная подмена DOM для синхронного копирования.
function fakeDocument(execResult) {
  const buffer = { setAttribute: vi.fn(), select: vi.fn(), setSelectionRange: vi.fn(), remove: vi.fn() };
  const active = { focus: vi.fn() };
  const doc = {
    activeElement: active,
    createElement: vi.fn(() => buffer),
    body: { appendChild: vi.fn() },
    execCommand: vi.fn(() => {
      if (execResult instanceof Error) throw execResult;
      return execResult;
    }),
  };
  return { doc, buffer, active };
}

afterEach(() => vi.unstubAllGlobals());

describe('copySync', () => {
  it('копирует через временное поле, убирает его и возвращает фокус', () => {
    const { doc, buffer, active } = fakeDocument(true);
    vi.stubGlobal('document', doc);
    expect(copySync('привет')).toBe(true);
    expect(buffer.value).toBe('привет');
    expect(doc.execCommand).toHaveBeenCalledWith('copy');
    expect(buffer.remove).toHaveBeenCalled();
    expect(active.focus).toHaveBeenCalled();
  });

  it('возвращает false, если браузер запретил копирование', () => {
    const { doc, buffer } = fakeDocument(new Error('unsupported'));
    vi.stubGlobal('document', doc);
    expect(copySync('текст')).toBe(false);
    expect(buffer.remove).toHaveBeenCalled();
  });
});

describe('copyText', () => {
  it('использует Clipboard API, если он доступен', async () => {
    const writeText = vi.fn().mockResolvedValue();
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    expect(await copyText('привет')).toBe(true);
    expect(writeText).toHaveBeenCalledWith('привет');
  });

  it('при отказе Clipboard API пробует синхронный способ', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    vi.stubGlobal('document', fakeDocument(true).doc);
    expect(await copyText('текст')).toBe(true);
  });

  it('возвращает false, если скопировать нельзя совсем', async () => {
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', fakeDocument(false).doc);
    expect(await copyText('текст')).toBe(false);
  });
});
