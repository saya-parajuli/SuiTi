import { useWalletKit } from "@mysten/wallet-adapter-react";
import { TransactionBlock } from "@mysten/sui";
import { useState } from "react";
import { Button } from "../components/ui/button";

function BuyTicket() {
  const { currentAccount, signAndExecuteTransactionBlock, connect, connected } = useWalletKit();
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");

  const handleBuy = async () => {
    if (!connected) {
      await connect();
    }

    if (!eventId) {
      setStatus("❌ Please enter Event Object ID");
      return;
    }

    const txb = new TransactionBlock();

    // 🔁 Replace this with your actual deployed package ID
    const packageId = "0x52fe6637bd1e8611ba44af977b264c4c6ae8f3306efccdc9d2e5a5cdce209edf";

    txb.moveCall({
      target: `${packageId}::ticket_management::buy_ticket`,
      arguments: [txb.object(eventId)],
    });

    try {
      setStatus("📡 Sending transaction...");

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      console.log(result);
      setStatus(`✅ Success! Digest: ${result.digest}`);
    } catch (e) {
      console.error(e);
      setStatus("❌ Failed to buy ticket");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-xl space-y-4 bg-white shadow">
      <h2 className="text-xl font-bold">Buy Ticket 🎟️</h2>

      <input
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        placeholder="Enter Event Object ID"
        className="w-full border p-2 rounded"
      />

      <Button onClick={handleBuy}>
        {connected ? "Buy Ticket" : "Connect Wallet to Buy"}
      </Button>

      {currentAccount && (
        <p className="text-sm text-gray-500">
          Connected: {currentAccount.address}
        </p>
      )}

      <p className="text-sm">{status}</p>
    </div>
  );
}

export default BuyTicket;
/*import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import path from 'path';
*/