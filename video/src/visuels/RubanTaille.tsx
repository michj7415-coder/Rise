// Silhouette schématique avec un mètre ruban qui se dessine au niveau du nombril.
import React from 'react';
import {useTrace} from '../composants/Anim';
import {Silhouette} from '../composants/Silhouette';
import {C} from '../theme';

export const RubanTaille: React.FC<{hauteur: number; debut: number}> = ({hauteur, debut}) => {
  const p = useTrace(debut, 45);
  const w = hauteur * 0.6;
  const cy = (hauteur * 86) / 200; // niveau du nombril dans la silhouette
  return (
    <div style={{position: 'relative', width: w, height: hauteur}}>
      <Silhouette hauteur={hauteur} rondeur={0.35} couleur={C.texteDoux} />
      <svg width={w} height={hauteur} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <ellipse cx={w / 2} cy={cy} rx={w * 0.26} ry={hauteur * 0.025} fill="none" stroke={C.ambre} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
    </div>
  );
};
