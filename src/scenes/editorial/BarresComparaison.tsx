// Éditorial — « barres-comparaison » : très grands chiffres et barres fines.
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {glissement, progression} from '../../components/animation';
import {Etiquette, NoteBas, PageEditoriale} from '../../components/Editorial';
import {useMise} from '../../layout';
import {COULEURS, couleurAccent, POLICE_CHIFFRES, POLICE_TEXTE} from '../../theme';
import type {PropsBarres} from '../../types';
import {typo} from '../../typo';

export const BarresEditorial: React.FC<{props: PropsBarres; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = m.vertical;
  const {min, max} = props.echelle;
  const part = (x: number) => Math.max(0, Math.min(1, (x - min) / (max - min || 1)));
  const pas = Math.round(2.2 * fps);

  return (
    <PageEditoriale titre={props.titre} aparte={props.note ? <NoteBas texte={props.note} debut={12 + props.barres.length * pas} /> : undefined}>
      {props.barres.map((b, i) => {
        const debut = 12 + i * pas;
        const accent = couleurAccent(b.couleur);
        const rempli = progression(frame, debut + 8, Math.round(1.4 * fps));
        const fin = debut + 8 + Math.round(1.4 * fps);
        return (
          <div key={i} style={{...glissement(frame, debut), padding: v ? '34px 0' : '26px 0', borderTop: i === 0 ? 'none' : `1px solid ${COULEURS.bordure}`}}>
            <Etiquette>{b.libelle}</Etiquette>
            {b.texteValeur && (
              <div
                data-texte
                style={{
                  fontFamily: POLICE_CHIFFRES,
                  fontWeight: 700,
                  fontSize: v ? 92 : 96,
                  lineHeight: 1.1,
                  letterSpacing: -2,
                  color: accent,
                  whiteSpace: 'nowrap',
                  opacity: progression(frame, debut + 4),
                }}
              >
                {typo(b.texteValeur)}
              </div>
            )}
            <div style={{position: 'relative', height: 8, marginTop: 16, background: COULEURS.bordure, borderRadius: 4}}>
              <div style={{position: 'absolute', inset: 0, width: `${part(b.valeur) * rempli * 100}%`, background: accent, borderRadius: 4}} />
              {b.repere && (
                <div style={{opacity: progression(frame, fin)}}>
                  <div style={{position: 'absolute', left: `${part(b.repere.valeur) * 100}%`, top: -14, height: 36, borderLeft: `4px solid ${COULEURS.texte}`, transform: 'translateX(-2px)'}} />
                  {b.repere.libelle && (
                    <div
                      data-texte
                      style={{position: 'absolute', left: `${part(b.repere.valeur) * 100}%`, top: 30, transform: 'translateX(-50%)', fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: v ? 28 : 26, color: COULEURS.texte, whiteSpace: 'nowrap'}}
                    >
                      {typo(b.repere.libelle)}
                    </div>
                  )}
                </div>
              )}
            </div>
            {b.repere?.libelle && <div style={{height: v ? 34 : 30}} />}
            {i === props.barres.length - 1 && (
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: POLICE_TEXTE, fontSize: v ? 28 : 24, color: COULEURS.texteSecondaire}}>
                <span data-texte>{typo(props.echelle.libelleMin ?? '')}</span>
                <span data-texte>{typo(props.echelle.libelleMax ?? '')}</span>
              </div>
            )}
          </div>
        );
      })}
    </PageEditoriale>
  );
};
