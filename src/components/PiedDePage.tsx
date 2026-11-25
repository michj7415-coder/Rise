import React from 'react';
import {useMise} from '../layout';
import {COULEURS, PIED_DE_PAGE, POLICE_TEXTE} from '../theme';

export const PiedDePage: React.FC = () => {
  const m = useMise();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: m.piedBas,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        fontFamily: POLICE_TEXTE,
        fontWeight: 500,
        fontSize: m.taillePied,
        letterSpacing: 0.6,
        color: COULEURS.texteSecondaire,
        opacity: 0.75,
      }}
    >
      <span style={{width: 8, height: 8, borderRadius: 4, background: COULEURS.turquoise}} />
      {PIED_DE_PAGE}
    </div>
  );
};
