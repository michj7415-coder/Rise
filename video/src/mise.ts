// Mise en page selon le format : 16:9 (1920×1080) ou 9:16 (1080×1920).
// Zones de sécurité : aucun texte à l'écran dans les 12 % du bas (16:9)
// ni dans les 20 % du bas (9:16) — c'est la zone des sous-titres.
import {useVideoConfig} from 'remotion';

export const useMise = () => {
  const {width: L, height: H} = useVideoConfig();
  const v = H > L;
  const zoneSousTitres = Math.round(H * (v ? 0.2 : 0.12));
  return {
    L,
    H,
    v,
    margeX: v ? 72 : 120,
    enTeteHaut: v ? 120 : 44, // « RISE · Module 1 / 9 »
    contenuHaut: v ? 230 : 140,
    contenuBas: zoneSousTitres + (v ? 40 : 36), // distance depuis le bas
    zoneSousTitres,
    titre: v ? 84 : 76,
    texte: v ? 46 : 40,
    petit: v ? 34 : 30,
    grandChiffre: v ? 200 : 180,
    sousTitre: v ? 40 : 34,
  };
};
export type Mise = ReturnType<typeof useMise>;
