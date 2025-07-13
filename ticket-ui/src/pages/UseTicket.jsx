// ticket.ui/UseTicket.js
import React, { useState } from 'react';
import { TransactionBlock } from '@mysten/sui/transactions';

function UseTicket({ suiClient, signAndExecuteTransactionBlock, packageId, ticketId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUseTicket = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageId}::ticket_management::use_ticket`,
        arguments: [
          tx.object(ticketId), // Pass the Ticket object ID
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

      console.log('Use Ticket Transaction Result:', result);
      if (result.effects?.status.status === 'success') {
        setSuccess(`Ticket ${ticketId} marked as used!`);
        onSuccess(); // Call the callback to refresh App.jsx data
      } else {
        setError(`Transaction failed: ${result.effects?.status.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error using ticket:', err);
      setError(`Failed to use ticket: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleUseTicket}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full"
        disabled={loading}
      >
        {loading ? 'Using...' : 'Use Ticket'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
    </div>
  );
}

export default UseTicket;