// Éditorial — « titre-compteur » : grand titre et compteur géant.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {glissement, progression} from '../../components/animation';
import {COLONNE, Etiquette, GrandTitre} from '../../components/Editorial';
import {nombre} from '../../format';
import {useMise} from '../../layout';
import {COULEURS, POLICE_CHIFFRES} from '../../theme';
import type {PropsTitreCompteur} from '../../types';
import {typo} from '../../typo';

export const TitreCompteurEditorial: React.FC<{props: PropsTitreCompteur; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = m.vertical;
  const {depart, arrivee, decimales = 0, prefixe = '', suffixe = ''} = props.compteur;
  const debut = 18;
  const p = progression(frame, debut, Math.round(1.6 * fps));
  const valeur = depart + (arrivee - depart) * p;

  const compteur = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      {props.legende && (
        <div style={glissement(frame, debut + Math.round(1.2 * fps), 14)}>
          <Etiquette>{props.legende}</Etiquette>
        </div>
      )}
      <div
        data-texte
        style={{
          ...glissement(frame, 10),
          fontFamily: POLICE_CHIFFRES,
          fontWeight: 700,
          fontSize: v ? 230 : 250,
          lineHeight: 1,
          letterSpacing: -8,
          color: COULEURS.ambre,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {typo(`${prefixe}${nombre(valeur, decimales)}${suffixe}`)}
      </div>
      <div style={{height: 8, borderRadius: 4, background: COULEURS.bordure, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${p * 100}%`, background: COULEURS.ambre}} />
      </div>
    </div>
  );

  if (v) {
    return (
      <AbsoluteFill>
        <div data-zone="contenu" style={{position: 'absolute', top: 190, bottom: m.contenuBas - 20, left: m.margeX, right: m.margeX, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 90}}>
          <GrandTitre texte={props.titre} largeur={m.largeur - 2 * m.margeX} max={132} lignesMax={3} />
          {compteur}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 90, bottom: m.contenuBas, left: m.margeX, right: m.margeX, display: 'flex', gap: 90, alignItems: 'center'}}>
        <div data-zone="colonne" style={{width: COLONNE + 80, flexShrink: 0}}>
          <GrandTitre texte={props.titre} largeur={COLONNE + 80} max={150} lignesMax={3} />
        </div>
        <div data-zone="contenu" style={{flex: 1, minWidth: 0}}>
          {compteur}
        </div>
      </div>
    </AbsoluteFill>
  );
};
