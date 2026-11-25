// Mise en page adaptée à chaque format (16:9 pour la formation, 9:16 pour TikTok).
import {useVideoConfig} from 'remotion';

export type Mise = {
  vertical: boolean;
  largeur: number;
  hauteur: number;
  margeX: number;
  // Zone du titre
  titreHaut: number;
  tailleTitre: number;
  // Zone du contenu (entre le titre et les sous-titres)
  contenuHaut: number;
  contenuBas: number; // distance depuis le bas de l'image
  tailleTexte: number;
  tailleTexteGrand: number;
  tailleTextePetit: number;
  // Sous-titres
  sousTitresBas: number;
  sousTitresHauteur: number;
  tailleSousTitres: number;
  largeurSousTitres: number;
  caracteresParSousTitre: number;
  // Pied de page
  piedBas: number;
  taillePied: number;
};

const HORIZONTAL: Omit<Mise, 'largeur' | 'hauteur'> = {
  vertical: false,
  margeX: 120,
  titreHaut: 80,
  tailleTitre: 68,
  contenuHaut: 220,
  contenuBas: 250,
  tailleTexte: 38,
  tailleTexteGrand: 52,
  tailleTextePetit: 28,
  sousTitresBas: 80,
  sousTitresHauteur: 140,
  tailleSousTitres: 38,
  largeurSousTitres: 1560,
  caracteresParSousTitre: 110,
  piedBas: 28,
  taillePied: 22,
};

// En vertical, on garde libres le haut (≈ 180 px) et le bas (≈ 380 px)
// où TikTok affiche ses boutons et la description.
const VERTICAL: Omit<Mise, 'largeur' | 'hauteur'> = {
  vertical: true,
  margeX: 80,
  titreHaut: 200,
  tailleTitre: 76,
  contenuHaut: 470,
  contenuBas: 650,
  tailleTexte: 44,
  tailleTexteGrand: 58,
  tailleTextePetit: 32,
  sousTitresBas: 400,
  sousTitresHauteur: 200,
  tailleSousTitres: 44,
  largeurSousTitres: 920,
  caracteresParSousTitre: 66,
  piedBas: 340,
  taillePied: 24,
};

export const useMise = (): Mise => {
  const {width, height} = useVideoConfig();
  const base = height > width ? VERTICAL : HORIZONTAL;
  return {...base, largeur: width, hauteur: height};
};
