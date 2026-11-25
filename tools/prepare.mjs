// Préparation lancée automatiquement avant le studio et les rendus.
// 1. Lit tous les fichiers scripts/*.json et vérifie qu'ils sont complets.
// 2. Repère les voix off (voice/<chapitre>/<id>.mp3) et la musique (music/).
// 3. Copie ces fichiers audio dans public/ (dossier lu par Remotion).
// 4. Écrit src/generated/chapitres.ts, la liste des chapitres utilisée par les vidéos.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierScripts = path.join(racine, 'scripts');
const dossierVoix = path.join(racine, 'voice');
const dossierMusique = path.join(racine, 'music');
const dossierPublic = path.join(racine, 'public');
const dossierGenere = path.join(racine, 'src', 'generated');

export const TYPES = [
  'titre-compteur',
  'courbe-illustrative',
  'barres-comparaison',
  'pastilles',
  'deux-panneaux',
  'liste-coches',
  'liste-alerte',
  'finale',
];
const EXT_AUDIO = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];

const erreur = (fichier, message) => {
  throw new Error(`\n❌ Problème dans ${fichier} : ${message}\n`);
};

const valider = (fichier, script) => {
  const nomAttendu = path.basename(fichier, '.json');
  if (script.id !== nomAttendu) {
    erreur(fichier, `"id" vaut "${script.id}" mais devrait être "${nomAttendu}" (le nom du fichier).`);
  }
  if (!/^[a-z0-9-]+$/.test(script.id)) {
    erreur(fichier, `"id" ne doit contenir que des minuscules, chiffres et tirets.`);
  }
  if (!Array.isArray(script.scenes) || script.scenes.length === 0) {
    erreur(fichier, `il faut une liste "scenes" non vide.`);
  }
  const ids = new Set();
  script.scenes.forEach((s, i) => {
    const ou = `scène n°${i + 1}`;
    for (const champ of ['id', 'type', 'duree', 'voix', 'props']) {
      if (s[champ] === undefined) erreur(fichier, `${ou} : le champ "${champ}" manque.`);
    }
    if (ids.has(s.id)) erreur(fichier, `${ou} : l'id "${s.id}" est utilisé deux fois.`);
    ids.add(s.id);
    if (!TYPES.includes(s.type)) {
      erreur(fichier, `${ou} : type "${s.type}" inconnu. Types possibles : ${TYPES.join(', ')}.`);
    }
    if (typeof s.duree !== 'number' || s.duree <= 0) {
      erreur(fichier, `${ou} : "duree" doit être un nombre de secondes positif.`);
    }
  });
};

const copier = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.copyFileSync(source, destination);
};

const estAudio = (f) => EXT_AUDIO.includes(path.extname(f).toLowerCase());

export const preparer = ({silencieux = false} = {}) => {
  const fichiers = fs
    .readdirSync(dossierScripts)
    .filter((f) => f.endsWith('.json'))
    .sort();
  if (fichiers.length === 0) throw new Error('Aucun fichier JSON dans scripts/.');

  fs.rmSync(dossierPublic, {recursive: true, force: true});
  fs.mkdirSync(dossierPublic, {recursive: true});
  fs.mkdirSync(dossierGenere, {recursive: true});

  const musiques = fs.existsSync(dossierMusique)
    ? fs.readdirSync(dossierMusique).filter(estAudio).sort()
    : [];

  const chapitres = [];
  for (const f of fichiers) {
    const chemin = path.join(dossierScripts, f);
    let script;
    try {
      script = JSON.parse(fs.readFileSync(chemin, 'utf8'));
    } catch (e) {
      erreur(`scripts/${f}`, `le JSON est mal écrit (virgule ou guillemet oublié ?). Détail : ${e.message}`);
    }
    valider(`scripts/${f}`, script);

    // Voix off : voice/<chapitre>/<id>.mp3
    const voix = {};
    for (const s of script.scenes) {
      const fichierVoix = path.join(dossierVoix, script.id, `${s.id}.mp3`);
      if (fs.existsSync(fichierVoix)) {
        const rel = `voice/${script.id}/${s.id}.mp3`;
        copier(fichierVoix, path.join(dossierPublic, rel));
        voix[s.id] = rel;
      }
    }

    // Musique : celle indiquée dans le JSON ("musique"), sinon le premier fichier de music/.
    let musique = null;
    const choix = script.musique ?? musiques[0] ?? null;
    if (choix) {
      const source = path.join(dossierMusique, choix);
      if (!fs.existsSync(source)) {
        erreur(`scripts/${f}`, `la musique "${choix}" n'existe pas dans music/.`);
      }
      musique = `music/${choix}`;
      copier(source, path.join(dossierPublic, musique));
    }

    chapitres.push({fichier: f, id: script.id, voix, musique});
    if (!silencieux) {
      const nbVoix = Object.keys(voix).length;
      console.log(
        `✔ ${script.id} : ${script.scenes.length} scènes, ` +
          `${nbVoix}/${script.scenes.length} voix off trouvées, ` +
          `musique : ${musique ?? 'aucune'}`,
      );
    }
  }

  const lignes = [
    '// Fichier généré automatiquement par tools/prepare.mjs — ne pas modifier à la main.',
    "import type {ScriptChapitre} from '../types';",
    ...chapitres.map((c, i) => `import script${i} from '../../scripts/${c.fichier}';`),
    '',
    'export const chapitres: {script: ScriptChapitre; voix: Record<string, string>; musique: string | null}[] = [',
    ...chapitres.map(
      (c, i) =>
        `  {script: script${i} as ScriptChapitre, voix: ${JSON.stringify(c.voix)}, musique: ${JSON.stringify(c.musique)}},`,
    ),
    '];',
    '',
  ];
  fs.writeFileSync(path.join(dossierGenere, 'chapitres.ts'), lignes.join('\n'));
  return chapitres.map((c) => c.id);
};

// Lancement direct : node tools/prepare.mjs
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    preparer();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
