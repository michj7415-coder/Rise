// Outils communs aux maquettes de mise en page.
import type {PropsBarres} from '../types';

export const partDe = (echelle: PropsBarres['echelle']) => (v: number) =>
  Math.max(0, Math.min(1, (v - echelle.min) / (echelle.max - echelle.min || 1)));

// Sépare « 2 000 mg par jour » en « 2 000 » et « mg par jour » (le texte n'est pas modifié).
export const separerValeur = (texte?: string): [string, string] => {
  if (!texte) return ['', ''];
  const m = texte.match(/^([+\-−]?[\d\s  .,]*\d)\s+(.*)$/);
  return m ? [m[1], m[2]] : [texte, ''];
};
