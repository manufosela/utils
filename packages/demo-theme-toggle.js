class DemoThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    const saved = localStorage.getItem('utils-demo-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.classList.toggle('dark', saved === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    this.render();
  }

  render() {
    const isDark = document.documentElement.classList.contains('dark');
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
        }
        .toggle {
          display: inline-flex;
          align-items: center;
          border: 1px solid #2b3247;
          border-radius: 999px;
          overflow: hidden;
          background: #0b0f1a;
        }
        button {
          border: none;
          background: transparent;
          color: #b8c0d9;
          padding: 6px 12px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: "Space Grotesk", "Trebuchet MS", Arial, sans-serif;
        }
        button.active {
          background: linear-gradient(120deg, #ffb000, #ff6a00);
          color: #111;
          font-weight: 600;
        }
      </style>
      <div class="toggle" role="group" aria-label="Theme toggle">
        <button class="${isDark ? '' : 'active'}" data-theme="light">Light</button>
        <button class="${isDark ? 'active' : ''}" data-theme="dark">Dark</button>
      </div>
    `;

    this.shadowRoot.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', this.handleClick);
    });
  }

  handleClick(event) {
    const theme = event.currentTarget.dataset.theme;
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('utils-demo-theme', theme);
    this.render();
  }
}

customElements.define('demo-theme-toggle', DemoThemeToggle);
