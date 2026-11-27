// Fond premium : halos lumineux qui dérivent lentement, trame de points,
// et sol quadrillé en perspective (3D) qui défile très doucement.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

export const Fond: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / 30;
  const x1 = 22 + Math.sin(t * 0.21) * 8;
  const y1 = 18 + Math.cos(t * 0.17) * 6;
  const x2 = 82 + Math.cos(t * 0.15) * 7;
  const y2 = 78 + Math.sin(t * 0.19) * 6;
  const v = height > width;
  return (
    <AbsoluteFill style={{background: C.marine, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 45% at ${x1}% ${y1}%, rgba(11,122,107,0.34) 0%, transparent 70%),
            radial-gradient(ellipse 45% 40% at ${x2}% ${y2}%, rgba(79,209,188,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 50% 120%, rgba(11,122,107,0.18) 0%, transparent 70%)`,
        }}
      />
      {/* Sol quadrillé en perspective */}
      <div
        style={{
          position: 'absolute',
          left: '-50%',
          right: '-50%',
          bottom: v ? '-8%' : '-30%',
          height: v ? '55%' : '75%',
          transform: 'perspective(900px) rotateX(72deg)',
          transformOrigin: '50% 100%',
          backgroundImage: 'linear-gradient(rgba(79,209,188,0.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(79,209,188,0.16) 1.5px, transparent 1.5px)',
          backgroundSize: '90px 90px',
          backgroundPosition: `0 ${(t * 14) % 90}px`,
          maskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 40%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 40%, transparent 85%)',
          opacity: 0.55,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(220,229,238,0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.35) 60%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.35) 60%, transparent 90%)',
        }}
      />
      {/* Vignettage pour la profondeur */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,10,20,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
