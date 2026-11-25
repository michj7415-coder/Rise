// Assemble un chapitre : enchaîne les scènes, la voix off, la musique et les sous-titres.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ControleDebordement} from './components/ControleDebordement';
import {PiedDePage} from './components/PiedDePage';
import {SousTitres} from './components/SousTitres';
import {chapitres} from './generated/chapitres';
import {BarresComparaison} from './scenes/BarresComparaison';
import {CourbeIllustrative} from './scenes/CourbeIllustrative';
import {DeuxPanneaux} from './scenes/DeuxPanneaux';
import {Finale} from './scenes/Finale';
import {ListeAlerte, ListeCoches} from './scenes/Listes';
import {Pastilles} from './scenes/Pastilles';
import {TitreCompteur} from './scenes/TitreCompteur';
import {COULEURS, DIRECTION, VOLUME_MUSIQUE} from './theme';
import type {Scene} from './types';

export type PropsChapitre = {
  chapitre: string;
  durees?: number[]; // durée de chaque scène en images (calculée automatiquement)
  verifier?: boolean; // active le contrôle des débordements (images fixes)
};

const COMPOSANTS: Record<Scene['type'], React.FC<{props: any; dureeImages: number}>> = {
  'titre-compteur': TitreCompteur,
  'courbe-illustrative': CourbeIllustrative,
  'barres-comparaison': BarresComparaison,
  pastilles: Pastilles,
  'deux-panneaux': DeuxPanneaux,
  'liste-coches': ListeCoches,
  'liste-alerte': ListeAlerte,
  finale: Finale,
};

const FONDU = 10; // images de fondu en fin de scène

const EnveloppeScene: React.FC<{dureeImages: number; children: React.ReactNode}> = ({dureeImages, children}) => {
  const frame = useCurrentFrame();
  const opacite = interpolate(frame, [dureeImages - FONDU, dureeImages], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity: opacite}}>{children}</AbsoluteFill>;
};

export const Chapitre: React.FC<PropsChapitre> = ({chapitre, durees, verifier}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const donnees = chapitres.find((c) => c.script.id === chapitre);
  if (!donnees) throw new Error(`Chapitre introuvable : ${chapitre}`);
  const {script, voix, musique} = donnees;
  const dureesImages = durees ?? script.scenes.map((s) => Math.round(s.duree * fps));

  let debut = 0;
  return (
    <AbsoluteFill data-toile style={{background: COULEURS.fond}}>
      {/* Fond : léger halo, fine grille ou couleur unie selon la direction artistique */}
      {DIRECTION.motif === 'halo' && (
        <AbsoluteFill
          style={{background: `radial-gradient(ellipse at 50% 30%, ${COULEURS.carte} 0%, ${COULEURS.fond} 70%)`}}
        />
      )}
      {DIRECTION.motif === 'grille' && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${COULEURS.bordure}55 1px, transparent 1px), linear-gradient(90deg, ${COULEURS.bordure}55 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      )}
      {musique && (
        <Audio
          src={staticFile(musique)}
          loop
          volume={(f) =>
            VOLUME_MUSIQUE *
            interpolate(f, [0, fps, durationInFrames - 2 * fps, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      )}
      {script.scenes.map((scene, i) => {
        const dureeImages = dureesImages[i];
        const from = debut;
        debut += dureeImages;
        const Composant = COMPOSANTS[scene.type];
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dureeImages} name={`${i + 1}. ${scene.id}`}>
            {voix[scene.id] && <Audio src={staticFile(voix[scene.id])} />}
            <EnveloppeScene dureeImages={dureeImages}>
              <Composant props={scene.props} dureeImages={dureeImages} />
            </EnveloppeScene>
            <SousTitres voix={scene.voix} dureeImages={dureeImages} verifier={verifier} />
            {verifier && <ControleDebordement scene={scene.id} />}
          </Sequence>
        );
      })}
      <PiedDePage />
    </AbsoluteFill>
  );
};
