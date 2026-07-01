import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';

const STORAGE_KEYS = {
  puerto: 'puerto-palabras-storage',
  bosc: 'bosc-lectura-storage',
  mercado: 'mercado-numeros-storage',
  museo: 'museo-tiempo-storage',
  steam: 'steam-v2-storage',
  flip: 'laboratorio-flip-storage',
  mapamundi: 'mapamundi-v2-session',
};

async function dismissConsent(page) {
  const btn = page.getByRole('button', { name: /Entendido|Got it|OK/i });
  if (await btn.isVisible().catch(() => false)) await btn.click();
}

async function clearStorage(page, key) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate((k) => localStorage.removeItem(k), key);
}

async function clickStart(page) {
  const startBtn = page.getByRole('button', { name: /Empezar|Comenzar|Start|Programar|Experimentos|visita|Mercado|Aventura|Reparar|Lectura/i }).first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
    return true;
  }
  return false;
}

function result(game, status, details = {}) {
  return { game, status, ...details };
}

async function testPuerto(page) {
  console.log('\n=== Puerto de las Palabras ===');
  await clearStorage(page, STORAGE_KEYS.puerto);
  await page.goto(`${BASE}/world/puerto-palabras`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await clickStart(page);
  await page.waitForTimeout(500);

  const word = page.locator('[role="button"][aria-label]').first();
  const wordText = await word.getAttribute('aria-label');
  const category = page.locator('[class*="border-dashed"]').first();
  const wordBox = await word.boundingBox();
  const catBox = await category.boundingBox();

  let dragWorked = false;
  if (wordBox && catBox) {
    await page.mouse.move(wordBox.x + wordBox.width / 2, wordBox.y + wordBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(catBox.x + catBox.width / 2, catBox.y + catBox.height / 2, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(800);
    const body = await page.locator('body').innerText();
    dragWorked = body.includes('✅') || body.includes('🔄') || body.includes('Correct') || body.includes('Inténtalo');
  }

  const wordCount = await page.locator('[role="button"][aria-label]').count();
  const ok = wordCount >= 5;
  console.log(`Palabras: ${wordCount} | Drag probado (${wordText}): ${dragWorked ? 'feedback' : 'sin feedback visible'}`);
  return result('puerto-palabras', ok ? 'ok' : 'fail', { wordCount, dragWorked });
}

async function testBosc(page) {
  console.log('\n=== Bosc de Lectura ===');
  await clearStorage(page, STORAGE_KEYS.bosc);
  await page.goto(`${BASE}/world/bosc-lectura`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await clickStart(page);
  await page.waitForTimeout(1000);

  await page.locator('input[type="radio"]').first().check();
  await page.getByRole('button', { name: /Comprobar|Check|Verificar/i }).click();
  await page.waitForTimeout(500);

  const body = await page.locator('body').innerText();
  const hasFeedback = /✅|❌|Correct|Incorrect|Siguiente|Next/i.test(body);
  const ok = hasFeedback && await page.locator('legend').count() > 0;
  console.log(`Feedback tras responder: ${hasFeedback}`);
  return result('bosc-lectura', ok ? 'ok' : 'fail', { hasFeedback });
}

async function testMercado(page) {
  console.log('\n=== Mercado de Números ===');
  await clearStorage(page, STORAGE_KEYS.mercado);
  await page.goto(`${BASE}/world/mercado-numeros`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await clickStart(page);
  await page.waitForTimeout(800);

  const bodyBefore = await page.locator('body').innerText();
  const loading = /Cargando/i.test(bodyBefore);
  if (loading) return result('mercado-numeros', 'fail', { loading: true });

  const coinButtons = page.locator('div.grid button, div[class*="grid"] button').filter({ hasText: /€|c$/ });
  const coinCount = await coinButtons.count();
  for (let i = 0; i < Math.min(4, coinCount); i++) {
    await coinButtons.nth(i).click({ force: true }).catch(() => {});
  }

  const payBtn = page.getByRole('button', { name: /Pagar|Pay/i });
  let payClicked = false;
  if (await payBtn.isEnabled().catch(() => false)) {
    await payBtn.click();
    payClicked = true;
    await page.waitForTimeout(600);
  }

  const body = await page.locator('body').innerText();
  const hasFeedback = /Correct|Incorrect|✅|❌|Siguiente|monedas/i.test(body);
  console.log(`Reto cargado | Pago probado: ${payClicked} | Feedback: ${hasFeedback}`);
  return result('mercado-numeros', !loading ? 'ok' : 'fail', { payClicked, hasFeedback });
}

async function testMuseo(page) {
  console.log('\n=== Museo del Tiempo ===');
  await clearStorage(page, STORAGE_KEYS.museo);
  await page.goto(`${BASE}/world/museo-tiempo`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await clickStart(page);
  await page.waitForTimeout(800);

  const poolItem = page.locator('[class*="cursor-move"]').first();
  const slot = page.locator('[class*="border-dashed"]').first();
  const poolBox = await poolItem.boundingBox();
  const slotBox = await slot.boundingBox();

  let dragWorked = false;
  if (poolBox && slotBox) {
    await page.mouse.move(poolBox.x + poolBox.width / 2, poolBox.y + poolBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(slotBox.x + slotBox.width / 2, slotBox.y + slotBox.height / 2, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    dragWorked = !(await slot.innerText()).includes('Arrastra') && !(await slot.innerText()).match(/vacío|empty/i);
  }

  const poolCount = await page.locator('[class*="cursor-move"]').count();
  const hasCheck = await page.getByRole('button', { name: /Comprobar|Check|orden/i }).isVisible();
  console.log(`Eventos: ${poolCount} | Drag a slot: ${dragWorked}`);
  return result('museo-tiempo', poolCount >= 4 && hasCheck ? 'ok' : 'fail', { poolCount, dragWorked });
}

async function testSteam(page) {
  console.log('\n=== Desafío STEAM ===');
  await clearStorage(page, STORAGE_KEYS.steam);
  await page.goto(`${BASE}/world/desafio-steam`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await clickStart(page);

  await page.waitForSelector('.blocklySvg', { timeout: 20000 });
  await page.waitForTimeout(1000);

  const hasBlockly = (await page.locator('.blocklySvg').count()) > 0;
  const hasRun = await page.getByRole('button', { name: /Ejecutar|Run/i }).isVisible();
  const runDisabled = await page.getByRole('button', { name: /Ejecutar|Run/i }).isDisabled();
  const hasGrid = await page.getByText(/Inicio|Meta|Muro/i).first().isVisible();

  console.log(`Blockly: ${hasBlockly} | Ejecutar visible: ${hasRun} | Tablero: ${hasGrid} | Run deshabilitado (sin bloques): ${runDisabled}`);
  return result('desafio-steam', hasBlockly && hasRun && hasGrid ? 'ok' : 'fail', { hasBlockly, hasRun, hasGrid });
}

async function testFlip(page) {
  console.log('\n=== Laboratorio Flip ===');
  await clearStorage(page, STORAGE_KEYS.flip);
  await page.goto(`${BASE}/world/laboratorio-flip`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await clickStart(page);
  await page.waitForTimeout(1500);

  const body = await page.locator('body').innerText();
  const hasTitle = /Experimento|Lección|Lesson|Laboratorio/i.test(body);
  const quizLocked = await page.getByText(/bloqueado|locked|Completa/i).isVisible().catch(() => false);
  const hasVideoArea = await page.locator('iframe, video, [class*="react-player"]').count() > 0
    || body.length > 200;

  console.log(`Lección cargada: ${hasTitle} | Área vídeo: ${hasVideoArea} | Quiz bloqueado: ${quizLocked}`);
  return result('laboratorio-flip', hasTitle && hasVideoArea ? 'ok' : 'fail', { hasTitle, hasVideoArea, quizLocked });
}

async function testMapamundiQuick(page) {
  console.log('\n=== Mapamundi (smoke) ===');
  await clearStorage(page, STORAGE_KEYS.mapamundi);
  await page.goto(`${BASE}/world/mision-mapamundi-v2/continent`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await page.waitForFunction(() => !document.body.innerText.includes('Cargando tareas del juego'), { timeout: 20000 });

  const stuck = (await page.locator('body').innerText()).includes('Cargando tareas');
  const hasMap = (await page.locator('svg.rsm-svg').count()) > 0;
  console.log(`Mapa: ${hasMap} | Atascado: ${stuck}`);
  return result('mision-mapamundi-v2', !stuck && hasMap ? 'ok' : 'fail', { stuck, hasMap });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const consoleErrors = [];
page.on('pageerror', (err) => consoleErrors.push(err.message));

const results = [];
try {
  results.push(await testPuerto(page));
  results.push(await testBosc(page));
  results.push(await testMercado(page));
  results.push(await testMuseo(page));
  results.push(await testSteam(page));
  results.push(await testFlip(page));
  results.push(await testMapamundiQuick(page));

  console.log('\n=== Errores JS ===');
  if (consoleErrors.length) consoleErrors.forEach((e) => console.log('-', e));
  else console.log('Ninguno');

  console.log('\n=== RESUMEN ===');
  for (const r of results) {
    console.log(`${r.status === 'ok' ? '✅' : '❌'} ${r.game}`);
  }
  if (results.some((r) => r.status !== 'ok')) process.exitCode = 1;
} catch (err) {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
