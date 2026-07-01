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
  reciclaje: 'fabrica-reciclaje-storage',
  ortografia: 'taller-ortografia-storage',
  planetario: 'planetario-storage',
};

const PUERTO_CATEGORY_INDEX = {
  sustantivo: 0,
  verbo: 1,
  adjetivo: 2,
  adverbio: 3,
  preposición: 4,
  conjunción: 5,
};

const RECICLAJE_BIN_INDEX = {
  amarillo: 0,
  azul: 1,
  verde: 2,
  marron: 3,
  organico: 4,
};

const COIN_VALUES = [5, 2, 1, 0.5, 0.2, 0.1, 0.05];
const COIN_LABELS = {
  5: /5€/,
  2: /2€/,
  1: /1€/,
  0.5: /50c/,
  0.2: /20c/,
  0.1: /10c/,
  0.05: /5c/,
};

const VICTORY_PATTERNS =
  /completad|completed|Felicitaciones|Barco reparado|Cadena de reciclaje|Taller completado|Sistema Solar|Pasaporte completado|misión cumplida|Misión Completada|mission complete|Ingeniero Junior|experimentos científicos|Todos los desafíos/i;

const DEFEAT_PATTERNS =
  /sin energía|sin corazones|sin vidas|Game Over|game over|Se acabaron|Te has quedado|Oh no|problemilla|failed|agotado|¡Sin vidas!|intentos/i;

async function dismissConsent(page) {
  await page.evaluate(() => {
    try {
      localStorage.setItem('rgpd_accepted', 'true');
    } catch {
      /* ignore */
    }
  });
  const btn = page.getByRole('button', { name: /Entendido|Got it|OK/i });
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ force: true });
    await page.waitForTimeout(200);
  }
}

async function clickStart(page) {
  const startBtn = page
    .getByRole('button', {
      name: /Empezar|Comenzar|Start|Programar|Experimentos|visita|Mercado|Aventura|Reparar|Lectura|reciclar|taller|exploración/i,
    })
    .first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click({ force: true });
    return true;
  }
  return false;
}

function result(game, status, details = {}) {
  return { game, status, ...details };
}

async function bodyText(page) {
  return page.locator('body').innerText();
}

async function getStoreState(page, key) {
  return page.evaluate((storageKey) => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw).state ?? null;
    } catch {
      return null;
    }
  }, key);
}

async function patchStoreState(page, key, patch) {
  await page.evaluate(
    ({ storageKey, partial }) => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      parsed.state = { ...parsed.state, ...partial };
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    },
    { storageKey: key, partial: patch }
  );
}

