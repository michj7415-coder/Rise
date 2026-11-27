// Module 1 — « Bases et mesures de départ » : visuel de chaque scène.
// Tous les textes viennent de src/data/module1.json (scene.onScreen / scene.narration).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Entree, Phase, useTrace} from '../composants/Anim';
import {Carte} from '../composants/Carte';
import {CartePrudence} from '../composants/CartePrudence';
import {
  ICONES_ETAPES,
  IconeBalance,
  IconeCadenas,
  IconeCalendrier,
  IconeCible,
  IconeCoeur,
  IconeDifferent,
  IconeDrapeau,
  IconeFiche,
  IconeLieu,
  IconePhoto,
  IconeQuiz,
  IconeReveil,
  IconeRuban,
  IconeSoleil,
  IconeTableau,
  IconeTenue,
} from '../composants/Icones';
import {Silhouette} from '../composants/Silhouette';
import {Texte} from '../composants/Texte';
import {REPERES_MASSE_GRASSE} from '../data/reperes';
import {useMise} from '../mise';
import {BigStat} from '../scenes/BigStat';
import {Compare} from '../scenes/Compare';
import {Recap} from '../scenes/Recap';
import {StepList} from '../scenes/StepList';
import {Table} from '../scenes/Table';
import {TitleCard} from '../scenes/TitleCard';
import {Zone} from '../scenes/Zone';
import {C, POLICE_TITRE, RAYON} from '../theme';
import type {SceneData} from '../types';
import {BalanceImpedance} from '../visuels/BalanceImpedance';
import {CibleFloue} from '../visuels/CibleFloue';
import {CourbePoids} from '../visuels/CourbePoids';
import {Frise} from '../visuels/Frise';
import {RegleFourchette} from '../visuels/RegleFourchette';
import {RubanTaille} from '../visuels/RubanTaille';

export type PropsScene = {scene: SceneData; dureeImages: number; cle: (mot: string) => number};
type Icone = React.FC<{taille: number; couleur?: string}>;

// Cartes de prudence : mot-clé de la narration où la carte apparaît.
// Utilisé aussi par Root.tsx pour garantir au moins 6 s d'affichage.
export const PRUDENCE_MODULE1: Record<string, string> = {
  's01-intro': 'Avant de commencer',
  's09-fourchette': 'Et une règle de sécurité',
  's10-sans-obsession': 'Si te fixer un chiffre',
  's12-outro': '',
};

// Étape en cours (0 = objectif … 5 = suivre sans s'obséder) pour la frise en haut à droite.
export const ETAPES_MODULE1: Record<string, number> = {
  's03-objectif': 0,
  's04-photos': 1,
  's05-taille': 2,
  's06-poids': 3,
  's07-masse-grasse': 4,
  's08-reperes': 4,
  's09-fourchette': 4,
  's10-sans-obsession': 5,
};

// Extrait une phrase exacte d'un texte du script (pour les cartes de prudence).
const extrait = (texte: string, debut: string, fin?: string) => {
  const i = texte.indexOf(debut);
  if (i < 0) throw new Error(`Texte introuvable : ${debut}`);
  const j = fin ? texte.indexOf(fin, i) + fin.length : texte.length;
  return texte.slice(i, j);
};

// ——— Petits éléments graphiques communs ———

