// Récapitulatif : cartes avec une case qui se coche quand la voix les cite.
import React from 'react';
import {Entree, useTrace} from '../composants/Anim';
import {Carte} from '../composants/Carte';
import {IconeCoche} from '../composants/Icones';
import {Texte} from '../composants/Texte';
import {useMise} from '../mise';
import {C, RAYON} from '../theme';

export type ElementRecap = {texte: string; Icone: React.FC<{taille: number; couleur?: string}>; debut: number};

const Ligne: React.FC<{e: ElementRecap}> = ({e}) => {
  const m = useMise();
  const coche = useTrace(e.debut + 10, 14);
  return (
    <Entree debut={e.debut} style={{height: '100%'}}>
      <Carte style={{display: 'flex', alignItems: 'center', gap: 22, height: '100%', boxSizing: 'border-box', padding: m.v ? '20px 26px' : '20px 26px'}}>
        <div style={{width: m.v ? 50 : 46, height: m.v ? 50 : 46, borderRadius: 10, border: `3px solid ${C.menthe}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <IconeCoche taille={m.v ? 44 : 40} trace={coche} />
        </div>
        <e.Icone taille={m.v ? 52 : 48} couleur={C.texteDoux} />
        <Texte taille={m.v ? 38 : 34} gras={600} couleur={C.gris}>
          {e.texte}
        </Texte>
      </Carte>
    </Entree>
  );
};

export const Recap: React.FC<{titre: string; elements: ElementRecap[]; suite?: string; debutSuite?: number}> = ({titre, elements, suite, debutSuite = 0}) => {
  const m = useMise();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: m.v ? 24 : 22}}>
      <Entree debut={elements[0]?.debut - 10}>
        <Texte taille={m.v ? 60 : 54} titre couleur={C.gris}>
          {titre}
        </Texte>
      </Entree>
      <div style={{display: 'grid', gridTemplateColumns: m.v ? '1fr' : '1fr 1fr', gap: m.v ? 16 : 20}}>
        {elements.map((e, i) => (
          <Ligne key={i} e={e} />
        ))}
      </div>
      {suite && (
        <Entree debut={debutSuite}>
          <div style={{borderRadius: RAYON, background: C.vert, padding: m.v ? '24px 30px' : '20px 30px'}}>
            <Texte taille={m.texte} titre couleur={C.gris}>
              {suite}
            </Texte>
          </div>
        </Entree>
      )}
    </div>
  );
};
