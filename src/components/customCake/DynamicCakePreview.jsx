import React from 'react';

const DynamicCakePreview = ({ selections }) => {
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
        ry: (baseWidth / 2) * 0.35 // Better perspective
      });
      currentY -= layerHeight; 
      baseWidth -= 40; 
    }
    return data;
  };

  const layers = getLayersData();
  const topLayer = layers[layers.length - 1];
  const hasTopping = (toppingId) => (toppings || []).includes(toppingId);

  return (
    <div className="dynamic-cake-preview" style={{ width: '100%', maxWidth: '350px', margin: '0 auto', padding: '20px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}>
        <defs>
          <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fdfdfd" />
            <stop offset="100%" stopColor="#e0e0e0" />
          </linearGradient>
          <linearGradient id="standBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d5d5d5" />
            <stop offset="50%" stopColor="#efefef" />
            <stop offset="100%" stopColor="#c5c5c5" />
          </linearGradient>
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* Cylinder gradient for 3D effect */}
          <linearGradient id="cylinderShade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="20%" stopColor="rgba(0,0,0,0)" />
            <stop offset="80%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </linearGradient>
          {/* Drip gradient */}
          <linearGradient id="dripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a2e1b" />
            <stop offset="100%" stopColor="#2c1a0e" />
          </linearGradient>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="200" cy="370" rx="150" ry="25" fill="url(#shadowGrad)" />

        {/* Cake Stand Base */}
        <path d="M 160 380 Q 200 395 240 380 L 220 340 L 180 340 Z" fill="url(#standBaseGrad)" />
        <ellipse cx="200" cy="380" rx="40" ry="10" fill="#c0c0c0" />
        
        {/* Cake Stand Plate */}
        <ellipse cx="200" cy="340" rx="140" ry="35" fill="#cccccc" />
        <ellipse cx="200" cy="335" rx="140" ry="35" fill="url(#standGrad)" />

        {/* Cake Layers */}
        {layers.map((l, index) => (
          <g key={l.id}>
            {/* Cylinder Bottom Curve (only needed for base color if shading is transparent) */}
            <ellipse cx="200" cy={l.yBase} rx={l.rx} ry={l.ry} fill={color} />
            <ellipse cx="200" cy={l.yBase} rx={l.rx} ry={l.ry} fill="url(#cylinderShade)" />
            
            {/* Cylinder Body */}
            <rect x={200 - l.rx} y={l.yTop} width={l.width} height={layerHeight} fill={color} />
            <rect x={200 - l.rx} y={l.yTop} width={l.width} height={layerHeight} fill="url(#cylinderShade)" />
            
            {/* Drip (Only on top layer for a cleaner look) */}
            {hasTopping('chocolate_drip') && index === layers.length - 1 && (
              <path 
                d={(() => {
                  const numDrips = 8;
                  const w = (l.rx * 2) / numDrips;
                  // Start at the left edge
                  let path = `M ${200 - l.rx} ${l.yTop} `;
                  // Curve down to create a VERY thick continuous band at the left
                  path += `Q ${200 - l.rx + 2} ${l.yTop + 15} ${200 - l.rx + 5} ${l.yTop + 25} `;
                  
                  const depths = [75, 45, 95, 55, 85, 40, 70, 50]; // EXTREMELY deep drips
                  
                  for (let i = 0; i < numDrips; i++) {
                    let startX = 200 - l.rx + i * w;
                    if (i === 0) startX += 5; // adjust for the initial curve
                    
                    let endX = (i === numDrips - 1) ? (200 + l.rx - 5) : (200 - l.rx + (i + 1) * w);
                    let dripW = endX - startX;
                    let depth = depths[i];
                    let valleyY = l.yTop + 25; // The chocolate band is now 25px thick everywhere!
                    
                    // Smooth teardrop curve down and back up
                    path += `C ${startX + dripW*0.2} ${valleyY}, ` +
                            `${startX + dripW*0.3} ${l.yTop + depth}, ` +
                            `${startX + dripW*0.5} ${l.yTop + depth} `;
                    path += `C ${startX + dripW*0.7} ${l.yTop + depth}, ` +
                            `${startX + dripW*0.8} ${valleyY}, ` +
                            `${endX} ${valleyY} `;
                  }
                  // Curve back up to the right edge
                  path += `Q ${200 + l.rx - 2} ${l.yTop + 15} ${200 + l.rx} ${l.yTop} Z`;
                  return path;
                })()}
                fill="url(#dripGrad)" 
              />
            )}

            {/* Cylinder Top */}
            <ellipse cx="200" cy={l.yTop} rx={l.rx} ry={l.ry} fill={color} />
            <ellipse cx="200" cy={l.yTop} rx={l.rx} ry={l.ry} fill="rgba(255,255,255,0.25)" />
          </g>
        ))}

        {/* Toppings on Top Layer */}
        <g transform={`translate(0, ${topLayer.yTop - 10})`}>
          {hasTopping('fruits') && (
            <g>
              {/* Strawberry 1 */}
              <circle cx="160" cy="5" r="12" fill="#ff4d4d" />
              <path d="M 155 -5 L 160 -10 L 165 -5 Z" fill="#4caf50" />
              
              {/* Blueberry 1 */}
              <circle cx="175" cy="-5" r="8" fill="#4a5a9c" />
              <circle cx="173" cy="-7" r="2" fill="#7b8ec7" />
              
              {/* Strawberry 2 */}
              <circle cx="195" cy="-10" r="13" fill="#ff4d4d" />
              <path d="M 190 -20 L 195 -25 L 200 -20 Z" fill="#4caf50" />
              
              {/* Blueberry 2 */}
              <circle cx="215" cy="-8" r="7" fill="#4a5a9c" />
              
              {/* Strawberry 3 */}
              <circle cx="230" cy="2" r="11" fill="#ff4d4d" />
              <path d="M 225 -8 L 230 -13 L 235 -8 Z" fill="#4caf50" />
              
              {/* Blueberry 3 */}
              <circle cx="215" cy="12" r="9" fill="#4a5a9c" />
              
              {/* Strawberry 4 */}
              <circle cx="185" cy="15" r="14" fill="#ff4d4d" />
              <path d="M 180 5 L 185 0 L 190 5 Z" fill="#4caf50" />
              
              {/* Blueberry 4 */}
              <circle cx="165" cy="18" r="7" fill="#4a5a9c" />
              
              {/* Strawberry 5 */}
              <circle cx="145" cy="12" r="10" fill="#ff4d4d" />
              <path d="M 140 2 L 145 -3 L 150 2 Z" fill="#4caf50" />
            </g>
          )}

          {hasTopping('macaron') && (
            <g>
              {/* Macaron 1 Pink */}
              <g transform="translate(150, 15) rotate(-25)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="#ffb3ba" />
                <rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" />
              </g>
              {/* Macaron 2 Green */}
              <g transform="translate(180, -5) rotate(10)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="#baffc9" />
                <rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" />
              </g>
              {/* Macaron 3 Blue */}
              <g transform="translate(220, -10) rotate(40)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="#bae1ff" />
                <rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" />
              </g>
              {/* Macaron 4 Yellow */}
              <g transform="translate(240, 15) rotate(-15)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="#ffffba" />
                <rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" />
              </g>
              {/* Macaron 5 Purple */}
              <g transform="translate(195, 20) rotate(-45)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="#e6e6fa" />
                <rect x="-15" y="-2" width="30" height="4" fill="#fff" rx="2" />
              </g>
            </g>
          )}

          {hasTopping('sprinkles') && (
            <g>
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
              <rect x="155" y="15" width="8" height="3" fill="#a1c4fd" rx="1.5" transform="rotate(65 155 15)" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default DynamicCakePreview;
