import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:3000/world/mision-mapamundi-v2/continent', { waitUntil: 'networkidle' });
const consent = page.getByRole('button', { name: /Entendido/i });
if (await consent.isVisible().catch(() => false)) await consent.click();
await page.waitForFunction(() => !document.body.innerText.includes('Cargando tareas del juego'), { timeout: 20000 });

const question = await page.locator('h2').innerText();
console.log('Pregunta:', question);

const paths = page.locator('svg.rsm-svg path');
const count = await paths.count();
console.log('Paths en mapa:', count);

const confirmBtn = page.getByRole('button', { name: /Confirmar/i });
let selected = false;
for (let i = 0; i < Math.min(count, 40); i++) {
  await paths.nth(i).click({ force: true });
  await page.waitForTimeout(100);
  if (!(await confirmBtn.isDisabled())) {
    selected = true;
    console.log(`Selección OK en path #${i}`);
    break;
  }
}
console.log('Selección lograda:', selected);
if (selected) {
  await confirmBtn.click();
  await page.waitForTimeout(2000);
  console.log('Feedback visible:', /Correcto|Incorrecto/i.test(await page.locator('body').innerText()));
}
await browser.close();
