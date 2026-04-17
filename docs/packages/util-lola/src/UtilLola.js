/**
 * @fileoverview Loading overlay (LoLa) web component
 * @module @manufosela/util-lola
 * @author manufosela
 * @license Apache-2.0
 */

const STYLES = `
  :host {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  :host([active]) {
    pointer-events: auto;
    opacity: 1;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: var(--lola-backdrop, rgba(15, 17, 23, 0.75));
  }

  .panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px 48px;
    border-radius: 16px;
    background: var(--lola-panel-bg, #1c2233);
    color: var(--lola-text, #f3f6ff);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    font-family: "Space Grotesk", system-ui, sans-serif;
  }

  .spinner {
    width: var(--lola-spinner-size, 44px);
    height: var(--lola-spinner-size, 44px);
    border: 4px solid var(--lola-spinner-track, rgba(255, 255, 255, 0.15));
    border-top-color: var(--lola-spinner-color, #ffb000);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .message {
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    max-width: 320px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

class UtilLola extends HTMLElement {
  static get observedAttributes() {
    return ["active", "message", "timeout"];
  }

  #timer = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>${STYLES}</style>
      <div class="backdrop"></div>
      <div class="panel">
        <div class="spinner"></div>
        <div class="message"></div>
      </div>
    `;
  }

  get active() {
    return this.hasAttribute("active");
  }

  set active(val) {
    if (val) {
      this.setAttribute("active", "");
    } else {
      this.removeAttribute("active");
    }
  }

  get message() {
    return this.getAttribute("message") ?? "";
  }

  set message(val) {
    this.setAttribute("message", val);
  }

  get timeout() {
    return Number(this.getAttribute("timeout")) || 0;
  }

  set timeout(val) {
    this.setAttribute("timeout", String(val));
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "message") {
      this.shadowRoot.querySelector(".message").textContent = newVal ?? "";
    }

    if (name === "active") {
      this.#clearTimer();
      const isActive = newVal !== null;
      if (isActive && this.timeout > 0) {
        this.#timer = setTimeout(() => {
          this.active = false;
        }, this.timeout * 1000);
      }
      this.dispatchEvent(
        new CustomEvent("lola-toggle", {
          detail: { active: isActive },
          bubbles: true,
          composed: true,
        })
      );
    }

    if (name === "timeout" && this.active) {
      this.#clearTimer();
      const t = Number(newVal) || 0;
      if (t > 0) {
        this.#timer = setTimeout(() => {
          this.active = false;
        }, t * 1000);
      }
    }
  }

  disconnectedCallback() {
    this.#clearTimer();
  }

  #clearTimer() {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
}

customElements.define("util-lola", UtilLola);

export { UtilLola };
export default UtilLola;
