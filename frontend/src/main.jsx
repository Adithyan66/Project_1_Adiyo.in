import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import store from "./store";
import { Provider } from "react-redux";



createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);