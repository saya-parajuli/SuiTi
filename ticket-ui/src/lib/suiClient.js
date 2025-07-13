// ticket.ui/suiClient.js

import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { MIST_PER_SUI } from '@mysten/sui.js/utils'; // Useful for SUI calculations

// Configure your network. Use 'devnet' for development.
const network = 'testnet'; // or 'testnet', 'mainnet'

// Initialize the SuiClient
export const suiClient = new SuiClient({ url: getFullnodeUrl(network) });

// Example for a signer (usually handled by a wallet like Sui Wallet)
// For local testing without a wallet, you might create a keypair.
// In a real DApp, users will connect their wallets.
// export const adminKeypair = Ed25519Keypair.generate(); // For demonstration, never hardcode private keys!

console.log(`Connected to Sui ${network} network.`);