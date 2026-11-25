// Éditorial — « courbe-illustrative » en 3D.
// Le graphique apparaît à plat, la courbe se dessine, puis la caméra pivote en douceur
// pour révéler un ruban en relief posé sur un sol quadrillé.
// Toujours marqué « Exemple illustratif » ; seuls les points du JSON sont tracés.
import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {progression} from '../../components/animation';
import {COLONNE, PageEditoriale} from '../../components/Editorial';
import {nombre} from '../../format';
import {useMise} from '../../layout';
import {COULEURS, POLICE_CHIFFRES, POLICE_TEXTE} from '../../theme';
import type {PropsCourbe} from '../../types';
import {trace} from '../CourbeIllustrative';

const COUCHES = 26; // nombre de couches empilées pour donner l'épaisseur du ruban
const EPAISSEUR = 150; // épaisseur du ruban, en pixels
const PROFONDEUR_SOL = 420;
const SOL_AVANT = 220; // partie du sol devant le ruban

const doux = Easing.bezier(0.45, 0, 0.2, 1);

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

// Mélange une couleur hexadécimale avec le fond (t = 0 : couleur, t = 1 : fond).
const melange = (a: string, b: string, t: number) => {
  const ca = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const cb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${ca.map((x, i) => Math.round(x + (cb[i] - x) * t)).join(',')})`;
};

export const Courbe3DEditorial: React.FC<{props: PropsCourbe; dureeImages: number}> = ({props, dureeImages}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = m.vertical;
  const mention = props.mention || 'Exemple illustratif';
  const ux = props.uniteX ? ` ${props.uniteX}` : '';
  const uy = props.uniteY ? ` ${props.uniteY}` : '';

  // Dimensions du plan du graphique
  const L = v ? m.largeur - 2 * m.margeX : m.largeur - 2 * m.margeX - COLONNE - 90;
  const H = v ? 600 : 620;
  const marge = {g: v ? 90 : 100, d: 70, h: 140, b: 90};
  const pw = L - marge.g - marge.d;
  const ph = H - marge.h - marge.b;
  const base = marge.h + ph;

  const xs = props.points.map((p) => p.x);
  const ys = props.points.map((p) => p.y);
  const [xMin, xMax, yMin, yMax] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const ecartY = yMax - yMin || 1;
  const y0 = yMin - ecartY * 0.45;
  const y1 = yMax + ecartY * 0.25;
  const sx = (x: number) => marge.g + ((x - xMin) / (xMax - xMin || 1)) * pw;
  const sy = (y: number) => marge.h + (1 - (y - y0) / (y1 - y0)) * ph;
  const pts = props.points.map((p) => ({x: sx(p.x), y: sy(p.y)}));
  const courbe = trace(pts);
  const aire = `${courbe} L${pts[pts.length - 1].x},${base} L${pts[0].x},${base} Z`;

  // Chronologie
  const debutDessin = 16;
  const dureeDessin = Math.round(1.8 * fps);
  const debut3D = debutDessin + dureeDessin - 6;
  const duree3D = Math.round(1.8 * fps);
  const dessin = progression(frame, debutDessin, dureeDessin);
  const p3D = interpolate(frame, [debut3D, debut3D + duree3D], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: doux});
  // Légère dérive de la caméra jusqu'à la fin de la scène
  const derive = interpolate(frame, [debut3D + duree3D, dureeImages], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rotX = p3D * -26 - derive * 3;
  const rotY = p3D * -26 + derive * 6;
  const echelle = interpolate(frame, [0, 20], [0.94, 1], {extrapolateRight: 'clamp', easing: doux}) * (1 - p3D * 0.1);
  const apparition = progression(frame, 0, 18);
  const epaisseur = EPAISSEUR * p3D;

  const texte = {fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: v ? 30 : 28, color: COULEURS.texteSecondaire} as const;
  const idClip = `clip-courbe-${v ? 'v' : 'h'}`;
  const plan: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: L, height: H};

  return (
    <PageEditoriale titre={props.titre} aparte={<Badge texte={mention} />}>
      <div style={{width: L, height: H, perspective: 2000, perspectiveOrigin: '50% 30%', opacity: apparition}}>
        <div
          style={{
            position: 'relative',
            width: L,
            height: H,
            transformStyle: 'preserve-3d',
            transform: `scale(${echelle}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* Sol quadrillé, derrière la ligne de base */}
          <div
            style={{
              position: 'absolute',
              left: marge.g,
              top: base,
              width: pw,
              height: PROFONDEUR_SOL + SOL_AVANT,
              transformOrigin: 'top',
              transform: `translateZ(${SOL_AVANT}px) rotateX(-90deg)`,
              backgroundImage: `linear-gradient(${COULEURS.turquoise}55 2px, transparent 2px), linear-gradient(90deg, ${COULEURS.turquoise}55 2px, transparent 2px)`,
              backgroundSize: `${pw / 8}px ${PROFONDEUR_SOL / 4}px`,
              opacity: p3D * 0.9,
              maskImage: 'linear-gradient(to top, transparent, black 30%, black 55%, transparent)',
              WebkitMaskImage: 'linear-gradient(to top, transparent, black 30%, black 55%, transparent)',
            }}
          />
          {/* Couches du ruban, de l'arrière vers l'avant */}
          {Array.from({length: COUCHES}).map((_, i) => {
            const t = 1 - i / (COUCHES - 1); // 1 = arrière, 0 = avant
            if (i === COUCHES - 1) return null;
            return (
              <svg key={i} width={L} height={H} style={{...plan, transform: `translateZ(${-t * epaisseur}px)`, opacity: p3D > 0 ? 1 : 0}}>
                <defs>
                  <clipPath id={`${idClip}-${i}`}>
                    <rect x={0} y={0} width={marge.g + dessin * pw + 8} height={H} />
                  </clipPath>
                </defs>
                <path d={aire} fill={melange(COULEURS.turquoise, COULEURS.fond, 0.5 + t * 0.2)} clipPath={`url(#${idClip}-${i})`} />
                <path d={courbe} fill="none" stroke={melange(COULEURS.turquoise, '#FFFFFF', 0.1 - t * 0.1)} strokeWidth={6} clipPath={`url(#${idClip}-${i})`} />
              </svg>
            );
          })}
          {/* Face avant : surface, courbe, points et étiquettes */}
          <svg width={L} height={H} style={{...plan, transform: 'translateZ(1px)', overflow: 'visible'}}>
            <defs>
              <linearGradient id={`degrade-${idClip}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={melange(COULEURS.turquoise, COULEURS.fond, 0.3)} />
                <stop offset="100%" stopColor={melange(COULEURS.turquoise, COULEURS.fond, 0.72)} />
              </linearGradient>
              <clipPath id={`${idClip}-avant`}>
                <rect x={0} y={0} width={marge.g + dessin * pw + 8} height={H} />
              </clipPath>
            </defs>
            <path d={aire} fill={`url(#degrade-${idClip})`} clipPath={`url(#${idClip}-avant)`} />
            <line x1={marge.g} x2={marge.g + pw} y1={base} y2={base} stroke={COULEURS.texteSecondaire} strokeWidth={2} />
            <path
              d={courbe}
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
              const visible = progression(frame, debutDessin + Math.round(seuil * dureeDessin) - 2, 8);
              return <circle key={i} cx={p.x} cy={p.y} r={(v ? 15 : 14) * visible} fill={COULEURS.fond} stroke={COULEURS.turquoise} strokeWidth={6} />;
            })}
          </svg>
          {/* Valeurs des points, posées sur l'arête arrière du ruban (au-dessus de sa face claire) */}
          <div style={{...plan, transform: `translateZ(${-epaisseur - 2}px)`, pointerEvents: 'none'}}>
            {props.points.map((pt, i) => (
              <div
                key={`v${i}`}
                data-texte
                style={{
                  ...texte,
                  fontFamily: POLICE_CHIFFRES,
                  fontWeight: 700,
                  fontSize: v ? 44 : 40,
                  color: COULEURS.texte,
                  background: 'rgba(8, 15, 27, 0.82)',
                  border: `1px solid ${COULEURS.bordure}`,
                  borderRadius: 10,
                  padding: '4px 14px',
                  position: 'absolute',
                  left: sx(pt.x),
                  top: sy(pt.y) - (v ? 34 : 30),
                  transform: `translate(${i === 0 ? -25 : i === props.points.length - 1 ? -75 : -50}%, -100%)`,
                  whiteSpace: 'nowrap',
                  opacity: progression(frame, debutDessin + Math.round((pts.length > 1 ? i / (pts.length - 1) : 0) * dureeDessin), 10),
                }}
              >
                {nombre(pt.y, Number.isInteger(pt.y) ? 0 : 1)}
                {uy}
              </div>
            ))}
          </div>
          {/* Étiquettes (texte HTML, net même en perspective) */}
          <div style={{...plan, transform: 'translateZ(2px)', pointerEvents: 'none'}}>
            {xs.map((x) => (
              <div
                key={x}
                data-texte
                style={{...texte, position: 'absolute', left: sx(x), top: base + 22, transform: 'translateX(-50%)', whiteSpace: 'nowrap', opacity: progression(frame, 10)}}
              >
                {nombre(x, Number.isInteger(x) ? 0 : 1)}
                {ux}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageEditoriale>
  );
};
