
import Logo from "./Logo";
import { Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-token-muted/20 py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo withText size="sm" />
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/blockchain"
              className="text-muted-foreground hover:text-token transition-colors"
            >
              VeegoxChain Explorer
            </Link>
            <Link 
              to="#"
              className="text-muted-foreground hover:text-token transition-colors"
            >
              Documentation
            </Link>
            <Link 
              to="#"
              className="text-muted-foreground hover:text-token transition-colors"
            >
              API
            </Link>
            <Link 
              to="#"
              className="text-muted-foreground hover:text-token transition-colors"
            >
              À propos
            </Link>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-token transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-token transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TokenTrader. Propulsé par VeegoxChain.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