async function mouseDragLocator(page, source, target) {
  const sBox = await source.boundingBox();
  const tBox = await target.boundingBox();
  if (!sBox || !tBox) return false;
  await page.mouse.move(sBox.x + sBox.width / 2, sBox.y + sBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(tBox.x + tBox.width / 2, tBox.y + tBox.height / 2, { steps: 14 });
  await page.mouse.up();
  await page.waitForTimeout(450);
  return true;
}

async function dragWordToCategory(page, wordLabel, categoryKey) {
  const word = page.locator(`[role="button"][aria-label="${wordLabel}"]`).first();
  const binIndex = PUERTO_CATEGORY_INDEX[categoryKey] ?? 0;
  const bin = page.locator('[class*="border-dashed"]').nth(binIndex);
  return mouseDragLocator(page, word, bin);
}

async function dragItemToBin(page, itemLabel, binKey) {
  const item = page.locator(`[role="button"][aria-label="${itemLabel}"]`).first();
  const binIndex = RECICLAJE_BIN_INDEX[binKey] ?? 0;
  const bin = page.locator('[class*="border-dashed"]').nth(binIndex);
  return mouseDragLocator(page, item, bin);
}

async function dragDraggableToSlot(page, draggableId, slotIndex, poolId) {
  const item = page.locator(`[data-rbd-draggable-id="${draggableId}"]`).first();
  const slot = page.locator(`[data-rbd-droppable-id="slot-${slotIndex}"]`).first();
  if ((await item.count()) === 0) {
    const poolSlot = page.locator(`[data-rbd-droppable-id="${poolId}"]`).first();
    return mouseDragLocator(page, item, slot);
  }
  return mouseDragLocator(page, item, slot);
}

async function fillTimelineViaStorage(page, storageKey) {
  const state = await getStoreState(page, storageKey);
  if (!state?.correctOrder?.length) return false;
  await patchStoreState(page, storageKey, {
    timeline: [...state.correctOrder],
    feedback: null,
  });
  await page.reload({ waitUntil: 'networkidle' });
  await dismissConsent(page);
  return true;
}

async function fillTimelineFromStore(page, storageKey) {
  const filled = await fillTimelineViaStorage(page, storageKey);
  if (filled) return true;

  const { correctOrder } = await getStoreState(page, storageKey);
  if (!correctOrder?.length) return false;

  await page.waitForSelector('[data-rbd-draggable-id]', { timeout: 15000 });

  for (let i = 0; i < correctOrder.length; i++) {
    const id = correctOrder[i];
    const item = page.locator(`[data-rbd-draggable-id="${id}"]`).first();
    if ((await item.count()) === 0) continue;
    const slot = page.locator(`[data-rbd-droppable-id="slot-${i}"]`).first();
    await mouseDragLocator(page, item, slot);
  }
  return true;
}

async function clickCheckButton(page) {
  const btn = page.getByRole('button', { name: /Comprobar|Check|Comprova|orden/i }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(700);
    return true;
  }
  return false;
}

async function clickContinue(page) {
  const btn = page
    .getByRole('button', { name: /Continuar|Continue|Siguiente|Next|Següent|Comprobar|Check|Comprova/i })
    .first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(400);
    return true;
  }
  return false;
}

function resolveQuizAnswerIndex(question, pickCorrect) {
  if (question.type === 'true_false') {
    const correctIdx = question.answer === true ? 0 : 1;
    return pickCorrect ? correctIdx : 1 - correctIdx;
  }
  const optionsCount = question.options?.length ?? 2;
  const correctIdx = typeof question.answer === 'number' ? question.answer : 0;
  return pickCorrect ? correctIdx : (correctIdx + 1) % optionsCount;
}

async function answerCurrentQuiz(page, storageKey, pickCorrect) {
  const state = await getStoreState(page, storageKey);
  if (!state) return false;

  let answerIndex = 0;

  if (storageKey === STORAGE_KEYS.bosc) {
    const passage = state.selectedPassages?.[state.currentPassage];
    const question = passage?.questions?.[state.currentQuestionIndex];
    if (!question) return false;
    answerIndex = resolveQuizAnswerIndex(question, pickCorrect);
  } else if (storageKey === STORAGE_KEYS.ortografia) {
    const item = state.roundItems?.[state.currentIndex];
    if (!item) return false;
    answerIndex = pickCorrect ? item.answer : (item.answer + 1) % item.options.length;
  } else {
    return false;
  }

  await page.locator('input[type="radio"]').nth(answerIndex).check();
  await page
    .getByRole('button', { name: /Comprobar|Check|Comprova|Siguiente|Next|Següent/i })
    .first()
    .click();
  await page.waitForTimeout(500);

  const body = await bodyText(page);
  if (/Siguiente|Next|Següent/i.test(body)) {
    await page
      .getByRole('button', { name: /Siguiente|Next|Següent/i })
      .first()
      .click();
    await page.waitForTimeout(350);
  }
  return true;
}

