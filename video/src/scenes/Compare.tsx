// Comparaison : bons exemples (cartes vertes cochées) / mauvais exemple (carte grise barrée).
import React from 'react';
import {Entree, useTrace} from '../composants/Anim';
import {Carte} from '../composants/Carte';
import {IconeCoche, IconeCroix} from '../composants/Icones';
import {Texte} from '../composants/Texte';
import {useMise} from '../mise';
import {C} from '../theme';

export const Compare: React.FC<{
  bons: string[];
  mauvais: string[];
  debutBons: number;
  debutMauvais: number;
  debutBarre: number;
}> = ({bons, mauvais, debutBons, debutMauvais, debutBarre}) => {
  const m = useMise();
  const barre = useTrace(debutBarre, 30);
  // « ✗ « Être plus beau » » : le symbole ✗ est dessiné en icône, le reste du texte est affiché tel quel.
  const sansCroix = (t: string) => t.replace(/^✗\s*/, '');
  return (
    <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', gap: m.v ? 40 : 60}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22}}>
        {bons.map((t, i) => (
          <Entree key={i} debut={debutBons + i * 20}>
            <Carte accent={C.menthe} fond="rgba(11,122,107,0.3)" style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <IconeCoche taille={m.v ? 58 : 54} trace={1} />
              <Texte taille={m.texte} gras={600} couleur={C.gris}>
                {t}
              </Texte>
            </Carte>
          </Entree>
        ))}
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'center'}}>
        {mauvais.map((t, i) => (
          <Entree key={i} debut={debutMauvais}>
            <Carte fond="rgba(241,245,249,0.08)" accent="rgba(241,245,249,0.25)" style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <IconeCroix taille={m.v ? 58 : 54} couleur={C.texteDoux} />
              <div style={{position: 'relative'}}>
                <Texte taille={m.texte} gras={600} couleur={C.texteDoux}>
                  {sansCroix(t)}
                </Texte>
                <div style={{position: 'absolute', left: 0, top: '52%', height: 4, width: `${barre * 100}%`, background: C.texteDoux, borderRadius: 2}} />
              </div>
            </Carte>
          </Entree>
        ))}
      </div>
    </div>
  );
};
