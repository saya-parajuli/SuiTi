// ticket.ui/CreateEvent.js
import React, { useState } from 'react';
import { TransactionBlock } from '@mysten/sui/transactions';

function CreateEvent({ suiClient, signAndExecuteTransactionBlock, packageId, adminCapId }) {
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!eventName.trim()) {
      setError("Event name cannot be empty.");
      setLoading(false);
      return;
    }

    if (!adminCapId) {
      setError("AdminCap object ID is required to create an event. Ensure your wallet holds it.");
      setLoading(false);
      return;
    }

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageId}::ticket_management::create_event`,
        arguments: [
          tx.object(adminCapId), // Pass the AdminCap object ID
          tx.pure.string(eventName),
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

      console.log('Create Event Transaction Result:', result);
      if (result.effects?.status.status === 'success') {
        setSuccess(`Event '${eventName}' created successfully!`);
        setEventName('');
        // You might want to refresh the event list in App.jsx here
      } else {
        setError(`Transaction failed: ${result.effects?.status.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error creating event:', err);
      setError(`Failed to create event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateEvent} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="eventName" className="block text-gray-700 text-sm font-bold mb-2">
          Event Name:
        </label>
        <input
          type="text"
          id="eventName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
    </form>
  );
}

export default CreateEvent;