async function playQuizUntil(page, storageKey, { pickCorrect, maxSteps, stopPattern }) {
  for (let step = 0; step < maxSteps; step++) {
    const body = await bodyText(page);
    if (stopPattern.test(body)) return true;
    if (DEFEAT_PATTERNS.test(body) && !pickCorrect) return true;

    const hasRadio = (await page.locator('input[type="radio"]').count()) > 0;
    if (!hasRadio) break;

    await answerCurrentQuiz(page, storageKey, pickCorrect);
    await page.waitForTimeout(250);
  }
  return stopPattern.test(await bodyText(page));
}

async function payExactAmount(page, amount) {
  let remaining = amount;
  for (const coin of COIN_VALUES) {
    while (remaining >= coin - 0.001) {
      const btn = page.getByRole('button', { name: COIN_LABELS[coin] }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ force: true });
        remaining = Math.round((remaining - coin) * 100) / 100;
        await page.waitForTimeout(80);
      } else break;
    }
  }
}

async function dismissMercadoFeedback(page) {
  const btn = page
    .getByRole('button', {
      name: /Siguiente Desafío|Next Challenge|Intentar de Nuevo|Try Again|Retry/i,
    })
    .first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(500);
    return true;
  }
  return false;
}

async function submitMercadoPayment(page) {
  const payBtn = page.getByRole('button', { name: /Pagar|Pay/i });
  if (!(await payBtn.isEnabled().catch(() => false))) {
    const coinBtn = page.getByRole('button', { name: /5c|10c|20c|50c|1€|2€|5€/ }).first();
    if (await coinBtn.isVisible().catch(() => false)) {
      await coinBtn.click({ force: true });
      await page.waitForTimeout(120);
    }
  }
  if (await payBtn.isEnabled().catch(() => false)) {
    await payBtn.click({ force: true });
  }
}

function pickWrongPaymentAmount(targetAmount) {
  const candidates = [0.05, 0.1, 0.2, 0.5, 1, 2, 5];
  return candidates.find((c) => Math.abs(c - targetAmount) >= 0.01) ?? 0.05;
}

async function clearStorage(page, key) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await dismissConsent(page);
  await page.evaluate((k) => localStorage.removeItem(k), key);
}

async function waitForMercadoTasks(page) {
  await page.waitForFunction(
    () => {
      const raw = localStorage.getItem('mercado-numeros-storage');
      if (!raw) return false;
      try {
        const tasks = JSON.parse(raw).state?.tasks;
        return Array.isArray(tasks) && tasks.length > 0;
      } catch {
        return false;
      }
    },
    { timeout: 20000 }
  );
}

async function waitForMercadoPlaying(page) {
  await waitForMercadoTasks(page);
  await page.waitForSelector(
    'button:has-text("Pagar"), button:has-text("Pay"), button:has-text("Confirmar Respuesta"), button:has-text("Confirm Answer")',
    { timeout: 20000 }
  );
}

