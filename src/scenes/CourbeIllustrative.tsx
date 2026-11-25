// Scène « courbe-illustrative » : courbe qui se dessine, toujours marquée « Exemple illustratif ».
// Seuls les points donnés dans le JSON sont tracés et étiquetés (aucune valeur ajoutée).
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Cadre} from '../components/Cadre';
import {Carte} from '../components/Carte';
import {glissement, progression} from '../components/animation';
import {nombre} from '../format';
import {useMise} from '../layout';
import {COULEURS, POLICE_TEXTE} from '../theme';
import type {PropsCourbe} from '../types';

// Tracé lissé passant exactement par les points (courbe monotone).
export const trace = (pts: {x: number; y: number}[]) => {
  if (pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = {x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6};
    const c2 = {x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6};
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
  }
  return d;
};

export const CourbeIllustrative: React.FC<{props: PropsCourbe; dureeImages: number}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mention = props.mention || 'Exemple illustratif';
  const ux = props.uniteX ? ` ${props.uniteX}` : '';
  const uy = props.uniteY ? ` ${props.uniteY}` : '';

  // Dimensions du graphique
  const L = m.largeur - 2 * m.margeX;
  const H = m.hauteur - m.contenuHaut - m.contenuBas - (m.vertical ? 40 : 20);
  const marge = {g: m.vertical ? 150 : 170, d: m.vertical ? 50 : 70, h: m.vertical ? 120 : 100, b: m.vertical ? 90 : 80};
  const pw = L - marge.g - marge.d;
  const ph = H - marge.h - marge.b;

  const xs = props.points.map((p) => p.x);
  const ys = props.points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const ecartY = yMax - yMin || 1;
  const y0 = yMin - ecartY * 0.35;
  const y1 = yMax + ecartY * 0.35;
  const sx = (x: number) => marge.g + ((x - xMin) / (xMax - xMin || 1)) * pw;
  const sy = (y: number) => marge.h + (1 - (y - y0) / (y1 - y0)) * ph;
  const pts = props.points.map((p) => ({x: sx(p.x), y: sy(p.y)}));

  const debut = 20;
  const dessin = progression(frame, debut, Math.round(2.2 * fps));
  const valeursY = Array.from(new Set(ys)).sort((a, b) => a - b);
  const texte = {fontFamily: POLICE_TEXTE, fill: COULEURS.texteSecondaire, fontSize: m.tailleTextePetit};

  return (
    <Cadre titre={props.titre}>
      <Carte style={{...glissement(frame, 6), position: 'relative', width: L, height: H}}>
        <div
          data-texte
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            padding: '8px 18px',
            borderRadius: 999,
            border: `2px solid ${COULEURS.ambre}`,
            color: COULEURS.ambre,
            fontFamily: POLICE_TEXTE,
            fontWeight: 600,
            fontSize: m.tailleTextePetit,
            whiteSpace: 'nowrap',
          }}
        >
          {mention}
        </div>
        <svg width={L} height={H} style={{position: 'absolute', inset: 0}}>
          {/* Lignes de repère aux valeurs des points */}
          {valeursY.map((v) => (
            <g key={v} opacity={progression(frame, 10)}>
              <line x1={marge.g} x2={marge.g + pw} y1={sy(v)} y2={sy(v)} stroke={COULEURS.bordure} strokeWidth={2} strokeDasharray="8 10" />
              <text x={marge.g - 24} y={sy(v)} textAnchor="end" dominantBaseline="middle" {...texte}>
                {nombre(v, Number.isInteger(v) ? 0 : 1)}
                {uy}
              </text>
            </g>
          ))}
          {/* Axe horizontal */}
          <line x1={marge.g} x2={marge.g + pw} y1={marge.h + ph} y2={marge.h + ph} stroke={COULEURS.bordure} strokeWidth={2} />
          {xs.map((x) => (
            <text key={x} x={sx(x)} y={marge.h + ph + 48} textAnchor="middle" {...texte} opacity={progression(frame, 10)}>
              {nombre(x, Number.isInteger(x) ? 0 : 1)}
              {ux}
            </text>
          ))}
          {/* Courbe */}
          <path
            d={trace(pts)}
            fill="none"
            stroke={COULEURS.turquoise}
            strokeWidth={m.vertical ? 8 : 7}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - dessin}
          />
          {/* Points */}
          {pts.map((p, i) => {
            const seuil = pts.length > 1 ? i / (pts.length - 1) : 0;
            const visible = progression(frame, debut + Math.round(seuil * 2.2 * fps) - 2, 8);
            return (
              <circle key={i} cx={p.x} cy={p.y} r={(m.vertical ? 13 : 12) * visible} fill={COULEURS.fond} stroke={COULEURS.turquoise} strokeWidth={5} />
            );
          })}
        </svg>
      </Carte>
    </Cadre>
  );
};
