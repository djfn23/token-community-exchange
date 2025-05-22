
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  title: string;
  description: string;
  className?: string;
}

const CommunityCard = ({ title, description, className }: CommunityCardProps) => {
  const { toast } = useToast();
  
  const handleVote = (type: 'for' | 'against') => {
    toast({
      title: `Voted ${type}`,
      description: `Your vote has been recorded for "${title}"`,
    });
  };
  
  return (
    <Card className={cn("token-card", className)}>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-bold">Community Voting</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-md font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 border-token hover:bg-token hover:text-white"
            onClick={() => handleVote('for')}
          >
            For
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-token-muted/50 hover:bg-token-muted/30"
            onClick={() => handleVote('against')}
          >
            Against
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
