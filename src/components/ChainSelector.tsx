
import { useEffect, useState } from "react";
import { blockchain } from "@/services/blockchain";
import { useMoralis } from "@/contexts/MoralisContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChainSelectorProps {
  className?: string;
}

const ChainSelector = ({ className }: ChainSelectorProps) => {
  const [chains, setChains] = useState<{ id: string; name: string }[]>([]);
  const [selectedChain, setSelectedChain] = useState(blockchain.getSelectedChain());
  const moralis = useMoralis();

  useEffect(() => {
    if (moralis.isInitialized) {
      blockchain.setMoralisContext(moralis);
      const supportedChains = blockchain.getSupportedChains();
      setChains(supportedChains);
    }
  }, [moralis.isInitialized]);

  const handleChainChange = (chainId: string) => {
    blockchain.setChain(chainId);
    setSelectedChain(chainId);
  };
  
  if (!moralis.isInitialized || chains.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      <Select value={selectedChain} onValueChange={handleChainChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sélectionner un réseau" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Réseaux blockchain</SelectLabel>
            {chains.map((chain) => (
              <SelectItem key={chain.id} value={chain.id}>
                {chain.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChainSelector;