// Icône dans un grand rond (pastille).
const Rond: React.FC<{Icone: Icone; taille: number; couleur?: string; accent?: boolean}> = ({Icone, taille, couleur = C.menthe, accent}) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: taille / 2,
      flexShrink: 0,
      background: accent ? 'rgba(79,209,188,0.16)' : 'rgba(79,209,188,0.07)',
      border: `2px solid ${accent ? C.menthe : C.bordure}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Icone taille={taille * 0.56} couleur={couleur} />
  </div>
);

// Ligne de texte avec icône.
const LigneIcone: React.FC<{texte: string; debut: number; Icone?: Icone; grand?: boolean}> = ({texte, debut, Icone, grand}) => {
  const m = useMise();
  return (
    <Entree debut={debut} style={{display: 'flex', alignItems: 'center', gap: 28}}>
      {Icone && <Rond Icone={Icone} taille={m.v ? 110 : 104} />}
      <Texte taille={grand ? m.titre * 0.82 : m.texte} titre={grand} gras={grand ? 700 : 600} couleur={C.gris}>
        {texte}
      </Texte>
    </Entree>
  );
};

// Tuile : grande icône + texte, dans une carte.
const Tuile: React.FC<{Icone: Icone; texte: string; debut: number; children?: React.ReactNode; ligne?: boolean}> = ({Icone, texte, debut, children, ligne}) => {
  const m = useMise();
  const enLigne = ligne || m.v;
  return (
    <Entree debut={debut} style={{flex: 1, minWidth: 0, display: 'flex'}}>
      <Carte
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: enLigne ? 'row' : 'column',
          alignItems: enLigne ? 'center' : 'flex-start',
          justifyContent: enLigne ? 'flex-start' : 'center',
          gap: enLigne ? 34 : 28,
          padding: enLigne ? '20px 36px' : '40px 44px',
        }}
      >
        <Rond Icone={Icone} taille={ligne ? (m.v ? 120 : 110) : m.v ? 150 : 170} accent />
        <Texte taille={m.texte} gras={600} couleur={C.gris}>
          {texte}
        </Texte>
        {children}
      </Carte>
    </Entree>
  );
};

// Disposition « grand visuel + textes » : côte à côte en 16:9, empilés en 9:16.
const VisuelTextes: React.FC<{visuel: React.ReactNode; children: React.ReactNode}> = ({visuel, children}) => {
  const m = useMise();
  return (
    <Zone>
      <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', alignItems: m.v ? 'stretch' : 'center', gap: m.v ? 60 : 100, flex: m.v ? undefined : 1}}>
        <div style={{flexShrink: 0, display: 'flex', justifyContent: 'center'}}>{visuel}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: m.v ? 40 : 40, flex: 1, minWidth: 0}}>{children}</div>
      </div>
    </Zone>
  );
};

// Frise « point de départ » : drapeau puis 8 semaines.
const FriseDepart: React.FC<{debut: number}> = ({debut}) => {
  const m = useMise();
  const p = useTrace(debut, 40);
  const largeur = m.L - 2 * m.margeX;
  const t = m.v ? 124 : 104;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <Rond Icone={IconeDrapeau} taille={t} accent couleur={C.ambre} />
      <div style={{position: 'relative', flex: 1, height: t}}>
        <svg width={largeur - t - 22} height={t} style={{position: 'absolute', inset: 0}}>
          <line x1={0} x2={(largeur - t - 22) * p} y1={t / 2} y2={t / 2} stroke={C.bordure} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />
          {Array.from({length: 8}).map((_, i) => {
            const x = ((i + 0.5) / 8) * (largeur - t - 22);
            const o = Math.max(0, Math.min(1, (p * 8 - i) * 1.5));
            return (
              <g key={i} opacity={o}>
                <circle cx={x} cy={t / 2} r={i === 0 ? 18 : 12} fill={i === 0 ? C.menthe : C.marine} stroke={i === 0 ? C.menthe : C.texteDoux} strokeWidth={3} />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ——— Scènes ———

const S01: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [surTitre, titre, mention] = scene.onScreen;
  const carte = extrait(scene.visual, 'Si ton rapport', 'professionnel de santé.');
  return (
    <Zone gap={m.v ? 70 : 46}>
      <TitleCard surTitre={surTitre} titre={titre} sousTitre={mention} />
      <FriseDepart debut={cle('il faut un point de départ')} />
      <CartePrudence texte={carte} debut={cle('Avant de commencer')} />
    </Zone>
  );
};

const S02: React.FC<PropsScene> = ({scene, cle}) => {
  const cles = ['objectif réaliste', 'photos de départ', 'tour de taille', 'poids en tendance', 'masse grasse', "sans s'obséder"];
  return (
    <Zone>
      <StepList etapes={scene.onScreen.map((texte, i) => ({texte, Icone: ICONES_ETAPES[i], debut: cle(cles[i])}))} />
    </Zone>
  );
};

// Champ qui se remplit lettre par lettre.
const ChampRempli: React.FC<{texte: string; debut: number}> = ({texte, debut}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(texte.length, Math.floor((frame - debut) / 2)));
  const m = useMise();
  return (
    <div style={{border: `2px solid ${C.menthe}`, borderRadius: 14, padding: m.v ? '26px 30px' : '26px 32px', minHeight: m.titre * 1.2, display: 'flex', alignItems: 'center'}}>
      <Texte taille={m.titre * 0.78} titre couleur={C.gris} lignesMax={2}>
        {texte.slice(0, n) + (n < texte.length && Math.floor(frame / 15) % 2 ? '|' : '')}
      </Texte>
    </div>
  );
};

const S03: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [entete, bon1, bon2, mauvais] = scene.onScreen;
  const debutCarte = cle('Écris ton objectif');
  return (
    <>
      <Phase de={0} a={debutCarte}>
        <Zone gap={m.v ? 60 : 50}>
          <Entree debut={cle('Un bon objectif')} style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <Rond Icone={IconeCible} taille={m.v ? 120 : 110} accent />
            <Texte taille={m.titre} titre couleur={C.gris}>
              {entete}
            </Texte>
          </Entree>
          <Compare bons={[bon1, bon2]} mauvais={[mauvais]} debutBons={cle('Par exemple')} debutMauvais={cle("À l'inverse")} debutBarre={cle('ne se mesure pas')} />
        </Zone>
      </Phase>
      <Phase de={debutCarte}>
        <Zone gap={m.v ? 60 : 46}>
          <Entree debut={debutCarte}>
            <Texte taille={m.titre} titre couleur={C.gris}>
              {entete}
            </Texte>
          </Entree>
          <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', alignItems: 'center', gap: m.v ? 50 : 70}}>
            <Entree debut={debutCarte + 4}>
              <CibleFloue taille={m.v ? 340 : 330} debut={1e6} />
            </Entree>
            <Entree debut={debutCarte + 8} style={{flex: 1, width: m.v ? '100%' : undefined}}>
              <div style={{background: C.marineCarte, border: `2px solid ${C.bordure}`, borderRadius: RAYON, padding: m.v ? 40 : 44, display: 'flex', flexDirection: 'column', gap: 24}}>
                {/* « Mon objectif » : intitulé de la carte, repris de la description du visuel */}
                <Texte taille={m.petit} gras={600} couleur={C.menthe}>
                  Mon objectif
                </Texte>
                <ChampRempli texte={bon1} debut={debutCarte + 24} />
              </div>
            </Entree>
          </div>
        </Zone>
      </Phase>
    </>
  );
};

const S04: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [vues, conditions, rythme, privees] = scene.onScreen;
  const t2 = cle('Garde la même lumière');
  const t3 = cle('Tu les reprendras');
  const t4 = cle('Ces photos restent privées');
  const ferme = useTrace(t4 + 30, 20);
  const cadre = (vue: 'face' | 'profil' | 'dos', i: number, h: number, debut: number) => (
    <Entree key={vue} debut={debut + i * 14} style={{flex: 1, display: 'flex'}}>
      <div
        style={{
          flex: 1,
          border: `2px dashed ${C.texteDoux}`,
          borderRadius: RAYON,
          background: C.marineCarte,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 18,
        }}
      >
        <Silhouette hauteur={h} vue={vue} couleur={C.menthe} />
      </div>
    </Entree>
  );
  return (
    <>
      <Phase de={0} a={t2}>
        <Zone gap={m.v ? 50 : 36}>
          <div style={{flex: 1, minHeight: 0, display: 'flex', gap: m.v ? 22 : 40}}>{(['face', 'profil', 'dos'] as const).map((v, i) => cadre(v, i, m.v ? 440 : 470, 8))}</div>
          <Entree debut={20}>
            <Texte taille={m.titre} titre couleur={C.gris} centre>
              {vues}
            </Texte>
          </Entree>
        </Zone>
      </Phase>
      <Phase de={t2} a={t3}>
        <Zone gap={m.v ? 60 : 50}>
          <LigneIcone texte={conditions} debut={t2 + 4} Icone={IconePhoto} grand />
          <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', gap: m.v ? 24 : 36, flex: 1}}>
            {[IconeSoleil, IconeTenue, IconeLieu].map((I, i) => (
              <Entree key={i} debut={t2 + 16 + i * 14} style={{flex: 1, display: 'flex'}}>
                <Carte style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Rond Icone={I} taille={m.v ? 190 : 230} accent />
                </Carte>
              </Entree>
            ))}
          </div>
        </Zone>
      </Phase>
      <Phase de={t3} a={t4}>
        <Zone gap={m.v ? 60 : 50}>
          <LigneIcone texte={rythme} debut={t3} Icone={IconeCalendrier} grand />
          <FriseIcones nombre={8} reperes={[0, 2, 4, 6]} Icone={IconePhoto} debut={t3 + 10} />
        </Zone>
      </Phase>
      <Phase de={t4}>
        <Zone gap={m.v ? 60 : 50}>
          <div style={{flex: 1, display: 'flex', gap: m.v ? 22 : 40, position: 'relative'}}>
            {(['face', 'profil', 'dos'] as const).map((v, i) => (
              <div key={v} style={{flex: 1, display: 'flex', opacity: 0.35}}>
                {cadre(v, i, m.v ? 360 : 380, t4 - 20)}
              </div>
            ))}
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Entree debut={t4 + 6}>
                <div style={{width: m.v ? 280 : 300, height: m.v ? 280 : 300, borderRadius: 999, background: C.marine, border: `3px solid ${C.menthe}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <IconeCadenas taille={m.v ? 170 : 180} ferme={ferme} />
                </div>
              </Entree>
            </div>
          </div>
          <Entree debut={t4 + 4}>
            <Texte taille={m.titre} titre couleur={C.gris} centre>
              {privees}
            </Texte>
          </Entree>
        </Zone>
      </Phase>
    </>
  );
};

