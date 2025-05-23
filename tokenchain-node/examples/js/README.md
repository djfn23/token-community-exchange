# Exemples TypeScript/JS pour TokenChain

Ce dossier contient des exemples de scripts Node.js utilisant Polkadot.js pour interagir avec la blockchain TokenChain.

## Prérequis
- Node.js >= 16
- Installer les dépendances :

```bash
npm install @polkadot/api
```

## Exemples
- `query-balance.ts` : interroge le solde d’un compte via la palette community-token

## Utilisation

```bash
npx ts-node query-balance.ts
```

> **Note** : Adaptez les noms de palettes et de méthodes selon la configuration réelle de votre runtime (ex : `communityToken.balanceOf`).
