// Éditorial — « finale » : très grand message de fin et mention sous un filet.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {glissement} from '../../components/animation';
import {GrandTitre} from '../../components/Editorial';
import {IconeInfo} from '../../components/Icones';
import {useMise} from '../../layout';
import {COULEURS, POLICE_TEXTE} from '../../theme';
import type {PropsFinale} from '../../types';
import {typo} from '../../typo';

export const FinaleEditorial: React.FC<{props: PropsFinale; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const v = m.vertical;
  const largeur = v ? m.largeur - 2 * m.margeX : 1400;
  return (
    <AbsoluteFill>
      <div
        data-zone="contenu"
        style={{
          position: 'absolute',
          top: v ? 190 : 90,
          bottom: v ? m.contenuBas - 20 : m.contenuBas,
          left: m.margeX,
          right: m.margeX,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: v ? 70 : 56,
        }}
      >
        <div style={{maxWidth: largeur}}>
          <GrandTitre texte={props.titre} largeur={largeur} max={v ? 120 : 140} lignesMax={v ? 4 : 2} />
        </div>
        {props.mention && (
          <div style={{...glissement(frame, 30, 14), display: 'flex', alignItems: 'center', gap: 16, borderTop: `1px solid ${COULEURS.bordure}`, paddingTop: 26, maxWidth: largeur}}>
            <IconeInfo taille={v ? 40 : 36} couleur={COULEURS.texteSecondaire} />
            <span data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: v ? 32 : 30, color: COULEURS.texteSecondaire}}>
              {typo(props.mention)}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
