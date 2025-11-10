import { ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TokenDetails } from '@/lib/mockData';

interface NFTCardProps {
  token: TokenDetails;
  onViewDetails?: (tokenId: number) => void;
}

export const NFTCard = ({ token, onViewDetails }: NFTCardProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'high':
      case 'very high':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const strategyAttr = token.metadata.attributes.find(attr => attr.trait_type === 'Strategy');
  const riskAttr = token.metadata.attributes.find(attr => attr.trait_type === 'Risk Level');
  const apyAttr = token.metadata.attributes.find(attr => attr.trait_type === 'APY Potential');

  return (
    <Card className="hover-lift shadow-card group overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          <img 
            src={token.imageUrl} 
            alt={token.metadata.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-card/90 text-card-foreground border-border">
              #{token.tokenId}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{token.metadata.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{token.metadata.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {riskAttr && (
            <Badge variant="outline" className={getRiskColor(riskAttr.value)}>
              {riskAttr.value} Risk
            </Badge>
          )}
          {apyAttr && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              {apyAttr.value} APY
            </Badge>
          )}
        </div>

        {strategyAttr && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Strategy</p>
            <p className="text-sm font-medium">{strategyAttr.value}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          {token.assets.map((asset, index) => (
            <div key={index} className="text-center p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">{asset.token}</p>
              <p className="text-sm font-semibold">{asset.balance}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails?.(token.tokenId)}
        >
          View Details
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
