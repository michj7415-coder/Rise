// Tableau des repères de masse grasse : une colonne par catégorie (16:9)
// ou une ligne par catégorie (9:16), avec des silhouettes schématiques sans visage.
import React from 'react';
import {Entree} from '../composants/Anim';
import {Silhouette} from '../composants/Silhouette';
import {Texte} from '../composants/Texte';
import type {Repere} from '../data/reperes';
import {useMise} from '../mise';
import {C, RAYON} from '../theme';

export const TableauReperes: React.FC<{reperes: Repere[]; debuts: number[]; libelles?: {homme: string; femme: string}}> = ({
  reperes,
  debuts,
  libelles = {homme: 'Homme', femme: 'Femme'},
}) => {
  const m = useMise();
  const hSil = m.v ? 104 : 240;
  const Cellule: React.FC<{r: Repere; i: number}> = ({r, i}) => {
    const accent = r.enAvant ? C.menthe : C.bordure;
    const fond = r.enAvant ? 'rgba(11,122,107,0.28)' : C.marineCarte;
    const coul = r.enAvant ? C.menthe : C.texteDoux;
    const paire = (type: 'homme' | 'femme', valeur: string, libelle: string) => (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <Silhouette hauteur={hSil} rondeur={r.rondeur} type={type} couleur={coul} />
        <Texte taille={m.v ? 22 : 22} couleur={C.texteDoux} centre lignesMax={1}>{libelle}</Texte>
        <Texte taille={m.v ? 30 : 30} titre couleur={r.enAvant ? C.menthe : C.gris} centre lignesMax={2} style={{whiteSpace: m.v ? 'nowrap' : undefined, maxWidth: m.v ? undefined : 120}}>{valeur}</Texte>
      </div>
    );
    return (
      <Entree debut={debuts[i]} style={{flex: 1, minWidth: 0}}>
        <div
          style={{
            height: '100%',
            boxSizing: 'border-box',
            background: fond,
            border: `2px solid ${accent}`,
            borderRadius: RAYON,
            padding: m.v ? '8px 22px' : '18px 10px',
            justifyContent: m.v ? 'flex-start' : 'space-between',
            display: 'flex',
            flexDirection: m.v ? 'row' : 'column',
            alignItems: 'center',
            gap: m.v ? 18 : 12,
          }}
        >
          <Texte taille={m.v ? 32 : 26} titre couleur={r.enAvant ? C.menthe : C.gris} centre={!m.v} lignesMax={2} style={m.v ? {width: 230, flexShrink: 0} : {minHeight: 60, display: 'flex', alignItems: 'center'}}>
            {r.categorie}
          </Texte>
          <div style={{display: 'flex', gap: m.v ? 40 : 4, justifyContent: 'center', alignItems: 'center', flex: 1}}>
            {paire('homme', r.homme, libelles.homme)}
            {paire('femme', r.femme, libelles.femme)}
          </div>
        </div>
      </Entree>
    );
  };
  return (
    <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', gap: m.v ? 10 : 16, width: '100%'}}>
      {reperes.map((r, i) => (
        <Cellule key={r.categorie} r={r} i={i} />
      ))}
    </div>
  );
};
