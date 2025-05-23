# Pallet AMM

Cette palette Substrate fournit un Automated Market Maker (AMM) simple pour TokenChain :
- Création de pools de liquidité entre deux tokens (token_a, token_b)
- Swap d’un token contre l’autre selon la formule x*y=k (sans frais, simplifiée)
- Stockage des réserves pour chaque pool

## Exemple d’utilisation (Rust)
```rust
// Créer un pool de liquidité entre token 1 et 2
assert_ok!(AMM::create_pool(RawOrigin::Signed(alice).into(), 1, 2, 1000, 1000));

// Échanger 100 token 1 contre des token 2
assert_ok!(AMM::swap(RawOrigin::Signed(bob).into(), 1, 2, 100));
```

## À faire
- Ajouter des frais de swap
- Gérer les retraits de liquidité
- Intégrer avec la palette community-token
