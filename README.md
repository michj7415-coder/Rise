# Vidéos de la formation « Mesures et Confiance »

Ce projet fabrique automatiquement les vidéos animées de la formation, à partir de
textes écrits dans des fichiers JSON. Chaque chapitre donne **deux vidéos MP4** :

| Format | Taille | Usage |
|---|---|---|
| 16:9 | 1920 × 1080 | la formation en ligne |
| 9:16 | 1080 × 1920 | TikTok (et autres formats verticaux) |

Les vidéos n'ont aucun visage : seulement du texte animé, des schémas, des listes, la voix off
(si tu l'ajoutes) et des sous-titres incrustés.

L'outil utilisé s'appelle **Remotion** : il décrit les vidéos avec du code (React + TypeScript)
puis les transforme en MP4. Tu n'as pas besoin de toucher au code pour créer un chapitre :
tout se fait dans les fichiers JSON.

---

## 1. Installation (une seule fois)

1. Installe **Node.js** (version 18 ou plus récente) depuis <https://nodejs.org>
   (prends la version « LTS »).
2. Ouvre un terminal dans le dossier du projet :
   - **Mac** : clic droit sur le dossier → « Nouveau terminal au dossier ».
   - **Windows** : ouvre le dossier, tape `cmd` dans la barre d'adresse, puis Entrée.
3. Tape cette commande puis Entrée :

   ```
   npm install
   ```

   Elle télécharge tout ce dont le projet a besoin (dossier `node_modules/`). Compte quelques minutes.
   Au premier rendu, Remotion télécharge aussi automatiquement un petit navigateur
   (Chrome « headless ») dont il se sert pour dessiner les images.

---

## 2. Les commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run studio` | Ouvre un aperçu dans ton navigateur. Tu peux lire les vidéos, avancer image par image, choisir 16:9 ou 9:16 dans la colonne de gauche. |
| `npm run render -- module-04-ch1` | Produit les deux MP4 de ce chapitre dans `out/`. |
| `npm run render:all` | Produit les MP4 de **tous** les fichiers de `scripts/`. |
| `npm run stills -- module-04-ch1` | Produit une image fixe de chaque scène, dans les deux formats (`out/stills/`), et **vérifie qu'aucun texte ne déborde**. |

> Le `--` avant le nom du chapitre est obligatoire : il indique à npm que ce qui suit est pour notre script.

Fichiers produits :

```
out/module-04-ch1-16x9.mp4
out/module-04-ch1-9x16.mp4
out/stills/module-04-ch1/16x9/01-titre.png …
```

Pour arrêter le studio : clique dans le terminal et appuie sur `Ctrl + C`.

**Durée d'un rendu** : quelques minutes par vidéo, selon la puissance de l'ordinateur.

---

## 3. Organisation des dossiers

```
scripts/          ← un fichier JSON par chapitre (c'est ici que tu écris)
voice/            ← les voix off : voice/<chapitre>/<id de la scène>.mp3
music/            ← musique de fond (optionnelle, libre de droits)
out/              ← les vidéos et images produites (non envoyées sur GitHub)
src/              ← le code des vidéos (styles, scènes, animations)
  theme.ts        ← couleurs, polices, pied de page, volume de la musique
  layout.ts       ← tailles et marges pour le 16:9 et le 9:16
  scenes/         ← un fichier par type de scène
tools/            ← les scripts des commandes ci-dessus
```

Le dossier `public/` et le fichier `src/generated/chapitres.ts` sont recréés automatiquement
à chaque commande : ne les modifie pas.

---

## 4. Écrire un chapitre (fichier JSON)

Un fichier par chapitre dans `scripts/`. **Le nom du fichier doit être identique à son `id`**
(par exemple `scripts/module-04-ch1.json` avec `"id": "module-04-ch1"`). Seuls les minuscules,
chiffres et tirets sont acceptés.

```json
{
  "id": "module-04-ch1",
  "module": 4,
  "chapitre": 1,
  "titre": "Rétention d'eau",
  "musique": null,
  "scenes": [
    {
      "id": "01-titre",
      "type": "titre-compteur",
      "duree": 8,
      "voix": "Le texte lu par la voix off, affiché aussi en sous-titres.",
      "props": { "...": "le contenu affiché à l'écran" }
    }
  ]
}
```

Chaque scène a :

- **id** : un nom court et unique (il sert aussi de nom pour le fichier de voix off) ;
- **type** : l'un des 8 types ci-dessous ;
- **duree** : la durée en secondes (utilisée seulement s'il n'y a pas de voix off) ;
- **voix** : le texte parlé, qui sert aussi de sous-titres ;
- **props** : ce qui est affiché à l'écran.

Si tu fais une erreur (virgule oubliée, champ manquant, type inconnu…), les commandes s'arrêtent
avec un message en français qui indique le fichier et la scène concernés.

> Astuce : pour vérifier qu'un JSON est bien écrit, tu peux le coller sur <https://jsonlint.com>.

### Les 8 types de scènes

**`titre-compteur`** : grand titre et compteur qui monte.
```json
{ "titre": "Rétention d'eau",
  "compteur": { "depart": 0, "arrivee": 1.2, "decimales": 1, "prefixe": "+", "suffixe": " kg" },
  "legende": "Ce matin sur la balance" }
```

**`courbe-illustrative`** : courbe qui se dessine. Elle porte **toujours** le badge
« Exemple illustratif » (modifiable avec `mention`, jamais supprimable). Seuls les points
fournis sont tracés et étiquetés. Tu peux ajouter des points intermédiaires dans `points` :
la courbe passera exactement par eux.
```json
{ "titre": "1 à 2 kg de variation par jour", "mention": "Exemple illustratif",
  "uniteX": "h", "uniteY": "kg",
  "points": [ { "x": 7, "y": 70 }, { "x": 23, "y": 72 } ] }
```

**`barres-comparaison`** : barres qui se remplissent sur une échelle commune, avec repère optionnel.
`valeur` sert à dessiner la barre et `texteValeur` est le texte affiché. Couleurs possibles :
`turquoise`, `ambre`, `neutre`.
```json
{ "titre": "Le sel et le potassium",
  "echelle": { "min": 0, "max": 4000, "libelleMin": "0", "libelleMax": "4 000" },
  "barres": [
    { "libelle": "Sodium à ne pas dépasser", "valeur": 2000, "texteValeur": "2 000 mg par jour",
      "couleur": "ambre", "repere": { "valeur": 2000, "libelle": "2 000" } },
    { "libelle": "Potassium à atteindre", "valeur": 3510, "texteValeur": "3 510 mg par jour",
      "couleur": "turquoise" } ],
  "note": "Texte en petit sous les barres." }
```

**`pastilles`** : étiquettes qui apparaissent une à une. `"ton": "alerte"` les met en ambre.
```json
{ "titre": "Les autres causes", "pastilles": ["Stress", "Alcool"], "ton": "normal" }
```

**`deux-panneaux`** : deux cartes à comparer (côte à côte en 16:9, l'une sous l'autre en 9:16).
```json
{ "titre": "Eau et gras, deux choses différentes",
  "panneaux": [
    { "titre": "Perdre de l'eau", "texte": "revient dès que tu bois", "couleur": "neutre" },
    { "titre": "Perdre du gras", "texte": "demande un déficit calorique", "couleur": "turquoise" } ] }
```

**`liste-coches`** : liste avec coches turquoise.
```json
{ "titre": "Ce qui aide vraiment", "elements": ["Marcher chaque jour", "Dormir assez"] }
```

**`liste-alerte`** : liste où certaines lignes sont des alertes (triangle ambre). Les autres
lignes ont une icône « i ».
```json
{ "titre": "À éviter",
  "elements": [ { "texte": "Ne limite jamais ton eau pour dégonfler", "alerte": true },
                { "texte": "Bois avant, pendant et après l'effort", "alerte": false } ] }
```

**`finale`** : message de fin et petite mention.
```json
{ "titre": "Routine du matin + défi de 7 jours",
  "mention": "Ce module ne remplace pas un avis médical" }
```

---

## 5. Ajouter la voix off

1. Enregistre (ou génère) un fichier MP3 **par scène**.
2. Range-le dans `voice/<id du chapitre>/<id de la scène>.mp3`, par exemple :
   ```
   voice/module-04-ch1/01-titre.mp3
   voice/module-04-ch1/02-variation.mp3
   ```
3. Relance `npm run render -- module-04-ch1` (ou redémarre `npm run studio`).

Si le fichier existe, **la scène dure exactement le temps de la voix, plus 0,6 s de respiration**
(réglable dans `src/theme.ts`, `MARGE_APRES_VOIX`). Sinon, la scène garde la durée du JSON et
la vidéo a une piste audio silencieuse. Tu peux n'enregistrer que certaines scènes.

Les sous-titres reprennent le texte `voix` du JSON, découpé en morceaux d'une ou deux lignes
et répartis sur la durée de la scène selon leur longueur. Pour qu'ils collent bien à
l'enregistrement, lis le texte tel qu'il est écrit dans le JSON.

## 6. Ajouter une musique de fond (optionnel)

- Dépose un fichier audio (mp3, wav, m4a…) dans `music/`. **Uniquement une musique dont tu as
  la licence** (achetée ou libre de droits avec autorisation d'usage commercial).
- Par défaut, le premier fichier de `music/` (ordre alphabétique) est utilisé pour tous les
  chapitres. Pour en choisir un précis : `"musique": "nom-du-fichier.mp3"` dans le JSON.
- Elle est jouée en boucle à bas volume (8 %), avec un fondu au début et à la fin.
  Volume réglable dans `src/theme.ts` (`VOLUME_MUSIQUE`).

Aucune musique ni image n'est incluse dans le projet.

---

## 7. Style et mise en page

Le style est identique pour tous les modules et se règle dans `src/theme.ts` :

- fond marine `#0F1B2D`, cartes `#18283F`, bordures `#2A3F5C` ;
- textes `#FFFFFF` / `#DCE5EE`, texte secondaire `#9FB0C4` ;
- accents turquoise `#4FD1BC` et ambre `#F2B84B` ;
- polices **Space Grotesk** (titres) et **Inter** (texte). Elles sont sous licence libre
  (SIL Open Font License) et incluses dans le projet, donc pas besoin d'Internet ;
- pied de page discret « Formation Mesures et Confiance ».

**Modèle de mise en page : « Éditorial »** (par défaut). Grand titre avec une barre turquoise,
très grands chiffres, étiquettes en capitales, filets fins plutôt que des cartes.
En 16:9 : le titre est dans une colonne à gauche, le contenu à droite.
En 9:16 : le titre en haut, le contenu en dessous.
Le code de ces scènes est dans `src/scenes/editorial/`.

L'ancien modèle « Cartes » est conservé (`src/scenes/`). Pour le retrouver, change
`MODELE_PAR_DEFAUT` en `'cartes'` dans `src/theme.ts`.

D'autres palettes de couleurs sont aussi décrites dans `src/theme.ts` (`DIRECTIONS`).
La palette par défaut reste « bleu-nuit », celle de la charte ci-dessus.

Deux commandes servent à comparer des styles sans toucher aux vidéos :

- `npm run directions` : la même scène avec chaque palette de couleurs (`out/directions/`) ;
- `npm run maquettes` : la scène « barres-comparaison » dans 5 mises en page (`out/maquettes/`).

**Format 9:16 (TikTok)** : le haut (≈ 180 px) et le bas (≈ 400 px) de l'image sont laissés
sans contenu important, car TikTok y affiche ses boutons et la description. Le pied de page,
lui, est placé dans la zone basse et peut être en partie recouvert sur TikTok.

**Typographie** : à l'affichage seulement, une espace insécable est mise avant « : ; ! ? »
et dans les nombres (« 2 000 »), pour éviter qu'une ligne commence par « : » ou coupe un
nombre en deux. Les fichiers JSON ne sont jamais modifiés.

## 8. Vérifier qu'aucun texte ne déborde

```
npm run stills -- module-04-ch1
```

La commande crée une image de chaque scène (à la fin de la scène, quand tout est affiché) dans
les deux formats, et mesure chaque texte : titre, contenu, et **tous** les morceaux de
sous-titres. Si un texte sort de sa zone, la liste des problèmes s'affiche, par exemple :

```
⚠️  1 débordement(s) détecté(s) :
   - 9x16 · 08-a-eviter · contenu : sort de sa zone : « … »
```

Dans ce cas, raccourcis le texte concerné (c'est ton contenu, à toi de choisir la formulation)
ou signale-le pour qu'on ajuste la mise en page. Regarde aussi les images dans `out/stills/`.

---

## 9. Ouvrir les vidéos

Les MP4 sont dans le dossier `out/`. Double-clique dessus : ils s'ouvrent avec le lecteur
habituel (QuickTime sur Mac, Lecteur multimédia ou Films et TV sur Windows, ou VLC).

## 10. En cas de problème

- **`npm` n'est pas reconnu** : Node.js n'est pas installé, ou le terminal a été ouvert
  avant l'installation. Ferme et rouvre le terminal.
- **Le rendu n'arrive pas à télécharger le navigateur** (réseau d'entreprise, pare-feu) :
  indique le chemin d'un Chrome déjà installé avec la variable `REMOTION_BROWSER_EXECUTABLE`.
  Par exemple, sur Mac :
  `REMOTION_BROWSER_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run render -- module-04-ch1`
- **« Chapitre introuvable »** : vérifie le nom du fichier dans `scripts/` (sans `.json`).

---

## 11. Licence de Remotion : à vérifier avant de vendre la formation

D'après le fichier de licence officiel de Remotion (lu en novembre 2026) :

- l'usage est **gratuit, y compris commercial**, pour un **particulier**, une entreprise à but
  lucratif de **3 salariés maximum**, une association, ou pour une évaluation sans usage commercial ;
- au-delà, une **licence entreprise payante** est obligatoire (tarifs sur remotion.dev) ;
- il est interdit de revendre Remotion lui-même. Vendre les **vidéos** produites est autorisé.

La licence annonce un changement « léger » avec Remotion 5.0. Ce projet utilise
**Remotion 4.0.547**. Relis la page officielle avant toute commercialisation :
<https://www.remotion.dev/docs/license>.

Les polices Inter et Space Grotesk sont sous licence SIL Open Font License 1.1, qui autorise
l'usage commercial.

## 12. Règles de contenu suivies par ce projet

- Les textes sont affichés exactement comme dans les JSON : aucune donnée de santé, aucun
  chiffre ni aucune promesse n'est ajouté par le code.
- Les courbes d'exemple portent toujours le badge « Exemple illustratif ».
- Aucun visage, aucune personne, aucune marque, aucune image ni musique externe.
