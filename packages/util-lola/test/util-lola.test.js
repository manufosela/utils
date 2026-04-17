import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "../src/UtilLola.js";

describe("UtilLola", () => {
  let el;

  beforeEach(() => {
    el = document.createElement("util-lola");
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("util-lola")).toBeDefined();
  });

  it("starts inactive by default", () => {
    expect(el.active).toBe(false);
    expect(el.hasAttribute("active")).toBe(false);
  });

  it("activates via property", () => {
    el.active = true;
    expect(el.hasAttribute("active")).toBe(true);
  });

  it("activates via attribute", () => {
    el.setAttribute("active", "");
    expect(el.active).toBe(true);
  });

  it("deactivates when active is set to false", () => {
    el.active = true;
    el.active = false;
    expect(el.hasAttribute("active")).toBe(false);
  });

  it("renders the message in shadow DOM", () => {
    el.message = "Loading data...";
    const msg = el.shadowRoot.querySelector(".message");
    expect(msg.textContent).toBe("Loading data...");
  });

  it("updates message when attribute changes", () => {
    el.setAttribute("message", "Please wait");
    const msg = el.shadowRoot.querySelector(".message");
    expect(msg.textContent).toBe("Please wait");
  });

  it("defaults timeout to 0", () => {
    expect(el.timeout).toBe(0);
  });

  it("auto-closes after timeout", () => {
    vi.useFakeTimers();
    el.timeout = 2;
    el.active = true;
    expect(el.active).toBe(true);
    vi.advanceTimersByTime(2000);
    expect(el.active).toBe(false);
    vi.useRealTimers();
  });

  it("does not auto-close when timeout is 0", () => {
    vi.useFakeTimers();
    el.timeout = 0;
    el.active = true;
    vi.advanceTimersByTime(10000);
    expect(el.active).toBe(true);
    vi.useRealTimers();
  });

  it("dispatches lola-toggle event on activation", () => {
    const handler = vi.fn();
    el.addEventListener("lola-toggle", handler);
    el.active = true;
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail.active).toBe(true);
  });

  it("dispatches lola-toggle event on deactivation", () => {
    el.active = true;
    const handler = vi.fn();
    el.addEventListener("lola-toggle", handler);
    el.active = false;
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail.active).toBe(false);
  });

  it("clears timer on disconnect", () => {
    vi.useFakeTimers();
    el.timeout = 5;
    el.active = true;
    el.remove();
    vi.advanceTimersByTime(5000);
    expect(el.active).toBe(true);
    vi.useRealTimers();
  });

  it("has a spinner element in shadow DOM", () => {
    const spinner = el.shadowRoot.querySelector(".spinner");
    expect(spinner).toBeTruthy();
  });

  it("has a backdrop element in shadow DOM", () => {
    const backdrop = el.shadowRoot.querySelector(".backdrop");
    expect(backdrop).toBeTruthy();
  });
});