// Frise de semaines avec une icône dans les cases marquées.
const FriseIcones: React.FC<{nombre: number; reperes: number[]; Icone: Icone; debut: number}> = ({nombre, reperes, Icone, debut}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  return (
    <div style={{flex: 1, display: 'grid', gridTemplateColumns: m.v ? 'repeat(4, 1fr)' : `repeat(${nombre}, 1fr)`, gap: m.v ? 20 : 18}}>
      {Array.from({length: nombre}).map((_, i) => {
        const o = Math.max(0, Math.min(1, (frame - debut - i * 5) / 10));
        const marque = reperes.includes(i);
        return (
          <div
            key={i}
            style={{
              opacity: o,
              borderRadius: 16,
              border: `2px solid ${marque ? C.menthe : C.bordure}`,
              background: marque ? 'rgba(79,209,188,0.14)' : 'rgba(22,38,61,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: m.v ? 200 : 180,
            }}
          >
            {marque ? <Icone taille={m.v ? 90 : 84} /> : <div style={{width: 14, height: 14, borderRadius: 7, background: C.bordure}} />}
          </div>
        );
      })}
    </div>
  );
};

const S05: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [ruban, nombril, matin, semaine] = scene.onScreen;
  const t2 = cle('Mesure-toi');
  return (
    <>
      <Phase de={0} a={t2}>
        <VisuelTextes visuel={<RubanTaille hauteur={m.v ? 640 : 720} debut={cle('Place-le')} />}>
          <LigneIcone texte={ruban} debut={cle('Utilise')} Icone={IconeRuban} grand />
          <LigneIcone texte={nombril} debut={cle('Place-le')} Icone={IconeCible} grand />
        </VisuelTextes>
      </Phase>
      <Phase de={t2}>
        <Zone gap={m.v ? 40 : 36}>
          <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', gap: m.v ? 24 : 36, flex: 1}}>
            <Tuile Icone={IconeReveil} texte={matin} debut={t2 + 4} />
            <Tuile Icone={IconeCalendrier} texte={semaine} debut={cle('une fois par semaine')} />
          </div>
          <Frise nombre={8} largeur={m.L - 2 * m.margeX} debut={cle('une fois par semaine') + 10} reperes={[0, 1, 2, 3, 4, 5, 6, 7]} hauteur={m.v ? 80 : 74} />
        </Zone>
      </Phase>
    </>
  );
};

