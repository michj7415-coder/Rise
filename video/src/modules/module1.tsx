// Module 1 — « Bases et mesures de départ » : visuel de chaque scène.
// Tous les textes viennent de src/data/module1.json (scene.onScreen / scene.narration).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Entree, Phase, useTrace} from '../composants/Anim';
import {CartePrudence} from '../composants/CartePrudence';
import {
  ICONES_ETAPES,
  IconeCadenas,
  IconeCalendrier,
  IconeCoeur,
  IconeDifferent,
  IconeFiche,
  IconeFleche,
  IconePhoto,
  IconeQuiz,
  IconeReveil,
  IconeTableau,
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

// Cartes de prudence : mot-clé de la narration où la carte apparaît.
// Utilisé aussi par Root.tsx pour garantir au moins 6 s d'affichage.
export const PRUDENCE_MODULE1: Record<string, string> = {
  's01-intro': 'Avant de commencer',
  's09-fourchette': 'Et une règle de sécurité',
  's10-sans-obsession': 'Si te fixer un chiffre',
  's12-outro': '',
};

// Extrait une phrase exacte de la narration (pour les cartes de prudence).
const extrait = (narration: string, debut: string, fin?: string) => {
  const i = narration.indexOf(debut);
  if (i < 0) throw new Error(`Texte introuvable dans la narration : ${debut}`);
  const j = fin ? narration.indexOf(fin, i) + fin.length : narration.length;
  return narration.slice(i, j);
};

// Ligne de texte avec icône (phases « visuel + texte »).
const LigneIcone: React.FC<{texte: string; debut: number; Icone?: React.FC<{taille: number; couleur?: string}>; grand?: boolean}> = ({
  texte,
  debut,
  Icone,
  grand,
}) => {
  const m = useMise();
  return (
    <Entree debut={debut} style={{display: 'flex', alignItems: 'center', gap: 24}}>
      {Icone && <Icone taille={m.v ? 64 : 60} />}
      <Texte taille={grand ? m.titre * 0.8 : m.texte} titre={grand} gras={grand ? 700 : 600} couleur={C.gris}>
        {texte}
      </Texte>
    </Entree>
  );
};

// Disposition « visuel + textes » : côte à côte en 16:9, empilés en 9:16.
const VisuelTextes: React.FC<{visuel: React.ReactNode; children: React.ReactNode}> = ({visuel, children}) => {
  const m = useMise();
  return (
    <Zone>
      <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', alignItems: m.v ? 'flex-start' : 'center', gap: m.v ? 50 : 90}}>
        <div style={{flexShrink: 0}}>{visuel}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: m.v ? 30 : 28, flex: 1, minWidth: 0}}>{children}</div>
      </div>
    </Zone>
  );
};

