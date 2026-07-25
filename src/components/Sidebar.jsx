import { X, Cake, LayoutDashboard, FilePlus2, History, Users, BarChart3 } from "lucide-react";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "create", label: "Create Invoice", icon: FilePlus2 },
  { key: "history", label: "Invoice History", icon: History },
  { key: "customers", label: "Customers", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

function SidebarContent({ view, setView, setMobileOpen }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "var(--caramel)" }}
        >
          <Cake size={20} color="#FFFDF9" />
        </div>
        <div>
          <p className="cbc-display font-semibold leading-tight">Cakes b' Caking</p>
          <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
            Bakery &amp; Confectioneries
          </p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setView(item.key);
                setMobileOpen(false);
              }}
              className={`cbc-sidebar-link w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                active ? "active" : ""
              }`}
            >
              <Icon size={17} /> {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-xl" style={{ background: "var(--cream-deep)" }}>
        <p className="text-xs font-semibold mb-1">Need a hand?</p>
        <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
          This is a portfolio demo — all data is mock and stored only in this session.
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({ view, setView, mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 border-r" style={{ borderColor: "var(--line)" }}>
        <SidebarContent view={view} setView={setView} setMobileOpen={setMobileOpen} />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 cbc-root" style={{ background: "var(--cream)" }}>
            <button className="absolute top-5 right-4" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent view={view} setView={setView} setMobileOpen={setMobileOpen} />
          </div>
        </div>
      )}
    </>
  );
}
