// Une image fixe par scène et par format (out/stills/), plus des contrôles automatiques :
//  - textes qui débordent, sont coupés, dépassent 2 lignes, se chevauchent ou entrent dans la zone des sous-titres
//    (vérifiés à plusieurs moments de chaque scène, images de contrôle dans out/stills/controle/) ;
//  - sous-titres identiques mot pour mot à la narration ;
//  - cartes de prudence affichées au moins 6 s.
import fs from 'node:fs';
import path from 'node:path';
import {renderStill} from '@remotion/renderer';
import {
  FORMATS,
  FPS,
  MARGE_FIN,
  MAX_SOUS_TITRE,
  TRANSITION,
  assembler,
  composition,
  debutsScenes,
  decouperPhrases,
  instantCle,
  lireModule,
  navigateur,
  racine,
} from './commun.mjs';

const n = Number(process.env.MODULE ?? 1);
const data = lireModule(n);
const formats = process.argv.slice(2).filter((a) => a in FORMATS);
const liste = formats.length ? formats : Object.keys(FORMATS);
const seulement = process.env.SCENES ? process.env.SCENES.split(',') : null;
const problemes = [];

// 1. Sous-titres = narration, mot pour mot
for (const s of data.scenes)
  for (const max of Object.values(MAX_SOUS_TITRE)) {
    const recompose = decouperPhrases(s.narration, max).join(' ');
    if (recompose !== s.narration.replace(/\s+/g, ' ').trim()) problemes.push(`${s.id} : les sous-titres ne reprennent pas exactement la narration`);
  }

const serveUrl = await assembler();
const PRUDENCE = {'s01-intro': 'Avant de commencer', 's09-fourchette': 'Et une règle de sécurité', 's10-sans-obsession': 'Si te fixer un chiffre'};

for (const format of liste) {
  const inputProps = {verifier: true};
  const comp = await composition(serveUrl, n, format, inputProps);
  const durees = comp.props.durees;
  const debuts = debutsScenes(durees);
  const dossier = path.join(racine, 'out', 'stills');
  const dossierControle = path.join(dossier, 'controle');
  fs.mkdirSync(dossierControle, {recursive: true});
  for (let i = 0; i < data.scenes.length; i++) {
    const s = data.scenes[i];
    if (seulement && !seulement.includes(s.id)) continue;
    const derniere = i === data.scenes.length - 1;
    const fin = debuts[i] + durees[i] - (derniere ? 40 : TRANSITION + 6);
    // Image principale : fin de scène (tout est affiché). Contrôles : à 25 %, 50 % et 75 % de la scène.
    const moments = [
      [fin, path.join(dossier, `module${n}-${format}-${s.id}.png`)],
      ...[0.25, 0.5, 0.75].map((f) => [debuts[i] + Math.round(durees[i] * f), path.join(dossierControle, `module${n}-${format}-${s.id}-${Math.round(f * 100)}.png`)]),
    ];
    for (const [frame, sortie] of moments) {
      await renderStill({
        composition: comp,
        serveUrl,
        frame,
        output: sortie,
        inputProps: {module: n, ...inputProps},
        browserExecutable: navigateur,
        overwrite: true,
        onBrowserLog: (log) => {
          if (log.text.startsWith('CONTROLE|')) problemes.push(`${format} · ${log.text.slice(9)} (image ${frame})`);
        },
      });
    }
    console.log(`🖼  ${format} ${s.id}`);
    // 3. Carte de prudence ≥ 6 s
    if (s.id in PRUDENCE) {
      const apparition = instantCle(s.narration, PRUDENCE[s.id], durees[i] / FPS, comp.props.mots?.[s.id]);
      const disparition = durees[i] / FPS - (derniere ? 1.0 : TRANSITION / FPS);
      const visible = disparition - apparition;
      console.log(`   ⚠ carte de prudence visible ${visible.toFixed(1)} s`);
      if (visible < 6) problemes.push(`${format} · ${s.id} : carte de prudence visible seulement ${visible.toFixed(1)} s`);
    }
  }
  console.log(`\nDurées (${format}) :`);
  data.scenes.forEach((s, i) => console.log(`   ${s.id.padEnd(20)} ${(durees[i] / FPS).toFixed(1)} s`));
  console.log(`   Total : ${(comp.durationInFrames / FPS).toFixed(1)} s`);
}

if (problemes.length) {
  console.log(`\n⚠️  ${problemes.length} problème(s) :`);
  for (const p of [...new Set(problemes)]) console.log(`   - ${p}`);
  process.exit(2);
}
console.log('\n✅ Aucun problème détecté. Images dans out/stills/.');
