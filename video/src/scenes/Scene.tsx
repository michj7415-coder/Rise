// Scène générique : utilise le visuel spécifique du module s'il existe,
// sinon affiche simplement les textes « onScreen » les uns sous les autres.
import React from 'react';
import {Entree} from '../composants/Anim';
import {Texte} from '../composants/Texte';
import {useMise} from '../mise';
import type {PropsScene} from '../modules/module1';
import {C} from '../theme';
import {Zone} from './Zone';

const Generique: React.FC<PropsScene> = ({scene}) => {
  const m = useMise();
  return (
    <Zone>
      {scene.onScreen.map((t, i) => (
        <Entree key={i} debut={i * 20}>
          <Texte taille={i === 0 ? m.titre : m.texte} titre={i === 0} couleur={i === 0 ? C.gris : C.texte}>
            {t}
          </Texte>
        </Entree>
      ))}
    </Zone>
  );
};

export const Scene: React.FC<PropsScene & {visuels: Record<string, React.FC<PropsScene>>}> = ({visuels, ...props}) => {
  const Composant = visuels[props.scene.id] ?? Generique;
  return <Composant {...props} />;
};
