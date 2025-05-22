
import { useEffect } from "react";
import NetworkBackground from "@/components/NetworkBackground";
import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import PriceChart from "@/components/PriceChart";
import TrendingTokens from "@/components/TrendingTokens";
import CommunityCard from "@/components/CommunityCard";
import ProfileCard from "@/components/ProfileCard";
import TransactionHistory from "@/components/TransactionHistory";
import Footer from "@/components/Footer";
import BlockchainStatus from "@/components/BlockchainStatus";
import { useToast } from "@/hooks/use-toast";
import { blockchain } from "@/services/blockchain";
import { useMoralis } from "@/contexts/MoralisContext";

// Mock data for price chart
const priceChartData = [
  { time: "00:00", price: 2.12 },
  { time: "04:00", price: 2.15 },
  { time: "08:00", price: 2.25 },
  { time: "12:00", price: 2.18 },
  { time: "16:00", price: 2.31 },
  { time: "20:00", price: 2.42 },
  { time: "24:00", price: 2.48 },
];

const Index = () => {
  const { toast } = useToast();
  const moralis = useMoralis();

  useEffect(() => {
    document.title = "TokenTrader - Community Token Exchange";
    
    // Set Moralis context in blockchain service when component mounts
    if (moralis.isInitialized) {
      blockchain.setMoralisContext(moralis);
      
      // Connexion à la blockchain au chargement de la page
      const connectToBlockchain = async () => {
        try {
          await blockchain.connect();
        } catch (error) {
          console.error("Erreur lors de la connexion à la blockchain:", error);
        }
      };
      
      connectToBlockchain();
    }
  }, [moralis.isInitialized]);

  return (
    <div className="min-h-screen flex flex-col">
      <NetworkBackground />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tokens Communautaires</h1>
          <BlockchainStatus />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <SwapCard />
            <PriceChart 
              data={priceChartData}
              tokenName="NEXUS"
              percentChange={2.3}
              currentPrice="$2.48"
            />
          </div>
          
          {/* Middle column */}
          <div className="lg:col-span-2 space-y-6">
            <TrendingTokens />
            <TransactionHistory />
          </div>
          
          {/* Right column */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard name="Alex" />
            <CommunityCard 
              title="Ajouter des fonctionnalités de gouvernance" 
              description="Prêt à enrichir la plateforme ?"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
