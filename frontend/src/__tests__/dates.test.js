import { describe, expect, it } from 'vitest';
import { nightsBetween } from '../utils/dates';

describe('booking dates', () => {
  it('calculates five nights from 18 Oct 2026 to 23 Oct 2026', () => {
    expect(nightsBetween('2026-10-18', '2026-10-23')).toBe(5);
  });

  it('returns 0 when a date is missing', () => {
    expect(nightsBetween('2026-10-18', null)).toBe(0);
  });
});
