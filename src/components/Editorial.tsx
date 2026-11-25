// Éléments du modèle « Éditorial » : grand titre avec barre d'accent, colonnes,
// filets fins et étiquettes en capitales.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useMise} from '../layout';
import {COULEURS, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import {typo} from '../typo';
import {glissement, progression} from './animation';

// Largeur de la colonne de gauche en 16:9.
export const COLONNE = 600;

// Choisit la plus grande taille de titre qui tient dans la largeur et le nombre de lignes voulus.
export const tailleAjustee = (texte: string, largeur: number, max: number, lignesMax: number, min = 52) => {
  const mots = texte.split(/\s+/);
  const plusLong = Math.max(...mots.map((m) => m.length));
  let taille = Math.min(max, Math.floor(largeur / (plusLong * 0.6)));
  const lignes = (t: number) => {
    const parLigne = Math.max(1, Math.floor(largeur / (t * 0.54)));
    let n = 1;
    let courant = 0;
    for (const m of mots) {
      if (courant && courant + 1 + m.length > parLigne) {
        n++;
        courant = m.length;
      } else courant += (courant ? 1 : 0) + m.length;
    }
    return n;
  };
  while (taille > min && lignes(taille) > lignesMax) taille -= 4;
  return Math.max(min, taille);
};

export const GrandTitre: React.FC<{texte: string; largeur: number; max: number; lignesMax: number; debut?: number; centre?: boolean}> = ({
  texte,
  largeur,
  max,
  lignesMax,
  debut = 0,
  centre,
}) => {
  const frame = useCurrentFrame();
  const taille = tailleAjustee(texte, largeur - 40, max, lignesMax);
  return (
    <div style={{display: 'flex', gap: 28, justifyContent: centre ? 'center' : 'flex-start'}}>
      <div
        style={{
          width: 12,
          borderRadius: 2,
          background: COULEURS.turquoise,
          flexShrink: 0,
          transform: `scaleY(${progression(frame, debut, 20)})`,
          transformOrigin: 'top',
        }}
      />
      <div
        data-texte
        style={{
          ...glissement(frame, debut + 2),
          fontFamily: POLICE_TITRE,
          fontWeight: 700,
          fontSize: taille,
          lineHeight: 1.0,
          letterSpacing: -taille * 0.018,
          color: COULEURS.texte,
        }}
      >
        {typo(texte)}
      </div>
    </div>
  );
};

export const Etiquette: React.FC<{children: string; couleur?: string; style?: React.CSSProperties}> = ({children, couleur, style}) => {
  const m = useMise();
  return (
    <div
      data-texte
      style={{
        fontFamily: POLICE_TEXTE,
        fontWeight: 600,
        fontSize: m.vertical ? 30 : 26,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: couleur ?? COULEURS.texteSecondaire,
        ...style,
      }}
    >
      {typo(children)}
    </div>
  );
};

export const NoteBas: React.FC<{texte: string; debut: number}> = ({texte, debut}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  return (
    <div
      data-texte
      style={{
        ...glissement(frame, debut, 16),
        fontFamily: POLICE_TEXTE,
        fontSize: m.vertical ? 30 : 27,
        lineHeight: 1.45,
        color: COULEURS.texteSecondaire,
        borderTop: `1px solid ${COULEURS.bordure}`,
        paddingTop: 22,
      }}
    >
      {typo(texte)}
    </div>
  );
};

// Mise en page générale :
//  - 16:9 : colonne de gauche (titre en haut, « aparte » en bas) et contenu à droite ;
//  - 9:16 : titre en haut, contenu au centre, « aparte » en bas.
export const PageEditoriale: React.FC<{
  titre?: string;
  aparte?: React.ReactNode;
  children: React.ReactNode;
  alignerContenu?: 'center' | 'flex-start';
}> = ({titre, aparte, children, alignerContenu = 'center'}) => {
  const m = useMise();
  if (m.vertical) {
    return (
      <AbsoluteFill>
        <div
          data-zone="contenu"
          style={{
            position: 'absolute',
            top: 190,
            bottom: m.contenuBas - 20,
            left: m.margeX,
            right: m.margeX,
            display: 'flex',
            flexDirection: 'column',
            gap: 36,
          }}
        >
          {titre && <GrandTitre texte={titre} largeur={m.largeur - 2 * m.margeX} max={104} lignesMax={3} />}
          <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: alignerContenu}}>{children}</div>
          {aparte}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 90, bottom: m.contenuBas, left: m.margeX, right: m.margeX, display: 'flex', gap: 90}}>
        <div data-zone="colonne" style={{width: COLONNE, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 30}}>
          {titre ? <GrandTitre texte={titre} largeur={COLONNE} max={112} lignesMax={4} /> : <div />}
          {aparte}
        </div>
        <div data-zone="contenu" style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: alignerContenu}}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Ligne d'une liste éditoriale, séparée par un filet fin.
export const LigneFilet: React.FC<{debut: number; premiere: boolean; children: React.ReactNode; accent?: string}> = ({
  debut,
  premiere,
  children,
  accent,
}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...glissement(frame, debut, 22),
        display: 'flex',
        alignItems: 'center',
        gap: m.vertical ? 28 : 30,
        padding: m.vertical ? '30px 0' : '24px 0',
        borderTop: premiere ? 'none' : `1px solid ${COULEURS.bordure}`,
        borderLeft: accent ? `4px solid ${accent}` : undefined,
        paddingLeft: accent ? 26 : 0,
      }}
    >
      {children}
    </div>
  );
};
