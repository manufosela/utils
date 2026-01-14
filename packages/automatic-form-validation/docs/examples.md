# Examples

## Required fields

```html
<input name="fullName" data-required="true" />
```

## Built-in validators

```html
<input data-tovalidate="email" />
<input data-tovalidate="url" />
<input data-tovalidate="alphaNumeric" />
```

## Real-time validation

```html
<form data-validate="true" data-checkrealtime="true">
  <input id="name" data-required="true" data-tovalidate="alpha" />
</form>
```

## Custom validator (fn:)

```html
<input data-tovalidate="fn:isEven" />
<script>
  function isEven(value) {
    return Number(value) % 2 === 0;
  }
</script>
```

## Custom validator (API)

```js
const validator = new ValidateForm();
validator.addValidator('even', (value) => Number(value) % 2 === 0);
```

## Radio group with data-name label

```html
<label id="label_level" data-name="level">Choose a level</label>
<label><input type="radio" name="level" data-required="true" value="A1" /> A1</label>
<label><input type="radio" name="level" data-required="true" value="A2" /> A2</label>
```

## Checkbox groups

```html
<label data-type="checkbox-group" data-min="2" data-max="3">
  Choose 2 to 3 options
</label>
```

## Conditional fields

```html
<fieldset data-activate="hasphoneYES" data-deactivate="hasphoneNO">
  <input data-type="hiddenON" data-required="true" data-tovalidate="telephone" />
</fieldset>
```

## File extensions

```html
<input data-tovalidate="file:.png,.jpg,.webp" />
```

## Accessibility

Warnings use `role="alert"`, and invalid fields get `aria-invalid` plus `aria-describedby` with the warning id.

## Shadow DOM / Web Components

```js
const validator = new ValidateForm(null, {
  scope: myComponent.shadowRoot,
});
```
