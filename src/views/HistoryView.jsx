import { useState } from "react";
import { Search, Eye, Copy, Download, Trash2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { naira, fmtDate, nextInvoiceNumber } from "../utils/format.js";

export default function HistoryView({ invoices, setInvoices, customers, setView, setSelectedInvoiceId, showToast }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const custMap = Object.fromEntries(customers.map((c) => [c.id, c]));

  const filtered = invoices.filter((inv) => {
    const custName = custMap[inv.customerId]?.name || inv.customerNameOverride || "";
    const matchesQuery = (inv.invoiceNumber + custName).toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleDuplicate = (inv) => {
    const copy = { ...inv, id: "I-" + Date.now(), invoiceNumber: nextInvoiceNumber(invoices), status: "Draft", issueDate: new Date().toISOString().slice(0, 10) };
    setInvoices((prev) => [copy, ...prev]);
    showToast(`Duplicated as ${copy.invoiceNumber}`);
  };

  const handleDelete = () => {
    setInvoices((prev) => prev.filter((i) => i.id !== confirmDeleteId));
    showToast("Invoice deleted");
    setConfirmDeleteId(null);
  };

  return (
    <div className="p-5 lg:p-8">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--choc-soft)" }} />
          <input
            className="cbc-input w-full rounded-full pl-10 pr-4 py-2.5 text-sm"
            placeholder="Search by invoice number or customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="cbc-input rounded-full px-4 py-2.5 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {["All", "Draft", "Pending", "Paid", "Overdue"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="cbc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left border-b" style={{ borderColor: "var(--line)", color: "var(--choc-soft)" }}>
                <th className="p-4 font-medium">Invoice</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                  <td className="p-4 cbc-mono">{inv.invoiceNumber}</td>
                  <td className="p-4">{custMap[inv.customerId]?.name || inv.customerNameOverride}</td>
                  <td className="p-4" style={{ color: "var(--choc-soft)" }}>{fmtDate(inv.issueDate)}</td>
                  <td className="p-4 font-medium">{naira(inv.grandTotal)}</td>
                  <td className="p-4"><StatusBadge status={inv.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <button title="View" onClick={() => { setSelectedInvoiceId(inv.id); setView("preview"); }} className="cbc-btn-outline p-2 rounded-lg"><Eye size={14} /></button>
                      <button title="Duplicate" onClick={() => handleDuplicate(inv)} className="cbc-btn-outline p-2 rounded-lg"><Copy size={14} /></button>
                      <button title="Download" onClick={() => { setSelectedInvoiceId(inv.id); setView("preview"); }} className="cbc-btn-outline p-2 rounded-lg"><Download size={14} /></button>
                      <button title="Delete" onClick={() => setConfirmDeleteId(inv.id)} className="cbc-btn-outline p-2 rounded-lg" style={{ color: "var(--rose-deep)" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center" style={{ color: "var(--choc-soft)" }}>No invoices match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete invoice?"
        body="This action can't be undone."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
