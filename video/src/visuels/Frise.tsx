// Frise de semaines (cases), avec des repères optionnels sur certaines cases.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';

export const Frise: React.FC<{nombre: number; largeur: number; debut: number; reperes?: number[]; hauteur?: number}> = ({
  nombre,
  largeur,
  debut,
  reperes = [],
  hauteur = 64,
}) => {
  const frame = useCurrentFrame();
  const gap = 12;
  const w = (largeur - gap * (nombre - 1)) / nombre;
  return (
    <div style={{display: 'flex', gap}}>
      {Array.from({length: nombre}).map((_, i) => {
        const o = Math.max(0, Math.min(1, (frame - debut - i * 4) / 10));
        const marque = reperes.includes(i);
        return (
          <div
            key={i}
            style={{
              width: w,
              height: hauteur,
              borderRadius: 12,
              border: `2px solid ${marque ? C.menthe : C.bordure}`,
              background: marque ? 'rgba(79,209,188,0.18)' : 'transparent',
              opacity: o,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {marque && <div style={{width: 18, height: 18, borderRadius: 9, background: C.menthe}} />}
          </div>
        );
      })}
    </div>
  );
};
