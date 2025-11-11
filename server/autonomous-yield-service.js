// services/autonomous-yield-service.js
const { ethers } = require('ethers');
require('dotenv').config();

// Import contract ABIs - using ABIs directly from the artifacts
// For production deployment, we'll store the ABI as a constant
const YieldSpiritABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "safeMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getYieldSpiritDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tba",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "minAPY",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "targetChains",
            "type": "string[]"
          },
          {
            "internalType": "string[]",
            "name": "targetAssets",
            "type": "string[]"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          }
        ],
        "internalType": "struct YieldSpirit.Strategy",
        "name": "strategy",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "minAPY",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "targetChains",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "targetAssets",
        "type": "string[]"
      }
    ],
    "name": "setStrategy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "tbaAddress",
        "type": "address"
      }
    ],
    "name": "associateTBA",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "quoteId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "depositMethodId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "settleMethodId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "settleAddress",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "depositAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minReturnAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "initiateSideShiftSwap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getSideShiftSwaps",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "quoteId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "tokenOwner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tbaAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "depositMethodId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "settleMethodId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "settleAddress",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "depositAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minReturnAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "executed",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "cancelled",
            "type": "bool"
          }
        ],
        "internalType": "struct YieldSpirit.SideShiftSwap[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextTokenId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ERC6551AccountABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "uint8",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "execute",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "tokenContract",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const sideShiftService = require('./sideShiftService');

