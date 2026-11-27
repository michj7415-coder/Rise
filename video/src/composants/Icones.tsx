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

export const IconeSoleil: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="8" />
    <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5L37 37M37 11l-3.5 3.5M14.5 33.5L11 37" />
  </Svg>
);
export const IconeTenue: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M17 8l-10 6 4 8 5-3v21h16V19l5 3 4-8-10-6c-1 3-3.5 5-7 5s-6-2-7-5z" />
  </Svg>
);
export const IconeLieu: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M24 43s-13-12-13-23a13 13 0 0 1 26 0c0 11-13 23-13 23z" />
    <circle cx="24" cy="20" r="5" />
  </Svg>
);
export const IconeDrapeau: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 43V6M12 8h22l-5 7 5 7H12" />
  </Svg>
);