// Semaine schématique : 7 jours, quelques jours marqués d'une balance.
const SemainePesees: React.FC<{debut: number}> = ({debut}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const marques = [0, 2, 4];
  return (
    <div style={{display: 'flex', gap: m.v ? 12 : 16}}>
      {Array.from({length: 7}).map((_, i) => {
        const o = Math.max(0, Math.min(1, (frame - debut - i * 4) / 10));
        const marque = marques.includes(i);
        return (
          <div
            key={i}
            style={{
              flex: 1,
              opacity: o,
              height: m.v ? 190 : 130,
              borderRadius: 14,
              border: `2px solid ${marque ? (i === 0 ? C.menthe : 'rgba(79,209,188,0.5)') : C.bordure}`,
              borderStyle: marque && i > 0 ? 'dashed' : 'solid',
              background: marque && i === 0 ? 'rgba(79,209,188,0.14)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {marque && <IconeBalance taille={m.v ? 80 : 64} couleur={i === 0 ? C.menthe : C.texteDoux} />}
          </div>
        );
      })}
    </div>
  );
};

const S06: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [pesees, conditions, varie, moyenne] = scene.onScreen;
  const t2 = cle('Ce qui compte');
  const largeur = m.L - 2 * m.margeX;
  return (
    <>
      <Phase de={0} a={t2}>
        <Zone gap={m.v ? 60 : 44}>
          <BigStat texte={pesees} debut={cle('Pèse-toi')} visuel={<BalanceImpedance taille={m.v ? 400 : 320} />} />
          <SemainePesees debut={cle('Pèse-toi') + 20} />
          <LigneIcone texte={conditions} debut={cle('toujours dans les mêmes')} />
        </Zone>
      </Phase>
      <Phase de={t2}>
        <Zone gap={m.v ? 40 : 26}>
          <Carte style={{padding: m.v ? '30px 20px 10px' : '30px 30px 10px'}}>
            <CourbePoids
              largeur={largeur - (m.v ? 44 : 64)}
              hauteur={m.v ? 560 : 440}
              debutPoints={t2 + 6}
              debutEtiquettes={cle("l'eau, le sel")}
              etiquettes={['eau', 'sel', 'sommeil']}
              debutMoyenne={cle('Regarde la courbe')}
            />
          </Carte>
          <LigneIcone texte={varie} debut={cle('Parce que')} />
          <LigneIcone texte={moyenne} debut={cle('Regarde la courbe')} />
        </Zone>
      </Phase>
    </>
  );
};

// Le même appareil, mesure après mesure : balance → balance → balance.
const MemeAppareil: React.FC<{debut: number}> = ({debut}) => {
  const m = useMise();
  const p = useTrace(debut, 60);
  const t = m.v ? 240 : 270;
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <svg width={m.v ? 90 : 160} height={40} style={{opacity: Math.max(0, Math.min(1, p * 3 - i + 0.5))}}>
              <path d={`M6,20 H${(m.v ? 90 : 160) - 14}`} stroke={C.menthe} strokeWidth={4} strokeLinecap="round" />
              <path d={`M${(m.v ? 90 : 160) - 28},8 L${(m.v ? 90 : 160) - 10},20 L${(m.v ? 90 : 160) - 28},32`} fill="none" stroke={C.menthe} strokeWidth={4} strokeLinecap="round" />
            </svg>
          )}
          <div style={{opacity: Math.max(0, Math.min(1, p * 3 - i + 1))}}>
            <Carte style={{padding: m.v ? 20 : 26}}>
              <BalanceImpedance taille={t} />
            </Carte>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const S07: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [appareil, matin, ecart, evolution] = scene.onScreen;
  const t2 = cle('Attention');
  const t3 = cle('Donc on ne suit pas');
  return (
    <>
      <Phase de={0} a={t2}>
        <VisuelTextes visuel={<BalanceImpedance taille={m.v ? 620 : 540} />}>
          <LigneIcone texte={appareil} debut={cle('Mesure-la')} Icone={IconeBalance} grand />
          <LigneIcone texte={matin} debut={cle('le matin')} Icone={IconeReveil} grand />
        </VisuelTextes>
      </Phase>
      <Phase de={t2} a={t3}>
        <Zone>
          <BigStat texte={ecart} debut={t2 + 4} couleur={C.ambre} visuel={<CibleFloue taille={m.v ? 640 : 560} debut={t2 + 10} />} />
        </Zone>
      </Phase>
      <Phase de={t3}>
        <Zone gap={m.v ? 70 : 60}>
          <Entree debut={t3 + 4}>
            <MemeAppareil debut={t3 + 8} />
          </Entree>
          <Entree debut={t3 + 4}>
            <Texte taille={m.titre} titre couleur={C.gris}>
              {evolution}
            </Texte>
          </Entree>
        </Zone>
      </Phase>
    </>
  );
};

