// Scène « barres-comparaison » : barres qui se remplissent sur une même échelle,
// avec un repère (par exemple une limite à ne pas dépasser).
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Cadre} from '../components/Cadre';
import {glissement, progression} from '../components/animation';
import {useMise} from '../layout';
import {COULEURS, couleurAccent, POLICE_CHIFFRES, POLICE_TEXTE} from '../theme';
import type {PropsBarres} from '../types';
import {typo} from '../typo';

export const BarresComparaison: React.FC<{props: PropsBarres; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {min, max} = props.echelle;
  const part = (v: number) => Math.max(0, Math.min(1, (v - min) / (max - min || 1)));
  const hauteurBarre = m.vertical ? 56 : 48;
  const ecartBarres = Math.round(2.2 * fps);

  return (
    <Cadre titre={props.titre}>
      <div style={{display: 'flex', flexDirection: 'column', gap: m.vertical ? 56 : 30}}>
        {props.barres.map((b, i) => {
          const debut = 12 + i * ecartBarres;
          const remplissage = progression(frame, debut + 10, Math.round(1.4 * fps));
          const accent = couleurAccent(b.couleur);
          const derniere = i === props.barres.length - 1;
          return (
            <div key={i} style={{...glissement(frame, debut), display: 'flex', flexDirection: 'column', gap: 14}}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: m.vertical ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: m.vertical ? 'flex-start' : 'baseline',
                  gap: m.vertical ? 4 : 24,
                }}
              >
                <div data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: m.tailleTexte, color: COULEURS.texte}}>
                  {typo(b.libelle)}
                </div>
                {b.texteValeur && (
                  <div
                    data-texte
                    style={{
                      fontFamily: POLICE_CHIFFRES,
                      fontWeight: 600,
                      fontSize: m.tailleTexteGrand,
                      color: accent,
                      whiteSpace: 'nowrap',
                      opacity: progression(frame, debut + 10 + Math.round(0.8 * fps)),
                    }}
                  >
                    {typo(b.texteValeur)}
                  </div>
                )}
              </div>
              <div
                style={{
                  position: 'relative',
                  height: hauteurBarre,
                  borderRadius: hauteurBarre / 2,
                  background: COULEURS.carte,
                  border: `2px solid ${COULEURS.bordure}`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${part(b.valeur) * remplissage * 100}%`,
                    borderRadius: hauteurBarre / 2,
                    background: accent,
                  }}
                />
                {b.repere && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${part(b.repere.valeur) * 100}%`,
                      top: -14,
                      bottom: -14,
                      width: 0,
                      borderLeft: `4px dashed ${COULEURS.texte}`,
                      transform: 'translateX(-2px)',
                      opacity: progression(frame, debut + 10 + Math.round(1.4 * fps)),
                    }}
                  />
                )}
              </div>
              {(b.repere?.libelle || derniere) && (
                <div style={{position: 'relative', height: m.tailleTextePetit * 1.3}}>
                  {derniere && props.echelle.libelleMin && (
                    <span data-texte style={{position: 'absolute', left: 0, ...petitTexte(m.tailleTextePetit)}}>
                      {typo(props.echelle.libelleMin)}
                    </span>
                  )}
                  {derniere && props.echelle.libelleMax && (
                    <span data-texte style={{position: 'absolute', right: 0, ...petitTexte(m.tailleTextePetit)}}>
                      {typo(props.echelle.libelleMax)}
                    </span>
                  )}
                  {b.repere?.libelle && (
                    <span
                      data-texte
                      style={{
                        position: 'absolute',
                        left: `${part(b.repere.valeur) * 100}%`,
                        transform: 'translateX(-50%)',
                        ...petitTexte(m.tailleTextePetit),
                        color: COULEURS.texte,
                        fontWeight: 600,
                        opacity: progression(frame, debut + 10 + Math.round(1.4 * fps)),
                      }}
                    >
                      {typo(b.repere.libelle)}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {props.note && (
          <div
            data-texte
            style={{
              ...glissement(frame, 12 + props.barres.length * ecartBarres),
              marginTop: m.vertical ? 8 : 4,
              fontFamily: POLICE_TEXTE,
              fontWeight: 400,
              fontSize: m.tailleTextePetit,
              lineHeight: 1.4,
              color: COULEURS.texteSecondaire,
              borderLeft: `4px solid ${COULEURS.bordure}`,
              paddingLeft: 20,
            }}
          >
            {typo(props.note)}
          </div>
        )}
      </div>
    </Cadre>
  );
};

const petitTexte = (taille: number): React.CSSProperties => ({
  fontFamily: POLICE_TEXTE,
  fontSize: taille,
  color: COULEURS.texteSecondaire,
  whiteSpace: 'nowrap',
});
