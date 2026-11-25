// Modèle « Jauges » : infographie avec des anneaux qui se remplissent.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {glissement, progression} from '../components/animation';
import {useMise} from '../layout';
import {COULEURS, couleurAccent, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import type {PropsBarres} from '../types';
import {typo} from '../typo';
import {partDe, separerValeur} from './outils';

export const ModeleJauges: React.FC<{props: PropsBarres}> = ({props}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const part = partDe(props.echelle);
  const v = m.vertical;
  const D = v ? 420 : 360; // diamètre
  const ep = v ? 30 : 26; // épaisseur de l'anneau
  const r = (D - ep) / 2 - 20;
  const c = D / 2;

  return (
    <AbsoluteFill>
      <div data-zone="titre" style={{position: 'absolute', top: v ? 200 : 80, left: m.margeX, right: m.margeX, textAlign: 'center'}}>
        <div data-texte style={{...glissement(frame, 0), fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: v ? 80 : 68, lineHeight: 1.1, color: COULEURS.texte}}>
          {typo(props.titre)}
        </div>
      </div>
      <div
        data-zone="contenu"
        style={{position: 'absolute', top: v ? 420 : 200, bottom: m.contenuBas, left: m.margeX, right: m.margeX, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: v ? 40 : 34}}
      >
        <div style={{display: 'flex', gap: v ? 40 : 160, justifyContent: 'center'}}>
          {props.barres.map((b, i) => {
            const debut = 12 + i * Math.round(1.6 * fps);
            const accent = couleurAccent(b.couleur);
            const p = part(b.valeur) * progression(frame, debut + 8, Math.round(1.4 * fps));
            const [chiffre, unite] = separerValeur(b.texteValeur);
            const angleRepere = b.repere ? part(b.repere.valeur) * 2 * Math.PI - Math.PI / 2 : 0;
            return (
              <div key={i} style={{...glissement(frame, debut), display: 'flex', flexDirection: 'column', alignItems: 'center', width: D}}>
                <div style={{position: 'relative', width: D, height: D}}>
                  <svg width={D} height={D} style={{position: 'absolute', inset: 0}}>
                    <circle cx={c} cy={c} r={r} fill="none" stroke={COULEURS.carte} strokeWidth={ep} />
                    <circle cx={c} cy={c} r={r} fill="none" stroke={COULEURS.bordure} strokeWidth={2} />
                    <circle
                      cx={c}
                      cy={c}
                      r={r}
                      fill="none"
                      stroke={accent}
                      strokeWidth={ep}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={`${p} 1`}
                      transform={`rotate(-90 ${c} ${c})`}
                    />
                    {b.repere && (
                      <line
                        x1={c + Math.cos(angleRepere) * (r - ep / 2 - 8)}
                        y1={c + Math.sin(angleRepere) * (r - ep / 2 - 8)}
                        x2={c + Math.cos(angleRepere) * (r + ep / 2 + 8)}
                        y2={c + Math.sin(angleRepere) * (r + ep / 2 + 8)}
                        stroke={COULEURS.texte}
                        strokeWidth={4}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div data-texte style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: v ? 84 : 72, lineHeight: 1, color: accent, whiteSpace: 'nowrap'}}>
                      {typo(chiffre)}
                    </div>
                    <div data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: v ? 30 : 26, color: COULEURS.texteDoux, marginTop: 8, whiteSpace: 'nowrap'}}>
                      {typo(unite)}
                    </div>
                    {b.repere?.libelle && (
                      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 14}}>
                        <span style={{width: 4, height: v ? 22 : 20, borderRadius: 2, background: COULEURS.texte}} />
                        <span data-texte style={{fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: v ? 24 : 22, color: COULEURS.texteSecondaire, whiteSpace: 'nowrap'}}>
                          {typo(b.repere.libelle)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div data-texte style={{marginTop: 18, fontFamily: POLICE_TEXTE, fontWeight: 600, fontSize: v ? 34 : 32, lineHeight: 1.25, color: COULEURS.texte, textAlign: 'center'}}>
                  {typo(b.libelle)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', gap: 10, alignItems: 'center', fontFamily: POLICE_TEXTE, fontSize: v ? 26 : 24, color: COULEURS.texteSecondaire, opacity: progression(frame, 60)}}>
          <span data-texte>{typo(props.echelle.libelleMin ?? '')}</span>
          <span style={{width: 60, height: 2, background: COULEURS.bordure}} />
          <span data-texte>{typo(props.echelle.libelleMax ?? '')}</span>
        </div>
        {props.note && (
          <div data-texte style={{...glissement(frame, 70), maxWidth: v ? undefined : 1300, fontFamily: POLICE_TEXTE, fontSize: v ? 29 : 27, lineHeight: 1.4, color: COULEURS.texteSecondaire, textAlign: 'center'}}>
            {typo(props.note)}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
