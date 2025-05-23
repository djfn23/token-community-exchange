
import { Link } from "react-router-dom";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";
import BlockchainStatus from "./BlockchainStatus";
import ConnectWallet from "./ConnectWallet";
import ChainSelector from "./ChainSelector";
import { useMoralis } from "@/contexts/MoralisContext";
import { blockchain } from "@/services/blockchain";
import { useEffect } from "react";

const Header = () => {
  const moralis = useMoralis();
  
  useEffect(() => {
    if (moralis.isInitialized) {
      blockchain.setMoralisContext(moralis);
    }
  }, [moralis.isInitialized]);

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
          <ChainSelector className="hidden md:block" />
          <BlockchainStatus className="hidden md:flex" />
          <ConnectWallet />
          
          {moralis.isAuthenticated && (
            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-token-muted/10">
              <UserAvatar name="User" />
              <span className="hidden md:inline">Account</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
