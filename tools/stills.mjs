// Génère une image fixe de chaque scène, dans les deux formats,
// et vérifie qu'aucun texte ne déborde (y compris tous les sous-titres).
//   npm run stills -- module-04-ch1
//   npm run stills -- --all
import fs from 'node:fs';
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {FORMATS, lireChapitres, navigateur, preparerEtAssembler, racine} from './commun.mjs';

const {tous, serveUrl} = await preparerEtAssembler();
const choisis = lireChapitres(tous);
const problemes = [];

for (const chapitre of choisis) {
  const script = JSON.parse(fs.readFileSync(path.join(racine, 'scripts', `${chapitre}.json`), 'utf8'));
  for (const format of FORMATS) {
    const id = `${chapitre}-${format}`;
    const inputProps = {chapitre, verifier: true};
    const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable: navigateur});
    const durees = composition.props.durees;
    const dossier = path.join(racine, 'out', 'stills', chapitre, format);
    fs.mkdirSync(dossier, {recursive: true});
    let debut = 0;
    for (let i = 0; i < script.scenes.length; i++) {
      const scene = script.scenes[i];
      // Image prise à la fin de la scène, quand toutes les animations sont terminées.
      const frame = debut + durees[i] - 14;
      debut += durees[i];
      const sortie = path.join(dossier, `${scene.id}.png`);
      await renderStill({
        composition,
        serveUrl,
        frame,
        output: sortie,
        inputProps,
        browserExecutable: navigateur,
        overwrite: true,
        onBrowserLog: (log) => {
          if (log.text.startsWith("DEBORDEMENT|")) {
            const [, s, zone, detail] = log.text.split('|');
            problemes.push(`${format} · ${s} · ${zone} : ${detail}`);
          }
        },
      });
      console.log(`🖼  ${path.relative(racine, sortie)}`);
    }
  }
}

if (problemes.length) {
  console.log(`\n⚠️  ${problemes.length} débordement(s) détecté(s) :`);
  for (const p of [...new Set(problemes)]) console.log(`   - ${p}`);
  process.exit(2);
}
console.log('\n✅ Aucun texte ne déborde. Images dans out/stills/.');
