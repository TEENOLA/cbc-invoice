import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Toast from "./components/Toast.jsx";
import DashboardView from "./views/DashboardView.jsx";
import CreateInvoiceView from "./views/CreateInvoiceView.jsx";
import InvoicePreviewView from "./views/InvoicePreviewView.jsx";
import HistoryView from "./views/HistoryView.jsx";
import CustomersView from "./views/CustomersView.jsx";
import AnalyticsView from "./views/AnalyticsView.jsx";
import { INVOICES_SEED, CUSTOMERS_SEED } from "./data/mockData.js";

const TITLES = {
  dashboard: ["Dashboard", "Here's how the bakery is doing today"],
  create: ["Create Invoice", "Build a fresh order for a customer"],
  history: ["Invoice History", "Search, filter and manage past invoices"],
  customers: ["Customer Directory", "Everyone who's ordered from us"],
  analytics: ["Analytics", "Revenue and product trends at a glance"],
  preview: ["Invoice Preview", "Ready to print or send"],
};

export default function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [invoices, setInvoices] = useState(INVOICES_SEED);
  const [customers] = useState(CUSTOMERS_SEED);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const custMap = Object.fromEntries(customers.map((c) => [c.id, c]));
  const selectedInvoice =
    invoices.find((i) => i.id === selectedInvoiceId) || null;

  return (
    <div className={`cbc-root ${dark ? "dark" : ""}`}>
      <div className="flex" style={{ minHeight: "100vh" }}>
        <Sidebar
          view={view}
          setView={setView}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <div className="flex-1 min-w-0">
          <Topbar
            title={TITLES[view][0]}
            subtitle={TITLES[view][1]}
            dark={dark}
            setDark={setDark}
            setMobileOpen={setMobileOpen}
          />

          {view === "dashboard" && (
            <DashboardView
              invoices={invoices}
              customers={customers}
              setView={setView}
              setSelectedInvoiceId={setSelectedInvoiceId}
            />
          )}

          {view === "create" && (
            <CreateInvoiceView
              invoices={invoices}
              setInvoices={setInvoices}
              customers={customers}
              setView={setView}
              setSelectedInvoiceId={setSelectedInvoiceId}
              showToast={showToast}
            />
          )}

          {view === "history" && (
            <HistoryView
              invoices={invoices}
              setInvoices={setInvoices}
              customers={customers}
              setView={setView}
              setSelectedInvoiceId={setSelectedInvoiceId}
              showToast={showToast}
            />
          )}

          {view === "customers" && (
            <CustomersView customers={customers} invoices={invoices} />
          )}

          {view === "analytics" && <AnalyticsView invoices={invoices} />}

          {view === "preview" && (
            <InvoicePreviewView
              invoice={selectedInvoice}
              customer={
                selectedInvoice ? custMap[selectedInvoice.customerId] : null
              }
              setView={setView}
            />
          )}
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