class AutonomousYieldService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
    this.yieldSpiritContract = null;
    this.running = false;
    this.monitoredTokens = new Map(); // tokenId -> { strategy, tbaAddress, owner }
  }

  async initialize() {
    if (!process.env.YIELDSPIRIT_CONTRACT_ADDRESS) {
      throw new Error('YIELDSPIRIT_CONTRACT_ADDRESS environment variable is required');
    }

    this.yieldSpiritContract = new ethers.Contract(
      process.env.YIELDSPIRIT_CONTRACT_ADDRESS,
      YieldSpiritABI,
      this.provider
    );

    console.log('Autonomous Yield Service initialized');
  }

  async start() {
    if (!this.yieldSpiritContract) {
      await this.initialize();
    }

    console.log('Starting autonomous yield monitoring...');
    this.running = true;

    // Initial scan
    await this.scanForNewTokens();
    
    // Set up periodic scanning
    setInterval(() => {
      this.scanForNewTokens().catch(console.error);
    }, 30000); // Scan every 30 seconds

    // Set up periodic yield opportunity checking
    setInterval(() => {
      this.checkYieldOpportunities().catch(console.error);
    }, 60000); // Check every minute
  }

  async stop() {
    this.running = false;
    console.log('Autonomous yield service stopped');
  }

  async scanForNewTokens() {
    if (!this.yieldSpiritContract) return;

    try {
      // This is a basic approach - in a real implementation, you'd want to 
      // listen to events or have a more efficient method
      const nextTokenId = await this.yieldSpiritContract.nextTokenId();
      
      for (let tokenId = 0; tokenId < nextTokenId; tokenId++) {
        try {
          const owner = await this.yieldSpiritContract.ownerOf(tokenId);
          
          // Check if this token is already being monitored
          if (!this.monitoredTokens.has(tokenId)) {
            const details = await this.yieldSpiritContract.getYieldSpiritDetails(tokenId);
            
            if (details.tbaAddress !== ethers.ZeroAddress && details.strategy.active) {
              this.monitoredTokens.set(tokenId, {
                strategy: {
                  name: details.strategy.name,
                  minAPY: Number(details.strategy.minAPY),
                  targetChains: details.strategy.targetChains,
                  targetAssets: details.strategy.targetAssets,
                  active: details.strategy.active
                },
                tbaAddress: details.tbaAddress,
                owner: owner
              });
              
              console.log(`Added token ${tokenId} to monitoring (TBA: ${details.tbaAddress})`);
            }
          }
        } catch (error) {
          // Token may not exist (burned or never minted), continue
          continue;
        }
      }
    } catch (error) {
      console.error('Error scanning for tokens:', error);
    }
  }

  async checkYieldOpportunities() {
    if (!this.running) return;

    console.log(`Checking yield opportunities for ${this.monitoredTokens.size} tokens`);

    for (const [tokenId, tokenData] of this.monitoredTokens.entries()) {
      try {
        await this.evaluateAndExecuteYield(tokenId, tokenData);
      } catch (error) {
        console.error(`Error processing token ${tokenId}:`, error);
      }
    }
  }

  async evaluateAndExecuteYield(tokenId, tokenData) {
    // Get current TBA balance
    const tbaBalance = await this.provider.getBalance(tokenData.tbaAddress);
    const tbaBalanceEth = ethers.formatEther(tbaBalance);

    if (parseFloat(tbaBalanceEth) < 0.01) {
      // Not enough balance to justify swap costs
      return;
    }

    // Scan for yield opportunities using SideShift
    const opportunities = await this.findSideShiftOpportunities(
      tokenData.strategy.targetChains, 
      tokenData.strategy.targetAssets
    );

    for (const opportunity of opportunities) {
      // Check if this opportunity meets the minimum APY requirement
      if (opportunity.estimatedAPY >= tokenData.strategy.minAPY) {
        console.log(`Found profitable opportunity for token ${tokenId}: ${opportunity.estimatedAPY}% APY`);
        
        // Execute the yield strategy
        await this.executeYieldStrategy(tokenId, tokenData, opportunity);
        break; // Execute only one opportunity per cycle
      }
    }
  }

  async findSideShiftOpportunities(targetChains, targetAssets) {
    // In a real implementation, this would query yield aggregators, 
    // DeFi protocols, and SideShift API for cross-chain opportunities
    // For testing purposes, we'll create realistic mock opportunities
    // based on common SideShift supported pairs
    
    // Fetch available coins from SideShift API to get valid pairs
    let availableCoins = [];
    try {
      const coinsResponse = await fetch('https://sideshift.ai/api/v2/coins');
      availableCoins = await coinsResponse.json();
    } catch (error) {
      console.warn('Could not fetch SideShift coins, using default pairs:', error.message);
      // Default to common pairs that SideShift supports
      availableCoins = [
        { id: 'ETH', name: 'Ethereum' },
        { id: 'USDC', name: 'USD Coin' },
        { id: 'DAI', name: 'Dai Stablecoin' },
        { id: 'WBTC', name: 'Wrapped Bitcoin' },
        { id: 'MATIC', name: 'Matic' }
      ];
    }
    
    // Create opportunities based on available coins and target assets
    const potentialOpportunities = [];
    
    // Look for common profitable pairs
    const commonAssets = ['ETH', 'USDC', 'DAI', 'WBTC', 'MATIC'];
    const commonNetworks = ['ethereum', 'polygon', 'bsc', 'avalanche', 'arbitrum'];
    
    // Generate potential opportunities based on target chains and assets
    for (const fromNetwork of commonNetworks) {
      if (targetChains.includes(fromNetwork)) {
        for (const fromAsset of commonAssets) {
          if (availableCoins.some(coin => coin.id === fromAsset)) {
            for (const toAsset of targetAssets) {
              if (fromAsset !== toAsset && availableCoins.some(coin => coin.id === toAsset)) {
                // Generate a realistic opportunity
                const estimatedAPY = Math.floor(Math.random() * 1500) + 500; // 5% to 20% APY
                
                potentialOpportunities.push({
                  fromCoin: fromAsset,
                  toCoin: toAsset,
                  fromNetwork: fromNetwork,
                  toNetwork: targetChains.find(chain => chain !== fromNetwork) || 'polygon',
                  estimatedAPY: estimatedAPY,
                  minAmount: '1000000000000000000', // 1 ETH equivalent as base
                  expectedReturn: (Math.random() * 1.2 + 0.8).toString() // Random return factor
                });
              }
            }
          }
        }
      }
    }
    
    // For testing in local environment, return some known pairs
    const mockOpportunities = [
      {
        fromCoin: 'ETH',
        toCoin: 'USDC',
        fromNetwork: 'ethereum',
        toNetwork: 'polygon',
        estimatedAPY: 1500, // 15% APY in basis points
        minAmount: '1000000000000000000', // 1 ETH equivalent
        expectedReturn: '3000000000', // 3000 USDC (at $3000 ETH price)
      },
      {
        fromCoin: 'USDC',
        toCoin: 'ETH',
        fromNetwork: 'polygon',
        toNetwork: 'ethereum',
        estimatedAPY: 1200, // 12% APY in basis points
        minAmount: '1000000000', // 1000 USDC
        expectedReturn: '333333333333333333', // 0.33 ETH (at $3000 ETH price)
      },
      {
        fromCoin: 'MATIC',
        toCoin: 'USDC',
        fromNetwork: 'polygon',
        toNetwork: 'ethereum',
        estimatedAPY: 800, // 8% APY in basis points
        minAmount: '1000000000000000000000', // 1000 MATIC
        expectedReturn: '2000000000', // 2 USDC per MATIC assumption
      }
    ];
    
    // Combine real and mock opportunities
    return [...mockOpportunities, ...potentialOpportunities].filter(opp => 
      targetChains.includes(opp.fromNetwork) && 
      targetAssets.includes(opp.toCoin)
    );
  }

  async executeYieldStrategy(tokenId, tokenData, opportunity) {
    try {
      console.log(`Executing yield strategy for token ${tokenId}`);
      console.log(`Swapping ${opportunity.fromCoin} to ${opportunity.toCoin} across chains`);
      
      // In a real implementation, this would:
      // 1. Create a SideShift swap using the TBA address as the settlement address
      // 2. Execute it through the TBA (requires TBA private key/signing capability)
      // 3. Update the on-chain state
      
      // For simulation/testing, we'll log what would happen:
      console.log(`Creating SideShift swap: ${opportunity.fromCoin}-${opportunity.fromNetwork} to ${opportunity.toCoin}-${opportunity.toNetwork}`);
      console.log(`Settlement address (TBA): ${tokenData.tbaAddress}`);
      console.log(`Expected return: ${opportunity.expectedReturn} ${opportunity.toCoin}`);
      
      // In production, we would call the SideShift API like this:
      /*
      const sideShiftResponse = await fetch('https://sideshift.ai/api/v2/shifts/variable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settleAddress: tokenData.tbaAddress,
          depositCoin: opportunity.fromCoin,
          settleCoin: opportunity.toCoin,
          depositNetwork: opportunity.fromNetwork,
          settleNetwork: opportunity.toNetwork
        })
      });
      
      if (sideShiftResponse.ok) {
        const swapData = await sideShiftResponse.json();
        console.log(`Swap created successfully: ${swapData.id}`);
        
        // Record the swap on-chain by calling the smart contract
        // This would require a proper signer with the ability to interact with the contract
        // await this.yieldSpiritContract.initiateSideShiftSwap(
        //   tokenId,
        //   swapData.id,
        //   `${opportunity.fromCoin}-${opportunity.fromNetwork}`,
        //   `${opportunity.toCoin}-${opportunity.toNetwork}`,
        //   tokenData.tbaAddress,
        //   opportunity.minAmount,
        //   opportunity.expectedReturn,
        //   Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
        // );
      } else {
        console.error('Failed to create SideShift swap:', await sideShiftResponse.text());
      }
      */
      
    } catch (error) {
      console.error(`Error executing yield strategy for token ${tokenId}:`, error);
    }
  }

  // Get all monitored tokens for the dashboard
  getMonitoredTokens() {
    return Array.from(this.monitoredTokens.entries()).map(([tokenId, data]) => ({
      tokenId: Number(tokenId),
      ...data
    }));
  }
}

// Export the service
module.exports = AutonomousYieldService;

// If running directly, start the service
if (require.main === module) {
  const service = new AutonomousYieldService();
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down autonomous yield service...');
    await service.stop();
    process.exit(0);
  });

  service.start().catch(console.error);
}