// Cadre commun à chaque scène : zone de titre en haut et zone de contenu au centre.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useMise} from '../layout';
import {COULEURS, POLICE_TITRE} from '../theme';
import {typo} from '../typo';
import {glissement, progression} from './animation';

export const Cadre: React.FC<{
  titre?: string;
  children: React.ReactNode;
  centrer?: boolean;
}> = ({titre, children, centrer = true}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const avecTitre = Boolean(titre);
  return (
    <AbsoluteFill>
      {avecTitre && (
        <div
          data-zone="titre"
          style={{
            position: 'absolute',
            top: m.titreHaut,
            left: m.margeX,
            right: m.margeX,
            height: m.contenuHaut - m.titreHaut - 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <div
            style={{
              width: 64 * progression(frame, 0, 20),
              height: 6,
              borderRadius: 3,
              background: COULEURS.turquoise,
              marginBottom: 22,
            }}
          />
          <div
            data-texte
            style={{
              ...glissement(frame, 2),
              fontFamily: POLICE_TITRE,
              fontWeight: 700,
              fontSize: m.tailleTitre,
              lineHeight: 1.1,
              letterSpacing: -0.5,
              color: COULEURS.texte,
            }}
          >
            {typo(titre!)}
          </div>
        </div>
      )}
      <div
        data-zone="contenu"
        style={{
          position: 'absolute',
          top: avecTitre ? m.contenuHaut : m.titreHaut,
          bottom: m.contenuBas,
          left: m.margeX,
          right: m.margeX,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: centrer ? 'center' : 'flex-start',
          alignItems: 'stretch',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
