// API REST pour TokenChain
import express from 'express';
import { ApiPromise, WsProvider } from '@polkadot/api';

const app = express();
app.use(express.json());

// Connexion unique à TokenChain
let api;
async function connectApi() {
  if (!api) {
    const wsProvider = new WsProvider('ws://127.0.0.1:9944');
    api = await ApiPromise.create({ provider: wsProvider });
  }
  return api;
}

// Endpoint pour obtenir le solde d'un compte
app.get('/balance/:account', async (req, res) => {
  try {
    const api = await connectApi();
    const account = req.params.account;
    const balance = await api.query.communityToken.balanceOf(account);
    res.json({ account, balance: balance.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint pour minter des tokens (simulation, sans signature réelle)
app.post('/mint', async (req, res) => {
  // Pour une vraie transaction, il faut signer avec une clé admin/root
  res.status(501).json({ error: 'Mint non implémenté côté API demo. Utilisez Polkadot.js Apps pour signer.' });
});

// Endpoint pour transférer des tokens (simulation)
app.post('/transfer', async (req, res) => {
  res.status(501).json({ error: 'Transfer non implémenté côté API demo. Utilisez Polkadot.js Apps pour signer.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`TokenChain API listening on port ${PORT}`);
});
