// Grand chiffre + libellé (+ visuel facultatif). Le texte d'origine est seulement
// séparé en deux (« 1 à 3 » / « pesées par semaine »), sans changer un mot.
import React from 'react';
import {Entree} from '../composants/Anim';
import {Texte} from '../composants/Texte';
import {useMise} from '../mise';
import {C} from '../theme';

// Sépare un éventuel préfixe « Libellé : » puis l'expression chiffrée de tête.
export const separerChiffre = (t: string): {avant?: string; chiffre: string; apres: string} => {
  let avant: string | undefined;
  let reste = t;
  const deuxPoints = t.match(/^(.*?)\s*:\s+(.*)$/);
  if (deuxPoints && /\d/.test(deuxPoints[2]) && !/\d/.test(deuxPoints[1])) {
    avant = deuxPoints[1];
    reste = deuxPoints[2];
  }
  const m = reste.match(/^([−+-]?\d+(?:[.,]\d+)?(?:\s*(?:à|-)\s*\d+(?:[.,]\d+)?)?(?:\s*%)?)\s*(.*)$/);
  return m ? {avant, chiffre: m[1], apres: m[2]} : {avant, chiffre: '', apres: reste};
};

export const BigStat: React.FC<{texte: string; debut: number; visuel?: React.ReactNode; couleur?: string; avantSeparateur?: string}> = ({
  texte,
  debut,
  visuel,
  couleur = C.menthe,
}) => {
  const m = useMise();
  const {avant, chiffre, apres} = separerChiffre(texte);
  return (
    <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', alignItems: m.v ? 'flex-start' : 'center', gap: m.v ? 40 : 80}}>
      {visuel && <Entree debut={debut}>{visuel}</Entree>}
      <Entree debut={debut + 6} style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        {avant && (
          <Texte taille={m.texte} couleur={C.texteDoux}>
            {`${avant} :`}
          </Texte>
        )}
        {chiffre && (
          <Texte taille={m.grandChiffre} titre couleur={couleur} lignesMax={1} style={{lineHeight: 1, whiteSpace: 'nowrap'}}>
            {chiffre}
          </Texte>
        )}
        {apres && (
          <Texte taille={m.texte + 6} titre gras={500} couleur={C.gris}>
            {apres}
          </Texte>
        )}
      </Entree>
    </div>
  );
};
