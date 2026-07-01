#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { flipLessonTranslations } from './flip-lesson-translations.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../src/app/data/locales');

const esMercado = JSON.parse(
  fs.readFileSync(path.join(DATA, 'es/mercado-tasks.json'), 'utf8')
);
const esFlip = JSON.parse(
  fs.readFileSync(path.join(DATA, 'es/flip-lessons.json'), 'utf8')
);

/** @type {Record<string, { ca: string; en: string }>} */
const mercadoStrings = {
  // PAGO statements
  'Paga exactamente €3,65 por una barra de pan y un zumo.': {
    ca: 'Paga exactament €3,65 per una barra de pa i un suc.',
    en: 'Pay exactly €3.65 for a loaf of bread and a juice.',
  },
  'Compra leche por €1,85. ¿Cómo puedes pagarlo?': {
    ca: 'Compra llet per €1,85. Com el pots pagar?',
    en: 'Buy milk for €1.85. How can you pay for it?',
  },
  'El precio de unas manzanas es €2,40.': {
    ca: 'El preu d\'unes pomes és €2,40.',
    en: 'The price of some apples is €2.40.',
  },
  'Paga €5,20 por un bocadillo.': {
    ca: 'Paga €5,20 per un entrepà.',
    en: 'Pay €5.20 for a sandwich.',
  },
  'Una botella de agua cuesta €0,75.': {
    ca: 'Una ampolla d\'aigua costa €0,75.',
    en: 'A bottle of water costs €0.75.',
  },
  'Compra chocolate por €4,15.': {
    ca: 'Compra xocolata per €4,15.',
    en: 'Buy chocolate for €4.15.',
  },
  'El yogur cuesta €1,20.': {
    ca: 'El iogurt costa €1,20.',
    en: 'The yogurt costs €1.20.',
  },
  'Paga €6,50 por queso.': {
    ca: 'Paga €6,50 per formatge.',
    en: 'Pay €6.50 for cheese.',
  },
  'Las galletas cuestan €2,95.': {
    ca: 'Les galetes costen €2,95.',
    en: 'The cookies cost €2.95.',
  },
  'Compra fruta por €3,30.': {
    ca: 'Compra fruita per €3,30.',
    en: 'Buy fruit for €3.30.',
  },
  'El jamón cuesta €7,85.': {
    ca: 'El pernil costa €7,85.',
    en: 'The ham costs €7.85.',
  },
  'Paga €1,55 por caramelos.': {
    ca: 'Paga €1,55 per caramels.',
    en: 'Pay €1.55 for candies.',
  },
  'Las patatas cuestan €2,10.': {
    ca: 'Les patates costen €2,10.',
    en: 'The potatoes cost €2.10.',
  },
  'Compra aceite por €4,75.': {
    ca: 'Compra oli per €4,75.',
    en: 'Buy oil for €4.75.',
  },
  'El arroz cuesta €1,35.': {
    ca: 'L\'arròs costa €1,35.',
    en: 'The rice costs €1.35.',
  },
  'Paga €8,25 por carne.': {
    ca: 'Paga €8,25 per carn.',
    en: 'Pay €8.25 for meat.',
  },
  'Las cerezas cuestan €3,05.': {
    ca: 'Les cireres costen €3,05.',
    en: 'The cherries cost €3.05.',
  },
  'Compra pasta por €1,90.': {
    ca: 'Compra pasta per €1,90.',
    en: 'Buy pasta for €1.90.',
  },
  'Compra sardinas por €5,75.': {
    ca: 'Compra sardines per €5,75.',
    en: 'Buy sardines for €5.75.',
  },
  'El atún cuesta €6,90.': {
    ca: 'El tonyina costa €6,90.',
    en: 'The tuna costs €6.90.',
  },
  'Paga €4,05 por tomates.': {
    ca: 'Paga €4,05 per tomàquets.',
    en: 'Pay €4.05 for tomatoes.',
  },
  'Las peras cuestan €3,80.': {
    ca: 'Les peres costen €3,80.',
    en: 'The pears cost €3.80.',
  },
  'Compra lechuga por €1,45.': {
    ca: 'Compra enciam per €1,45.',
    en: 'Buy lettuce for €1.45.',
  },
  'El salmón cuesta €9,15.': {
    ca: 'El salmó costa €9,15.',
    en: 'The salmon costs €9.15.',
  },
  'Paga €2,65 por zanahorias.': {
    ca: 'Paga €2,65 per pastanagues.',
    en: 'Pay €2.65 for carrots.',
  },
  'Las naranjas cuestan €4,20.': {
    ca: 'Les taronges costen €4,20.',
    en: 'The oranges cost €4.20.',
  },
  'Compra merluza por €7,35.': {
    ca: 'Compra lluc per €7,35.',
    en: 'Buy hake for €7.35.',
  },
  'El apio cuesta €1,25.': {
    ca: 'L\'api costa €1,25.',
    en: 'The celery costs €1.25.',
  },
  'Paga €5,60 por pollo.': {
    ca: 'Paga €5,60 per pollastre.',
    en: 'Pay €5.60 for chicken.',
  },
  'Las cebollas cuestan €0,95.': {
    ca: 'Les cebes costen €0,95.',
    en: 'The onions cost €0.95.',
  },
  'Compra plátanos por €2,85.': {
    ca: 'Compra plàtans per €2,85.',
    en: 'Buy bananas for €2.85.',
  },
  'El bacalao cuesta €8,70.': {
    ca: 'El bacallà costa €8,70.',
    en: 'The cod costs €8.70.',
  },
  'Paga €3,15 por pepinos.': {
    ca: 'Paga €3,15 per cogombres.',
    en: 'Pay €3.15 for cucumbers.',
  },
  'Las uvas cuestan €6,45.': {
    ca: 'Les raïms costen €6,45.',
    en: 'The grapes cost €6.45.',
  },
  // PAGO explanations
  '3 € (billete) + 50 c + 10 c + 5 c.': {
    ca: '3 € (bitllet) + 50 c + 10 c + 5 c.',
    en: '3 € (bill) + 50 c + 10 c + 5 c.',
  },
  '1 € + 50 c + 20 c + 10 c + 5 c.': {
    ca: '1 € + 50 c + 20 c + 10 c + 5 c.',
    en: '1 € + 50 c + 20 c + 10 c + 5 c.',
  },
  '2 € + 20 c + 20 c.': {
    ca: '2 € + 20 c + 20 c.',
    en: '2 € + 20 c + 20 c.',
  },
  '5 € + 20 c.': { ca: '5 € + 20 c.', en: '5 € + 20 c.' },
  '50 c + 20 c + 5 c.': { ca: '50 c + 20 c + 5 c.', en: '50 c + 20 c + 5 c.' },
  '2 € + 2 € + 10 c + 5 c.': { ca: '2 € + 2 € + 10 c + 5 c.', en: '2 € + 2 € + 10 c + 5 c.' },
  '1 € + 20 c.': { ca: '1 € + 20 c.', en: '1 € + 20 c.' },
  '5 € + 1 € + 50 c.': { ca: '5 € + 1 € + 50 c.', en: '5 € + 1 € + 50 c.' },
  '2 € + 50 c + 20 c + 20 c + 5 c.': { ca: '2 € + 50 c + 20 c + 20 c + 5 c.', en: '2 € + 50 c + 20 c + 20 c + 5 c.' },
  '2 € + 1 € + 20 c + 10 c.': { ca: '2 € + 1 € + 20 c + 10 c.', en: '2 € + 1 € + 20 c + 10 c.' },
  '5 € + 2 € + 50 c + 20 c + 10 c + 5 c.': { ca: '5 € + 2 € + 50 c + 20 c + 10 c + 5 c.', en: '5 € + 2 € + 50 c + 20 c + 10 c + 5 c.' },
  '1 € + 50 c + 5 c.': { ca: '1 € + 50 c + 5 c.', en: '1 € + 50 c + 5 c.' },
  '2 € + 10 c.': { ca: '2 € + 10 c.', en: '2 € + 10 c.' },
  '2 € + 2 € + 50 c + 20 c + 5 c.': { ca: '2 € + 2 € + 50 c + 20 c + 5 c.', en: '2 € + 2 € + 50 c + 20 c + 5 c.' },
  '1 € + 20 c + 10 c + 5 c.': { ca: '1 € + 20 c + 10 c + 5 c.', en: '1 € + 20 c + 10 c + 5 c.' },
  '5 € + 2 € + 1 € + 20 c + 5 c.': { ca: '5 € + 2 € + 1 € + 20 c + 5 c.', en: '5 € + 2 € + 1 € + 20 c + 5 c.' },
  '2 € + 1 € + 5 c.': { ca: '2 € + 1 € + 5 c.', en: '2 € + 1 € + 5 c.' },
  '1 € + 50 c + 20 c + 20 c.': { ca: '1 € + 50 c + 20 c + 20 c.', en: '1 € + 50 c + 20 c + 20 c.' },
  '5 € + 50 c + 20 c + 5 c.': { ca: '5 € + 50 c + 20 c + 5 c.', en: '5 € + 50 c + 20 c + 5 c.' },
  '5 € + 1 € + 50 c + 20 c + 20 c.': { ca: '5 € + 1 € + 50 c + 20 c + 20 c.', en: '5 € + 1 € + 50 c + 20 c + 20 c.' },
  '2 € + 2 € + 5 c.': { ca: '2 € + 2 € + 5 c.', en: '2 € + 2 € + 5 c.' },
  '2 € + 1 € + 50 c + 20 c + 10 c.': { ca: '2 € + 1 € + 50 c + 20 c + 10 c.', en: '2 € + 1 € + 50 c + 20 c + 10 c.' },
  '1 € + 20 c + 20 c + 5 c.': { ca: '1 € + 20 c + 20 c + 5 c.', en: '1 € + 20 c + 20 c + 5 c.' },
  '5 € + 2 € + 2 € + 10 c + 5 c.': { ca: '5 € + 2 € + 2 € + 10 c + 5 c.', en: '5 € + 2 € + 2 € + 10 c + 5 c.' },
  '2 € + 50 c + 10 c + 5 c.': { ca: '2 € + 50 c + 10 c + 5 c.', en: '2 € + 50 c + 10 c + 5 c.' },
  '2 € + 2 € + 20 c.': { ca: '2 € + 2 € + 20 c.', en: '2 € + 2 € + 20 c.' },
  '5 € + 2 € + 20 c + 10 c + 5 c.': { ca: '5 € + 2 € + 20 c + 10 c + 5 c.', en: '5 € + 2 € + 20 c + 10 c + 5 c.' },
  '1 € + 20 c + 5 c.': { ca: '1 € + 20 c + 5 c.', en: '1 € + 20 c + 5 c.' },
  '5 € + 50 c + 10 c.': { ca: '5 € + 50 c + 10 c.', en: '5 € + 50 c + 10 c.' },
  '50 c + 20 c + 20 c + 5 c.': { ca: '50 c + 20 c + 20 c + 5 c.', en: '50 c + 20 c + 20 c + 5 c.' },
  '5 € + 2 € + 1 € + 50 c + 20 c.': { ca: '5 € + 2 € + 1 € + 50 c + 20 c.', en: '5 € + 2 € + 1 € + 50 c + 20 c.' },
  '2 € + 1 € + 10 c + 5 c.': { ca: '2 € + 1 € + 10 c + 5 c.', en: '2 € + 1 € + 10 c + 5 c.' },
  '5 € + 1 € + 20 c + 20 c + 5 c.': { ca: '5 € + 1 € + 20 c + 20 c + 5 c.', en: '5 € + 1 € + 20 c + 20 c + 5 c.' },
};

