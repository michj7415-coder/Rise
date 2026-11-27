// Tableau de repères avec titre et mention en bas.
import React from 'react';
import {Entree} from '../composants/Anim';
import {Texte} from '../composants/Texte';
import type {Repere} from '../data/reperes';
import {useMise} from '../mise';
import {C} from '../theme';
import {TableauReperes} from '../visuels/TableauReperes';
import {Zone} from './Zone';

export const Table: React.FC<{titre: string; mention?: string; reperes: Repere[]; debuts: number[]; debutMention: number}> = ({
  titre,
  mention,
  reperes,
  debuts,
  debutMention,
}) => {
  const m = useMise();
  return (
    <Zone centre={false} gap={m.v ? 24 : 22}>
      <Entree debut={0}>
        <Texte taille={m.v ? 64 : 60} titre couleur={C.gris}>
          {titre}
        </Texte>
      </Entree>
      <div style={{flex: 1, minHeight: 0, display: 'flex'}}>
        <TableauReperes reperes={reperes} debuts={debuts} />
      </div>
      {mention && (
        <Entree debut={debutMention}>
          <Texte taille={m.petit} gras={600} couleur={C.ambre}>
            {mention}
          </Texte>
        </Entree>
      )}
    </Zone>
  );
};
