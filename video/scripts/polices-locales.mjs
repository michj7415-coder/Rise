// Facultatif : télécharge les polices Google (Space Grotesk, Inter) dans public/polices/
// pour rendre sans accès direct à Google Fonts depuis le navigateur de rendu
// (réseau d'entreprise, proxy…). Sans ce dossier, @remotion/google-fonts est utilisé.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {racine} from './commun.mjs';

const familles = [
  {nom: 'Space Grotesk', param: 'Space+Grotesk:wght@500;700'},
  {nom: 'Inter', param: 'Inter:wght@400;500;600;700'},
];
const dossier = path.join(racine, 'public', 'polices');
fs.mkdirSync(dossier, {recursive: true});
const index = [];
const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
for (const f of familles) {
  const css = execFileSync('curl', ['-sS', '-A', ua, `https://fonts.googleapis.com/css2?family=${f.param}&display=block`]).toString();
  for (const [, sousEnsemble, b] of css.matchAll(/\/\* ([\w-]+) \*\/\s*@font-face\s*\{([^}]+)\}/g)) {
    if (sousEnsemble !== 'latin' && sousEnsemble !== 'latin-ext') continue;
    const poids = b.match(/font-weight:\s*(\d+)/)[1];
    const url = b.match(/url\((https:[^)]+\.woff2)\)/)[1];
    const plage = b.match(/unicode-range:\s*([^;]+);/)[1];
    const fichier = `${f.nom.replace(/\s/g, '')}-${poids}-${sousEnsemble}.woff2`;
    execFileSync('curl', ['-sS', '-o', path.join(dossier, fichier), url]);
    index.push({famille: f.nom, poids, plage, fichier});
  }
}
fs.writeFileSync(path.join(dossier, 'polices.json'), JSON.stringify(index, null, 1));
console.log(`✔ ${index.length} fichiers de police dans public/polices/`);
