// Typographie française pour l'affichage uniquement (le texte lui-même n'est pas modifié) :
// espace insécable devant « : ; ! ? » et dans les nombres (« 2 000 »),
// pour éviter qu'une ligne commence par « : » ou coupe un nombre en deux.
export const typo = (texte: string): string =>
  texte
    .replace(/ ([:;!?»])/g, ' $1')
    .replace(/« /g, '« ')
    .replace(/(\d) (?=\d{3}\b)/g, '$1 ')
    .replace(/(\d) (mg|g|kg|h|%)/g, '$1 $2');
