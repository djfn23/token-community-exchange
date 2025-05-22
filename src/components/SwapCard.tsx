
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useToast } from "@/hooks/use-toast";
import { blockchain } from "@/services/blockchain";

const SwapCard = () => {
  const [fromToken, setFromToken] = useState("NEXUS");
  const [toToken, setToToken] = useState("NEXFINANCE");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSwap = async () => {
    if (!fromAmount) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant à échanger.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Appel au service blockchain pour effectuer le swap
      const success = await blockchain.swapTokens(fromToken, toToken, fromAmount);
      
      if (success) {
        // Reset des champs en cas de succès
        setFromAmount("");
        setToAmount("");
      }
    } catch (error) {
      console.error("Erreur lors du swap:", error);
      toast({
        title: "Erreur de transaction",
        description: "Une erreur inattendue est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate estimated amount when from amount changes
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simple mock calculation - in a real app this would use price data and liquidity
    const rate = fromToken === "NEXUS" ? 0.45 : 2.22;
    const calculated = value ? (parseFloat(value) * rate).toFixed(6) : "";
    setToAmount(calculated);
  };
  
  return (
    <div className="token-card p-6">
      <h2 className="text-xl font-bold mb-6">Swap</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">De</label>
          <div className="flex gap-2">
            <TokenSelect
              value={fromToken}
              onChange={setFromToken}
              options={[
                { value: "NEXUS", logo: <Logo withText={false} size="sm" /> },
                { value: "NEXFINANCE", logo: <TokenLogo symbol="NEX" /> },
                { value: "DAO", logo: <TokenLogo symbol="DAO" /> },
              ]}
            />
            <Input 
              type="text"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 bg-token-card-dark text-right font-mono focus-visible:ring-token focus-visible:ring-offset-token-background"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-8 w-8 bg-token-card-dark hover:bg-token-muted/20"
            onClick={() => {
              const temp = fromToken;
              setFromToken(toToken);
              setToToken(temp);
              setFromAmount(toAmount);
              handleFromAmountChange(toAmount);
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Vers</label>
          <div className="flex gap-2">
            <TokenSelect
              value={toToken}
              onChange={setToToken}
              options={[
                { value: "NEXFINANCE", logo: <TokenLogo symbol="NEX" /> },
                { value: "NEXUS", logo: <Logo withText={false} size="sm" /> },
                { value: "DAO", logo: <TokenLogo symbol="DAO" /> },
              ]}
            />
            <Input 
              type="text"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="flex-1 bg-token-card-dark text-right font-mono"
            />
          </div>
        </div>
        
        <Button 
          className="w-full bg-token hover:bg-token-hover text-white font-medium mt-4"
          onClick={handleSwap}
          disabled={loading}
        >
          {loading ? "Transaction en cours..." : "Swap"}
        </Button>
        
        <div className="text-xs text-center text-muted-foreground mt-2">
          Powered by VeegoxChain
        </div>
      </div>
    </div>
  );
};

interface TokenOptionProps {
  value: string;
  logo: JSX.Element;
}

// Make sure this is defined before it's used
const TokenLogo = ({ symbol }: { symbol: string }) => {
  const bgColors: Record<string, string> = {
    NEX: "bg-blue-500",
    DAO: "bg-green-600"
  };
  
  return (
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
      bgColors[symbol] || "bg-token"
    )}>
      {symbol.substring(0, 1)}
    </div>
  );
};

interface TokenSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: TokenOptionProps[];
}

const TokenSelect = ({ value, onChange, options }: TokenSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-token-card-dark focus:ring-token">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-token-card border-token-muted/20">
        {options.map(option => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="focus:bg-token-muted/20 focus:text-white"
          >
            <div className="flex items-center gap-2">
              {option.logo}
              <span>{option.value}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SwapCard;
