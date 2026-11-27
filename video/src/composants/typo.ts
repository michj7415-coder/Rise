// Typographie française à l'affichage seulement : espaces insécables devant « : ; ! ? % »,
// après « « » et avant « » », et entre un chiffre et son unité. Les mots ne changent pas.
export const typo = (t: string) =>
  t
    .replace(/ ([:;!?%»])/g, ' $1')
    .replace(/« /g, '« ')
    .replace(/(\d) (cm|kg|%|semaines?|points?|g)\b/g, '$1 $2');
