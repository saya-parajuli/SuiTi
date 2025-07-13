import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import {
  SuiWalletProvider,
  createWalletKitCore,
} from "@mysten/wallet-adapter-react";

const walletKit = createWalletKitCore();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SuiWalletProvider wallets={walletKit.getWallets()}>
      <App />
    </SuiWalletProvider>
  </React.StrictMode>
);