const S08: React.FC<PropsScene> = ({scene, cle}) => {
  const [titre, mention] = scene.onScreen;
  return (
    <Table
      titre={titre}
      mention={mention}
      reperes={REPERES_MASSE_GRASSE}
      debuts={REPERES_MASSE_GRASSE.map((r) => cle(r.cle))}
      debutMention={cle('Ce sont des ordres')}
    />
  );
};

const S09: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [titre, exemple, points, securite] = scene.onScreen;
  const largeur = m.L - 2 * m.margeX;
  return (
    <Zone gap={m.v ? 46 : 24}>
      <Entree debut={0}>
        <Texte taille={m.titre} titre couleur={C.gris}>
          {titre}
        </Texte>
      </Entree>
      <Entree debut={cle('Par exemple')}>
        <Texte taille={m.texte} gras={600} couleur={C.texte}>
          {exemple}
        </Texte>
      </Entree>
      <RegleFourchette largeur={largeur} depart={24} cibleMin={20} cibleMax={22} debut={cle('Par exemple') + 10} echelle={m.v ? 1.6 : 1.25} />
      <Entree debut={cle('Ça représente')} style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        <Texte taille={m.texte} gras={600} couleur={C.texte}>
          {points}
        </Texte>
        <Frise nombre={8} largeur={largeur} debut={cle('Ça représente') + 8} hauteur={m.v ? 110 : 60} />
      </Entree>
      <CartePrudence titre={securite} debut={cle('Et une règle de sécurité')} />
    </Zone>
  );
};

