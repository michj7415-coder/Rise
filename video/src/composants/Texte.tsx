// Texte affiché à l'écran. « data-texte » permet le contrôle automatique
// (débordement, nombre de lignes : 2 au maximum par défaut).
import React from 'react';
import {C, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import {typo} from './typo';

export const Texte: React.FC<{
  children: string;
  taille: number;
  titre?: boolean;
  gras?: number;
  couleur?: string;
  centre?: boolean;
  lignesMax?: number;
  style?: React.CSSProperties;
}> = ({children, taille, titre, gras, couleur = C.texte, centre, lignesMax = 2, style}) => (
  <div
    data-texte
    data-lignes-max={lignesMax}
    style={{
      fontFamily: titre ? POLICE_TITRE : POLICE_TEXTE,
      fontWeight: gras ?? (titre ? 700 : 500),
      fontSize: taille,
      lineHeight: titre ? 1.1 : 1.3,
      letterSpacing: titre ? -0.5 : 0,
      color: couleur,
      textAlign: centre ? 'center' : 'left',
      ...style,
    }}
  >
    {typo(children)}
  </div>
);
