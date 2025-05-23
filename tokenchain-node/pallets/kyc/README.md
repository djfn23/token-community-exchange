# Pallet KYC

Cette palette Substrate permet la gestion des utilisateurs vérifiés pour TokenChain :
- Ajout/retrait du statut "vérifié" par l’admin/root
- Stockage du statut KYC pour chaque compte

## Exemple d’utilisation (Rust)
```rust
// Vérifier un utilisateur
assert_ok!(KYC::verify(RawOrigin::Root.into(), alice));

// Retirer la vérification
assert_ok!(KYC::unverify(RawOrigin::Root.into(), alice));
```

## À faire
- Intégration avec les autres palettes (ex : seuls les utilisateurs vérifiés peuvent transférer des tokens)
- Ajouter des hooks pour compliance AML
