// Carte jaune de prudence (avertissements santé). Le texte n'est jamais raccourci.
import React from 'react';
import {useMise} from '../mise';
import {C, POLICE_TEXTE, RAYON} from '../theme';
import {Entree} from './Anim';
import {IconeAttention} from './Icones';
import {typo} from './typo';

export const CartePrudence: React.FC<{titre?: string; texte?: string; debut: number; style?: React.CSSProperties}> = ({
  titre,
  texte,
  debut,
  style,
}) => {
  const m = useMise();
  return (
    <Entree debut={debut} style={style}>
      <div
        data-prudence
        style={{
          background: C.prudenceFond,
          borderRadius: RAYON,
          padding: m.v ? '38px 40px' : '30px 40px',
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
        }}
      >
        <IconeAttention taille={m.v ? 64 : 54} couleur={C.prudenceTexte} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {titre && (
            <div data-texte data-lignes-max={4} style={{fontFamily: POLICE_TEXTE, fontWeight: 700, fontSize: m.v ? 50 : m.texte, lineHeight: 1.25, color: C.prudenceTexte}}>
              {typo(titre)}
            </div>
          )}
          {texte && (
            <div data-texte data-lignes-max={6} style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: m.v ? 42 : 36, lineHeight: 1.35, color: C.prudenceTexte}}>
              {typo(texte)}
            </div>
          )}
        </div>
      </div>
    </Entree>
  );
};
