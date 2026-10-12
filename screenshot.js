// Captures phone-viewport (390x844) screenshots of each mobile project for the portfolio cards.
// Usage: node screenshot.js [outDir]
const path = require('path');
const puppeteer = require('puppeteer');

const sites = {
  budgetforecast: 'https://budgetforecast.app',
  road: 'https://road.dance',
  baseless: 'https://baseless.chat',
  altbrysonpool: 'https://altbrysonpool.web.app',
  snowballfight: 'https://snowballfightapp.web.app/',
  iamlocal: 'https://iamlocal.online/',
  firerp: 'https://firerp.app/',
};

const outDir = process.argv[2] || path.join(__dirname, 'public');

(async () => {
  const browser = await puppeteer.launch();
  for (const [name, url] of Object.entries(sites)) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    } catch (e) {
      console.warn(`${name}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 4000));
    const file = path.join(outDir, `${name}.png`);
    await page.screenshot({ path: file });
    console.log('saved', file);
    await page.close();
  }
  await browser.close();
})();
