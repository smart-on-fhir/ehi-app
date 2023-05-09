import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter } from "react-router-dom";
import { Routes } from "react-router";
import AppWrapper from "./components/AppWrapper";
import App from "./pages/App";
import Launch from "./pages/Launch";
import HomePage from "./pages/HomePage";
import InstitutionSelection from "./pages/InstitutionSelection";
import ExportLaunch from "./pages/ExportLaunch";
import ExportJobList from "./pages/ExportJobList";
import ExportJobViewer from "./pages/ExportJobViewer";
import { SMARTProvider } from "./context/smartContext";
import { InstitutionProvider } from "./context/institutionContext";
import { NotificationProvider } from "./context/notificationContext";
// Necessary for tailwind styles
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <SMARTProvider>
      <InstitutionProvider>
        <NotificationProvider>
          <AppWrapper>
            <Routes>
              <Route path="/admin/jobs/:id" element={<ExportJobViewer />} />
              <Route path="/admin/jobs" element={<ExportJobList />} />
              <Route path="/exportLaunch" element={<ExportLaunch />} />
              <Route path="/launch" element={<Launch />} />
              <Route
                path="/institutionSelection"
                element={<InstitutionSelection />}
              />
              <Route path="/jobs" element={<App />} />
              <Route path="/" element={<HomePage />} />
              <Route element={<b>Not Found</b>} />
            </Routes>
          </AppWrapper>
        </NotificationProvider>
      </InstitutionProvider>
    </SMARTProvider>
  </BrowserRouter>
);
