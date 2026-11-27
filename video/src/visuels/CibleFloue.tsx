// Cible avec une zone floue qui s'élargit autour du centre : la mesure est imprécise.
import React from 'react';
import {useTrace} from '../composants/Anim';
import {C} from '../theme';

export const CibleFloue: React.FC<{taille: number; debut: number}> = ({taille, debut}) => {
  const p = useTrace(debut, 60);
  const c = taille / 2;
  return (
    <svg width={taille} height={taille}>
      <defs>
        <radialGradient id="flou">
          <stop offset="0%" stopColor={C.ambre} stopOpacity={0.55} />
          <stop offset="100%" stopColor={C.ambre} stopOpacity={0} />
        </radialGradient>
      </defs>
      {[0.46, 0.32, 0.18].map((r) => (
        <circle key={r} cx={c} cy={c} r={taille * r} fill="none" stroke={C.texteDoux} strokeWidth={2.4} />
      ))}
      <circle cx={c} cy={c} r={taille * (0.06 + 0.26 * p)} fill="url(#flou)" />
      <circle cx={c} cy={c} r={7} fill={C.gris} />
    </svg>
  );
};