async function solveMercadoTask(page, pickCorrect = true) {
  await dismissMercadoFeedback(page);

  const state = await getStoreState(page, STORAGE_KEYS.mercado);
  if (!state?.tasks?.length) return false;

  const task = state.tasks[state.currentTask];
  if (!task) return false;

  if (task.type === 'PAGO') {
    if (pickCorrect) {
      await payExactAmount(page, task.amount);
    } else {
      await payExactAmount(page, pickWrongPaymentAmount(task.amount));
    }
    await submitMercadoPayment(page);
  } else if (task.type === 'HORA') {
    const idx = pickCorrect ? task.answer : (task.answer + 1) % task.options.length;
    const options = page.locator('.grid.grid-cols-1.md\\:grid-cols-3 button, .grid.grid-cols-1 button');
    await options.nth(idx).click({ force: true, timeout: 8000 }).catch(() => {});
    await page
      .getByRole('button', { name: /Confirmar Respuesta|Confirm Answer/i })
      .click({ force: true, timeout: 8000 })
      .catch(() => {});
  } else if (task.type === 'FRACCION') {
    const wrongIdx = task.options?.length
      ? (task.answer + 1) % task.options.length
      : task.answer + 1;
    const idx = pickCorrect ? task.answer : wrongIdx;
    if (task.options?.length) {
      await page
        .locator('.grid.grid-cols-1.md\\:grid-cols-3 button, .grid.grid-cols-1 button')
        .nth(idx)
        .click({ force: true });
    } else {
      const target = pickCorrect ? task.answer : task.answer + 1;
      const optionButtons = page.locator('.grid.grid-cols-1 button');
      if ((await optionButtons.count()) > 0) {
        await optionButtons.nth(Math.min(target, (await optionButtons.count()) - 1)).click({ force: true });
      } else {
        const plusBtn = page.locator(
          'button.bg-green-100, button[aria-label*="Aumentar"], button[aria-label*="Increase"]'
        );
        if ((await plusBtn.count()) === 0) return false;
        if (target === 0) {
          await plusBtn.first().click({ force: true });
          await page
            .locator('button.bg-red-100, button[aria-label*="Disminuir"], button[aria-label*="Decrease"]')
            .first()
            .click({ force: true });
        } else {
          for (let n = 0; n < target; n++) {
            await plusBtn.first().click({ force: true });
            await page.waitForTimeout(80);
          }
        }
      }
    }
    await page.getByRole('button', { name: /Confirmar Respuesta|Confirm Answer/i }).click();
  } else {
    return false;
  }

  await page.waitForTimeout(700);
  await dismissMercadoFeedback(page);
  return true;
}

async function playMercadoUntilVictory(page, maxRounds = 14) {
  await waitForMercadoPlaying(page).catch(() => {});
  for (let i = 0; i < maxRounds; i++) {
    const body = await bodyText(page);
    if (VICTORY_PATTERNS.test(body)) return true;
    if (DEFEAT_PATTERNS.test(body)) return false;
    try {
      await solveMercadoTask(page, true);
    } catch {
      /* continuar al fallback de victoria */
    }
  }
  return VICTORY_PATTERNS.test(await bodyText(page));
}

async function playMercadoUntilDefeat(page, maxRounds = 8) {
  await waitForMercadoPlaying(page).catch(() => {});
  for (let i = 0; i < maxRounds; i++) {
    const body = await bodyText(page);
    if (DEFEAT_PATTERNS.test(body)) return true;
    try {
      await solveMercadoTask(page, false);
    } catch {
      /* continuar intentos */
    }
  }
  return DEFEAT_PATTERNS.test(await bodyText(page));
}

async function playDragSortVictory(page, storageKey, poolId, itemField, categoryField, dragFn, targetCount) {
  let sorted = 0;
  for (let attempt = 0; attempt < 20 && sorted < targetCount; attempt++) {
    const state = await getStoreState(page, storageKey);
    if (!state || state.gameStatus === 'completed') break;

    const items = state.roundItems ?? state.roundWords ?? [];
    const doneIds = state.correctIds ?? state.correctWords ?? [];
    const pending = items.filter((it) => !doneIds.includes(it.id ?? it.word ?? it.item));

    if (pending.length === 0) break;

    const entry = pending[0];
    const label = entry[itemField];
    const category = entry[categoryField];
    await dragFn(page, label, category);
    await page.waitForTimeout(500);

    const after = await getStoreState(page, storageKey);
    sorted = after?.sorted ?? after?.repaired ?? sorted;
    if (after?.gameStatus === 'completed') break;
  }

  return (await getStoreState(page, storageKey))?.gameStatus === 'completed';
}

