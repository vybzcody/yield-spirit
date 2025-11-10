import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { yieldOptimizer, YieldOpportunity } from '../services/yieldOptimizer';
import { contractService, UserToken } from '../services/contractService';
import { portfolioService, Portfolio } from '../services/portfolioService';
import { SideShiftSwap } from './SideShiftSwap';
import { useBlockchain } from '../context/BlockchainContext';
import { Loader2, TrendingUp, Zap, Wallet } from 'lucide-react';

export const CrossChainYieldOptimizer: React.FC = () => {
  const [opportunities, setOpportunities] = useState<YieldOpportunity[]>([]);
  const [userTokens, setUserTokens] = useState<UserToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedChains, setSelectedChains] = useState<string[]>(['ethereum', 'polygon', 'bitcoin']);
  
  const { account, yieldSpiritContract, provider } = useBlockchain();

  useEffect(() => {
    if (account && yieldSpiritContract && provider) {
      contractService.setContract(yieldSpiritContract, provider);
      loadUserData();
    }
  }, [account, yieldSpiritContract, provider]);

  useEffect(() => {
    if (selectedToken) {
      const token = userTokens.find(t => t.tokenId === selectedToken);
      if (token) {
        setSelectedChains(token.strategy.targetChains);
        loadOpportunities(token.strategy.targetChains);
        if (token.tbaAddress) {
          loadPortfolio(token.tbaAddress);
        }
      }
    } else {
      loadOpportunities(selectedChains);
    }
  }, [selectedToken, userTokens]);

  const loadUserData = async () => {
    if (!account) return;
    
    try {
      const portfolio = await portfolioService.getUserPortfolio(account);
      setUserTokens(portfolio.tokens);
      if (portfolio.tokens.length > 0) {
        setSelectedToken(portfolio.tokens[0].tokenId);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadOpportunities = async (chains: string[]) => {
    setLoading(true);
    try {
      const opps = await yieldOptimizer.scanYieldOpportunities(chains);
      setOpportunities(opps);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolio = async (tbaAddress: string) => {
    try {
      const portfolioData = await portfolioService.getCrossChainBalance(tbaAddress);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }
  };

  const handleExecuteStrategy = async (opportunity: YieldOpportunity) => {
    if (!selectedToken) return;
    
    try {
      await contractService.executeYieldStrategy(
        selectedToken,
        opportunity.fromCoin,
        opportunity.toCoin,
        opportunity.fromNetwork,
        opportunity.toNetwork,
        opportunity.minAmount
      );
      
      alert('Yield strategy executed successfully!');
      loadUserData(); // Refresh data
    } catch (error) {
      console.error('Failed to execute strategy:', error);
      alert('Failed to execute yield strategy');
    }
  };

  const selectedTokenData = userTokens.find(t => t.tokenId === selectedToken);

  if (!account) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Wallet className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to access cross-chain yield optimization for your YieldSpirit NFTs.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (userTokens.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Zap className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">No YieldSpirit NFTs Found</h2>
          <p className="text-muted-foreground mb-6">
            You need to mint a YieldSpirit NFT to access cross-chain yield optimization.
          </p>
          <Button onClick={() => window.location.href = '/mint'}>
            Mint Your First NFT
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select YieldSpirit NFT</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedToken?.toString()} onValueChange={(value) => setSelectedToken(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a YieldSpirit NFT" />
            </SelectTrigger>
            <SelectContent>
              {userTokens.map((token) => (
                <SelectItem key={token.tokenId} value={token.tokenId.toString()}>
                  YieldSpirit #{token.tokenId} - {token.strategy.name || 'Unnamed Strategy'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedTokenData && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Strategy: {selectedTokenData.strategy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Min APY: {(selectedTokenData.strategy.minAPY / 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status:</p>
                  <Badge variant={selectedTokenData.strategy.active ? 'default' : 'secondary'}>
                    {selectedTokenData.strategy.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Overview */}
      {portfolio && selectedTokenData?.tbaAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Token Bound Account Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">${portfolio.totalUsdValue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{portfolio.assets.length}</p>
                <p className="text-sm text-muted-foreground">Assets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {new Set(portfolio.assets.map(a => a.chain)).size}
                </p>
                <p className="text-sm text-muted-foreground">Chains</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {portfolio.assets.map((asset, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{asset.chain}</Badge>
                    <span className="font-medium">{asset.asset}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{asset.balance}</p>
                    <p className="text-sm text-muted-foreground">${asset.usdValue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yield Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Yield Opportunities
            {selectedTokenData && (
              <Badge variant="outline" className="ml-2">
                For Token #{selectedTokenData.tokenId}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : opportunities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No yield opportunities found for the selected strategy.
            </p>
          ) : (
            <div className="space-y-4">
              {opportunities
                .filter(opp => !selectedTokenData || (
                  opp.estimatedAPY >= selectedTokenData.strategy.minAPY &&
                  selectedTokenData.strategy.targetAssets.includes(opp.toCoin)
                ))
                .slice(0, 5)
                .map((opp, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{opp.fromCoin} → {opp.toCoin}</span>
                      <Badge variant="outline">{opp.fromNetwork}</Badge>
                      <span className="text-sm">→</span>
                      <Badge variant="outline">{opp.toNetwork}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Rate: {opp.swapRate} | Min: {opp.minAmount} | Max: {opp.maxAmount}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-lg font-bold text-green-600">
                      {(opp.estimatedAPY / 100).toFixed(2)}% APY
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleExecuteStrategy(opp)}
                      disabled={!selectedTokenData?.strategy.active || !selectedTokenData?.tbaAddress}
                    >
                      Execute
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SideShift Swap Interface */}
      {selectedTokenData?.tbaAddress && (
        <SideShiftSwap 
          tokenId={selectedToken}
          onSwapCreated={(shift) => {
            console.log('Shift created:', shift);
            if (selectedTokenData.tbaAddress) {
              loadPortfolio(selectedTokenData.tbaAddress);
            }
          }}
        />
      )}
    </div>
  );
};
