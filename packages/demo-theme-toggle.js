class DemoThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    const saved = localStorage.getItem('utils-demo-theme');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.toggle('light', saved === 'light');

    this.render();
  }

  render() {
    const isLight = document.documentElement.classList.contains('light');
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
        }
        .toggle {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--line);
          border-radius: 999px;
          overflow: hidden;
          background: var(--surface);
        }
        button {
          border: none;
          background: transparent;
          color: var(--muted);
          padding: 6px 12px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: "Space Grotesk", "Trebuchet MS", Arial, sans-serif;
        }
        button.active {
          background: linear-gradient(120deg, var(--accent), #ff6a00);
          color: #111;
          font-weight: 600;
        }
      </style>
      <div class="toggle" role="group" aria-label="Theme toggle">
        <button class="${isLight ? 'active' : ''}" data-theme="light">Light</button>
        <button class="${isLight ? '' : 'active'}" data-theme="dark">Dark</button>
      </div>
    `;

    this.shadowRoot.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', this.handleClick);
    });
  }

  handleClick(event) {
    const theme = event.currentTarget.dataset.theme;
    const isLight = theme === 'light';
    document.documentElement.classList.toggle('light', isLight);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('utils-demo-theme', isLight ? 'light' : 'dark');
    this.render();
  }
}

customElements.define('demo-theme-toggle', DemoThemeToggle);
