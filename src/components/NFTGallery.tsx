
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blockchain } from "@/services/blockchain";
import { useMoralis } from "@/contexts/MoralisContext";
import { Skeleton } from "@/components/ui/skeleton";

interface NFT {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  collection: string;
}

const NFTGallery = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const moralis = useMoralis();
  
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        if (moralis.isInitialized && moralis.isAuthenticated) {
          setLoading(true);
          const userNFTs = await blockchain.getNFTs();
          console.log("User NFTs:", userNFTs);
          setNfts(userNFTs);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (moralis.isInitialized && moralis.isAuthenticated) {
      fetchNFTs();
    } else {
      setLoading(false);
    }
  }, [moralis.isInitialized, moralis.isAuthenticated]);
  
  if (!moralis.isAuthenticated) {
    return (
      <Card className="token-card">
        <CardHeader>
          <CardTitle className="text-lg">Votre collection NFT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-muted-foreground">
            Connectez votre wallet pour voir vos NFTs
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="token-card">
      <CardHeader>
        <CardTitle className="text-lg">Votre collection NFT</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            ))}
          </div>
        ) : nfts.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Vous ne possédez actuellement aucun NFT
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nfts.map((nft) => (
              <div key={nft.id} className="border border-token-muted/20 rounded-lg overflow-hidden hover:border-token transition-colors">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {nft.image ? (
                    <img 
                      src={nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback en cas d'erreur de chargement d'image
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-muted-foreground">Aucune image</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium truncate">{nft.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{nft.collection}</p>
                  <p className="text-xs mt-1 text-token">ID: {nft.tokenId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTGallery;
