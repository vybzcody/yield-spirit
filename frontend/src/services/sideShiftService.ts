import axios from 'axios';

// Define TypeScript interfaces based on SideShift API v2 responses
export interface Coin {
  coin: string;
  name: string;
  networks: string[];
  hasMemo: boolean;
  fixedOnly: boolean;
  variableOnly: boolean | string[];
  tokenDetails?: Record<string, {
    contractAddress: string;
    decimals: number;
  }>;
  networksWithMemo: string[];
  depositOffline: boolean | string[];
  settleOffline: boolean | string[];
}

export interface Pair {
  min: string;
  max: string;
  rate: string;
}

export interface Quote {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  depositAmount: string;
  settleAmount: string;
  rate: string;
  expiresAt: string;
  affiliateId?: string;
}

export interface Shift {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  depositAddress: string;
  settleAddress: string;
  depositMin: string;
  depositMax: string;
  rate?: string;
  expiresAt: string;
  status: string;
  deposits?: Deposit[];
}

export interface Deposit {
  id: string;
  createdAt: string;
  coinAmount: string;
  usdAmount: string;
  status: string;
  txHash?: string;
  settleAmount?: string;
  settleTxHash?: string;
}

export interface CreateVariableShiftData {
  settleAddress: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  refundAddress?: string;
  affiliateId?: string;
}

export interface CreateFixedShiftData {
  settleAddress: string;
  quoteId: string;
  refundAddress?: string;
  affiliateId?: string;
}

class SideShiftService {
  private readonly baseURL = 'https://sideshift.ai/api/v2';
  private readonly headers = {
    'Content-Type': 'application/json',
    'x-user-ip': '127.0.0.1', // Should be set to actual user IP in production
  };

  /**
   * Get all supported coins and their networks
   */
  async getCoins(): Promise<Coin[]> {
    try {
      const response = await axios.get<Coin[]>(`${this.baseURL}/coins`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  }

  /**
   * Get pair information (min/max amounts and rate)
   */
  async getPair(
    depositCoin: string,
    settleCoin: string,
    depositNetwork: string,
    settleNetwork: string,
    amount?: string
  ): Promise<Pair> {
    try {
      const params = new URLSearchParams({
        depositCoin,
        settleCoin,
        depositNetwork,
        settleNetwork,
      });
      
      if (amount) {
        params.append('amount', amount);
      }

      const response = await axios.get<Pair>(`${this.baseURL}/pair?${params}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pair:', error);
      throw error;
    }
  }

  /**
   * Create a quote for fixed rate shifts
   */
  async createQuote(
    depositCoin: string,
    settleCoin: string,
    depositNetwork: string,
    settleNetwork: string,
    depositAmount: string,
    affiliateId?: string
  ): Promise<Quote> {
    try {
      const data = {
        depositCoin,
        settleCoin,
        depositNetwork,
        settleNetwork,
        depositAmount,
        ...(affiliateId && { affiliateId }),
      };

      const response = await axios.post<Quote>(`${this.baseURL}/quotes`, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  }

  /**
   * Create a variable rate shift
   */
  async createVariableShift(data: CreateVariableShiftData): Promise<Shift> {
    try {
      const response = await axios.post<Shift>(`${this.baseURL}/shifts/variable`, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating variable shift:', error);
      throw error;
    }
  }

  /**
   * Create a fixed rate shift
   */
  async createFixedShift(data: CreateFixedShiftData): Promise<Shift> {
    try {
      const response = await axios.post<Shift>(`${this.baseURL}/shifts/fixed`, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating fixed shift:', error);
      throw error;
    }
  }

  /**
   * Get shift status by ID
   */
  async getShift(shiftId: string): Promise<Shift> {
    try {
      const response = await axios.get<Shift>(`${this.baseURL}/shifts/${shiftId}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift:', error);
      throw error;
    }
  }

  /**
   * Check permissions for the current user/IP
   */
  async getPermissions(): Promise<{ createShift: boolean; createQuote: boolean }> {
    try {
      const response = await axios.get<{ createShift: boolean; createQuote: boolean }>(
        `${this.baseURL}/permissions`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }
}

export const sideShiftService = new SideShiftService();