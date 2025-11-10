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
    { path: '/mint', label: 'Mint NFT', icon: Image },
    { path: '/strategy', label: 'Strategies', icon: TrendingUp },
    { path: '/cross-chain-yield', label: 'Cross-Chain', icon: Zap },
    { path: '/ai-optimization', label: 'AI Opt', icon: Bot },
    { path: '/tba', label: 'TBA', icon: Shield }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">YieldSpirit</span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Right side - Network Indicator and Wallet */}
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
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
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