function translateDurationText(text, lang) {
  if (lang === 'ca') {
    return text
      .replace(/horas y/g, 'hores i')
      .replace(/hora y/g, 'hora i')
      .replace(/minutos/g, 'minuts')
      .replace(/(\d+) hora/g, '$1 hora');
  }
  return text
    .replace(/(\d+) horas y (\d+) minutos/g, '$1 hours and $2 minutes')
    .replace(/(\d+) hora y (\d+) minutos/g, '$1 hour and $2 minutes')
    .replace(/(\d+) minutos/g, '$1 minutes')
    .replace(/(\d+) min\b/g, '$1 min');
}

function translateHoraStatement(statement, lang) {
  const m1 = statement.match(
    /^Son las (\d{1,2}:\d{2}) y la tienda cierra a las (\d{1,2}:\d{2})\. ¿Cuánto falta\?$/
  );
  if (m1) {
    if (lang === 'ca') {
      return `Són les ${m1[1]} i la botiga tanca a les ${m1[2]}. Quant falta?`;
    }
    return `It is ${m1[1]} and the shop closes at ${m1[2]}. How much time is left?`;
  }
  const m2 = statement.match(
    /^Son las (\d{1,2}:\d{2}) y cierran a las (\d{1,2}:\d{2})\. ¿Cuánto tiempo queda\?$/
  );
  if (m2) {
    if (lang === 'ca') {
      return `Són les ${m2[1]} i tanquen a les ${m2[2]}. Quant de temps queda?`;
    }
    return `It is ${m2[1]} and they close at ${m2[2]}. How much time is left?`;
  }
  throw new Error(`Unhandled HORA statement: ${statement}`);
}

