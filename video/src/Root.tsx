// Déclare deux compositions par module : « ModuleN-16x9 » (1920×1080) et « ModuleN-9x16 » (1080×1920).
import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Module, PropsModule, audioExiste, cheminAudio} from './Module';
import {MODULES} from './modules';
import {MARGE_FIN, fractionCle} from './partage/decoupage';
import {FPS, PRUDENCE_MIN, TRANSITION} from './theme';

// Durée d'une scène : audio + 0,6 s s'il existe, sinon durationSec du JSON.
// Si la scène a une carte de prudence, elle est allongée si besoin pour que la carte
// reste au moins 6 s à l'écran avant le fondu de sortie (et le fondu au noir final).
const calculer: CalculateMetadataFunction<PropsModule> = async ({props}) => {
  const config = MODULES.find((x) => x.data.module === props.module)!;
  const scenes = config.data.scenes;
  const durees = await Promise.all(
    scenes.map(async (s, i) => {
      const chemin = cheminAudio(props.module, s.id);
      let secondes = s.durationSec;
      if (audioExiste(chemin)) secondes = (await getAudioDurationInSeconds(staticFile(chemin))) + MARGE_FIN;
      const cle = config.prudence[s.id];
      if (cle !== undefined) {
        const p = cle ? fractionCle(s.narration, cle) : 0;
        const derniere = i === scenes.length - 1;
        const apres = (derniere ? 1.0 : TRANSITION / FPS) + 0.3; // fondu de sortie + entrée de la carte
        // apparition = 0,1 + p × (d − 0,6 − 0,1)  et  d − apparition ≥ 6 s + apres
        const minimum = (PRUDENCE_MIN + apres + 0.1 - p * (MARGE_FIN + 0.1)) / (1 - p);
        secondes = Math.max(secondes, minimum);
      }
      return Math.ceil(secondes * FPS);
    }),
  );
  const total = durees.reduce((a, b) => a + b, 0) - TRANSITION * (durees.length - 1);
  return {durationInFrames: total, props: {...props, durees}};
};

export const Racine: React.FC = () => (
  <>
    {MODULES.map(({data}) =>
      (
        [
          ['16x9', 1920, 1080],
          ['9x16', 1080, 1920],
        ] as const
      ).map(([format, width, height]) => (
        <Composition
          key={`${data.module}-${format}`}
          id={`Module${data.module}-${format}`}
          component={Module}
          width={width}
          height={height}
          fps={FPS}
          durationInFrames={1}
          defaultProps={{module: data.module} as PropsModule}
          calculateMetadata={calculer}
        />
      )),
    )}
  </>
);
