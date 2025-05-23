
/**
 * Ce fichier contient des polyfills nécessaires pour faire fonctionner les bibliothèques
 * Node.js dans un environnement navigateur
 */

import { Buffer as buffer } from 'buffer';

// Polyfill pour la variable globale 'global'
window.global = window;

// Polyfill pour process.env
// @ts-ignore
window.process = window.process || {};
// @ts-ignore
window.process.env = window.process.env || {};

// Polyfill pour Buffer
// @ts-ignore
window.Buffer = window.Buffer || buffer;
