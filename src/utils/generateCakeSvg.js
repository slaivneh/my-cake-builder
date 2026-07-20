export const generateCakeSvgString = (selections) => {
  const { layer, color, toppings, size } = selections;
  const numLayers = parseInt(layer, 10) || 1;
  const layerHeight = 60;
  
  const getLayersData = () => {
    const data = [];
    let currentY = 320;
    let baseWidth = size === 'large' ? 240 : size === 'medium' ? 200 : 160;
    
    for (let i = 1; i <= numLayers; i++) {
      data.push({ 
        id: i, 
        yBase: currentY, 
        width: baseWidth,
        yTop: currentY - layerHeight,
        rx: baseWidth / 2,
        ry: (baseWidth / 2) * 0.35
      });
      currentY -= layerHeight; 
      baseWidth -= 40; 
    }
    return data;
  };

  const layers = getLayersData();
  const topLayer = layers[layers.length - 1];
  const hasTopping = (toppingId) => (toppings || []).includes(toppingId);

  let svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">`;
  
  svgString += `<defs>
    <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fdfdfd" />
      <stop offset="100%" stop-color="#e0e0e0" />
    </linearGradient>
    <linearGradient id="cylinderShade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.15)" />
      <stop offset="20%" stop-color="rgba(0,0,0,0)" />
      <stop offset="80%" stop-color="rgba(0,0,0,0)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.25)" />
    </linearGradient>
    <linearGradient id="dripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3e1d04" />
      <stop offset="100%" stop-color="#2a1201" />
    </linearGradient>
  </defs>`;

  // Base shadow and stand
  svgString += `<ellipse cx="200" cy="365" rx="130" ry="25" fill="rgba(0,0,0,0.1)" />
    <path d="M 160 360 Q 160 375 180 375 L 220 375 Q 240 375 240 360 Z" fill="#d0d0d0" />
    <ellipse cx="200" cy="350" rx="140" ry="30" fill="url(#standGrad)" />
    <ellipse cx="200" cy="345" rx="130" ry="25" fill="#f5f5f5" />`;

  layers.forEach((l, index) => {
    svgString += `<g>
      <ellipse cx="200" cy="${l.yBase}" rx="${l.rx}" ry="${l.ry}" fill="${color}" />
      <rect x="${200 - l.rx}" y="${l.yTop}" width="${l.width}" height="${layerHeight}" fill="${color}" />
      <rect x="${200 - l.rx}" y="${l.yTop}" width="${l.width}" height="${layerHeight}" fill="url(#cylinderShade)" />`;
    
    if (hasTopping('chocolate_drip') && index === layers.length - 1) {
      const numDrips = 8;
      const w = (l.rx * 2) / numDrips;
      let path = `M ${200 - l.rx} ${l.yTop} `;
      path += `Q ${200 - l.rx + 2} ${l.yTop + 15} ${200 - l.rx + 5} ${l.yTop + 25} `;
      const depths = [75, 45, 95, 55, 85, 40, 70, 50];
      for (let i = 0; i < numDrips; i++) {
        let startX = 200 - l.rx + i * w;
        if (i === 0) startX += 5;
        let endX = (i === numDrips - 1) ? (200 + l.rx - 5) : (200 - l.rx + (i + 1) * w);
        let dripW = endX - startX;
        let depth = depths[i];
        let valleyY = l.yTop + 25;
        path += `C ${startX + dripW*0.2} ${valleyY}, ${startX + dripW*0.3} ${l.yTop + depth}, ${startX + dripW*0.5} ${l.yTop + depth} `;
        path += `C ${startX + dripW*0.7} ${l.yTop + depth}, ${startX + dripW*0.8} ${valleyY}, ${endX} ${valleyY} `;
      }
      path += `Q ${200 + l.rx - 2} ${l.yTop + 15} ${200 + l.rx} ${l.yTop} Z`;
      svgString += `<path d="${path}" fill="url(#dripGrad)" />`;
    }
    
    svgString += `<ellipse cx="200" cy="${l.yTop}" rx="${l.rx}" ry="${l.ry}" fill="${color}" />
      <ellipse cx="200" cy="${l.yTop}" rx="${l.rx}" ry="${l.ry}" fill="rgba(255,255,255,0.25)" />
    </g>`;
  });

  svgString += `<g transform="translate(0, ${topLayer.yTop - 10})">`;

  if (hasTopping('fruits')) {
    svgString += `
      <circle cx="160" cy="5" r="12" fill="#ff4d4d" /><path d="M 155 -5 L 160 -10 L 165 -5 Z" fill="#4caf50" />
      <circle cx="175" cy="-5" r="8" fill="#4a5a9c" /><circle cx="173" cy="-7" r="2" fill="#7b8ec7" />
      <circle cx="195" cy="-10" r="13" fill="#ff4d4d" /><path d="M 190 -20 L 195 -25 L 200 -20 Z" fill="#4caf50" />
      <circle cx="215" cy="-8" r="7" fill="#4a5a9c" />
      <circle cx="230" cy="2" r="11" fill="#ff4d4d" /><path d="M 225 -8 L 230 -13 L 235 -8 Z" fill="#4caf50" />
      <circle cx="215" cy="12" r="9" fill="#4a5a9c" />
      <circle cx="185" cy="15" r="14" fill="#ff4d4d" /><path d="M 180 5 L 185 0 L 190 5 Z" fill="#4caf50" />
      <circle cx="165" cy="18" r="7" fill="#4a5a9c" />
      <circle cx="145" cy="12" r="10" fill="#ff4d4d" /><path d="M 140 2 L 145 -3 L 150 2 Z" fill="#4caf50" />`;
  }

  if (hasTopping('macaron')) {
    svgString += `
      <g transform="translate(150, 15) rotate(-25)"><ellipse cx="0" cy="0" rx="16" ry="8" fill="#ffb3ba" /><rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" /></g>
      <g transform="translate(180, -5) rotate(10)"><ellipse cx="0" cy="0" rx="16" ry="8" fill="#baffc9" /><rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" /></g>
      <g transform="translate(220, -10) rotate(40)"><ellipse cx="0" cy="0" rx="16" ry="8" fill="#bae1ff" /><rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" /></g>
      <g transform="translate(240, 15) rotate(-15)"><ellipse cx="0" cy="0" rx="16" ry="8" fill="#ffffba" /><rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" /></g>
      <g transform="translate(195, 20) rotate(-45)"><ellipse cx="0" cy="0" rx="16" ry="8" fill="#e6e6fa" /><rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" /></g>`;
  }

  if (hasTopping('sprinkles')) {
    svgString += `
      <rect x="150" y="5" width="8" height="3" fill="#ff9a9e" rx="1.5" transform="rotate(45 150 5)" />
      <rect x="165" y="-10" width="8" height="3" fill="#a1c4fd" rx="1.5" transform="rotate(-30 165 -10)" />
      <rect x="185" y="-20" width="8" height="3" fill="#fecfef" rx="1.5" transform="rotate(15 185 -20)" />
      <rect x="205" y="-25" width="8" height="3" fill="#ffecd2" rx="1.5" transform="rotate(-60 205 -25)" />
      <rect x="225" y="-15" width="8" height="3" fill="#ffd166" rx="1.5" transform="rotate(75 225 -15)" />
      <rect x="245" y="-5" width="8" height="3" fill="#ff9a9e" rx="1.5" transform="rotate(-20 245 -5)" />
      <rect x="250" y="10" width="8" height="3" fill="#a1c4fd" rx="1.5" transform="rotate(50 250 10)" />
      <rect x="235" y="25" width="8" height="3" fill="#fecfef" rx="1.5" transform="rotate(85 235 25)" />
      <rect x="210" y="20" width="8" height="3" fill="#ffecd2" rx="1.5" transform="rotate(-15 210 20)" />
      <rect x="185" y="15" width="8" height="3" fill="#ffd166" rx="1.5" transform="rotate(35 185 15)" />
      <rect x="170" y="25" width="8" height="3" fill="#ff9a9e" rx="1.5" transform="rotate(-40 170 25)" />
      <rect x="155" y="15" width="8" height="3" fill="#a1c4fd" rx="1.5" transform="rotate(65 155 15)" />`;
  }
  
  svgString += `</g></svg>`;
  return svgString;
};
