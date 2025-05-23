# TokenChain Runtime

Cette runtime Substrate intègre la palette community-token.

- Déclaration via `construct_runtime!`
- Types minimaux pour Block et Extrinsic (à compléter selon vos besoins)

## Exemple d’intégration
```rust
construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = Block,
        UncheckedExtrinsic = UncheckedExtrinsic,
    {
        System: system::{Pallet, Call, Config, Storage, Event<T>},
        CommunityToken: pallet_community_token::{Pallet, Call, Storage, Event<T>},
    }
);
```

## À faire
- Étendre la runtime avec d’autres palettes (gouvernance, AMM, KYC…)
- Compléter les types Block/Extrinsic pour une exécution réelle
