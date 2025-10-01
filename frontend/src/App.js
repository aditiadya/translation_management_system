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
import CreateManager from "./pages/Managers/CreateManager/CreateManagerPage";
import ManagersPage from "./pages/Managers/ManagerList/ManagersPage";
import ManagerDetailPage from "./pages/Managers/ManagerDetails/ManagerDetailPage";
import CreateClientPage from "./pages/Clients/CreateClient/CreateClientPage";
import ClientsPage from "./pages/Clients/ClientList/ClientsPage";
import ClientDetailPage from "./pages/Clients/ClientDetails/ClientDetailPage";
import ClientPoolsPage from "./pages/ClientPools/ClientPoolsPage";
import AddClientPoolPage from "./pages/ClientPools/ClientPoolForm";
import ClientPoolDetailsPage from "./pages/ClientPools/ClientPoolDetailPage";
import ServicesPage from "./pages/SystemValues/Services/ServicePage";
import LanguagePairsPage from "./pages/SystemValues/LanguagePairs/LanguagePairsPage";
import SpecializationPage from "./pages/SystemValues/Specialization/SpecializationPage";
import UnitPage from "./pages/SystemValues/Units/UnitPage";
import CurrencyPage from "./pages/SystemValues/Currency/CurrencyPage";
import PaymentMethodPage from "./pages/SystemValues/PaymentMethods/PaymentMethodPage";
import SystemValuesPage from "./pages/SystemValues/SystemValuesPage";

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
        <Route
          path="managers/create-manager"
          element={
            <ProtectedRoute>
              <CreateManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managers"
          element={
            <ProtectedRoute>
              <ManagersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="managers/:id"
          element={
            <ProtectedRoute>
              <ManagerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="clients/create-client"
          element={
            <ProtectedRoute>
              <CreateClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="clients/:id"
          element={
            <ProtectedRoute>
              <ClientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-pools"
          element={
            <ProtectedRoute>
              <ClientPoolsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-client-pool"
          element={
            <ProtectedRoute>
              <AddClientPoolPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="client-pools/:id"
          element={
            <ProtectedRoute>
              <ClientPoolDetailsPage />
            </ProtectedRoute>
          }
        />
          <Route
            path="system-values/services"
            element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/language-pairs"
            element={
              <ProtectedRoute>
                <LanguagePairsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/specializations"
            element={
              <ProtectedRoute>
                <SpecializationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/units"
            element={
              <ProtectedRoute>
                <UnitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/currencies"
            element={
              <ProtectedRoute>
                <CurrencyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/payment-methods"
            element={
              <ProtectedRoute>
                <PaymentMethodPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values"
            element={
              <ProtectedRoute>
                <SystemValuesPage />
              </ProtectedRoute>
            }
          />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
