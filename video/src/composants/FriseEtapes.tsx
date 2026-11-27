// Petite frise des étapes en haut à droite : l'étape en cours est mise en avant.
import React from 'react';
import {useMise} from '../mise';
import {C} from '../theme';
import {ICONES_ETAPES} from './Icones';

export const FriseEtapes: React.FC<{active: number | null}> = ({active}) => {
  const m = useMise();
  if (active === null) return null;
  const t = m.v ? 46 : 42;
  return (
    <div style={{position: 'absolute', top: m.enTeteHaut - (t - 24) / 2 - 6, right: m.margeX, display: 'flex', alignItems: 'center', gap: 8}}>
      {ICONES_ETAPES.map((I, i) => {
        const actif = i === active;
        const fait = i < active;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{width: m.v ? 10 : 14, height: 2, background: fait || actif ? C.vert : C.bordure}} />}
            <div
              style={{
                width: t,
                height: t,
                borderRadius: t / 2,
                border: `2px solid ${actif ? C.menthe : fait ? C.vert : C.bordure}`,
                background: actif ? 'rgba(79,209,188,0.18)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: actif ? 1 : 0.7,
              }}
            >
              <I taille={t * 0.62} couleur={actif ? C.menthe : fait ? C.menthe : C.texteDoux} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
