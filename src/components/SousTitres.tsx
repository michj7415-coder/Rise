// Sous-titres incrustés en bas de l'image, sur un bandeau sombre pour rester lisibles.
import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {planifier} from '../decoupage';
import {useMise} from '../layout';
import {COULEURS, POLICE_TEXTE} from '../theme';
import {typo} from '../typo';

export const SousTitres: React.FC<{voix: string; dureeImages: number; verifier?: boolean}> = ({
  voix,
  dureeImages,
  verifier,
}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const plan = useMemo(
    () => planifier(voix, m.caracteresParSousTitre, dureeImages, fps),
    [voix, m.caracteresParSousTitre, dureeImages, fps],
  );
  const actuel = plan.find((s) => frame >= s.debut && frame < s.fin);
  const opacite = actuel
    ? interpolate(frame, [actuel.debut, actuel.debut + 4], [0, 1], {extrapolateRight: 'clamp'})
    : 0;

  return (
    <div
      data-zone="sous-titres"
      style={{
        position: 'absolute',
        bottom: m.sousTitresBas,
        left: (m.largeur - m.largeurSousTitres) / 2,
        width: m.largeurSousTitres,
        height: m.sousTitresHauteur,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* En mode vérification, tous les morceaux sont mesurés (invisibles). */}
      {verifier &&
        plan.map((s, i) => (
          <div key={i} data-texte style={{...boite(m), position: 'absolute', bottom: 0, visibility: 'hidden'}}>
            {typo(s.texte)}
          </div>
        ))}
      {actuel && (
        <div
          data-texte
          style={{
            ...boite(m),
            opacity: opacite,
          }}
        >
          {typo(actuel.texte)}
        </div>
      )}
    </div>
  );
};

const boite = (m: ReturnType<typeof useMise>): React.CSSProperties => ({
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: 'rgba(8, 15, 27, 0.88)',
  border: `1px solid ${COULEURS.bordure}`,
  borderRadius: 14,
  padding: m.vertical ? '16px 26px' : '12px 28px',
  fontFamily: POLICE_TEXTE,
  fontWeight: 600,
  fontSize: m.tailleSousTitres,
  lineHeight: 1.3,
  color: COULEURS.texte,
  textAlign: 'center',
});
