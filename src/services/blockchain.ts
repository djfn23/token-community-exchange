
import { toast } from "@/hooks/use-toast";
import { useMoralis } from "@/contexts/MoralisContext";
import Moralis from "moralis";
import { ethers } from "ethers";

/**
 * Service pour interagir avec la blockchain via Moralis
 * Ce service offre une interface pour communiquer avec différentes blockchains
 */
export class BlockchainService {
  private static instance: BlockchainService;
  private connected: boolean = false;
  private wallet: string | null = null;
  private provider: ethers.providers.Web3Provider | null = null;
  private moralisContext: ReturnType<typeof useMoralis> | null = null;
  private nftListeners: Map<string, () => void> = new Map();
  private selectedChain: string = "0x1"; // Default to Ethereum

  private constructor() {
    // Singleton pattern
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  /**
   * Set the Moralis context to be used by the service
   */
  public setMoralisContext(context: ReturnType<typeof useMoralis>): void {
    this.moralisContext = context;
    this.provider = context.getProvider();
    this.connected = context.isInitialized;
  }

  /**
   * Tente une connexion au nœud blockchain
   * @returns Promise<boolean> - true si la connexion est établie
   */
  public async connect(): Promise<boolean> {
    try {
      // Check if Moralis is initialized
      if (!this.moralisContext || !this.moralisContext.isInitialized) {
        console.error("Moralis context not set or not initialized");
        return false;
      }

      this.connected = true;
      
      toast({
        title: "Blockchain connectée",
        description: "Connexion à Ethereum établie avec succès",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur de connexion à la blockchain:", error);
      
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à la blockchain",
        variant: "destructive",
      });
      
      return false;
    }
  }

  /**
   * Connecte un portefeuille à la blockchain
   * @returns Promise<string> - L'adresse du portefeuille connecté
   */
  public async connectWallet(): Promise<string> {
    try {
      if (!this.moralisContext) {
        throw new Error("Moralis context not set");
      }

      const address = await this.moralisContext.authenticate();
      if (!address) {
        throw new Error("Failed to authenticate with wallet");
      }
      
      this.wallet = address;
      
      // Démarrer l'écoute des transferts NFT pour ce portefeuille
      this.startNFTTransferListener(address);
      
      toast({
        title: "Portefeuille connecté",
        description: `Adresse: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
      
      return address;
    } catch (error) {
      console.error("Erreur lors de la connexion du wallet:", error);
      
      toast({
        title: "Erreur de connexion",
        description: "Impossible de connecter le portefeuille",
        variant: "destructive",
      });
      
      throw error;
    }
  }

  /**
   * Déconnecte le portefeuille
   */
  public async disconnectWallet(): Promise<void> {
    try {
      if (this.moralisContext) {
        await this.moralisContext.logout();
      }
      
      // Arrêter l'écoute des transferts NFT
      this.stopNFTTransferListeners();
      
      this.wallet = null;
      
      toast({
        title: "Portefeuille déconnecté",
        description: "Votre portefeuille a été déconnecté avec succès",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }

  /**
   * Vérifie si un wallet est connecté
   * @returns boolean - true si un wallet est connecté
   */
  public isWalletConnected(): boolean {
    return this.wallet !== null && (this.moralisContext?.isAuthenticated || false);
  }

  /**
   * Récupère l'adresse du wallet connecté
   * @returns string | null - l'adresse du wallet ou null si aucun wallet n'est connecté
   */
  public getWalletAddress(): string | null {
    return this.wallet;
  }

  /**
   * Vérifie l'état de la blockchain
   * @returns Objet avec les informations d'état
   */
  public async getChainStatus(): Promise<{
    connected: boolean;
    latestBlock: number;
    nodeName: string;
    networkId: string;
  }> {
    try {
      if (!this.connected) {
        await this.connect();
      }
      
      let latestBlock = 0;
      let networkId = "unknown";
      
      if (this.provider) {
        try {
          const blockNumber = await this.provider.getBlockNumber();
          latestBlock = blockNumber;
          
          const network = await this.provider.getNetwork();
          networkId = network.name !== "unknown" ? network.name : `chain-${network.chainId}`;
        } catch (error) {
          console.error("Error getting blockchain status:", error);
        }
      }
      
      return {
        connected: this.connected,
        latestBlock,
        nodeName: "Ethereum Node",
        networkId,
      };
    } catch (error) {
      console.error("Error getting chain status:", error);
      return {
        connected: false,
        latestBlock: 0,
        nodeName: "Disconnected",
        networkId: "unknown",
      };
    }
  }

  /**
   * Récupère le solde d'un compte
   * @param address Adresse du portefeuille
   * @returns Promise<string> - Le solde formatté
   */
  public async getAccountBalance(address: string): Promise<string> {
    if (!address || !this.moralisContext) return "0.00";
    
    try {
      return await this.moralisContext.getBalance(address);
    } catch (error) {
      console.error("Error getting account balance:", error);
      return "0.00";
    }
  }

  /**
   * Récupère l'historique des transactions
   * @returns Promise<Array> - Liste des transactions
   */
  public async getTransactionHistory(): Promise<any[]> {
    if (!this.wallet || !this.moralisContext) {
      return [];
    }
    
    try {
      const txs = await this.moralisContext.getTransactionsByWallet(this.wallet, this.selectedChain);
      
      // Transform Moralis transaction format to our app format
      return txs.map((tx: any) => {
        const isOutgoing = tx.from_address.toLowerCase() === this.wallet?.toLowerCase();
        
        return {
          id: tx.hash,
          type: isOutgoing ? 'transfer' : 'receive',
          fromToken: tx.value ? 'ETH' : 'TOKEN',
          toToken: undefined,
          amount: ethers.utils.formatEther(tx.value || '0'),
          timestamp: new Date(tx.block_timestamp),
          status: tx.receipt_status === '1' ? 'completed' : 'failed',
        };
      });
    } catch (error) {
      console.error("Error getting transaction history:", error);
      return [];
    }
  }

  /**
   * Récupère les tokens détenus par l'utilisateur
   * @returns Promise<Array> - Liste des tokens
   */
  public async getUserTokens(): Promise<any[]> {
    if (!this.wallet || !this.moralisContext) {
      return [];
    }
    
    try {
      return await this.moralisContext.getTokenBalances(this.wallet, this.selectedChain);
    } catch (error) {
      console.error("Error getting user tokens:", error);
      return [];
    }
  }

  /**
   * Exécute un swap de tokens
   * @param fromToken Token source
   * @param toToken Token destination
   * @param amount Montant à échanger
   * @returns Promise<boolean> - true si le swap a réussi
   */
  public async swapTokens(fromToken: string, toToken: string, amount: string): Promise<boolean> {
    try {
      // Dans une implémentation réelle avec Moralis/1inch, nous utiliserions une DEX API
      console.log(`Swap: ${amount} ${fromToken} -> ${toToken}`);
      
      // Simulation d'un délai de traitement blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler une transaction réussie (90% de chances de réussite)
      const success = Math.random() > 0.1;
      
      if (success) {
        toast({
          title: "Swap réussi",
          description: `${amount} ${fromToken} échangés contre ${toToken}`,
        });
      } else {
        toast({
          title: "Échec du swap",
          description: "La transaction n'a pas pu être exécutée",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors du swap:", error);
      
      toast({
        title: "Erreur de transaction",
        description: "Une erreur est survenue pendant l'échange",
        variant: "destructive",
      });
      
      return false;
    }
  }

  /**
   * Récupère les NFTs d'un portefeuille
   * @param address Adresse du portefeuille (optionnel, utilise l'adresse connectée par défaut)
   * @returns Promise<Array> - Liste des NFTs
   */
  public async getNFTs(address?: string): Promise<any[]> {
    const walletAddress = address || this.wallet;
    
    if (!walletAddress || !this.moralisContext) {
      return [];
    }
    
    try {
      const nfts = await this.moralisContext.getNFTs(walletAddress, this.selectedChain);
      return this.formatNFTs(nfts);
    } catch (error) {
      console.error("Error getting NFTs:", error);
      return [];
    }
  }

  /**
   * Récupère les transferts de NFTs pour un portefeuille
   * @param address Adresse du portefeuille (optionnel, utilise l'adresse connectée par défaut)
   * @returns Promise<Array> - Liste des transferts de NFTs
   */
  public async getNFTTransfers(address?: string): Promise<any[]> {
    const walletAddress = address || this.wallet;
    
    if (!walletAddress || !this.moralisContext) {
      return [];
    }
    
    try {
      const transfers = await this.moralisContext.getNFTTransfers(walletAddress, this.selectedChain);
      return transfers.map((transfer: any) => ({
        id: transfer.transaction_hash,
        tokenId: transfer.token_id,
        contractAddress: transfer.token_address,
        fromAddress: transfer.from_address,
        toAddress: transfer.to_address,
        timestamp: new Date(transfer.block_timestamp),
        type: transfer.from_address.toLowerCase() === walletAddress.toLowerCase() ? 'sent' : 'received',
      }));
    } catch (error) {
      console.error("Error getting NFT transfers:", error);
      return [];
    }
  }

  /**
   * Récupère le prix d'un token
   * @param tokenAddress Adresse du contrat du token
   * @returns Promise<Object> - Informations sur le prix
   */
  public async getTokenPrice(tokenAddress: string): Promise<any> {
    if (!this.moralisContext) {
      return null;
    }
    
    try {
      return await this.moralisContext.getTokenPrice(tokenAddress, this.selectedChain);
    } catch (error) {
      console.error("Error getting token price:", error);
      return null;
    }
  }

  /**
   * Exécute une fonction sur un contrat intelligent
   * @param contractAddress Adresse du contrat
   * @param functionName Nom de la fonction
   * @param abi ABI du contrat
   * @param params Paramètres de la fonction
   * @returns Promise<any> - Résultat de l'exécution
   */
  public async executeContractFunction(
    contractAddress: string,
    functionName: string,
    abi: any[],
    params: any = {}
  ): Promise<any> {
    if (!this.moralisContext) {
      throw new Error("Moralis context not set");
    }
    
    try {
      return await this.moralisContext.runContractFunction({
        contractAddress,
        functionName,
        abi,
        params,
        chain: this.selectedChain
      });
    } catch (error) {
      console.error(`Error executing contract function ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Démarre l'écoute des transferts de NFT pour une adresse
   * @param address Adresse du portefeuille
   */
  private startNFTTransferListener(address: string): void {
    // Arrêter les listeners existants d'abord
    this.stopNFTTransferListeners();
    
    if (!this.moralisContext) return;
    
    const cleanupFunc = this.moralisContext.streamNFTTransfers(address, (data) => {
      toast({
        title: "Transfert NFT détecté",
        description: `Un NFT ${data.type === 'sent' ? 'envoyé' : 'reçu'} pour le token ID ${data.tokenId}`,
      });
    });
    
    this.nftListeners.set(address, cleanupFunc);
    console.log(`NFT transfer listener started for ${address}`);
  }

  /**
   * Arrête tous les listeners de transfert de NFT
   */
  private stopNFTTransferListeners(): void {
    this.nftListeners.forEach((cleanup, address) => {
      cleanup();
      console.log(`NFT transfer listener stopped for ${address}`);
    });
    
    this.nftListeners.clear();
  }

  /**
   * Formate les NFTs pour l'affichage
   * @param nfts Liste de NFTs bruts
   * @returns Array - Liste de NFTs formatés
   */
  private formatNFTs(nfts: any[]): any[] {
    return nfts.map((nft: any) => {
      const metadata = nft.metadata ? JSON.parse(nft.metadata) : {};
      
      return {
        id: `${nft.token_address}-${nft.token_id}`,
        tokenId: nft.token_id,
        contractAddress: nft.token_address,
        name: metadata.name || `NFT #${nft.token_id}`,
        description: metadata.description || "",
        image: metadata.image || "",
        collection: nft.name || "Collection inconnue",
        symbol: nft.symbol || "",
        tokenUri: nft.token_uri || "",
      };
    });
  }
  
  /**
   * Récupère la liste des chaînes supportées
   * @returns Array - Liste des chaînes supportées
   */
  public getSupportedChains(): { id: string; name: string }[] {
    if (!this.moralisContext) return [];
    return this.moralisContext.getSupportedChains();
  }
  
  /**
   * Change la chaîne actuellement sélectionnée
   * @param chainId Identifiant de la chaîne
   */
  public setChain(chainId: string): void {
    this.selectedChain = chainId;
    console.log(`Chain changed to ${chainId}`);
    
    toast({
      title: "Réseau modifié",
      description: `Vous utilisez maintenant ${this.getChainName(chainId)}`,
    });
  }
  
  /**
   * Récupère le nom d'une chaîne par son ID
   * @param chainId Identifiant de la chaîne
   * @returns string - Nom de la chaîne
   */
  private getChainName(chainId: string): string {
    const chains = this.getSupportedChains();
    const chain = chains.find(c => c.id === chainId);
    return chain ? chain.name : "Chaîne inconnue";
  }
  
  /**
   * Récupère la chaîne actuellement sélectionnée
   * @returns string - ID de la chaîne
   */
  public getSelectedChain(): string {
    return this.selectedChain;
  }
}

// Export d'une instance singleton
export const blockchain = BlockchainService.getInstance();
