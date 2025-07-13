// ticket.ui/DeleteTicket.js
import React, { useState } from 'react';
import { TransactionBlock } from '@mysten/sui.js/transactions';

function DeleteTicket({ suiClient, signAndExecuteTransactionBlock, packageId, ticketId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDeleteTicket = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Confirmation dialog (optional but recommended for destructive actions)
    if (!window.confirm(`Are you sure you want to delete ticket ${ticketId}? This action cannot be undone.`)) {
      setLoading(false);
      return;
    }

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageId}::ticket_management::delete_ticket`,
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

      console.log('Delete Ticket Transaction Result:', result);
      if (result.effects?.status.status === 'success') {
        setSuccess(`Ticket ${ticketId} deleted successfully!`);
        onSuccess(); // Call the callback to refresh App.jsx data
      } else {
        setError(`Transaction failed: ${result.effects?.status.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError(`Failed to delete ticket: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleDeleteTicket}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full"
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Ticket'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
    </div>
  );
}

export default DeleteTicket;