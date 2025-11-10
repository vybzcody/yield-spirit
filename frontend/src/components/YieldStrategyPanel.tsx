import { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink, ChevronDown, ChevronUp, Wallet as WalletIcon, Loader2, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useWallet } from '@/context/WalletContext';
import { useBlockchain } from '@/context/BlockchainContext';

// Define types for consistency
interface YieldOpportunity {
  id: string;
  name: string;
  apy: string;
  risk: 'Low' | 'Medium' | 'High';
  chain: string;
  tokens: string[];
  description: string;
  tvl?: string;
}

export const YieldStrategyPanel = () => {
  const { isConnected } = useWallet();
  const { setStrategy, isLoading: blockchainLoading } = useBlockchain();
  const [confirmingStrategy, setConfirmingStrategy] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<YieldOpportunity | null>(null);
  const [isStrategyDialogOpen, setIsStrategyDialogOpen] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [minAPY, setMinAPY] = useState('500'); // Default 5% in basis points
  const [targetChains, setTargetChains] = useState<string[]>([]);
  const [targetAssets, setTargetAssets] = useState<string[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const [opportunities, setOpportunities] = useState<YieldOpportunity[]>([
    {
      id: 'opportunity_1',
      name: 'Lido Staking',
      apy: '4.2%',
      risk: 'Low',
      chain: 'Ethereum',
      tokens: ['ETH'],
      description: 'Stake ETH for stETH with Lido protocol',
      tvl: '$14.2B'
    },
    {
      id: 'opportunity_2',
      name: 'Aave Lending',
      apy: '7.8%',
      risk: 'Low',
      chain: 'Ethereum',
      tokens: ['USDC', 'DAI'],
      description: 'Lend assets on Aave for passive income',
      tvl: '$8.5B'
    },
    {
      id: 'opportunity_3',
      name: 'Uniswap V3 LP',
      apy: '15.3%',
      risk: 'Medium',
      chain: 'Ethereum',
      tokens: ['ETH', 'USDC'],
      description: 'Provide liquidity to earn trading fees',
      tvl: '$3.2B'
    },
    {
      id: 'opportunity_4',
      name: 'Compound Supply',
      apy: '5.6%',
      risk: 'Low',
      chain: 'Ethereum',
      tokens: ['WBTC', 'USDT'],
      description: 'Supply assets to Compound protocol',
      tvl: '$2.8B'
    },
    {
      id: 'opportunity_5',
      name: 'Curve 3pool',
      apy: '12.4%',
      risk: 'Medium',
      chain: 'Ethereum',
      tokens: ['DAI', 'USDC', 'USDT'],
      description: 'Earn trading fees from stablecoin swaps',
      tvl: '$1.5B'
    },
    {
      id: 'opportunity_6',
      name: 'Yearn Vault',
      apy: '18.7%',
      risk: 'High',
      chain: 'Ethereum',
      tokens: ['ETH', 'WBTC'],
      description: 'Auto-compounding vault strategies',
      tvl: '$890M'
    }
  ]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    low: true,
    medium: false,
    high: false
  });

  // Load user's token IDs
  useEffect(() => {
    const loadTokenIds = async () => {
      if (!isConnected || !yieldSpiritContract || !account) return;

      try {
        const balance = await yieldSpiritContract.balanceOf(account);
        const nftCount = Number(balance);
        const ids: number[] = [];

        for (let i = 0; i < nftCount; i++) {
          try {
            const tokenId = await yieldSpiritContract.tokenOfOwnerByIndex(account, i);
            ids.push(Number(tokenId));
          } catch (error) {
            console.error(`Error fetching token ID at index ${i}:`, error);
          }
        }

        setTokenIds(ids);
        if (ids.length > 0) {
          setSelectedTokenId(ids[0]); // Default to first token
        }
      } catch (error) {
        console.error('Error loading token IDs:', error);
      }
    };

    loadTokenIds();
  }, [isConnected, yieldSpiritContract, account]);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAPYColor = (apy: string) => {
    const apyValue = parseFloat(apy);
    if (apyValue < 7) return 'text-muted-foreground';
    if (apyValue < 12) return 'text-success';
    if (apyValue < 18) return 'text-warning';
    return 'text-primary';
  };

  const groupedOpportunities = opportunities.reduce((acc, opp) => {
    const risk = opp.risk.toLowerCase();
    if (!acc[risk]) acc[risk] = [];
    acc[risk].push(opp);
    return acc;
  }, {} as Record<string, YieldOpportunity[]>);

  const handleExecute = (opportunity: YieldOpportunity) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setSelectedOpportunity(opportunity);
    setStrategyName(opportunity.name);
    setTargetChains([opportunity.chain]);
    setTargetAssets(opportunity.tokens);
    setIsStrategyDialogOpen(true);
  };

  const handleConfigureStrategy = async () => {
    if (!selectedOpportunity || selectedTokenId === null) return;

    // Convert APY percentage to basis points (e.g., "5.0%" becomes 500)
    const apyBasisPoints = Math.round(parseFloat(minAPY) * 100);

    try {
      // Call the blockchain function to set the strategy
      await setStrategy(selectedTokenId, strategyName, apyBasisPoints, targetChains, targetAssets);
      
      toast.success(`Strategy configured: ${strategyName}`, {
        description: `For YieldSpirit #${selectedTokenId}, Minimum APY target: ${minAPY}%`
      });

      setIsStrategyDialogOpen(false);
      setStrategyName('');
      setMinAPY('500');
      setTargetChains([]);
      setTargetAssets([]);
      setSelectedTokenId(tokenIds.length > 0 ? tokenIds[0] : null);
    } catch (error) {
      console.error('Error setting strategy:', error);
      toast.error('Failed to configure strategy');
    }
  };

  const toggleSection = (risk: string) => {
    setOpenSections(prev => ({ ...prev, [risk]: !prev[risk] }));
  };

  if (!isConnected) {
    return (
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Yield Opportunities
          </CardTitle>
          <CardDescription>
            Connect your wallet to access and execute yield strategies across DeFi protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <TrendingUp className="h-12 w-12 text-muted" />
            </div>
            <p className="text-muted-foreground">Connect your wallet to execute yield strategies</p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/connect'}
              className="gap-2"
            >
              <WalletIcon className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Yield Opportunities
        </CardTitle>
        <CardDescription>
          Explore and execute yield strategies across DeFi protocols
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedOpportunities).map(([risk, opps]) => (
          <Collapsible
            key={risk}
            open={openSections[risk]}
            onOpenChange={() => toggleSection(risk)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Badge className={getRiskColor(risk)}>
                    {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {opps.length} {opps.length === 1 ? 'opportunity' : 'opportunities'}
                  </span>
                </div>
                {openSections[risk] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {opps.map((opp) => (
                <Card key={opp.id} className="border-2 hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{opp.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {opp.chain}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{opp.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-2xl font-bold ${getAPYColor(opp.apy)}`}>
                          {opp.apy}
                        </p>
                        <p className="text-xs text-muted-foreground">APY</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs text-muted-foreground">Tokens:</p>
                      <div className="flex gap-1">
                        {opp.tokens.map((token) => (
                          <Badge key={token} variant="secondary" className="text-xs">
                            {token}
                          </Badge>
                        ))}
                      </div>
                      {opp.tvl && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">TVL: {opp.tvl}</p>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleExecute(opp)}
                        disabled={blockchainLoading}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {blockchainLoading && confirmingStrategy === opp.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Configuring...
                          </>
                        ) : (
                          <>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Configure Strategy Dialog */}
        <Dialog open={isStrategyDialogOpen} onOpenChange={setIsStrategyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Yield Strategy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {tokenIds.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="tokenSelect">Select NFT</Label>
                  <select
                    id="tokenSelect"
                    value={selectedTokenId || ''}
                    onChange={(e) => setSelectedTokenId(Number(e.target.value))}
                    className="w-full p-2 border rounded bg-background"
                  >
                    {tokenIds.map(id => (
                      <option key={id} value={id}>
                        YieldSpirit #{id}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>No NFTs Available</Label>
                  <p className="text-sm text-muted-foreground">
                    You need to mint a YieldSpirit NFT first before you can configure strategies.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="strategyName">Strategy Name</Label>
                <Input
                  id="strategyName"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder="Enter strategy name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minAPY">Minimum APY Target (%)</Label>
                <Input
                  id="minAPY"
                  type="number"
                  value={minAPY}
                  onChange={(e) => setMinAPY(e.target.value)}
                  placeholder="5.0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label>Target Chains</Label>
                <div className="flex flex-wrap gap-2">
                  {targetChains.map((chain, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {chain}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Assets</Label>
                <div className="flex flex-wrap gap-2">
                  {targetAssets.map((asset, index) => (
                    <Badge key={index} variant="default" className="px-2 py-1">
                      {asset}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsStrategyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfigureStrategy}
                disabled={blockchainLoading}
              >
                {blockchainLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting...
                  </>
                ) : (
                  'Set Strategy'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};