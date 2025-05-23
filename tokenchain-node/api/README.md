# TokenChain API REST

API REST Node.js/Express pour interagir avec la blockchain TokenChain via Polkadot.js.

## Prérequis
- Node.js >= 16
- Installer les dépendances :

```bash
npm install
```

## Lancer l’API
```bash
npm start
```

## Endpoints disponibles
- `GET /balance/:account` : retourne le solde community-token d’un compte
- `POST /mint` : (simulation)
- `POST /transfer` : (simulation)

> Pour minter ou transférer réellement, il faut signer côté client (voir Polkadot.js ou extrudeur custom)
