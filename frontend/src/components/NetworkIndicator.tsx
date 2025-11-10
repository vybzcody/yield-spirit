import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';

const SEPOLIA_CHAIN_ID = 11155111;

export const NetworkIndicator: React.FC = () => {
  const { chainId, isWalletConnected } = useBlockchain();

  if (!isWalletConnected) return null;

  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;
  const networkName = getNetworkName(chainId);

  const switchToSepolia = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
        });
      } catch (error) {
        console.error('Error switching network:', error);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isCorrectNetwork ? 'default' : 'destructive'}
        className="flex items-center gap-1"
      >
        {isCorrectNetwork ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <AlertTriangle className="h-3 w-3" />
        )}
        {networkName}
      </Badge>
      
      {!isCorrectNetwork && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={switchToSepolia}
          className="text-xs"
        >
          Switch to Sepolia
        </Button>
      )}
    </div>
  );
};

function getNetworkName(chainId: number | null): string {
  switch (chainId) {
    case 1: return 'Ethereum';
    case 11155111: return 'Sepolia';
    case 137: return 'Polygon';
    case 80001: return 'Mumbai';
    case 42161: return 'Arbitrum';
    case 421614: return 'Arbitrum Sepolia';
    case 8453: return 'Base';
    case 84532: return 'Base Sepolia';
    default: return `Chain ${chainId}`;
  }
}
