import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/Homepage";
import AdminRegisteration from "./pages/AdminRegisteration/AdminRegisteration";
import LoginPage from "./pages/AdminLogin/AdminLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import SetupWizardPage from "./pages/SetupWizard/SetupWizardPage";
import AccountActivation from "./pages/AccountActivation/AccountActivation";
import AdminProfile from "./pages/Profile/adminProfile";
import RequestReset from "./pages/AdminLogin/ForgotPassword/requestReset";
import ResetPassword from "./pages/AdminLogin/ForgotPassword/resetPassword";
import ChangePassword from "./pages/Profile/ChangePasswordPage";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<AdminRegisteration />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account-activation/:token" element={<AccountActivation />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <SetupWizardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
