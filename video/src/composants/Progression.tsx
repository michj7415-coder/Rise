// Barre de progression fine, tout en bas de l'image.
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

export const Progression: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: 'rgba(255,255,255,0.08)'}}>
      <div style={{height: '100%', width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`, background: C.vert}} />
    </div>
  );
};
