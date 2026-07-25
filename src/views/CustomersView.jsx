import { useState } from "react";
import { X } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { naira, fmtDate } from "../utils/format.js";

export default function CustomersView({ customers, invoices }) {
  const [selected, setSelected] = useState(null);
  const custInvoices = selected ? invoices.filter((i) => i.customerId === selected.id) : [];

  return (
    <div className="p-5 lg:p-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <button key={c.id} onClick={() => setSelected(c)} className="cbc-card p-5 text-left cbc-animate">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold cbc-display"
                style={{ background: "var(--rose)", color: "var(--choc)" }}
              >
                {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs" style={{ color: "var(--choc-soft)" }}>{c.phone}</p>
              </div>
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--choc-soft)" }}>
              <span>{c.totalOrders} orders</span>
              <span>Last: {fmtDate(c.lastOrder)}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setSelected(null)}
        >
          <div className="cbc-card w-full max-w-lg p-6 cbc-animate max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-semibold cbc-display text-lg"
                  style={{ background: "var(--rose)", color: "var(--choc)" }}
                >
                  {selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="cbc-display font-semibold text-lg">{selected.name}</p>
                  <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
                    {selected.phone}{selected.email ? ` · ${selected.email}` : ""}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)}><X size={18} /></button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--cream-deep)" }}>
                <p className="cbc-display font-semibold">{selected.totalOrders}</p>
                <p className="text-[11px]" style={{ color: "var(--choc-soft)" }}>Orders</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--cream-deep)" }}>
                <p className="cbc-display font-semibold text-sm">{naira(selected.totalSpent)}</p>
                <p className="text-[11px]" style={{ color: "var(--choc-soft)" }}>Total Spent</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--cream-deep)" }}>
                <p className="cbc-display font-semibold text-sm">{fmtDate(selected.lastOrder)}</p>
                <p className="text-[11px]" style={{ color: "var(--choc-soft)" }}>Last Order</p>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--choc-soft)" }}>Preferred Products</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {selected.preferred.map((p) => (
                <span key={p} className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--cream-deep)" }}>{p}</span>
              ))}
            </div>

            {selected.notes && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--choc-soft)" }}>Notes</p>
                <p className="text-sm" style={{ color: "var(--choc-soft)" }}>{selected.notes}</p>
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--choc-soft)" }}>Order History</p>
            <div className="space-y-2">
              {custInvoices.length === 0 && <p className="text-sm" style={{ color: "var(--choc-soft)" }}>No invoices on record.</p>}
              {custInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between text-sm border-b py-2" style={{ borderColor: "var(--line)" }}>
                  <span className="cbc-mono text-xs">{inv.invoiceNumber}</span>
                  <span style={{ color: "var(--choc-soft)" }}>{fmtDate(inv.issueDate)}</span>
                  <span className="font-medium">{naira(inv.grandTotal)}</span>
                  <StatusBadge status={inv.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
