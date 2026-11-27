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
          <Texte taille={m.v ? 36 : 32} titre gras={500} couleur={C.menthe} style={{letterSpacing: 3}}>
            {surTitre}
          </Texte>
        </Entree>
      )}
      <Entree debut={debut + 6} distance={40}>
        <Texte taille={m.v ? 104 : 104} titre couleur={C.gris}>
          {titre}
        </Texte>
      </Entree>
      <div style={{height: 8, width: (m.v ? 260 : 320) * barre, borderRadius: 4, background: C.ambre}} />
      {sousTitre && (
        <Entree debut={debut + 30}>
          <Texte taille={m.petit} couleur={C.texte}>
            {sousTitre}
          </Texte>
        </Entree>
      )}
    </div>
  );
};
