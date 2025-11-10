import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Bot, 
  Shield, 
  Coins, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ArrowRightLeft,
  Wallet,
  Settings
} from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';
import { contractService, UserToken } from '@/services/contractService';
import { portfolioService } from '@/services/portfolioService';
import { yieldOptimizer } from '@/services/yieldOptimizer';

const Dashboard = () => {
  const navigate = useNavigate();
  const { account, yieldSpiritContract, provider } = useBlockchain();
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account && yieldSpiritContract && provider) {
      contractService.setContract(yieldSpiritContract, provider);
      loadUserData();
    }
  }, [account, yieldSpiritContract, provider]);

  const loadUserData = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const portfolio = await portfolioService.getUserPortfolio(account);
      setTokens(portfolio.tokens);
      setTotalValue(portfolio.totalValue);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeYieldStrategy = async (tokenId: number) => {
    try {
      const token = tokens.find(t => t.tokenId === tokenId);
      if (!token || !token.strategy.active) return;

      const opportunities = await yieldOptimizer.scanYieldOpportunities(token.strategy.targetChains);
      const validOpps = opportunities.filter(opp => 
        opp.estimatedAPY >= token.strategy.minAPY &&
        token.strategy.targetAssets.includes(opp.toCoin)
      );

      if (validOpps.length === 0) {
        alert('No valid yield opportunities found');
        return;
      }

      const bestOpp = validOpps[0];
      await contractService.executeYieldStrategy(
        tokenId,
        bestOpp.fromCoin,
        bestOpp.toCoin,
        bestOpp.fromNetwork,
        bestOpp.toNetwork,
        bestOpp.minAmount
      );

      alert('Yield strategy executed successfully!');
      loadUserData();
    } catch (error) {
      console.error('Failed to execute yield strategy:', error);
      alert('Failed to execute yield strategy');
    }
  };

  const stats = [
    { 
      title: 'Total Portfolio Value', 
      value: `$${totalValue.toFixed(2)}`, 
      change: '+12.5%', 
      icon: DollarSign 
    },
    { 
      title: 'YieldSpirit NFTs', 
      value: tokens.length.toString(), 
      change: `${tokens.filter(t => t.strategy.active).length} active`, 
      icon: Activity 
    },
    { 
      title: 'Assets Managed', 
      value: new Set(tokens.flatMap(t => t.strategy.targetAssets)).size.toString(), 
      change: `Across ${new Set(tokens.flatMap(t => t.strategy.targetChains)).size} chains`, 
      icon: Coins 
    },
    { 
      title: 'Avg. Target APY', 
      value: tokens.length > 0 ? `${(tokens.reduce((sum, t) => sum + t.strategy.minAPY, 0) / tokens.length / 100).toFixed(1)}%` : '0%', 
      change: 'Minimum threshold', 
      icon: TrendingUp 
    },
  ];

  const quickActions = [
    { 
      title: 'Cross-Chain Yield', 
      description: 'Optimize yields across 40+ chains', 
      icon: ArrowRightLeft,
      color: 'bg-blue-500',
      onClick: () => navigate('/cross-chain-yield')
    },
    { 
      title: 'AI Optimization', 
      description: 'Auto-optimize strategies with AI', 
      icon: Bot,
      color: 'bg-purple-500',
      onClick: () => navigate('/ai-optimization')
    },
    { 
      title: 'TBA Management', 
      description: 'Manage Token Bound Accounts', 
      icon: Shield,
      color: 'bg-green-500',
      onClick: () => navigate('/tba')
    },
    { 
      title: 'Mint NFT', 
      description: 'Create new YieldSpirit NFT', 
      icon: Zap,
      color: 'bg-orange-500',
      onClick: () => navigate('/mint')
    },
  ];

  if (!account) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container max-w-7xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <Wallet className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to access your YieldSpirit dashboard and manage your cross-chain yield strategies.
              </p>
              <Button onClick={() => navigate('/connect')}>
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">YieldSpirit Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Manage your cross-chain yield strategies powered by SideShift API
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.onClick}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Your YieldSpirit NFTs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8">Loading your tokens...</p>
              ) : tokens.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No YieldSpirit NFTs found</p>
                  <Button onClick={() => navigate('/mint')}>
                    Mint Your First NFT
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tokens.map((token) => (
                    <Card key={token.tokenId}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>YieldSpirit #{token.tokenId}</span>
                          <Badge variant={token.strategy.active ? 'default' : 'secondary'}>
                            {token.strategy.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Strategy: {token.strategy.name || 'Not Set'}</p>
                          <p className="text-sm text-muted-foreground">
                            Min APY: {(token.strategy.minAPY / 100).toFixed(2)}%
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Target Chains:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.strategy.targetChains.slice(0, 3).map((chain, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {chain}
                              </Badge>
                            ))}
                            {token.strategy.targetChains.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{token.strategy.targetChains.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => executeYieldStrategy(token.tokenId)}
                            disabled={!token.strategy.active || !token.tbaAddress}
                            className="flex-1"
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Execute Yield
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/strategy?tokenId=${token.tokenId}`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
