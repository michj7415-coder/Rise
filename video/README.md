# RISE — vidéos des modules (Remotion)

Chaque module de la formation RISE est décrit dans un fichier JSON (`src/data/moduleN.json`).
Le projet en fabrique deux vidéos MP4 (16:9 et 9:16), des sous-titres `.srt` et une image
fixe par scène pour valider rapidement.

## Installation (une fois)

1. Installe **Node.js** (version LTS) depuis <https://nodejs.org>.
2. Ouvre un terminal dans le dossier `video/` et tape :
   ```
   npm install
   ```

## Commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Ouvre Remotion Studio dans le navigateur pour prévisualiser (`Module1-16x9`, `Module1-9x16`). |
| `npm run voice:list` | Affiche, scène par scène, le texte à faire lire et le nom du fichier audio attendu. |
| `npm run stills` | Une image PNG par scène et par format dans `out/stills/`, plus des contrôles automatiques (voir plus bas). |
| `npm run render:16x9` | `out/module1-16x9.mp4` + `out/module1.srt` |
| `npm run render:9x16` | `out/module1-9x16.mp4` + `out/module1-9x16.srt` |
| `npm run render:all` | Les deux formats. |

Pour un autre module : `MODULE=2 npm run render:all` (Mac/Linux).

Les vidéos sont en H.264, 30 images/s. Le 9:16 a sa propre mise en page (empilée), ce n'est pas un recadrage.

## Ajouter les voix

1. Lance `npm run voice:list` : il donne le texte exact de chaque scène et le nom du fichier.
2. Génère chaque voix avec l'outil de ton choix, **en lisant le texte tel quel** (les sous-titres le reprennent).
3. Dépose les fichiers dans `public/audio/m1/`, par exemple `public/audio/m1/s01-intro.mp3`.
4. Relance le rendu.

Avec un fichier audio, la scène dure **la durée de l'audio + 0,6 s**. Sans fichier, elle dure
`durationSec` du JSON (estimation) et la vidéo a une piste silencieuse. Exception : une scène
avec une carte de prudence est allongée si nécessaire pour que la carte reste **au moins 6 s** à l'écran.

## Ajouter un module

1. Copie `src/data/module1.json` en `src/data/module2.json` et remplace le contenu
   (`module`, `title`, `scenes` : `id`, `durationSec`, `narration`, `onScreen`, `visual`, `animation`).
2. Ajoute le module dans `src/modules/index.ts` (une ligne, sur le modèle du module 1).
3. Sans visuel spécifique, chaque scène affiche ses textes `onScreen` les uns sous les autres.
   Pour une mise en page sur mesure, crée `src/modules/module2.tsx` sur le modèle de `module1.tsx`,
   en réutilisant les types de scène de `src/scenes/` (TitleCard, BigStat, StepList, Compare,
   Table, WarningCard, Recap) et les visuels de `src/visuels/`.
4. Dépose les voix dans `public/audio/m2/`.

## Contrôles automatiques (`npm run stills`)

- Aucun texte ne déborde, n'est coupé, ne dépasse 2 lignes (6 pour les cartes de prudence) ni ne se chevauche.
- Aucun texte à l'écran dans les 12 % du bas (16:9) ou les 20 % du bas (9:16), réservés aux sous-titres.
- Les sous-titres reprennent la narration **mot pour mot** (découpage seulement).
- Chaque carte de prudence reste au moins 6 s à l'écran.

Les images principales sont prises en fin de scène ; d'autres images de contrôle (25 %, 50 %, 75 %
de chaque scène) sont dans `out/stills/controle/`.

## Polices

Space Grotesk et Inter sont chargées via `@remotion/google-fonts`. Si le navigateur de rendu
n'a pas accès à Google Fonts (réseau filtré), lance une fois `node scripts/polices-locales.mjs` :
les mêmes fichiers sont copiés dans `public/polices/` et utilisés en local.

## Organisation

```
src/data/module1.json      script du module (textes, narration, durées estimées)
src/data/reperes.ts        chiffres du tableau de la scène 8 (objet typé)
src/modules/module1.tsx    mise en page de chaque scène du module 1
src/scenes/                types de scène réutilisables
src/visuels/               visuels SVG réutilisables (silhouettes, courbe, règle, tableau…)
src/composants/            en-tête, barre de progression, sous-titres, cartes, icônes
src/partage/decoupage.js   découpage des sous-titres (partagé avec le .srt)
scripts/                   voice:list, stills, render
public/audio/m1/           voix off du module 1
```
