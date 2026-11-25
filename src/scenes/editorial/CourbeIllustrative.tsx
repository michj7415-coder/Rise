// Éditorial — « courbe-illustrative » : courbe épurée, toujours marquée « Exemple illustratif ».
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {progression} from '../../components/animation';
import {COLONNE, PageEditoriale} from '../../components/Editorial';
import {nombre} from '../../format';
import {useMise} from '../../layout';
import {COULEURS, POLICE_TEXTE} from '../../theme';
import type {PropsCourbe} from '../../types';
import {trace} from '../CourbeIllustrative';

const Badge: React.FC<{texte: string}> = ({texte}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', opacity: progression(frame, 8)}}>
      <div
        data-texte
        style={{
          padding: '10px 22px',
          borderRadius: 999,
          border: `2px solid ${COULEURS.ambre}`,
          color: COULEURS.ambre,
          fontFamily: POLICE_TEXTE,
          fontWeight: 600,
          fontSize: m.vertical ? 30 : 28,
          whiteSpace: 'nowrap',
        }}
      >
        {texte}
      </div>
    </div>
  );
};

export const CourbeEditorial: React.FC<{props: PropsCourbe; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = m.vertical;
  const mention = props.mention || 'Exemple illustratif';
  const ux = props.uniteX ? ` ${props.uniteX}` : '';
  const uy = props.uniteY ? ` ${props.uniteY}` : '';

  const L = v ? m.largeur - 2 * m.margeX : m.largeur - 2 * m.margeX - COLONNE - 90;
  const H = v ? 560 : 640;
  const marge = {g: v ? 130 : 150, d: 30, h: 40, b: 80};
  const pw = L - marge.g - marge.d;
  const ph = H - marge.h - marge.b;

  const xs = props.points.map((p) => p.x);
  const ys = props.points.map((p) => p.y);
  const [xMin, xMax, yMin, yMax] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const ecartY = yMax - yMin || 1;
  const y0 = yMin - ecartY * 0.3;
  const y1 = yMax + ecartY * 0.3;
  const sx = (x: number) => marge.g + ((x - xMin) / (xMax - xMin || 1)) * pw;
  const sy = (y: number) => marge.h + (1 - (y - y0) / (y1 - y0)) * ph;
  const pts = props.points.map((p) => ({x: sx(p.x), y: sy(p.y)}));
  const debut = 20;
  const dessin = progression(frame, debut, Math.round(2.2 * fps));
  const texte = {fontFamily: POLICE_TEXTE, fontWeight: 500, fill: COULEURS.texteSecondaire, fontSize: v ? 30 : 28};
  const valeursY = Array.from(new Set(ys)).sort((a, b) => a - b);

  return (
    <PageEditoriale titre={props.titre} aparte={<Badge texte={mention} />}>
      <svg width={L} height={H} style={{overflow: 'visible'}}>
        {valeursY.map((val) => (
          <g key={val} opacity={progression(frame, 10)}>
            <line x1={marge.g} x2={marge.g + pw} y1={sy(val)} y2={sy(val)} stroke={COULEURS.bordure} strokeWidth={1.5} strokeDasharray="4 10" />
            <text x={marge.g - 24} y={sy(val)} textAnchor="end" dominantBaseline="middle" {...texte}>
              {nombre(val, Number.isInteger(val) ? 0 : 1)}
              {uy}
            </text>
          </g>
        ))}
        <line x1={marge.g} x2={marge.g + pw} y1={marge.h + ph} y2={marge.h + ph} stroke={COULEURS.texteSecondaire} strokeWidth={2} />
        {xs.map((x) => (
          <text key={x} x={sx(x)} y={marge.h + ph + 50} textAnchor="middle" {...texte} opacity={progression(frame, 10)}>
            {nombre(x, Number.isInteger(x) ? 0 : 1)}
            {ux}
          </text>
        ))}
        <path
          d={trace(pts)}
          fill="none"
          stroke={COULEURS.turquoise}
          strokeWidth={v ? 9 : 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - dessin}
        />
        {pts.map((p, i) => {
          const seuil = pts.length > 1 ? i / (pts.length - 1) : 0;
          const visible = progression(frame, debut + Math.round(seuil * 2.2 * fps) - 2, 8);
          return <circle key={i} cx={p.x} cy={p.y} r={(v ? 15 : 14) * visible} fill={COULEURS.fond} stroke={COULEURS.turquoise} strokeWidth={6} />;
        })}
      </svg>
    </PageEditoriale>
  );
};
