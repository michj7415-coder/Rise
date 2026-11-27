// « Caméra » : la scène bouge très légèrement en perspective (effet de profondeur vivant).
import React from 'react';
import {useCurrentFrame} from 'remotion';

export const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const rotY = Math.sin(frame / 95) * 1.6;
  const rotX = Math.cos(frame / 120) * 1.0;
  const z = Math.sin(frame / 150) * 14;
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 2200, perspectiveOrigin: '50% 45%'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateZ(${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`, transformStyle: 'preserve-3d'}}>{children}</div>
    </div>
  );
};
