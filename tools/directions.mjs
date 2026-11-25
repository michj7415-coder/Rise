// Produit une image de la même scène dans chaque direction artistique, pour comparer.
//   npm run directions                                   (scène 03 du module 4, chapitre 1)
//   npm run directions -- module-04-ch1 06-ce-qui-aide   (autre chapitre / autre scène)
import fs from 'node:fs';
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {FORMATS, navigateur, preparerEtAssembler, racine} from './commun.mjs';

const DIRECTIONS = ['bleu-nuit', 'papier-creme', 'neon-doux', 'carnet-de-suivi', 'pastel-apaisant'];
const [chapitre = 'module-04-ch1', sceneId = '03-sel-potassium'] = process.argv.slice(2);

const {serveUrl} = await preparerEtAssembler();
const script = JSON.parse(fs.readFileSync(path.join(racine, 'scripts', `${chapitre}.json`), 'utf8'));
const index = script.scenes.findIndex((s) => s.id === sceneId);
if (index === -1) {
  console.error(`Scène « ${sceneId} » introuvable dans ${chapitre}.`);
  process.exit(1);
}
const dossier = path.join(racine, 'out', 'directions');
fs.mkdirSync(dossier, {recursive: true});
const problemes = [];

for (const direction of DIRECTIONS) {
  for (const format of FORMATS) {
    const inputProps = {chapitre, direction, verifier: true};
    const composition = await selectComposition({
      serveUrl,
      id: `${chapitre}-${format}`,
      inputProps,
      browserExecutable: navigateur,
    });
    const durees = composition.props.durees;
    const debut = durees.slice(0, index).reduce((a, b) => a + b, 0);
    const sortie = path.join(dossier, `${direction}-${format}.png`);
    await renderStill({
      composition,
      serveUrl,
      frame: debut + durees[index] - 14,
      output: sortie,
      inputProps,
      browserExecutable: navigateur,
      overwrite: true,
      onBrowserLog: (log) => {
        if (log.text.startsWith('DEBORDEMENT|')) problemes.push(`${direction} ${format} : ${log.text}`);
      },
    });
    console.log(`🖼  ${path.relative(racine, sortie)}`);
  }
}
if (problemes.length) {
  console.log('\n⚠️  Débordements :');
  for (const p of new Set(problemes)) console.log(`   - ${p}`);
}
