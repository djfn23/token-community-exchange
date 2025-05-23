# TokenChain Node

Ce dossier contient la blockchain personnalisée TokenChain pour la plateforme TokenTrader, basée sur Substrate (Rust).

## 📦 Architecture
- **Runtime** : intègre toutes les palettes (community-token, governance, amm, kyc)
- **Palettes** : modules Rust Substrate modulaires (voir `pallets/`)
- **Exemples** : scripts d’utilisation (voir `examples/`)
- **Tests** : chaque palette possède ses propres tests unitaires

## 🚀 Fonctionnalités principales
- Blockchain privée Proof of Authority (PoA)
- Gestion des jetons communautaires (mint, burn, transfert)
- Gouvernance communautaire (propositions, votes)
- Automated Market Maker (AMM) pour échanges de jetons
- Gestion KYC/AML (utilisateurs vérifiés)

## 🛠️ Prérequis
- Rust (https://rustup.rs)
- Docker (optionnel, recommandé)

## 🔧 Build & Test
```bash
cd tokenchain-node
cargo build --release         # Compile tout le workspace
cargo test --all             # Lance tous les tests unitaires
```

## ▶️ Lancement du node (simulation)
```bash
cargo run --release
```

## 📑 Exemples d’utilisation
```bash
cargo run --example usage
```
Voir le dossier `examples/` pour des scripts de démonstration.

## 📚 Documentation
- Chaque palette : README et doc technique dans son dossier
- Runtime : voir `runtime/README.md` et `runtime/doc.md`

## 🔄 Extension
- Ajoutez de nouvelles palettes dans `pallets/`
- Déclarez-les dans le workspace et la runtime
- Inspirez-vous des palettes existantes pour la structure

## 🧪 CI/CD (proposition)
Ajoutez un workflow GitHub Actions `.github/workflows/ci.yml` pour automatiser build et tests Rust.

---

Pour plus de détails sur l’architecture, la personnalisation, ou l’intégration front-end/API, voir la documentation dans chaque sous-dossier.
