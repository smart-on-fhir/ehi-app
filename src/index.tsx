import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter } from "react-router-dom";
import { Routes } from "react-router";
import AppWrapper from "./components/AppWrapper";
import App from "./pages/App";
import Launch from "./pages/Launch";
import InstitutionSelection from "./pages/InstitutionSelection";
import ExportLaunch from "./pages/ExportLaunch";
import { SMARTProvider } from "./context/smartContext";
import { InstitutionProvider } from "./context/institutionContext";
// Necessary for getting access to tailwind styles
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SMARTProvider>
        <InstitutionProvider>
          <AppWrapper>
            <Routes>
              <Route path="/exportLaunch" element={<ExportLaunch />} />
              <Route path="/launch" element={<Launch />} />
              <Route
                path="/institutionSelection"
                element={<InstitutionSelection />}
              />
              <Route path="/" element={<App />} />
              <Route element={<b>Not Found</b>} />
            </Routes>
          </AppWrapper>
        </InstitutionProvider>
      </SMARTProvider>
    </BrowserRouter>
  </React.StrictMode>
);
