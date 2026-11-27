// Repères de masse grasse chez l'adulte (scène 8 du module 1).
// Chiffres repris tels quels du script du module 1 — ne pas modifier sans validation.
export type Repere = {
  categorie: string;
  homme: string;
  femme: string;
  rondeur: number; // pour le dessin des silhouettes uniquement (0 = fine, 1 = ronde)
  enAvant?: boolean;
  cle: string; // mot-clé de la narration qui fait apparaître la colonne
};

export const REPERES_MASSE_GRASSE: Repere[] = [
  {categorie: 'Graisse essentielle', homme: '2-5 %', femme: '10-13 %', rondeur: 0, cle: 'Graisse essentielle'},
  {categorie: 'Sportif', homme: '6-13 %', femme: '14-20 %', rondeur: 0.22, cle: 'Sportif'},
  {categorie: 'Forme', homme: '14-17 %', femme: '21-24 %', rondeur: 0.42, enAvant: true, cle: 'Forme :'},
  {categorie: 'Moyenne', homme: '18-24 %', femme: '25-31 %', rondeur: 0.64, cle: 'Moyenne :'},
  {categorie: 'Surpoids / obésité', homme: '25 % et plus', femme: '32 % et plus', rondeur: 0.9, cle: 'Surpoids ou obésité'},
];
