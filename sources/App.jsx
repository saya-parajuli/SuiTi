// App.jsx
import React, { useState, useEffect } from 'react';
import { useSuiClient, useWallet } from '@mysten/wallet-kit';
// D:/sui/my_first_move_project/ticket-ui/src/App.jsx
import { WalletKitProvider } from "@mysten/wallet-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import BuyTicket from "./pages/BuyTicket.jsx"; // <--- Corrected path
import CreateEvent from "./pages/CreateEvent.jsx"; // <--- Corrected path
import UseTicket from "./pages/UseTicket.jsx"; // <--- Corrected path
import DeleteTicket from './pages/DeleteTicket.jsx'; // New import

const NETWORK = 'testnet'; 
const PACKAGE_ID = "0x4c7615b4fec5974860a6b3d10ee9032d3fbac9dbf8c83bf060437fe87bbe9904"; 
const ADMIN_CAP_OBJECT_ID = "0xeb3a2628fd871a6cc4e23b658a548b97b4c372ef51bb933b95cfc6de100e897f";  
function AppContent() {
  const { connected, account, signAndExecuteTransactionBlock } = useWallet();
  const suiClient = useSuiClient();

  const [events, setEvents] = useState([]);
  const [ownedTickets, setOwnedTickets] = useState([]); // New state for owned tickets

  // Function to fetch all shared Event objects
  const fetchEvents = async () => {
    if (!suiClient) return;
    try {
      const { data } = await suiClient.getObjects({
        filter: {
          StructType: `${PACKAGE_ID}::my_first_move_project::Event`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });
      const fetchedEvents = data.map(obj => ({
        id: obj.data.objectId,
        name: obj.data.content.fields.event_name,
        soldTicketsCount: obj.data.content.fields.sold_tickets.length,
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Function to fetch tickets owned by the connected wallet
  const fetchOwnedTickets = async () => {
    if (!suiClient || !account?.address) {
      setOwnedTickets([]); // Clear tickets if not connected
      return;
    }
    try {
      const { data } = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${PACKAGE_ID}::my_first_move_project::Ticket`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });
      const fetchedTickets = data
        .filter(obj => obj.data?.content?.fields?.is_used !== undefined) // Filter out incomplete data
        .map(obj => ({
          id: obj.data.objectId,
          eventId: obj.data.content.fields.event_id,
          ticketNumber: obj.data.content.fields.ticket_number,
          isUsed: obj.data.content.fields.is_used,
        }));
      setOwnedTickets(fetchedTickets);
    } catch (error) {
      console.error("Error fetching owned tickets:", error);
      setOwnedTickets([]);
    }
  };


  useEffect(() => {
    fetchEvents();
    // Re-fetch events if the client changes (e.g., network switch)
  }, [suiClient]);

  useEffect(() => {
    fetchOwnedTickets();
    // Re-fetch owned tickets if client or account changes
  }, [suiClient, account?.address]);


  // Callback function to re-fetch data after a transaction
  const handleTransactionSuccess = () => {
    fetchEvents(); // Refresh events (e.g., after buying a ticket)
    fetchOwnedTickets(); // Refresh owned tickets (e.g., after buying, using, or deleting)
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sui Ticket DApp</h1>
        <w3m-button />
      </header>

      {!connected && (
        <div className="text-center text-lg text-gray-600">
          Please connect your wallet to interact with the DApp.
        </div>
      )}

      {connected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Create New Event</h2>
            <CreateEvent
              suiClient={suiClient}
              signAndExecuteTransactionBlock={signAndExecuteTransactionBlock}
              packageId={PACKAGE_ID}
              adminCapId={ADMIN_CAP_OBJECT_ID}
              onSuccess={handleTransactionSuccess} // Pass callback
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Events</h2>
            {events.length === 0 ? (
              <p>No events found. Be the first to create one!</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                    <p className="text-gray-600 mb-4">Tickets Sold: {event.soldTicketsCount}</p>
                    <BuyTicket
                      suiClient={suiClient}
                      signAndExecuteTransactionBlock={signAndExecuteTransactionBlock}
                      packageId={PACKAGE_ID}
                      eventId={event.id}
                      eventName={event.name}
                      onSuccess={handleTransactionSuccess} // Pass callback
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Section for Owned Tickets */}
          <div className="md:col-span-2"> {/* Span full width */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 mt-8">My Tickets</h2>
            {ownedTickets.length === 0 ? (
              <p>You don't own any tickets yet. Buy one from an event above!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white p-6 rounded-lg shadow-md border" style={{ borderColor: ticket.isUsed ? '#fca5a5' : '#a7f3d0' }}>
                    <h3 className="text-xl font-bold text-gray-900">Ticket #{ticket.ticketNumber}</h3>
                    <p className="text-gray-600">Ticket ID: {ticket.id}</p>
                    <p className="text-gray-600">Event ID: {ticket.eventId}</p>
                    <p className={`font-semibold ${ticket.isUsed ? 'text-red-600' : 'text-green-600'}`}>
                      Status: {ticket.isUsed ? 'Used' : 'Unused'}
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      {!ticket.isUsed && (
                        <UseTicket
                          suiClient={suiClient}
                          signAndExecuteTransactionBlock={signAndExecuteTransactionBlock}
                          packageId={PACKAGE_ID}
                          ticketId={ticket.id}
                          onSuccess={handleTransactionSuccess} // Pass callback
                        />
                      )}
                      <DeleteTicket
                        suiClient={suiClient}
                        signAndExecuteTransactionBlock={signAndExecuteTransactionBlock}
                        packageId={PACKAGE_ID}
                        ticketId={ticket.id}
                        onSuccess={handleTransactionSuccess} // Pass callback
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const networks = {
    [NETWORK]: { url: getFullnodeUrl(NETWORK) },
  };

  return (
    <WalletKitProvider networks={networks}>
      <AppContent />
    </WalletKitProvider>
  );
}

export default App;
