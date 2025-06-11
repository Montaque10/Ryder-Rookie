const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = fs.readFileSync(path.join(__dirname, 'icon.svg'));

// Generate icon.png (1024x1024)
sharp(svgBuffer)
  .resize(1024, 1024)
  .png()
  .toFile(path.join(__dirname, 'icon.png'))
  .then(() => console.log('Generated icon.png'))
  .catch(err => console.error('Error generating icon.png:', err));

// Generate adaptive-icon.png (1024x1024)
sharp(svgBuffer)
  .resize(1024, 1024)
  .png()
  .toFile(path.join(__dirname, 'adaptive-icon.png'))
  .then(() => console.log('Generated adaptive-icon.png'))
  .catch(err => console.error('Error generating adaptive-icon.png:', err));

// Generate favicon.png (64x64)
sharp(svgBuffer)
  .resize(64, 64)
  .png()
  .toFile(path.join(__dirname, 'favicon.png'))
  .then(() => console.log('Generated favicon.png'))
  .catch(err => console.error('Error generating favicon.png:', err));

// Generate splash.png (1242x2436)
sharp(svgBuffer)
  .resize(1242, 2436)
  .extend({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: { r: 76, g: 175, b: 80, alpha: 1 } // #4CAF50
  })
  .png()
  .toFile(path.join(__dirname, 'splash.png'))
  .then(() => console.log('Generated splash.png'))
  .catch(err => console.error('Error generating splash.png:', err)); 