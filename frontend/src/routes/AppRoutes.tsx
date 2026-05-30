import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Purchases from "../pages/Purchases";
import Inventory from "../pages/Inventory";
import Invoices from "../pages/Invoices";
import Settings from "../pages/Settings";
import Billing from "../pages/Billing";
import InvoicePreview from "../pages/InvoicePreview";
import Customers from "../pages/Customers";
import Categories from "../pages/Categories";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoices/:id" element={<InvoicePreview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
