// Liste des modules. Pour ajouter un module : copier src/data/module1.json en moduleN.json,
// créer src/modules/moduleN.tsx (ou laisser la mise en page générique) et l'ajouter ici.
import type React from 'react';
import module1 from '../data/module1.json';
import type {ModuleData} from '../types';
import {ETAPES_MODULE1, PRUDENCE_MODULE1, SCENES_MODULE1, type PropsScene} from './module1';

export type ConfigModule = {
  data: ModuleData;
  scenes: Record<string, React.FC<PropsScene>>; // visuels spécifiques (facultatif)
  prudence: Record<string, string>; // id de scène → mot-clé où apparaît la carte de prudence
  etapes: Record<string, number>; // id de scène → étape en cours (0 à 5) pour la frise en haut à droite
};

export const MODULES: ConfigModule[] = [{data: module1 as ModuleData, scenes: SCENES_MODULE1, prudence: PRUDENCE_MODULE1, etapes: ETAPES_MODULE1}];
