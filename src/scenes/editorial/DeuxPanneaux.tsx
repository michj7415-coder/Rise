// Éditorial — « deux-panneaux » : deux colonnes séparées par un filet, sans cartes.
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {glissement} from '../../components/animation';
import {PageEditoriale} from '../../components/Editorial';
import {useMise} from '../../layout';
import {COULEURS, couleurAccent, POLICE_TEXTE, POLICE_TITRE} from '../../theme';
import type {PropsDeuxPanneaux} from '../../types';
import {typo} from '../../typo';

export const DeuxPanneauxEditorial: React.FC<{props: PropsDeuxPanneaux; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = m.vertical;
  const pas = Math.round(1.6 * fps);
  return (
    <PageEditoriale titre={props.titre}>
      <div style={{display: 'flex', flexDirection: v ? 'column' : 'row', gap: v ? 56 : 60}}>
        {props.panneaux.map((p, i) => {
          const accent = couleurAccent(p.couleur);
          return (
            <div key={i} style={{...glissement(frame, 12 + i * pas), flex: 1, borderTop: `6px solid ${accent}`, paddingTop: 30, display: 'flex', flexDirection: 'column', gap: 18}}>
              <div data-texte style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: v ? 72 : 66, lineHeight: 1.05, letterSpacing: -1, color: accent}}>
                {typo(p.titre)}
              </div>
              {p.texte && (
                <div data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: v ? 44 : 40, lineHeight: 1.3, color: COULEURS.texteDoux}}>
                  {typo(p.texte)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageEditoriale>
  );
};