const S10: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [frequence, comparaison, energie, stress] = scene.onScreen;
  const corps = extrait(scene.narration, 'Cet objectif', 'professionnel de santé.');
  const Comparaison: Icone = ({taille}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
      <Silhouette hauteur={taille * 0.95} couleur={C.menthe} />
      <IconeDifferent taille={taille * 0.4} />
      <Silhouette hauteur={taille * 0.95} couleur={C.menthe} rondeur={0.6} />
    </div>
  );
  const items = [
    {texte: frequence, Icone: IconeCalendrier, debut: cle('Limite')},
    {texte: comparaison, Icone: Comparaison, debut: cle('Ne te compare')},
    {texte: energie, Icone: IconeCoeur, debut: cle('Et rappelle-toi')},
  ];
  return (
    <Zone gap={m.v ? 40 : 36}>
      <div style={{display: 'flex', flexDirection: 'column', gap: m.v ? 20 : 18, flex: 1}}>
        {items.map((it, i) => (
          <Tuile key={i} Icone={it.Icone} texte={it.texte} debut={it.debut} ligne />
        ))}
      </div>
      <CartePrudence titre={stress} texte={corps} debut={cle('Si te fixer un chiffre')} />
    </Zone>
  );
};

const S11: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [titre, fiche, defi, quiz, tableau, suite] = scene.onScreen;
  const t2 = cle('Cette semaine');
  return (
    <>
      <Phase de={0} a={t2}>
        <Zone>
          <div style={{flex: 1, display: 'grid', gridTemplateColumns: m.v ? '1fr 1fr' : '1fr 1fr 1fr', gap: m.v ? 24 : 30}}>
            {ICONES_ETAPES.map((I, i) => (
              <Entree key={i} debut={10 + i * 12} style={{display: 'flex'}}>
                <Carte style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
                  <div style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: m.v ? 70 : 72, color: C.menthe}}>{i + 1}</div>
                  <Rond Icone={I} taille={m.v ? 150 : 170} accent />
                </Carte>
              </Entree>
            ))}
          </div>
        </Zone>
      </Phase>
      <Phase de={t2}>
        <Zone>
          <Recap
            titre={titre}
            elements={[
              {texte: fiche, Icone: IconeFiche, debut: cle('lire ta fiche')},
              {texte: defi, Icone: IconeCible, debut: cle('relever le défi')},
              {texte: quiz, Icone: IconeQuiz, debut: cle('faire le mini-quiz')},
              {texte: tableau, Icone: IconeTableau, debut: cle('remplir ton tableau')},
            ]}
            suite={suite}
            debutSuite={cle('Rendez-vous')}
          />
        </Zone>
      </Phase>
    </>
  );
};

