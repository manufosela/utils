# @manufosela/util-lola

Loading overlay (LoLa) web component with message, timeout, and CSS custom properties for theming.

Modernized from the original [Polymer-based util-lola](https://github.com/manufosela/util-lola).

## Install

```bash
npm i @manufosela/util-lola
```

## Usage

```html
<util-lola id="lola" message="Loading..." active></util-lola>

<script type="module">
  import "@manufosela/util-lola";

  // Hide programmatically
  document.getElementById("lola").active = false;
</script>
```

## Attributes

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `active`  | Boolean | `false` | Show/hide the overlay |
| `message` | String  | `""`    | Text displayed below the spinner |
| `timeout` | Number  | `0`     | Auto-close after N seconds (0 = manual) |

## Events

| Event         | Detail            | Description |
|---------------|-------------------|-------------|
| `lola-toggle` | `{ active: bool }` | Fired on show/hide |

## CSS Custom Properties

| Property               | Default                     |
|------------------------|-----------------------------|
| `--lola-backdrop`      | `rgba(15, 17, 23, 0.75)`   |
| `--lola-panel-bg`      | `#1c2233`                   |
| `--lola-text`          | `#f3f6ff`                   |
| `--lola-spinner-size`  | `44px`                      |
| `--lola-spinner-color` | `#ffb000`                   |
| `--lola-spinner-track` | `rgba(255, 255, 255, 0.15)` |

## License

Apache-2.0
