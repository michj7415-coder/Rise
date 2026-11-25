// Petites icônes dessinées à la main (aucune image externe).
import React from 'react';
import {COULEURS} from '../theme';

// Coche dans un cercle ; « trace » (0 → 1) dessine la coche.
export const IconeCoche: React.FC<{taille: number; trace?: number; couleur?: string}> = ({
  taille,
  trace = 1,
  couleur = COULEURS.turquoise,
}) => (
  <svg width={taille} height={taille} viewBox="0 0 48 48" style={{flexShrink: 0}}>
    <circle cx="24" cy="24" r="22" fill={`${couleur}22`} stroke={couleur} strokeWidth="2.5" />
    <path
      d="M14 25 L21 32 L34 17"
      fill="none"
      stroke={couleur}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - trace}
    />
  </svg>
);

// Triangle d'alerte.
export const IconeAlerte: React.FC<{taille: number}> = ({taille}) => (
  <svg width={taille} height={taille} viewBox="0 0 48 48" style={{flexShrink: 0}}>
    <path
      d="M24 5 L45 42 L3 42 Z"
      fill={`${COULEURS.ambre}22`}
      stroke={COULEURS.ambre}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <line x1="24" y1="18" x2="24" y2="30" stroke={COULEURS.ambre} strokeWidth="4" strokeLinecap="round" />
    <circle cx="24" cy="36" r="2.4" fill={COULEURS.ambre} />
  </svg>
);

// « i » d'information.
export const IconeInfo: React.FC<{taille: number; couleur?: string}> = ({
  taille,
  couleur = COULEURS.turquoise,
}) => (
  <svg width={taille} height={taille} viewBox="0 0 48 48" style={{flexShrink: 0}}>
    <circle cx="24" cy="24" r="22" fill={`${couleur}22`} stroke={couleur} strokeWidth="2.5" />
    <circle cx="24" cy="14.5" r="2.6" fill={couleur} />
    <line x1="24" y1="21" x2="24" y2="34" stroke={couleur} strokeWidth="4" strokeLinecap="round" />
  </svg>
);
