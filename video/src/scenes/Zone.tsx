// Zone de contenu : sous l'en-tête et au-dessus de la zone des sous-titres.
import React from 'react';
import {useMise} from '../mise';

export const Zone: React.FC<{children: React.ReactNode; centre?: boolean; gap?: number; style?: React.CSSProperties}> = ({
  children,
  centre = true,
  gap,
  style,
}) => {
  const m = useMise();
  return (
    <div
      data-zone="contenu"
      style={{
        position: 'absolute',
        top: m.contenuHaut,
        bottom: m.contenuBas,
        left: m.margeX,
        right: m.margeX,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: centre ? 'center' : 'flex-start',
        gap: gap ?? (m.v ? 40 : 30),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
