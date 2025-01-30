import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import POS from "../pages/sales/POS";
import Orders from "../pages/sales/Orders";
import Products from "../pages/inventory/Products";
import Suppliers from "../pages/inventory/Suppliers";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Register from "../pages/Register";
import Purchase from "../pages/Purchase";
import Layout from "@/components/Layout";
import Customers from "@/pages/Customers";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";
import Categories from "../pages/inventory/Categories";
import Brands from "../pages/inventory/Brands";
import Units from "../pages/inventory/Units";
import Sizes from "../pages/inventory/Sizes";
import Colors from "../pages/inventory/Colors";

const AppRoutes = () => {
  const { isLoadingProfile } = useAuth();

  if (isLoadingProfile) {
    return (
      <div className="w-full flex justify-center items-center h-screen bg-white">
        <Spinner color="#32cd32" size="40px" />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Sales Routes */}
        <Route path="sales">
          <Route path="pos" element={<POS />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* Inventory Routes */}
        <Route path="inventory">
          <Route path="products" element={<Products />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="units" element={<Units />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="colors" element={<Colors />} />
        </Route>

        {/* Other Routes */}
        <Route path="customers" element={<Customers />} />
        <Route path="purchase" element={<Purchase />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
