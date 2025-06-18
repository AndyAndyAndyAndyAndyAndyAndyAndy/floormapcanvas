class FloorMapCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const canvas = document.createElement('canvas');
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    container.appendChild(canvas);
    this.shadowRoot.appendChild(container);

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'https://static.wixstatic.com/media/d32b49_98fcdb8d36d54b8081a2bc559c875ccb~mv2.jpg';

    const floors = [
      {
        name: 'Етаж 1',
        coords: [127,1209,417,1425,396,1450,399,1474,378,1485,636,1697,640,1732,823,1877,1209,1676,1467,1856,1732,1711,1813,1718,2548,1308,2714,1414,3103,1164,3438,1305,3770,1089,3831,1118,3862,1107,3958,1149,3958,1174,3990,1199,3997,1598,1626,2357,339,2359,0,1976,0,1262],
      },
      {
        name: 'Етаж 2',
        coords: [127,1199,424,1425,399,1439,375,1485,636,1693,647,1736,831,1880,1205,1672,1470,1849,1725,1711,1813,1714,2544,1298,2714,1404,3103,1160,3445,1291,3774,1072,3781,1019,3566,941,3587,800,3354,941,3004,796,2431,1107,2036,920,2028,1065,2067,1089,1343,1460,1000,1245,721,1372,67,909],
      },
      {
        name: 'Етаж 3',
        coords: [78,912,728,1378,1000,1244,1343,1463,2064,1089,2028,1068,2032,916,2424,1107,3011,792,3354,941,3576,799,3463,754,3463,686,2894,482,2940,457,2940,425,2831,386,2834,333,2170,104,1633,295,1633,415,1378,492,1308,506,1301,460,1011,323,145,609,170,799,180,838,142,862,142,884],
      }
    ];

    const draw = () => {
      canvas.width = this.clientWidth;
      canvas.height = this.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scaleX = canvas.width / 2000;
      const scaleY = canvas.height / 1181;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let labelText = 'Посочете етаж';

      // Draw floor shapes and check hover states
      floors.forEach(floor => {
        ctx.beginPath();
        const coords = floor.coords;
        ctx.moveTo(coords[0] * scaleX, coords[1] * scaleY);
        for (let i = 2; i < coords.length; i += 2) {
          ctx.lineTo(coords[i] * scaleX, coords[i + 1] * scaleY);
        }
        ctx.closePath();

        if (floor.hovered) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
          labelText = floor.name;
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      });

      // Draw label box in top-right corner
      const padding = 20 * scaleX;
      const boxWidth = 260 * scaleX;
      const boxHeight = 70 * scaleY;
      const x = canvas.width - boxWidth - padding;
      const y = padding;

      // Draw rounded rectangle
      ctx.beginPath();
      const r = 20 * scaleX;
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fill();

      // Draw text inside label box
      ctx.font = `${Math.round(28 * scaleX)}px Montserrat, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, x + boxWidth / 2, y + boxHeight / 2);
    };

    img.onload = draw;
    window.addEventListener('resize', draw);

    // Mouse move listener for hover detection
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / (canvas.width / 2000);
      const mouseY = (e.clientY - rect.top) / (canvas.height / 1181);

      floors.forEach(floor => {
        const poly = new Path2D();
        const coords = floor.coords;
        poly.moveTo(coords[0], coords[1]);
        for (let i = 2; i < coords.length; i += 2) {
          poly.lineTo(coords[i], coords[i + 1]);
        }
        poly.closePath();
        floor.hovered = ctx.isPointInPath(poly, mouseX, mouseY);
      });

      draw();
    });
  }
}

customElements.define('floor-map-canvas', FloorMapCanvas);
