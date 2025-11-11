// sideShiftService.js
const axios = require('axios');

class SideShiftService {
  constructor() {
    this.baseURL = process.env.SIDESHIFT_API_URL || 'https://sideshift.ai/api/v2';
  }

  // Create a variable shift (swap with variable rate)
  async createVariableShift(shiftData) {
    try {
      const response = await axios.post(`${this.baseURL}/shifts/variable`, {
        settleAddress: shiftData.settleAddress,
        depositCoin: shiftData.depositCoin,
        settleCoin: shiftData.settleCoin,
        depositNetwork: shiftData.depositNetwork,
        settleNetwork: shiftData.settleNetwork
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating variable shift:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get available coins and networks
  async getAvailableCoins() {
    try {
      const response = await axios.get(`${this.baseURL}/coins`);
      return response.data;
    } catch (error) {
      console.error('Error getting available coins:', error.message);
      return [];
    }
  }

  // Get available networks
  async getAvailableNetworks() {
    try {
      const response = await axios.get(`${this.baseURL}/networks`);
      return response.data;
    } catch (error) {
      console.error('Error getting available networks:', error.message);
      return [];
    }
  }

  // Get current market rates
  async getMarketRates(fromCoin, toCoin, fromNetwork = null, toNetwork = null) {
    try {
      let url = `${this.baseURL}/markets/${fromCoin}-${fromNetwork || fromCoin}/${toCoin}-${toNetwork || toCoin}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting market rates:', error.message);
      return null;
    }
  }

  // Get shift status
  async getShiftStatus(shiftId) {
    try {
      const response = await axios.get(`${this.baseURL}/shifts/${shiftId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting shift status:', error.message);
      return null;
    }
  }
  
  // Get pre-approval info for a swap (useful for TBA integration)
  async getPreApproval(depositCoin, depositNetwork) {
    try {
      const response = await axios.get(`${this.baseURL}/pre-approvals/${depositCoin}-${depositNetwork}`);
      return response.data;
    } catch (error) {
      console.error('Error getting pre-approval info:', error.message);
      return null;
    }
  }
  
  // Get estimated quote for a swap
  async getQuote(depositCoin, settleCoin, depositNetwork = null, settleNetwork = null, depositAmount) {
    try {
      const params = new URLSearchParams({
        depositCoin,
        settleCoin,
        depositAmount
      });
      
      if (depositNetwork) params.append('depositNetwork', depositNetwork);
      if (settleNetwork) params.append('settleNetwork', settleNetwork);
      
      const response = await axios.get(`${this.baseURL}/quotes?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error getting quote:', error.message);
      return null;
    }
  }
}

module.exports = new SideShiftService();