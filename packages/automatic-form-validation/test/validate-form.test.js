import { describe, expect, it, beforeEach } from 'vitest';
import { ValidateForm } from '../src/ValidateForm.js';

const setupForm = () => {
  document.body.innerHTML = `
    <form id="myForm" data-validate="true" data-checkrealtime="true">
      <label for="email">Email</label>
      <input id="email" name="email" data-required="true" data-tovalidate="email" />
    </form>
  `;
};

describe('ValidateForm', () => {
  beforeEach(() => {
    setupForm();
  });

  it('adds a warning and aria attributes when validation fails', () => {
    const validator = new ValidateForm();
    const email = document.querySelector('#email');
    email.value = 'bad@@mail';

    const ok = validator.validateFields();

    expect(ok).toBe(false);
    expect(document.querySelector('#warning-email')).not.toBeNull();
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-describedby')).toContain('warning-email');
  });

  it('supports custom validators registered at runtime', () => {
    const validator = new ValidateForm();
    validator.addValidator('even', (value) => Number(value) % 2 === 0);

    const email = document.querySelector('#email');
    email.setAttribute('data-tovalidate', 'even');
    email.value = '3';

    const ok = validator.validateFields();

    expect(ok).toBe(false);
    expect(document.querySelector('#warning-email')).not.toBeNull();
  });
});
