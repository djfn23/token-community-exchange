# Documentation technique Pallet Community Token

## Fonctions principales
- `mint` : Création de jetons par l’admin/root
- `burn` : Destruction de jetons
- `transfer` : Transfert de jetons entre comptes

## Stockage
- Mapping AccountId -> solde (u128)

## Tests
- Vérification du mint
- Gestion du transfert avec solde insuffisant

## À faire
- Ajouter des hooks de fidélité/gouvernance
- Événements personnalisés
- Tests supplémentaires (burn, événements)

## Liens utiles
- [FRAME Pallets](https://docs.substrate.io/reference/frame-pallets/)
