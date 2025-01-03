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

const AppRoutes = () => {
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
