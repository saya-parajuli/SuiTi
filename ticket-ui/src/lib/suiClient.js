import { SuiClient, getFullnodeUrl } from '@mysten/sui';

export const client = new SuiClient({
  url: getFullnodeUrl('testnet'), // Change to devnet if needed
});
export default client;