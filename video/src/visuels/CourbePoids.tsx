// Graphique schématique : pesées qui montent et descendent d'un jour à l'autre (points),
// puis courbe de la moyenne qui se trace par-dessus. AUCUNE valeur chiffrée : c'est un schéma.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useTrace} from '../composants/Anim';
import {C, POLICE_TEXTE} from '../theme';

// Variations schématiques (sans unité) autour d'une tendance qui descend doucement.
const POINTS = [0.55, 0.42, 0.62, 0.5, 0.38, 0.74, 0.47, 0.4, 0.56, 0.33, 0.45, 0.6, 0.36, 0.3, 0.44, 0.28, 0.4, 0.52, 0.27, 0.32, 0.22];
const TENDANCE = (i: number) => 0.56 - (i / (POINTS.length - 1)) * 0.28;

export const CourbePoids: React.FC<{
  largeur: number;
  hauteur: number;
  debutPoints: number;
  debutMoyenne: number;
  debutEtiquettes?: number;
  etiquettes?: string[]; // ex. ['eau', 'sel', 'sommeil'] reliées à des pics
}> = ({largeur: L, hauteur: H, debutPoints, debutMoyenne, debutEtiquettes, etiquettes = []}) => {
  const frame = useCurrentFrame();
  const mx = 30;
  const my = 70;
  const x = (i: number) => mx + (i / (POINTS.length - 1)) * (L - 2 * mx);
  const y = (v: number) => my + (1 - v) * (H - 2 * my);
  const trace = useTrace(debutMoyenne, 75);
  const pics = [5, 11, 17].slice(0, etiquettes.length);
  const moyenne = POINTS.map((_, i) => `${i ? 'L' : 'M'}${x(i)},${y(TENDANCE(i))}`).join(' ');
  return (
    <svg width={L} height={H} style={{overflow: 'visible'}}>
      <line x1={mx} x2={L - mx} y1={H - 20} y2={H - 20} stroke={C.bordure} strokeWidth={2} />
      {POINTS.map((v, i) => {
        const o = Math.max(0, Math.min(1, (frame - debutPoints - i * 2) / 8));
        return <circle key={i} cx={x(i)} cy={y(v)} r={9} fill={C.marine} stroke={C.texteDoux} strokeWidth={3} opacity={o} />;
      })}
      {debutEtiquettes !== undefined &&
        pics.map((p, k) => {
          const o = Math.max(0, Math.min(1, (frame - debutEtiquettes - k * 10) / 12));
          return (
            <g key={p} opacity={o}>
              <line x1={x(p)} x2={x(p)} y1={y(POINTS[p]) - 14} y2={y(POINTS[p]) - 50} stroke={C.ambre} strokeWidth={2} strokeDasharray="4 5" />
              <text data-texte-svg x={x(p)} y={y(POINTS[p]) - 60} textAnchor="middle" fontFamily={POLICE_TEXTE} fontWeight={600} fontSize={30} fill={C.ambre}>
                {etiquettes[k]}
              </text>
            </g>
          );
        })}
      <path d={moyenne} fill="none" stroke={C.menthe} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trace} />
    </svg>
  );
};
