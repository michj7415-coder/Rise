// Scène « titre-compteur » : grand titre + compteur qui monte jusqu'à une valeur.
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Cadre} from '../components/Cadre';
import {Carte} from '../components/Carte';
import {glissement, progression} from '../components/animation';
import {nombre} from '../format';
import {useMise} from '../layout';
import {COULEURS, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import type {PropsTitreCompteur} from '../types';
import {typo} from '../typo';

export const TitreCompteur: React.FC<{props: PropsTitreCompteur; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {depart, arrivee, decimales = 0, prefixe = '', suffixe = ''} = props.compteur;
  const debutCompteur = 18;
  const p = progression(frame, debutCompteur, Math.round(1.6 * fps));
  const valeur = depart + (arrivee - depart) * p;

  return (
    <Cadre>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: m.vertical ? 64 : 48}}>
        <div
          data-texte
          style={{
            ...glissement(frame, 0),
            fontFamily: POLICE_TITRE,
            fontWeight: 700,
            fontSize: m.tailleTitre * 1.35,
            lineHeight: 1.05,
            color: COULEURS.texte,
            textAlign: 'center',
            letterSpacing: -1,
          }}
        >
          {typo(props.titre)}
        </div>
        <Carte
          style={{
            ...glissement(frame, 10),
            padding: m.vertical ? '48px 56px' : '40px 80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            minWidth: m.vertical ? 760 : 720,
          }}
        >
          <div
            data-texte
            style={{
              fontFamily: POLICE_TITRE,
              fontWeight: 700,
              fontSize: m.vertical ? 170 : 150,
              lineHeight: 1,
              color: COULEURS.ambre,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            {typo(`${prefixe}${nombre(valeur, decimales)}${suffixe}`)}
          </div>
          <div
            style={{
              width: `${progression(frame, debutCompteur, Math.round(1.6 * fps)) * 100}%`,
              height: 4,
              borderRadius: 2,
              background: COULEURS.bordure,
            }}
          />
          {props.legende && (
            <div
              data-texte
              style={{
                ...glissement(frame, debutCompteur + Math.round(1.2 * fps), 14),
                fontFamily: POLICE_TEXTE,
                fontWeight: 500,
                fontSize: m.tailleTexte,
                color: COULEURS.texteSecondaire,
                textAlign: 'center',
              }}
            >
              {typo(props.legende)}
            </div>
          )}
        </Carte>
      </div>
    </Cadre>
  );
};
