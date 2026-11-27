// Silhouette schématique SANS visage : un contour simple (tête ovale, tronc, bras, jambes),
// aucun détail anatomique. rondeur : 0 (fine) → 1 (ronde). vue : face, profil ou dos.
import React from 'react';
import {C} from '../theme';

export const Silhouette: React.FC<{
  hauteur: number;
  rondeur?: number;
  vue?: 'face' | 'profil' | 'dos';
  type?: 'homme' | 'femme' | 'neutre';
  couleur?: string;
  remplissage?: string;
}> = ({hauteur, rondeur = 0.35, vue = 'face', type = 'neutre', couleur = C.menthe, remplissage = 'none'}) => {
  const r = Math.max(0, Math.min(1, rondeur));
  const cx = 50;
  const profil = vue === 'profil';
  // Largeurs (en unités du dessin, hauteur totale 200)
  let epaules = 34 + r * 12 + (type === 'homme' ? 4 : type === 'femme' ? -2 : 0);
  let taille = 22 + r * 30;
  let hanches = 30 + r * 20 + (type === 'femme' ? 6 : 0);
  if (profil) {
    epaules *= 0.5;
    taille = taille * 0.55 + r * 8;
    hanches *= 0.55;
  }
  const jambe = Math.max(9, hanches / 2 - 2);
  const avance = profil ? r * 8 : 0; // ventre légèrement plus en avant de profil
  const tronc = [
    `M${cx - 6},40`,
    `L${cx - epaules / 2},48`,
    `C${cx - epaules / 2 - 1},62 ${cx - taille / 2},74 ${cx - taille / 2},88`,
    `C${cx - taille / 2},100 ${cx - hanches / 2},106 ${cx - hanches / 2},118`,
    `L${cx + hanches / 2 + avance * 0.3},118`,
    `C${cx + hanches / 2 + avance * 0.3},106 ${cx + taille / 2 + avance},100 ${cx + taille / 2 + avance},88`,
    `C${cx + taille / 2 + avance},74 ${cx + epaules / 2 + 1},62 ${cx + epaules / 2},48`,
    `L${cx + 6},40 Z`,
  ].join(' ');
  const jambeG = `M${cx - hanches / 2 + 1},118 L${cx - hanches / 2 + 3},190 Q${cx - hanches / 2 + 3 + jambe / 2},194 ${cx - hanches / 2 + 3 + jambe},190 L${cx - 1},124`;
  const jambeD = `M${cx + hanches / 2 - 1},118 L${cx + hanches / 2 - 3},190 Q${cx + hanches / 2 - 3 - jambe / 2},194 ${cx + hanches / 2 - 3 - jambe},190 L${cx + 1},124`;
  const brasL = epaules / 2;
  const bras = (s: number) =>
    `M${cx + s * brasL},50 C${cx + s * (brasL + 8)},64 ${cx + s * (brasL + 9 + r * 4)},90 ${cx + s * (brasL + 7 + r * 4)},112 Q${cx + s * (brasL + 4 + r * 4)},116 ${cx + s * (brasL + 3 + r * 3)},110 C${cx + s * (brasL + 3)},92 ${cx + s * (brasL + 1)},74 ${cx + s * (brasL - 2)},62`;
  return (
    <svg width={hauteur * 0.6} height={hauteur} viewBox="0 0 100 200" fill={remplissage} stroke={couleur} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round">
      {/* tête : un simple ovale, sans visage */}
      <ellipse cx={cx + (profil ? 2 : 0)} cy={22} rx={profil ? 10 : 11} ry={13} />
      <path d={`M${cx - 5},34 L${cx - 6},41 M${cx + 5},34 L${cx + 6},41`} />
      {!profil && (
        <>
          <path d={bras(-1)} />
          <path d={bras(1)} />
        </>
      )}
      {profil && <path d={`M${cx},50 C${cx + 6},66 ${cx + 7},88 ${cx + 4},110 Q${cx},114 ${cx - 2},108 C${cx},90 ${cx - 1},70 ${cx - 4},58`} />}
      <path d={tronc} />
      <path d={jambeG} />
      <path d={jambeD} />
    </svg>
  );
};
