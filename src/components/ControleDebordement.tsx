// Contrôle automatique (utilisé par « npm run stills ») :
// signale tout texte qui sort de sa zone ou qui est coupé.
import React, {useLayoutEffect} from 'react';
import {continueRender, delayRender, useCurrentFrame} from 'remotion';

const verifier = (scene: string) => {
  const toile = document.querySelector('[data-toile]')!.getBoundingClientRect();
  document.querySelectorAll<HTMLElement>('[data-zone]').forEach((zone) => {
    const z = zone.getBoundingClientRect();
    const nom = zone.dataset.zone;
    if (z.left < toile.left - 1 || z.right > toile.right + 1 || z.top < toile.top - 1 || z.bottom > toile.bottom + 1) {
      console.error(`DEBORDEMENT|${scene}|${nom}|la zone sort de l'image`);
    }
    zone.querySelectorAll<HTMLElement>('[data-texte]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const texte = (el.textContent ?? '').slice(0, 60);
      if (r.left < z.left - 1 || r.right > z.right + 1 || r.top < z.top - 1 || r.bottom > z.bottom + 1) {
        console.error(`DEBORDEMENT|${scene}|${nom}|sort de sa zone : « ${texte} »`);
      }
      // Les accents et jambages dépassent un peu de la ligne avec un interligne serré :
      // on tolère en hauteur un quart de la taille du texte (ce n'est pas un vrai débordement).
      const taille = parseFloat(getComputedStyle(el).fontSize) || 16;
      if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + taille * 0.25) {
        console.error(`DEBORDEMENT|${scene}|${nom}|texte coupé : « ${texte} »`);
      }
    });
  });
};

export const ControleDebordement: React.FC<{scene: string}> = ({scene}) => {
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const attente = delayRender('Contrôle des débordements');
    let essais = 0;
    const essayer = () => {
      const toile = document.querySelector('[data-toile]')?.getBoundingClientRect();
      // Remotion prépare d'abord l'image dans un cadre caché (taille nulle) :
      // on attend qu'elle soit réellement affichée avant de mesurer.
      if (!toile || toile.width === 0 || toile.top < -1000) {
        if (++essais < 120) {
          setTimeout(essayer, 25);
        } else {
          console.error(`DEBORDEMENT|${scene}|contrôle|impossible de mesurer cette image`);
          continueRender(attente);
        }
        return;
      }
      verifier(scene);
      continueRender(attente);
    };
    document.fonts.ready.then(() => requestAnimationFrame(essayer));
  }, [frame, scene]);
  return null;
};
