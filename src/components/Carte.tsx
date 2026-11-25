import React from 'react';
import {COULEURS, DIRECTION} from '../theme';

export const Carte: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  bordure?: string;
}> = ({children, style, bordure = COULEURS.bordure}) => (
  <div
    style={{
      background: COULEURS.carte,
      border: `2px solid ${bordure}`,
      borderRadius: DIRECTION.rayon,
      ...style,
    }}
  >
    {children}
  </div>
);
