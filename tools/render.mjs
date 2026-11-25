// Produit les MP4 d'un ou plusieurs chapitres, dans les deux formats.
//   npm run render -- module-04-ch1
//   npm run render:all
import fs from 'node:fs';
import path from 'node:path';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {FORMATS, lireChapitres, navigateur, preparerEtAssembler, racine} from './commun.mjs';

const {tous, serveUrl} = await preparerEtAssembler();
const choisis = lireChapitres(tous);
const dossierSortie = path.join(racine, 'out');
fs.mkdirSync(dossierSortie, {recursive: true});

for (const chapitre of choisis) {
  for (const format of FORMATS) {
    const id = `${chapitre}-${format}`;
    const inputProps = {chapitre};
    const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable: navigateur});
    const sortie = path.join(dossierSortie, `${id}.mp4`);
    const secondes = (composition.durationInFrames / composition.fps).toFixed(1);
    console.log(`🎬 ${id} (${composition.width}x${composition.height}, ${secondes} s)`);
    let dernier = -1;
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: sortie,
      inputProps,
      enforceAudioTrack: true, // piste silencieuse s'il n'y a ni voix ni musique
      browserExecutable: navigateur,
      onProgress: ({progress}) => {
        const pct = Math.floor(progress * 10) * 10;
        if (pct !== dernier) {
          dernier = pct;
          process.stdout.write(`   ${pct} %\n`);
        }
      },
    });
    console.log(`✅ ${path.relative(racine, sortie)}`);
  }
}
console.log('\nTerminé. Les vidéos sont dans le dossier out/.');
