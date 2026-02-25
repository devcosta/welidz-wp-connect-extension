const sharp = require('sharp');
const fs = require('fs');

async function convertIcons() {
    const input = 'src/assets/favicon.png';

    try {
        // Save original image as input buffer
        const buffer = fs.readFileSync(input);

        // Create properly formatted PNGs for all necessary sizes
        const sizes = [16, 32, 48, 128];

        for (const size of sizes) {
            await sharp(buffer)
                .resize(size, size)
                .png()
                .toFile(`src/assets/icon_${size}.png`);
            console.log(`Created src/assets/icon_${size}.png`);
        }

        // Replace the default favicon.png with a valid PNG image format to be completely safe
        await sharp(buffer)
            .resize(128, 128)
            .png()
            .toFile(input);
        console.log(`Converted the original file to a valid PNG format.`);
    } catch (err) {
        console.error('Error during conversion:', err);
    }
}

convertIcons();
