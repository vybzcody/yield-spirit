import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, Wallet, Image, TrendingUp, Shield, Zap, Bot, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/context/WalletContext';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected, account } = useWallet();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/connect', label: 'Connect', icon: Wallet },
    { path: '/mint', label: 'Mint NFT', icon: Image },
    { path: '/strategy', label: 'Strategies', icon: TrendingUp },
    { path: '/cross-chain-yield', label: 'Cross-Chain', icon: Zap },
    { path: '/ai-optimization', label: 'AI Opt', icon: Bot },
    { path: '/tba', label: 'TBA', icon: Shield }
  ];

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              YieldSpirit
            </h1>
          </button>

          <div className="flex items-center gap-2">
            {/* Navigation items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "gap-2 hidden md:flex",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {/* Wallet connection status */}
            {isConnected && account ? (
              <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-success" />
                <span className="text-sm font-mono">
                  {truncateAddress(account)}
                </span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate('/connect')}
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Connect</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};