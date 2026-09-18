import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  return (
    <Routes>

      {/* Default */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* Public Routes */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* Farmer Route */}

      <Route
        path="/farmer"
        element={
          <ProtectedRoute
            allowedRole="FARMER"
          >
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />


      {/* Admin Route */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRole="ADMIN"
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* Unknown URL */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;