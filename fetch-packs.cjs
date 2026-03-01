const { chromium } = require('playwright');
const fs = require('fs');

const run = async () => {
    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        const urls = [
            { id: 'crown_zenith', url: 'https://tcgplayer-cdn.tcgplayer.com/product/456100_200w.jpg' },
            { id: 'silver_tempest', url: 'https://tcgplayer-cdn.tcgplayer.com/product/284260_200w.jpg' },
            { id: '151', url: 'https://tcgplayer-cdn.tcgplayer.com/product/504781_200w.jpg' },
            { id: 'evolving_skies', url: 'https://tcgplayer-cdn.tcgplayer.com/product/241854_200w.jpg' },
            { id: 'paldea', url: 'https://tcgplayer-cdn.tcgplayer.com/product/490409_200w.jpg' }
        ];

        for (const p of urls) {
            console.log('Fetching:', p.id);
            const response = await page.goto(p.url);
            const buffer = await response.body();
            fs.writeFileSync('public/packs/' + p.id + '.png', buffer);
        }
        await browser.close();
        console.log('Images downloaded!');
    } catch (e) {
        console.error('Error:', e);
    }
};
run();
