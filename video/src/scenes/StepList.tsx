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
    <div style={{flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: '1fr', gap: m.v ? 22 : 26}}>
      {etapes.map((e, i) => {
        const {n, t} = numero(e.texte);
        return (
          <Entree key={i} debut={e.debut} style={{height: '100%'}}>
            <Carte style={{display: 'flex', alignItems: 'center', gap: 30, padding: m.v ? '18px 36px' : '20px 40px', height: '100%', boxSizing: 'border-box'}}>
              {n && (
                <div style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: m.v ? 64 : 64, color: C.menthe, width: m.v ? 52 : 52}}>{n}</div>
              )}
              <div style={{width: m.v ? 104 : 110, height: m.v ? 104 : 110, borderRadius: 999, background: 'rgba(79,209,188,0.10)', border: `2px solid ${C.bordure}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <e.Icone taille={m.v ? 64 : 68} />
              </div>
              <Texte taille={m.v ? m.texte : m.texte + 2} gras={600} couleur={C.gris}>
                {t}
              </Texte>
            </Carte>
          </Entree>
        );
      })}
    </div>
  );
};
