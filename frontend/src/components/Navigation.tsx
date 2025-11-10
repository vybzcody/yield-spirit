import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, Wallet, Image, TrendingUp, Shield, Zap, Bot, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBlockchain } from '@/context/BlockchainContext';
import { NetworkIndicator } from './NetworkIndicator';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isWalletConnected, account, connectWallet, disconnectWallet } = useBlockchain();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/mint', label: 'Mint', icon: Image },
    { path: '/strategy', label: 'Strategy', icon: TrendingUp },
    { path: '/cross-chain-yield', label: 'Yield', icon: Zap },
    { path: '/ai-optimization', label: 'AI', icon: Bot },
    { path: '/tba', label: 'TBA', icon: Shield }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">YieldSpirit</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center space-x-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <NetworkIndicator />
            
            {isWalletConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={connectWallet}>
                <Wallet className="h-4 w-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center space-y-1 min-w-0 px-2",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs truncate">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
