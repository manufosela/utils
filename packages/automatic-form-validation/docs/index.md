# Automatic Form Validation

A lightweight, dependency-free library that validates form fields with `data-*` attributes. Built for modern browsers, ESM-first, and accessibility-friendly by default.

## Install

```bash
pnpm add @manufosela/automatic-form-validation
```

## Basic usage

```html
<form data-validate="true">
  <label for="email">Email</label>
  <input id="email" name="email" data-required="true" data-tovalidate="email" />
</form>

<script type="module">
  import { ValidateForm } from '@manufosela/automatic-form-validation';
  new ValidateForm();
</script>
```

## Configuration

```js
new ValidateForm((e) => {
  // custom submit handler
}, {
  warningColor: '#F00',
  requiredTextContent: '*',
  texts: {
    requiredField: 'required',
    wrongValue: 'invalid',
  },
  validators: {
    even: (value) => Number(value) % 2 === 0,
  },
});
```

### Accessibility

Accessibility features are enabled by default. Warnings get `role="alert"` and invalid fields receive `aria-invalid` and `aria-describedby`.

```js
new ValidateForm(null, { accessibility: true });
```

### Runtime API

```js
const validator = new ValidateForm();
validator.addValidator('even', (value) => Number(value) % 2 === 0);
validator.setMessages({ requiredField: 'Required', wrongValue: 'Invalid value' });
```

## Demos

- Basic: `demo/basic.html`
- Advanced: `demo/advanced.html`
