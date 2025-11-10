import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Wallet, Coins, TrendingUp, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wallet,
      title: 'Token-Bound Accounts',
      description: 'Each NFT is a fully functional wallet powered by ERC-6551 standard'
    },
    {
      icon: TrendingUp,
      title: 'Automated Yield Hunting',
      description: 'Smart strategies that automatically optimize your DeFi yields'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Choose from Conservative to Degen strategies based on your risk appetite'
    },
    {
      icon: Zap,
      title: 'Multi-Protocol',
      description: 'Access opportunities across Lido, Aave, Uniswap, Compound and more'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container max-w-7xl mx-auto px-4 py-20 relative">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-12 w-12 text-primary animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                YieldSpirit
              </h1>
            </div>
            <p className="text-2xl text-muted-foreground">
              NFT-Powered Yield Hunting Platform
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn your NFTs into intelligent yield hunting machines. Each YieldSpirit is a Token-Bound Account that automatically optimizes returns across DeFi protocols.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => navigate('/connect')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 shadow-glow"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/strategy')}
                className="text-lg px-8"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Strategies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why YieldSpirit?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Combining the power of NFTs with DeFi yield optimization for a new era of passive income
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover-lift shadow-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-glow">
                1
              </div>
              <h3 className="text-xl font-semibold">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Connect your Ethereum wallet to access the platform
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold shadow-glow">
                2
              </div>
              <h3 className="text-xl font-semibold">Mint Your NFT</h3>
              <p className="text-muted-foreground">
                Create your YieldSpirit NFT and choose your yield strategy
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold shadow-glow">
                3
              </div>
              <h3 className="text-xl font-semibold">Start Earning</h3>
              <p className="text-muted-foreground">
                Execute strategies and watch your yields grow automatically
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate('/connect')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8"
            >
              <Coins className="mr-2 h-5 w-5" />
              Start Earning Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            YieldSpirit Demo - Showcasing ERC-6551 Token-Bound Accounts for DeFi yield optimization
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
