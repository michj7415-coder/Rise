// Icônes en trait fin, dessinées à la main (aucune image externe).
import React from 'react';
import {C} from '../theme';

type P = {taille: number; couleur?: string; trace?: number};

const Svg: React.FC<P & {children: React.ReactNode}> = ({taille, couleur = C.menthe, children}) => (
  <svg width={taille} height={taille} viewBox="0 0 48 48" fill="none" stroke={couleur} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
    {children}
  </svg>
);

export const IconeCible: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="18" />
    <circle cx="24" cy="24" r="11" />
    <circle cx="24" cy="24" r="4" />
  </Svg>
);
export const IconePhoto: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 16h8l3-5h14l3 5h8v22H6z" />
    <circle cx="24" cy="26" r="7" />
  </Svg>
);
export const IconeRuban: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="16" cy="22" r="10" />
    <circle cx="16" cy="22" r="3" />
    <path d="M16 32h26v-8H24" />
    <path d="M30 32v-4M35 32v-4M40 32v-4" />
  </Svg>
);
export const IconeBalance: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="7" y="10" width="34" height="30" rx="6" />
    <path d="M16 19a10 10 0 0 1 16 0" />
    <path d="M24 19l3-4" />
  </Svg>
);
export const IconeCourbe: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 40h36" />
    <path d="M8 32c6-2 8-12 14-12s8 8 12 6 6-10 8-12" />
  </Svg>
);
export const IconeCoeur: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M24 40S7 30 7 18a8.5 8.5 0 0 1 17-2 8.5 8.5 0 0 1 17 2c0 12-17 22-17 22z" />
  </Svg>
);
export const IconeCoche: React.FC<P> = ({trace = 1, ...p}) => (
  <Svg {...p}>
    <path d="M12 25l8 8 16-17" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trace} strokeWidth={3.4} />
  </Svg>
);
export const IconeCroix: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M14 14l20 20M34 14L14 34" strokeWidth={3.2} />
  </Svg>
);
export const IconeCadenas: React.FC<P & {ferme?: number}> = ({ferme = 1, ...p}) => (
  <Svg {...p}>
    <rect x="10" y="22" width="28" height="20" rx="4" />
    <path d={`M16 22v-6a8 8 0 0 1 16 0v${6 - (1 - ferme) * 0}`} transform={`translate(0 ${-(1 - ferme) * 6})`} />
    <path d="M24 30v5" />
  </Svg>
);
export const IconeReveil: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="26" r="14" />
    <path d="M24 18v8l5 4M9 12l6-5M39 12l-6-5M14 40l-3 4M34 40l3 4" />
  </Svg>
);
export const IconeCalendrier: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="7" y="10" width="34" height="31" rx="4" />
    <path d="M7 19h34M16 6v8M32 6v8" />
  </Svg>
);
export const IconeFiche: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 6h17l9 9v27H12z" />
    <path d="M29 6v9h9M18 24h14M18 30h14M18 36h9" />
  </Svg>
);
export const IconeQuiz: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="18" />
    <path d="M19 19a5 5 0 1 1 7 4.6c-1.4.6-2 1.6-2 3V28" />
    <circle cx="24" cy="34" r="0.6" fill={p.couleur ?? C.menthe} />
  </Svg>
);
export const IconeTableau: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="6" y="9" width="36" height="30" rx="3" />
    <path d="M6 18h36M6 28h36M18 9v30M30 9v30" />
  </Svg>
);
export const IconeFleche: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M8 36L20 24l8 7 12-14" />
    <path d="M32 17h8v8" />
  </Svg>
);
export const IconeAttention: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M24 6l20 35H4z" />
    <path d="M24 19v10" strokeWidth={3} />
    <circle cx="24" cy="35" r="0.8" fill={p.couleur} />
  </Svg>
);
export const IconeDifferent: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 20h24M12 28h24M30 12L18 36" strokeWidth={3} />
  </Svg>
);

export const ICONES_ETAPES = [IconeCible, IconePhoto, IconeRuban, IconeBalance, IconeCourbe, IconeCoeur];
