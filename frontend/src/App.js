import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/Homepage";
import AdminRegisteration from "./pages/AdminRegisteration/AdminRegisteration";
import LoginPage from "./pages/AdminLogin/AdminLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<AdminRegisteration />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
