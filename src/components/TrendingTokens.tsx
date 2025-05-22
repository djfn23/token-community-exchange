
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: number;
  volume: string;
  logo: React.ReactNode;
}

// Define TokenCircle component before using it
interface TokenCircleProps {
  symbol: string;
  color: string;
}

const TokenCircle = ({ symbol, color }: TokenCircleProps) => (
  <div className={cn(
    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
    color
  )}>
    {symbol}
  </div>
);

// Now use TokenCircle in the data array
const trendingTokens: Token[] = [
  {
    id: "1",
    name: "NEXUS",
    symbol: "NEXUS°",
    price: "$2.48",
    change: 4.5,
    volume: "12.53M",
    logo: <Logo withText={false} size="sm" />
  },
  {
    id: "2",
    name: "NEXFINANCE",
    symbol: "NEX",
    price: "$1.18",
    change: 5.2,
    volume: "8.78M",
    logo: <TokenCircle symbol="N" color="bg-blue-500" />
  },
  {
    id: "3",
    name: "DAO NETWORK",
    symbol: "DAO",
    price: "$8.04",
    change: 1.5,
    volume: "16.22M",
    logo: <TokenCircle symbol="D" color="bg-green-600" />
  },
  {
    id: "4",
    name: "UNITY",
    symbol: "UNITY",
    price: "$6.51",
    change: 5.1,
    volume: "9.57M",
    logo: <TokenCircle symbol="U" color="bg-purple-500" />
  },
  {
    id: "5",
    name: "UNDEFINED",
    symbol: "UND",
    price: "$3.11",
    change: 5.1,
    volume: "9.57M",
    logo: <TokenCircle symbol="U" color="bg-yellow-600" />
  }
];

const TrendingTokens = () => {
  return (
    <div className="token-card">
      <div className="p-5 border-b border-token-muted/20">
        <h2 className="text-xl font-bold">Trending Tokens</h2>
      </div>
      <div className="p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-token-card-dark">
            <TableRow className="hover:bg-transparent border-token-muted/20">
              <TableHead className="text-muted-foreground">Token</TableHead>
              <TableHead className="text-muted-foreground text-right">Price</TableHead>
              <TableHead className="text-muted-foreground text-right">Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trendingTokens.map(token => (
              <TableRow 
                key={token.id} 
                className="hover:bg-token-muted/10 cursor-pointer border-token-muted/20"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {token.logo}
                    <span>{token.symbol}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {token.price}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className={cn(
                      "text-xs font-mono",
                      token.change > 0 ? "text-token-positive" : "text-token-negative"
                    )}>
                      {token.change > 0 ? "▲" : "▼"} {token.change}%
                    </span>
                    <span className="text-muted-foreground text-sm">{token.volume}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrendingTokens;
