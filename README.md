# TokenChain – Blockchain Fullstack Community Exchange

## 🚀 Lancement rapide (stack complète)

```bash
# À la racine du repository
# 1. Build & run toute la stack (node Substrate, API REST, front-end)
docker compose up --build
```

- Le node Substrate écoute sur ws://localhost:9944
- L’API REST sur http://localhost:3001
- Le front-end Next.js sur http://localhost:3000

---

## 📦 Architecture du repository

```
token-community-exchange/
│
├── tokenchain-node/           # Node Substrate Rust (palettes, runtime, tests, Dockerfile)
│   ├── api/                   # API REST Node.js/Express
│   ├── examples/js/           # Exemples TypeScript Polkadot.js
│   └── ...
├── frontend-tokenchain/       # Front-end Next.js (explorateur, interaction API)
├── docker-compose.yml         # Stack complète (node + API + front)
└── README.md                  # Ce fichier
```

---

## 🧑‍💻 Utilisation manuelle (hors Docker)

```bash
# 1. Lancer le node Substrate
cd tokenchain-node
cargo run --release

# 2. Lancer l’API REST
cd tokenchain-node/api
npm install
npm start

# 3. Lancer le front-end
cd frontend-tokenchain
npm install
npm run dev
```

---

## 🧪 Tests & CI
- Build et tests Rust automatisés dans `.github/workflows/ci.yml`
- Extensible à l’API et au front-end

---

## 📚 Documentation
- Voir chaque sous-dossier pour la doc technique (palettes, API, front)
- Exemples d’utilisation dans `tokenchain-node/examples/js/`

---

## 🤝 Contributions & extensions
- Ajoutez de nouvelles palettes dans `tokenchain-node/pallets/`
- Étendez l’API ou le front-end selon vos besoins
- Proposez des PR ou issues pour enrichir la stack
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/003ef1b8-48d7-4d4f-aa19-0d7996d19247) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
