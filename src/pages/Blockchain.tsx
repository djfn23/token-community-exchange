
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NetworkBackground from "@/components/NetworkBackground";
import Footer from "@/components/Footer";
import { blockchain } from "@/services/blockchain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Blocks, Server, Wallet, Gem } from "lucide-react";
import NFTGallery from "@/components/NFTGallery";
import SmartContractExplorer from "@/components/SmartContractExplorer";
import ChainSelector from "@/components/ChainSelector";
import { useMoralis } from "@/contexts/MoralisContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Blockchain = () => {
  const [status, setStatus] = useState({
    connected: false,
    latestBlock: 0,
    nodeName: "",
    networkId: ""
  });
  
  const [loading, setLoading] = useState(true);
  const moralis = useMoralis();

  useEffect(() => {
    document.title = "VeegoxChain - Explorateur Blockchain";
    
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
    
    if (moralis.isInitialized) {
      blockchain.setMoralisContext(moralis);
      fetchBlockchainStatus();
      
      // Rafraîchir l'état toutes les 5 secondes
      const interval = setInterval(fetchBlockchainStatus, 5000);
      
      return () => clearInterval(interval);
    }
  }, [moralis.isInitialized]);

  return (
    <div className="min-h-screen flex flex-col">
      <NetworkBackground />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">VeegoxChain Explorer</h1>
          <ChainSelector className="ml-auto" />
        </div>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="nft">NFTs</TabsTrigger>
            <TabsTrigger value="contract">Contrats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
              
              {/* Card 4: Wallet Info */}
              <Card className="token-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Portefeuille
                  </CardTitle>
                  <CardDescription>
                    Informations sur votre portefeuille connecté
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!moralis.isAuthenticated ? (
                    <div className="py-6 text-center text-muted-foreground">
                      Connectez votre wallet pour voir vos informations
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adresse:</span>
                        <span className="font-mono text-sm truncate max-w-[180px]">
                          {blockchain.getWalletAddress()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">État:</span>
                        <span className="font-mono text-token-positive">Connecté</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Réseau:</span>
                        <span className="font-mono">{status.networkId}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Card 5: NFT Stats */}
              <Card className="token-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gem className="h-5 w-5" />
                    Statistiques NFT
                  </CardTitle>
                  <CardDescription>
                    Aperçu de vos collections NFT
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!moralis.isAuthenticated ? (
                    <div className="py-6 text-center text-muted-foreground">
                      Connectez votre wallet pour voir vos NFTs
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Collections:</span>
                        <span className="font-mono">{Math.floor(Math.random() * 5) + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total NFTs:</span>
                        <span className="font-mono">{Math.floor(Math.random() * 10) + 2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transferts récents:</span>
                        <span className="font-mono">{Math.floor(Math.random() * 3)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="nft">
            <div className="grid grid-cols-1 gap-6">
              <NFTGallery />
            </div>
          </TabsContent>
          
          <TabsContent value="contract">
            <div className="grid grid-cols-1 gap-6">
              <SmartContractExplorer />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blockchain;
