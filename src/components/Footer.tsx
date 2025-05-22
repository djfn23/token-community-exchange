
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-token-muted/20 py-8 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Logo withText size="sm" />
            <p className="text-sm text-muted-foreground mt-2">
              Trade community tokens on VeegoxChain
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold mb-1">Platform</h4>
              <Link to="/trade" className="text-sm text-muted-foreground hover:text-token transition-colors">
                Trade
              </Link>
              <Link to="/communities" className="text-sm text-muted-foreground hover:text-token transition-colors">
                Communities
              </Link>
              <Link to="/create" className="text-sm text-muted-foreground hover:text-token transition-colors">
                Create Token
              </Link>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold mb-1">Resources</h4>
              <Link to="/docs" className="text-sm text-muted-foreground hover:text-token transition-colors">
                Documentation
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-token transition-colors">
                FAQ
              </Link>
              <Link to="/governance" className="text-sm text-muted-foreground hover:text-token transition-colors">
                Governance
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-token-muted/20 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 TokenTrader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
