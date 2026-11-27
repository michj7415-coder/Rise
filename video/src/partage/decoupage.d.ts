export const MARGE_FIN: number;
export function decouperPhrases(texte: string, max: number): string[];
export function planSousTitres(narration: string, dureeScene: number, max: number): {texte: string; debut: number; fin: number}[];
export function fractionCle(narration: string, cle: string): number;
export const MAX_SOUS_TITRE: {horizontal: number; vertical: number};
