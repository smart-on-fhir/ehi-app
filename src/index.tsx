import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter } from "react-router-dom";
import { Navigate, Routes } from "react-router";
import AppWrapper from "./components/AppWrapper";
import UserExportJobList from "./pages/UserExportJobList";
import Login from "./pages/Login";
import AccountDetails from "./pages/AccountDetails";
import HomePage from "./pages/HomePage";
import InstitutionSelection from "./pages/InstitutionSelection";
import AdminExportJobList from "./pages/AdminExportJobList";
import FourOhFour from "./pages/404";
import Forbidden from "./pages/Forbidden";
import ExportJobViewer from "./pages/ExportJobViewer";
import AuthCheckWrapper from "./components/AuthCheckWrapper";
import AlreadyAuthedAccountRedirect from "./components/AlreadyAuthedAccountRedirect";
import { AuthProvider } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";
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
                    <UserExportJobList />
                  </AuthCheckWrapper>
                }
              />
              <Route path="admin">
                <Route index element={<Navigate to="/admin/jobs" replace />} />
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
              </Route>
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
        </AppWrapper>
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
);
