// Scène « deux-panneaux » : deux cartes à comparer (côte à côte en 16:9, empilées en 9:16).
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Cadre} from '../components/Cadre';
import {Carte} from '../components/Carte';
import {glissement, progression} from '../components/animation';
import {useMise} from '../layout';
import {COULEURS, couleurAccent, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import type {PropsDeuxPanneaux} from '../types';
import {typo} from '../typo';

export const DeuxPanneaux: React.FC<{props: PropsDeuxPanneaux; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pas = Math.round(1.6 * fps);
  return (
    <Cadre titre={props.titre}>
      <div
        style={{
          display: 'flex',
          flexDirection: m.vertical ? 'column' : 'row',
          alignItems: 'stretch',
          gap: m.vertical ? 24 : 36,
        }}
      >
        {props.panneaux.map((p, i) => {
          const accent = couleurAccent(p.couleur);
          const debut = 12 + i * pas;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div
                  style={{
                    alignSelf: 'center',
                    fontFamily: POLICE_TITRE,
                    fontWeight: 700,
                    fontSize: m.tailleTexteGrand * 1.2,
                    color: COULEURS.texteSecondaire,
                    opacity: progression(frame, debut - 6),
                  }}
                >
                  ≠
                </div>
              )}
              <Carte
                style={{
                  ...glissement(frame, debut),
                  flex: 1,
                  padding: m.vertical ? '44px 48px' : '52px 52px',
                  borderTop: `8px solid ${accent}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <div
                  data-texte
                  style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: m.tailleTexteGrand, lineHeight: 1.15, color: accent}}
                >
                  {typo(p.titre)}
                </div>
                {p.texte && (
                  <div
                    data-texte
                    style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: m.tailleTexte, lineHeight: 1.35, color: COULEURS.texteDoux}}
                  >
                    {typo(p.texte)}
                  </div>
                )}
              </Carte>
            </React.Fragment>
          );
        })}
      </div>
    </Cadre>
  );
};
