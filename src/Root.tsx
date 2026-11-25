// Déclare deux vidéos par chapitre : <chapitre>-16x9 et <chapitre>-9x16.
import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Chapitre, PropsChapitre} from './Chapitre';
import {chapitres} from './generated/chapitres';
import {FPS, MARGE_APRES_VOIX} from './theme';

// Si une voix off existe pour la scène, sa durée remplace celle du JSON.
const calculerDurees: CalculateMetadataFunction<PropsChapitre> = async ({props}) => {
  const donnees = chapitres.find((c) => c.script.id === props.chapitre)!;
  const durees = await Promise.all(
    donnees.script.scenes.map(async (s) => {
      const fichier = donnees.voix[s.id];
      if (!fichier) return Math.round(s.duree * FPS);
      const secondes = await getAudioDurationInSeconds(staticFile(fichier));
      return Math.ceil((secondes + MARGE_APRES_VOIX) * FPS);
    }),
  );
  return {durationInFrames: durees.reduce((a, b) => a + b, 0), props: {...props, durees}};
};

export const Racine: React.FC = () => (
  <>
    {chapitres.map(({script}) => (
      <React.Fragment key={script.id}>
        <Composition
          id={`${script.id}-16x9`}
          component={Chapitre}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1}
          defaultProps={{chapitre: script.id} as PropsChapitre}
          calculateMetadata={calculerDurees}
        />
        <Composition
          id={`${script.id}-9x16`}
          component={Chapitre}
          width={1080}
          height={1920}
          fps={FPS}
          durationInFrames={1}
          defaultProps={{chapitre: script.id} as PropsChapitre}
          calculateMetadata={calculerDurees}
        />
      </React.Fragment>
    ))}
  </>
);
