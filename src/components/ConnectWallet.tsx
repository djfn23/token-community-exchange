
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { blockchain } from "@/services/blockchain";

interface ConnectWalletProps {
  className?: string;
}

const ConnectWallet = ({ className }: ConnectWalletProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Vérifier si un wallet est déjà connecté
    const checkWalletConnection = () => {
      const connected = blockchain.isWalletConnected();
      setIsConnected(connected);
      if (connected) {
        setWalletAddress(blockchain.getWalletAddress());
      }
    };
    
    checkWalletConnection();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    
    try {
      const address = await blockchain.connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error("Erreur lors de la connexion du wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    blockchain.disconnectWallet();
    setIsConnected(false);
    setWalletAddress(null);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className={className}>
      {isConnected && walletAddress ? (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-token-muted/20 rounded-full flex items-center gap-2">
            <div className="h-2 w-2 bg-token-positive rounded-full"></div>
            <span className="text-sm font-mono">{formatAddress(walletAddress)}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDisconnect} 
            className="rounded-full h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline"
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2 border-token hover:text-token hover:border-token"
        >
          <Wallet className="h-4 w-4" />
          {loading ? "Connexion..." : "Connecter Wallet"}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
