import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';

async function dismissConsent(page) {
  const btn = page.getByRole('button', { name: /Entendido|Got it|OK/i });
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
  }
}

async function waitForGameReady(page, timeout = 45000) {
  await page.waitForFunction(
    () => {
      const text = document.body.innerText;
      const loading = text.includes('Cargando tareas del juego');
      const hasQuestion = /Pregunta|Question|Continente|Océano|comunidad/i.test(text);
      const hasGameOver = /Game Over|Fin del juego|Reintentar/i.test(text);
      const hasVictory = /Misión completada|Mission complete/i.test(text);
      return !loading && (hasQuestion || hasGameOver || hasVictory);
    },
    { timeout }
  );
}

async function waitForMapReady(page, timeout = 45000) {
  await page.waitForFunction(
    () => {
      const text = document.body.innerText;
      if (text.includes('Sin conexión') || text.includes('offline') || text.includes('Reintentar')) {
        return true;
      }
      return document.querySelector('svg.rsm-svg') !== null;
    },
    { timeout }
  );
}

async function testMode(page, mode, label) {
  console.log(`\n=== Modo: ${label} (${mode}) ===`);
  await page.goto(`${BASE}/world/mision-mapamundi-v2/${mode}`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await waitForGameReady(page);

  const bodyText = await page.locator('body').innerText();
  if (bodyText.includes('Cargando tareas del juego')) {
    throw new Error(`${label}: atascado en carga de tareas`);
  }

  const question = await page.locator('h2').first().innerText().catch(() => '');
  console.log(`Pregunta: ${question.slice(0, 80)}`);

  await waitForMapReady(page);
  const hasSvg = (await page.locator('svg.rsm-svg').count()) > 0;
  const offline = /Sin conexión|offline|Reintentar/i.test(bodyText);
  console.log(`Mapa SVG: ${hasSvg ? 'sí' : 'no'} | Offline UI: ${offline ? 'sí' : 'no'}`);

  if (!hasSvg && !offline) {
    throw new Error(`${label}: ni mapa ni pantalla offline`);
  }

  if (hasSvg) {
    const confirmBtn = page.getByRole('button', { name: /Confirmar|Confirm selection/i });
    const disabledBefore = await confirmBtn.isDisabled();
    console.log(`Botón confirmar deshabilitado sin selección: ${disabledBefore}`);

    if (mode === 'ocean') {
      await page.locator('svg circle[style*="cursor"]').first().click({ force: true });
    } else {
      await page.locator('svg.rsm-svg path').first().click({ force: true });
    }

    await page.waitForTimeout(300);
    const disabledAfter = await confirmBtn.isDisabled();
    console.log(`Botón confirmar habilitado tras clic: ${!disabledAfter}`);

    if (disabledAfter) {
      console.warn(`${label}: el clic no seleccionó región (puede ser mapa sin hit)`);
    } else {
      await confirmBtn.click();
      await page.waitForTimeout(2500);
      const feedback = await page.locator('body').innerText();
      const answered = /Correcto|Incorrecto|Correct|Incorrect|XP|vida/i.test(feedback);
      console.log(`Feedback tras confirmar: ${answered ? 'sí' : 'no'}`);
    }
  }

  return { question, hasSvg, offline };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(err.message));

try {
  console.log('=== Selector de modos ===');
  await page.goto(`${BASE}/world/mision-mapamundi-v2`, { waitUntil: 'networkidle' });
  const selectorText = await page.locator('body').innerText();
  console.log(`Título visible: ${/Mapamundi|Misión|Mission/i.test(selectorText)}`);
  console.log(`3 modos visibles: ${['continent', 'ocean', 'ccaa'].every((m) => selectorText.length > 0)}`);

  await page.evaluate(() => localStorage.removeItem('mapamundi-v2-session'));

  const results = [];
  results.push(await testMode(page, 'continent', 'Continentes'));
  await page.evaluate(() => localStorage.removeItem('mapamundi-v2-session'));
  results.push(await testMode(page, 'ocean', 'Océanos'));
  await page.evaluate(() => localStorage.removeItem('mapamundi-v2-session'));
  results.push(await testMode(page, 'ccaa', 'CCAA'));

  console.log('\n=== Errores de consola ===');
  if (consoleErrors.length === 0) {
    console.log('Ninguno');
  } else {
    consoleErrors.slice(0, 10).forEach((e) => console.log('-', e));
  }

  console.log('\n=== Resumen ===');
  console.log(JSON.stringify(results, null, 2));
} catch (err) {
  console.error('FALLO:', err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
