// Mock wallet connection functions
export interface WalletAccount {
  address: string;
  balance: string;
  symbol: string;
  network: string;
}

export interface ConnectionResult {
  status: 'connected' | 'disconnected' | 'connecting';
  address?: string;
  balance?: string;
  network?: string;
}

export const mockConnectWallet = async (): Promise<ConnectionResult> => {
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    status: 'connected',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: '2.45 ETH',
    network: 'Ethereum Mainnet'
  };
};

export const mockGetAccount = (): WalletAccount | null => {
  return {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: '2.45',
    symbol: 'ETH',
    network: 'mainnet'
  };
};

export const mockDisconnect = (): ConnectionResult => {
  return { status: 'disconnected' };
};

// Mock NFT minting functions
export interface MintResult {
  success: boolean;
  transactionHash?: string;
  tokenId?: number;
  message: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface TokenDetails {
  tokenId: number;
  owner: string;
  metadata: NFTMetadata;
  assets: Array<{
    token: string;
    balance: string;
  }>;
  imageUrl: string;
}

export const mockMintNFT = async (tokenName: string, strategy: string): Promise<MintResult> => {
  // Simulate transaction delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const tokenId = Math.floor(Math.random() * 10000) + 1;
  
  return {
    success: true,
    transactionHash: '0x9a8f3a9d7b4c5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    tokenId: tokenId,
    message: 'YieldSpirit NFT minted successfully!'
  };
};

export const mockGetTokenDetails = (tokenId: number): TokenDetails => {
  const strategies = ['Conservative Staking', 'Balanced LP', 'Aggressive Farming', 'Degen Yield Hunting'];
  const riskLevels = ['Low', 'Medium', 'High', 'Very High'];
  
  return {
    tokenId: tokenId,
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    metadata: {
      name: `YieldSpirit #${tokenId}`,
      description: 'An ERC-6551 Token-Bound Account for yield hunting',
      attributes: [
        { trait_type: 'Strategy', value: strategies[tokenId % 4] },
        { trait_type: 'Risk Level', value: riskLevels[tokenId % 4] },
        { trait_type: 'APY Potential', value: `${Math.floor(Math.random() * 80) + 10}%` }
      ]
    },
    assets: [
      { token: 'ETH', balance: (Math.random() * 2).toFixed(2) },
      { token: 'USDC', balance: (Math.random() * 5000).toFixed(2) },
      { token: 'YIELD', balance: (Math.random() * 1000).toFixed(1) }
    ],
    imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}`
  };
};

// Mock NFT collection
export const mockGetNFTCollection = (): TokenDetails[] => {
  return [1, 2, 3, 4].map(id => mockGetTokenDetails(id));
};

// Mock yield strategy functions
export interface YieldOpportunity {
  id: string;
  name: string;
  apy: string;
  risk: 'Low' | 'Medium' | 'High';
  chain: string;
  tokens: string[];
  description: string;
  tvl?: string;
}

export interface YieldStrategy {
  id: string;
  name: string;
  opportunities: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  targetAPY: string;
}

export const mockGetYieldOpportunities = (): YieldOpportunity[] => {
  return [
    {
      id: 'opportunity_1',
      name: 'Lido Staking',
      apy: '4.2%',
      risk: 'Low',
      chain: 'Ethereum',
      tokens: ['ETH'],
      description: 'Stake ETH for stETH with Lido protocol',
      tvl: '$14.2B'
    },
    {
      id: 'opportunity_2',
      name: 'Aave Lending',
      apy: '7.8%',
      risk: 'Low',
      chain: 'Ethereum',
      tokens: ['USDC', 'DAI'],
      description: 'Lend assets on Aave for passive income',
      tvl: '$8.5B'
    },
    {
      id: 'opportunity_3',
      name: 'Uniswap V3 LP',
      apy: '15.3%',
      risk: 'Medium',
      chain: 'Ethereum',
      tokens: ['ETH', 'USDC'],
      description: 'Provide liquidity to earn trading fees',
      tvl: '$3.2B'
    },
    {
      id: 'opportunity_4',
      name: 'Compound Supply',
      apy: '5.6%',
      risk: 'Low',
      chain: 'Ethereum',
      tokens: ['WBTC', 'USDT'],
      description: 'Supply assets to Compound protocol',
      tvl: '$2.8B'
    },
    {
      id: 'opportunity_5',
      name: 'Curve 3pool',
      apy: '12.4%',
      risk: 'Medium',
      chain: 'Ethereum',
      tokens: ['DAI', 'USDC', 'USDT'],
      description: 'Earn trading fees from stablecoin swaps',
      tvl: '$1.5B'
    },
    {
      id: 'opportunity_6',
      name: 'Yearn Vault',
      apy: '18.7%',
      risk: 'High',
      chain: 'Ethereum',
      tokens: ['ETH', 'WBTC'],
      description: 'Auto-compounding vault strategies',
      tvl: '$890M'
    }
  ];
};

export const mockConfigureYieldStrategy = async (strategyData: Partial<YieldStrategy>): Promise<{ success: boolean; strategyId: string; message: string; strategy: YieldStrategy }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const strategy: YieldStrategy = {
    id: 'strategy_' + Date.now(),
    name: strategyData.name || 'Untitled Strategy',
    opportunities: strategyData.opportunities || [],
    riskLevel: strategyData.riskLevel || 'Medium',
    targetAPY: strategyData.targetAPY || '10%'
  };
  
  return {
    success: true,
    strategyId: strategy.id,
    message: 'Yield strategy configured successfully',
    strategy
  };
};

export const mockExecuteYieldAction = async (action: { type: string; opportunityId: string; amount: string }): Promise<{ success: boolean; action: any; message: string; transactionHash: string }> => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    success: true,
    action: action,
    message: `Yield action executed: ${action.type}`,
    transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
  };
};

// Mock SideShift-related data
export interface SideShiftSwap {
  quoteId: string;
  depositMethodId: string;
  settleMethodId: string;
  settleAddress: string;
  depositAmount: string;
  minReturnAmount: string;
  deadline: number;
  executed: boolean;
  cancelled: boolean;
  createdAt: string;
  estimatedSettleAmount: string;
  rate: string;
  depositAddress: string;
}

export const mockGetSideShiftSwaps = (tokenId: number): SideShiftSwap[] => {
  return [
    {
      quoteId: 'qs_' + Math.random().toString(36).substr(2, 9),
      depositMethodId: 'eth',
      settleMethodId: 'usdc',
      settleAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      depositAmount: '1.0',
      minReturnAmount: '3200',
      deadline: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
      executed: false,
      cancelled: false,
      createdAt: new Date().toISOString(),
      estimatedSettleAmount: '3250',
      rate: '3250.00',
      depositAddress: '0x8A791620dd62600796FBEd3c02fA9D71E1c9657e'
    },
    {
      quoteId: 'qs_' + Math.random().toString(36).substr(2, 9),
      depositMethodId: 'matic',
      settleMethodId: 'wbtc',
      settleAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      depositAmount: '500',
      minReturnAmount: '0.012',
      deadline: Date.now() + 48 * 60 * 60 * 1000, // 48 hours from now
      executed: true,
      cancelled: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      estimatedSettleAmount: '0.0125',
      rate: '0.000025',
      depositAddress: '0x8A791620dd62600796FBEd3c02fA9D71E1c9657e'
    }
  ];
};

export const mockInitiateSideShiftSwap = async (swapData: {
  tokenId: number;
  quoteId: string;
  depositMethodId: string;
  settleMethodId: string;
  settleAddress: string;
  depositAmount: number;
  minReturnAmount: number;
  deadline: number;
}): Promise<{ success: boolean; message: string; swap: SideShiftSwap }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const swap: SideShiftSwap = {
    quoteId: swapData.quoteId,
    depositMethodId: swapData.depositMethodId,
    settleMethodId: swapData.settleMethodId,
    settleAddress: swapData.settleAddress,
    depositAmount: swapData.depositAmount.toString(),
    minReturnAmount: swapData.minReturnAmount.toString(),
    deadline: swapData.deadline,
    executed: false,
    cancelled: false,
    createdAt: new Date().toISOString(),
    estimatedSettleAmount: (swapData.depositAmount * 0.95).toString(),
    rate: '0.95',
    depositAddress: '0x8A791620dd62600796FBEd3c02fA9D71E1c9657e'
  };

  return {
    success: true,
    message: 'SideShift swap initiated successfully',
    swap
  };
};

export interface PortfolioAsset {
  token: string;
  amount: number;
  value: number;
  chain: string;
  apy: number;
}

export const mockGetPortfolio = (): PortfolioAsset[] => {
  return [
    { token: 'ETH', amount: 1.25, value: 4125, chain: 'Ethereum', apy: 4.2 },
    { token: 'USDC', amount: 2500, value: 2500, chain: 'Ethereum', apy: 2.8 },
    { token: 'WBTC', amount: 0.05, value: 1850, chain: 'Polygon', apy: 3.1 },
    { token: 'OP', amount: 450, value: 900, chain: 'Optimism', apy: 8.2 },
  ];
};

export interface AIOptimizationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  condition: string;
  action: string;
  priority: number;
}

export const mockGetAIOptimizationRules = (): AIOptimizationRule[] => {
  return [
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
  ];
};
