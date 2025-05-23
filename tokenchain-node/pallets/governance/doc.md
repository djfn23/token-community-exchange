# Documentation technique Pallet Governance

## Fonctions principales
- `propose` : Créer une nouvelle proposition (texte)
- `vote` : Voter pour ou contre une proposition

## Stockage
- Proposals : id -> description
- Votes : id -> (compte -> bool)
- ProposalCount : compteur d'id

## Tests
- Proposer une décision
- Voter pour/contre

## À faire
- Ajouter délais, validation, calcul automatique des résultats

## Liens utiles
- [FRAME Pallets](https://docs.substrate.io/reference/frame-pallets/)
