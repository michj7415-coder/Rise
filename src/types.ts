// Description des données attendues dans les fichiers scripts/*.json.

export type TypeScene =
  | 'titre-compteur'
  | 'courbe-illustrative'
  | 'barres-comparaison'
  | 'pastilles'
  | 'deux-panneaux'
  | 'liste-coches'
  | 'liste-alerte'
  | 'finale';

export type Couleur = 'turquoise' | 'ambre' | 'neutre';

export type PropsTitreCompteur = {
  titre: string;
  compteur: {depart: number; arrivee: number; decimales?: number; prefixe?: string; suffixe?: string};
  legende?: string;
};

export type PropsCourbe = {
  titre: string;
  mention?: string; // toujours affichée ; « Exemple illustratif » par défaut
  uniteX?: string;
  uniteY?: string;
  points: {x: number; y: number}[];
};

export type PropsBarres = {
  titre: string;
  echelle: {min: number; max: number; libelleMin?: string; libelleMax?: string};
  barres: {
    libelle: string;
    valeur: number;
    texteValeur?: string;
    couleur?: Couleur;
    repere?: {valeur: number; libelle?: string};
  }[];
  note?: string;
};

export type PropsPastilles = {titre: string; pastilles: string[]; ton?: 'normal' | 'alerte'};

export type PropsDeuxPanneaux = {
  titre: string;
  panneaux: {titre: string; texte?: string; couleur?: Couleur}[];
};

export type PropsListeCoches = {titre: string; elements: string[]};

export type PropsListeAlerte = {titre: string; elements: {texte: string; alerte?: boolean}[]};

export type PropsFinale = {titre: string; mention?: string};

export type Scene = {
  id: string;
  type: TypeScene;
  duree: number; // en secondes (remplacée par la durée de la voix off si elle existe)
  voix: string;
  props: Record<string, unknown>;
};

export type ScriptChapitre = {
  id: string;
  module?: number;
  chapitre?: number;
  titre?: string;
  musique?: string | null;
  scenes: Scene[];
};
