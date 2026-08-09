import React, { useState } from 'react';
import { Code2, Copy, CheckCircle2, Terminal, Layers } from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function RecruiterCodeShowcase() {
  const [activeTab, setActiveTab] = useState('faucetService');
  const [copied, setCopied] = useState(false);

  const snippets = {
    faucetService: {
      title: 'faucetService.js (XRPL Native & EVM Faucet Architecture)',
      code: `// Real XRPL Testnet Payment & MetaMask EVM Sidechain Integration
import * as xrpl from 'xrpl';

export async function topupAddress(recipientAddress, amount = "100") {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  const paymentTx = {
    TransactionType: "Payment",
    Account: faucetWallet.address,
    Destination: recipientAddress,
    Amount: {
      currency: "ZRT",
      issuer: issuerWallet.address,
      value: amount.toString()
    }
  };

  const response = await client.submitAndWait(paymentTx, { wallet: faucetWallet });
  return response.result.meta.TransactionResult === "tesSUCCESS";
}`
    },
    metaMaskConnect: {
      title: 'MetaMask Network Switcher (Chain ID 0x161c28 / 1449000)',
      code: `// Auto-switch / Add XRPL EVM Sidechain Testnet to MetaMask
export async function connectMetaMask() {
  const chainIdHex = '0x161c28'; // 1449000 decimal
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }]
    });
  } catch (err) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: chainIdHex,
        chainName: 'XRPL EVM Sidechain Testnet',
        rpcUrls: ['https://rpc.testnet.xrplevm.org'],
        nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 18 }
      }]
    });
  }
}`
    },
    foundryDeploy: {
      title: 'Foundry Deployment Script (Deploy.s.sol)',
      code: `// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {Script} from "forge-std/Script.sol";
import {ISRNetwork} from "../src/ISRNetwork.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        ISRNetwork isr = new ISRNetwork();
        isr.createWellfield("Wellfield Alpha", "Texas Plains, USA", 700);
        vm.stopBroadcast();
    }
}`
    }
  };

  const currentSnippet = snippets[activeTab];

  const handleCopy = () => {
    soundEffects.playClick(1000);
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-4 mb-4 font-hud border-purple-500/30">
      <div className="flex items-center justify-between border-b border-purple-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold font-heading text-white tracking-wider">
            RECRUITER CODE INSPECTOR & ARCHITECTURE SNIPPETS
          </h2>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-purple-300 bg-purple-950 border border-purple-500/40 px-3 py-1 rounded font-bold hover:bg-purple-500 hover:text-black cursor-pointer flex items-center gap-1.5"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'COPIED TO CLIPBOARD' : 'COPY CODE SNIPPET'}
        </button>
      </div>

      <div className="flex gap-2 mb-3 font-mono text-xs">
        {Object.keys(snippets).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`p-2 rounded border text-center font-bold cursor-pointer capitalize ${
              activeTab === key
                ? 'bg-purple-950 border-purple-500 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {key.replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      <div className="bg-slate-950 p-4 rounded border border-slate-850 font-mono text-xs overflow-x-auto text-purple-200 leading-relaxed">
        <div className="text-slate-500 text-[10px] mb-2 border-b border-slate-850 pb-1">
          // {currentSnippet.title}
        </div>
        <pre>{currentSnippet.code}</pre>
      </div>
    </div>
  );
}
