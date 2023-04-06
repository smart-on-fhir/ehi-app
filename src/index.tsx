import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter } from "react-router-dom";
import { Routes } from "react-router";
import AppWrapper from "./components/AppWrapper";
import App from "./pages/App";
import Launcher from "./pages/Launcher";
import { SMARTProvider } from "./context";
// Necessary for getting access to tailwind styles
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SMARTProvider>
        <AppWrapper>
          <Routes>
            <Route path="/launch" element={<Launcher />} />
            <Route path="/" element={<App />} />
            <Route element={<b>Not Found</b>} />
          </Routes>
        </AppWrapper>
      </SMARTProvider>
    </BrowserRouter>
  </React.StrictMode>
);
