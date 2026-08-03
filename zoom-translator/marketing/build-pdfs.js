// Render brochure.html and install-guide.html to A4 PDFs using Playwright.
// Usage: node build-pdfs.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const HERE = __dirname;
const FILES = [
  { html: 'brochure.html', pdf: 'ZoomLiveSubtitles-Brochure.pdf' },
  { html: 'install-guide.html', pdf: 'ZoomLiveSubtitles-InstallGuide.pdf' },
];

(async () => {
  const browser = await chromium.launch();
  for (const { html, pdf } of FILES) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const url = 'file://' + path.join(HERE, html);
    await page.goto(url, { waitUntil: 'networkidle' });
    // wait a tick for QRCode.js to finish drawing to canvas
    await page.waitForTimeout(1200);
    await page.pdf({
      path: path.join(HERE, pdf),
      format: 'A4',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      preferCSSPageSize: true,
    });
    console.log('✓', pdf, fs.statSync(path.join(HERE, pdf)).size, 'bytes');
    await ctx.close();
  }
  await browser.close();
})();
