class ApartmentMapCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.maxWidth = '3000px';
    container.style.margin = '0 auto';
    container.style.aspectRatio = '3000 / 2000';
    this.shadowRoot.appendChild(container);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const originalWidth = 3000;
    const originalHeight = 2000;

    const img = new Image();
    img.src = 'https://static.wixstatic.com/media/d32b49_22ccf648378a441ab3b7bf7ebe598205~mv2.jpg';

    const areas = [
      {
        name: 'AP 1',
        link: 'https://www.amarisea.com/about',
        coords: [2812,1011,2807,1994,1230,1973,1235,1027]
      }
    ];

    let scale = 1;

    const draw = () => {
      const displayWidth = container.clientWidth;
      scale = displayWidth / originalWidth;
      canvas.width = displayWidth;
      canvas.height = originalHeight * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let activeText = 'Посочете апартамент';

      areas.forEach(area => {
        ctx.beginPath();
        const coords = area.coords;
        ctx.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          ctx.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        ctx.closePath();

        if (area.hovered) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
          ctx.fill();
          activeText = area.name;
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      });

      const padding = 20 * scale;
      const boxWidth = 280 * scale;
      const boxHeight = 70 * scale;
      const x = canvas.width - boxWidth - padding;
      const y = padding;

      ctx.beginPath();
      const r = 20 * scale;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + boxWidth - r, y);
      ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + r);
      ctx.lineTo(x + boxWidth, y + boxHeight - r);
      ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - r, y + boxHeight);
      ctx.lineTo(x + r, y + boxHeight);
      ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fill();

      ctx.font = `${28 * scale}px Montserrat, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeText, x + boxWidth / 2, y + boxHeight / 2);
    };

    img.onload = draw;
    window.addEventListener('resize', draw);

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      areas.forEach(area => {
        const poly = new Path2D();
        const coords = area.coords;
        poly.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          poly.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        poly.closePath();
        area.hovered = ctx.isPointInPath(poly, mouseX, mouseY);
      });

      draw();
    });

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      areas.forEach(area => {
        const poly = new Path2D();
        const coords = area.coords;
        poly.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          poly.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        poly.closePath();

        if (ctx.isPointInPath(poly, mouseX, mouseY)) {
          window.open(area.link, '_self');
        }
      });
    });
  }
}

customElements.define('apartment-map-canvas', ApartmentMapCanvas);
