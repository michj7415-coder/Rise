// Vidéo d'un module : scènes enchaînées par un fondu de 12 images, voix, sous-titres,
// en-tête « RISE · Module N / 9 » et barre de progression.
import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, staticFile, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Controle} from './composants/Controle';
import {EnTete} from './composants/EnTete';
import {Fond} from './composants/Fond';
import {FriseEtapes} from './composants/FriseEtapes';
import {Progression} from './composants/Progression';
import {SousTitres} from './composants/SousTitres';
import {useMise} from './mise';
import {MODULES} from './modules';
import {MARGE_FIN, fractionCle} from './partage/decoupage';
import {Scene} from './scenes/Scene';
import {C, TRANSITION} from './theme';

export type PropsModule = {module: number; durees?: number[]; verifier?: boolean};

export const cheminAudio = (module: number, id: string) => `audio/m${module}/${id}.mp3`;
export const audioExiste = (chemin: string) => getStaticFiles().some((f) => f.name === chemin);

// Image (dans la scène) où un mot-clé de la narration est prononcé.
export const imageCle = (narration: string, mot: string, dureeImages: number, fps: number) => {
  const debutVoix = 0.1 * fps;
  const finVoix = dureeImages - MARGE_FIN * fps;
  return Math.round(debutVoix + fractionCle(narration, mot) * (finVoix - debutVoix));
};

export const Module: React.FC<PropsModule> = ({module, durees, verifier}) => {
  const {fps} = useVideoConfig();
  const m = useMise();
  const config = MODULES.find((x) => x.data.module === module)!;
  const scenes = config.data.scenes;
  const d = durees ?? scenes.map((s) => Math.round(s.durationSec * fps));
  return (
    <AbsoluteFill data-toile data-limite-bas={m.zoneSousTitres} style={{background: C.marine}}>
      <Fond />
      <TransitionSeries>
        {scenes.map((scene, i) => {
          const chemin = cheminAudio(module, scene.id);
          return (
            <React.Fragment key={scene.id}>
              {i > 0 && <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION})} />}
              <TransitionSeries.Sequence durationInFrames={d[i]} name={scene.id}>
                <AbsoluteFill>
                  <Fond />
                  <FriseEtapes active={config.etapes[scene.id] ?? null} />
                  {audioExiste(chemin) && <Audio src={staticFile(chemin)} />}
                  <Scene visuels={config.scenes} scene={scene} dureeImages={d[i]} cle={(mot) => imageCle(scene.narration, mot, d[i], fps)} />
                  <SousTitres narration={scene.narration} dureeImages={d[i]} verifier={verifier} />
                  {verifier && <Controle scene={scene.id} />}
                </AbsoluteFill>
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      <EnTete module={module} />
      <Progression />
    </AbsoluteFill>
  );
};
