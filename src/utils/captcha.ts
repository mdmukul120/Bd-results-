/**
 * Generates an authentic Bangladesh Education Board style CAPTCHA SVG data URI
 */
export function generateCaptchaSvg(digits?: string): { code: string; image: string } {
  const code = digits || Math.floor(1000 + Math.random() * 9000).toString();
  
  // Create stylized SVG with wave distortion, lines, and dots
  const width = 160;
  const height = 50;

  const colors = ['#006a4e', '#166534', '#065f46', '#0f766e', '#1e293b'];
  const noiseLines = Array.from({ length: 6 }, (_, i) => {
    const x1 = Math.floor(Math.random() * 30);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(120 + Math.random() * 40);
    const y2 = Math.floor(Math.random() * height);
    const stroke = i % 2 === 0 ? '#10b981' : '#f43f5e';
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.5" stroke-opacity="0.4" />`;
  }).join('');

  const noiseDots = Array.from({ length: 25 }, () => {
    const cx = Math.floor(Math.random() * width);
    const cy = Math.floor(Math.random() * height);
    const r = (Math.random() * 1.5 + 0.5).toFixed(1);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f766e" opacity="0.3" />`;
  }).join('');

  const charsSvg = code.split('').map((char, i) => {
    const x = 25 + i * 30 + Math.floor(Math.random() * 6 - 3);
    const y = 34 + Math.floor(Math.random() * 6 - 3);
    const rot = Math.floor(Math.random() * 20 - 10);
    const color = colors[i % colors.length];
    return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="${color}" transform="rotate(${rot}, ${x}, ${y})">${char}</text>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width}" ${height}">
    <rect width="${width}" height="${height}" fill="#f8fafc" />
    <rect width="${width}" height="${height}" fill="none" stroke="#cbd5e1" stroke-width="1" />
    ${noiseLines}
    ${noiseDots}
    ${charsSvg}
  </svg>`;

  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return {
    code,
    image: `data:image/svg+xml;base64,${base64}`,
  };
}
