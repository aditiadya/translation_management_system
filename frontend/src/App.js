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

import CreateVendorPage from "./pages/Vendors/CreateVendor/CreateVendorPage";
import VendorsPage from "./pages/Vendors/VendorList/VendorsPage";
import VendorDetailPage from "./pages/Vendors/VendorDetails/VendorDetailPage";

import MainLayout from "./components/Sidebar/MainLayout";

import ProjectsPage  from "./pages/Projects/ProjectList/ProjectsPage";
import CreateProjectPage from "./pages/Projects/CreateProject/CreateProjectPage";
import ProjectDetailPage from "./pages/Projects/ProjectDetails/ProjectDetailPage";
import CreateFlatRateReceivablePage from "./pages/Projects/ProjectDetails/Finances/CreateFlatRateReceivablePage"
import CreateUnitBasedReceivablePage from "./pages/Projects/ProjectDetails/Finances/UniBasedReceivablePage"
import CreateJobsPage from "./pages/Projects/ProjectDetails/Jobs/CreateJobsPage";
import JobsPage from "./pages/Jobs/JobsPage";
import JobDetailPage from "./pages/Projects/ProjectDetails/Jobs/JobDetails/JobDetailPage"
import EditProjectDetails from "./pages/Projects/ProjectDetails/Details/EditProjectDetails"
import EditFlatRateReceivable from "./pages/Projects/ProjectDetails/Finances/EditFlatRateReceivable";
import EditUnitBasedReceivablePage from "./pages/Projects/ProjectDetails/Finances/EditUnitBasedReceivable";

import CreateFlatRatePayablePage from "./pages/Projects/ProjectDetails/Jobs/PayableToVendors/CreateFlatRatePayablePage"
import UnitBasedPayablePage from "./pages/Projects/ProjectDetails/Jobs/PayableToVendors/UniBasedPayablePage"
import EditFlatRatePayable from "./pages/Projects/ProjectDetails/Jobs/PayableToVendors/EditFlatRatePayable";
import EditUnitBasedPayablePage from "./pages/Projects/ProjectDetails/Jobs/PayableToVendors/EditUnitBasedPayable";



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
        <Route element={<MainLayout />}>
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
          <Route
            path="vendors/create-vendor"
            element={
              <ProtectedRoute>
                <CreateVendorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute>
                <VendorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute>
                <VendorDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/create-project"
            element={
              <ProtectedRoute>
                <CreateProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="/project/edit/:id" element={<EditProjectDetails />} />
          
          <Route path="/project/:id/new-flat-rate-receivable" element={<CreateFlatRateReceivablePage />} />
          <Route path="/project/:id/new-unit-based-receivable" element={<CreateUnitBasedReceivablePage />} />
          {/* <Route path="/project/:id/new-cat-log" element={<CreateCATLogPage />} /> */}
          <Route path="/project/:id/edit-flat-rate-receivable/:receivableId" element={<EditFlatRateReceivable />} />
          <Route path="/project/:id/edit-unit-based-receivable/:receivableId" element={<EditUnitBasedReceivablePage />} />


          <Route path="/project/:id/job/:jobId/new-flat-rate-receivable" element={<CreateFlatRatePayablePage />} />
          <Route path="/project/:id/job/:jobId/new-unit-based-receivable" element={<UnitBasedPayablePage />} />
          {/* <Route path="/project/:id/job/:jobId/:id/new-cat-log" element={<CreateCATLogPage />} /> */}
          <Route path="/project/:id/job/:jobId/edit-flat-rate-receivable/:payableId" element={<EditFlatRatePayable />} />
          <Route path="/project/:id/job/:jobId/edit-unit-based-receivable/:payableId" element={<EditUnitBasedPayablePage />} />


          <Route path="/project/:id/create-job" element={<CreateJobsPage />} />

           <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/project/:id/job/:jobId"
            element={
              <ProtectedRoute>
                <JobDetailPage />
              </ProtectedRoute>
            }
          />

          </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;