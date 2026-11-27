// Carte « verre dépoli » : dégradé translucide, reflet en haut, ombre douce.
import React from 'react';
import {C, RAYON} from '../theme';

export const Carte: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string; fond?: string}> = ({children, style, accent, fond}) => (
  <div
    style={{
      background: fond ?? 'linear-gradient(160deg, rgba(36,58,88,0.78) 0%, rgba(22,38,61,0.72) 55%, rgba(15,27,45,0.78) 100%)',
      border: `1.5px solid ${accent ?? 'rgba(159,176,196,0.22)'}`,
      borderRadius: RAYON,
      padding: '26px 32px',
      boxShadow: `0 24px 60px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.10)${accent ? `, 0 0 0 1px ${accent}22, 0 0 40px ${accent}1f` : ''}`,
      ...style,
    }}
  >
    {children}
  </div>
);
