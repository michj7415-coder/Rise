// « RISE · Module N / 9 », discret en haut à gauche.
import React from 'react';
import {useMise} from '../mise';
import {C, POLICE_TITRE} from '../theme';

export const EnTete: React.FC<{module: number; total?: number}> = ({module, total = 9}) => {
  const m = useMise();
  return (
    <div
      style={{
        position: 'absolute',
        top: m.enTeteHaut,
        left: m.margeX,
        fontFamily: POLICE_TITRE,
        fontWeight: 500,
        fontSize: m.v ? 28 : 24,
        letterSpacing: 2,
        color: C.texteDoux,
        opacity: 0.85,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{width: 10, height: 10, borderRadius: 5, background: C.menthe}} />
      RISE · Module {module} / {total}
    </div>
  );
};
