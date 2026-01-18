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

## CodePen-ready example (HTML/CSS/JS)

<details>
<summary>View full snippet</summary>

```html
<form id="demoForm" data-validate="true" data-checkrealtime="true" class="panel">
  <label id="label_name" for="name">Name</label>
  <input id="name" name="name" data-required="true" data-tovalidate="text" />

  <label id="label_email" for="email">Email</label>
  <input id="email" name="email" data-required="true" data-tovalidate="email" />

  <label id="label_age" for="age">Age</label>
  <input id="age" name="age" data-tovalidate="int" />

  <button type="submit" data-checkform="true">Submit</button>
</form>
```

```css
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: #0c0f14;
  color: #f4f6fb;
}
.panel {
  display: grid;
  gap: 12px;
  background: #141923;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #262f3f;
  max-width: 420px;
}
input,
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #2b3445;
  background: #101521;
  color: #f4f6fb;
}
button {
  background: #ff8a3d;
  color: #0c0f14;
  cursor: pointer;
}
```

```js
import { ValidateForm } from "https://esm.sh/@manufosela/automatic-form-validation";

new ValidateForm((event) => {
  event.preventDefault();
  alert("Form validated!");
});
```
</details>

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
