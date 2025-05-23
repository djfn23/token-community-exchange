
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Moralis from "moralis";
import { EvmChainResolver, EvmChain } from "@moralisweb3/common-evm-utils";
import { ethers } from "ethers";
import { moralisService } from "@/services/moralis";
import { toast } from "@/hooks/use-toast";

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
  // Nouvelles fonctionnalités
  getNFTs: (address: string, chain?: string) => Promise<any[]>;
  getNFTTransfers: (address: string, chain?: string) => Promise<any[]>;
  getTokenPrice: (address: string, chain?: string) => Promise<any>;
  runContractFunction: (params: ContractFunctionParams) => Promise<any>;
  streamNFTTransfers: (address: string, callback: (data: any) => void) => () => void;
  getSupportedChains: () => { id: string; name: string }[];
}

interface ContractFunctionParams {
  contractAddress: string;
  functionName: string;
  abi: any[];
  params?: any;
  chain?: string;
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
        toast({
          title: "Erreur de connexion Moralis",
          description: "Impossible d'initialiser le service blockchain",
          variant: "destructive",
        });
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
      toast({
        title: "MetaMask non détecté",
        description: "Veuillez installer MetaMask pour continuer",
        variant: "destructive",
      });
      return null;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setIsAuthenticated(true);
      
      toast({
        title: "Portefeuille connecté",
        description: `Connecté avec l'adresse ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
      
      return address;
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Erreur d'authentification",
        description: "Impossible de connecter le portefeuille",
        variant: "destructive",
      });
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion réussie",
      description: "Votre portefeuille a été déconnecté",
    });
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

  // Nouvelle fonction: Récupérer les NFTs d'un portefeuille
  const getNFTs = async (address: string, chain = "0x1"): Promise<any[]> => {
    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });
      return response.raw.result;
    } catch (error) {
      console.error("Error getting NFTs:", error);
      return [];
    }
  };

  // Nouvelle fonction: Récupérer les transferts de NFTs
  const getNFTTransfers = async (address: string, chain = "0x1"): Promise<any[]> => {
    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
        address,
        chain,
      });
      return response.raw.result;
    } catch (error) {
      console.error("Error getting NFT transfers:", error);
      return [];
    }
  };

  // Nouvelle fonction: Obtenir le prix d'un token
  const getTokenPrice = async (address: string, chain = "0x1"): Promise<any> => {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address,
        chain,
      });
      return response.raw;
    } catch (error) {
      console.error("Error getting token price:", error);
      return null;
    }
  };

  // Nouvelle fonction: Exécuter une fonction de contrat intelligent
  const runContractFunction = async ({
    contractAddress,
    functionName,
    abi,
    params = {},
    chain = "0x1"
  }: ContractFunctionParams): Promise<any> => {
    try {
      const response = await Moralis.EvmApi.utils.runContractFunction({
        address: contractAddress,
        functionName,
        abi,
        params,
        chain,
      });
      return response.raw;
    } catch (error) {
      console.error(`Error executing contract function ${functionName}:`, error);
      throw error;
    }
  };

  // Nouvelle fonction: Stream des transferts de NFT en temps réel
  const streamNFTTransfers = (address: string, callback: (data: any) => void) => {
    if (!isInitialized) {
      console.error("Moralis not initialized");
      return () => {};
    }

    // Setup a stream for NFT transfers
    const stream = Moralis.Streams;
    
    // Cette fonction est simplifiée car l'API de streaming actuelle de Moralis 
    // nécessite une configuration côté serveur
    console.log(`Setting up stream for NFT transfers to/from ${address}`);
    
    // Dans une implémentation réelle, on utiliserait l'API Streams de Moralis
    // ici, on simule avec un intervalle pour les démonstrations
    const interval = setInterval(() => {
      getNFTTransfers(address).then(transfers => {
        if (transfers.length > 0) {
          callback(transfers[0]); // Envoyer le dernier transfert
        }
      });
    }, 30000); // Vérifier toutes les 30 secondes
    
    // Retourner une fonction de nettoyage
    return () => clearInterval(interval);
  };

  // Nouvelle fonction: Obtenir les chaînes supportées
  const getSupportedChains = () => {
    return [
      { id: "0x1", name: "Ethereum" },
      { id: "0x89", name: "Polygon" },
      { id: "0x38", name: "BNB Smart Chain" },
      { id: "0xa86a", name: "Avalanche" },
      { id: "0xa", name: "Optimism" },
      { id: "0xa4b1", name: "Arbitrum" },
      { id: "0x2105", name: "Base" }
    ];
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
    // Nouvelles fonctionnalités
    getNFTs,
    getNFTTransfers,
    getTokenPrice,
    runContractFunction,
    streamNFTTransfers,
    getSupportedChains,
  };

  return (
    <MoralisContext.Provider value={value}>
      {children}
    </MoralisContext.Provider>
  );
};
