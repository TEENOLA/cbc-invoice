import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SALES_TREND, TOP_PRODUCTS, PIE_COLORS } from "../data/mockData.js";
import { naira } from "../utils/format.js";

export default function AnalyticsView({ invoices }) {
  const statusCounts = useMemo(() => {
    const counts = { Draft: 0, Pending: 0, Paid: 0, Overdue: 0 };
    invoices.forEach((i) => {
      counts[i.status] = (counts[i.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [invoices]);

  return (
    <div className="p-5 lg:p-8 space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SALES_TREND}>
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
              <Bar
                dataKey="revenue"
                fill="var(--caramel, #E2812E)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">
            Invoice Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="cbc-card p-5">
        <h3 className="cbc-display font-semibold mb-4">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis
              type="number"
              stroke="var(--choc-soft)"
              fontSize={12}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--choc-soft)"
              fontSize={12}
              width={110}
            />
            <Tooltip
              formatter={(v) => naira(v)}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 10,
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--rose-deep, #E0487B)"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
