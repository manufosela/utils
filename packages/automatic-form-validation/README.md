# @manufosela/automatic-form-validation

Lightweight, dependency-free form validation for the browser using `data-*` attributes.

## Install

```bash
pnpm add @manufosela/automatic-form-validation
```

## Basic usage

```html
<form data-validate="true">
  <label for="email">Email</label>
  <input id="email" data-required="true" data-tovalidate="email" />
</form>

<script type="module">
  import { ValidateForm } from "@manufosela/automatic-form-validation";
  const validateForm = new ValidateForm();
</script>
```

## Demo

Catalog: `demo/index.html`

Key demos:

- `demo/basic.html` for a minimal example
- `demo/realtime.html` for blur-based validation
- `demo/custom-validator.html` for custom rules
- `demo/conditional.html` for hidden sections
- `demo/checkbox-group.html` for min/max groups
- `demo/advanced.html` for complex scenarios
- `demo/playground.html` to edit HTML/JS live

You can also run `pnpm -C demo dev` to launch the demo with Vite.
