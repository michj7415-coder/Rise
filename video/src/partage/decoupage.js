// @ts-check
// Fonctions partagées entre la vidéo (navigateur) et les scripts Node (fichier .srt).
// Le texte est seulement découpé : aucun mot n'est ajouté, retiré ou modifié.

/** Fin de la voix : la scène dure « audio + 0,6 s », la voix occupe donc [0 ; durée − 0,6 s]. */
export const MARGE_FIN = 0.6;

/**
 * Découpe une narration en phrases, puis coupe les phrases trop longues
 * (après une virgule, un deux-points ou un point-virgule, sinon à un espace).
 * @param {string} texte
 * @param {number} max nombre de caractères maximum par sous-titre
 * @returns {string[]}
 */
export function decouperPhrases(texte, max) {
  const phrases = (texte.match(/[^.!?…]+(?:[.!?…]+|$)/g) || [texte]).map((p) => p.trim()).filter(Boolean);
  /** @type {string[]} */
  const sortie = [];
  const couper = (/** @type {string} */ p) => {
    if (p.length <= max) {
      sortie.push(p);
      return;
    }
    const milieu = p.length / 2;
    let meilleur = -1;
    for (let i = 0; i < p.length - 1; i++) {
      if (/[,;:]/.test(p[i]) && p[i + 1] === ' ' && (meilleur === -1 || Math.abs(i - milieu) < Math.abs(meilleur - milieu))) meilleur = i;
    }
    if (meilleur > p.length * 0.2 && meilleur < p.length * 0.8) {
      couper(p.slice(0, meilleur + 1));
      couper(p.slice(meilleur + 2));
      return;
    }
    meilleur = -1;
    for (let i = 0; i < p.length; i++) {
      if (p[i] === ' ' && (meilleur === -1 || Math.abs(i - milieu) < Math.abs(meilleur - milieu))) meilleur = i;
    }
    if (meilleur === -1) {
      sortie.push(p);
      return;
    }
    couper(p.slice(0, meilleur));
    couper(p.slice(meilleur + 1));
  };
  phrases.forEach(couper);
  return sortie;
}

/**
 * Horaires (en secondes, depuis le début de la scène) de chaque sous-titre,
 * répartis sur la durée de la voix au prorata du nombre de caractères.
 * @param {string} narration
 * @param {number} dureeScene en secondes
 * @param {number} max
 * @returns {{texte: string, debut: number, fin: number}[]}
 */
export function planSousTitres(narration, dureeScene, max) {
  const morceaux = decouperPhrases(narration, max);
  const total = morceaux.reduce((a, m) => a + m.length, 0);
  const debutVoix = 0.1;
  const finVoix = Math.max(debutVoix + 0.5, dureeScene - MARGE_FIN);
  let t = debutVoix;
  return morceaux.map((texte) => {
    const d = ((finVoix - debutVoix) * texte.length) / total;
    const s = {texte, debut: t, fin: t + d};
    t += d;
    return s;
  });
}

/**
 * Moment (fraction 0 → 1 de la voix) où un mot-clé est prononcé, estimé
 * d'après sa position dans le texte. Renvoie 0 si le mot-clé est absent.
 * @param {string} narration
 * @param {string} cle
 */
export function fractionCle(narration, cle) {
  const i = narration.toLowerCase().indexOf(cle.toLowerCase());
  return i < 0 ? 0 : i / narration.length;
}

/** Nombre maximum de caractères par sous-titre selon le format. */
export const MAX_SOUS_TITRE = {horizontal: 84, vertical: 52};
