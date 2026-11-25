// Scène « pastilles » : des étiquettes qui apparaissent une à une.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cadre} from '../components/Cadre';
import {ecart, progression} from '../components/animation';
import {useMise} from '../layout';
import {COULEURS, POLICE_TEXTE} from '../theme';
import type {PropsPastilles} from '../types';
import {typo} from '../typo';

export const Pastilles: React.FC<{props: PropsPastilles; dureeImages: number}> = ({props, dureeImages}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const accent = props.ton === 'alerte' ? COULEURS.ambre : COULEURS.turquoise;
  const debut = 14;
  const pas = ecart(props.pastilles.length, dureeImages, debut);
  return (
    <Cadre titre={props.titre}>
      <div
        style={{
          display: 'flex',
          flexDirection: m.vertical ? 'column' : 'row',
          flexWrap: m.vertical ? 'nowrap' : 'wrap',
          justifyContent: 'center',
          alignItems: m.vertical ? 'stretch' : 'center',
          gap: m.vertical ? 26 : 28,
        }}
      >
        {props.pastilles.map((t, i) => {
          const p = progression(frame, debut + i * pas, 14);
          return (
            <div
              key={i}
              style={{
                opacity: p,
                transform: `scale(${0.92 + 0.08 * p})`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                background: COULEURS.carte,
                border: `2px solid ${props.ton === 'alerte' ? `${COULEURS.ambre}99` : COULEURS.bordure}`,
                borderRadius: 999,
                padding: m.vertical ? '26px 40px' : '22px 38px',
              }}
            >
              <span style={{width: 16, height: 16, borderRadius: 8, background: accent, flexShrink: 0}} />
              <span
                data-texte
                style={{fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: m.tailleTexte, color: COULEURS.texte, lineHeight: 1.25}}
              >
                {typo(t)}
              </span>
            </div>
          );
        })}
      </div>
    </Cadre>
  );
};
