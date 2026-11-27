// Liste d'étapes numérotées en cartes, chacune avec une icône ; chaque carte
// entre au moment où la voix la nomme.
import React from 'react';
import {Entree} from '../composants/Anim';
import {Carte} from '../composants/Carte';
import {Texte} from '../composants/Texte';
import {useMise} from '../mise';
import {C, POLICE_TITRE} from '../theme';

export type Etape = {texte: string; Icone: React.FC<{taille: number; couleur?: string}>; debut: number};

// « 1 Objectif réaliste » → numéro « 1 » + « Objectif réaliste » (texte inchangé).
const numero = (t: string) => {
  const m = t.match(/^(\d+)\s+(.*)$/);
  return m ? {n: m[1], t: m[2]} : {n: '', t};
};

export const StepList: React.FC<{etapes: Etape[]; colonnes?: number}> = ({etapes, colonnes}) => {
  const m = useMise();
  const cols = colonnes ?? (m.v ? 1 : 2);
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: m.v ? 20 : 24}}>
      {etapes.map((e, i) => {
        const {n, t} = numero(e.texte);
        return (
          <Entree key={i} debut={e.debut}>
            <Carte style={{display: 'flex', alignItems: 'center', gap: 26, padding: m.v ? '22px 30px' : '22px 30px'}}>
              {n && (
                <div style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: m.v ? 52 : 48, color: C.menthe, width: m.v ? 44 : 40}}>{n}</div>
              )}
              <e.Icone taille={m.v ? 60 : 56} />
              <Texte taille={m.texte} gras={600} couleur={C.gris}>
                {t}
              </Texte>
            </Carte>
          </Entree>
        );
      })}
    </div>
  );
};
