const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="#6366f1"/>
  <rect x="50" y="32" width="54" height="68" rx="6" fill="white" opacity="0.4"/>
  <rect x="38" y="40" width="54" height="68" rx="6" fill="white" opacity="0.6"/>
  <rect x="26" y="48" width="54" height="68" rx="6" fill="white"/>
  <rect x="40" y="42" width="26" height="12" rx="4" fill="white"/>
  <rect x="45" y="45" width="16" height="6" rx="2" fill="#6366f1"/>
  <g fill="#6366f1">
    <rect x="88" y="70" width="20" height="8" rx="2"/>
    <polygon points="108,64 120,74 108,84"/>
  </g>
  <rect x="34" y="64" width="38" height="5" rx="2.5" fill="#6366f1" opacity="0.5"/>
  <rect x="34" y="74" width="30" height="5" rx="2.5" fill="#6366f1" opacity="0.5"/>
  <rect x="34" y="84" width="34" height="5" rx="2.5" fill="#6366f1" opacity="0.5"/>
  <rect x="34" y="94" width="26" height="5" rx="2.5" fill="#6366f1" opacity="0.5"/>
</svg>`;

const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, 'icons');

// Create a simple PNG with the SVG embedded as data URI
// This creates a basic placeholder - for production, use a proper image library

sizes.forEach(size => {
  // For now, just create the SVG files scaled
  // The browser/Chrome will handle SVG icons
  const scaledSvg = svgContent.replace('viewBox="0 0 128 128"', `viewBox="0 0 128 128" width="${size}" height="${size}"`);

  // Save as SVG with size suffix (Chrome actually supports SVG icons in some cases)
  // But we need PNG for full compatibility
  console.log(`Need to create icon${size}.png manually`);
});

console.log(`
=====================================================
PNG icons need to be created manually.

Option 1: Use the generate-icons.html file
  1. Open generate-icons.html in Chrome
  2. Click each Download button
  3. Move files to icons/ folder

Option 2: Use online converter
  1. Go to https://svgtopng.com/
  2. Upload icons/icon.svg
  3. Download in sizes: 16, 32, 48, 128
  4. Rename and save to icons/ folder

Option 3: Use macOS Preview
  1. Open icons/icon.svg in Preview
  2. File > Export
  3. Choose PNG, set size
  4. Repeat for each size
=====================================================
`);