function translateHoraExplanation(explanation, lang) {
  const m = explanation.match(/^De (\d{1,2}:\d{2}) a (\d{1,2}:\d{2}) hay (.+)\.$/);
  if (!m) throw new Error(`Unhandled HORA explanation: ${explanation}`);
  const duration = translateDurationText(m[3], lang);
  if (lang === 'ca') return `De ${m[1]} a ${m[2]} hi ha ${duration}.`;
  return `From ${m[1]} to ${m[2]} there is ${duration}.`;
}

/** @type {Record<string, { ca: string; en: string }>} */
const fraccionStrings = {
  'Necesitas 3/4 kg de azúcar. Si cada bolsa pesa 1/4 kg, ¿cuántas bolsas compras?': {
    ca: 'Necessites 3/4 kg de sucre. Si cada bossa pesa 1/4 kg, quantes bosses compres?',
    en: 'You need 3/4 kg of sugar. If each bag weighs 1/4 kg, how many bags do you buy?',
  },
  '3 bolsas de 1/4 kg suman 3/4 kg.': {
    ca: '3 bosses d\'1/4 kg sumen 3/4 kg.',
    en: '3 bags of 1/4 kg add up to 3/4 kg.',
  },
  'Quieres comprar 1/2 kg de harina. Las bolsas son de 1/4 kg. ¿Cuántas necesitas?': {
    ca: 'Vols comprar 1/2 kg de farina. Les bosses són d\'1/4 kg. Quant en necessites?',
    en: 'You want to buy 1/2 kg of flour. The bags are 1/4 kg each. How many do you need?',
  },
  '2 bolsas de 1/4 kg suman 1/2 kg.': {
    ca: '2 bosses d\'1/4 kg sumen 1/2 kg.',
    en: '2 bags of 1/4 kg add up to 1/2 kg.',
  },
  'Una pizza se divide en 8 trozos iguales. Te comes 3 trozos. ¿Qué fracción comiste?': {
    ca: 'Una pizza es divideix en 8 trossos iguals. Et menges 3 trossos. Quina fracció has menjat?',
    en: 'A pizza is divided into 8 equal slices. You eat 3 slices. What fraction did you eat?',
  },
  '3 trozos de 8 es 3/8 de la pizza.': {
    ca: '3 trossos de 8 són 3/8 de la pizza.',
    en: '3 slices out of 8 is 3/8 of the pizza.',
  },
  'Necesitas 1 kg de arroz. Las bolsas son de 1/2 kg. ¿Cuántas bolsas compras?': {
    ca: 'Necessites 1 kg d\'arròs. Les bosses són d\'1/2 kg. Quantes bosses compres?',
    en: 'You need 1 kg of rice. The bags are 1/2 kg each. How many bags do you buy?',
  },
  '2 bolsas de 1/2 kg suman 1 kg completo.': {
    ca: '2 bosses d\'1/2 kg sumen 1 kg complet.',
    en: '2 bags of 1/2 kg add up to 1 full kg.',
  },
  'Un pastel se corta en 4 partes iguales. Te comes 1 parte. ¿Qué fracción queda?': {
    ca: 'Un pastís es talla en 4 parts iguals. Et menges 1 part. Quina fracció queda?',
    en: 'A cake is cut into 4 equal parts. You eat 1 part. What fraction is left?',
  },
  'Si comes 1/4, quedan 3/4 del pastel.': {
    ca: 'Si et menges 1/4, queden 3/4 del pastís.',
    en: 'If you eat 1/4, 3/4 of the cake remains.',
  },
  'Quieres 3/8 kg de queso. Las porciones son de 1/8 kg. ¿Cuántas porciones necesitas?': {
    ca: 'Vols 3/8 kg de formatge. Les porcions són d\'1/8 kg. Quantes porcions necessites?',
    en: 'You want 3/8 kg of cheese. The portions are 1/8 kg each. How many portions do you need?',
  },
  '3 porciones de 1/8 kg suman 3/8 kg.': {
    ca: '3 porcions d\'1/8 kg sumen 3/8 kg.',
    en: '3 portions of 1/8 kg add up to 3/8 kg.',
  },
  'Una chocolatina tiene 8 cuadraditos. Te comes la mitad. ¿Cuántos cuadraditos comiste?': {
    ca: 'Una xocolata té 8 quadrats. Et menges la meitat. Quants quadrats has menjat?',
    en: 'A chocolate bar has 8 squares. You eat half. How many squares did you eat?',
  },
  'La mitad de 8 cuadraditos son 4 cuadraditos.': {
    ca: 'La meitat de 8 quadrats són 4 quadrats.',
    en: 'Half of 8 squares is 4 squares.',
  },
  'Necesitas 1/4 kg de jamón. Las lonchas pesan 1/8 kg cada una. ¿Cuántas lonchas compras?': {
    ca: 'Necessites 1/4 kg de pernil. Les llesques pesen 1/8 kg cadascuna. Quantes llesques compres?',
    en: 'You need 1/4 kg of ham. Each slice weighs 1/8 kg. How many slices do you buy?',
  },
  '2 lonchas de 1/8 kg suman 1/4 kg.': {
    ca: '2 llesques d\'1/8 kg sumen 1/4 kg.',
    en: '2 slices of 1/8 kg add up to 1/4 kg.',
  },
  'Una tableta de chocolate tiene 12 trozos. Te comes 1/4 de la tableta. ¿Cuántos trozos comiste?': {
    ca: 'Una tableta de xocolata té 12 trossos. Et menges 1/4 de la tableta. Quants trossos has menjat?',
    en: 'A chocolate bar has 12 pieces. You eat 1/4 of the bar. How many pieces did you eat?',
  },
  '1/4 de 12 trozos son 3 trozos.': {
    ca: '1/4 de 12 trossos són 3 trossos.',
    en: '1/4 of 12 pieces is 3 pieces.',
  },
  'Compras 1/2 docena de huevos. ¿Cuántos huevos son?': {
    ca: 'Compres 1/2 dotzena d\'ous. Quants ous són?',
    en: 'You buy 1/2 dozen eggs. How many eggs is that?',
  },
  '1/2 de 12 huevos (una docena) son 6 huevos.': {
    ca: '1/2 de 12 ous (una dotzena) són 6 ous.',
    en: '1/2 of 12 eggs (one dozen) is 6 eggs.',
  },
  'Una barra de pan se corta en 8 rebanadas. Usas 1/2 de la barra. ¿Cuántas rebanadas usaste?': {
    ca: 'Una barra de pa es talla en 8 llesques. Fas servir 1/2 de la barra. Quantes llesques has fet servir?',
    en: 'A loaf of bread is cut into 8 slices. You use 1/2 of the loaf. How many slices did you use?',
  },
  '1/2 de 8 rebanadas son 4 rebanadas.': {
    ca: '1/2 de 8 llesques són 4 llesques.',
    en: '1/2 of 8 slices is 4 slices.',
  },
  'Quieres 5/8 kg de carne. Las porciones son de 1/8 kg. ¿Cuántas porciones necesitas?': {
    ca: 'Vols 5/8 kg de carn. Les porcions són d\'1/8 kg. Quantes porcions necessites?',
    en: 'You want 5/8 kg of meat. The portions are 1/8 kg each. How many portions do you need?',
  },
  '5 porciones de 1/8 kg suman 5/8 kg.': {
    ca: '5 porcions d\'1/8 kg sumen 5/8 kg.',
    en: '5 portions of 1/8 kg add up to 5/8 kg.',
  },
  'Una pizza grande se divide en 8 trozos. Compartes 3/4 de la pizza. ¿Cuántos trozos compartes?': {
    ca: 'Una pizza gran es divideix en 8 trossos. Comparteixes 3/4 de la pizza. Quants trossos comparteixes?',
    en: 'A large pizza is divided into 8 slices. You share 3/4 of the pizza. How many slices do you share?',
  },
  '3/4 de 8 trozos son 6 trozos.': {
    ca: '3/4 de 8 trossos són 6 trossos.',
    en: '3/4 of 8 slices is 6 slices.',
  },
  'Necesitas 7/8 kg de verduras. Las bolsas son de 1/8 kg. ¿Cuántas bolsas compras?': {
    ca: 'Necessites 7/8 kg de verdures. Les bosses són d\'1/8 kg. Quantes bosses compres?',
    en: 'You need 7/8 kg of vegetables. The bags are 1/8 kg each. How many bags do you buy?',
  },
  '7 bolsas de 1/8 kg suman 7/8 kg.': {
    ca: '7 bosses d\'1/8 kg sumen 7/8 kg.',
    en: '7 bags of 1/8 kg add up to 7/8 kg.',
  },
  'Un bizcocho se corta en 6 porciones iguales. Te comes 1/3 del bizcocho. ¿Cuántas porciones comiste?': {
    ca: 'Un pastís es talla en 6 porcions iguals. Et menges 1/3 del pastís. Quantes porcions has menjat?',
    en: 'A sponge cake is cut into 6 equal portions. You eat 1/3 of the cake. How many portions did you eat?',
  },
  '1/3 de 6 porciones son 2 porciones.': {
    ca: '1/3 de 6 porcions són 2 porcions.',
    en: '1/3 of 6 portions is 2 portions.',
  },
  'Una tarta se divide en 10 porciones. Te comes 3/10 de la tarta. ¿Cuántas porciones comiste?': {
    ca: 'Una tarta es divideix en 10 porcions. Et menges 3/10 de la tarta. Quantes porcions has menjat?',
    en: 'A tart is divided into 10 portions. You eat 3/10 of the tart. How many portions did you eat?',
  },
  '3/10 de 10 porciones son 3 porciones.': {
    ca: '3/10 de 10 porcions són 3 porcions.',
    en: '3/10 of 10 portions is 3 portions.',
  },
  'Necesitas 2/3 kg de pescado. Las porciones son de 1/3 kg. ¿Cuántas porciones compras?': {
    ca: 'Necessites 2/3 kg de peix. Les porcions són d\'1/3 kg. Quantes porcions compres?',
    en: 'You need 2/3 kg of fish. The portions are 1/3 kg each. How many portions do you buy?',
  },
  '2 porciones de 1/3 kg suman 2/3 kg.': {
    ca: '2 porcions d\'1/3 kg sumen 2/3 kg.',
    en: '2 portions of 1/3 kg add up to 2/3 kg.',
  },
  'Una sandía se corta en 16 trozos. Te comes 1/4 de la sandía. ¿Cuántos trozos comiste?': {
    ca: 'Una síndria es talla en 16 trossos. Et menges 1/4 de la síndria. Quants trossos has menjat?',
    en: 'A watermelon is cut into 16 pieces. You eat 1/4 of the watermelon. How many pieces did you eat?',
  },
  '1/4 de 16 trozos son 4 trozos.': {
    ca: '1/4 de 16 trossos són 4 trossos.',
    en: '1/4 of 16 pieces is 4 pieces.',
  },
  'Quieres 5/6 kg de verduras. Las bolsas son de 1/6 kg. ¿Cuántas bolsas necesitas?': {
    ca: 'Vols 5/6 kg de verdures. Les bosses són d\'1/6 kg. Quantes bosses necessites?',
    en: 'You want 5/6 kg of vegetables. The bags are 1/6 kg each. How many bags do you need?',
  },
  '5 bolsas de 1/6 kg suman 5/6 kg.': {
    ca: '5 bosses d\'1/6 kg sumen 5/6 kg.',
    en: '5 bags of 1/6 kg add up to 5/6 kg.',
  },
  'Un melón se divide en 8 gajos. Te comes 3/8 del melón. ¿Cuántos gajos comiste?': {
    ca: 'Un meló es divideix en 8 talls. Et menges 3/8 del meló. Quants talls has menjat?',
    en: 'A melon is divided into 8 wedges. You eat 3/8 of the melon. How many wedges did you eat?',
  },
  '3/8 de 8 gajos son 3 gajos.': {
    ca: '3/8 de 8 talls són 3 talls.',
    en: '3/8 of 8 wedges is 3 wedges.',
  },
  'Necesitas 3/5 kg de carne. Las porciones son de 1/5 kg. ¿Cuántas porciones compras?': {
    ca: 'Necessites 3/5 kg de carn. Les porcions són d\'1/5 kg. Quantes porcions compres?',
    en: 'You need 3/5 kg of meat. The portions are 1/5 kg each. How many portions do you buy?',
  },
  '3 porciones de 1/5 kg suman 3/5 kg.': {
    ca: '3 porcions d\'1/5 kg sumen 3/5 kg.',
    en: '3 portions of 1/5 kg add up to 3/5 kg.',
  },
  'Una barra de chocolate tiene 20 cuadraditos. Te comes 1/5 de la barra. ¿Cuántos cuadraditos comiste?': {
    ca: 'Una barra de xocolata té 20 quadrats. Et menges 1/5 de la barra. Quants quadrats has menjat?',
    en: 'A chocolate bar has 20 squares. You eat 1/5 of the bar. How many squares did you eat?',
  },
  '1/5 de 20 cuadraditos son 4 cuadraditos.': {
    ca: '1/5 de 20 quadrats són 4 quadrats.',
    en: '1/5 of 20 squares is 4 squares.',
  },
  'Quieres 4/5 kg de manzanas. Las bolsas son de 1/5 kg. ¿Cuántas bolsas necesitas?': {
    ca: 'Vols 4/5 kg de pomes. Les bosses són d\'1/5 kg. Quantes bosses necessites?',
    en: 'You want 4/5 kg of apples. The bags are 1/5 kg each. How many bags do you need?',
  },
  '4 bolsas de 1/5 kg suman 4/5 kg.': {
    ca: '4 bosses d\'1/5 kg sumen 4/5 kg.',
    en: '4 bags of 1/5 kg add up to 4/5 kg.',
  },
  'Una empanada se corta en 12 porciones. Te comes 1/3 de la empanada. ¿Cuántas porciones comiste?': {
    ca: 'Una empanada es talla en 12 porcions. Et menges 1/3 de l\'empanada. Quantes porcions has menjat?',
    en: 'An empanada is cut into 12 portions. You eat 1/3 of the empanada. How many portions did you eat?',
  },
  '1/3 de 12 porciones son 4 porciones.': {
    ca: '1/3 de 12 porcions són 4 porcions.',
    en: '1/3 of 12 portions is 4 portions.',
  },
  'Necesitas 7/10 kg de patatas. Las bolsas son de 1/10 kg. ¿Cuántas bolsas compras?': {
    ca: 'Necessites 7/10 kg de patates. Les bosses són d\'1/10 kg. Quantes bosses compres?',
    en: 'You need 7/10 kg of potatoes. The bags are 1/10 kg each. How many bags do you buy?',
  },
  '7 bolsas de 1/10 kg suman 7/10 kg.': {
    ca: '7 bosses d\'1/10 kg sumen 7/10 kg.',
    en: '7 bags of 1/10 kg add up to 7/10 kg.',
  },
  'Un pastel se divide en 14 trozos. Te comes 1/7 del pastel. ¿Cuántos trozos comiste?': {
    ca: 'Un pastís es divideix en 14 trossos. Et menges 1/7 del pastís. Quants trossos has menjat?',
    en: 'A cake is divided into 14 pieces. You eat 1/7 of the cake. How many pieces did you eat?',
  },
  '1/7 de 14 trozos son 2 trozos.': {
    ca: '1/7 de 14 trossos són 2 trossos.',
    en: '1/7 of 14 pieces is 2 pieces.',
  },
  'Quieres 6/7 kg de arroz. Las bolsas son de 1/7 kg. ¿Cuántas bolsas necesitas?': {
    ca: 'Vols 6/7 kg d\'arròs. Les bosses són d\'1/7 kg. Quantes bosses necessites?',
    en: 'You want 6/7 kg of rice. The bags are 1/7 kg each. How many bags do you need?',
  },
  '6 bolsas de 1/7 kg suman 6/7 kg.': {
    ca: '6 bosses d\'1/7 kg sumen 6/7 kg.',
    en: '6 bags of 1/7 kg add up to 6/7 kg.',
  },
  'Una pizza familiar se corta en 18 trozos. Te comes 1/6 de la pizza. ¿Cuántos trozos comiste?': {
    ca: 'Una pizza familiar es talla en 18 trossos. Et menges 1/6 de la pizza. Quants trossos has menjat?',
    en: 'A family pizza is cut into 18 slices. You eat 1/6 of the pizza. How many slices did you eat?',
  },
  '1/6 de 18 trozos son 3 trozos.': {
    ca: '1/6 de 18 trossos són 3 trossos.',
    en: '1/6 of 18 slices is 3 slices.',
  },
  'Necesitas 8/9 kg de harina. Las bolsas son de 1/9 kg. ¿Cuántas bolsas compras?': {
    ca: 'Necessites 8/9 kg de farina. Les bosses són d\'1/9 kg. Quantes bosses compres?',
    en: 'You need 8/9 kg of flour. The bags are 1/9 kg each. How many bags do you buy?',
  },
  '8 bolsas de 1/9 kg suman 8/9 kg.': {
    ca: '8 bosses d\'1/9 kg sumen 8/9 kg.',
    en: '8 bags of 1/9 kg add up to 8/9 kg.',
  },
  'Un queso se corta en 15 lonchas. Te comes 1/5 del queso. ¿Cuántas lonchas comiste?': {
    ca: 'Un formatge es talla en 15 llesques. Et menges 1/5 del formatge. Quantes llesques has menjat?',
    en: 'A cheese is cut into 15 slices. You eat 1/5 of the cheese. How many slices did you eat?',
  },
  '1/5 de 15 lonchas son 3 lonchas.': {
    ca: '1/5 de 15 llesques són 3 llesques.',
    en: '1/5 of 15 slices is 3 slices.',
  },
  'Quieres 9/10 kg de azúcar. Las bolsas son de 1/10 kg. ¿Cuántas bolsas necesitas?': {
    ca: 'Vols 9/10 kg de sucre. Les bosses són d\'1/10 kg. Quantes bosses necessites?',
    en: 'You want 9/10 kg of sugar. The bags are 1/10 kg each. How many bags do you need?',
  },
  '9 bolsas de 1/10 kg suman 9/10 kg.': {
    ca: '9 bosses d\'1/10 kg sumen 9/10 kg.',
    en: '9 bags of 1/10 kg add up to 9/10 kg.',
  },
  'Una tortilla se corta en 16 porciones. Te comes 3/8 de la tortilla. ¿Cuántas porciones comiste?': {
    ca: 'Una truita es talla en 16 porcions. Et menges 3/8 de la truita. Quantes porcions has menjat?',
    en: 'An omelette is cut into 16 portions. You eat 3/8 of the omelette. How many portions did you eat?',
  },
  '3/8 de 16 porciones son 6 porciones.': {
    ca: '3/8 de 16 porcions són 6 porcions.',
    en: '3/8 of 16 portions is 6 portions.',
  },
};