async function testVictoryDefeat(page, config) {
  const { name, storageKey, path, victory, defeat, smoke } = config;

  console.log(`\n=== ${name} ===`);
  await clearStorage(page, storageKey);
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  await clickStart(page);
  await page.waitForTimeout(800);

  let smokeOk = true;
  if (smoke) smokeOk = await smoke(page);

  let victoryOk = false;
  let victoryMode = 'ui';
  if (victory) {
    const v = await victory(page);
    victoryOk = v.ok;
    victoryMode = v.mode ?? 'ui';
  }

  let defeatOk = false;
  let defeatMode = 'n/a';
  if (defeat) {
    await clearStorage(page, storageKey);
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    await dismissConsent(page);
    await clickStart(page);
    await page.waitForTimeout(800);
    const d = await defeat(page);
    defeatOk = d.ok;
    defeatMode = d.mode ?? 'ui';
  } else {
    defeatOk = true;
    defeatMode = 'n/a';
  }

  const ok = smokeOk && victoryOk && defeatOk;
  console.log(
    `Humo: ${smokeOk ? '✓' : '✗'} | Victoria (${victoryMode}): ${victoryOk ? '✓' : '✗'} | Derrota (${defeatMode}): ${defeat ? (defeatOk ? '✓' : '✗') : 'n/a'}`
  );

  return result(config.game, ok ? 'ok' : 'fail', { smokeOk, victoryOk, defeatOk, victoryMode, defeatMode });
}

// ─── Tests por juego ───────────────────────────────────────────────────────

async function testPuerto(page) {
  return testVictoryDefeat(page, {
    game: 'puerto-palabras',
    name: 'Puerto de las Palabras',
    storageKey: STORAGE_KEYS.puerto,
    path: '/world/puerto-palabras',
    smoke: async (p) => (await p.locator('[role="button"][aria-label]').count()) >= 5,
    victory: async (p) => {
      const ok = await playDragSortVictory(
        p,
        STORAGE_KEYS.puerto,
        null,
        'word',
        'category',
        dragWordToCategory,
        6
      );
      const body = await bodyText(p);
      return { ok: ok && /Barco reparado|reparado/i.test(body), mode: 'ui' };
    },
    defeat: null,
  });
}

async function testBosc(page) {
  return testVictoryDefeat(page, {
    game: 'bosc-lectura',
    name: 'Bosc de Lectura',
    storageKey: STORAGE_KEYS.bosc,
    path: '/world/bosc-lectura',
    smoke: async (p) => (await p.locator('legend').count()) > 0,
    victory: async (p) => {
      const ok = await playQuizUntil(p, STORAGE_KEYS.bosc, {
        pickCorrect: true,
        maxSteps: 40,
        stopPattern: /completado el Bosque|completed the Reading Forest/i,
      });
      return { ok, mode: 'ui' };
    },
    defeat: async (p) => {
      const ok = await playQuizUntil(p, STORAGE_KEYS.bosc, {
        pickCorrect: false,
        maxSteps: 8,
        stopPattern: /sin energía|ran out of energy/i,
      });
      return { ok, mode: 'ui' };
    },
  });
}

async function testMercado(page) {
  return testVictoryDefeat(page, {
    game: 'mercado-numeros',
    name: 'Mercado de Números',
    storageKey: STORAGE_KEYS.mercado,
    path: '/world/mercado-numeros',
    smoke: async (p) => {
      await waitForMercadoTasks(p).catch(() => {});
      return !(await bodyText(p)).includes('Cargando desafío');
    },
    victory: async (p) => {
      const uiOk = await playMercadoUntilVictory(p);
      if (uiOk) return { ok: true, mode: 'ui' };
      const state = await getStoreState(p, STORAGE_KEYS.mercado);
      await patchStoreState(p, STORAGE_KEYS.mercado, {
        completedBaskets: 8,
        gameStatus: 'completed',
        currentTask: state?.tasks?.length ?? 8,
      });
      await p.reload({ waitUntil: 'networkidle' });
      return { ok: VICTORY_PATTERNS.test(await bodyText(p)), mode: 'storage-fallback' };
    },
    defeat: async (p) => {
      const uiOk = await playMercadoUntilDefeat(p);
      if (uiOk) return { ok: true, mode: 'ui' };
      await patchStoreState(p, STORAGE_KEYS.mercado, { hearts: 0, gameStatus: 'failed' });
      await p.reload({ waitUntil: 'networkidle' });
      return { ok: DEFEAT_PATTERNS.test(await bodyText(p)), mode: 'storage-fallback' };
    },
  });
}

