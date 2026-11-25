// Polices (licence SIL Open Font License, incluses dans le projet : pas besoin d'Internet).
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-700.css';
// Polices des autres directions artistiques (chargées seulement si elles sont utilisées).
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-700.css';
import '@fontsource/sora/latin-600.css';
import '@fontsource/sora/latin-700.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-sans/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import {continueRender, delayRender} from 'remotion';
import {POLICE_CHIFFRES, POLICE_TEXTE, POLICE_TITRE} from './theme';

// On attend que les polices de la direction choisie soient chargées avant chaque image.
const attente = delayRender('Chargement des polices');
const familles = [POLICE_TEXTE, POLICE_TITRE, POLICE_CHIFFRES].map((p) => p.split(',')[0]);
Promise.all(
  familles.flatMap((f) => ['400', '500', '600', '700'].map((poids) => document.fonts.load(`${poids} 40px ${f}`, 'Àéèêç0123'))),
)
  .then(() => continueRender(attente))
  .catch(() => continueRender(attente));