const S01: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [surTitre, titre, mention] = scene.onScreen;
  const carte = extrait(scene.visual, 'Si ton rapport', 'professionnel de santé.');
  return (
    <Zone gap={m.v ? 70 : 50}>
      <TitleCard surTitre={surTitre} titre={titre} sousTitre={mention} />
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
    <div style={{border: `2px solid ${C.menthe}`, borderRadius: 12, padding: '18px 24px', minHeight: m.texte * 1.4}}>
      <Texte taille={m.texte} gras={600} couleur={C.gris} lignesMax={2}>
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
        <Zone>
          <Entree debut={cle('Un bon objectif')}>
            <Texte taille={m.titre} titre couleur={C.gris}>
              {entete}
            </Texte>
          </Entree>
          <Compare bons={[bon1, bon2]} mauvais={[mauvais]} debutBons={cle('Par exemple')} debutMauvais={cle("À l'inverse")} debutBarre={cle('ne se mesure pas')} />
        </Zone>
      </Phase>
      <Phase de={debutCarte}>
        <Zone>
          <Entree debut={debutCarte}>
            <Texte taille={m.titre} titre couleur={C.gris}>
              {entete}
            </Texte>
          </Entree>
          <Entree debut={debutCarte + 8}>
            <div style={{background: C.marineCarte, border: `2px solid ${C.bordure}`, borderRadius: RAYON, padding: m.v ? 34 : 36, display: 'flex', flexDirection: 'column', gap: 20}}>
              {/* « Mon objectif » : intitulé de la carte, repris de la description du visuel */}
              <Texte taille={m.petit} gras={600} couleur={C.menthe}>
                Mon objectif
              </Texte>
              <ChampRempli texte={bon1} debut={debutCarte + 24} />
            </div>
          </Entree>
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
  const cadre = (vue: 'face' | 'profil' | 'dos', i: number) => (
    <Entree key={vue} debut={8 + i * 14}>
      <div style={{border: `2px dashed ${C.bordure}`, borderRadius: RAYON, padding: m.v ? '18px 20px' : '22px 30px', background: C.marineCarte}}>
        <Silhouette hauteur={m.v ? 300 : 320} vue={vue} couleur={C.texteDoux} />
      </div>
    </Entree>
  );
  return (
    <>
      <Phase de={0} a={t2}>
        <Zone>
          <div style={{display: 'flex', gap: m.v ? 24 : 40, justifyContent: 'center'}}>{(['face', 'profil', 'dos'] as const).map(cadre)}</div>
          <Entree debut={20}>
            <Texte taille={m.titre * 0.8} titre couleur={C.gris} centre>
              {vues}
            </Texte>
          </Entree>
        </Zone>
      </Phase>
      <Phase de={t2} a={t3}>
        <VisuelTextes visuel={<IconePhoto taille={m.v ? 200 : 240} />}>
          <LigneIcone texte={conditions} debut={t2 + 4} grand />
        </VisuelTextes>
      </Phase>
      <Phase de={t3} a={t4}>
        <Zone>
          <Entree debut={t3}>
            <Texte taille={m.titre * 0.8} titre couleur={C.gris}>
              {rythme}
            </Texte>
          </Entree>
          <Frise nombre={8} largeur={m.L - 2 * m.margeX} debut={t3 + 10} reperes={[0, 2, 4, 6]} hauteur={m.v ? 90 : 80} />
        </Zone>
      </Phase>
      <Phase de={t4}>
        <VisuelTextes visuel={<IconeCadenas taille={m.v ? 200 : 220} ferme={ferme} />}>
          <LigneIcone texte={privees} debut={t4 + 4} grand />
        </VisuelTextes>
      </Phase>
    </>
  );
};

const S05: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [ruban, nombril, matin, semaine] = scene.onScreen;
  const t2 = cle('Mesure-toi');
  return (
    <>
      <Phase de={0} a={t2}>
        <VisuelTextes visuel={<RubanTaille hauteur={m.v ? 520 : 600} debut={cle('Place-le')} />}>
          <LigneIcone texte={ruban} debut={cle('Utilise')} />
          <LigneIcone texte={nombril} debut={cle('Place-le')} />
        </VisuelTextes>
      </Phase>
      <Phase de={t2}>
        <Zone gap={m.v ? 60 : 50}>
          <LigneIcone texte={matin} debut={t2 + 4} Icone={IconeReveil} grand />
          <LigneIcone texte={semaine} debut={cle('une fois par semaine')} Icone={IconeCalendrier} grand />
          <Frise nombre={8} largeur={m.L - 2 * m.margeX} debut={cle('une fois par semaine') + 10} reperes={[0, 1, 2, 3, 4, 5, 6, 7]} hauteur={m.v ? 80 : 70} />
        </Zone>
      </Phase>
    </>
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
        <Zone>
          <BigStat texte={pesees} debut={cle('Pèse-toi')} visuel={<IconeBalanceGrand />} />
          <LigneIcone texte={conditions} debut={cle('toujours dans les mêmes')} />
        </Zone>
      </Phase>
      <Phase de={t2}>
        <Zone gap={m.v ? 40 : 24}>
          <CourbePoids
            largeur={largeur}
            hauteur={m.v ? 520 : 420}
            debutPoints={t2 + 6}
            debutEtiquettes={cle("l'eau, le sel")}
            etiquettes={['eau', 'sel', 'sommeil']}
            debutMoyenne={cle('Regarde la courbe')}
          />
          <LigneIcone texte={varie} debut={cle('Parce que')} />
          <LigneIcone texte={moyenne} debut={cle('Regarde la courbe')} />
        </Zone>
      </Phase>
    </>
  );
};

const IconeBalanceGrand: React.FC = () => {
  const m = useMise();
  return <BalanceImpedance taille={m.v ? 240 : 260} />;
};

