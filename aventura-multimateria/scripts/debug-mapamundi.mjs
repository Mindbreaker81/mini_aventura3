import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:3000/world/mision-mapamundi-v2/continent', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);
console.log(await page.locator('body').innerText());
console.log('--- localStorage ---');
console.log(await page.evaluate(() => JSON.stringify(localStorage)));
await browser.close();
