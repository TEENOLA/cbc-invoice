export default function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="cbc-card p-5 mt-2 cbc-animate">
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--choc-soft)" }}
        >
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: accent + "22" }}
        >
          <Icon size={15} style={{ color: accent }} />
        </div>
      </div>
      <p className="cbc-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
