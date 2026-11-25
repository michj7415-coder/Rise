// Produit une image de chaque modèle de mise en page (scène « Le sel et le potassium »).
//   npm run maquettes
import fs from 'node:fs';
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {FORMATS, navigateur, preparerEtAssembler, racine} from './commun.mjs';

const MODELES = ['cartes', 'editorial', 'jauges', 'bento', 'affiche'];
const {serveUrl} = await preparerEtAssembler();
const dossier = path.join(racine, 'out', 'maquettes');
fs.mkdirSync(dossier, {recursive: true});
const problemes = [];

for (const modele of MODELES) {
  for (const format of FORMATS) {
    const inputProps = {modele, chapitre: 'module-04-ch1', scene: '03-sel-potassium', verifier: true};
    const composition = await selectComposition({serveUrl, id: `maquette-${modele}-${format}`, inputProps, browserExecutable: navigateur});
    const sortie = path.join(dossier, `${modele}-${format}.png`);
    await renderStill({
      composition,
      serveUrl,
      frame: composition.durationInFrames - 14,
      output: sortie,
      inputProps,
      browserExecutable: navigateur,
      overwrite: true,
      onBrowserLog: (log) => {
        if (log.text.startsWith('DEBORDEMENT|')) problemes.push(`${format} · ${log.text}`);
      },
    });
    console.log(`🖼  ${path.relative(racine, sortie)}`);
  }
}
if (problemes.length) {
  console.log('\n⚠️  Débordements :');
  for (const p of new Set(problemes)) console.log(`   - ${p}`);
}
