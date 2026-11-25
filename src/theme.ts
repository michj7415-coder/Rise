// Charte graphique commune à tous les modules : couleurs, polices, pied de page.
import type {Couleur} from './types';

export const COULEURS = {
  fond: '#0F1B2D',
  carte: '#18283F',
  bordure: '#2A3F5C',
  texte: '#FFFFFF',
  texteDoux: '#DCE5EE',
  texteSecondaire: '#9FB0C4',
  turquoise: '#4FD1BC',
  ambre: '#F2B84B',
};

export const couleurAccent = (c?: Couleur) =>
  c === 'ambre' ? COULEURS.ambre : c === 'neutre' ? COULEURS.texteSecondaire : COULEURS.turquoise;

export const POLICE_TITRE = '"Space Grotesk", sans-serif';
export const POLICE_TEXTE = 'Inter, sans-serif';

export const PIED_DE_PAGE = 'Formation Mesures et Confiance';

export const FPS = 30;
// Marge ajoutée après la voix off quand un fichier audio fixe la durée de la scène.
export const MARGE_APRES_VOIX = 0.6;
// Volume de la musique de fond (0 = muet, 1 = plein volume).
export const VOLUME_MUSIQUE = 0.08;
