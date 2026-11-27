// Mise en page selon le format : 16:9 (1920×1080) ou 9:16 (1080×1920).
// Zones de sécurité : aucun texte à l'écran dans les 12 % du bas (16:9)
// ni dans les 20 % du bas (9:16) — c'est la zone des sous-titres.
// Tout le contenu garde une marge confortable avec les bords de l'image.
import {useVideoConfig} from 'remotion';

export const useMise = () => {
  const {width: L, height: H} = useVideoConfig();
  const v = H > L;
  const zoneSousTitres = Math.round(H * (v ? 0.2 : 0.12));
  return {
    L,
    H,
    v,
    margeX: v ? 90 : 150,
    enTeteHaut: v ? 130 : 58, // « RISE · Module 1 / 9 » et frise des étapes
    contenuHaut: v ? 250 : 150,
    contenuBas: zoneSousTitres + (v ? 44 : 40), // distance depuis le bas
    zoneSousTitres,
    progressionBas: v ? 44 : 18, // barre de progression, décollée du bord
    titre: v ? 92 : 84,
    texte: v ? 52 : 46,
    petit: v ? 38 : 34,
    grandChiffre: v ? 270 : 220,
    sousTitre: v ? 40 : 32,
  };
};
export type Mise = ReturnType<typeof useMise>;