const S12: React.FC<PropsScene> = ({scene, dureeImages}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const [mention, signature] = scene.onScreen;
  const noir = interpolate(frame, [dureeImages - 30, dureeImages - 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const anneau = useTrace(0, 50);
  const d = m.v ? 840 : 600;
  return (
    <>
      <Zone gap={m.v ? 70 : 40} style={{alignItems: 'center'}}>
        <div style={{position: 'relative', width: d, height: d * (m.v ? 0.75 : 0.62), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={d} height={d} style={{position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)'}}>
            <circle cx={d / 2} cy={d / 2} r={d / 2 - 6} fill="none" stroke={C.vert} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - anneau} transform={`rotate(-90 ${d / 2} ${d / 2})`} />
            <circle cx={d / 2} cy={d / 2} r={d / 2 - 40} fill="none" stroke={C.bordure} strokeWidth={2} strokeDasharray="3 12" />
          </svg>
          <Entree debut={0}>
            <div style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: m.v ? 270 : 220, letterSpacing: 14, color: C.gris, lineHeight: 1}}>RISE</div>
          </Entree>
        </div>
        <CartePrudence titre={mention} debut={8} />
        <Entree debut={20}>
          <Texte taille={m.petit} titre gras={500} couleur={C.texteDoux} centre>
            {signature}
          </Texte>
        </Entree>
      </Zone>
      <AbsoluteFill style={{background: '#000', opacity: noir}} />
    </>
  );
};

export const SCENES_MODULE1: Record<string, React.FC<PropsScene>> = {
  's01-intro': S01,
  's02-plan': S02,
  's03-objectif': S03,
  's04-photos': S04,
  's05-taille': S05,
  's06-poids': S06,
  's07-masse-grasse': S07,
  's08-reperes': S08,
  's09-fourchette': S09,
  's10-sans-obsession': S10,
  's11-recap': S11,
  's12-outro': S12,
};
