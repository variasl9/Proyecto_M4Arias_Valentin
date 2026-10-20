import { describe, it, expect } from 'vitest';
import { validateTitle } from '../src/utils/validators';

describe('validateTitle', () => {
  it('rechaza títulos vacíos o con solo espacios', () => {
    expect(validateTitle('')).not.toBeNull();
    expect(validateTitle('   ')).not.toBeNull();
  });

  it('rechaza títulos de más de 100 caracteres', () => {
    expect(validateTitle('a'.repeat(101))).not.toBeNull();
  });

  it('acepta un título válido', () => {
    expect(validateTitle('Comprar mate')).toBeNull();
  });
});