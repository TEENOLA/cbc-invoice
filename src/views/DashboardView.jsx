import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Clock,
  CheckCircle2,
  Wallet,
  ChevronRight,
  FilePlus2,
  Users,
  BarChart3,
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { SALES_TREND, TOP_PRODUCTS, PIE_COLORS } from "../data/mockData.js";
import { naira, fmtDate } from "../utils/format.js";

export default function DashboardView({
  invoices,
  customers,
  setView,
  setSelectedInvoiceId,
}) {
  const total = invoices.length;
  const pending = invoices.filter(
    (i) => i.status === "Pending" || i.status === "Overdue"
  ).length;
  const paid = invoices.filter((i) => i.status === "Paid").length;
  const revenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.grandTotal, 0);

  const custMap = Object.fromEntries(customers.map((c) => [c.id, c]));

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Invoices"
          value={total}
          icon={FileText}
          accent="#E2812E"
        />
        <StatCard
          label="Pending Payments"
          value={pending}
          icon={Clock}
          accent="#EFB93E"
        />
        <StatCard
          label="Paid Invoices"
          value={paid}
          icon={CheckCircle2}
          accent="#5E9E5B"
        />
        <StatCard
          label="Monthly Revenue"
          value={naira(revenue)}
          icon={Wallet}
          accent="#E0487B"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 cbc-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="cbc-display font-semibold">Sales Overview</h3>
            <span className="text-xs" style={{ color: "var(--choc-soft)" }}>
              Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={SALES_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="month" stroke="var(--choc-soft)" fontSize={12} />
              <YAxis
                stroke="var(--choc-soft)"
                fontSize={12}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                formatter={(v) => naira(v)}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--caramel, #B8763E)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">Popular Products</h3>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-sm flex-1">{p.name}</span>
                <span
                  className="cbc-mono text-xs"
                  style={{ color: "var(--choc-soft)" }}
                >
                  {naira(p.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cbc-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="cbc-display font-semibold">Recent Invoices</h3>
          <button
            onClick={() => setView("history")}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: "var(--caramel)" }}
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--choc-soft)" }}>
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t cursor-pointer"
                  style={{ borderColor: "var(--line)" }}
                  onClick={() => {
                    setSelectedInvoiceId(inv.id);
                    setView("preview");
                  }}
                >
                  <td className="py-3 cbc-mono">{inv.invoiceNumber}</td>
                  <td className="py-3">{custMap[inv.customerId]?.name}</td>
                  <td className="py-3" style={{ color: "var(--choc-soft)" }}>
                    {fmtDate(inv.issueDate)}
                  </td>
                  <td className="py-3 font-medium">{naira(inv.grandTotal)}</td>
                  <td className="py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => setView("create")}
          className="cbc-btn-primary rounded-2xl p-5 text-left"
        >
          <FilePlus2 size={20} className="mb-3" />
          <p className="font-semibold">Create Invoice</p>
          <p className="text-xs opacity-80 mt-1">Start a new order</p>
        </button>
        <button
          onClick={() => setView("customers")}
          className="cbc-card p-5 text-left"
        >
          <Users
            size={20}
            className="mb-3"
            style={{ color: "var(--caramel)" }}
          />
          <p className="font-semibold">Customer Directory</p>
          <p className="text-xs mt-1" style={{ color: "var(--choc-soft)" }}>
            {customers.length} customers on file
          </p>
        </button>
        <button
          onClick={() => setView("analytics")}
          className="cbc-card p-5 text-left"
        >
          <BarChart3
            size={20}
            className="mb-3"
            style={{ color: "var(--caramel)" }}
          />
          <p className="font-semibold">View Analytics</p>
          <p className="text-xs mt-1" style={{ color: "var(--choc-soft)" }}>
            Revenue &amp; product trends
          </p>
        </button>
      </div>
    </div>
  );
}
