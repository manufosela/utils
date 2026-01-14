import { describe, expect, it } from 'vitest';
import { VerifyUtils } from '../src/VerifyUtils.js';

describe('VerifyUtils', () => {
  it('validates basic numeric and email formats', () => {
    expect(VerifyUtils.isInt(10)).toBe(true);
    expect(VerifyUtils.isInt('10')).toBe(false);
    expect(VerifyUtils.isNumber('10.5')).toBe(true);
    expect(VerifyUtils.isEmail('foo@bar.com')).toBe(true);
    expect(VerifyUtils.isEmail('bad@@bar')).toBe(false);
  });

  it('accepts passport document type for nif/cif/nie validation', () => {
    expect(VerifyUtils.validaNifCifNie('X1234567L', { documentType: 'PASAPORTE' })).toBe(1);
  });
});
