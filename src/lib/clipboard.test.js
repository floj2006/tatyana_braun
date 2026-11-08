import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from './clipboard.js';

const field = () => ({ focus: vi.fn(), select: vi.fn() });

afterEach(() => vi.unstubAllGlobals());

describe('copyText', () => {
  it('использует Clipboard API, если он доступен', async () => {
    const writeText = vi.fn().mockResolvedValue();
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    expect(await copyText('привет', field())).toBe(true);
    expect(writeText).toHaveBeenCalledWith('привет');
  });

  it('при отказе Clipboard API выделяет текст и пробует запасную команду', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    vi.stubGlobal('document', { execCommand: vi.fn().mockReturnValue(true) });
    const f = field();
    expect(await copyText('текст', f)).toBe(true);
    expect(f.select).toHaveBeenCalled();
  });

  it('возвращает false, если скопировать нельзя совсем: интерфейс предложит ручное копирование', async () => {
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', {
      execCommand: () => {
        throw new Error('unsupported');
      },
    });
    const f = field();
    expect(await copyText('текст', f)).toBe(false);
    expect(f.select).toHaveBeenCalled();
  });
});