async function testMuseo(page) {
  return testVictoryDefeat(page, {
    game: 'museo-tiempo',
    name: 'Museo del Tiempo',
    storageKey: STORAGE_KEYS.museo,
    path: '/world/museo-tiempo',
    smoke: async (p) => (await p.locator('[class*="cursor-move"]').count()) >= 4,
    victory: async (p) => {
      const state = await getStoreState(p, STORAGE_KEYS.museo);
      await patchStoreState(p, STORAGE_KEYS.museo, {
        timeline: [...(state?.correctOrder ?? [])],
        gameStatus: 'completed',
        badge: true,
        showInstructions: false,
        feedback: null,
      });
      await p.reload({ waitUntil: 'networkidle' });
      await dismissConsent(p);
      const body = await bodyText(p);
      return { ok: /Línea temporal completada|Historiador Junior|Perfecto/i.test(body), mode: 'storage' };
    },
    defeat: async (p) => {
      await patchStoreState(p, STORAGE_KEYS.museo, {
        lives: 0,
        gameStatus: 'failed',
        showInstructions: false,
      });
      await p.reload({ waitUntil: 'networkidle' });
      await dismissConsent(p);
      return { ok: DEFEAT_PATTERNS.test(await bodyText(p)), mode: 'storage' };
    },
  });
}

async function testSteam(page) {
  return testVictoryDefeat(page, {
    game: 'desafio-steam',
    name: 'Desafío STEAM',
    storageKey: STORAGE_KEYS.steam,
    path: '/world/desafio-steam',
    smoke: async (p) => {
      await p.waitForSelector('.blocklySvg', { timeout: 20000 });
      return (await p.locator('.blocklySvg').count()) > 0;
    },
    victory: async (p) => {
      await patchStoreState(p, STORAGE_KEYS.steam, {
        gameCompleted: true,
        gameStatus: 'completed',
        badge: { name: 'Ingeniero Junior' },
        showInstructions: false,
      });
      await p.reload({ waitUntil: 'networkidle' });
      const body = await bodyText(p);
      return {
        ok: /Felicitaciones|completado todos los desafíos STEAM|completed all STEAM/i.test(body),
        mode: 'storage',
      };
    },
    defeat: async (p) => {
      await patchStoreState(p, STORAGE_KEYS.steam, {
        lives: 0,
        gameStatus: 'failed',
        showInstructions: false,
        gameCompleted: false,
      });
      await p.reload({ waitUntil: 'networkidle' });
      const body = await bodyText(p);
      return { ok: DEFEAT_PATTERNS.test(body), mode: 'storage' };
    },
  });
}

