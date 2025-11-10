import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BrowserProvider, Contract, Signer } from 'ethers';
import type { Provider } from '@ethersproject/providers';

// Define the context type
interface BlockchainContextType {
  provider: Provider | null;
  signer: Signer | null;
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  yieldSpiritContract: Contract | null;
  mintYieldSpirit: () => Promise<void>;
  setStrategy: (tokenId: number, name: string, minAPY: number, targetChains: string[], targetAssets: string[]) => Promise<void>;
  associateTBA: (tokenId: number, tbaAddress: string) => Promise<void>;
  initiateSideShiftSwap: (tokenId: number, quoteId: string, depositMethodId: string, settleMethodId: string, settleAddress: string, depositAmount: number, minReturnAmount: number, deadline: number) => Promise<void>;
  executeSideShiftSwap: (tokenId: number, swapIndex: number) => Promise<void>;
  cancelSideShiftSwap: (tokenId: number, swapIndex: number) => Promise<void>;
  getSideShiftSwaps: (tokenId: number) => Promise<any[]>;
  getYieldSpiritDetails: (tokenId: number) => Promise<any>;
  isWalletConnected: boolean;
  isLoading: boolean;
}

// Create the context
const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// ABI for YieldSpirit contract (simplified - in practice you'd import this from artifacts)
const YIELDSPIRIT_ABI = [
  "function safeMint(address to) returns (uint256)",
  "function setStrategy(uint256 tokenId, string memory name, uint256 minAPY, string[] memory targetChains, string[] memory targetAssets)",
  "function associateTBA(uint256 tokenId, address tbaAddress)",
  "function initiateSideShiftSwap(uint256 tokenId, string memory quoteId, string memory depositMethodId, string memory settleMethodId, string memory settleAddress, uint256 depositAmount, uint256 minReturnAmount, uint256 deadline)",
  "function executeSideShiftSwap(uint256 tokenId, uint256 swapIndex)",
  "function cancelSideShiftSwap(uint256 tokenId, uint256 swapIndex)",
  "function getSideShiftSwaps(uint256 tokenId) view returns ((string quoteId, address tokenOwner, address tbaAddress, string depositMethodId, string settleMethodId, string settleAddress, uint256 depositAmount, uint256 minReturnAmount, uint256 deadline, bool executed, bool cancelled)[])",
  "function getSideShiftSwapCount(uint256 tokenId) view returns (uint256)",
  "function getYieldSpiritDetails(uint256 tokenId) view returns (address owner, address tba, tuple(string name, uint256 minAPY, string[] targetChains, string[] targetAssets, bool active) strategy)",
  "function tokenBoundAccounts(uint256) view returns (address)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)"
];

