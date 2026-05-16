import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import MarketTable from "./components/MarketTable";
import Portfolio from "./components/Portfolio";
import Watchlist from "./components/Watchlist";
import Orders from "./components/Orders";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationToast from "./components/NotificationToast";
import { Login, Signup, RequestReset, ResetPassword, ChangePassword, Verify2FA, LoginOTP } from "./components/Login";
import { SecurityDashboard } from "./components/SecurityDashboard";
import MutualFunds from "./components/MutualFunds";
import Profile from "./components/Profile";

import { PaymentProvider } from "./context/PaymentContext";
import { SnackbarProvider } from "notistack";
import CheckoutPage from "./pages/CheckoutPage";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#000]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PaymentProvider>
          <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
              <NotificationToast />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/request-reset" element={<RequestReset />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/verify-2fa" element={<Verify2FA />} />
                <Route path="/login-otp" element={<LoginOTP />} />
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div className="space-y-8">
                          <div className="flex justify-between items-center">
                            <div>
                              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                              <p className="text-white/50">Here's what's happening with your investments today.</p>
                            </div>
                          </div>
                          <MarketTable />
                        </div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/portfolio"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Portfolio />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/watchlist"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Watchlist />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Orders />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
                          <h2 className="text-2xl font-bold text-white mb-2">Financial Reports</h2>
                          <p className="text-white/50">Monthly and annual statements are available for download.</p>
                        </div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/stocks"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MarketTable />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/security"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <SecurityDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/mutual-funds"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MutualFunds />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <CheckoutPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Profile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </PaymentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
