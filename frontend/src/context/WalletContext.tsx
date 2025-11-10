import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useBlockchain } from './BlockchainContext';

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { account, connectWallet: connectBlockchainWallet, disconnectWallet: disconnectBlockchain, isWalletConnected, isLoading } = useBlockchain();
  
  const connectWallet = async () => {
    await connectBlockchainWallet();
  };

  const disconnectWallet = () => {
    disconnectBlockchain();
  };

  const contextValue = useMemo(() => ({
    account,
    connectWallet,
    disconnectWallet,
    isConnected: isWalletConnected,
    isLoading,
  }), [account, isWalletConnected, isLoading]);

  return (
    <WalletContext.Provider
      value={contextValue}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};