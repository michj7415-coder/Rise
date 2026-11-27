import React from 'react';
import {C, RAYON} from '../theme';

export const Carte: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string; fond?: string}> = ({
  children,
  style,
  accent,
  fond = C.marineCarte,
}) => (
  <div
    style={{
      background: fond,
      border: `2px solid ${accent ?? C.bordure}`,
      borderRadius: RAYON,
      padding: '26px 32px',
      ...style,
    }}
  >
    {children}
  </div>
);
