// Découpe le texte de la voix off en sous-titres courts (1 à 2 lignes)
// et répartit leur affichage sur la durée de la scène, au prorata de leur longueur.
// Le texte est découpé tel quel : rien n'est ajouté ni retiré.

export type SousTitre = {texte: string; debut: number; fin: number}; // en images

const couperPhrase = (phrase: string, max: number): string[] => {
  if (phrase.length <= max) return [phrase];
  // On coupe de préférence après une virgule, près du milieu.
  const milieu = phrase.length / 2;
  let meilleur = -1;
  for (let i = 0; i < phrase.length; i++) {
    if (phrase[i] === ',' && phrase[i + 1] === ' ') {
      if (meilleur === -1 || Math.abs(i - milieu) < Math.abs(meilleur - milieu)) meilleur = i;
    }
  }
  // Sinon, à l'espace le plus proche du milieu.
  if (meilleur === -1 || Math.abs(meilleur - milieu) > phrase.length * 0.3) {
    meilleur = -1;
    for (let i = 0; i < phrase.length; i++) {
      if (phrase[i] === ' ' && (meilleur === -1 || Math.abs(i - milieu) < Math.abs(meilleur - milieu))) {
        meilleur = i;
      }
    }
    if (meilleur === -1) return [phrase];
    return [
      ...couperPhrase(phrase.slice(0, meilleur), max),
      ...couperPhrase(phrase.slice(meilleur + 1), max),
    ];
  }
  return [
    ...couperPhrase(phrase.slice(0, meilleur + 1), max),
    ...couperPhrase(phrase.slice(meilleur + 2), max),
  ];
};

export const decouper = (voix: string, max: number): string[] => {
  const phrases = voix.trim().match(/[^.!?…]+[.!?…]*\s*/g) ?? [voix];
  return phrases.map((p) => p.trim()).filter(Boolean).flatMap((p) => couperPhrase(p, max));
};

export const planifier = (voix: string, max: number, dureeImages: number, fps: number): SousTitre[] => {
  const morceaux = decouper(voix, max);
  const debutTotal = Math.round(0.15 * fps);
  const finTotal = dureeImages - Math.round(0.3 * fps);
  const disponible = Math.max(1, finTotal - debutTotal);
  const total = morceaux.reduce((a, m) => a + m.length, 0);
  let curseur = debutTotal;
  return morceaux.map((texte, i) => {
    const longueur = Math.round((texte.length / total) * disponible);
    const debut = curseur;
    const fin = i === morceaux.length - 1 ? finTotal : debut + longueur;
    curseur = fin;
    return {texte, debut, fin};
  });
};
