// Titre de module : sur-titre, grand titre, barre ambre qui se dessine, sous-titre.
import React from 'react';
import {Entree, useTrace} from '../composants/Anim';
import {Texte} from '../composants/Texte';
import {useMise} from '../mise';
import {C} from '../theme';

export const TitleCard: React.FC<{surTitre?: string; titre: string; sousTitre?: string; debut?: number}> = ({surTitre, titre, sousTitre, debut = 0}) => {
  const m = useMise();
  const barre = useTrace(debut + 14, 40);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: m.v ? 26 : 22}}>
      {surTitre && (
        <Entree debut={debut}>
          <Texte taille={m.v ? 44 : 36} titre gras={500} couleur={C.menthe} style={{letterSpacing: 3}}>
            {surTitre}
          </Texte>
        </Entree>
      )}
      <Entree debut={debut + 6} distance={40}>
        <Texte taille={m.v ? 104 : 116} titre couleur={C.gris} degrade>
          {titre}
        </Texte>
      </Entree>
      <div style={{height: 10, width: (m.v ? 340 : 380) * barre, borderRadius: 5, background: `linear-gradient(90deg, ${C.ambre}, #FFD27A)`, boxShadow: `0 0 24px ${C.ambre}66`}} />
      {sousTitre && (
        <Entree debut={debut + 30}>
          <Texte taille={m.v ? 42 : 36} couleur={C.texte}>
            {sousTitre}
          </Texte>
        </Entree>
      )}
    </div>
  );
};