function lookup(dict, text, lang) {
  const entry = dict[text];
  if (!entry) throw new Error(`Missing translation for: ${text}`);
  return entry[lang];
}

function translatePagoExplanation(explanation, lang) {
  if (mercadoStrings[explanation]) {
    return lookup(mercadoStrings, explanation, lang);
  }
  if (lang === 'ca') {
    return explanation.replace('(billete)', '(bitllet)');
  }
  if (lang === 'en') {
    return explanation.replace('(billete)', '(bill)');
  }
  return explanation;
}

function translateMercadoTask(task, lang) {
  const out = { ...task };
  if (task.type === 'PAGO') {
    out.statement = lookup(mercadoStrings, task.statement, lang);
    out.explanation = translatePagoExplanation(task.explanation, lang);
  } else if (task.type === 'HORA') {
    out.statement = translateHoraStatement(task.statement, lang);
    out.explanation = translateHoraExplanation(task.explanation, lang);
    if (task.options) out.options = [...task.options];
  } else if (task.type === 'FRACCION') {
    out.statement = lookup(fraccionStrings, task.statement, lang);
    out.explanation = lookup(fraccionStrings, task.explanation, lang);
    if (task.options) {
      out.options = task.options.map((opt) =>
        fraccionStrings[opt] ? lookup(fraccionStrings, opt, lang) : opt
      );
    }
  } else {
    throw new Error(`Unknown task type: ${task.type}`);
  }
  return out;
}

