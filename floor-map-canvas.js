class FloorMapCanvas extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h2 style="color: teal">Your Floor Map will render here!</h2>`;
    // You can insert canvas/SVG/map logic here later
  }
}

customElements.define('floor-map-canvas', FloorMapCanvas);
