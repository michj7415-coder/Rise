// Modèle « Éditorial » : grand titre en colonne, très grands chiffres, lignes fines.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {glissement, progression} from '../components/animation';
import {useMise} from '../layout';
import {COULEURS, couleurAccent, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import type {PropsBarres} from '../types';
import {typo} from '../typo';
import {partDe} from './outils';

export const ModeleEditorial: React.FC<{props: PropsBarres}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const part = partDe(props.echelle);
  const v = m.vertical;

  const titre = (
    <div style={{display: 'flex', gap: 28, ...glissement(frame, 0)}}>
      <div style={{width: 12, background: COULEURS.turquoise, borderRadius: 2, flexShrink: 0}} />
      <div
        data-texte
        style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: v ? 104 : 112, lineHeight: 0.98, letterSpacing: -2, color: COULEURS.texte}}
      >
        {typo(props.titre)}
      </div>
    </div>
  );
  const note = props.note && (
    <div
      data-texte
      style={{
        ...glissement(frame, 70),
        fontFamily: POLICE_TEXTE,
        fontSize: v ? 30 : 27,
        lineHeight: 1.45,
        color: COULEURS.texteSecondaire,
        borderTop: `1px solid ${COULEURS.bordure}`,
        paddingTop: 22,
      }}
    >
      {typo(props.note)}
    </div>
  );

  const valeurs = (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {props.barres.map((b, i) => {
        const debut = 14 + i * Math.round(1.6 * fps);
        const accent = couleurAccent(b.couleur);
        const rempli = progression(frame, debut + 8, Math.round(1.2 * fps));
        return (
          <div
            key={i}
            style={{
              ...glissement(frame, debut),
              padding: v ? '30px 0' : '26px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${COULEURS.bordure}`,
            }}
          >
            <div
              data-texte
              style={{fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: v ? 30 : 26, letterSpacing: 3, textTransform: 'uppercase', color: COULEURS.texteSecondaire}}
            >
              {typo(b.libelle)}
            </div>
            <div
              data-texte
              style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: v ? 92 : 96, lineHeight: 1.1, letterSpacing: -2, color: accent, whiteSpace: 'nowrap'}}
            >
              {typo(b.texteValeur ?? '')}
            </div>
            <div style={{position: 'relative', height: 8, marginTop: 14, background: COULEURS.bordure, borderRadius: 4}}>
              <div style={{position: 'absolute', inset: 0, width: `${part(b.valeur) * rempli * 100}%`, background: accent, borderRadius: 4}} />
              {b.repere && (
                <>
                  <div style={{position: 'absolute', left: `${part(b.repere.valeur) * 100}%`, top: -12, height: 32, borderLeft: `3px solid ${COULEURS.texte}`}} />
                  {b.repere.libelle && (
                    <div
                      data-texte
                      style={{position: 'absolute', left: `${part(b.repere.valeur) * 100}%`, top: 26, transform: 'translateX(-50%)', fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: 24, color: COULEURS.texte, whiteSpace: 'nowrap'}}
                    >
                      {typo(b.repere.libelle)}
                    </div>
                  )}
                </>
              )}
            </div>
            {i === props.barres.length - 1 && (
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: POLICE_TEXTE, fontSize: 24, color: COULEURS.texteSecondaire}}>
                <span data-texte>{typo(props.echelle.libelleMin ?? '')}</span>
                <span data-texte>{typo(props.echelle.libelleMax ?? '')}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (v) {
    return (
      <AbsoluteFill>
        <div data-zone="contenu" style={{position: 'absolute', top: 190, bottom: m.contenuBas - 20, left: m.margeX, right: m.margeX, display: 'flex', flexDirection: 'column', gap: 30}}>
          {titre}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>{valeurs}</div>
          {note}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div data-zone="contenu" style={{position: 'absolute', top: 90, bottom: m.contenuBas, left: m.margeX, right: m.margeX, display: 'flex', gap: 90}}>
        <div style={{width: 600, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          {titre}
          {note}
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>{valeurs}</div>
      </div>
    </AbsoluteFill>
  );
};
