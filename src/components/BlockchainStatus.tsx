
import { useEffect, useState } from "react";
import { blockchain } from "@/services/blockchain";
import { Activity } from "lucide-react";
import { useMoralis } from "@/contexts/MoralisContext";

interface BlockchainStatusProps {
  className?: string;
}

const BlockchainStatus = ({ className }: BlockchainStatusProps) => {
  const [status, setStatus] = useState({
    connected: false,
    latestBlock: 0,
    nodeName: "",
    networkId: "",
  });
  
  const [loading, setLoading] = useState(true);
  const moralis = useMoralis();

  useEffect(() => {
    // Set Moralis context in blockchain service when component mounts
    if (moralis.isInitialized && !status.connected) {
      blockchain.setMoralisContext(moralis);
    }
  }, [moralis, moralis.isInitialized, status.connected]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (moralis.isInitialized) {
          const chainStatus = await blockchain.getChainStatus();
          setStatus(chainStatus);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'état de la blockchain:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (moralis.isInitialized) {
      fetchStatus();
      
      // Rafraîchir l'état toutes les 10 secondes
      const interval = setInterval(fetchStatus, 10000);
      
      return () => clearInterval(interval);
    }
  }, [moralis.isInitialized]);

  const getNetworkName = (networkId: string) => {
    const networks: Record<string, string> = {
      "homestead": "Ethereum",
      "goerli": "Ethereum Goerli",
      "sepolia": "Ethereum Sepolia",
      "matic": "Polygon",
      "maticmum": "Polygon Mumbai",
    };
    
    return networks[networkId] || networkId;
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${className}`}>
      {loading || !moralis.isInitialized ? (
        <span className="flex items-center">
          <Activity className="h-3 w-3 mr-1 animate-pulse" />
          Connexion à la blockchain...
        </span>
      ) : status.connected ? (
        <span className="flex items-center text-token-positive">
          <span className="h-2 w-2 bg-token-positive rounded-full mr-1"></span>
          {getNetworkName(status.networkId)}: Bloc #{status.latestBlock}
        </span>
      ) : (
        <span className="flex items-center text-token-negative">
          <span className="h-2 w-2 bg-token-negative rounded-full mr-1"></span>
          Blockchain déconnectée
        </span>
      )}
    </div>
  );
};

export default BlockchainStatus;
