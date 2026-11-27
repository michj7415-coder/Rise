// Rendu MP4 (H.264, 30 i/s) + sous-titres .srt.
//   npm run render:16x9 | render:9x16 | render:all
import fs from 'node:fs';
import path from 'node:path';
import {renderMedia} from '@remotion/renderer';
import {assembler, composition, genererSrt, lireModule, navigateur, racine} from './commun.mjs';

const formats = process.argv.slice(2).filter((a) => a === '16x9' || a === '9x16');
const n = Number(process.env.MODULE ?? 1);
const data = lireModule(n);
const serveUrl = await assembler();
fs.mkdirSync(path.join(racine, 'out'), {recursive: true});

for (const format of formats) {
  const comp = await composition(serveUrl, n, format);
  const sortie = path.join(racine, 'out', `module${n}-${format}.mp4`);
  console.log(`🎬 ${path.basename(sortie)} — ${(comp.durationInFrames / comp.fps).toFixed(1)} s`);
  let dernier = -1;
  await renderMedia({
    composition: comp,
    serveUrl,
    codec: 'h264',
    outputLocation: sortie,
    inputProps: {module: n},
    enforceAudioTrack: true,
    browserExecutable: navigateur,
    onProgress: ({progress}) => {
      const p = Math.floor(progress * 10) * 10;
      if (p !== dernier) console.log(`   ${(dernier = p)} %`);
    },
  });
  // Sous-titres : out/moduleN.srt (découpage 16:9) et out/moduleN-9x16.srt (lignes plus courtes)
  const srt = path.join(racine, 'out', format === '16x9' ? `module${n}.srt` : `module${n}-9x16.srt`);
  fs.writeFileSync(srt, genererSrt(data, comp.props.durees, format === '9x16', comp.props.mots));
  console.log(`✅ ${path.relative(racine, sortie)}  +  ${path.relative(racine, srt)}`);
}
