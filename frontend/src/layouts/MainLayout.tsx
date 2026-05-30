import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "250px",
          minHeight: "100vh",
          borderRight: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <h2>Smart Billing</h2>

        <nav>
          <p><Link to="/dashboard">Dashboard</Link></p>
          <p><Link to="/products">Products</Link></p>
          <p><Link to="/purchases">Purchases</Link></p>
          <p><Link to="/inventory">Inventory</Link></p>
          <p><Link to="/invoices">Invoices</Link></p>
          <p><Link to="/billing">Billing</Link></p>
          <p><Link to="/settings">Settings</Link></p>
        </nav>
      </div>

      <div style={{ padding: "20px", flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}