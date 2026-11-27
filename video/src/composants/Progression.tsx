// Barre de progression fine en bas, décollée des bords de l'image.
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useMise} from '../mise';
import {C} from '../theme';

export const Progression: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const m = useMise();
  return (
    <div style={{position: 'absolute', left: m.margeX, right: m.margeX, bottom: m.progressionBas, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.10)', overflow: 'hidden'}}>
      <div style={{height: '100%', width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`, background: C.vert}} />
    </div>
  );
};
