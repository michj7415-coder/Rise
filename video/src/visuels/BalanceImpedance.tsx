// Balance à impédance schématique (plateau + électrodes).
import React from 'react';
import {C} from '../theme';

export const BalanceImpedance: React.FC<{taille: number}> = ({taille}) => (
  <svg width={taille} height={taille * 0.8} viewBox="0 0 200 160" fill="none" stroke={C.menthe} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <rect x="20" y="30" width="160" height="110" rx="22" />
    <rect x="70" y="46" width="60" height="26" rx="6" />
    <rect x="38" y="88" width="40" height="38" rx="10" strokeDasharray="5 5" />
    <rect x="122" y="88" width="40" height="38" rx="10" strokeDasharray="5 5" />
  </svg>
);
