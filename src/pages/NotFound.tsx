
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NetworkBackground from "@/components/NetworkBackground";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-token-background">
      <NetworkBackground />
      
      <div className="text-center max-w-md px-4">
        <Logo size="lg" className="mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          This token or page does not exist in the current blockchain state
        </p>
        <Button asChild className="bg-token hover:bg-token-hover">
          <Link to="/">Return to Trading Platform</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
