# TokenChain Node

Ce dossier contient la blockchain personnalisée TokenChain pour la plateforme TokenTrader, basée sur Substrate (Rust).

## Fonctionnalités principales
- Blockchain privée Proof of Authority (PoA)
- Gestion des jetons communautaires
- Module de gouvernance
- Mécanisme AMM (Automated Market Maker)
- Placeholders pour intégration KYC/AML

## Prérequis
- Rust (https://rustup.rs)
- Docker (optionnel, recommandé)

## Installation rapide
```bash
cd tokenchain-node
cargo build --release
```

## Lancement du node
```bash
cargo run --release -- --dev
```

## Lancement avec Docker
```bash
docker build -t tokenchain-node .
docker run -it --rm -p 9944:9944 tokenchain-node
```

---

Pour plus de détails sur l’architecture et la personnalisation, voir la documentation dans ce dossier.