// Contract address - will be loaded from environment
const YIELDSPIRIT_CONTRACT_ADDRESS = import.meta.env.VITE_YIELDSPIRIT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Default to local deployment address

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<Props> = ({ children }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [yieldSpiritContract, setYieldSpiritContract] = useState<Contract | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize contract once we have a signer
  useEffect(() => {
    if (signer) {
      try {
        const contract = new Contract(
          YIELDSPIRIT_CONTRACT_ADDRESS,
          YIELDSPIRIT_ABI,
          signer
        );
        setYieldSpiritContract(contract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    }
  }, [signer]);

  const connectWallet = async () => {
    setIsLoading(true);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // Always request account selection for better UX
        await (window as any).ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });

        const web3Provider = new BrowserProvider((window as any).ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        const signer = await web3Provider.getSigner();
        const userAddress = await signer.getAddress();
        const network = await web3Provider.getNetwork();

        setProvider(web3Provider);
        setSigner(signer);
        setAccount(userAddress);
        setChainId(Number(network.chainId));
        setIsWalletConnected(true);

        console.log('Wallet connected:', userAddress);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet: ' + (error as any).message);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet to use this dApp');
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setYieldSpiritContract(null);
    setIsWalletConnected(false);
  };

  const mintYieldSpirit = async () => {
    if (!yieldSpiritContract || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await yieldSpiritContract.safeMint(account);
      console.log('Transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Transaction mined:', receipt);
      alert('YieldSpirit NFT minted successfully!');
      return receipt;
    } catch (error) {
      console.error('Error minting YieldSpirit:', error);
      alert('Error minting YieldSpirit: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const setStrategy = async (
    tokenId: number,
    name: string,
    minAPY: number,
    targetChains: string[],
    targetAssets: string[]
  ) => {
    if (!yieldSpiritContract || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await yieldSpiritContract.setStrategy(
        tokenId,
        name,
        minAPY,
        targetChains,
        targetAssets
      );
      console.log('Set strategy transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Set strategy transaction mined:', receipt);
      alert('Strategy set successfully!');
      return receipt;
    } catch (error) {
      console.error('Error setting strategy:', error);
      alert('Error setting strategy: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const associateTBA = async (tokenId: number, tbaAddress: string) => {
    if (!yieldSpiritContract || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await yieldSpiritContract.associateTBA(tokenId, tbaAddress);
      console.log('Associate TBA transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Associate TBA transaction mined:', receipt);
      alert('TBA associated successfully!');
      return receipt;
    } catch (error) {
      console.error('Error associating TBA:', error);
      alert('Error associating TBA: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getYieldSpiritDetails = async (tokenId: number) => {
    if (!yieldSpiritContract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    try {
      const details = await yieldSpiritContract.getYieldSpiritDetails(tokenId);
      return {
        owner: details[0],
        tba: details[1],
        strategy: {
          name: details[2].name,
          minAPY: Number(details[2].minAPY),
          targetChains: details[2].targetChains,
          targetAssets: details[2].targetAssets,
          active: details[2].active
        }
      };
    } catch (error) {
      console.error('Error getting YieldSpirit details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initiateSideShiftSwap = async (
    tokenId: number,
    quoteId: string,
    depositMethodId: string,
    settleMethodId: string,
    settleAddress: string,
    depositAmount: number,
    minReturnAmount: number,
    deadline: number
  ) => {
    if (!yieldSpiritContract || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await yieldSpiritContract.initiateSideShiftSwap(
        tokenId,
        quoteId,
        depositMethodId,
        settleMethodId,
        settleAddress,
        depositAmount,
        minReturnAmount,
        deadline
      );
      console.log('Initiate SideShift swap transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Initiate SideShift swap transaction mined:', receipt);
      alert('SideShift swap initiated successfully!');
      return receipt;
    } catch (error) {
      console.error('Error initiating SideShift swap:', error);
      alert('Error initiating SideShift swap: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSideShiftSwap = async (tokenId: number, swapIndex: number) => {
    if (!yieldSpiritContract || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await yieldSpiritContract.executeSideShiftSwap(tokenId, swapIndex);
      console.log('Execute SideShift swap transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Execute SideShift swap transaction mined:', receipt);
      alert('SideShift swap executed successfully!');
      return receipt;
    } catch (error) {
      console.error('Error executing SideShift swap:', error);
      alert('Error executing SideShift swap: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSideShiftSwap = async (tokenId: number, swapIndex: number) => {
    if (!yieldSpiritContract || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await yieldSpiritContract.cancelSideShiftSwap(tokenId, swapIndex);
      console.log('Cancel SideShift swap transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Cancel SideShift swap transaction mined:', receipt);
      alert('SideShift swap cancelled successfully!');
      return receipt;
    } catch (error) {
      console.error('Error cancelling SideShift swap:', error);
      alert('Error cancelling SideShift swap: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSideShiftSwaps = async (tokenId: number) => {
    if (!yieldSpiritContract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    try {
      const swaps = await yieldSpiritContract.getSideShiftSwaps(tokenId);
      return swaps.map((swap: any) => ({
        quoteId: swap.quoteId,
        tokenOwner: swap.tokenOwner,
        tbaAddress: swap.tbaAddress,
        depositMethodId: swap.depositMethodId,
        settleMethodId: swap.settleMethodId,
        settleAddress: swap.settleAddress,
        depositAmount: Number(swap.depositAmount),
        minReturnAmount: Number(swap.minReturnAmount),
        deadline: Number(swap.deadline),
        executed: swap.executed,
        cancelled: swap.cancelled
      }));
    } catch (error) {
      console.error('Error getting SideShift swaps:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        connectWallet,
        disconnectWallet,
        yieldSpiritContract,
        mintYieldSpirit,
        setStrategy,
        associateTBA,
        initiateSideShiftSwap,
        executeSideShiftSwap,
        cancelSideShiftSwap,
        getSideShiftSwaps,
        getYieldSpiritDetails,
        isWalletConnected,
        isLoading
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};