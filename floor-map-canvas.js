class FloorMapCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.maxWidth = '2000px';
    container.style.margin = '0 auto';
    container.style.aspectRatio = '2000 / 1181';
    this.shadowRoot.appendChild(container);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const originalWidth = 2000;
    const originalHeight = 1181;

    const img = new Image();
    img.src = 'https://static.wixstatic.com/media/d32b49_8e960ebffae04f2e8df3742ddcc756fe~mv2.jpg';

    const floors = [
      {
        name: 'ЕТАЖ 3',
        link: 'https://www.amarisea.com/b-floor3',
        coords: [64,275,456,143,587,207,587,224,614,218,670,242,714,223,712,197,735,188,735,131,978,45,1275,148,1275,169,1321,193,1321,202,1304,212,1557,305,1557,340,1614,359,1509,421,1355,358,1092,499,916,414,914,466,905,474,935,491,604,661,453,558,324,620,32,410,60,394,60,385,83,375]
      },
      {
        name: 'ЕТАЖ 2',
        link: 'https://www.amarisea.com/b-floor2',
        coords: [32,412,326,622,455,563,605,661,937,493,908,474,913,466,918,417,1094,501,1355,361,1513,425,1616,361,1605,429,1707,463,1556,566,1403,499,1223,606,1149,569,1150,585,1023,661,1023,639,816,762,774,730,774,773,662,835,547,754,371,843,239,741,235,728,172,681,170,666,180,663,180,649,192,643,57,539]
      },
      {
        name: 'ЕТАЖ 1',
        link: 'https://www.amarisea.com/b-floor1',
        coords: [-2,615,-2,665,2,1061,736,1061,1798,721,1798,528,1781,515,1733,498,1698,496,1705,464,1558,563,1399,501,1223,604,1150,569,1150,584,1023,660,1018,642,816,760,774,734,773,771,662,833,545,754,372,843,240,744,234,727,183,688,172,677,167,665,180,661,180,650,191,642,56,541,0,566]
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

      let activeText = 'Посочете етаж';

      floors.forEach(floor => {
        ctx.beginPath();
        const coords = floor.coords;
        ctx.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          ctx.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        ctx.closePath();

        if (floor.hovered) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
          ctx.fill();
          activeText = floor.name;
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

      floors.forEach(floor => {
        const poly = new Path2D();
        const coords = floor.coords;
        poly.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          poly.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        poly.closePath();
        floor.hovered = ctx.isPointInPath(poly, mouseX, mouseY);
      });

      draw();
    });

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      floors.forEach(floor => {
        const poly = new Path2D();
        const coords = floor.coords;
        poly.moveTo(coords[0] * scale, coords[1] * scale);
        for (let i = 2; i < coords.length; i += 2) {
          poly.lineTo(coords[i] * scale, coords[i + 1] * scale);
        }
        poly.closePath();

        if (ctx.isPointInPath(poly, mouseX, mouseY)) {
          window.open(floor.link, '_self');
        }
      });
    });
  }
}

customElements.define('floor-map-canvas', FloorMapCanvas);
