// Fond : marine, léger halo vert et trame de points discrète (évite les grands aplats vides).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';

export const Fond: React.FC = () => (
  <AbsoluteFill style={{background: C.marine}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 25% 15%, rgba(11,122,107,0.22) 0%, transparent 55%), radial-gradient(ellipse at 85% 90%, rgba(79,209,188,0.08) 0%, transparent 50%)`}} />
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(rgba(220,229,238,0.09) 1.6px, transparent 1.6px)',
        backgroundSize: '44px 44px',
        maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
      }}
    />
  </AbsoluteFill>
);
