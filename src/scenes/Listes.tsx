// Scènes « liste-coches » et « liste-alerte » : lignes qui apparaissent une à une.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cadre} from '../components/Cadre';
import {ecart, glissement, progression} from '../components/animation';
import {IconeAlerte, IconeCoche, IconeInfo} from '../components/Icones';
import {useMise} from '../layout';
import {COULEURS, DIRECTION, POLICE_TEXTE} from '../theme';
import type {PropsListeAlerte, PropsListeCoches} from '../types';
import {typo} from '../typo';

type Ligne = {texte: string; icone: 'coche' | 'alerte' | 'info'};

const Liste: React.FC<{titre: string; lignes: Ligne[]; dureeImages: number}> = ({titre, lignes, dureeImages}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const debut = 14;
  const pas = ecart(lignes.length, dureeImages, debut);
  const taille = m.vertical ? 60 : 52;
  return (
    <Cadre titre={titre}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: m.vertical ? 24 : 20,
          width: '100%',
          maxWidth: m.vertical ? undefined : 1300,
          alignSelf: m.vertical ? 'stretch' : 'flex-start',
        }}
      >
        {lignes.map((l, i) => {
          const d = debut + i * pas;
          const alerte = l.icone === 'alerte';
          return (
            <div
              key={i}
              style={{
                ...glissement(frame, d, 22),
                display: 'flex',
                alignItems: 'center',
                gap: m.vertical ? 28 : 30,
                background: COULEURS.carte,
                border: `2px solid ${alerte ? `${COULEURS.ambre}99` : COULEURS.bordure}`,
                borderRadius: Math.min(DIRECTION.rayon, 24),
                padding: m.vertical ? '30px 34px' : '24px 34px',
              }}
            >
              {l.icone === 'coche' && <IconeCoche taille={taille} trace={progression(frame, d + 6, 14)} />}
              {l.icone === 'alerte' && <IconeAlerte taille={taille} />}
              {l.icone === 'info' && <IconeInfo taille={taille} />}
              <div
                data-texte
                style={{
                  fontFamily: POLICE_TEXTE,
                  fontWeight: 600,
                  fontSize: m.tailleTexte,
                  lineHeight: 1.3,
                  color: COULEURS.texte,
                }}
              >
                {typo(l.texte)}
              </div>
            </div>
          );
        })}
      </div>
    </Cadre>
  );
};

export const ListeCoches: React.FC<{props: PropsListeCoches; dureeImages: number}> = ({props, dureeImages}) => (
  <Liste titre={props.titre} dureeImages={dureeImages} lignes={props.elements.map((texte) => ({texte, icone: 'coche'}))} />
);

export const ListeAlerte: React.FC<{props: PropsListeAlerte; dureeImages: number}> = ({props, dureeImages}) => (
  <Liste
    titre={props.titre}
    dureeImages={dureeImages}
    lignes={props.elements.map((e) => ({texte: e.texte, icone: e.alerte ? 'alerte' : 'info'}))}
  />
);
