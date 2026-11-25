// Éditorial — « liste-coches » et « liste-alerte » : lignes séparées par des filets fins.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ecart, progression} from '../../components/animation';
import {LigneFilet, PageEditoriale} from '../../components/Editorial';
import {IconeAlerte, IconeCoche, IconeInfo} from '../../components/Icones';
import {useMise} from '../../layout';
import {COULEURS, POLICE_TEXTE} from '../../theme';
import type {PropsListeAlerte, PropsListeCoches} from '../../types';
import {typo} from '../../typo';

type Ligne = {texte: string; icone: 'coche' | 'alerte' | 'info'};

const Liste: React.FC<{titre: string; lignes: Ligne[]; dureeImages: number}> = ({titre, lignes, dureeImages}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const v = m.vertical;
  const debut = 14;
  const pas = ecart(lignes.length, dureeImages, debut);
  const taille = v ? 64 : 56;
  return (
    <PageEditoriale titre={titre}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {lignes.map((l, i) => {
          const d = debut + i * pas;
          const alerte = l.icone === 'alerte';
          return (
            <LigneFilet key={i} debut={d} premiere={i === 0}>
              {l.icone === 'coche' && <IconeCoche taille={taille} trace={progression(frame, d + 6, 14)} />}
              {l.icone === 'alerte' && <IconeAlerte taille={taille} />}
              {l.icone === 'info' && <IconeInfo taille={taille} />}
              <div
                data-texte
                style={{
                  fontFamily: POLICE_TEXTE,
                  fontWeight: alerte ? 700 : 600,
                  fontSize: v ? 46 : 44,
                  lineHeight: 1.25,
                  color: alerte ? COULEURS.ambre : COULEURS.texte,
                }}
              >
                {typo(l.texte)}
              </div>
            </LigneFilet>
          );
        })}
      </div>
    </PageEditoriale>
  );
};

export const ListeCochesEditorial: React.FC<{props: PropsListeCoches; dureeImages: number}> = ({props, dureeImages}) => (
  <Liste titre={props.titre} dureeImages={dureeImages} lignes={props.elements.map((texte) => ({texte, icone: 'coche'}))} />
);

export const ListeAlerteEditorial: React.FC<{props: PropsListeAlerte; dureeImages: number}> = ({props, dureeImages}) => (
  <Liste titre={props.titre} dureeImages={dureeImages} lignes={props.elements.map((e) => ({texte: e.texte, icone: e.alerte ? 'alerte' : 'info'}))} />
);
