import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/Homepage";
import AdminRegisteration from "./pages/AdminRegisteration/AdminRegisteration";
import LoginPage from "./pages/AdminLogin/AdminLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import SetupWizardPage from "./pages/SetupWizard/SetupWizardPage";
import AccountActivation from "./pages/AccountActivation/AccountActivation";
import VendorActivation from "./pages/VendorActivation/VendorActivation";
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

import VendorTendersPage from "./pages/Vendor/VendorTendersPage";
import VendorReceivablesPage from "./pages/Vendor/VendorReceivablesPage";
import VendorInvoicesPage from "./pages/Vendor/VendorInvoicesPage";
import VendorPaymentsPage from "./pages/Vendor/VendorPaymentsPage";
import { ADMIN, ADMIN_AND_MANAGERS, VENDOR, ALL_STAFF } from "./utils/constants/roles";



const App = () => (
  <AuthProvider>
    <Router>
      <Routes>  
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<AdminRegisteration />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account-activation/:token" element={<AccountActivation />} />
        <Route path="/vendor/activate/:token" element={<VendorActivation />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={ALL_STAFF}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup"
          element={
            <ProtectedRoute allowedRoles={ADMIN}>
              <SetupWizardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="managers/create-manager"
          element={
            <ProtectedRoute allowedRoles={ADMIN}>
              <CreateManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managers"
          element={
            <ProtectedRoute allowedRoles={ADMIN}>
              <ManagersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="managers/:id"
          element={
            <ProtectedRoute allowedRoles={ADMIN}>
              <ManagerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="clients/create-client"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <CreateClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="clients/:id"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <ClientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-pools"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <ClientPoolsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-client-pool"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <AddClientPoolPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="client-pools/:id"
          element={
            <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
              <ClientPoolDetailsPage />
            </ProtectedRoute>
          }
        />
          <Route
            path="system-values/services"
            element={
              <ProtectedRoute allowedRoles={ADMIN}>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/language-pairs"
            element={
              <ProtectedRoute allowedRoles={ADMIN}>
                <LanguagePairsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/specializations"
            element={
              <ProtectedRoute allowedRoles={ADMIN}>
                <SpecializationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/units"
            element={
              <ProtectedRoute allowedRoles={ADMIN}>
                <UnitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/currencies"
            element={
              <ProtectedRoute allowedRoles={ADMIN}>
                <CurrencyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values/payment-methods"
            element={
              <ProtectedRoute allowedRoles={ADMIN}>
                <PaymentMethodPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-values"
            element={
              <ProtectedRoute allowedRoles={ADMIN}>
                <SystemValuesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="vendors/create-vendor"
            element={
              <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
                <CreateVendorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
                <VendorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
                <VendorDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/create-project"
            element={
              <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
                <CreateProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="/project/edit/:id" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><EditProjectDetails /></ProtectedRoute>} />
          
          <Route path="/project/:id/new-flat-rate-receivable" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><CreateFlatRateReceivablePage /></ProtectedRoute>} />
          <Route path="/project/:id/new-unit-based-receivable" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><CreateUnitBasedReceivablePage /></ProtectedRoute>} />
          {/* <Route path="/project/:id/new-cat-log" element={<CreateCATLogPage />} /> */}
          <Route path="/project/:id/edit-flat-rate-receivable/:receivableId" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><EditFlatRateReceivable /></ProtectedRoute>} />
          <Route path="/project/:id/edit-unit-based-receivable/:receivableId" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><EditUnitBasedReceivablePage /></ProtectedRoute>} />


          <Route path="/project/:id/job/:jobId/new-flat-rate-receivable" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><CreateFlatRatePayablePage /></ProtectedRoute>} />
          <Route path="/project/:id/job/:jobId/new-unit-based-receivable" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><UnitBasedPayablePage /></ProtectedRoute>} />
          {/* <Route path="/project/:id/job/:jobId/:id/new-cat-log" element={<CreateCATLogPage />} /> */}
          <Route path="/project/:id/job/:jobId/edit-flat-rate-receivable/:payableId" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><EditFlatRatePayable /></ProtectedRoute>} />
          <Route path="/project/:id/job/:jobId/edit-unit-based-receivable/:payableId" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><EditUnitBasedPayablePage /></ProtectedRoute>} />


          <Route path="/project/:id/create-job" element={<ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}><CreateJobsPage /></ProtectedRoute>} />

           <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={ALL_STAFF}>
                <JobsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/project/:id/job/:jobId"
            element={
              <ProtectedRoute allowedRoles={ADMIN_AND_MANAGERS}>
                <JobDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="/vendor/tenders" element={<ProtectedRoute allowedRoles={VENDOR}><VendorTendersPage /></ProtectedRoute>} />
          <Route path="/vendor/receivables" element={<ProtectedRoute allowedRoles={VENDOR}><VendorReceivablesPage /></ProtectedRoute>} />
          <Route path="/vendor/invoices" element={<ProtectedRoute allowedRoles={VENDOR}><VendorInvoicesPage /></ProtectedRoute>} />
          <Route path="/vendor/payments" element={<ProtectedRoute allowedRoles={VENDOR}><VendorPaymentsPage /></ProtectedRoute>} />

          </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;