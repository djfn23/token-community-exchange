
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NetworkBackground from "@/components/NetworkBackground";
import Footer from "@/components/Footer";
import { blockchain } from "@/services/blockchain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Blocks, Server } from "lucide-react";

const Blockchain = () => {
  const [status, setStatus] = useState({
    connected: false,
    latestBlock: 0,
    nodeName: "",
    networkId: ""
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "TokenTrader - Blockchain Explorer";
    
    const fetchBlockchainStatus = async () => {
      try {
        const chainStatus = await blockchain.getChainStatus();
        setStatus(chainStatus);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'état de la blockchain:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlockchainStatus();
    
    // Rafraîchir l'état toutes les 5 secondes
    const interval = setInterval(fetchBlockchainStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NetworkBackground />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">VeegoxChain Explorer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Node Status */}
          <Card className="token-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" /> 
                État du nœud
              </CardTitle>
              <CardDescription>
                Informations sur le nœud blockchain connecté
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <Activity className="h-8 w-8 animate-spin text-token" />
                </div>
              ) : status.connected ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut:</span>
                    <span className="font-mono text-token-positive">Connecté</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nom du nœud:</span>
                    <span className="font-mono">{status.nodeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Réseau:</span>
                    <span className="font-mono">{status.networkId}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-token-negative">
                  Node offline
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Card 2: Latest Blocks */}
          <Card className="token-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Blocks className="h-5 w-5" />
                Derniers blocs
              </CardTitle>
              <CardDescription>
                Blocs récemment minés sur la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <Activity className="h-8 w-8 animate-spin text-token" />
                </div>
              ) : status.connected ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between border-b border-token-muted/10 pb-1">
                      <span className="font-mono"># {status.latestBlock - i}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {new Date(Date.now() - i * 10000).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-token-negative">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Card 3: Network Info */}
          <Card className="token-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Réseau
              </CardTitle>
              <CardDescription>
                Métriques du réseau de la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <Activity className="h-8 w-8 animate-spin text-token" />
                </div>
              ) : status.connected ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peers:</span>
                    <span className="font-mono">{Math.floor(Math.random() * 10) + 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TPS:</span>
                    <span className="font-mono">{(Math.random() * 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Validateurs:</span>
                    <span className="font-mono">3</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-token-negative">
                  Réseau non disponible
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blockchain;