function translateFlipLesson(lesson, lang) {
  const tr = flipLessonTranslations[lesson.id];
  if (!tr) throw new Error(`Missing flip translation for: ${lesson.id}`);

  return {
    id: lesson.id,
    title: tr.title[lang],
    videos: lesson.videos.map((video, i) => ({
      id: video.id,
      title: tr.videos[i].title[lang],
      url: video.url,
      canal: video.canal,
      duracion: video.duracion,
      descripcion: tr.videos[i].descripcion[lang],
    })),
    captions: lesson.captions,
    questions: lesson.questions.map((question, i) => ({
      q: tr.questions[i].q[lang],
      options: question.options.map((_, j) => tr.questions[i].options[j][lang === 'ca' ? 0 : 1]),
      answer: question.answer,
      explanation: tr.questions[i].explanation[lang],
    })),
    thumbnail: lesson.thumbnail,
  };
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

for (const lang of ['ca', 'en']) {
  const mercado = esMercado.map((task) => translateMercadoTask(task, lang));
  writeJson(path.join(DATA, `${lang}/mercado-tasks.json`), mercado);

  const flip = esFlip.map((lesson) => translateFlipLesson(lesson, lang));
  writeJson(path.join(DATA, `${lang}/flip-lessons.json`), flip);
}

for (const file of [
  'ca/mercado-tasks.json',
  'en/mercado-tasks.json',
  'ca/flip-lessons.json',
  'en/flip-lessons.json',
]) {
  const full = path.join(DATA, file);
  const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
  console.log(`${file}: ${parsed.length} items, valid JSON`);
}

console.log('Translation complete.');

