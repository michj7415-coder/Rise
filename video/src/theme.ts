// Identité visuelle RISE, commune à tous les modules.
import {loadFont as chargerSpaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as chargerInter} from '@remotion/google-fonts/Inter';
import {cancelRender, continueRender, delayRender, getStaticFiles, staticFile} from 'remotion';

export const C = {
  marine: '#0F1B2D',
  marineCarte: '#16263D', // marine légèrement éclairci pour les cartes
  bordure: '#2A3F5C',
  vert: '#0B7A6B',
  menthe: '#4FD1BC',
  ambre: '#F2B134', // accent rare
  gris: '#F1F5F9',
  texte: '#DCE5EE',
  texteDoux: '#9FB0C4',
  prudenceFond: '#FFF4DB',
  prudenceTexte: '#7A4B00',
};

// Polices : par défaut via @remotion/google-fonts. Si public/polices/ existe (créé par
// « node scripts/polices-locales.mjs »), les mêmes fichiers Google sont chargés en local,
// utile quand le navigateur de rendu n'a pas d'accès direct à Google Fonts.
const policesLocales = getStaticFiles().some((f) => f.name === 'polices/polices.json');
if (policesLocales) {
  const attente = delayRender('Polices locales');
  fetch(staticFile('polices/polices.json'))
    .then((r) => r.json())
    .then((liste: {famille: string; poids: string; plage: string; fichier: string}[]) =>
      Promise.all(
        liste.map(async (p) => {
          const face = new FontFace(p.famille, `url(${staticFile(`polices/${p.fichier}`)}) format('woff2')`, {weight: p.poids, unicodeRange: p.plage});
          document.fonts.add(await face.load());
        }),
      ),
    )
    .then(() => continueRender(attente))
    .catch((e) => cancelRender(e));
}
export const POLICE_TITRE = policesLocales
  ? '"Space Grotesk", sans-serif'
  : chargerSpaceGrotesk('normal', {weights: ['500', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const POLICE_TEXTE = policesLocales
  ? 'Inter, sans-serif'
  : chargerInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;

export const FPS = 30;
export const TRANSITION = 12; // images de fondu entre deux scènes
export const RAYON = 18;
export const PRUDENCE_MIN = 6; // secondes minimum d'affichage d'une carte de prudence
