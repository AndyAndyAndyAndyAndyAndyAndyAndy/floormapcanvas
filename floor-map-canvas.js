class FloorMapCanvas extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="padding:10px; border:1px solid #ddd; background: #f8f8f8;">
        Hello from Custom Element!
      </div>
    `;
  }
}

customElements.define("floor-map-canvas", FloorMapCanvas);
