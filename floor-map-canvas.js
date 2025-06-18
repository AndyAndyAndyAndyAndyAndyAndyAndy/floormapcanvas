class FloorMapCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    canvas.style.border = '1px solid #ccc';
    this.shadowRoot.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Load background image
    const backgroundImage = new Image();
    backgroundImage.crossOrigin = "anonymous";
    backgroundImage.src = 'https://static.wixstatic.com/media/d32b49_98fcdb8d36d54b8081a2bc559c875ccb~mv2.jpg';

    // Floor polygons
    const areas = [
      {
        title: "1",
        url: "https://www.amarisea.com/b-floor1",
        coords: [127,1209,417,1425,396,1450,399,1474,378,1485,636,1697,640,1732,823,1877,1209,1676,1467,1856,1732,1711,1813,1718,2548,1308,2714,1414,3103,1164,3438,1305,3770,1089,3831,1118,3862,1107,3958,1149,3958,1174,3990,1199,3997,1598,1626,2357,339,2359,0,1976,0,1262]
      },
      {
        title: "2",
        url: "https://www.amarisea.com/b-floor2",
        coords: [127,1199,424,1425,399,1439,375,1485,636,1693,647,1736,831,1880,1205,1672,1470,1849,1725,1711,1813,1714,2544,1298,2714,1404,3103,1160,3445,1291,3774,1072,3781,1019,3566,941,3587,800,3354,941,3004,796,2431,1107,2036,920,2028,1065,2067,1089,1343,1460,1000,1245,721,1372,67,909]
      },
      {
        title: "3",
        url: "https://www.amarisea.com/b-floor3",
        coords: [78,912,728,1378,1000,1244,1343,1463,2064,1089,2028,1068,2032,916,2424,1107,3011,792,3354,941,3576,799,3463,754,3463,686,2894,482,2940,457,2940,425,2831,386,2834,333,2170,104,1633,295,1633,415,1378,492,1308,506,1301,460,1011,323,145,609,170,799,180,838,142,862,142,884]
      }
    ];

    const scaleX = canvas.width / 4000;
    const scaleY = canvas.height / 2400;

    function drawMap(highlightArea = null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      areas.forEach(area => {
        ctx.beginPath();
        const coords = area.coords;
        for (let i = 0; i < coords.length; i += 2) {
          const x = coords[i] * scaleX;
          const y = coords[i + 1] * scaleY;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = (highlightArea === area) ? 'rgba(255,0,0,0.3)' : 'rgba(200,200,200,0.25)';
        ctx.fill();
        ctx.strokeStyle = '#555';
        ctx.stroke();
      });
    }

    function getAreaAt(x, y) {
      for (let area of areas) {
        ctx.beginPath();
        const coords = area.coords;
        for (let i = 0; i < coords.length; i += 2) {
          const cx = coords[i] * scaleX;
          const cy = coords[i + 1] * scaleY;
          if (i === 0) {
            ctx.moveTo(cx, cy);
          } else {
            ctx.lineTo(cx, cy);
          }
        }
        ctx.closePath();
        if (ctx.isPointInPath(x, y)) {
          return area;
        }
      }
      return null;
    }

    backgroundImage.onload = () => {
      drawMap();
    };

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const area = getAreaAt(x, y);
      drawMap(area);

      if (area) {
        canvas.title = `Floor ${area.title}`;
      } else {
        canvas.title = '';
      }
    });

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const area = getAreaAt(x, y);
      if (area) {
        window.open(area.url, '_parent');
      }
    });
  }
}

// Register the custom element
customElements.define('floor-map-canvas', FloorMapCanvas);
