// Charte graphique commune à tous les modules : couleurs, polices, pied de page.
// Plusieurs « directions artistiques » sont disponibles ; « bleu-nuit » est celle par défaut.
// Pour en essayer une autre : npm run directions (images de comparaison).
import {getInputProps} from 'remotion';
import type {Couleur} from './types';

type Direction = {
  nom: string;
  couleurs: {
    fond: string; // arrière-plan
    carte: string; // fond des cartes et des barres vides
    bordure: string;
    texte: string; // titres et texte principal
    texteDoux: string;
    texteSecondaire: string;
    turquoise: string; // accent principal (coches, courbes, barres positives)
    ambre: string; // accent d'alerte (limites, avertissements)
  };
  policeTitre: string;
  policeTexte: string;
  policeChiffres: string;
  motif: 'halo' | 'grille' | 'uni';
  rayon: number; // arrondi des cartes
};

export const DIRECTIONS: Record<string, Direction> = {
  'bleu-nuit': {
    nom: 'Bleu nuit clinique',
    couleurs: {
      fond: '#0F1B2D',
      carte: '#18283F',
      bordure: '#2A3F5C',
      texte: '#FFFFFF',
      texteDoux: '#DCE5EE',
      texteSecondaire: '#9FB0C4',
      turquoise: '#4FD1BC',
      ambre: '#F2B84B',
    },
    policeTitre: '"Space Grotesk", sans-serif',
    policeTexte: 'Inter, sans-serif',
    policeChiffres: '"Space Grotesk", sans-serif',
    motif: 'halo',
    rayon: 24,
  },
  'papier-creme': {
    nom: 'Papier crème',
    couleurs: {
      fond: '#F6F1E9',
      carte: '#FFFDF9',
      bordure: '#E3D8C8',
      texte: '#1E2430',
      texteDoux: '#3A4150',
      texteSecondaire: '#6F6A63',
      turquoise: '#5E8C6E',
      ambre: '#D9734E',
    },
    policeTitre: 'Fraunces, serif',
    policeTexte: 'Inter, sans-serif',
    policeChiffres: 'Fraunces, serif',
    motif: 'uni',
    rayon: 18,
  },
  'neon-doux': {
    nom: 'Néon doux',
    couleurs: {
      fond: '#0B0B12',
      carte: '#16161F',
      bordure: '#2C2B3D',
      texte: '#FFFFFF',
      texteDoux: '#E4E1F5',
      texteSecondaire: '#A19FB8',
      turquoise: '#B69CFF',
      ambre: '#FF8A7A',
    },
    policeTitre: 'Sora, sans-serif',
    policeTexte: 'Inter, sans-serif',
    policeChiffres: 'Sora, sans-serif',
    motif: 'halo',
    rayon: 28,
  },
  'carnet-de-suivi': {
    nom: 'Carnet de suivi',
    couleurs: {
      fond: '#1C1F24',
      carte: '#24282F',
      bordure: '#383E48',
      texte: '#F3F4F6',
      texteDoux: '#D5D9E0',
      texteSecondaire: '#9AA2AE',
      turquoise: '#5DA9E9',
      ambre: '#F5C84B',
    },
    policeTitre: '"IBM Plex Sans", sans-serif',
    policeTexte: '"IBM Plex Sans", sans-serif',
    policeChiffres: '"IBM Plex Mono", monospace',
    motif: 'grille',
    rayon: 8,
  },
  'pastel-apaisant': {
    nom: 'Pastel apaisant',
    couleurs: {
      fond: '#E8EEF3',
      carte: '#F7F9FB',
      bordure: '#CBD6E1',
      texte: '#22324A',
      texteDoux: '#34465F',
      texteSecondaire: '#64748B',
      turquoise: '#7C79D1',
      ambre: '#E0794F',
    },
    policeTitre: '"DM Sans", sans-serif',
    policeTexte: '"DM Sans", sans-serif',
    policeChiffres: '"DM Sans", sans-serif',
    motif: 'uni',
    rayon: 32,
  },
};

export const DIRECTION_PAR_DEFAUT = 'bleu-nuit';
const choix = (getInputProps() as {direction?: string}).direction ?? DIRECTION_PAR_DEFAUT;
export const DIRECTION = DIRECTIONS[choix] ?? DIRECTIONS[DIRECTION_PAR_DEFAUT];

export const COULEURS = DIRECTION.couleurs;

// Modèle de mise en page : « editorial » (par défaut) ou « cartes » (première version).
export const MODELES_DISPONIBLES = ['editorial', 'cartes'] as const;
export const MODELE_PAR_DEFAUT = 'editorial';
const modeleChoisi = (getInputProps() as {modele?: string}).modele ?? MODELE_PAR_DEFAUT;
export const MODELE: (typeof MODELES_DISPONIBLES)[number] =
  (MODELES_DISPONIBLES as readonly string[]).includes(modeleChoisi) ? (modeleChoisi as 'editorial' | 'cartes') : MODELE_PAR_DEFAUT;
export const POLICE_TITRE = DIRECTION.policeTitre;
export const POLICE_TEXTE = DIRECTION.policeTexte;
export const POLICE_CHIFFRES = DIRECTION.policeChiffres;

export const couleurAccent = (c?: Couleur) =>
  c === 'ambre' ? COULEURS.ambre : c === 'neutre' ? COULEURS.texteSecondaire : COULEURS.turquoise;

export const PIED_DE_PAGE = 'Formation Mesures et Confiance';

export const FPS = 30;
// Marge ajoutée après la voix off quand un fichier audio fixe la durée de la scène.
export const MARGE_APRES_VOIX = 0.6;
// Volume de la musique de fond (0 = muet, 1 = plein volume).
export const VOLUME_MUSIQUE = 0.08;
