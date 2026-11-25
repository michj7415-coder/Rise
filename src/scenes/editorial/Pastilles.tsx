// Éditorial — « pastilles » : étiquettes au trait fin qui apparaissent une à une.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ecart, progression} from '../../components/animation';
import {PageEditoriale} from '../../components/Editorial';
import {useMise} from '../../layout';
import {COULEURS, POLICE_TEXTE} from '../../theme';
import type {PropsPastilles} from '../../types';
import {typo} from '../../typo';

export const PastillesEditorial: React.FC<{props: PropsPastilles; dureeImages: number}> = ({props, dureeImages}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const v = m.vertical;
  const accent = props.ton === 'alerte' ? COULEURS.ambre : COULEURS.turquoise;
  const debut = 14;
  const pas = ecart(props.pastilles.length, dureeImages, debut);
  return (
    <PageEditoriale titre={props.titre}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: v ? 22 : 24, alignContent: 'center'}}>
        {props.pastilles.map((t, i) => {
          const p = progression(frame, debut + i * pas, 14);
          return (
            <div
              key={i}
              style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 16}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                border: `2px solid ${accent}`,
                borderRadius: 999,
                padding: v ? '22px 36px' : '20px 34px',
              }}
            >
              <span style={{width: 14, height: 14, borderRadius: 7, background: accent, flexShrink: 0}} />
              <span data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: v ? 42 : 40, lineHeight: 1.2, color: COULEURS.texte}}>
                {typo(t)}
              </span>
            </div>
          );
        })}
      </div>
    </PageEditoriale>
  );
};