const S07: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [appareil, matin, ecart, evolution] = scene.onScreen;
  const t2 = cle('Attention');
  const t3 = cle('Donc on ne suit pas');
  return (
    <>
      <Phase de={0} a={t2}>
        <VisuelTextes visuel={<BalanceImpedance taille={m.v ? 340 : 380} />}>
          <LigneIcone texte={appareil} debut={cle('Mesure-la')} grand />
          <LigneIcone texte={matin} debut={cle('le matin')} />
        </VisuelTextes>
      </Phase>
      <Phase de={t2} a={t3}>
        <Zone>
          <BigStat texte={ecart} debut={t2 + 4} couleur={C.ambre} visuel={<CibleFloue taille={m.v ? 340 : 380} debut={t2 + 10} />} />
        </Zone>
      </Phase>
      <Phase de={t3}>
        <VisuelTextes visuel={<IconeFleche taille={m.v ? 220 : 260} />}>
          <LigneIcone texte={evolution} debut={t3 + 4} grand />
        </VisuelTextes>
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
    <Zone gap={m.v ? 44 : 26}>
      <Entree debut={0}>
        <Texte taille={m.v ? 64 : 58} titre couleur={C.gris}>
          {titre}
        </Texte>
      </Entree>
      <Entree debut={cle('Par exemple')}>
        <Texte taille={m.texte} gras={600} couleur={C.texte}>
          {exemple}
        </Texte>
      </Entree>
      <RegleFourchette largeur={largeur} depart={24} cibleMin={20} cibleMax={22} debut={cle('Par exemple') + 10} />
      <Entree debut={cle('Ça représente')} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <Texte taille={m.texte} gras={600} couleur={C.texte}>
          {points}
        </Texte>
        <Frise nombre={8} largeur={largeur} debut={cle('Ça représente') + 8} hauteur={m.v ? 56 : 44} />
      </Entree>
      <CartePrudence titre={securite} debut={cle('Et une règle de sécurité')} />
    </Zone>
  );
};

const S10: React.FC<PropsScene> = ({scene, cle}) => {
  const m = useMise();
  const [frequence, comparaison, energie, stress] = scene.onScreen;
  const corps = extrait(scene.narration, 'Cet objectif', 'professionnel de santé.');
  const Comparaison: React.FC<{taille: number; couleur?: string}> = ({taille}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
      <Silhouette hauteur={taille} couleur={C.menthe} />
      <IconeDifferent taille={taille * 0.45} />
      <Silhouette hauteur={taille} couleur={C.menthe} rondeur={0.6} />
    </div>
  );
  const items = [
    {texte: frequence, Icone: IconeCalendrier, debut: cle('Limite')},
    {texte: comparaison, Icone: Comparaison, debut: cle('Ne te compare')},
    {texte: energie, Icone: IconeCoeur, debut: cle('Et rappelle-toi')},
  ];
  return (
    <Zone gap={m.v ? 50 : 40}>
      <div style={{display: 'flex', flexDirection: m.v ? 'column' : 'row', gap: m.v ? 26 : 30}}>
        {items.map((it, i) => (
          <Entree key={i} debut={it.debut} style={{flex: 1, display: 'flex', flexDirection: m.v ? 'row' : 'column', alignItems: m.v ? 'center' : 'flex-start', gap: m.v ? 26 : 18}}>
            <div style={{height: m.v ? 100 : 110, display: 'flex', alignItems: 'center'}}>
              <it.Icone taille={m.v ? 90 : 100} />
            </div>
            <Texte taille={m.texte} gras={600} couleur={C.gris}>
              {it.texte}
            </Texte>
          </Entree>
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
          <div style={{display: 'flex', flexWrap: 'wrap', gap: m.v ? 40 : 60, justifyContent: 'center'}}>
            {ICONES_ETAPES.map((I, i) => (
              <Entree key={i} debut={10 + i * 12}>
                <I taille={m.v ? 150 : 150} />
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
const IconeCible = ICONES_ETAPES[0];

const S12: React.FC<PropsScene> = ({scene, dureeImages}) => {
  const m = useMise();
  const frame = useCurrentFrame();
  const [mention, signature] = scene.onScreen;
  const noir = interpolate(frame, [dureeImages - 30, dureeImages - 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Zone gap={m.v ? 60 : 44} style={{alignItems: 'center'}}>
        <Entree debut={0}>
          <div style={{fontFamily: POLICE_TITRE, fontWeight: 700, fontSize: m.v ? 220 : 200, letterSpacing: 12, color: C.gris, lineHeight: 1}}>RISE</div>
        </Entree>
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
