
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Moralis from "moralis";
import { EvmChainResolver, EvmChain } from "@moralisweb3/common-evm-utils";
import { ethers } from "ethers";
import { moralisService } from "@/services/moralis";

interface MoralisContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  authenticate: () => Promise<string | null>;
  logout: () => Promise<void>;
  getBalance: (address: string, chain?: string) => Promise<string>;
  getTokenBalances: (address: string, chain?: string) => Promise<any[]>;
  getTransactionsByWallet: (address: string, chain?: string) => Promise<any[]>;
  getEvmChain: (chain: string) => any;
  getProvider: () => ethers.providers.Web3Provider | null;
}

const MoralisContext = createContext<MoralisContextType | null>(null);

export const useMoralis = () => {
  const context = useContext(MoralisContext);
  if (!context) {
    throw new Error("useMoralis must be used within a MoralisProvider");
  }
  return context;
};

interface MoralisProviderProps {
  children: ReactNode;
}

export const MoralisProvider = ({ children }: MoralisProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    const initMoralis = async () => {
      try {
        if (!Moralis.Core.isStarted) {
          const apiKey = await moralisService.getApiKey();
          await Moralis.start({
            apiKey,
          });
          console.log("Moralis initialized successfully");
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize Moralis:", error);
      }
    };

    // Initialize provider if window.ethereum is available
    const setupProvider = () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
      }
    };

    initMoralis();
    setupProvider();
  }, []);

  const authenticate = async (): Promise<string | null> => {
    if (!window.ethereum) {
      console.error("MetaMask not installed");
      return null;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setIsAuthenticated(true);
      return address;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticated(false);
  };

  const getBalance = async (address: string, chain = "0x1"): Promise<string> => {
    try {
      const response = await Moralis.EvmApi.balance.getNativeBalance({
        address,
        chain,
      });
      const balanceWei = response.raw.balance;
      const balanceEth = ethers.utils.formatEther(balanceWei);
      return balanceEth;
    } catch (error) {
      console.error("Error getting balance:", error);
      return "0";
    }
  };

  const getTokenBalances = async (address: string, chain = "0x1"): Promise<any[]> => {
    try {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,
      });
      return response.raw;
    } catch (error) {
      console.error("Error getting token balances:", error);
      return [];
    }
  };

  const getTransactionsByWallet = async (address: string, chain = "0x1"): Promise<any[]> => {
    try {
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        address,
        chain,
      });
      return response.raw.result;
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  };

  const getEvmChain = (chain: string) => {
    const chains: Record<string, any> = {
      "eth": EvmChainResolver.ETHEREUM,
      "polygon": EvmChainResolver.POLYGON,
      "bsc": EvmChainResolver.BSC,
      "avalanche": EvmChainResolver.AVALANCHE,
    };
    return chains[chain] || EvmChainResolver.ETHEREUM;
  };

  const getProvider = () => provider;

  const value = {
    isInitialized,
    isAuthenticated,
    authenticate,
    logout,
    getBalance,
    getTokenBalances,
    getTransactionsByWallet,
    getEvmChain,
    getProvider,
  };

  return (
    <MoralisContext.Provider value={value}>
      {children}
    </MoralisContext.Provider>
  );
};
