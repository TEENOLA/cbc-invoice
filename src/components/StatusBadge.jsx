import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const STATUS_ICON = {
  Draft: FileText,
  Pending: Clock,
  Paid: CheckCircle2,
  Overdue: AlertCircle,
};

const STATUS_CLASS = {
  Draft: "badge-draft",
  Pending: "badge-pending",
  Paid: "badge-paid",
  Overdue: "badge-overdue",
};

export default function StatusBadge({ status }) {
  const Icon = STATUS_ICON[status] || FileText;
  const cls = STATUS_CLASS[status];
  return (
    <span className={`cbc-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${cls}`}>
      <Icon size={12} /> {status}
    </span>
  );
}