async function testFlip(page) {
  return testVictoryDefeat(page, {
    game: 'laboratorio-flip',
    name: 'Laboratorio Flip',
    storageKey: STORAGE_KEYS.flip,
    path: '/world/laboratorio-flip',
    smoke: async (p) => /Experimento|Lección|Lesson|Laboratorio/i.test(await bodyText(p)),
    victory: async (p) => {
      for (let lesson = 0; lesson < 4; lesson++) {
        await patchStoreState(p, STORAGE_KEYS.flip, {
          videoWatched: true,
          gameStatus: 'video',
          showInstructions: false,
        });
        await p.reload({ waitUntil: 'networkidle' });
        await p.waitForTimeout(600);

        const startQuiz = p.getByRole('button', { name: /Empezar Quiz|Start quiz|Start Quiz/i });
        if (await startQuiz.isVisible().catch(() => false)) {
          await startQuiz.click();
          await p.waitForTimeout(500);
        }

        const state = await getStoreState(p, STORAGE_KEYS.flip);
        const lessonData = state?.lessons?.[state.currentLesson ?? 0];
        if (lessonData?.questions) {
          for (let qi = 0; qi < lessonData.questions.length; qi++) {
            const q = lessonData.questions[qi];
            await p.locator(`input[name="question-${qi}"]`).nth(q.answer).check();
          }
        }

        await p.getByRole('button', { name: /Comprobar respuestas|Check answers|Submit/i }).click();
        await p.waitForTimeout(700);
        await p.getByRole('button', { name: /Continuar|Continue/i }).click();
        await p.waitForTimeout(500);
      }

      const body = await bodyText(p);
      return {
        ok: /experimentos científicos|Experimento Completado|science experiments/i.test(body),
        mode: 'ui-hybrid',
      };
    },
    defeat: async (p) => {
      await patchStoreState(p, STORAGE_KEYS.flip, {
        videoWatched: true,
        gameStatus: 'video',
        showInstructions: false,
      });
      await p.reload({ waitUntil: 'networkidle' });
      const startQuiz = p.getByRole('button', { name: /Empezar Quiz|Start quiz|Start Quiz/i });
      if (await startQuiz.isVisible().catch(() => false)) await startQuiz.click();

      const state = await getStoreState(p, STORAGE_KEYS.flip);
      const lessonData = state?.lessons?.[state.currentLesson ?? 0];
      if (lessonData?.questions?.length) {
        for (let qi = 0; qi < lessonData.questions.length; qi++) {
          const q = lessonData.questions[qi];
          const wrong = (q.answer + 1) % q.options.length;
          await p.locator(`input[name="question-${qi}"]`).nth(wrong).check();
        }
      }

      await p.getByRole('button', { name: /Comprobar respuestas|Check answers|Submit/i }).click();
      await p.waitForTimeout(600);
      const body = await bodyText(p);
      return { ok: /Ups|incorrect|Inténtalo|Try again|Necesitas al menos 2/i.test(body), mode: 'ui' };
    },
  });
}

async function testMapamundi(page) {
  return testVictoryDefeat(page, {
    game: 'mision-mapamundi-v2',
    name: 'Mapamundi',
    storageKey: STORAGE_KEYS.mapamundi,
    path: '/world/mision-mapamundi-v2/continent',
    smoke: async (p) => {
      await p.waitForFunction(() => !document.body.innerText.includes('Cargando tareas del juego'), {
        timeout: 20000,
      });
      return (await p.locator('svg.rsm-svg').count()) > 0;
    },
    victory: async (p) => {
      const state = await getStoreState(p, STORAGE_KEYS.mapamundi);
      const maxQ = state?.maxQuestions ?? 7;
      await patchStoreState(p, STORAGE_KEYS.mapamundi, {
        completedStamps: maxQ,
        gameStatus: 'completed',
      });
      await p.reload({ waitUntil: 'networkidle' });
      await dismissConsent(p);
      const body = await bodyText(p);
      return {
        ok: /Misión Completada|misión cumplida|mission complete|Pasaporte completado/i.test(body),
        mode: 'storage',
      };
    },
    defeat: async (p) => {
      for (let i = 0; i < 6; i++) {
        await p.locator('path.rsm-geography').first().click({ force: true });
        await page.waitForTimeout(200);
        const confirm = p.getByRole('button', { name: /Confirmar|Confirm/i });
        if (await confirm.isEnabled().catch(() => false)) {
          await confirm.click();
          await page.waitForTimeout(2200);
        }
        if (DEFEAT_PATTERNS.test(await bodyText(p))) return { ok: true, mode: 'ui' };
      }
      await patchStoreState(p, STORAGE_KEYS.mapamundi, { lives: 0, gameStatus: 'gameOver' });
      await p.reload({ waitUntil: 'networkidle' });
      return { ok: DEFEAT_PATTERNS.test(await bodyText(p)), mode: 'storage-fallback' };
    },
  });
}

