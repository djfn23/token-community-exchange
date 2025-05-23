# Pallet Governance

Cette palette Substrate permet la gestion de propositions et de votes communautaires pour TokenChain :
- Création de propositions (texte libre)
- Vote pour ou contre chaque proposition
- Stockage des votes et des propositions

## Exemple d’utilisation (Rust)
```rust
// Proposer une décision
assert_ok!(Governance::propose(RawOrigin::Signed(alice).into(), b"Nouvelle fonctionnalité".to_vec()));

// Voter pour la proposition 0
assert_ok!(Governance::vote(RawOrigin::Signed(bob).into(), 0, true));
```

## À faire
- Ajouter des hooks de validation ou des délais de vote
- Calculer les résultats automatiquement
- Intégrer à la gouvernance TokenChain
