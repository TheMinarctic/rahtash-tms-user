import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "@/contexts/AuthContext";
import ShipmentListPage from "./pages/shipments/shipment-list";
import SingleShipment from "./pages/SingleShipment";
import AppProviders from "./providers/AppProviders";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ShipmentDetailPage from "./pages/shipments/shipment-detail";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/shipments" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/shipments"
        element={
          <ProtectedRoute>
            <ShipmentListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipments/:id"
        element={
          <ProtectedRoute>
            {/* <SingleShipment /> */}
            <ShipmentDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </BrowserRouter>
);

export default App;
