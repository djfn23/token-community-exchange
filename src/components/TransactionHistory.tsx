
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blockchain } from "@/services/blockchain";

interface Transaction {
  id: string;
  type: 'swap' | 'transfer' | 'stake';
  fromToken: string;
  toToken?: string;
  amount: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // In a real implementation, this would fetch real transaction history
        const txHistory = await blockchain.getTransactionHistory();
        setTransactions(txHistory);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-token-positive';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-token-negative';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap': return '↔️';
      case 'transfer': return '→';
      case 'stake': return '🔒';
      default: return '•';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  return (
    <Card className="token-card">
      <CardHeader>
        <CardTitle className="text-lg">Transactions récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center">
            <div className="animate-pulse">Chargement des transactions...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Aucune transaction récente
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between py-2 border-b border-token-muted/10 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(tx.type)}</span>
                  <div>
                    <div className="font-medium">
                      {tx.type === 'swap' 
                        ? `${tx.fromToken} → ${tx.toToken}` 
                        : tx.fromToken
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">{tx.amount}</div>
                  <div className={`text-xs ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
