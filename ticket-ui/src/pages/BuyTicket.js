// ticket.ui/BuyTicket.js
import React, { useState } from 'react';
import { TransactionBlock } from '@mysten/sui.js/transactions';

function BuyTicket({ suiClient, signAndExecuteTransactionBlock, packageId, eventId, eventName }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleBuyTicket = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageId}::ticket_management::buy_ticket`,
        arguments: [
          tx.object(eventId), // Pass the Event object ID
        ],
      });

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: 'WaitForLocalExecution',
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      console.log('Buy Ticket Transaction Result:', result);
      if (result.effects?.status.status === 'success') {
        // You can parse the events to find the newly created ticket ID if needed
        const newTicketObjectId = result.effects.created?.[0]?.reference.objectId; // Example: assuming the first created object is the ticket
        setSuccess(`Successfully bought a ticket for '${eventName}'! Ticket ID: ${newTicketObjectId}`);
        // You might want to refresh event data to show updated sold_tickets count
      } else {
        setError(`Transaction failed: ${result.effects?.status.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error buying ticket:', err);
      setError(`Failed to buy ticket: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleBuyTicket}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Buying...' : 'Buy Ticket'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
    </div>
  );
}

export default BuyTicket;
/*import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import path from 'path';
*/