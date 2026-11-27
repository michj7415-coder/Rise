// Fonctions partagées par les scripts.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {selectComposition} from '@remotion/renderer';
import {MAX_SOUS_TITRE, decouperPhrases, fractionCle, planSousTitres, MARGE_FIN} from '../src/partage/decoupage.js';

export const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FPS = 30;
export const TRANSITION = 12;
// Navigateur : Remotion télécharge le sien ; on peut en imposer un avec REMOTION_BROWSER_EXECUTABLE.
export const navigateur = process.env.REMOTION_BROWSER_EXECUTABLE || null;
export const FORMATS = {'16x9': {largeur: 1920, hauteur: 1080}, '9x16': {largeur: 1080, hauteur: 1920}};

export const lireModule = (n = 1) => JSON.parse(fs.readFileSync(path.join(racine, 'src', 'data', `module${n}.json`), 'utf8'));

export const assembler = async () => {
  console.log('⏳ Assemblage du projet…');
  return bundle({entryPoint: path.join(racine, 'src', 'index.ts'), publicDir: path.join(racine, 'public')});
};

export const composition = (serveUrl, module, format, inputProps = {}) =>
  selectComposition({serveUrl, id: `Module${module}-${format}`, inputProps: {module, ...inputProps}, browserExecutable: navigateur});

// Début de chaque scène dans la vidéo (en images), en tenant compte des fondus de 12 images.
export const debutsScenes = (durees) => {
  const debuts = [];
  let t = 0;
  durees.forEach((d) => {
    debuts.push(t);
    t += d - TRANSITION;
  });
  return debuts;
};

const hms = (s) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, '0')}`;
};

// Fichier .srt : mêmes phrases et mêmes horaires que les sous-titres incrustés.
export const genererSrt = (data, durees, vertical) => {
  const debuts = debutsScenes(durees);
  const blocs = [];
  data.scenes.forEach((s, i) => {
    planSousTitres(s.narration, durees[i] / FPS, vertical ? MAX_SOUS_TITRE.vertical : MAX_SOUS_TITRE.horizontal).forEach((st) => {
      const a = debuts[i] / FPS + st.debut;
      const b = debuts[i] / FPS + st.fin;
      blocs.push(`${blocs.length + 1}\n${hms(a)} --> ${hms(b)}\n${st.texte}\n`);
    });
  });
  return blocs.join('\n');
};

export {decouperPhrases, fractionCle, MARGE_FIN, MAX_SOUS_TITRE};
