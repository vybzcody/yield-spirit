import { Contract, BrowserProvider } from 'ethers';
import { sideShiftService } from './sideShiftService';

export interface UserToken {
  tokenId: number;
  owner: string;
  tbaAddress: string;
  strategy: {
    name: string;
    minAPY: number;
    targetChains: string[];
    targetAssets: string[];
    active: boolean;
  };
}

export interface TokenSwap {
  quoteId: string;
  tokenOwner: string;
  tbaAddress: string;
  depositMethodId: string;
  settleMethodId: string;
  settleAddress: string;
  depositAmount: string;
  minReturnAmount: string;
  deadline: number;
  executed: boolean;
  cancelled: boolean;
}

class ContractService {
  private contract: Contract | null = null;
  private provider: BrowserProvider | null = null;

  setContract(contract: Contract, provider: BrowserProvider) {
    this.contract = contract;
    this.provider = provider;
  }

  /**
   * Validate contract is deployed and accessible
   */
  async validateContract(): Promise<boolean> {
    if (!this.contract || !this.provider) return false;
    
    try {
      // Try to get contract code to verify deployment
      const code = await this.provider.getCode(await this.contract.getAddress());
      return code !== '0x';
    } catch (error) {
      console.error('Contract validation failed:', error);
      return false;
    }
  }

  /**
   * Get all tokens owned by user with better error handling
   */
  async getUserTokens(userAddress: string): Promise<UserToken[]> {
    if (!this.contract) throw new Error('Contract not initialized');

    try {
      // Validate contract first
      const isValid = await this.validateContract();
      if (!isValid) {
        console.warn('Contract not deployed or accessible');
        return [];
      }

      const balance = await this.contract.balanceOf(userAddress);
      const balanceNum = Number(balance);
      
      if (balanceNum === 0) {
        return [];
      }

      const tokens: UserToken[] = [];

      // Get token IDs owned by user (simplified approach)
      for (let i = 0; i < Math.min(balanceNum, 10); i++) { // Limit to 10 for performance
        try {
          const tokenId = i;
          const owner = await this.contract.ownerOf(tokenId);
          
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const details = await this.contract.getYieldSpiritDetails(tokenId);
            tokens.push({
              tokenId,
              owner: details.owner,
              tbaAddress: details.tba,
              strategy: {
                name: details.strategy.name || `Strategy ${tokenId}`,
                minAPY: Number(details.strategy.minAPY),
                targetChains: details.strategy.targetChains || [],
                targetAssets: details.strategy.targetAssets || [],
                active: details.strategy.active
              }
            });
          }
        } catch (error) {
          // Token doesn't exist or not owned by user, continue
          break;
        }
      }

      return tokens;
    } catch (error) {
      console.error('Error getting user tokens:', error);
      return []; // Return empty array instead of throwing
    }
  }

  /**
   * Execute yield strategy by creating SideShift swap
   */
  async executeYieldStrategy(tokenId: number, fromCoin: string, toCoin: string, fromNetwork: string, toNetwork: string, amount: string): Promise<void> {
    if (!this.contract) throw new Error('Contract not initialized');

    const isValid = await this.validateContract();
    if (!isValid) throw new Error('Contract not deployed or accessible');

    // Get token details
    const details = await this.contract.getYieldSpiritDetails(tokenId);
    if (!details.tba || details.tba === '0x0000000000000000000000000000000000000000') {
      throw new Error('TBA not associated with token');
    }

    // Create SideShift swap
    const shiftData = {
      settleAddress: details.tba,
      depositCoin: fromCoin,
      settleCoin: toCoin,
      depositNetwork: fromNetwork,
      settleNetwork: toNetwork,
    };

    const shift = await sideShiftService.createVariableShift(shiftData);

    // Record swap in contract
    const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
    await this.contract.initiateSideShiftSwap(
      tokenId,
      shift.id,
      `${fromCoin}-${fromNetwork}`,
      `${toCoin}-${toNetwork}`,
      details.tba,
      amount,
      '0',
      deadline
    );
  }

  /**
   * Get swap history for a token
   */
  async getTokenSwaps(tokenId: number): Promise<TokenSwap[]> {
    if (!this.contract) throw new Error('Contract not initialized');

    try {
      const swaps = await this.contract.getSideShiftSwaps(tokenId);
      return swaps.map((swap: any) => ({
        quoteId: swap.quoteId,
        tokenOwner: swap.tokenOwner,
        tbaAddress: swap.tbaAddress,
        depositMethodId: swap.depositMethodId,
        settleMethodId: swap.settleMethodId,
        settleAddress: swap.settleAddress,
        depositAmount: swap.depositAmount.toString(),
        minReturnAmount: swap.minReturnAmount.toString(),
        deadline: Number(swap.deadline),
        executed: swap.executed,
        cancelled: swap.cancelled
      }));
    } catch (error) {
      console.error('Error getting token swaps:', error);
      return [];
    }
  }

  /**
   * Check if NFT can perform yield operations
   */
  async canPerformYield(tokenId: number): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const details = await this.contract.getYieldSpiritDetails(tokenId);
      return details.strategy.active && details.tba !== '0x0000000000000000000000000000000000000000';
    } catch {
      return false;
    }
  }

  /**
   * Get TBA balance for a token
   */
  async getTBABalance(tokenId: number): Promise<string> {
    if (!this.contract || !this.provider) return '0';

    try {
      const details = await this.contract.getYieldSpiritDetails(tokenId);
      if (!details.tba || details.tba === '0x0000000000000000000000000000000000000000') {
        return '0';
      }

      const balance = await this.provider.getBalance(details.tba);
      return balance.toString();
    } catch (error) {
      console.error('Error getting TBA balance:', error);
      return '0';
    }
  }
}

export const contractService = new ContractService();
