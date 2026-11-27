// Contrôle automatique pour « npm run stills » : signale tout texte qui sort de sa zone,
// qui est coupé, qui dépasse son nombre de lignes, ou qui entre dans la zone des sous-titres.
import React, {useLayoutEffect} from 'react';
import {continueRender, delayRender, useCurrentFrame} from 'remotion';

const verifier = (scene: string) => {
  const toile = document.querySelector('[data-toile]')!.getBoundingClientRect();
  const signal = (msg: string) => console.error(`CONTROLE|${scene}|${msg}`);
  const zoneST = document.querySelector('[data-zone="sous-titres"]')?.getBoundingClientRect();
  const limiteBas = Number((document.querySelector('[data-toile]') as HTMLElement).dataset.limiteBas);
  document.querySelectorAll<HTMLElement>('[data-texte]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    const txt = (el.textContent ?? '').slice(0, 50);
    const dansST = zoneST && el.closest('[data-zone="sous-titres"]');
    if (r.left < toile.left - 1 || r.right > toile.right + 1 || r.top < toile.top - 1 || r.bottom > toile.bottom + 1) signal(`sort de l'image : « ${txt} »`);
    const taille = parseFloat(getComputedStyle(el).fontSize);
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + taille * 0.25) signal(`texte coupé : « ${txt} »`);
    const lh = parseFloat(getComputedStyle(el).lineHeight) || taille * 1.3;
    const lignes = Math.round(el.clientHeight / lh);
    const max = Number(el.dataset.lignesMax ?? 2);
    if (lignes > max) signal(`${lignes} lignes (max ${max}) : « ${txt} »`);
    if (!dansST && r.bottom > toile.bottom - limiteBas + 1 && getComputedStyle(el).visibility !== 'hidden') signal(`texte dans la zone des sous-titres : « ${txt} »`);
  });
  // Chevauchements entre textes visibles (hors sous-titres)
  const visibles = [...document.querySelectorAll<HTMLElement>('[data-texte]')].filter(
    (e) => !e.closest('[data-zone="sous-titres"]') && e.getBoundingClientRect().width > 0 && Number(getComputedStyle(e).opacity) > 0.05,
  );
  for (let i = 0; i < visibles.length; i++)
    for (let j = i + 1; j < visibles.length; j++) {
      const a = visibles[i].getBoundingClientRect();
      const b = visibles[j].getBoundingClientRect();
      if (visibles[i].contains(visibles[j]) || visibles[j].contains(visibles[i])) continue;
      const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (x > 4 && y > 4) signal(`chevauchement : « ${(visibles[i].textContent ?? '').slice(0, 30)} » / « ${(visibles[j].textContent ?? '').slice(0, 30)} »`);
    }
};

export const Controle: React.FC<{scene: string}> = ({scene}) => {
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const attente = delayRender('Contrôle');
    let essais = 0;
    const essayer = () => {
      const toile = document.querySelector('[data-toile]')?.getBoundingClientRect();
      if (!toile || toile.width === 0 || toile.top < -1000) {
        if (++essais < 120) setTimeout(essayer, 25);
        else continueRender(attente);
        return;
      }
      verifier(scene);
      continueRender(attente);
    };
    document.fonts.ready.then(() => requestAnimationFrame(essayer));
  }, [frame, scene]);
  return null;
};
