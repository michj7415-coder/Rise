// Modèle « Bento » : grille de tuiles de tailles différentes.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {progression} from '../components/animation';
import {useMise} from '../layout';
import {COULEURS, couleurAccent, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import type {PropsBarres} from '../types';
import {typo} from '../typo';
import {partDe, separerValeur} from './outils';

const Tuile: React.FC<{debut: number; style?: React.CSSProperties; children: React.ReactNode}> = ({debut, style, children}) => {
  const frame = useCurrentFrame();
  const p = progression(frame, debut, 16);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${0.96 + 0.04 * p})`,
        background: COULEURS.carte,
        border: `2px solid ${COULEURS.bordure}`,
        borderRadius: 36,
        padding: 44,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const ModeleBento: React.FC<{props: PropsBarres}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const part = partDe(props.echelle);
  const v = m.vertical;
  const gap = v ? 22 : 24;

  const tuileTitre = (
    <Tuile debut={0} style={{background: COULEURS.turquoise, border: 'none', justifyContent: 'space-between', gap: 24, gridRow: v ? undefined : '1 / span 2'}}>
      <div data-texte style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: v ? 76 : 80, lineHeight: 1.02, letterSpacing: -1.5, color: COULEURS.fond}}>
        {typo(props.titre)}
      </div>
      {props.note && (
        <div data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: v ? 27 : 26, lineHeight: 1.4, color: COULEURS.fond, opacity: 0.85}}>
          {typo(props.note)}
        </div>
      )}
    </Tuile>
  );

  const tuilesValeurs = props.barres.map((b, i) => {
    const debut = 14 + i * Math.round(1.4 * fps);
    const accent = couleurAccent(b.couleur);
    const rempli = progression(frame, debut + 10, Math.round(1.2 * fps));
    const [chiffre, unite] = separerValeur(b.texteValeur);
    return (
      <Tuile key={i} debut={debut} style={{justifyContent: 'space-between', gap: 14}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20}}>
          <div data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: v ? 32 : 30, color: COULEURS.texteDoux}}>
            {typo(b.libelle)}
          </div>
          <span style={{width: 22, height: 22, borderRadius: 11, background: accent, flexShrink: 0}} />
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
          <span data-texte style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: v ? 110 : 104, lineHeight: 1, letterSpacing: -3, color: COULEURS.texte, whiteSpace: 'nowrap'}}>
            {typo(chiffre)}
          </span>
          <span data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: v ? 32 : 30, color: COULEURS.texteSecondaire, whiteSpace: 'nowrap'}}>
            {typo(unite)}
          </span>
        </div>
        <div style={{position: 'relative', height: 18, borderRadius: 9, background: COULEURS.fond}}>
          <div style={{position: 'absolute', inset: 0, width: `${part(b.valeur) * rempli * 100}%`, borderRadius: 9, background: accent}} />
          {b.repere && (
            <div style={{position: 'absolute', left: `${part(b.repere.valeur) * 100}%`, top: -8, bottom: -8, borderLeft: `3px dashed ${COULEURS.texte}`}} />
          )}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: POLICE_TEXTE, fontSize: 22, color: COULEURS.texteSecondaire}}>
          <span data-texte>{typo(props.echelle.libelleMin ?? '')}</span>
          {b.repere?.libelle && (
            <span data-texte style={{color: COULEURS.texte, fontWeight: 600}}>
              ┆ {typo(b.repere.libelle)}
            </span>
          )}
          <span data-texte>{typo(props.echelle.libelleMax ?? '')}</span>
        </div>
      </Tuile>
    );
  });

  return (
    <AbsoluteFill>
      <div
        data-zone="contenu"
        style={{
          position: 'absolute',
          top: v ? 190 : 80,
          bottom: m.contenuBas - (v ? 30 : 10),
          left: m.margeX,
          right: m.margeX,
          display: 'grid',
          gap,
          gridTemplateColumns: v ? '1fr' : '0.85fr 1.15fr',
          gridTemplateRows: v ? 'auto 1fr 1fr' : '1fr 1fr',
        }}
      >
        {tuileTitre}
        {tuilesValeurs}
      </div>
    </AbsoluteFill>
  );
};
