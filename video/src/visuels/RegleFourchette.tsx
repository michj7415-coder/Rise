// Règle graduée horizontale avec une fourchette : départ → zone cible.
// Seules les valeurs fournies sont étiquetées.
import React from 'react';
import {useTrace} from '../composants/Anim';
import {C, POLICE_TITRE} from '../theme';

export const RegleFourchette: React.FC<{
  largeur: number;
  depart: number; // ex. 24
  cibleMin: number; // ex. 20
  cibleMax: number; // ex. 22
  debut: number;
  unite?: string;
}> = ({largeur: L, depart, cibleMin, cibleMax, debut, unite = ' %'}) => {
  const min = Math.min(cibleMin, depart) - 2;
  const max = Math.max(cibleMax, depart) + 2;
  const x = (v: number) => 20 + ((v - min) / (max - min)) * (L - 40);
  const H = 190;
  const base = 120;
  const p = useTrace(debut, 50);
  const bande = useTrace(debut + 40, 30);
  const graduations = [];
  for (let v = min; v <= max; v += 1) graduations.push(v);
  const etiquettes = [cibleMin, cibleMax, depart];
  return (
    <svg width={L} height={H} style={{overflow: 'visible'}}>
      <line x1={20} x2={L - 20} y1={base} y2={base} stroke={C.texteDoux} strokeWidth={3} />
      {graduations.map((v) => (
        <line key={v} x1={x(v)} x2={x(v)} y1={base} y2={base - (etiquettes.includes(v) ? 26 : 14)} stroke={C.texteDoux} strokeWidth={2} />
      ))}
      {/* Zone cible */}
      <rect x={x(cibleMin)} y={base - 70} width={(x(cibleMax) - x(cibleMin)) * bande} height={44} rx={10} fill={C.vert} stroke={C.menthe} strokeWidth={2} />
      {/* Flèche du départ vers la zone cible */}
      <path
        d={`M${x(depart)},${base - 48} L${x(cibleMax) + 10},${base - 48}`}
        stroke={C.ambre}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      <path d={`M${x(cibleMax) + 24},${base - 60} L${x(cibleMax) + 10},${base - 48} L${x(cibleMax) + 24},${base - 36}`} fill="none" stroke={C.ambre} strokeWidth={5} strokeLinecap="round" opacity={p > 0.95 ? 1 : 0} />
      <circle cx={x(depart)} cy={base - 48} r={12} fill={C.ambre} />
      {etiquettes.map((v) => (
        <text key={v} x={x(v)} y={base + 50} textAnchor="middle" fontFamily={POLICE_TITRE} fontWeight={700} fontSize={36} fill={v === depart ? C.ambre : C.menthe}>
          {`${v}${unite}`}
        </text>
      ))}
    </svg>
  );
};
