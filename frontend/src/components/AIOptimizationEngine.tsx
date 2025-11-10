import { useState, useEffect } from 'react';
import { 
  Bot, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { sideShiftService } from '@/services/sideShiftService';

interface AIOptimizationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  condition: string;
  action: string;
  priority: number;
}

interface PortfolioAsset {
  token: string;
  amount: number;
  value: number;
  chain: string;
  apy: number;
}

export const AIOptimizationEngine = () => {
  const [rules, setRules] = useState<AIOptimizationRule[]>([
    {
      id: 'rule-1',
      name: 'APY Arbitrage',
      description: 'Automatically swap to higher-yielding assets when spread > 5%',
      enabled: true,
      condition: 'yield_spread > 0.05',
      action: 'sideShift_swap',
      priority: 1
    },
    {
      id: 'rule-2',
      name: 'Risk Rebalancing',
      description: 'Reduce exposure in volatile assets during market volatility',
      enabled: true,
      condition: 'volatility_index > 0.65',
      action: 'reallocate_portfolio',
      priority: 2
    },
    {
      id: 'rule-3',
      name: 'Cross-Chain Yield',
      description: 'Optimize yield by moving assets between chains',
      enabled: true,
      condition: 'cross_chain_apr_diff > 0.03',
      action: 'multi_chain_swap',
      priority: 3
    }
  ]);
  
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([
    { token: 'ETH', amount: 1.25, value: 4125, chain: 'Ethereum', apy: 4.2 },
    { token: 'USDC', amount: 2500, value: 2500, chain: 'Ethereum', apy: 2.8 },
    { token: 'WBTC', amount: 0.05, value: 1850, chain: 'Polygon', apy: 3.1 },
    { token: 'OP', amount: 450, value: 900, chain: 'Optimism', apy: 8.2 },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [lastOptimization, setLastOptimization] = useState<string | null>(null);
  const [activeOpportunities, setActiveOpportunities] = useState([
    { id: 'opp-1', name: 'Ethereum-USDC to Polygon-USDC', yieldDiff: 3.2, risk: 'Low', chains: ['Ethereum', 'Polygon'] },
    { id: 'opp-2', name: 'ETH to stETH Arbitrage', yieldDiff: 1.8, risk: 'Medium', chains: ['Ethereum'] },
    { id: 'opp-3', name: 'Cross-Chain LP Optimizer', yieldDiff: 6.5, risk: 'High', chains: ['Ethereum', 'Arbitrum', 'Optimism'] },
  ]);

  // Simulate AI optimization process
  const runOptimization = async () => {
    setIsRunning(true);
    setOptimizationProgress(0);
    
    try {
      // Simulate optimization process
      const steps = [
        'Analyzing portfolio allocation',
        'Scanning cross-chain opportunities',
        'Evaluating risk metrics',
        'Calculating optimal swaps',
        'Executing SideShift swaps',
        'Rebalancing portfolio',
        'Monitoring performance'
      ];

      for (let i = 0; i <= steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setOptimizationProgress((i / steps.length) * 100);
        
        if (i < steps.length) {
          toast.message(`AI Optimization Step ${i + 1}/${steps.length}`, {
            description: steps[i]
          });
        }
      }

      // Update portfolio with optimized values
      const updatedPortfolio = portfolio.map(asset => ({
        ...asset,
        apy: asset.apy * (1 + (Math.random() * 0.1 - 0.02)) // Random APY change between -2% and +8%
      }));
      
      setPortfolio(updatedPortfolio);
      setLastOptimization(new Date().toLocaleString());
      
      toast.success('AI Optimization completed successfully!', {
        description: `Portfolio yield increased by ${(Math.random() * 2 + 0.5).toFixed(2)}%`
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('AI Optimization failed');
    } finally {
      setIsRunning(false);
    }
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

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

  return (
    <div className="space-y-6">
      {/* AI Engine Controls */}
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Yield Optimization Engine
          </CardTitle>
          <CardDescription>
            Automated cross-chain yield optimization using SideShift integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={runOptimization}
                disabled={isRunning}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Optimization
                  </>
                )}
              </Button>
              
              <div className="text-sm">
                <p className="font-medium">Last optimization: {lastOptimization || 'Never'}</p>
                <p className="text-muted-foreground">AI engine is {isRunning ? 'running' : 'idle'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-optimize">Auto-optimize</Label>
              <Switch id="auto-optimize" />
            </div>
          </div>

          {isRunning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Optimization in progress</span>
                <span>{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Opportunities */}
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Active Yield Opportunities
          </CardTitle>
          <CardDescription>
            Cross-chain opportunities identified by the AI engine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeOpportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                className="p-4 border rounded-lg bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{opportunity.name}</h4>
                    <Badge className={getRiskColor(opportunity.risk)}>
                      {opportunity.risk} Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Chains: {opportunity.chains.join(', ')}</p>
                  <p className="text-sm">
                    Potential yield increase: <span className="font-semibold text-success">+{opportunity.yieldDiff}%</span>
                  </p>
                </div>
                
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Execute
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Rules */}
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Optimization Rules
          </CardTitle>
          <CardDescription>
            AI decision rules for automated yield optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div 
                key={rule.id} 
                className="p-4 border rounded-lg bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{rule.name}</h4>
                    <Badge variant={rule.enabled ? "default" : "outline"}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">Condition: {rule.condition}</Badge>
                    <Badge variant="secondary">Action: {rule.action}</Badge>
                    <Badge variant="secondary">Priority: {rule.priority}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Label>Enabled</Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Overview */}
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Portfolio Overview
          </CardTitle>
          <CardDescription>
            Current asset allocation with AI-optimized APY projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.map((asset, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{asset.token}</h4>
                    <p className="text-sm text-muted-foreground">{asset.chain}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{asset.amount}</p>
                    <p className="text-sm text-muted-foreground">${asset.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <span>APY:</span>
                    <span className={asset.apy >= 5 ? 'text-success' : 'text-warning'}>
                      {asset.apy.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};