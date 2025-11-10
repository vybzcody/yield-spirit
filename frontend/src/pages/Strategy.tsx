import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { YieldStrategyPanel } from '@/components/YieldStrategyPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Zap, ArrowRightLeft, Bot, Brain } from 'lucide-react';

const Strategy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Yield Strategies</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore and execute yield opportunities across leading DeFi protocols. Choose strategies that match your risk tolerance and APY targets.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <YieldStrategyPanel />
          </div>

          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Cross-Chain Yields</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Leverage 200+ assets across 40+ chains for maximum yield potential.
              </p>
              <Button 
                onClick={() => navigate('/cross-chain-yield')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Zap className="mr-2 h-4 w-4" />
                Explore
              </Button>
            </div>

            <div className="bg-muted/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">AI Optimization</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Let AI optimize your cross-chain yield strategies automatically.
              </p>
              <Button 
                onClick={() => navigate('/ai-optimization')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Brain className="mr-2 h-4 w-4" />
                Optimize
              </Button>
            </div>

            <div className="bg-muted/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Token Bound Account</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Associate TBAs with your NFTs to enable autonomous yield execution.
              </p>
              <Button 
                onClick={() => navigate('/tba')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Shield className="mr-2 h-4 w-4" />
                Manage TBAs
              </Button>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/mint')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Mint
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto space-y-2">
            <p className="font-semibold text-center">Risk Disclaimer</p>
            <p className="text-sm text-muted-foreground text-center">
              All DeFi strategies carry risk. Higher APY opportunities typically involve higher risk. Always do your own research and only invest what you can afford to lose.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Strategy;