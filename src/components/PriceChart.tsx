
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  data: { time: string; price: number }[];
  tokenName: string;
  percentChange: number;
  currentPrice: string;
  className?: string;
}

const PriceChart = ({
  data,
  tokenName,
  percentChange,
  currentPrice,
  className
}: PriceChartProps) => {
  const isPositive = percentChange >= 0;
  
  return (
    <Card className={cn("token-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div>{tokenName}° Price</div>
          <div className={cn(
            "text-sm font-mono",
            isPositive ? "text-token-positive" : "text-token-negative"
          )}>
            {isPositive ? "▲" : "▼"} {Math.abs(percentChange)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis 
                domain={['auto', 'auto']} 
                hide 
              />
              <XAxis dataKey="time" hide />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg bg-token-card-dark p-2 text-xs border border-token-muted/30 shadow-md">
                        <p className="font-mono">{`$${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#00CB91" : "#FF4961"} 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4, fill: isPositive ? "#00CB91" : "#FF4961" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 font-mono text-2xl font-bold">
          {currentPrice}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
