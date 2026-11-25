// Scène « finale » : message de clôture + petite mention.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cadre} from '../components/Cadre';
import {glissement, progression} from '../components/animation';
import {IconeInfo} from '../components/Icones';
import {useMise} from '../layout';
import {COULEURS, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import type {PropsFinale} from '../types';
import {typo} from '../typo';

export const Finale: React.FC<{props: PropsFinale; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  return (
    <Cadre>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: m.vertical ? 56 : 44}}>
        <div style={{width: 120 * progression(frame, 0, 24), height: 6, borderRadius: 3, background: COULEURS.turquoise}} />
        <div
          data-texte
          style={{
            ...glissement(frame, 4),
            fontFamily: POLICE_TITRE,
            fontWeight: 700,
            fontSize: m.tailleTitre * 1.2,
            lineHeight: 1.1,
            color: COULEURS.texte,
            textAlign: 'center',
            letterSpacing: -0.5,
            maxWidth: m.vertical ? undefined : 1400,
          }}
        >
          {typo(props.titre)}
        </div>
        {props.mention && (
          <div
            style={{
              ...glissement(frame, 30, 14),
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 26px',
              borderRadius: 999,
              border: `2px solid ${COULEURS.bordure}`,
              background: COULEURS.carte,
            }}
          >
            <IconeInfo taille={m.tailleTextePetit * 1.2} couleur={COULEURS.texteSecondaire} />
            <span
              data-texte
              style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: m.tailleTextePetit, color: COULEURS.texteSecondaire}}
            >
              {typo(props.mention)}
            </span>
          </div>
        )}
      </div>
    </Cadre>
  );
};
