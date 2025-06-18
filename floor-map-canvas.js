class FloorMapCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const canvas = document.createElement('canvas');
    const style = document.createElement('style');

    style.textContent = `
      canvas {
        display: block;
        width: 100%;
        height: auto;
      }
      .label {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        font-family: 'Montserrat', sans-serif;
        font-weight: bold;
        border-radius: 20px;
        padding: 10px 20px;
        font-size: 18px;
      }
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(canvas);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = 'Посочете етаж';
    this.shadowRoot.appendChild(label);

    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'https://static.wixstatic.com/media/d32b49_8e960ebffae04f2e8df3742ddcc756fe~mv2.jpg';

    const areas = [
      {
        label: 'ЕТАЖ 3',
        link: 'https://www.amarisea.com/b-floor3',
        coords: [64,275,456,143,587,207,587,224,614,218,670,242,714,223,712,197,735,188,735,131,978,45,1275,148,1275,169,1321,193,1321,202,1304,212,1557,305,1557,340,1614,359,1509,421,1355,358,1092,499,916,414,914,466,905,474,935,491,604,661,453,558,324,620,32,410,60,394,60,385,83,375],
        hovered: false
      },
      {
        label: 'ЕТАЖ 2',
        link: 'https://www.amarisea.com/b-floor2',
        coords: [32,412,326,622,455,563,605,661,937,493,908,474,913,466,918,417,1094,501,1355,361,1513,425,1616,361,1605,429,1707,463,1556,566,1403,499,1223,606,1149,569,1150,585,1023,661,1023,639,816,762,774,730,774,773,662,835,547,754,371,843,239,741,235,728,172,681,170,666,180,663,180,649,192,643,57,539],
        hovered: false
      },
      {
        label: 'ЕТАЖ 1',
        link: 'https://www.amarisea.com/b-floor1',
        coords: [-2,615,-2,665,2,1061,736,1061,1798,721,1798,528,1781,515,1733,498,1698,496,1705,464,1558,563,1399,501,1223,604,1150,569,1150,584,1023,660,1018,642,816,760,774,734,773,771,662,833,545,754,372,843,240,744,234,727,183,688,172,677,167,665,180,661,180,650,191,642,56,541,0,566],
        hovered: false
      }
    ];

    let scale = 1;

    const draw = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      scale = canvas.offsetWidth / image.width;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      areas.forEach(area => {
        const poly = new Path2D();
        const coords = area.coords;
        poly.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          poly.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        poly.closePath();

        if (area.hovered) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fill(poly);
        }
      });
    };

    image.onload = () => {
      draw();
    };

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = false;
      areas.forEach(area => {
        const poly = new Path2D();
        const coords = area.coords;
        poly.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          poly.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        poly.closePath();

        if (ctx.isPointInPath(poly, mouseX, mouseY)) {
          areas.forEach(a => a.hovered = false);
          area.hovered = true;
          label.textContent = area.label;
          found = true;
        }
      });
      if (!found) {
        areas.forEach(a => a.hovered = false);
        label.textContent = 'Посочете етаж';
      }
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
          if (area.hovered) {
            window.open(area.link, '_self');
          } else {
            areas.forEach(a => a.hovered = false);
            area.hovered = true;
            label.textContent = area.label;
            draw();
          }
        }
      });
    });

    window.addEventListener('resize', draw);
  }
}

customElements.define('floor-map-canvas', FloorMapCanvas);
