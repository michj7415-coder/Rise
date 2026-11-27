// Structure d'un fichier de module (src/data/moduleN.json).
export type SceneData = {
  id: string;
  durationSec: number; // durée estimée, utilisée s'il n'y a pas de fichier audio
  narration: string; // texte lu par la voix, aussi utilisé pour les sous-titres
  onScreen: string[]; // textes affichés à l'écran
  visual: string; // description du visuel (pour l'équipe)
  animation: string; // description de l'animation (pour l'équipe)
};

export type ModuleData = {
  module: number;
  title: string;
  scenes: SceneData[];
};
