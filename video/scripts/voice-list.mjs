// Affiche, scène par scène, le texte à faire lire et le fichier audio attendu.
//   npm run voice:list            (module 1)
//   npm run voice:list -- 2       (module 2)
import fs from 'node:fs';
import path from 'node:path';
import {lireModule, racine} from './commun.mjs';

const n = Number(process.argv[2] ?? 1);
const data = lireModule(n);
console.log(`\nModule ${n} — ${data.title}\nDépose chaque fichier dans public/audio/m${n}/\n`);
for (const s of data.scenes) {
  const fichier = `public/audio/m${n}/${s.id}.mp3`;
  const present = fs.existsSync(path.join(racine, fichier));
  console.log(`${present ? '✅' : '⬜'} ${fichier}   (estimation : ${s.durationSec} s)`);
  console.log(`   ${s.narration}\n`);
}
