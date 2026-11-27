// Sous-titres incrustés dans la zone du bas (12 % en 16:9, 20 % en 9:16).
// Même découpage que le fichier .srt (src/partage/decoupage.js).
import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useMise} from '../mise';
import {MAX_SOUS_TITRE, planSousTitres} from '../partage/decoupage';
import {POLICE_TEXTE} from '../theme';
import {typo} from './typo';

export const SousTitres: React.FC<{narration: string; dureeImages: number; verifier?: boolean}> = ({narration, dureeImages, verifier}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const plan = useMemo(
    () => planSousTitres(narration, dureeImages / fps, m.v ? MAX_SOUS_TITRE.vertical : MAX_SOUS_TITRE.horizontal),
    [narration, dureeImages, fps, m.v],
  );
  const t = frame / fps;
  const actuel = plan.find((s) => t >= s.debut && t < s.fin);
  const style: React.CSSProperties = {
    maxWidth: '100%',
    boxSizing: 'border-box',
    background: 'rgba(5, 12, 22, 0.86)',
    borderRadius: 12,
    padding: m.v ? '12px 22px' : '8px 22px',
    fontFamily: POLICE_TEXTE,
    fontWeight: 600,
    fontSize: m.sousTitre,
    lineHeight: 1.28,
    color: '#FFFFFF',
    textAlign: 'center',
  };
  // Zone : en 16:9 les 12 % du bas ; en 9:16 la partie haute des 20 % du bas (au-dessus de l'interface TikTok).
  const bas = m.v ? Math.round(m.zoneSousTitres * 0.42) : 16;
  const haut = m.v ? m.zoneSousTitres - 30 : m.zoneSousTitres - 8;
  return (
    <div
      data-zone="sous-titres"
      style={{
        position: 'absolute',
        left: m.margeX - (m.v ? 24 : 0),
        right: m.margeX - (m.v ? 24 : 0),
        bottom: bas,
        height: haut - bas,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {verifier &&
        plan.map((s, i) => (
          <div key={i} data-texte data-lignes-max={2} style={{...style, position: 'absolute', bottom: 0, visibility: 'hidden'}}>
            {typo(s.texte)}
          </div>
        ))}
      {actuel && (
        <div data-texte data-lignes-max={2} style={{...style, opacity: interpolate(t, [actuel.debut, actuel.debut + 0.12], [0, 1], {extrapolateRight: 'clamp'})}}>
          {typo(actuel.texte)}
        </div>
      )}
    </div>
  );
};
