// Animations : entrées en 3D (l'élément se redresse en perspective en arrivant),
// traits qui se dessinent, phases successives d'une scène.
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const useEntree = (debut: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - debut, fps, config: {damping: 200, mass: 0.9}, durationInFrames: 26});
};

// Entrée 3D : léger basculement (rotateX), recul en profondeur et glissement, puis fondu.
export const Entree: React.FC<{debut: number; children: React.ReactNode; style?: React.CSSProperties; distance?: number; bascule?: number}> = ({
  debut,
  children,
  style,
  distance = 34,
  bascule = 22,
}) => {
  const p = useEntree(debut);
  const q = 1 - p;
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        transform: q > 0.001 ? `perspective(1400px) translate3d(0, ${q * distance}px, ${-q * 160}px) rotateX(${q * bascule}deg)` : undefined,
        transformOrigin: '50% 100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Progression douce 0 → 1 (pour les traits qui se dessinent).
export const useTrace = (debut: number, duree: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [debut, debut + duree], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};

// Phases successives d'une scène (une idée par écran) : passage en profondeur entre phases.
export const Phase: React.FC<{de: number; a?: number; children: React.ReactNode}> = ({de, a, children}) => {
  const frame = useCurrentFrame();
  const fondu = 14;
  if (frame < de || (a !== undefined && frame >= a)) return null;
  const entree = interpolate(frame, [de, de + fondu], [0, 1], {extrapolateRight: 'clamp'});
  const sortie = a === undefined ? 1 : interpolate(frame, [a - fondu, a], [1, 0], {extrapolateLeft: 'clamp'});
  const e = 1 - entree;
  const s = 1 - sortie;
  const transform = e > 0.001 || s > 0.001 ? `perspective(1600px) translateZ(${e * 120 - s * 140}px) rotateY(${-e * 5 + s * 5}deg)` : undefined;
  return <div style={{position: 'absolute', inset: 0, opacity: Math.min(entree, sortie), transform}}>{children}</div>;
};
