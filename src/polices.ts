// Polices (licence SIL Open Font License, incluses dans le projet : pas besoin d'Internet).
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-700.css';
import {continueRender, delayRender} from 'remotion';

// On attend que les polices soient chargées avant de prendre chaque image.
const attente = delayRender('Chargement des polices');
Promise.all(
  [
    '400 40px Inter',
    '500 40px Inter',
    '600 40px Inter',
    '700 40px Inter',
    '500 40px "Space Grotesk"',
    '700 40px "Space Grotesk"',
  ].map((p) => document.fonts.load(p, 'Àéèêç')),
)
  .then(() => continueRender(attente))
  .catch(() => continueRender(attente));