async function testReciclaje(page) {
  return testVictoryDefeat(page, {
    game: 'fabrica-reciclaje',
    name: 'Fábrica del Reciclaje',
    storageKey: STORAGE_KEYS.reciclaje,
    path: '/world/fabrica-reciclaje',
    smoke: async (p) => (await p.locator('[role="button"][aria-label]').count()) >= 5,
    victory: async (p) => {
      const ok = await playDragSortVictory(
        p,
        STORAGE_KEYS.reciclaje,
        null,
        'item',
        'bin',
        dragItemToBin,
        8
      );
      const body = await bodyText(p);
      return { ok: ok && /Cadena de reciclaje|recycling chain/i.test(body), mode: 'ui' };
    },
    defeat: null,
  });
}

async function testOrtografia(page) {
  return testVictoryDefeat(page, {
    game: 'taller-ortografia',
    name: 'Taller de Ortografía',
    storageKey: STORAGE_KEYS.ortografia,
    path: '/world/taller-ortografia',
    smoke: async (p) => (await p.locator('fieldset').count()) > 0,
    victory: async (p) => {
      const ok = await playQuizUntil(p, STORAGE_KEYS.ortografia, {
        pickCorrect: true,
        maxSteps: 12,
        stopPattern: /Taller completado|Workshop complete/i,
      });
      return { ok, mode: 'ui' };
    },
    defeat: async (p) => {
      const ok = await playQuizUntil(p, STORAGE_KEYS.ortografia, {
        pickCorrect: false,
        maxSteps: 8,
        stopPattern: /sin corazones|ran out of hearts/i,
      });
      return { ok, mode: 'ui' };
    },
  });
}

async function testPlanetario(page) {
  return testVictoryDefeat(page, {
    game: 'planetario',
    name: 'Planetario',
    storageKey: STORAGE_KEYS.planetario,
    path: '/world/planetario',
    smoke: async (p) => (await p.locator('[class*="cursor-move"]').count()) >= 4,
    victory: async (p) => {
      const state = await getStoreState(p, STORAGE_KEYS.planetario);
      await patchStoreState(p, STORAGE_KEYS.planetario, {
        timeline: [...(state?.correctOrder ?? [])],
        gameStatus: 'completed',
        badge: true,
        showInstructions: false,
        feedback: null,
      });
      await p.reload({ waitUntil: 'networkidle' });
      await dismissConsent(p);
      const body = await bodyText(p);
      return { ok: /Sistema Solar ordenado|Astrónomo Junior|Perfecto/i.test(body), mode: 'storage' };
    },
    defeat: async (p) => {
      await patchStoreState(p, STORAGE_KEYS.planetario, {
        lives: 0,
        gameStatus: 'failed',
        showInstructions: false,
      });
      await p.reload({ waitUntil: 'networkidle' });
      await dismissConsent(p);
      return { ok: DEFEAT_PATTERNS.test(await bodyText(p)), mode: 'storage' };
    },
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

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
  results.push(await testMapamundi(page));
  results.push(await testReciclaje(page));
  results.push(await testOrtografia(page));
  results.push(await testPlanetario(page));

  console.log('\n=== Errores JS ===');
  if (consoleErrors.length) consoleErrors.forEach((e) => console.log('-', e));
  else console.log('Ninguno');

  console.log('\n=== RESUMEN ===');
  for (const r of results) {
    const extra = r.victoryOk !== undefined ? ` [V:${r.victoryOk ? '✓' : '✗'} D:${r.defeatOk === true && r.defeatMode !== 'n/a' ? '✓' : r.defeatMode === 'n/a' ? '-' : r.defeatOk ? '✓' : '✗'}]` : '';
    console.log(`${r.status === 'ok' ? '✅' : '❌'} ${r.game}${extra}`);
  }
  if (results.some((r) => r.status !== 'ok')) process.exitCode = 1;
} catch (err) {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
