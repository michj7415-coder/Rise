// Animations douces (ressort amorti, sans rebond) : léger glissement + fondu.
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const useEntree = (debut: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - debut, fps, config: {damping: 200, mass: 0.8}, durationInFrames: 22});
};

export const Entree: React.FC<{debut: number; children: React.ReactNode; style?: React.CSSProperties; distance?: number}> = ({
  debut,
  children,
  style,
  distance = 26,
}) => {
  const p = useEntree(debut);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style}}>{children}</div>;
};

// Progression linéaire douce 0 → 1 (pour les traits qui se dessinent).
export const useTrace = (debut: number, duree: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [debut, debut + duree], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};

// Phases successives d'une scène (une idée par écran) : fondu enchaîné entre phases.
export const Phase: React.FC<{de: number; a?: number; children: React.ReactNode}> = ({de, a, children}) => {
  const frame = useCurrentFrame();
  const fondu = 12;
  if (frame < de || (a !== undefined && frame >= a)) return null;
  const entree = interpolate(frame, [de, de + fondu], [0, 1], {extrapolateRight: 'clamp'});
  const sortie = a === undefined ? 1 : interpolate(frame, [a - fondu, a], [1, 0], {extrapolateLeft: 'clamp'});
  return <div style={{position: 'absolute', inset: 0, opacity: Math.min(entree, sortie)}}>{children}</div>;
};
