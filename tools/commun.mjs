// Fonctions partagées par render.mjs et stills.mjs.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {preparer} from './prepare.mjs';

export const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FORMATS = ['16x9', '9x16'];

// Navigateur utilisé pour le rendu : Remotion télécharge le sien automatiquement.
// On peut en imposer un autre avec la variable REMOTION_BROWSER_EXECUTABLE.
export const navigateur = process.env.REMOTION_BROWSER_EXECUTABLE || null;

// Lit les arguments : noms de chapitres, ou --all pour tous.
export const lireChapitres = (tous) => {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const toutDemande = process.argv.includes('--all');
  if (!toutDemande && args.length === 0) {
    console.error('Indique un chapitre, par exemple : npm run render -- module-04-ch1');
    console.error('Ou tous les chapitres : npm run render:all');
    process.exit(1);
  }
  const inconnus = args.filter((a) => !tous.includes(a.replace(/\.json$/, '')));
  if (inconnus.length) {
    console.error(`Chapitre(s) introuvable(s) dans scripts/ : ${inconnus.join(', ')}`);
    console.error(`Chapitres disponibles : ${tous.join(', ')}`);
    process.exit(1);
  }
  return toutDemande ? tous : args.map((a) => a.replace(/\.json$/, ''));
};

export const preparerEtAssembler = async () => {
  let tous;
  try {
    tous = preparer();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  console.log('⏳ Préparation du projet (assemblage du code)…');
  const serveUrl = await bundle({
    entryPoint: path.join(racine, 'src', 'index.ts'),
    publicDir: path.join(racine, 'public'),
  });
  return {tous, serveUrl};
};
