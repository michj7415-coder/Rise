// Écrit un nombre à la française (virgule décimale, espace des milliers).
export const nombre = (n: number, decimales = 0) =>
  n.toLocaleString('fr-FR', {minimumFractionDigits: decimales, maximumFractionDigits: decimales});
