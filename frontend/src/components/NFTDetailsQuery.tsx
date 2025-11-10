import { useState } from 'react';
import { Search, Wallet, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useWallet } from '@/context/WalletContext';
import { useBlockchain } from '@/context/BlockchainContext';

export const NFTDetailsQuery = () => {
  const [tokenId, setTokenId] = useState<string>('');
  const [nftDetails, setNftDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isConnected } = useWallet();
  const { getYieldSpiritDetails } = useBlockchain();

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!tokenId) {
      toast.error('Please enter a token ID');
      return;
    }

    const tokenIdNum = parseInt(tokenId);
    if (isNaN(tokenIdNum) || tokenIdNum < 0) {
      toast.error('Please enter a valid token ID');
      return;
    }

    setIsLoading(true);
    setNftDetails(null);

    try {
      const details = await getYieldSpiritDetails(tokenIdNum);
      setNftDetails(details);
    } catch (error) {
      console.error('Error fetching NFT details:', error);
      toast.error('Error fetching NFT details: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Query NFT Details
          </CardTitle>
          <CardDescription>
            Connect your wallet to view details about your YieldSpirit NFTs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <Search className="h-12 w-12 text-muted" />
            </div>
            <p className="text-muted-foreground">Connect your wallet to query NFT information</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Query NFT Details
        </CardTitle>
        <CardDescription>
          View details about a specific YieldSpirit NFT by token ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleQuery} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="tokenId">Token ID</Label>
              <Input
                id="tokenId"
                type="number"
                placeholder="Enter token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-10"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Query'
                )}
              </Button>
            </div>
          </div>
        </form>

        {nftDetails && (
          <div className="mt-6 space-y-4">
            <Card className="border-2 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-xl">
                  YieldSpirit #{tokenId}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-mono break-all">{nftDetails.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">TBA Address</p>
                    <p className="font-mono break-all">{nftDetails.tba || 'Not set'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Strategy Name</p>
                  <p className="text-lg font-semibold">{nftDetails.strategy.name || 'No strategy set'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Min APY</p>
                    <p className="text-lg font-semibold">{nftDetails.strategy.minAPY / 100}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-lg font-semibold">
                      {nftDetails.strategy.active ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={nftDetails.strategy.active ? 'default' : 'secondary'}>
                      {nftDetails.strategy.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {nftDetails.strategy.targetChains && nftDetails.strategy.targetChains.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Target Chains</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {nftDetails.strategy.targetChains.map((chain: string, index: number) => (
                        <Badge key={index} variant="outline">{chain}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {nftDetails.strategy.targetAssets && nftDetails.strategy.targetAssets.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Target Assets</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {nftDetails.strategy.targetAssets.map((asset: string, index: number) => (
                        <Badge key={index} variant="secondary">{asset}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};