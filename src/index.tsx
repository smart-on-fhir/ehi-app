import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter } from "react-router-dom";
import { Navigate, Routes } from "react-router";
import AppWrapper from "./components/AppWrapper";
import App from "./pages/App";
import Login from "./pages/Login";
import Launch from "./pages/Launch";
import HomePage from "./pages/HomePage";
import InstitutionSelection from "./pages/InstitutionSelection";
import ExportLaunch from "./pages/ExportLaunch";
import ExportJobList from "./pages/ExportJobList";
import FourOhFour from "./pages/404";
import ExportJobViewer from "./pages/ExportJobViewer";
import { SMARTProvider } from "./context/smartContext";
import { AuthProvider } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";
// Necessary for tailwind styles
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <SMARTProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppWrapper>
            <Routes>
              <Route path="/">
                <Route index element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="jobs" element={<App />} />
                <Route path="admin">
                  <Route index element={<Navigate to="/admin/jobs" />} />
                  <Route path="jobs">
                    <Route path=":id" element={<ExportJobViewer />} />
                    <Route index path="" element={<ExportJobList />} />
                  </Route>
                </Route>
                <Route path="exportLaunch" element={<ExportLaunch />} />
                <Route path="launch" element={<Launch />} />
                <Route
                  path="institutionSelection"
                  element={<InstitutionSelection />}
                />
              </Route>
              <Route path="*" element={<FourOhFour />} />
            </Routes>
          </AppWrapper>
        </NotificationProvider>
      </AuthProvider>
    </SMARTProvider>
  </BrowserRouter>
);
