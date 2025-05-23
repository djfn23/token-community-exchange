// Exemple : Interroger le solde d’un compte sur TokenChain avec Polkadot.js
import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
  // Connexion au node local
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Adresse à interroger (exemple, à adapter)
  const account = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspnFQwC6GhZ2P7ZV';

  // Interrogation du storage de la palette community-token
  // (Remplacer 'communityToken' et 'balanceOf' par le nom réel exposé par votre runtime)
  const balance = await api.query.communityToken.balanceOf(account);
  console.log(`Solde de ${account} :`, balance.toString());

  await api.disconnect();
}

main().catch(console.error);
