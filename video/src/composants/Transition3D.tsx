// Transition 3D entre deux scènes : la scène sortante recule et pivote légèrement,
// la scène entrante arrive de la profondeur ; un reflet lumineux traverse l'image.
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

type Props = Record<string, never>;

const doux = Easing.bezier(0.65, 0, 0.35, 1);

const Presentation: React.FC<TransitionPresentationComponentProps<Props>> = ({children, presentationDirection, presentationProgress}) => {
  const p = doux(presentationProgress);
  const entre = presentationDirection === 'entering';
  const echelle = entre ? interpolate(p, [0, 1], [1.08, 1]) : interpolate(p, [0, 1], [1, 0.9]);
  const rotY = entre ? interpolate(p, [0, 1], [-9, 0]) : interpolate(p, [0, 1], [0, 9]);
  const z = entre ? interpolate(p, [0, 1], [160, 0]) : interpolate(p, [0, 1], [0, -260]);
  const opacite = entre ? interpolate(p, [0, 0.55, 1], [0, 1, 1]) : interpolate(p, [0, 0.6, 1], [1, 0.4, 0]);
  return (
    <AbsoluteFill style={{perspective: 1800, perspectiveOrigin: '50% 45%'}}>
      <AbsoluteFill style={{transform: `translateZ(${z}px) rotateY(${rotY}deg) scale(${echelle})`, opacity: opacite, transformStyle: 'preserve-3d'}}>
        {children}
      </AbsoluteFill>
      {entre && (
        // Reflet lumineux diagonal qui balaie l'image
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            opacity: interpolate(presentationProgress, [0, 0.5, 1], [0, 0.55, 0]),
            background: `linear-gradient(110deg, transparent ${interpolate(presentationProgress, [0, 1], [-40, 80])}%, rgba(79,209,188,0.22) ${interpolate(presentationProgress, [0, 1], [-20, 100])}%, transparent ${interpolate(presentationProgress, [0, 1], [0, 120])}%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export const transition3D = (): TransitionPresentation<Props> => ({component: Presentation, props: {} as Props});
export const easingTransition = doux;
