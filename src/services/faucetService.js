// ZRT Token XRPL Testnet Faucet Service
import * as xrpl from 'xrpl';

class FaucetService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    
    // Faucet Admin / Issuer accounts
    this.issuerWallet = null;      // Wallet that issued the ZRT tokens
    this.faucetWallet = null;      // Wallet that holds and distributes ZRT
    
    this.tokenCode = 'ZRT';
    this.listeners = [];
    this.claimsHistory = [];
    
    this.balances = {
      issuerXrp: '0.00',
      faucetXrp: '0.00',
      faucetZrt: '0.00'
    };

    this.simulationMode = false;
  }

  async connect() {
    if (this.client && this.client.isConnected()) {
      return true;
    }

    try {
      this.client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
      await this.client.connect();
      this.isConnected = true;
      this.simulationMode = false;
      console.log("Faucet connected to XRPL Testnet WS");
      return true;
    } catch (e) {
      console.warn("XRPL connection failed, running in simulation mode:", e.message);
      this.isConnected = true;
      this.simulationMode = true;
      return true;
    }
  }

  // Set up the Faucet accounts (Issuer & Distributor)
  async setupFaucetAccounts() {
    await this.connect();

    if (this.simulationMode) {
      this.balances = {
        issuerXrp: '10000.00',
        faucetXrp: '4850.00',
        faucetZrt: '1000000.00'
      };
      return;
    }

    try {
      // 1. Generate & fund Issuer
      console.log("Setting up Faucet Issuer wallet...");
      const issuer = xrpl.Wallet.generate();
      await this.client.fundWallet(issuer);
      this.issuerWallet = issuer;

      // 2. Generate & fund Distributor/Faucet wallet
      console.log("Setting up Faucet Distributor wallet...");
      const faucet = xrpl.Wallet.generate();
      await this.client.fundWallet(faucet);
      this.faucetWallet = faucet;

      // 3. Create trustline from Distributor to Issuer for ZRT
      console.log("Creating Trustline for ZRT...");
      const trustSetTx = {
        TransactionType: "TrustSet",
        Account: this.faucetWallet.address,
        LimitAmount: {
          currency: this.tokenCode,
          issuer: this.issuerWallet.address,
          value: "10000000" // 10 million ZRT limit
        }
      };
      await this.client.submitAndWait(trustSetTx, { wallet: this.faucetWallet });

      // 4. Issue ZRT tokens from Issuer to Faucet
      console.log("Issuing ZRT tokens...");
      const sendTokensTx = {
        TransactionType: "Payment",
        Account: this.issuerWallet.address,
        Destination: this.faucetWallet.address,
        Amount: {
          currency: this.tokenCode,
          issuer: this.issuerWallet.address,
          value: "5000000" // Issue 5 million ZRT
        }
      };
      await this.client.submitAndWait(sendTokensTx, { wallet: this.issuerWallet });

      await this.updateBalances();
      console.log("ZRT Faucet fully initialized on-chain!");
    } catch (err) {
      console.error("Failed to initialize on-chain faucet, falling back to simulation:", err);
      this.simulationMode = true;
      this.balances = {
        issuerXrp: '10000.00',
        faucetXrp: '4850.00',
        faucetZrt: '5000000.00'
      };
    }
  }

  async updateBalances() {
    if (this.simulationMode || !this.client || !this.client.isConnected()) return;

    try {
      if (this.issuerWallet) {
        const xrp = await this.client.getXrpBalance(this.issuerWallet.address);
        this.balances.issuerXrp = parseFloat(xrp).toFixed(2);
      }
      if (this.faucetWallet) {
        const xrp = await this.client.getXrpBalance(this.faucetWallet.address);
        this.balances.faucetXrp = parseFloat(xrp).toFixed(2);

        // Fetch ZRT balance
        const lines = await this.client.request({
          command: "account_lines",
          account: this.faucetWallet.address
        });
        const zrtLine = lines.result.lines.find(l => l.currency === this.tokenCode);
        this.balances.faucetZrt = zrtLine ? parseFloat(zrtLine.balance).toFixed(2) : '0.00';
      }
      this.notifyListeners({ type: 'BALANCES_UPDATED' });
    } catch (e) {
      console.warn("Error updating faucet balances:", e);
    }
  }

  // Topup a recipient's address with ZRT tokens
  async topupAddress(recipientAddress, amount = "100") {
    await this.connect();

    const timestamp = new Date().toLocaleTimeString();

    if (this.simulationMode) {
      // Simulate delay
      await new Promise(r => setTimeout(r, 1500));
      
      const txHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      const newClaim = {
        hash: txHash,
        recipient: recipientAddress,
        amount: `${amount} ${this.tokenCode}`,
        timestamp,
        status: 'SUCCESS'
      };
      
      this.balances.faucetZrt = (parseFloat(this.balances.faucetZrt) - parseFloat(amount)).toFixed(2);
      this.claimsHistory.unshift(newClaim);
      this.notifyListeners({ type: 'CLAIM_RECORDED', claim: newClaim });
      return newClaim;
    }

    try {
      console.log(`Submitting ZRT transfer of ${amount} to ${recipientAddress}...`);
      
      const paymentTx = {
        TransactionType: "Payment",
        Account: this.faucetWallet.address,
        Destination: recipientAddress,
        Amount: {
          currency: this.tokenCode,
          issuer: this.issuerWallet.address,
          value: amount.toString()
        }
      };

      const response = await this.client.submitAndWait(paymentTx, { wallet: this.faucetWallet });
      const result = response.result.meta.TransactionResult;
      
      if (result === "tesSUCCESS") {
        const newClaim = {
          hash: response.result.hash,
          recipient: recipientAddress,
          amount: `${amount} ${this.tokenCode}`,
          timestamp,
          status: 'SUCCESS'
        };

        this.claimsHistory.unshift(newClaim);
        await this.updateBalances();
        this.notifyListeners({ type: 'CLAIM_RECORDED', claim: newClaim });
        return newClaim;
      } else {
        throw new Error(`Transaction failed: ${result}`);
      }
    } catch (e) {
      console.error("Top-up failed:", e.message);
      
      // Return details of error
      return {
        status: 'FAILED',
        error: e.message
      };
    }
  }

  // Help user configure trustline (for test wallets generated inside app)
  async setupUserTrustline(userWallet) {
    if (this.simulationMode) return true;

    try {
      console.log(`Creating trustline for user ${userWallet.address} to Issuer ${this.issuerWallet.address}...`);
      const trustSetTx = {
        TransactionType: "TrustSet",
        Account: userWallet.address,
        LimitAmount: {
          currency: this.tokenCode,
          issuer: this.issuerWallet.address,
          value: "100000" // Limit 100k ZRT
        }
      };
      
      await this.client.submitAndWait(trustSetTx, { wallet: userWallet });
      return true;
    } catch (err) {
      console.warn("Failed to set up user trustline:", err);
      return false;
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(data) {
    this.listeners.forEach(cb => cb(data));
  }
}

export const faucetService = new FaucetService();
