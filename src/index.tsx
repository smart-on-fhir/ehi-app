import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter } from "react-router-dom";
import { Routes } from "react-router";
import AppWrapper from "./components/layout/AppWrapper";
import PatientExportJobList from "./pages/PatientExportJobList";
import Login from "./pages/Login";
import AccountDetails from "./pages/AccountDetails";
import HomePage from "./pages/HomePage";
import InstitutionSelection from "./pages/InstitutionSelection";
import AdminExportJobList from "./pages/AdminExportJobList";
import FourOhFour from "./pages/404";
import Forbidden from "./pages/Forbidden";
import ExportJobViewer from "./pages/ExportJobViewer";
import AuthCheckWrapper from "./components/routing/AuthCheckWrapper";
import AlreadyAuthedAccountRedirect from "./components/routing/AlreadyAuthedAccountRedirect";
import { AuthProvider } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";
import NotificationContainer from "./components/generic/NotificationContainer";
// Necessary for tailwind styles
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <AppWrapper>
          <Routes>
            {/* Admin paths */}
            <Route path="/admin">
              <Route index element={<HomePage />} />
              <Route
                path="login"
                // If we're already logged in, bring us to another page
                element={
                  <AlreadyAuthedAccountRedirect>
                    <Login />
                  </AlreadyAuthedAccountRedirect>
                }
              />
              <Route
                path="account"
                element={
                  <AuthCheckWrapper>
                    <AccountDetails />
                  </AuthCheckWrapper>
                }
              />
              <Route path="jobs">
                <Route
                  index
                  element={
                    <AuthCheckWrapper needsAdmin>
                      <AdminExportJobList />
                    </AuthCheckWrapper>
                  }
                />
                <Route
                  path=":id"
                  element={
                    <AuthCheckWrapper needsAdmin>
                      <ExportJobViewer />
                    </AuthCheckWrapper>
                  }
                />
              </Route>
              <Route
                path="institutionSelection"
                element={
                  <AuthCheckWrapper>
                    <InstitutionSelection />
                  </AuthCheckWrapper>
                }
              />
              <Route path="forbidden" element={<Forbidden />} />
            </Route>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route
                path="login"
                // If we're already logged in, bring us to another page
                element={
                  <AlreadyAuthedAccountRedirect>
                    <Login />
                  </AlreadyAuthedAccountRedirect>
                }
              />
              <Route
                path="account"
                element={
                  <AuthCheckWrapper>
                    <AccountDetails />
                  </AuthCheckWrapper>
                }
              />
              <Route
                path="jobs"
                element={
                  <AuthCheckWrapper>
                    <PatientExportJobList />
                  </AuthCheckWrapper>
                }
              />
              <Route
                path="institutionSelection"
                element={
                  <AuthCheckWrapper>
                    <InstitutionSelection />
                  </AuthCheckWrapper>
                }
              />
            </Route>
            <Route path="forbidden" element={<Forbidden />} />
            <Route path="*" element={<FourOhFour />} />
          </Routes>
          <NotificationContainer />
        </AppWrapper>
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
);
