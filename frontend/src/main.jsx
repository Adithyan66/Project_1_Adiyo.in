import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import App from "./App.jsx";

import store from "./store";
import { Provider } from "react-redux";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID



createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <PayPalScriptProvider options={{
            "client-id": PAYPAL_CLIENT_ID,
            currency: "USD",
            intent: "capture"
        }}>
            <Provider store={store}>
                <App />
            </Provider>
        </PayPalScriptProvider>
    </BrowserRouter >
);

