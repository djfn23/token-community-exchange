# Pallet Community Token

Cette palette Substrate permet la gestion de jetons communautaires pour TokenChain :
- Mint (création de jetons par l’admin/root)
- Burn (destruction de jetons)
- Transfert entre comptes
- Stockage des soldes
- Gestion d’erreur (solde insuffisant)

## Exemple d’utilisation (Rust)
```rust
// Mint 100 tokens à Alice (admin/root)
assert_ok!(CommunityToken::mint(RawOrigin::Root.into(), alice, 100));

// Transfert de 50 tokens d’Alice à Bob
assert_ok!(CommunityToken::transfer(RawOrigin::Signed(alice).into(), bob, 50));
```

## Tests
Voir `tests.rs` pour des exemples de tests unitaires.

## Intégration
Ajouter la palette à la runtime :
```rust
CommunityToken: pallet_community_token::{Pallet, Call, Storage, Event<T>},
```

## À faire
- Ajouter des hooks pour la gouvernance ou la fidélité
- Intégrer des événements personnalisés
- Ajouter des tests de burn et d’événements
