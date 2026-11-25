// Animations sobres réutilisées par toutes les scènes.
import {Easing, interpolate} from 'remotion';

const DUREE_APPARITION = 16; // images (≈ 0,5 s)

// Progression de 0 à 1, douce, à partir de l'image « debut ».
export const progression = (frame: number, debut: number, duree = DUREE_APPARITION) =>
  interpolate(frame, [debut, debut + duree], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

// Apparition par léger glissement vers le haut.
export const glissement = (frame: number, debut: number, distance = 28): React.CSSProperties => {
  const p = progression(frame, debut);
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};

// Écart entre l'apparition de plusieurs éléments, pour qu'ils arrivent
// pendant la première moitié environ de la scène.
export const ecart = (nombre: number, dureeImages: number, debut: number) =>
  Math.max(6, Math.min(24, Math.floor((dureeImages * 0.5 - debut) / Math.max(1, nombre))));
