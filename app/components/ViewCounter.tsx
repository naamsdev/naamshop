"use client";

import { useEffect } from 'react';

export default function ViewCounter() {
  useEffect(() => {
    // Incrémenter le compteur de vues
    const vuesActuelles = parseInt(localStorage.getItem('vuesSite') || '0');
    localStorage.setItem('vuesSite', (vuesActuelles + 1).toString());
  }, []);

  // Ce composant ne rend rien visuellement
  return null;
} 