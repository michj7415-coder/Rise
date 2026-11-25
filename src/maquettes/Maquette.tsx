// Composition de démonstration : une scène « barres-comparaison » dans un modèle de mise en page.
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ControleDebordement} from '../components/ControleDebordement';
import {PiedDePage} from '../components/PiedDePage';
import {SousTitres} from '../components/SousTitres';
import {chapitres} from '../generated/chapitres';
import {BarresComparaison} from '../scenes/BarresComparaison';
import {COULEURS} from '../theme';
import type {PropsBarres} from '../types';
import {ModeleAffiche} from './ModeleAffiche';
import {ModeleBento} from './ModeleBento';
import {ModeleEditorial} from './ModeleEditorial';
import {ModeleJauges} from './ModeleJauges';

export const MODELES = ['cartes', 'editorial', 'jauges', 'bento', 'affiche'] as const;
export type PropsMaquette = {modele: string; chapitre: string; scene: string; verifier?: boolean};

export const Maquette: React.FC<PropsMaquette> = ({modele, chapitre, scene, verifier}) => {
  const {durationInFrames} = useVideoConfig();
  const s = chapitres.find((c) => c.script.id === chapitre)?.script.scenes.find((x) => x.id === scene);
  if (!s || s.type !== 'barres-comparaison') throw new Error('Les maquettes utilisent une scène « barres-comparaison ».');
  const props = s.props as unknown as PropsBarres;
  return (
    <AbsoluteFill data-toile style={{background: COULEURS.fond}}>
      {modele !== 'affiche' && (
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${COULEURS.carte} 0%, ${COULEURS.fond} 70%)`}} />
      )}
      {modele === 'cartes' && <BarresComparaison props={props} dureeImages={durationInFrames} />}
      {modele === 'editorial' && <ModeleEditorial props={props} />}
      {modele === 'jauges' && <ModeleJauges props={props} />}
      {modele === 'bento' && <ModeleBento props={props} />}
      {modele === 'affiche' && <ModeleAffiche props={props} />}
      <SousTitres voix={s.voix} dureeImages={durationInFrames} verifier={verifier} />
      <PiedDePage />
      {verifier && <ControleDebordement scene={`${modele}`} />}
    </AbsoluteFill>
  );
};
