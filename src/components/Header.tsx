
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BlockchainStatus from "./BlockchainStatus";
import ConnectWallet from "./ConnectWallet";

const Header = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  
  const handleConnect = () => {
    // In a real implementation, this would connect to a Web3 wallet
    setIsConnected(true);
    toast({
      title: "Wallet connecté",
      description: "Votre portefeuille a été connecté avec succès.",
    });
  };
  
  return (
    <header className="border-b border-token-muted/20 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo withText size="md" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-token transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/blockchain" 
              className="text-sm font-medium hover:text-token transition-colors"
            >
              Explorer
            </Link>
            <Link 
              to="/communities" 
              className="text-sm font-medium hover:text-token transition-colors"
            >
              Communities
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <BlockchainStatus className="hidden md:flex" />
          <ConnectWallet />
          
          {isConnected && (
            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-token-muted/10">
              <UserAvatar name="Alex" />
              <span className="hidden md:inline">Alex</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
