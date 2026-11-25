// Modèle « Affiche » : chiffres géants et bandes de couleur d'un bord à l'autre de l'écran.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {glissement, progression} from '../components/animation';
import {useMise} from '../layout';
import {COULEURS, couleurAccent, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import type {PropsBarres} from '../types';
import {typo} from '../typo';
import {partDe} from './outils';

export const ModeleAffiche: React.FC<{props: PropsBarres}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const part = partDe(props.echelle);
  const v = m.vertical;
  const haut = v ? 200 : 76;
  const bas = m.contenuBas;

  return (
    <AbsoluteFill>
      <div data-zone="contenu" style={{position: 'absolute', top: haut, bottom: bas, left: 0, right: 0, display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: `0 ${m.margeX}px`, ...glissement(frame, 0)}}>
          <span style={{width: 48, height: 6, background: COULEURS.turquoise}} />
          <span data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 700, fontSize: v ? 36 : 32, letterSpacing: 6, textTransform: 'uppercase', color: COULEURS.texte}}>
            {typo(props.titre)}
          </span>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: v ? 60 : 34}}>
          {props.barres.map((b, i) => {
            const debut = 12 + i * Math.round(1.6 * fps);
            const accent = couleurAccent(b.couleur);
            const largeur = part(b.valeur) * progression(frame, debut, Math.round(1.2 * fps));
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', gap: v ? 10 : 6}}>
                <div
                  data-texte
                  style={{
                    ...glissement(frame, debut + 8),
                    padding: `0 ${m.margeX}px`,
                    fontFamily: POLICE_TITRE,
                    fontWeight: 700,
                    fontSize: v ? 96 : 120,
                    lineHeight: 1,
                    letterSpacing: v ? -2 : -4,
                    color: COULEURS.texte,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {typo(b.texteValeur ?? '')}
                </div>
                <div style={{position: 'relative'}}>
                {b.repere && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: part(b.repere.valeur) * m.largeur - 2,
                        top: -12,
                        bottom: -12,
                        width: 4,
                        background: COULEURS.texte,
                        opacity: progression(frame, debut + Math.round(1.2 * fps)),
                      }}
                    />
                    {b.repere.libelle && (
                      <span
                        data-texte
                        style={{
                          position: 'absolute',
                          left: part(b.repere.valeur) * m.largeur + 18,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontFamily: POLICE_TEXTE,
                          fontWeight: 700,
                          fontSize: v ? 28 : 28,
                          color: COULEURS.texte,
                          whiteSpace: 'nowrap',
                          opacity: progression(frame, debut + Math.round(1.2 * fps)),
                        }}
                      >
                        {typo(b.repere.libelle)}
                      </span>
                    )}
                  </>
                )}
                <div style={{height: v ? 84 : 76, width: `${largeur * 100}%`, background: accent, display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
                  <span
                    data-texte
                    style={{
                      paddingLeft: m.margeX,
                      fontFamily: POLICE_TEXTE,
                      fontWeight: 700,
                      fontSize: v ? 28 : 28,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      color: COULEURS.fond,
                      whiteSpace: 'nowrap',
                      opacity: progression(frame, debut + Math.round(0.8 * fps)),
                    }}
                  >
                    {typo(b.libelle)}
                  </span>
                </div>
                </div>
              </div>
            );
          })}
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 24px', fontFamily: POLICE_TEXTE, fontSize: v ? 26 : 24, color: COULEURS.texteSecondaire}}>
            <span data-texte>{typo(props.echelle.libelleMin ?? '')}</span>
            <span data-texte>{typo(props.echelle.libelleMax ?? '')}</span>
          </div>
        </div>
        {props.note && (
          <div data-texte style={{...glissement(frame, 70), padding: `0 ${m.margeX}px`, fontFamily: POLICE_TEXTE, fontSize: v ? 28 : 26, lineHeight: 1.4, color: COULEURS.texteSecondaire}}>
            {typo(props.note)}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
